"use client";

import { useState } from "react";
import WordToPdf from "@/components/tools/WordToPdf";
import PdfToWord from "@/components/tools/PdfToWord";
import MergePdf from "@/components/tools/MergePdf";
import ImageToPdf from "@/components/tools/ImageToPdf";
import dynamic from "next/dynamic";

const SplitPdf = dynamic(() => import("@/components/tools/SplitPdf"), {
  ssr: false, // Esta es la línea mágica
  loading: () => (
    <div className="flex flex-col items-center p-20">
      <div className="spinner" />
      <p>Iniciando motor de PDF...</p>
    </div>
  ),
});
const tools = [
  {
    id: "word-to-pdf",
    label: "Word → PDF",
    icon: "⬇",
    desc: "Convierte documentos DOCX a PDF con fidelidad perfecta",
    component: WordToPdf,
  },
  {
    id: "pdf-to-word",
    label: "PDF → Word",
    icon: "⬆",
    desc: "Exporta PDF a DOCX editable",
    component: PdfToWord,
  },
  {
    id: "merge",
    label: "Unir PDFs",
    icon: "⊕",
    desc: "Combina múltiples PDFs en uno solo",
    component: MergePdf,
  },
  {
    id: "split",
    label: "Dividir PDF",
    icon: "⊘",
    desc: "Extrae páginas o rangos de un PDF",
    component: SplitPdf,
  },
  {
    id: "image-to-pdf",
    label: "Imagen → PDF",
    icon: "◈",
    desc: "Convierte JPG o PNG a documento PDF",
    component: ImageToPdf,
  },
];

export default function Home() {
  const [activeTool, setActiveTool] = useState(tools[0]);
  const ActiveComponent = activeTool.component;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">◉</span>
          <span className="brand-name">
            PDF<em>Studio</em>
          </span>
        </div>
        <nav className="tool-nav flex flex-col justify-center">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={`tool-btn ${activeTool.id === tool.id ? "active" : ""}`}
              onClick={() => setActiveTool(tool)}
            >
              <span className="tool-icon">{tool.icon}</span>
              <span className="tool-info">
                <span className="tool-label">{tool.label}</span>
                <span className="tool-desc">{tool.desc}</span>
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <section className="workspace">
        <header className="workspace-header">
          <h1>{activeTool.label}</h1>
          <p>{activeTool.desc}</p>
        </header>
        <div className="justify-center flex items-center p-12 flex-1">
          <ActiveComponent />
        </div>
      </section>
    </main>
  );
}
