import {
  ServicePrincipalCredentials,
  PDFServices,
} from "@adobe/pdfservices-node-sdk";
import { Readable } from "stream";
export function bufferToStream(buffer: Buffer): Readable {
  return Readable.from(buffer);
}
export function createPDFServices(): PDFServices {
  const credentials = new ServicePrincipalCredentials({
    clientId: process.env.ADOBE_CLIENT_ID!,
    clientSecret: process.env.ADOBE_CLIENT_SECRET!,
  });
  return new PDFServices({ credentials });
}

export async function streamToBuffer(
  stream: NodeJS.ReadableStream,
): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}
