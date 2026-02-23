"use client";

import Pdf from "@/assets/pdf.svg";
import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import StatusBar from "@/components/StatusBar";
import { usePdfOperation } from "@/hooks/usePdfOperation";
import { ArrowRight, Download } from "lucide-react";

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
    <div className="h-full w-full 2xl:w-3/4 flex flex-col items-center justify-center">
      {!file ? (
        <div className="w-[400px] h-[400px] flex items-center justify-center">
          <FileDropzone
            accept=".jpg,.jpeg,.png"
            hint="Acepta JPG y PNG"
            onFiles={handleFile}
          />
        </div>
      ) : (
        <div className="h-full w-full grid grid-cols-3 gap-2 items-center justify-center">
          <div className="grid grid-cols-1 grid-rows-[2fr_1fr] items-center justify-center h-full p-4 gap-2">
            {preview && (
              <div className="w-full h-full flex justify-center items-center">
                <img
                  src={preview}
                  alt="Imagen a convertir a PDF"
                  className="max-w-full object-contain "
                />
              </div>
            )}
            <div className="h-full flex flex-col w-full  items-center">
              <div className="cursor pointer flex   p-4 justify-center min-w-1/2 max-w-full relative items-center text-black bg-[#E9FF4B80]   px-8 rounded-xl text-center gap-2 font-bold text-sm">
                <div>{file.name}</div>
                <button
                  className="cursor-pointer absolute top-2 right-2 text-red-800"
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
            <StatusBar
              status={statusBarStatus}
              message={statusBarMessage}
              downloadUrl={downloadUrl}
              downloadName={file?.name.replace(/\.(jpg|jpeg|png)$/i, ".pdf")}
            />

            {statusBarStatus === "idle" && (
              <button
                className="btn-primary"
                onClick={() => file && run([file])}
              >
                Convertir a PDF <ArrowRight />
              </button>
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
                      file?.name.replace(/\.[^/.]+$/, ".pdf") || "archivo.pdf"
                    }
                  >
                    <Download />
                    <span className="ml-1">
                      {file?.name.replace(/\.[^/.]+$/, ".pdf")}
                    </span>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="action-row"></div>
    </div>
  );
}
