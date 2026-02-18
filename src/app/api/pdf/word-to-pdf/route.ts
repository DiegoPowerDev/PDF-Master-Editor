import { NextRequest, NextResponse } from "next/server";
import {
  MimeType,
  CreatePDFJob,
  CreatePDFResult,
} from "@adobe/pdfservices-node-sdk";
import { createPDFServices, bufferToStream, streamToBuffer } from "@/lib/adobe";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file)
      return NextResponse.json(
        { error: "No se encontró el archivo" },
        { status: 400 },
      );

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfServices = createPDFServices();

    const mimeType = file.name.endsWith(".docx") ? MimeType.DOCX : MimeType.DOC;
    const inputAsset = await pdfServices.upload({
      readStream: bufferToStream(buffer),
      mimeType,
    });

    const job = new CreatePDFJob({ inputAsset });
    const pollingURL = await pdfServices.submit({ job });
    const result = await pdfServices.getJobResult({
      pollingURL,
      resultType: CreatePDFResult,
    });

    const streamAsset = await pdfServices.getContent({
      asset: result.result!.asset,
    });
    const outputBuffer = await streamToBuffer(streamAsset.readStream);

    return new NextResponse(new Uint8Array(outputBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.docx?$/, ".pdf")}"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error al convertir el archivo" },
      { status: 500 },
    );
  }
}
