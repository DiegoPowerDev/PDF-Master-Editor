import { NextRequest, NextResponse } from "next/server";
import {
  MimeType,
  SplitPDFJob,
  SplitPDFParams,
  SplitPDFResult,
  PageRanges,
} from "@adobe/pdfservices-node-sdk";
import { createPDFServices, bufferToStream, streamToBuffer } from "@/lib/adobe";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const startPage = parseInt(formData.get("startPage") as string) || 1;
    const endPageRaw = formData.get("endPage") as string;

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

    const pageRanges = new PageRanges();
    if (endPageRaw) {
      pageRanges.addRange(startPage, parseInt(endPageRaw));
    } else {
      pageRanges.addAllFrom(startPage);
    }

    const params = new SplitPDFParams({ pageRanges });
    const job = new SplitPDFJob({ inputAsset, params });

    const pollingURL = await pdfServices.submit({ job });
    const result = await pdfServices.getJobResult({
      pollingURL,
      resultType: SplitPDFResult,
    });

    // SplitPDF returns an array of assets; take the first one
    const assets = result.result!.assets || [];
    if (assets.length === 0) {
      throw new Error("No se generaron assets de salida");
    }
    const streamAsset = await pdfServices.getContent({ asset: assets[0] });
    const outputBuffer = await streamToBuffer(streamAsset.readStream);

    return new NextResponse(new Uint8Array(outputBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="extracted.pdf"',
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error al dividir el archivo" },
      { status: 500 },
    );
  }
}
