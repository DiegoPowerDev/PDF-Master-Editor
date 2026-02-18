"use client";

interface Props {
  status: string;
  message: string;
  downloadUrl?: string;
  downloadName?: string;
}

export default function StatusBar({
  status,
  message,
  downloadUrl,
  downloadName,
}: Props) {
  if (status === "idle") return null;

  return (
    <div>
      <div className={`status-bar ${status}`}>
        {status === "loading" && <div className="spinner" />}
        {status === "success" && <span>✓</span>}
        {status === "error" && <span>✗</span>}
        <span>{message}</span>
      </div>
      {status === "success" && downloadUrl && (
        <a
          className="download-btn"
          href={downloadUrl}
          download={downloadName || "output"}
        >
          ↓ Descargar archivo
        </a>
      )}
    </div>
  );
}
