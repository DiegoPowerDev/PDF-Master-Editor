"use client";

import { cn } from "@/lib/utils";
import {
  IconAlertTriangleFilled,
  IconFileTypeDoc,
  IconFileTypePdf,
  IconPhoto,
  IconPlus,
  IconScissors,
} from "@tabler/icons-react";
import { useRef, useState } from "react";

interface Props {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  type?: string;
}

export default function FileDropzone({
  accept,
  multiple = false,
  onFiles,
  type,
}: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const allowedExts = accept
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.startsWith("."));

  const isFileValid = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    return allowedExts.some((ext) => fileName.endsWith(ext));
  };

  const handle = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");

    const fileArray = Array.from(files);
    const valid = fileArray.filter(isFileValid);
    const invalid = fileArray.filter((f) => !isFileValid(f));

    if (invalid.length > 0) {
      const names = invalid.map((f) => f.name).join(", ");
      setError(
        invalid.length === fileArray.length
          ? `Formato no válido: ${names}. Solo se aceptan: ${accept.toUpperCase()}`
          : `Archivos ignorados (formato incorrecto): ${names}`,
      );
    }

    if (valid.length > 0) {
      onFiles(multiple ? valid : [valid[0]]);
    }
  };

  const Icons: Record<string, React.ReactNode> = {
    unir2: <IconPlus size={50} />,
    imagen: <IconPhoto size={50} />,
    word: <IconFileTypeDoc size={50} />,
    pdf: <IconFileTypePdf size={50} />,
    cortar: <IconScissors size={50} />,
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full h-full">
      <label
        htmlFor="dropzone"
        className={cn(
          dragOver && "bg-amber-300/50! text-black",
          type !== "unir" && "h-3/4 w-3/4 p-8",
          "cursor-pointer transition-all duration-200 border-dashed border-2 rounded-xl flex items-center justify-center flex-col bg-[#0C0C0E] hover:bg-[#1d1d25] font-bold p-4 gap-4",
          error && "border-red-500",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handle(e.dataTransfer.files);
        }}
      >
        <input
          className="hidden"
          id="dropzone"
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handle(e.target.files)}
          onClick={(e) => e.stopPropagation()}
        />
        {type && Icons[type]}
        <p className="text-center">
          Arrastra tu archivo
          <span className="font-bold px-2 text-yellow-300">
            {accept.toUpperCase()}
          </span>
          {type === "unir2"
            ? "aquí o haz clic para empezar"
            : "aquí o haz clic para seleccionar"}
        </p>
      </label>

      {error && (
        <p className="text-red-400 text-xs text-center font-mono px-2 flex items-center justify-center">
          <IconAlertTriangleFilled /> {error}
        </p>
      )}
    </div>
  );
}
