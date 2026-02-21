"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ViewerControls({
  totalPages,
  currentPage,
  onPageChange,
}: any) {
  return (
    <div className="flex items-center  justify-center bg-white border text-black border-gray-200 p-2  shadow-sm">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(-1)}
          className="p-1 hover:bg-gray-100 rounded"
          disabled={currentPage <= 1}
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-medium">
          {currentPage} / {totalPages || 1}
        </span>
        <button
          onClick={() => onPageChange(1)}
          className="p-1 hover:bg-gray-100 rounded"
          disabled={currentPage >= totalPages}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
