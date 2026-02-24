"use client";

import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface Props {
  status: string;
  message: string;
  downloadUrl?: string;
  downloadName?: string;
}

export default function StatusBar({ status, message }: Props) {
  if (status === "idle") return null;

  const color: Record<string, string> = {
    loading: "#e8ff47",
    success: "#4ade80",
    error: "#f87171",
  };

  return (
    <div
      className={cn(
        ` rounded-xl md:p-4 flex md:flex-col items-center justify-center gap-2`,
      )}
    >
      {status === "loading" && (
        <div
          className={`w-20 h-20 md:w-40 md:h-40 border-8 border-[#e8ff4720] border-t-[#e8ff47] rounded-full animate-spin`}
        />
      )}
      {status === "success" && (
        <span>
          <Check className="text-[#4ade80] w-8 h-8 md:w-24 md:h-24 " />
        </span>
      )}
      {status === "error" && (
        <span>
          <X color="#f87171" size={100} />
        </span>
      )}
      <span
        style={{
          color: color[status],
        }}
        className="p-4 rounded-xl text-center"
      >
        {message}
      </span>
    </div>
  );
}
