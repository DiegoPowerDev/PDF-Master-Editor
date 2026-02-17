"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import StatusBar from "@/components/StatusBar";

export default function ImageToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleFile = (files: File[]) => {
    const f = files[0];
    setFile(f);
    setStatus("idle");
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const convert = async () => {
    if (!file) return;
    setStatus("loading");
    setMessage("Convirtiendo imagen a PDF con Adobe PDF Services...");
    setDownloadUrl("");

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/pdf/image-to-pdf", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      setStatus("success");
      setMessage("¡Imagen convertida a PDF exitosamente!");
    } catch (err: unknown) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Error al convertir la imagen",
      );
    }
  };

  return (
    <div>
      {!file ? (
        <FileDropzone
          accept=".jpg,.jpeg,.png"
          hint="Acepta archivos JPG y PNG — máx. 100MB"
          onFiles={handleFile}
        />
      ) : (
        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "flex-start",
            marginTop: 8,
          }}
        >
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: 180,
                height: 220,
                objectFit: "cover",
                borderRadius: 10,
                border: "1px solid var(--border)",
                flexShrink: 0,
              }}
            />
          )}
          <div style={{ flex: 1 }}>
            <div className="file-list">
              <div className="file-item">
                <span className="file-item-icon">🖼</span>
                <div className="file-item-info">
                  <div className="file-item-name">{file.name}</div>
                  <div className="file-item-size">{file.type}</div>
                </div>
                <button
                  className="file-item-remove"
                  onClick={() => {
                    setFile(null);
                    setPreview("");
                    setStatus("idle");
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
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
            "◈ Convertir a PDF"
          )}
        </button>
        {file && (
          <button
            className="btn-secondary"
            onClick={() => {
              setFile(null);
              setPreview("");
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
        downloadName={file?.name.replace(/\.(jpg|jpeg|png)$/i, ".pdf")}
      />
    </div>
  );
}
