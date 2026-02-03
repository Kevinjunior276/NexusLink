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
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
    <div className="relative min-h-screen selection:bg-brand-primary/30 bg-[#020308]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] nav-blur border-b border-brand-border h-16 sm:h-20">
        <div className="container mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-10">
            <Link href="/" className="font-display text-base sm:text-lg font-bold tracking-tighter flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-brand-primary rounded-sm rotate-12 flex items-center justify-center">
                <span className="text-[8px] sm:text-[10px] text-white -rotate-12">₿</span>
              </div>
              NLS <span className="opacity-40 font-normal">PRO</span>
            </Link>
            <div className="hidden lg:flex gap-10 text-[10px] font-black tracking-widest text-brand-text-dim uppercase">
              <button onClick={() => scrollToSection('features')} className="hover:text-white transition-all underline-offset-8 hover:underline italic">Fonctionnalités</button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-all underline-offset-8 hover:underline italic">Comment ça marche</button>
              <button onClick={() => scrollToSection('security')} className="hover:text-white transition-all underline-offset-8 hover:underline italic">Sécurité</button>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/login" className="hidden sm:block text-[10px] font-black hover:text-brand-primary transition-colors tracking-widest uppercase italic">Espace Admin</Link>
            <Link href="/login" className="btn-premium py-1.5 sm:py-2.5 px-6 sm:px-10 text-[9px] sm:text-[11px] font-black uppercase tracking-widest whitespace-nowrap italic">Connexion</Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5 z-[101]"
            >
              <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[100] bg-brand-bg flex flex-col items-center justify-center gap-10"
          >
            <button onClick={() => scrollToSection('features')} className="text-xl font-black uppercase tracking-[4px] italic">Fonctionnalités</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-xl font-black uppercase tracking-[4px] italic">Comment ça marche</button>
            <button onClick={() => scrollToSection('security')} className="text-xl font-black uppercase tracking-[4px] italic">Sécurité</button>
            <div className="h-px w-20 bg-brand-border my-4"></div>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-black uppercase tracking-[4px] text-brand-primary italic">Se Connecter</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <main className="relative">
        <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20 px-4">
          {/* Background Decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto text-center max-w-5xl relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-brand-primary/20 bg-brand-primary/5 text-[9px] sm:text-[10px] font-black tracking-[4px] uppercase mb-8 sm:mb-12 text-brand-primary italic"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_12px_rgba(0,112,243,1)]"></span>
              SYSTÈME SÉCURISÉ SSL 256-BIT
            </motion.div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-[110px] font-bold tracking-tighter leading-[1.0] sm:leading-[0.95] mb-6 sm:mb-10 animate-fade-in uppercase">
              Capturez des <br />
              <span className="text-glow italic underline decoration-brand-primary/30 decoration-4 sm:decoration-8 underline-offset-[-2px]">informations.</span>
            </h1>

            <p className="text-brand-text-dim text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 sm:mb-20 font-medium leading-relaxed px-4 opacity-80">
              Plateforme professionnelle de génération de liens sécurisés. <br className="hidden md:block" />
              Collectez des <span className="text-white font-bold italic underline decoration-brand-primary underline-offset-4">informations de paiement</span> en toute discrétion.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-20 w-full sm:w-auto px-6">
              <Link href="/login" className="btn-premium w-full sm:w-auto text-[11px] px-10 sm:px-14 py-4 sm:py-5 shadow-2xl font-black italic">
                ACCÉDER AU DASHBOARD <ArrowRight className="inline-block ml-3 w-4 h-4" />
              </Link>
              <button
                onClick={() => scrollToSection('features')}
                className="group w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 rounded-full border border-white/10 hover:border-brand-primary/40 transition-all text-[11px] font-black uppercase tracking-[3px] bg-white/[0.02] flex items-center justify-center gap-3 italic"
              >
                VOIR COMMENT ÇA MARCHE
              </button>
            </div>
          </div>

          {/* Stats Ticker */}
          <div className="absolute bottom-0 w-full border-t border-brand-border py-4 sm:py-6 overflow-hidden bg-brand-bg/50 backdrop-blur-sm z-30">
            <div className="flex gap-12 sm:gap-20 whitespace-nowrap animate-[marquee_25s_linear_infinite]">
              {[
                { label: 'Liens Générés', value: '2,847+', icon: '🔗' },
                { label: 'Soumissions', value: '1,523+', icon: '📊' },
                { label: 'Taux de Conversion', value: '94%', icon: '📈' },
                { label: 'Uptime', value: '99.9%', icon: '⚡' },
              ].concat([
                { label: 'Liens Générés', value: '2,847+', icon: '🔗' },
                { label: 'Soumissions', value: '1,523+', icon: '📊' },
                { label: 'Taux de Conversion', value: '94%', icon: '📈' },
                { label: 'Uptime', value: '99.9%', icon: '⚡' },
              ]).map((stat, i) => (
                <div key={i} className="flex items-center gap-5 sm:gap-6 px-4">
                  <span className="text-2xl">{stat.icon}</span>
                  <div>
                    <div className="text-[10px] sm:text-[11px] font-black text-brand-text-dim uppercase tracking-[4px]">{stat.label}</div>
                    <div className="text-[12px] sm:text-[14px] font-display font-bold text-white tracking-tight">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: FEATURES */}
        <section id="features" className="py-24 sm:py-40 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-20">
              <h2 className="text-[10px] font-black uppercase tracking-[8px] text-brand-primary mb-6 italic">/// FONCTIONNALITÉS CLÉS</h2>
              <h3 className="text-4xl sm:text-6xl font-display font-bold tracking-tight mb-8">Tout ce dont vous avez besoin</h3>
              <p className="text-brand-text-dim max-w-2xl mx-auto font-medium leading-relaxed italic opacity-60">Générez des liens sécurisés, capturez des informations de paiement, et gérez tout depuis un dashboard professionnel.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Link2,
                  title: 'Génération de Liens',
                  desc: 'Créez des liens sécurisés personnalisés en quelques clics. Chaque lien est unique et traçable.',
                  stats: ['Illimité', 'Personnalisable', 'Traçable']
                },
                {
                  icon: ShieldCheck,
                  title: 'Capture Sécurisée',
                  desc: 'Collectez des informations de paiement (Orange Money, MTN, Wave, Banque) avec cryptage SSL 256-bit.',
                  stats: ['SSL 256-bit', 'RGPD', 'Sécurisé']
                },
                {
                  icon: BarChart2,
                  title: 'Dashboard Pro',
                  desc: 'Visualisez toutes vos soumissions, exportez en PDF, filtrez par date/méthode, et recevez des notifications.',
                  stats: ['Temps réel', 'Export PDF', 'Filtres']
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-[32px] p-10 border-white/5 hover:border-brand-primary/20 transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8 text-brand-primary" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 uppercase tracking-wider">{feature.title}</h4>
                  <p className="text-brand-text-dim text-sm mb-6 leading-relaxed">{feature.desc}</p>
                  <div className="flex gap-2 flex-wrap">
                    {feature.stats.map((stat, j) => (
                      <span key={j} className="text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-primary">
                        {stat}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: HOW IT WORKS */}
        <section id="how-it-works" className="py-24 sm:py-40 relative bg-white/[0.01]">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-20">
              <h2 className="text-[10px] font-black uppercase tracking-[8px] text-brand-primary mb-6 italic">/// PROCESSUS SIMPLE</h2>
              <h3 className="text-4xl sm:text-6xl font-display font-bold tracking-tight mb-8">Comment ça marche</h3>
              <p className="text-brand-text-dim max-w-2xl mx-auto font-medium leading-relaxed italic opacity-60">En 3 étapes simples, commencez à capturer des informations de paiement de manière professionnelle.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {[
                {
                  step: '01',
                  title: 'Créez un Lien',
                  desc: 'Connectez-vous au dashboard et générez un lien sécurisé personnalisé. Définissez un nom de campagne et une limite optionnelle.',
                  icon: Link2
                },
                {
                  step: '02',
                  title: 'Partagez le Lien',
                  desc: 'Envoyez le lien à vos cibles par email, SMS, ou tout autre canal. Le formulaire est optimisé pour la conversion.',
                  icon: Zap
                },
                {
                  step: '03',
                  title: 'Collectez les Données',
                  desc: 'Recevez des notifications en temps réel. Visualisez, filtrez et exportez toutes les soumissions depuis le dashboard.',
                  icon: CheckCircle2
                }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="relative"
                >
                  <div className="text-[80px] font-display font-black text-brand-primary/10 absolute -top-8 -left-4">{step.step}</div>
                  <div className="relative z-10 glass-card rounded-[32px] p-8 border-white/5">
                    <div className="w-14 h-14 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-6">
                      <step.icon className="w-7 h-7 text-brand-primary" />
                    </div>
                    <h4 className="text-lg font-bold mb-4 uppercase tracking-wide">{step.title}</h4>
                    <p className="text-brand-text-dim text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: DASHBOARD PREVIEW */}
        <section className="py-24 sm:py-40 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-20">
              <h2 className="text-[10px] font-black uppercase tracking-[8px] text-brand-primary mb-6 italic">/// DASHBOARD PROFESSIONNEL</h2>
              <h3 className="text-4xl sm:text-6xl font-display font-bold tracking-tight mb-8">Gérez tout en un seul endroit</h3>
            </div>

            <div className="glass-card rounded-[40px] p-8 sm:p-12 border-white/5 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { icon: Bell, title: 'Notifications en Temps Réel', desc: 'Son + toast animé pour chaque nouvelle soumission' },
                  { icon: FileText, title: 'Export PDF Professionnel', desc: 'Téléchargez des rapports PDF avec branding complet' },
                  { icon: Filter, title: 'Filtres Avancés', desc: 'Filtrez par méthode, statut, et plage de dates' },
                  { icon: MapPin, title: 'Carte Géographique', desc: 'Visualisez d\'où viennent vos soumissions' },
                  { icon: BarChart2, title: 'Statistiques Live', desc: 'Auto-refresh toutes les 10s avec indicateurs de tendance' },
                  { icon: Lock, title: 'Sécurité Maximale', desc: 'Cryptage SSL 256-bit + conformité RGPD' },
                ].map((feat, i) => (
                  <div key={i} className="flex gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-primary/20 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                      <feat.icon className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm mb-2 uppercase tracking-wide">{feat.title}</h5>
                      <p className="text-brand-text-dim text-xs leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section: SECURITY */}
        <section id="security" className="py-24 sm:py-40 relative">
          <div className="container mx-auto px-6">
            <div className="glass-card rounded-[60px] p-16 sm:p-24 border-brand-primary/10 relative overflow-hidden flex flex-col items-center text-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 via-transparent to-brand-secondary/5" />
              <div className="w-24 h-24 rounded-3xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-12 shadow-inner border border-brand-primary/20"><ShieldCheck className="w-12 h-12" /></div>

              <h2 className="text-[10px] font-black uppercase tracking-[10px] text-brand-primary mb-8 italic">/// SÉCURITÉ MAXIMALE</h2>
              <h3 className="text-4xl sm:text-7xl font-display font-bold tracking-tight mb-12 max-w-4xl">Vos données, sous protection totale.</h3>

              <p className="text-brand-text-dim text-xl max-w-3xl mb-20 font-medium leading-relaxed italic opacity-80">Toutes les données sont cryptées avec SSL 256-bit. Conformité RGPD garantie. Niveau de sécurité bancaire.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl">
                {[
                  { icon: Lock, t: 'Cryptage SSL 256-bit', d: 'Protection maximale des données.' },
                  { icon: ShieldCheck, t: 'Conformité RGPD', d: 'Respect total de la vie privée.' },
                  { icon: Globe, t: 'Sécurité Bancaire', d: 'Niveau de sécurité 3.' },
                ].map((sec, i) => (
                  <div key={i} className="flex flex-col items-center gap-6 p-10 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-brand-primary/20 transition-all hover:-translate-y-2">
                    <sec.icon className="w-10 h-10 text-brand-primary" />
                    <div className="space-y-2">
                      <div className="font-bold uppercase tracking-widest text-sm italic">{sec.t}</div>
                      <p className="text-[11px] text-brand-text-dim italic">{sec.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section: CTA */}
        <section className="py-40 px-6 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[160px] opacity-40" />
          <div className="container mx-auto relative z-10">
            <h2 className="text-4xl sm:text-7xl font-display font-bold mb-12 tracking-tighter uppercase italic">Commencez dès maintenant.</h2>
            <Link href="/login" className="btn-premium px-16 sm:px-24 py-5 sm:py-8 text-sm sm:text-lg inline-block italic shadow-[0_30px_60px_-15px_rgba(0,112,243,0.5)]">ACCÉDER AU DASHBOARD</Link>
            <div className="mt-12 text-brand-text-dim text-xs font-black uppercase tracking-[5px] opacity-40 italic">Système sécurisé et conforme RGPD.</div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-border py-20 px-6 bg-[#020308] relative z-20">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-16 mb-24">
          <div className="col-span-2 space-y-8">
            <div className="font-display text-3xl font-bold tracking-tighter italic">NLS PRO <span className="text-brand-primary">.</span></div>
            <p className="text-brand-text-dim text-sm max-w-sm leading-relaxed italic">NexusLink Solutions : Infrastructure d'entreprise pour la génération de liens sécurisés et la capture de flux de paiement.</p>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest opacity-40">
              <Link href="#" className="hover:text-brand-primary transition-all">Twitter / X</Link>
              <Link href="#" className="hover:text-brand-primary transition-all">LinkedIn</Link>
              <Link href="#" className="hover:text-brand-primary transition-all">Telegram</Link>
            </div>
          </div>
          <div className="space-y-10">
            <h4 className="text-[11px] uppercase font-black tracking-[4px] text-white italic">Plateforme</h4>
            <ul className="space-y-5 text-brand-text-dim text-[12px] font-bold italic">
              <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors underline-offset-4 hover:underline">Fonctionnalités</button></li>
              <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors underline-offset-4 hover:underline">Comment ça marche</button></li>
              <li><button onClick={() => scrollToSection('security')} className="hover:text-white transition-colors underline-offset-4 hover:underline">Sécurité</button></li>
            </ul>
          </div>
          <div className="space-y-10">
            <h4 className="text-[11px] uppercase font-black tracking-[4px] text-white italic">Documents</h4>
            <ul className="space-y-5 text-brand-text-dim text-[12px] font-bold italic">
              <li><Link href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline">Documentation</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline">Legal</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline">Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-8 opacity-30 text-[10px] font-black tracking-[5px] uppercase border-t border-white/5 pt-12 text-center pointer-events-none italic">
          <div>© 2026 NexusLink Solutions | SYSTÈME SÉCURISÉ</div>
          <div>SSL 256-BIT • RGPD COMPLIANT</div>
        </div>
      </footer>
    </div>
  );
}
