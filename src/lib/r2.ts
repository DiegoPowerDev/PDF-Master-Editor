import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ChecksumAlgorithm,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

const BUCKET = process.env.R2_BUCKET_NAME!;
export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  // Deshabilitar checksums automáticos — R2 no los soporta en presigned URLs
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

export async function uploadToR2(
  key: string,
  body: Buffer | Readable,
  contentType: string,
) {
  if (Buffer.isBuffer(body)) {
    // Buffer: tamaño conocido, PutObject simple
    await r2.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
        ContentLength: body.byteLength,
      }),
    );
  } else {
    // Stream: longitud desconocida → usar Upload (multipart automático)
    const upload = new Upload({
      client: r2,
      params: {
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
      },
    });
    await upload.done();
  }
  return key;
}

export async function downloadFromR2(key: string): Promise<Buffer> {
  const res = await r2.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  const stream = res.Body as Readable;
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export async function deleteFromR2(key: string) {
  await r2
    .send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
    .catch(() => {});
}

export async function getUploadPresignedUrl(
  key: string,
  contentType: string,
  expiresIn = 300,
) {
  return getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn },
  );
}

export async function getDownloadPresignedUrl(
  key: string,
  filename: string,
  expiresIn = 300,
) {
  return getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${filename}"`,
    }),
    { expiresIn },
  );
}

export function generateKey(filename: string, prefix = "uploads") {
  const id = crypto.randomUUID();
  const ext = filename.split(".").pop();
  return `${prefix}/${id}.${ext}`;
}
