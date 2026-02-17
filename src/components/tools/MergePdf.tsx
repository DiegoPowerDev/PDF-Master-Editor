"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import StatusBar from "@/components/StatusBar";

export default function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;

  const addFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setStatus("idle");
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const merge = async () => {
    if (files.length < 2) return;
    setStatus("loading");
    setMessage(`Uniendo ${files.length} PDFs con Adobe PDF Services...`);
    setDownloadUrl("");

    try {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));

      const res = await fetch("/api/pdf/merge", { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      setStatus("success");
      setMessage(`¡${files.length} PDFs unidos correctamente!`);
    } catch (err: unknown) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Error al unir los archivos",
      );
    }
  };

  return (
    <div>
      <FileDropzone
        accept=".pdf"
        multiple
        hint="Selecciona múltiples PDFs — se unirán en el orden de la lista"
        onFiles={addFiles}
      />

      {files.length > 0 && (
        <div className="file-list">
          {files.map((f, i) => (
            <div className="file-item" key={i}>
              <span
                className="file-item-icon"
                style={{
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: "var(--muted)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="file-item-info">
                <div className="file-item-name">{f.name}</div>
                <div className="file-item-size">{formatSize(f.size)}</div>
              </div>
              <button
                className="file-item-remove"
                onClick={() => removeFile(i)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="action-row">
        <button
          className="btn-primary"
          onClick={merge}
          disabled={files.length < 2 || status === "loading"}
        >
          {status === "loading" ? (
            <>
              <div
                className="spinner"
                style={{ width: 14, height: 14, borderWidth: 2 }}
              />
              Uniendo...
            </>
          ) : (
            `⊕ Unir ${files.length} PDFs`
          )}
        </button>
        {files.length > 0 && (
          <button
            className="btn-secondary"
            onClick={() => {
              setFiles([]);
              setStatus("idle");
            }}
          >
            Limpiar todo
          </button>
        )}
      </div>

      {files.length < 2 && files.length > 0 && (
        <p
          style={{
            fontSize: 12,
            color: "var(--muted)",
            marginTop: 12,
            fontFamily: "var(--font-mono)",
          }}
        >
          Añade al menos 2 PDFs para poder unirlos.
        </p>
      )}

      <StatusBar
        status={status}
        message={message}
        downloadUrl={downloadUrl}
        downloadName="merged.pdf"
      />
    </div>
  );
}
