"use client";

import { useEffect, useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import StatusBar from "@/components/StatusBar";
import { usePdfOperation } from "@/hooks/usePdfOperation";
import Pdf from "@/assets/pdf.svg";
import { ArrowRight, Download } from "lucide-react";
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
        <div className="h-full w-full grid grid-cols-3 gap-2 items-center justify-center">
          {/* Columna izquierda */}
          <div className="grid grid-cols-1 grid-rows-2 items-center justify-center h-full p-4 gap-12">
            <div className="w-full h-full flex justify-center items-end">
              <Pdf width={150} height={150} />
            </div>
            <div className="h-full flex flex-col w-full  items-center">
              <div className="cursor pointer flex   p-4 justify-center min-w-1/2 max-w-full relative items-center text-black bg-[#E9FF4B80]   px-8 rounded-xl text-center gap-2 font-bold text-sm">
                <div>{file.name}</div>
                <div className="text-gray-700">{formatSize(file.size)}</div>
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
            </div>
            <div className=" flex w-full justify-center gap-4 px-4">
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
                  style={{ borderColor: !isValid ? "var(--error)" : undefined }}
                />
              </div>
              <div className="flex flex-col w-full items-center">
                <label className="text-center text-white/40">Página fin</label>
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
                    "bg-gray-900  w-20 p-2 rounded-xl",
                  )}
                  style={{ borderColor: !isValid ? "var(--error)" : undefined }}
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

          {/* Columna central */}
          <div className="flex flex-col items-center justify-center h-full p-4 gap-2 pb-20">
            <StatusBar status={statusBarStatus} message={statusBarMessage} />
            {statusBarMessage === "" && (
              <button
                className="p-4  bg-amber-300 text-black font-bold rounded-xl  hover:bg-amber-200 hover:-translate-y-0.5 duration-200 flex  items-center justify-center text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => file && run([file], { startPage, endPage })}
                disabled={!file || statusBarStatus === "loading" || !isValid}
              >
                Extraer páginas <ArrowRight />
              </button>
            )}
          </div>

          {/* Columna derecha */}
          <div className="grid grid-cols-1 grid-rows-2 items-center justify-center h-full p-4 gap-12">
            {statusBarStatus === "success" && downloadUrl && (
              <>
                <div className="h-full flex  justify-center items-end">
                  <Pdf width={150} height={150} />
                </div>
                <div className="h-full flex flex-col w-full items-center">
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
        <div className="w-[400px] h-[400px] flex items-center justify-center">
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
