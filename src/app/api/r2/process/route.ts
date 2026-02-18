export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import {
  downloadFromR2,
  uploadToR2,
  deleteFromR2,
  generateKey,
  getDownloadPresignedUrl,
} from "@/lib/r2";
import { createPDFServices, bufferToStream } from "@/lib/adobe";
import {
  MimeType,
  CreatePDFJob,
  CreatePDFResult,
  CombinePDFJob,
  CombinePDFParams,
  CombinePDFResult,
  ExportPDFJob,
  ExportPDFParams,
  ExportPDFResult,
  ExportPDFTargetFormat,
  SplitPDFJob,
  SplitPDFParams,
  SplitPDFResult,
  PageRanges,
} from "@adobe/pdfservices-node-sdk";

const EXT_MIME: Record<string, MimeType> = {
  pdf: MimeType.PDF,
  docx: MimeType.DOCX,
  doc: MimeType.DOC,
  jpg: MimeType.JPEG,
  jpeg: MimeType.JPEG,
  png: MimeType.PNG,
};

export async function POST(req: NextRequest) {
  const inputKeys: string[] = [];
  let outputKey = "";

  try {
    const { operation, keys, originalNames, options } = await req.json();

    if (!keys?.length) {
      return NextResponse.json(
        { error: "No se enviaron keys de R2" },
        { status: 400 },
      );
    }

    const pdfServices = createPDFServices();

    // 1. Descargar de R2 y subir a Adobe
    const inputAssets = await Promise.all(
      keys.map(async (key: string, i: number) => {
        inputKeys.push(key);
        const buffer = await downloadFromR2(key);
        const ext =
          (originalNames[i] ?? key).split(".").pop()?.toLowerCase() ?? "pdf";
        return pdfServices.upload({
          readStream: bufferToStream(buffer),
          mimeType: EXT_MIME[ext] ?? MimeType.PDF,
        });
      }),
    );

    // 2. Ejecutar job en Adobe
    let pollingURL: string;
    switch (operation) {
      case "word-to-pdf":
      case "image-to-pdf": {
        pollingURL = await pdfServices.submit({
          job: new CreatePDFJob({ inputAsset: inputAssets[0] }),
        });
        break;
      }
      case "pdf-to-word": {
        const params = new ExportPDFParams({
          targetFormat: ExportPDFTargetFormat.DOCX,
        });
        pollingURL = await pdfServices.submit({
          job: new ExportPDFJob({ inputAsset: inputAssets[0], params }),
        });
        break;
      }
      case "merge": {
        const params = new CombinePDFParams();
        inputAssets.forEach((a) => params.addAsset(a));
        pollingURL = await pdfServices.submit({
          job: new CombinePDFJob({ params }),
        });
        break;
      }
      case "split": {
        const pageRanges = new PageRanges();
        const start = options?.startPage ?? 1;
        const end = options?.endPage;
        end ? pageRanges.addRange(start, end) : pageRanges.addAllFrom(start);
        const params = new SplitPDFParams({ pageRanges });
        pollingURL = await pdfServices.submit({
          job: new SplitPDFJob({ inputAsset: inputAssets[0], params }),
        });
        break;
      }
      default:
        return NextResponse.json(
          { error: "Operacion no soportada" },
          { status: 400 },
        );
    }

    // 3. Obtener resultado de Adobe
    let resultAsset: any;
    if (operation === "word-to-pdf" || operation === "image-to-pdf") {
      resultAsset = (
        await pdfServices.getJobResult({
          pollingURL,
          resultType: CreatePDFResult,
        })
      ).result!.asset;
    } else if (operation === "pdf-to-word") {
      resultAsset = (
        await pdfServices.getJobResult({
          pollingURL,
          resultType: ExportPDFResult,
        })
      ).result!.asset;
    } else if (operation === "merge") {
      resultAsset = (
        await pdfServices.getJobResult({
          pollingURL,
          resultType: CombinePDFResult,
        })
      ).result!.asset;
    } else {
      resultAsset = (
        (
          await pdfServices.getJobResult({
            pollingURL,
            resultType: SplitPDFResult,
          })
        ).result! as any
      ).assets[0];
    }

    const { readStream } = await pdfServices.getContent({ asset: resultAsset });

    // 4. Subir resultado a R2
    const outputExt = operation === "pdf-to-word" ? "docx" : "pdf";
    const outputName = `output.${outputExt}`;
    outputKey = generateKey(outputName, "outputs");
    const outputContentType =
      outputExt === "docx"
        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : "application/pdf";
    await uploadToR2(outputKey, readStream as any, outputContentType);

    // 5. URL firmada de descarga para el cliente (5 min)
    const downloadUrl = await getDownloadPresignedUrl(outputKey, outputName);

    // 6. Limpiar inputs de R2
    await Promise.allSettled(inputKeys.map(deleteFromR2));

    return NextResponse.json({ downloadUrl, outputKey });
  } catch (err: any) {
    if (outputKey) await deleteFromR2(outputKey).catch(() => {});
    console.error("[r2/process]", err);
    return NextResponse.json(
      { error: err.message || "Error procesando" },
      { status: 500 },
    );
  }
}
