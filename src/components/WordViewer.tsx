"use client";

import { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";

interface WordViewerProps {
  file: File | null;
}

export default function WordViewer({ file }: WordViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function preview() {
      if (!file || !containerRef.current) return;

      setLoading(true);
      try {
        // Leemos el archivo como ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Renderizamos en el contenedor
        await renderAsync(arrayBuffer, containerRef.current, undefined, {
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          breakPages: true,
        });
      } catch (error) {
        console.error("Error visualizando Word:", error);
      } finally {
        setLoading(false);
      }
    }

    preview();
  }, [file]);

  if (!file)
    return (
      <div className="h-64 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
        Esperando archivo Word...
      </div>
    );

  return (
    <div className="relative w-full bg-gray-200 p-4 rounded-xl flex flex-col  h-full overflow-y-auto">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
          <div className="spinner" />
        </div>
      )}
      {/* Aquí es donde docx-preview inyectará el contenido */}
      <div ref={containerRef} className="  flex flex-col h-full" />
    </div>
  );
}
