"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import StatusBar from "@/components/StatusBar";

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [startPage, setStartPage] = useState("1");
  const [endPage, setEndPage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const split = async () => {
    if (!file) return;
    setStatus("loading");
    setMessage("Extrayendo páginas con Adobe PDF Services...");
    setDownloadUrl("");

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("startPage", startPage);
      if (endPage) form.append("endPage", endPage);

      const res = await fetch("/api/pdf/split", { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      setStatus("success");
      setMessage("¡Páginas extraídas correctamente!");
    } catch (err: unknown) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Error al dividir el archivo",
      );
    }
  };

  return (
    <div>
      <FileDropzone
        accept=".pdf"
        hint="Selecciona el PDF del que quieres extraer páginas"
        onFiles={(files) => {
          setFile(files[0]);
          setStatus("idle");
        }}
      />

      {file && (
        <>
          <div className="file-list" style={{ marginTop: 24 }}>
            <div className="file-item">
              <span className="file-item-icon">📑</span>
              <div className="file-item-info">
                <div className="file-item-name">{file.name}</div>
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

          <div className="range-input-group">
            <div className="input-field">
              <label>Página inicio</label>
              <input
                type="number"
                min="1"
                value={startPage}
                onChange={(e) => setStartPage(e.target.value)}
                placeholder="1"
              />
            </div>
            <div className="input-field">
              <label>Página fin</label>
              <input
                type="number"
                min="1"
                value={endPage}
                onChange={(e) => setEndPage(e.target.value)}
                placeholder="última"
              />
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--muted)",
                fontFamily: "var(--font-mono)",
                paddingBottom: 4,
              }}
            >
              Deja "Página fin" vacío para extraer hasta el final
            </p>
          </div>
        </>
      )}

      <div className="action-row">
        <button
          className="btn-primary"
          onClick={split}
          disabled={!file || status === "loading"}
        >
          {status === "loading" ? (
            <>
              <div
                className="spinner"
                style={{ width: 14, height: 14, borderWidth: 2 }}
              />
              Extrayendo...
            </>
          ) : (
            "⊘ Extraer páginas"
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
        downloadName="extracted.pdf"
      />
    </div>
  );
}
