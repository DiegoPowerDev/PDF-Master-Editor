import { NextRequest, NextResponse } from "next/server";
import {
  MimeType,
  CombinePDFJob,
  CombinePDFResult,
  CombinePDFParams,
} from "@adobe/pdfservices-node-sdk";
import { createPDFServices, bufferToStream, streamToBuffer } from "@/lib/adobe";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    if (files.length < 2)
      return NextResponse.json(
        { error: "Se necesitan al menos 2 PDFs" },
        { status: 400 },
      );

    const pdfServices = createPDFServices();

    // Upload all files in parallel
    const inputAssets = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return pdfServices.upload({
          readStream: bufferToStream(buffer),
          mimeType: MimeType.PDF,
        });
      }),
    );
    const params = new CombinePDFParams();
    inputAssets.forEach((asset) => {
      params.addAsset(asset);
    });
    const job = new CombinePDFJob({ params });
    const pollingURL = await pdfServices.submit({ job });
    const result = await pdfServices.getJobResult({
      pollingURL,
      resultType: CombinePDFResult,
    });

    const streamAsset = await pdfServices.getContent({
      asset: result.result!.asset,
    });
    const outputBuffer = await streamToBuffer(streamAsset.readStream);

    return new NextResponse(outputBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error al unir los archivos" },
      { status: 500 },
    );
  }
}
