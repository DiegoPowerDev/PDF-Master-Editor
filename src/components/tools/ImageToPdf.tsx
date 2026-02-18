"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import StatusBar from "@/components/StatusBar";
import { usePdfOperation } from "@/hooks/usePdfOperation";

export default function ImageToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const { run, reset, statusBarStatus, statusBarMessage, downloadUrl } =
    usePdfOperation("image-to-pdf");

  const handleFile = (files: File[]) => {
    const f = files[0];
    setFile(f);
    reset();
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  return (
    <div>
      {!file ? (
        <FileDropzone
          accept=".jpg,.jpeg,.png"
          hint="Acepta JPG y PNG"
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
                    reset();
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
            "◈ Convertir a PDF"
          )}
        </button>
        {file && (
          <button
            className="btn-secondary"
            onClick={() => {
              setFile(null);
              setPreview("");
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
        downloadName={file?.name.replace(/\.(jpg|jpeg|png)$/i, ".pdf")}
      />
    </div>
  );
}
