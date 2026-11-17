'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Link2,
  BarChart2,
  Lock,
  Globe,
  ArrowRight,
  CheckCircle2,
  Zap,
  FileText,
  Bell,
  Filter,
  Layers,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 nav-blur h-16 sm:h-20">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">NexusLink</span>
                <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">PRO</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
              <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors cursor-pointer">Fonctionnalités</button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors cursor-pointer">Fonctionnement</button>
              <button onClick={() => scrollToSection('security')} className="hover:text-white transition-colors cursor-pointer">Sécurité & Audit</button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:inline-flex text-xs font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors">
              Espace Administrateur
            </Link>
            <Link href="/login" className="btn-premium py-2 px-4 sm:px-5 text-xs font-semibold">
              <span>Connexion</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 bg-slate-950/95 backdrop-blur-xl border-b border-white/10 p-6 z-40 md:hidden flex flex-col gap-4"
          >
            <button onClick={() => scrollToSection('features')} className="text-left text-sm font-medium text-slate-300 py-2">Fonctionnalités</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-left text-sm font-medium text-slate-300 py-2">Fonctionnement</button>
            <button onClick={() => scrollToSection('security')} className="text-left text-sm font-medium text-slate-300 py-2">Sécurité & Audit</button>
            <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary w-full py-2.5 text-center text-xs">Espace Admin</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <main className="flex-1 pt-24 sm:pt-32 pb-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-16 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Infrastructure Fintech & Capture Sécurisée v2.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight"
          >
            Génération de Liens Sécurisés & Capture de Flux de Paiement
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Plateforme complète pour administrer des campagnes de collecte, valider en direct les coordonnées de paiement (Mobile Money, Virements) et exporter vos données avec un niveau d'intégrité bancaire.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link href="/login" className="btn-premium w-full sm:w-auto py-3 px-6 text-sm font-semibold">
              <span>Accéder au Tableau de Bord</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => scrollToSection('features')}
              className="btn-secondary w-full sm:w-auto py-3 px-6 text-sm font-medium"
            >
              Découvrir les capacités
            </button>
          </motion.div>

          {/* Aperçu interactif du système */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 max-w-5xl mx-auto glass-card rounded-2xl p-4 sm:p-6 text-left border-white/[0.08]"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-xs text-slate-400 font-mono ml-2">Console de Contrôle en Temps Réel</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Système Opérationnel (Supabase Cloud)
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-xs text-slate-400 block mb-1">Passerelles Actives</span>
                <span className="text-xl font-bold text-white block">5 Opérateurs</span>
                <span className="text-[11px] text-blue-400 mt-2 block">Orange • MTN • Wave • Virement</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-xs text-slate-400 block mb-1">Protocole de Sécurité</span>
                <span className="text-xl font-bold text-white block">AES-256 + TLS 1.3</span>
                <span className="text-[11px] text-emerald-400 mt-2 block">Chiffrement point à point</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-xs text-slate-400 block mb-1">Export & Audit</span>
                <span className="text-xl font-bold text-white block">Instantané</span>
                <span className="text-[11px] text-indigo-400 mt-2 block">Rapports PDF & Recharts intégrés</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section Fonctionnalités */}
        <section id="features" className="py-20 border-t border-white/[0.06] bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">Capacités & Modules</h2>
              <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Une architecture éprouvée pour la gestion de données sensibles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Link2,
                  title: "Génération de Liens Dynamiques",
                  desc: "Créez des URLs uniques de collecte avec contrôle strict du nombre de soumissions et date d'expiration automatisée."
                },
                {
                  icon: Globe,
                  title: "Détection Géographique Automatique",
                  desc: "Identification instantanée du pays d'origine par IP, indicatif téléphonique prérempli et filtrage par région."
                },
                {
                  icon: BarChart2,
                  title: "Analyses & Télémétrie en Direct",
                  desc: "Tableaux de bord interactifs présentant la ventilation par opérateur, le volume journalier et l'évolution temporelle."
                },
                {
                  icon: Lock,
                  title: "Intégrité des Données",
                  desc: "Protection des informations critiques avec règles de sécurité RLS au niveau de la base Supabase."
                },
                {
                  icon: FileText,
                  title: "Export PDF Professionnel",
                  desc: "Générez des fiches de soumission officielles en un clic avec résumé des métadonnées et horodatage certifié."
                },
                {
                  icon: Zap,
                  title: "Synchronisation Instantanée",
                  desc: "Diffusion en direct vers le dashboard administrateur dès qu'un formulaire est validé côté client."
                }
              ].map((feat, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-6 border-white/[0.06] hover:border-blue-500/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                    <feat.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Comment ça marche */}
        <section id="how-it-works" className="py-20 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">Workflow Opérationnel</h2>
              <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Processus en 3 étapes simples et sécurisées
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Configuration du Lien",
                  desc: "Définissez le nom de la campagne, la date de validité et la limite maximale de participants depuis l'espace admin."
                },
                {
                  step: "02",
                  title: "Diffusion & Capture",
                  desc: "Le participant accède à une interface fluide adaptée à son mobile ou ordinateur pour renseigner ses coordonnées."
                },
                {
                  step: "03",
                  title: "Traitement & Audit",
                  desc: "Les données sont immédiatement centralisées, prêtes pour l'analyse, l'annotation et l'exportation comptable."
                }
              ].map((step, idx) => (
                <div key={idx} className="relative glass-card rounded-2xl p-6 border-white/[0.06]">
                  <span className="text-3xl font-black text-blue-500/20 font-mono mb-4 block">{step.step}</span>
                  <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Sécurité */}
        <section id="security" className="py-20 border-t border-white/[0.06] bg-slate-950/40">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
              Sécurité de Niveau Entreprise
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-8">
              Chaque transaction et donnée collectée est protégée par un chiffrement complet en transit et au repos. L'architecture Supabase garantit l'isolation stricte des accès via Row Level Security (RLS).
            </p>
            <div className="inline-flex flex-wrap justify-center gap-3">
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-300">Protocole TLS 1.3</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-300">Chiffrement AES-256</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-300">Conformité RGPD / Protection des Données</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-300">Journalisation d'IP & User-Agent</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">NexusLink Solutions</span>
            <span>•</span>
            <span>Plateforme de collecte certifiée</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-white transition-colors">Portail Administrateur</Link>
            <a href="#security" className="hover:text-white transition-colors">Politique de Sécurité</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
