import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { AppError } from "../lib/AppError";
import { env } from "../config/env";

const router = Router();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY ?? "";

// Plan → amount map (in kobo: 1 NGN = 100 kobo)
const PLANS: Record<string, { amount: number; label: string }> = {
  free:   { amount: 0,       label: "StudyPilot Free" },
  pro:    { amount: 150000,  label: "StudyPilot Pro" },   // ₦1,500/month
  school: { amount: 2500000, label: "StudyPilot School" }, // ₦25,000/month
};

const initSchema = z.object({
  plan:  z.enum(["free", "pro", "school"]),
  email: z.string().email(),
});

/**
 * POST /api/payment/initialize
 * Initializes a Paystack transaction and returns the authorization URL.
 */
router.post("/initialize", requireAuth, validate({ body: initSchema }), async (req, res, next) => {
  try {
    const { plan, email } = req.body as { plan: string; email: string };
    const selected = PLANS[plan];

    if (!selected) throw AppError.badRequest("Invalid plan selected.");

    if (plan === "free") {
      return res.json({ success: true, data: { authorizationUrl: null, reference: "free", plan: "free" } });
    }

    if (!PAYSTACK_SECRET) {
      throw AppError.internal("Payment is not configured on this server (missing PAYSTACK_SECRET_KEY).");
    }

    const reference = `SP-${Date.now()}-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;

    const psRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: selected.amount,
        reference,
        currency: "NGN",
        metadata: {
          plan,
          userId: req.user!.userId,
          custom_fields: [
            { display_name: "Plan", variable_name: "plan", value: selected.label },
          ],
        },
        callback_url: `${req.get("origin") ?? env.FRONTEND_URL}/payment/callback`,
      }),
    });

    if (!psRes.ok) {
      const err = await psRes.json().catch(() => ({})) as { message?: string };
      throw AppError.internal(`Paystack error: ${err?.message ?? "Unknown error"}`);
    }

    const psData = await psRes.json() as { data: { authorization_url: string; reference: string } };

    return res.json({
      success: true,
      data: {
        authorizationUrl: psData.data.authorization_url,
        reference: psData.data.reference,
        plan,
      },
    });
  } catch (err) {
    next(err);
  }
});

const verifySchema = z.object({ reference: z.string().min(1) });

/**
 * POST /api/payment/verify
 * Verifies a Paystack transaction by reference and updates user plan.
 */
router.post("/verify", requireAuth, validate({ body: verifySchema }), async (req, res, next) => {
  try {
    const { reference } = req.body as { reference: string };

    if (reference === "free") {
      return res.json({ success: true, data: { status: "success", plan: "free" } });
    }

    if (!PAYSTACK_SECRET) {
      throw AppError.internal("Payment not configured (missing PAYSTACK_SECRET_KEY).");
    }

    const psRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    });

    if (!psRes.ok) {
      throw AppError.internal("Paystack verification failed.");
    }

    const psData = await psRes.json() as {
      data: { status: string; metadata: { plan: string } };
    };

    const { status, metadata } = psData.data;

    if (status !== "success") {
      return res.json({ success: false, error: "Payment not completed yet." });
    }

    // TODO: persist plan upgrade to DB via user repository
    // await updateUserPlan(req.user!.userId, metadata.plan);

    return res.json({
      success: true,
      data: { status: "success", plan: metadata?.plan ?? "pro" },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
