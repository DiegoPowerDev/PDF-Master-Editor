"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import StatusBar from "@/components/StatusBar";
import { usePdfOperation } from "@/hooks/usePdfOperation";
import Doc from "@/assets/doc.svg";
import Pdf from "@/assets/pdf.svg";
import { ArrowRight, Download } from "lucide-react";

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
        <div className="h-full w-full grid grid-cols-3 gap-2 items-center justify-center">
          <div className="grid grid-cols-1 grid-rows-[2fr_1fr] items-center justify-center h-full p-4 gap-2">
            <div className="w-full h-full flex justify-center items-center">
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
          </div>
          <div className="flex flex-col items-center justify-center h-full p-4 gap-2">
            <StatusBar status={statusBarStatus} message={statusBarMessage} />
            {statusBarMessage === "" && (
              <button
                className="btn-primary"
                onClick={() => file && run([file])}
                disabled={!file || statusBarStatus === "loading"}
              >
                Convertir a .docx <ArrowRight />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 grid-rows-[2fr_1fr] items-center justify-center h-full p-4 gap-2">
            {statusBarStatus === "success" && (
              <>
                <div className="h-full flex items-center justify-center">
                  <Doc width={150} height={150} />
                </div>
                <div className="h-full flex flex-col w-full  items-center">
                  <a
                    className="cursor pointer flex p-4  justify-center min-w-1/2 max-w-full  items-center text-black bg-[#4ade80]   px-8 rounded-xl text-center gap-2 font-bold text-sm"
                    href={downloadUrl}
                    download={
                      file?.name.replace(/\.pdf?$/, ".docx") || "output"
                    }
                  >
                    <Download />
                    {file?.name.replace(/\.pdf?$/, ".docx")}
                  </a>
                </div>
              </>
            )}
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
