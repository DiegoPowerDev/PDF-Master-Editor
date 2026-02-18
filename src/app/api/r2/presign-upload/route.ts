import { NextRequest, NextResponse } from "next/server";
import { getUploadPresignedUrl, generateKey } from "@/lib/r2";

const CONTENT_TYPE_MAP: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

export async function POST(req: NextRequest) {
  try {
    const { filename } = await req.json();
    const ext = filename.split(".").pop()?.toLowerCase() ?? "bin";
    const contentType = CONTENT_TYPE_MAP[ext] ?? "application/octet-stream";
    const key = generateKey(filename);
    const uploadUrl = await getUploadPresignedUrl(key, contentType);
    return NextResponse.json({ uploadUrl, key });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
