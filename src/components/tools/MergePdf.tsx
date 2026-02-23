"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import StatusBar from "@/components/StatusBar";
import { usePdfOperation } from "@/hooks/usePdfOperation";

import Pdf from "@/assets/pdf.svg";
import { ArrowRight, Download, Trash, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
    <div className="h-full w-full 2xl:w-3/4 flex flex-col items-center justify-center">
      {files.length > 0 ? (
        <>
          <div className="h-full w-full grid grid-cols-3 gap-2 items-center justify-center">
            <div className="flex flex-col gap-2 h-full">
              <div className="flex flex-col w-full gap-2">
                {statusBarStatus === "idle" && (
                  <FileDropzone
                    accept=".pdf"
                    multiple
                    type="unir"
                    onFiles={addFiles}
                  />
                )}

                {files.length > 0 && (
                  <button
                    className={cn(
                      statusBarStatus === "loading" &&
                        "select-none pointer-events-none opacity-20",
                      "cursor-pointer border-2 rounded p-2  border-red-500 bg-red-400  w-full flex gap-2 justify-center items-center ",
                    )}
                    onClick={() => {
                      setFiles([]);
                      reset();
                    }}
                  >
                    {statusBarStatus === "idle"
                      ? "Quitar todo"
                      : "Limpiar y empezar nuevamente"}
                    <Trash2 />
                  </button>
                )}
              </div>
              <div
                className={cn(
                  statusBarMessage != "" &&
                    "select-none pointer-events-none opacity-20",
                  "h-[45vh] 2xl:h-[70vh] flex flex-col gap-2 overflow-x-auto p-2",
                )}
              >
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
            </div>
            <div className="flex flex-col items-center justify-center h-full p-4 gap-2">
              <StatusBar status={statusBarStatus} message={statusBarMessage} />
              {statusBarMessage === "" && (
                <>
                  <button
                    className="btn-primary"
                    onClick={() => run(files)}
                    disabled={files.length < 2 || statusBarStatus === "loading"}
                  >
                    Unir {files.length} PDFs <ArrowRight />
                  </button>

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
                </>
              )}
            </div>
            <div className="grid grid-cols-1 grid-rows-[2fr_1fr] items-center justify-center h-full p-4 gap-2">
              {statusBarStatus === "success" && (
                <>
                  <div className="h-full flex items-center justify-center">
                    <Pdf width={150} height={150} />
                  </div>
                  <div className="h-full flex flex-col w-full  items-center">
                    <a
                      className="cursor pointer flex p-4  justify-center min-w-1/2 max-w-full  items-center text-black bg-[#4ade80]   px-8 rounded-xl text-center gap-2 font-bold text-sm"
                      href={downloadUrl}
                      download={
                        files[0].name.replace(/\.docx?$/, ".pdf") || "output"
                      }
                    >
                      <Download />
                      {files[0].name.replace(/\.docx?$/, ".pdf")}
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="w-[400px] h-[400px] flex items-center justify-center">
          <FileDropzone
            accept=".pdf"
            multiple
            hint="Selecciona múltiples PDFs"
            onFiles={addFiles}
          />
        </div>
      )}
    </div>
  );
}
