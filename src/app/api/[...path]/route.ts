/**
 * Next.js catch-all proxy → Express backend
 * Forwards all other /api/* requests to http://localhost:4000/api/*
 */
import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:4000";

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const url = `${BACKEND}/api/${path.join("/")}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const authHeader = req.headers.get("Authorization");
  if (authHeader) headers["Authorization"] = authHeader;
  const originHeader = req.headers.get("origin");
  if (originHeader) headers["Origin"] = originHeader;
  const refererHeader = req.headers.get("referer");
  if (refererHeader) headers["Referer"] = refererHeader;

  const body = req.method !== "GET" && req.method !== "HEAD"
    ? await req.text()
    : undefined;

  const upstream = await fetch(url, {
    method: req.method,
    headers,
    body,
  });

  const data = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
