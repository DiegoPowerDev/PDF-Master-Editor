import type { Metadata } from "next";
import "./globals.css";
import content from "@/content/content.json";

export const metadata: Metadata = {
  title: content.metadata.title,
  applicationName: content.metadata.applicationName,
  description: content.metadata.description,
  authors: content.metadata.authors,
  metadataBase: new URL("https://diegotorres-portfoliodev.vercel.app"),
  openGraph: content.metadata.openGraph,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta
          name="google-site-verification"
          content="abSLIjYehY7UNNtTck9OZ0lKx9FvXoWr4XvLnOBVs1M"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
