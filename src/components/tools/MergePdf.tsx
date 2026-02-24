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
          <div className="h-full w-full grid grid-cols-1 grid-rows-[2fr_1fr_2fr] md:grid-rows-1 md:grid-cols-3 gap-2 items-center justify-center p-4 md:p-0">
            <div className="border rounded-xl md:border-0 md:grid md:flex-col flex justify-center h-full p-4 gap-4 ">
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
                  "h-60 md:h-[45vh] 2xl:h-[70vh] flex flex-col gap-2 workspace-body overflow-x-hidden p-2 border rounded-xl",
                )}
              >
                {files.map((f, i) => (
                  <div
                    className="flex items-center w-full gap-2 text-sm relative bg-white/10 rounded-xl px-4 py-2"
                    key={i}
                  >
                    <span
                      className="flex-shrink-0"
                      style={{
                        fontFamily: "monospace",
                        fontSize: 13,
                        color: "var(--muted)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Cambiamos w-fit por min-w-0 y flex-1 */}
                    <div className="flex flex-col flex-1 min-w-0 pr-8">
                      <div className="truncate w-full text-white font-medium">
                        {f.name}
                      </div>
                      <div className="text-white/20 text-xs">
                        {formatSize(f.size)}
                      </div>
                    </div>

                    <button
                      className="absolute top-2 right-2 hover:text-red-500 p-2 cursor-pointer transition-colors"
                      onClick={() => removeFile(i)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center h-full p-4 gap-2 md:pb-20">
              <StatusBar status={statusBarStatus} message={statusBarMessage} />
              {statusBarMessage === "" && (
                <>
                  <button
                    className="p-4  bg-amber-300 text-black font-bold rounded-xl  hover:bg-amber-200 hover:-translate-y-0.5 duration-200 flex  items-center justify-center text-sm disabled:opacity-40 disabled:cursor-not-allowed"
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
            <div className="border rounded-xl md:border-0 md:grid md:grid-cols-1 md:grid-rows-2 flex items-center justify-center h-full p-4 gap-4 md:gap-12">
              {statusBarStatus === "success" && (
                <>
                  <div className="md:w-full h-full flex justify-center items-center md:items-end text-4xl">
                    <Pdf className="w-16 h-16 md:w-24 md:h-24 lg:w-36 lg:h-36" />
                  </div>
                  <div className="h-full flex flex-col w-full  items-center">
                    <a
                      className="cursor pointer flex p-4  justify-center min-w-1/2 max-w-full  items-center text-black bg-[#4ade80]   px-8 rounded-xl text-center gap-2 font-bold text-sm"
                      href={downloadUrl}
                      download={
                        files[0].name.replace(/\.docx?$/, ".pdf") || "output"
                      }
                    >
                      <Download className="w-12 h-12 md:w-24 md:h-24 lg:w-36 lg:h-36" />
                      {files[0].name.replace(/\.docx?$/, ".pdf")}
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className=" flex items-center justify-center">
          <FileDropzone
            accept=".pdf"
            multiple
            type="unir2"
            onFiles={addFiles}
          />
        </div>
      )}
    </div>
  );
}
