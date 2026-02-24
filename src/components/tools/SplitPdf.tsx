"use client";

import { useEffect, useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import StatusBar from "@/components/StatusBar";
import { usePdfOperation } from "@/hooks/usePdfOperation";
import Pdf from "@/assets/pdf.svg";
import { ArrowDown, ArrowRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const {
    run,
    reset,
    downloadAs,
    statusBarStatus,
    statusBarMessage,
    downloadUrl,
  } = usePdfOperation("split");

  const getDownloadName = () => {
    if (!file) return "split-document.pdf";
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    return `${baseName}-[${startPage}-${endPage}].pdf`;
  };

  useEffect(() => {
    if (statusBarStatus === "success") reset();
  }, [startPage, endPage]);

  const handleStartPage = (val: string) => {
    const n = parseInt(val) || 1;
    const clamped = Math.max(1, n);
    setStartPage(clamped);
    if (clamped > endPage) setEndPage(clamped);
  };

  const handleEndPage = (val: string) => {
    const n = parseInt(val) || 1;
    const clamped = Math.max(1, n);
    setEndPage(clamped);
    if (clamped < startPage) setStartPage(clamped);
  };

  const isValid = startPage >= 1 && endPage >= 1 && startPage <= endPage;
  const formatSize = (b: number) =>
    b < 1048576
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / 1048576).toFixed(1)} MB`;

  return (
    <div className=" w-full 2xl:w-3/4 flex flex-col items-center justify-center">
      {file ? (
        <div className="h-full w-full grid grid-cols-1 grid-rows-3 md:grid-rows-1 md:grid-cols-3 gap-2 items-center justify-center ">
          <div className="border rounded-xl md:border-0 md:grid md:grid-cols-1 md:grid-rows-2 flex items-center justify-center h-full p-4 gap-4 md:gap-12">
            <div className="md:w-full h-full flex flex-col justify-center gap-4 md:justify-end items-center  text-4xl">
              <Pdf className=" w-24 h-24 lg:w-36 lg:h-36" />
              <div className="text-gray-700 text-sm  ">
                {formatSize(file.size)}
              </div>
            </div>
            <div className="h-full flex flex-col w-1/2 md:w-full  items-center justify-start gap-2 md:gap-4  ">
              <div className="w-3/4 min-w-0 cursor pointer  flex md:justify-center md:min-w-1/2 max-w-full relative items-center text-black bg-[#E9FF4B80] md:px-8 md:py-4 p-4 rounded-xl text-center gap-2 font-bold text-sm">
                <p className="text-xs md:text-center  flex  truncate">
                  {file.name}
                </p>

                <button
                  className="absolute top-2 right-2 text-red-800"
                  onClick={() => {
                    setFile(null);
                    reset();
                  }}
                >
                  ✕
                </button>
              </div>
              <div className="flex w-full items-end md:items-center justify-center">
                <div className="flex flex-col w-full items-center">
                  <label className="text-center text-white/40">
                    Página inicio
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={startPage}
                    onChange={(e) => handleStartPage(e.target.value)}
                    onBlur={(e) => {
                      if (!e.target.value) handleStartPage("1");
                    }}
                    className={cn(
                      !isValid
                        ? "border-red-500 border"
                        : "border border-white/20",
                      "bg-gray-900 w-20 p-2 rounded-xl",
                    )}
                    style={{
                      borderColor: !isValid ? "var(--error)" : undefined,
                    }}
                  />
                </div>
                <div className="flex flex-col w-full items-center">
                  <label className="text-center text-white/40">
                    Página fin
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={endPage}
                    onChange={(e) => handleEndPage(e.target.value)}
                    onBlur={(e) => {
                      if (!e.target.value) handleEndPage(String(startPage));
                    }}
                    className={cn(
                      !isValid
                        ? "border-red-500 border"
                        : "border border-white/20",
                      "bg-gray-900 w-20 p-2 rounded-xl",
                    )}
                    style={{
                      borderColor: !isValid ? "var(--error)" : undefined,
                    }}
                  />
                </div>
                {!isValid && (
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--error)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    La página inicio no puede ser mayor a la página fin
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Columna central */}
          <div className="flex flex-col items-center justify-center h-full md:p-4 gap-2 md:pb-20">
            <StatusBar status={statusBarStatus} message={statusBarMessage} />
            {statusBarMessage === "" && (
              <button
                className="p-4  bg-amber-300 text-black font-bold rounded-xl  hover:bg-amber-200 hover:-translate-y-0.5 duration-200 flex  items-center justify-center text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => file && run([file], { startPage, endPage })}
                disabled={!file || statusBarStatus === "loading" || !isValid}
              >
                Extraer páginas{" "}
                <span className="hidden md:block">
                  <ArrowRight />
                </span>
                <span className="block md:hidden">
                  <ArrowDown />
                </span>
              </button>
            )}
          </div>

          {/* Columna derecha */}
          <div className="border rounded-xl md:border-0 md:grid md:grid-cols-1 md:grid-rows-2 flex items-center justify-center h-full p-4 gap-4 md:gap-12">
            {statusBarStatus === "success" && downloadUrl && (
              <>
                <div className="md:w-full h-full flex justify-center items-center md:items-end text-4xl">
                  <Pdf className=" w-24 h-24 lg:w-36 lg:h-36" />
                </div>
                <div className="h-full flex flex-col w-full md:justify-start justify-center items-center">
                  <button
                    className="cursor-pointer flex p-4 justify-center min-w-1/2 max-w-full items-center text-black bg-[#4ade80] px-8 rounded-xl text-center gap-2 font-bold text-sm"
                    onClick={() => downloadAs(getDownloadName())}
                  >
                    <Download />
                    <span className="text-wrap">
                      Descargar: {getDownloadName()}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className=" flex items-center justify-center">
          <FileDropzone
            accept=".pdf"
            type="cortar"
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
