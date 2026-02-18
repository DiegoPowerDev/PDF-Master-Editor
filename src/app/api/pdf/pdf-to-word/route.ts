import { NextRequest, NextResponse } from "next/server";
import {
  MimeType,
  ExportPDFJob,
  ExportPDFResult,
  ExportPDFTargetFormat,
  ExportPDFParams,
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

    const inputAsset = await pdfServices.upload({
      readStream: bufferToStream(buffer),
      mimeType: MimeType.PDF,
    });

    const params = new ExportPDFParams({
      targetFormat: ExportPDFTargetFormat.DOCX,
    });
    const job = new ExportPDFJob({ inputAsset, params });

    const pollingURL = await pdfServices.submit({ job });
    const result = await pdfServices.getJobResult({
      pollingURL,
      resultType: ExportPDFResult,
    });

    const streamAsset = await pdfServices.getContent({
      asset: result.result!.asset,
    });
    const outputBuffer = await streamToBuffer(streamAsset.readStream);

    return new NextResponse(new Uint8Array(outputBuffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${file.name.replace(".pdf", ".docx")}"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error al exportar el archivo" },
      { status: 500 },
    );
  }
}
