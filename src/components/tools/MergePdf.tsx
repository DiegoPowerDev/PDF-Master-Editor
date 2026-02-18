"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import StatusBar from "@/components/StatusBar";
import { usePdfOperation } from "@/hooks/usePdfOperation";

export default function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const { run, reset, statusBarStatus, statusBarMessage, downloadUrl } =
    usePdfOperation("merge");

  const formatSize = (b: number) => `${(b / 1024).toFixed(1)} KB`;

  const addFiles = (newFiles: File[]) => {
    setFiles((p) => [...p, ...newFiles]);
    reset();
  };
  const removeFile = (i: number) =>
    setFiles((p) => p.filter((_, idx) => idx !== i));

  return (
    <div>
      <FileDropzone
        accept=".pdf"
        multiple
        hint="Selecciona múltiples PDFs"
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
          onClick={() => run(files)}
          disabled={files.length < 2 || statusBarStatus === "loading"}
        >
          {statusBarStatus === "loading" ? (
            <>
              <div
                className="spinner"
                style={{ width: 14, height: 14, borderWidth: 2 }}
              />
              {statusBarMessage}
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
              reset();
            }}
          >
            Limpiar todo
          </button>
        )}
      </div>

      {files.length === 1 && (
        <p
          style={{
            fontSize: 12,
            color: "var(--muted)",
            marginTop: 12,
            fontFamily: "var(--font-mono)",
          }}
        >
          Añade al menos 2 PDFs.
        </p>
      )}

      <StatusBar
        status={statusBarStatus}
        message={statusBarMessage}
        downloadUrl={downloadUrl}
        downloadName="merged.pdf"
      />
    </div>
  );
}
