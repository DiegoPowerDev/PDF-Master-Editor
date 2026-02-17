"use client";

import { useState } from "react";
import WordToPdf from "@/components/tools/WordToPdf";
import PdfToWord from "@/components/tools/PdfToWord";
import MergePdf from "@/components/tools/MergePdf";
import SplitPdf from "@/components/tools/SplitPdf";
import ImageToPdf from "@/components/tools/ImageToPdf";

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
        <nav className="tool-nav">
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
        <div className="sidebar-footer">
          <p>Powered by Adobe PDF Services</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="workspace-header">
          <h1>{activeTool.label}</h1>
          <p>{activeTool.desc}</p>
        </header>
        <div className="workspace-body">
          <ActiveComponent />
        </div>
      </section>
    </main>
  );
}
