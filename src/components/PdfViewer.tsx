import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css"; // Importante si activas selección
import ViewerControls from "./ViewerControls";

// Configuración del worker (asegúrate que la versión coincida con tu package.json)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer({ file }: { file: File | null }) {
  const [scale, setScale] = useState(0.5);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.0));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  const handlePageChange = (offset: number) => {
    const newPage = currentPage + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full  flex flex-col border rounded-lg overflow-hidden  h-full">
      <div className="p-2 text-center font-bold">VISTA PREVIA</div>

      {/* Contenedor principal con scroll */}
      <div className="overflow-auto min-h-[300px] h-full  p-4 flex justify-center items-center">
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<p className="p-4">Cargando PDF...</p>}
        >
          <Page
            pageNumber={currentPage}
            scale={scale} // <--- USA ESTA PROP, NO CSS SCALE
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="max-w-full"
          />
        </Document>
      </div>
      <ViewerControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        currentPage={currentPage}
        totalPages={numPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
