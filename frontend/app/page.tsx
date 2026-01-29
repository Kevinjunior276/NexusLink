'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import HeroChart from '@/components/charts/HeroChart';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prices, setPrices] = useState([
    { s: 'BTC', p: 48512.4, c: 2.45 },
    { s: 'ETH', p: 2614.9, c: -1.2 },
    { s: 'SOL', p: 104.2, c: 5.7 },
    { s: 'XRP', p: 0.54, c: 0.8 },
  ]);

  const [trades, setTrades] = useState([
    { id: 1, type: 'buy', price: '48,512', amount: '0.24', time: '12:04:32' },
    { id: 2, type: 'sell', price: '48,510', amount: '1.50', time: '12:04:31' },
    { id: 3, type: 'buy', price: '48,514', amount: '0.05', time: '12:04:29' },
  ]);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setPrices(prev => prev.map(x => ({
        ...x,
        p: x.p + (Math.random() - 0.5) * 5,
        c: x.c + (Math.random() - 0.5) * 0.1
      })));

      setTrades(prev => [
        {
          id: Date.now(),
          type: Math.random() > 0.5 ? 'buy' : 'sell',
          price: (48000 + Math.random() * 1000).toFixed(0),
          amount: (Math.random() * 2).toFixed(2),
          time: new Date().toLocaleTimeString('fr-FR', { hour12: false })
        },
        ...prev.slice(0, 4)
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen selection:bg-brand-primary/30">
      {/* Navigation Responsive */}
      <nav className="fixed top-0 w-full z-[100] nav-blur border-b border-brand-border h-16 sm:h-20">
        <div className="container mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-10">
            <Link href="/" className="font-display text-base sm:text-lg font-bold tracking-tighter flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-brand-primary rounded-sm rotate-12 flex items-center justify-center">
                <span className="text-[8px] sm:text-[10px] text-white -rotate-12">₿</span>
              </div>
              CTP <span className="opacity-40 font-normal">PRO</span>
            </Link>
            <div className="hidden lg:flex gap-10 text-[12px] font-medium tracking-wide text-brand-text-dim uppercase">
              <Link href="#" className="hover:text-white transition-all underline-offset-8 hover:underline">Marchés</Link>
              <Link href="#" className="hover:text-white transition-all underline-offset-8 hover:underline">Liquidité</Link>
              <Link href="#" className="hover:text-white transition-all underline-offset-8 hover:underline">Sécurité</Link>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/login" className="hidden sm:block text-[12px] font-bold hover:text-brand-primary transition-colors tracking-widest uppercase">Espace Admin</Link>
            <Link href="/login" className="btn-premium py-1.5 sm:py-2 px-4 sm:px-8 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">Connexion</Link>

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
      {mobileMenuOpen && (
        <div className="mobile-menu-active lg:hidden">
          <Link href="#" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-primary transition-colors">Marchés</Link>
          <Link href="#" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-primary transition-colors">Liquidité</Link>
          <Link href="#" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-primary transition-colors">Sécurité</Link>
          <div className="h-px w-20 bg-brand-border my-4"></div>
          <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm uppercase tracking-widest font-bold">Connexion</Link>
        </div>
      )}

      {/* Hero Section */}
      <main className="relative">
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20 px-4">
          <HeroChart />

          <div className="container mx-auto text-center max-w-5xl relative z-20">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/5 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mb-8 sm:mb-12 animate-fade-in text-brand-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_12px_rgba(0,112,243,1)]"></span>
              Mainnet LIVE 2.0
            </div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-[110px] font-bold tracking-tighter leading-[1.0] sm:leading-[0.95] mb-6 sm:mb-10 animate-fade-in">
              Tradez sans <br />
              <span className="text-glow underline decoration-brand-primary/30 decoration-4 sm:decoration-8 underline-offset-[-2px]">limites.</span>
            </h1>

            <p className="text-brand-text-dim text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 sm:mb-16 font-medium leading-relaxed px-4">
              La plateforme institutionnelle pour les actifs numériques. <br className="hidden md:block" />
              Vitesse d&apos;exécution de <span className="text-white">sub-microseconde</span> garantie.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 relative z-20 w-full sm:w-auto px-6">
              <Link href="/login" className="btn-premium w-full sm:w-auto text-xs sm:text-sm px-8 sm:px-12 py-3 sm:py-4 shadow-2xl">
                Accéder au Dashboard Admin
              </Link>
              <Link href="#" className="group w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 rounded-full border border-brand-border hover:border-brand-primary/50 transition-all text-xs sm:text-sm font-bold uppercase tracking-tighter bg-white/5 flex items-center justify-center gap-3">
                Live Terminal
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Scrolling Tickers - More compact on mobile */}
          <div className="absolute bottom-0 w-full border-t border-brand-border py-4 sm:py-6 overflow-hidden bg-brand-bg/50 backdrop-blur-sm">
            <div className="flex gap-8 sm:gap-12 whitespace-nowrap animate-[marquee_20s_linear_infinite]">
              {prices.concat(prices).map((crypto, i) => (
                <div key={i} className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 border-r border-brand-border h-6 sm:h-8">
                  <span className="text-[10px] sm:text-[12px] font-bold text-brand-text-dim uppercase tracking-widest">{crypto.s}</span>
                  <span className="text-[11px] sm:text-[13px] font-display font-medium text-white">${crypto.p.toLocaleString()}</span>
                  <span className={`text-[9px] sm:text-[11px] font-bold ${crypto.c >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {crypto.c >= 0 ? '▲' : '▼'} {Math.abs(crypto.c).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive Dashboard Mockup */}
        <section className="py-20 sm:py-32 px-4 sm:px-6 relative">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-[24px] sm:rounded-[32px] blur opacity-25"></div>
              <div className="relative glass-card border-white/10 rounded-[20px] sm:rounded-[28px] overflow-hidden shadow-2xl">
                {/* Interface Header */}
                <div className="h-8 sm:h-10 border-b border-white/5 bg-white/5 flex items-center px-4 sm:px-6 gap-2">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500/50" />
                  <div className="ml-4 text-[8px] sm:text-[10px] uppercase font-bold tracking-widest opacity-20 truncate">Trading Terminal | BTC/USDT</div>
                </div>
                {/* Interface Content - Stack on mobile */}
                <div className="flex flex-col md:grid md:grid-cols-4 h-auto md:h-[500px]">
                  <div className="col-span-3 border-b md:border-b-0 md:border-r border-white/5 bg-[#03040b] p-6 sm:p-8 relative min-h-[300px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 sm:mb-12">
                      <div>
                        <div className="text-2xl sm:text-3xl font-display font-medium text-white mb-1 tracking-tight">$48,512.24</div>
                        <div className="text-green-400 text-xs font-bold">+2.45% (24h)</div>
                      </div>
                      <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                        {['1m', '5m', '1h', '4h', '1D', '1W'].map(t => (
                          <span key={t} className={`px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold rounded-md ${t === '1h' ? 'bg-brand-primary text-white' : 'text-white/10'}`}>{t}</span>
                        ))}
                      </div>
                    </div>
                    {/* Simulated Graph Lines */}
                    <div className="h-40 sm:h-full w-full opacity-10 absolute bottom-0 left-0">
                      <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none">
                        <path d="M0 250 Q 150 200, 300 280 T 600 150 T 1000 250" fill="none" stroke="white" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                  {/* Realtime Action Bar - Scrollable on mobile */}
                  <div className="p-4 sm:p-6 bg-white/[0.02]">
                    <div className="text-[9px] sm:text-[10px] font-bold text-white/40 uppercase mb-4 sm:mb-6 tracking-widest">Derniers Trades</div>
                    <div className="space-y-3 sm:space-y-4 max-h-[200px] md:max-h-none overflow-y-auto">
                      {trades.map(trade => (
                        <div key={trade.id} className="flex justify-between text-[10px] sm:text-[11px] font-medium">
                          <span className={trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}>{trade.price}</span>
                          <span className="text-white opacity-40">{trade.amount}</span>
                          <span className="text-brand-text-dim opacity-20 hidden sm:block">{trade.time}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 sm:mt-12">
                      <div className="flex gap-2">
                        <div className="flex-1 bg-green-500/10 text-green-400 py-3 rounded-xl text-center text-[9px] sm:text-[10px] font-black uppercase">Acheter</div>
                        <div className="flex-1 bg-red-500/10 text-red-500 py-3 rounded-xl text-center text-[9px] sm:text-[10px] font-black uppercase">Vendre</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Responsive Stats */}
        <section className="container mx-auto py-16 sm:py-24 px-4 sm:px-6">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { l: 'Volume 24h', v: '$2.4B+' },
              { l: 'Uptime', v: '99.999%' },
              { l: 'Transactions', v: '50M+' },
              { l: 'Sécurité', v: 'AES-256' },
            ].map((s, i) => (
              <div key={i} className="glass-card hover:bg-white/5 rounded-2xl p-6 sm:p-8 border-white/5">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium mb-2 tracking-tighter text-glow-white whitespace-nowrap">{s.v}</div>
                <div className="text-[9px] sm:text-[11px] font-bold text-brand-text-dim uppercase tracking-[2px] sm:tracking-[3px]">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Grid - Responsive Stacking */}
        <section className="container mx-auto px-4 sm:px-6 pb-20 sm:pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-border border border-brand-border rounded-2xl sm:rounded-3xl overflow-hidden glass-card">
            {[
              { t: 'Moteur d&apos;exécution', d: 'Latence ultra-faible pour vos ordres critiques.', icon: '⚡' },
              { t: 'Sécurisation Cold-Wallet', d: 'Protection institutionnelle de vos actifs.', icon: '🛡️' },
              { t: 'Visualisation Avancée', d: 'Graphiques haute précision en temps réel.', icon: '📈' },
              { t: 'API Développeur', d: 'Connectivité REST et Webhook haute fréquence.', icon: '📟' },
            ].map((f, i) => (
              <div key={i} className="bg-brand-bg p-8 sm:p-12 hover:bg-white/[0.02] transition-all group">
                <span className="inline-block text-2xl sm:text-3xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform">{f.icon}</span>
                <h3 className="text-lg sm:text-xl font-display font-bold mb-2 sm:mb-4">{f.t}</h3>
                <p className="text-brand-text-dim text-xs sm:text-sm leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 sm:py-40 px-6 text-center bg-gradient-to-b from-brand-bg via-brand-primary/5 to-brand-bg">
          <div className="container mx-auto">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold mb-6 sm:mb-10 tracking-tight">Prêt pour l&apos;avant-garde ?</h2>
            <Link href="/register" className="btn-premium px-10 sm:px-16 py-4 sm:py-6 text-sm sm:text-base inline-block">Rejoindre CryptoTrade Pro</Link>
            <div className="mt-6 sm:mt-8 text-brand-text-dim text-xs sm:text-sm opacity-60 px-4">Rejoignez plus de 1M+ traders professionnels aujourd'hui.</div>
          </div>
        </section>
      </main>

      {/* Responsive Footer */}
      <footer className="border-t border-brand-border py-16 sm:py-20 px-4 sm:px-6 bg-brand-bg">
        <div className="container mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-16 sm:mb-20">
          <div className="col-span-2 lg:col-span-2">
            <div className="font-display text-xl sm:text-2xl font-bold tracking-tighter mb-4 sm:mb-6">CTP PRO</div>
            <p className="text-brand-text-dim text-xs sm:text-sm max-w-sm">La première infrastructure de trading de grade institutionnel accessible à tous. Sécurité, Vitesse, Liquidité.</p>
          </div>
          <div className="col-span-1">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-white mb-4 sm:mb-6">Plateforme</h4>
            <ul className="space-y-3 sm:space-y-4 text-brand-text-dim text-[11px] sm:text-[13px]">
              <li><Link href="#" className="hover:text-white transition-colors">Documentation API</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terminal</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Frais</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-white mb-4 sm:mb-6">Compagnie</h4>
            <ul className="space-y-3 sm:space-y-4 text-brand-text-dim text-[11px] sm:text-[13px]">
              <li><Link href="#" className="hover:text-white transition-colors">À Propos</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Légal</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Media</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 opacity-40 text-[9px] sm:text-[11px] font-bold tracking-widest uppercase border-t border-white/5 pt-10 text-center sm:text-left">
          <div>© 2026 CTP PRO | ALL SYSTEMS OPERATIONAL</div>
          <div className="flex gap-6 sm:gap-8">
            <Link href="#" className="hover:text-brand-primary transition-colors">X / Twitter</Link>
            <Link href="#" className="hover:text-brand-primary transition-colors">LinkedIn</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
