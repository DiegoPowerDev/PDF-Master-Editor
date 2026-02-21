"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

interface Props {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  hint?: string;
}

export default function FileDropzone({
  accept,
  multiple = false,
  onFiles,
  hint,
}: Props) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = (files: FileList | null) => {
    if (!files) return;
    onFiles(Array.from(files));
  };

  return (
    <label
      htmlFor="dropzone"
      className={cn(
        dragOver && "drag-over",
        `h-3/4 w-3/4 cursor-pointer transition-all duration-200 border-dashed border-2 rounded-xl flex items-center justify-center flex-col bg-[#0C0C0E] hover:bg-[#1d1d25] p-8 font-bold`,
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
      <p className="dropzone-title">
        Arrastra tu archivo
        <span className="font-bold px-2 text-yellow-300">
          {accept.toUpperCase()}
        </span>
        aquí o haz clic para seleccionar
      </p>
    </label>
  );
}
