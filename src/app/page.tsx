"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import WordToPdf from "@/components/tools/WordToPdf";
import PdfToWord from "@/components/tools/PdfToWord";
import MergePdf from "@/components/tools/MergePdf";
import ImageToPdf from "@/components/tools/ImageToPdf";
import SplitPdf from "@/components/tools/SplitPdf";
import {
  IconArrowRight,
  IconChevronDown,
  IconFileTypeDoc,
  IconFileTypePdf,
  IconPhoto,
  IconPlus,
  IconScissors,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

const tools = [
  {
    id: "word-to-pdf",
    label: (
      <span className="flex  items-center gap-2">
        Word
        <IconArrowRight size={15} /> PDF
      </span>
    ),
    icon: <IconFileTypeDoc />,
    desc: "Convierte documentos DOCX a PDF ",
    component: WordToPdf,
  },
  {
    id: "pdf-to-word",
    label: (
      <span className="flex  items-center gap-2">
        PDF
        <IconArrowRight size={15} /> Word
      </span>
    ),
    icon: <IconFileTypePdf />,
    desc: "Convierte PDFs a DOCX editables",
    component: PdfToWord,
  },
  {
    id: "merge",
    label: "Unir PDFs",
    icon: <IconPlus />,
    desc: "Combina múltiples PDFs en uno solo",
    component: MergePdf,
  },
  {
    id: "split",
    label: "Dividir PDF",
    icon: <IconScissors />,
    desc: "Extrae páginas o rangos de un PDF",
    component: SplitPdf,
  },
  {
    id: "image-to-pdf",
    label: (
      <span className="flex  items-center gap-2">
        Imagen
        <IconArrowRight size={15} /> PDF
      </span>
    ),
    icon: <IconPhoto />,
    desc: "Convierte imágenes a documento PDF",
    component: ImageToPdf,
  },
];

export default function Home() {
  const [activeTool, setActiveTool] = useState(tools[0]);
  const ActiveComponent = activeTool.component;
  const [openMenu, setOpenMenu] = useState(true);
  const [open, setOpen] = useState(false);

  return (
    <main className="flex flex-col md:flex-row h-full w-full">
      <aside className="bg-[#141417] flex flex-col w-full md:w-1/4 gap-2 pt-4 pb-2 md:py-12 px-2">
        <div className="flex gap-2 justify-between md:justify-start">
          <span className="text-amber-300 ">
            <IconFileTypePdf size={60} />
          </span>

          <span className="font-bold text-2xl">
            Fast
            <span className="px-2 text-amber-300">
              PDF
              <br /> Conversor
            </span>
          </span>
          <div className="h-full    justify-center items-center  flex md:hidden">
            <button
              aria-label="informacion"
              onClick={() => setOpen(true)}
              className="flex justify-end  cursor-pointer"
            >
              <Info className="text-amber-400" size={40} />
            </button>
          </div>
        </div>
        <nav
          className={cn(
            "items-center h-full flex flex-col  justify-center gap-2",
          )}
        >
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={cn(
                openMenu || activeTool.id === tool.id
                  ? "flex"
                  : "hidden md:flex",
                activeTool.id === tool.id
                  ? "bg-amber-300 text-black "
                  : "text-white",
                "rounded-xl w-full cursor-pointer   py-2 px-4 items-center text-start gap-4 text-sm ",
              )}
              onClick={() => {
                setActiveTool(tool);
                setOpenMenu(false);
              }}
            >
              <span className=" flex flex-col justify-center h-full ">
                {tool.icon}
              </span>
              <span className="flex flex-col">
                <span className="font-bold">{tool.label}</span>
                <span className="opacity-80">{tool.desc}</span>
              </span>
            </button>
          ))}
        </nav>
        <div className=" justify-end hidden md:flex">
          <button
            aria-label="informacion"
            onClick={() => setOpen(true)}
            className="flex justify-end pr-8 cursor-pointer"
          >
            <Info className="text-amber-400" size={30} />
          </button>
        </div>
        <div
          className="w-full flex justify-center md:hidden   "
          onClick={() => setOpenMenu(!openMenu)}
        >
          <IconChevronDown />
        </div>
      </aside>

      <section className="flex w-full h-full flex-col">
        <header className="border-b border-white/20 p-4 hidden md:block">
          <h1 className="font-bold text-amber-300 text-2xl">
            {activeTool.label}
          </h1>
          <p className="text-white/50">{activeTool.desc}</p>
        </header>
        <div className="justify-center flex items-center   h-full ">
          <ActiveComponent />
        </div>
      </section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-black border-amber-300">
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center mb-2 text-amber-400">
              <Info />
              Información
            </DialogTitle>
            <DialogDescription>
              QR gratuitos para siempre. Sin caducidad, sin publicidad y sin
              rastreadores. Proyecto desarrollado bajo la filosofía de software
              libre. Si buscas un desarrollador con este nivel de atención al
              detalle, visita mi portafolio:
              <br />
              <a
                target="_blank"
                href="https://diegotorres-portfoliodev.vercel.app"
                className="flex justify-center mt-4 font-bold p-2 rounded hover:opacity-80 text-amber-400 text-xl"
              >
                Diego Torres
              </a>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
