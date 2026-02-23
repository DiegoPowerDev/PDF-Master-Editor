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
    <div className="h-full w-full 2xl:w-3/4 flex flex-col items-center justify-center">
      {!file ? (
        <div className="w-[400px] h-[400px] flex items-center justify-center">
          <FileDropzone
            type="pdf"
            accept=".docx,.doc"
            onFiles={(files) => {
              setFile(files[0]);
              reset();
            }}
          />
        </div>
      ) : (
        <div className="h-full w-full grid grid-cols-3 gap-2 items-center justify-center">
          <div className="grid grid-cols-1 grid-rows-2 items-center justify-center h-full p-4 gap-12">
            <div className="w-full h-full flex justify-center items-end">
              <Doc width={150} height={150} />
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
          </div>
          <div className="flex flex-col items-center justify-center h-full p-4 gap-2 pb-20">
            <StatusBar status={statusBarStatus} message={statusBarMessage} />
            {statusBarMessage === "" && (
              <button
                className="p-4  bg-amber-300 text-black font-bold rounded-xl  hover:bg-amber-200 hover:-translate-y-0.5 duration-200 flex  items-center justify-center text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => file && run([file])}
                disabled={!file || statusBarStatus === "loading"}
              >
                Convertir a PDF <ArrowRight />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 grid-rows-2 items-center justify-center h-full p-4 gap-12">
            {statusBarStatus === "success" && (
              <>
                <div className="h-full flex  justify-center items-end">
                  <Pdf width={150} height={150} />
                </div>
                <div className="h-full flex flex-col w-full  items-center">
                  <a
                    className="cursor pointer flex p-4  justify-center min-w-1/2 max-w-full  items-center text-black bg-[#4ade80]   px-8 rounded-xl text-center gap-2 font-bold text-sm"
                    href={downloadUrl}
                    download={
                      file?.name.replace(/\.docx?$/, ".pdf") || "output"
                    }
                  >
                    <Download />
                    {file?.name.replace(/\.docx?$/, ".pdf")}
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
