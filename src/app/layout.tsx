import type { Metadata } from "next";
import "./globals.css";
import content from "@/content/content.json";

export const metadata: Metadata = {
  title: content.metadata.title,
  applicationName: content.metadata.applicationName,
  description: content.metadata.description,
  authors: content.metadata.authors,
  metadataBase: new URL("https://fastpdfmaster.vercel.app"),
  openGraph: content.metadata.openGraph,
  verification: {
    google: "abSLIjYehY7UNNtTck9OZ0lKx9FvXoWr4XvLnOBVs1M",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Fast PDF Master",
              operatingSystem: "All",
              applicationCategory: "BusinessApplication",
              description:
                "Herramienta web para unir, dividir y convertir archivos PDF de forma rápida.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Person",
                name: "Diego Torres",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
