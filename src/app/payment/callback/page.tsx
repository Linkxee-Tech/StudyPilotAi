"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { apiClient } from "@/lib/api";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const trxref = searchParams.get("trxref") || searchParams.get("reference");
    if (!trxref) {
      setStatus("error");
      setErrorMsg("No transaction reference found.");
      return;
    }

    apiClient.post<{ status: string; plan: string }>("/payment/verify", { reference: trxref })
      .then((res) => {
        if (res.success && res.data) {
          setStatus("success");
          setTimeout(() => {
            router.push("/student?payment=success");
          }, 3000);
        } else {
          setStatus("error");
          setErrorMsg(typeof res.error === "string" ? res.error : res.error?.message || "Payment verification failed.");
        }
      })
      .catch((err) => {
        setStatus("error");
        setErrorMsg(err.message || "An error occurred during verification.");
      });
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
            <h1 className="font-display text-xl font-bold text-slate-900">Verifying Payment...</h1>
            <p className="font-body text-sm text-slate-500">Please do not close this page.</p>
          </div>
        )}
        {status === "success" && (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-emerald-500" />
            <h1 className="font-display text-xl font-bold text-slate-900">Payment Successful!</h1>
            <p className="font-body text-sm text-slate-500">Your account has been upgraded. Redirecting you to your dashboard...</p>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-12 w-12 text-rose-500" />
            <h1 className="font-display text-xl font-bold text-slate-900">Payment Failed</h1>
            <p className="font-body text-sm text-slate-500">{errorMsg}</p>
            <button
              onClick={() => router.push("/student")}
              className="mt-4 rounded-full bg-slate-900 px-6 py-2.5 font-body text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>}>
      <CallbackContent />
    </Suspense>
  );
}
