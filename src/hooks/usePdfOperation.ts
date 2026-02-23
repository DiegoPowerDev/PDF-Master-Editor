"use client";

import { useState } from "react";

type Step =
  | ""
  | "Preparando archivo..."
  | "Convirtiendo..."
  | "Preparando descarga..."
  | "¡Listo! Tu archivo está disponible para descargar por 5 minutos."
  | "Error desconocido"
  | "Un archivo seleccionado se encuentra dañado o no es un PDF válido.";

export function usePdfOperation(operation: string) {
  const [status, setStatus] = useState<string>("idle");

  const [message, setMessage] = useState<Step>("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [outputKey, setOutputKey] = useState("");
  const run = async (files: File[], options?: Record<string, unknown>) => {
    try {
      setDownloadUrl("");
      setStatus("loading");

      // Paso 1: pedir URLs firmadas de subida a R2
      setMessage("Preparando archivo...");
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
      setMessage(`Convirtiendo...`);
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
      console.log(data);
      // Paso 4: URL firmada de descarga desde R2
      setOutputKey(data.outputKey);
      setDownloadUrl(data.downloadUrl);
      setStatus("success");
      setMessage(
        "¡Listo! Tu archivo está disponible para descargar por 5 minutos.",
      );
    } catch (err) {
      console.error("[usePdfOperation] error:", err);
      setStatus("error");
      setMessage(
        "Un archivo seleccionado se encuentra dañado o no es un PDF válido.",
      );
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
  const downloadAs = async (filename: string) => {
    if (!downloadUrl) return;
    try {
      const res = await fetch(downloadUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Error al descargar:", err);
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

  return {
    run,
    reset,
    status,
    statusBarStatus,
    statusBarMessage,
    downloadUrl,
    downloadAs,
  };
}
