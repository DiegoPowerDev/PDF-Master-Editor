"use client";

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
    <div
      className={`dropzone ${dragOver ? "drag-over" : ""}`}
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
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handle(e.target.files)}
        onClick={(e) => e.stopPropagation()}
      />
      <span className="dropzone-icon">⬆</span>
      <p className="dropzone-title">
        Arrastra tu archivo aquí o haz clic para seleccionar
      </p>
      <p className="dropzone-hint">{hint || accept}</p>
    </div>
  );
}
