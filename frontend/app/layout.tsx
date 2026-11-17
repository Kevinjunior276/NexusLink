import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import KeepAlive from "@/components/utils/KeepAlive";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "NexusLink Solutions | Infrastructure de Capture Sécurisée",
  description: "Plateforme institutionnelle de génération de liens sécurisés et de capture de formulaires de données de paiement.",
  keywords: ["données", "sécurité", "capture", "fintech", "nexuslink", "passerelle"],
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
  themeColor: "#07090e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} selection:bg-blue-500/20 selection:text-blue-200`}>
      <body className="bg-brand-bg font-sans text-slate-100 antialiased min-h-screen">
        <KeepAlive />
        {/* Ambient atmospheric gradients */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent blur-[120px] rounded-full" />
          <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-blue-500/5 blur-[140px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-indigo-500/5 blur-[140px] rounded-full" />
        </div>
        {children}
      </body>
    </html>
  );
}
