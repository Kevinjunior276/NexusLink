import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "NexusLink Solutions | Infrastructure de Capture de Données Sécurisée",
  description: "Solution d'entreprise pour la génération de liens sécurisés et la collecte de données de paiement avec cryptage de grade militaire.",
  keywords: ["données", "sécurité", "capture", "enterprise", "fintech", "nexuslink"],
  authors: [{ name: "NexusLink Solutions" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NexusLink",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0070f3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} selection:bg-blue-500/30`}>
      <body className="bg-brand-bg font-sans overflow-x-hidden">
        {/* Background Decor */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-brand-bg">
          <div className="orb orb-blue" />
          <div className="orb orb-purple" />
        </div>
        {children}
      </body>
    </html>
  );
}
