"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import StatusBar from "@/components/StatusBar";
import { usePdfOperation } from "@/hooks/usePdfOperation";

export default function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const { run, reset, statusBarStatus, statusBarMessage, downloadUrl } =
    usePdfOperation("pdf-to-word");

  const formatSize = (b: number) =>
    b < 1048576
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / 1048576).toFixed(1)} MB`;

  return (
    <div>
      <FileDropzone
        accept=".pdf"
        hint="Acepta .pdf — sube directo a Adobe, sin límite de Vercel"
        onFiles={(files) => {
          setFile(files[0]);
          reset();
        }}
      />

      {file && (
        <div className="file-list">
          <div className="file-item">
            <span className="file-item-icon">📑</span>
            <div className="file-item-info">
              <div className="file-item-name">{file.name}</div>
              <div className="file-item-size">{formatSize(file.size)}</div>
            </div>
            <button
              className="file-item-remove"
              onClick={() => {
                setFile(null);
                reset();
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
          onClick={() => file && run([file])}
          disabled={!file || statusBarStatus === "loading"}
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
            "⬆ Exportar a Word"
          )}
        </button>
        {file && (
          <button
            className="btn-secondary"
            onClick={() => {
              setFile(null);
              reset();
            }}
          >
            Limpiar
          </button>
        )}
      </div>

      <StatusBar
        status={statusBarStatus}
        message={statusBarMessage}
        downloadUrl={downloadUrl}
        downloadName={file?.name.replace(".pdf", ".docx")}
      />
    </div>
  );
}
