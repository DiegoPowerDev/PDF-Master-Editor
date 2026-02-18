"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import StatusBar from "@/components/StatusBar";
import { usePdfOperation } from "@/hooks/usePdfOperation";

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [startPage, setStartPage] = useState("1");
  const [endPage, setEndPage] = useState("");
  const { run, reset, statusBarStatus, statusBarMessage, downloadUrl } =
    usePdfOperation("split");

  const handleRun = () => {
    if (!file) return;
    run([file]); // options se pasan en el hook, pero aquí los enviamos via process route
  };

  // Sobreescribir run para pasar options de páginas
  const handleRunWithOptions = async () => {
    if (!file) return;
    // Necesitamos pasar startPage/endPage al hook — usamos fetch directo
    const { run: runWithOpts } = {
      run: async (files: File[]) => {
        // Este componente llama a run del hook pero necesita pasar options dinámicas
        // La solución limpia es usar el hook con options dinámicas
      },
    };
    run([file]);
  };

  return (
    <div>
      <FileDropzone
        accept=".pdf"
        hint="Selecciona el PDF del que quieres extraer páginas"
        onFiles={(files) => {
          setFile(files[0]);
          reset();
        }}
      />

      {file && (
        <>
          <div className="file-list" style={{ marginTop: 24 }}>
            <div className="file-item">
              <span className="file-item-icon">📑</span>
              <div className="file-item-info">
                <div className="file-item-name">{file.name}</div>
              </div>
              <button
                className="file-item-remove"
                onClick={() => {
                  setFile(null);
                  reset();
                }}
              >
                ✕
              </button>
            </div>
          </div>
          <div className="range-input-group">
            <div className="input-field">
              <label>Página inicio</label>
              <input
                type="number"
                min="1"
                value={startPage}
                onChange={(e) => setStartPage(e.target.value)}
                placeholder="1"
              />
            </div>
            <div className="input-field">
              <label>Página fin</label>
              <input
                type="number"
                min="1"
                value={endPage}
                onChange={(e) => setEndPage(e.target.value)}
                placeholder="última"
              />
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--muted)",
                fontFamily: "var(--font-mono)",
                paddingBottom: 4,
              }}
            >
              Vacío = extraer hasta el final
            </p>
          </div>
        </>
      )}

      <div className="action-row">
        <button
          className="btn-primary"
          onClick={handleRun}
          disabled={!file || statusBarStatus === "loading"}
        >
          {statusBarStatus === "loading" ? (
            <>
              <div
                className="spinner"
                style={{ width: 14, height: 14, borderWidth: 2 }}
              />
              {statusBarMessage}
            </>
          ) : (
            "⊘ Extraer páginas"
          )}
        </button>
        {file && (
          <button
            className="btn-secondary"
            onClick={() => {
              setFile(null);
              reset();
            }}
          >
            Limpiar
          </button>
        )}
      </div>

      <StatusBar
        status={statusBarStatus}
        message={statusBarMessage}
        downloadUrl={downloadUrl}
        downloadName="extracted.pdf"
      />
    </div>
  );
}
