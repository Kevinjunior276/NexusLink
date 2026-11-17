import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center p-6 text-center text-slate-100">
      <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6 font-mono font-bold text-xl">
        404
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Page Introuvable</h1>
      <p className="text-xs text-slate-400 max-w-sm mb-6">
        La ressource demandée n'existe pas ou a été déplacée vers une nouvelle URL sécurisée.
      </p>
      <Link href="/" className="btn-secondary py-2 px-4 text-xs inline-flex items-center gap-2">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Retour à l'accueil</span>
      </Link>
    </div>
  );
}
