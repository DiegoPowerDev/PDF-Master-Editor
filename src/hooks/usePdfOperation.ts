"use client";

import { useState } from "react";

type Step =
  | ""
  | "Subiendo a R2..."
  | "Procesando con Adobe..."
  | "Guardando resultado..."
  | "Listo";

export function usePdfOperation(operation: string) {
  const [status, setStatus] = useState<string>("idle");

  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [outputKey, setOutputKey] = useState("");
  const run = async (files: File[], options?: Record<string, unknown>) => {
    try {
      setDownloadUrl("");
      setStatus("loading");

      // Paso 1: pedir URLs firmadas de subida a R2
      setMessage("Preparando subida...");
      const presigns = await Promise.all(
        files.map((f) =>
          fetch("/api/r2/presign-upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: f.name }),
          }).then(async (r) => {
            const data = await r.json();
            if (data.error) throw new Error("Presign error: " + data.error);
            console.log("[r2] uploadUrl generada:", data.uploadUrl);
            return data as { uploadUrl: string; key: string };
          }),
        ),
      );

      // Paso 2: subir DIRECTO a R2 desde el cliente
      setMessage(
        `Subiendo ${files.length > 1 ? files.length + " archivos" : '"' + files[0].name + '"'} a R2...`,
      );
      await Promise.all(
        files.map((file, i) => {
          console.log("[r2] PUT a:", presigns[i].uploadUrl);
          return fetch(presigns[i].uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": file.type || "application/octet-stream",
            },
            body: file,
          }).then((res) => {
            if (!res.ok)
              throw new Error(
                `Upload a R2 falló: ${res.status} ${res.statusText}`,
              );
          });
        }),
      );

      // Paso 3: Vercel procesa con Adobe
      setMessage("Procesando con Adobe PDF Services...");
      const res = await fetch("/api/r2/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation,
          keys: presigns.map((p) => p.key),
          originalNames: files.map((f) => f.name),
          options,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error)
        throw new Error(data.error || "Error desconocido");

      // Paso 4: URL firmada de descarga desde R2
      setOutputKey(data.outputKey);
      setDownloadUrl(data.downloadUrl);
      setStatus("success");
      setMessage("¡Listo! Tu archivo está disponible por 5 minutos.");
    } catch (err) {
      console.error("[usePdfOperation] error:", err);
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  const cleanup = async () => {
    if (outputKey) {
      await fetch("/api/r2/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: outputKey }),
      }).catch(() => {});
    }
  };

  const reset = () => {
    setStatus("idle");
    setMessage("");
    setDownloadUrl("");
    setOutputKey("");
  };

  const statusBarStatus =
    status === "uploading" || status === "processing" ? "loading" : status;
  const statusBarMessage =
    status === "uploading" || status === "processing"
      ? message
      : status === "success"
        ? message
        : message;

  return { run, reset, status, statusBarStatus, statusBarMessage, downloadUrl };
}
