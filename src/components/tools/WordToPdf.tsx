"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import StatusBar from "@/components/StatusBar";
import { usePdfOperation } from "@/hooks/usePdfOperation";
import Doc from "@/assets/doc.svg";
import Pdf from "@/assets/pdf.svg";
import { ArrowRight, Download, X } from "lucide-react";

export default function WordToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const { run, reset, statusBarStatus, statusBarMessage, downloadUrl } =
    usePdfOperation("word-to-pdf");

  const formatSize = (b: number) =>
    b < 1048576
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / 1048576).toFixed(1)} MB`;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      {!file ? (
        <div className="w-[400px] h-[400px] flex items-center justify-center">
          <FileDropzone
            accept=".docx,.doc"
            hint="Acepta .docx y .doc — sube directo a Adobe, sin límite de Vercel"
            onFiles={(files) => {
              setFile(files[0]);
              reset();
            }}
          />
        </div>
      ) : (
        <div className="h-full w-full grid grid-cols-3 gap-2 items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-8">
            <Doc width={150} height={150} />
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
          </div>
          <div className="flex flex-col items-center justify-center h-full p-4 gap-2">
            <StatusBar status={statusBarStatus} message={statusBarMessage} />
            {statusBarMessage === "" && (
              <button
                className="btn-primary"
                onClick={() => file && run([file])}
                disabled={!file || statusBarStatus === "loading"}
              >
                Convertir a PDF <ArrowRight />
              </button>
            )}
          </div>
          <div className="flex flex-col items-center justify-center gap-8">
            {statusBarStatus === "success" && (
              <>
                <Pdf width={150} height={150} />
                <a
                  className="download-btn p-8"
                  href={downloadUrl}
                  download={file?.name.replace(/\.docx?$/, ".pdf") || "output"}
                >
                  <Download /> Descargar{" "}
                  {file?.name.replace(/\.docx?$/, ".pdf")}
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
