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
          <div className="flex flex-col items-center justify-center gap-2">
            <Pdf width={150} height={150} />

            <div className="font-bold text-sm text-center ">
              Archivo cargado:
            </div>
            <div className="cursor pointer flex flex-col w-11/12 justify-center items-center text-black bg-[#4ade80] p-2 px-8 rounded-xl text-center gap-2 font-bold text-sm relative">
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
                <Doc width={150} height={150} />
                <a
                  className="cursor pointer flex justify-center items-center text-black bg-[#4ade80] p-2 px-4 rounded-xl text-center gap-2 font-bold text-sm"
                  href={downloadUrl}
                  download={file?.name.replace(/\.docx?$/, ".pdf") || "output"}
                >
                  <Download /> Descargar
                  {file?.name.replace(/\.docx?$/, ".pdf")}
                </a>
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
