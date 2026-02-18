import { NextRequest, NextResponse } from "next/server";
import { deleteFromR2 } from "@/lib/r2";

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();
    if (key) await deleteFromR2(key);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
