"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import StatusBar from "@/components/StatusBar";
import { usePdfOperation } from "@/hooks/usePdfOperation";
import dynamic from "next/dynamic";
const PdfViewer = dynamic(() => import("@/components/PdfViewer"), {
  ssr: false,
});
export default function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const { run, reset, statusBarStatus, statusBarMessage, downloadUrl } =
    usePdfOperation("pdf-to-word");

  const formatSize = (b: number) =>
    b < 1048576
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / 1048576).toFixed(1)} MB`;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      {file ? (
        <div className="h-full w-full grid grid-cols-2 gap-2 items-center justify-center">
          <div className="flex flex-col p-4 gap-2">
            <StatusBar
              status={statusBarStatus}
              message={statusBarMessage}
              downloadUrl={downloadUrl}
              downloadName={file?.name.replace(".pdf", ".docx")}
            />
            <div className="file-item">
              <span className="file-item-icon">📑</span>
              <div className="file-item-info">
                <div className="file-item-name">
                  Archivo cargado: {file.name}
                </div>
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
            <div className="flex gap-2 justify-center items-center">
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
          </div>
        </div>
      ) : (
        <div className="w-[400px] h-[400px] flex items-center justify-center">
          <FileDropzone
            accept=".pdf"
            onFiles={(files) => {
              setFile(files[0]);
              reset();
            }}
          />
        </div>
      )}
    </div>
  );
}
