"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import StatusBar from "@/components/StatusBar";

export default function WordToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const convert = async () => {
    if (!file) return;
    setStatus("loading");
    setMessage("Convirtiendo documento con Adobe PDF Services...");
    setDownloadUrl("");

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/pdf/word-to-pdf", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("success");
      setMessage("¡Conversión completada exitosamente!");
    } catch (err: unknown) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Error al convertir el archivo",
      );
    }
  };

  return (
    <div>
      <FileDropzone
        accept=".docx,.doc"
        hint="Acepta archivos .docx y .doc — máx. 100MB"
        onFiles={(files) => {
          setFile(files[0]);
          setStatus("idle");
        }}
      />

      {file && (
        <div className="file-list">
          <div className="file-item">
            <span className="file-item-icon">📄</span>
            <div className="file-item-info">
              <div className="file-item-name">{file.name}</div>
              <div className="file-item-size">{formatSize(file.size)}</div>
            </div>
            <button
              className="file-item-remove"
              onClick={() => {
                setFile(null);
                setStatus("idle");
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="action-row">
        <button
          className="btn-primary"
          onClick={convert}
          disabled={!file || status === "loading"}
        >
          {status === "loading" ? (
            <>
              <div
                className="spinner"
                style={{ width: 14, height: 14, borderWidth: 2 }}
              />
              Convirtiendo...
            </>
          ) : (
            "⬇ Convertir a PDF"
          )}
        </button>
        {file && (
          <button
            className="btn-secondary"
            onClick={() => {
              setFile(null);
              setStatus("idle");
            }}
          >
            Limpiar
          </button>
        )}
      </div>

      <StatusBar
        status={status}
        message={message}
        downloadUrl={downloadUrl}
        downloadName={file?.name.replace(/\.docx?$/, ".pdf")}
      />
    </div>
  );
}
