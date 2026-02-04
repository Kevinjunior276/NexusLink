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
    ExternalLink,
    PieChart as PieChartIcon,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import ActivityChart from '@/components/charts/ActivityChart';
import SourcesChart from '@/components/charts/SourcesChart';
import LiveStats from '@/components/dashboard/LiveStats';
import GeographicMap from '@/components/dashboard/GeographicMap';
import ServerStatus from '@/components/dashboard/ServerStatus';

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
    const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
    const [activityData, setActivityData] = useState<any[]>([]);
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

            // Calculate Stats
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

            // Prepare Activity Chart Data (Last 7 Days)
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d.toISOString().split('T')[0];
            });

            const chartData = last7Days.map(date => ({
                date: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
                count: submissionsData.filter((s: any) => s.created_at.startsWith(date)).length
            }));
            setActivityData(chartData);

            // Recent Submissions
            setRecentSubmissions(submissionsData.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 7));

            setLinks(linksData.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Auto-refresh every 10 seconds
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
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

    const handleDeleteSubmission = async (id: string) => {
        if (!confirm('Voulez-vous vraiment supprimer cette entrée ?')) return;
        try {
            await api.delete(`/submissions/${id}/`);
            // Optimistic update or refetch
            setRecentSubmissions(prev => prev.filter(s => s.id !== id));
            // Also refresh stats if needed, but simple filtering is faster for UI
            fetchData();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const sourcesData = [
        { name: 'Orange Money', value: stats.methods.orange, color: '#f97316' },
        { name: 'MTN Money', value: stats.methods.mtn, color: '#eab308' },
        { name: 'Wave Mobile', value: stats.methods.wave, color: '#3b82f6' },
        { name: 'Virements', value: stats.methods.bank, color: '#6366f1' },
        { name: 'Autres', value: stats.methods.other, color: '#888888' },
    ].filter(item => item.value > 0);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
        </div>
    );

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Status & Live Stats */}
            <div className="px-1 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h2 className="text-[11px] font-black uppercase tracking-[4px] text-white/30 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> PERFORMANCE DU RÉSEAU
                    </h2>
                    <ServerStatus />
                </div>
                <LiveStats stats={{ total: stats.total, today: stats.today, month: stats.month }} />
            </div>

            {/* Distribution and Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Chart */}
                <div className="lg:col-span-2 glass-card rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border-white/5 min-h-[350px] sm:min-h-[400px] flex flex-col bg-gradient-to-br from-brand-primary/[0.02] to-transparent relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 sm:p-10 opacity-[0.03] group-hover:opacity-10 transition-all pointer-events-none">
                        <Activity className="w-48 h-48 sm:w-64 sm:h-64 text-brand-primary" />
                    </div>
                    <div className="flex items-center justify-between mb-6 sm:mb-8 relative z-10">
                        <h3 className="text-[9px] sm:text-[11px] font-black uppercase tracking-[2px] sm:tracking-[3px] text-brand-primary flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> ACTIVITÉ DU RÉSEAU <span className="opacity-40 text-[8px] sm:text-[9px] ml-1 sm:ml-2 bg-white/5 py-1 px-2 rounded-lg">7 JOURS</span>
                        </h3>
                    </div>
                    <div className="flex-1 w-full h-[250px] sm:h-[300px] -ml-1 sm:-ml-2">
                        <ActivityChart data={activityData} />
                    </div>
                </div>

                {/* Sources Chart */}
                <div className="glass-card rounded-[40px] p-8 sm:p-10 border-white/5 min-h-[400px] flex flex-col">
                    <h3 className="text-[11px] font-black uppercase tracking-[3px] text-brand-primary mb-2 flex items-center gap-2">
                        <PieChartIcon className="w-4 h-4" /> RÉPARTITION
                    </h3>
                    <div className="flex-1 relative min-h-[200px]">
                        <SourcesChart data={sourcesData} />
                        {/* Center Label Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <span className="text-2xl font-black text-white">{stats.total}</span>
                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Total</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3 mt-4">
                        {[
                            { l: 'Orange Money', v: stats.methods.orange, e: '🟠', color: 'text-orange-500', bg: 'bg-orange-500' },
                            { l: 'MTN Money', v: stats.methods.mtn, e: '🟡', color: 'text-yellow-500', bg: 'bg-yellow-500' },
                            { l: 'Wave Mobile', v: stats.methods.wave, e: '🌊', color: 'text-blue-400', bg: 'bg-blue-400' },
                            { l: 'Virements', v: stats.methods.bank, e: '🏦', color: 'text-indigo-400', bg: 'bg-indigo-400' },
                            { l: 'Autres', v: stats.methods.other, e: '📱', color: 'text-white', bg: 'bg-gray-500' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-1.5 h-1.5 rounded-full ring-2 ring-opacity-20", item.bg, `ring-${item.color.split('-')[1]}-500`)} />
                                    <span className="text-[10px] font-bold uppercase text-brand-text-dim group-hover:text-white transition-colors">{item.l}</span>
                                </div>
                                <div className={cn("text-[10px] font-black", item.color)}>
                                    {stats.total > 0 ? Math.round((item.v / stats.total) * 100) : 0}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Link Generator - Optimized for Mobile */}
            <section className="glass-card rounded-[32px] sm:rounded-[40px] p-6 sm:p-14 border-brand-primary/20 bg-brand-primary/[0.02] relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Link2 className="w-24 h-24 sm:w-32 sm:h-32 text-brand-primary" />
                </div>

                <h3 className="text-[9px] sm:text-[11px] font-black uppercase tracking-[3px] sm:tracking-[4px] text-brand-primary mb-8 sm:mb-12 flex items-center gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-[10px] sm:text-xs">🔗</div>
                    GÉNÉRATEUR DE LIEN
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-8 sm:mb-10">
                    <div className="space-y-2 sm:space-y-4">
                        <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-[2px] sm:tracking-[3px] text-brand-primary/60 ml-1">Nom de Campagne</label>
                        <input
                            type="text"
                            value={newCampaign.name}
                            onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })}
                            placeholder="Ex: Campagne Alpha"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl py-4 sm:py-5 px-6 sm:px-8 text-xs sm:text-sm outline-none focus:border-brand-primary/40 focus:bg-white/[0.05] transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2 sm:space-y-4">
                        <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-[2px] sm:tracking-[3px] text-brand-primary/60 ml-1">Limite Captures</label>
                        <input
                            type="number"
                            value={newCampaign.limit}
                            onChange={e => setNewCampaign({ ...newCampaign, limit: e.target.value })}
                            placeholder="∝ Illimité"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl py-4 sm:py-5 px-6 sm:px-8 text-xs sm:text-sm outline-none focus:border-brand-primary/40 focus:bg-white/[0.05] transition-all font-bold"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <button
                        onClick={handleCreateLink}
                        disabled={isCreating || !newCampaign.name}
                        className="w-full sm:w-auto btn-premium px-8 sm:px-16 py-4 sm:py-6 rounded-xl sm:rounded-[24px] text-[10px] sm:text-[11px] font-black uppercase tracking-[3px] sm:tracking-[5px] flex items-center justify-center gap-3 sm:gap-4 shadow-2xl disabled:opacity-50"
                    >
                        {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 stroke-[3px]" />}
                        GÉNÉRER LE LIEN
                    </button>
                    <AnimatePresence>
                        {copyStatus && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center gap-2 text-green-400 font-black text-[9px] sm:text-[10px] uppercase tracking-widest">
                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> COPIÉ !
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Recent Submissions - Responsive List */}
            <section className="glass-card rounded-[32px] overflow-hidden border-white/5 bg-white/[0.01]">
                <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[3px] text-white/50 flex items-center gap-2">
                        <Users className="w-4 h-4" /> Transactions Récentes
                    </h3>
                    <Link href="/dashboard/submissions" className="text-[9px] sm:text-[10px] font-bold text-brand-primary hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1 bg-brand-primary/10 px-3 py-1.5 rounded-lg">
                        Voir tout <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/[0.02]">
                            <tr>
                                <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-white/30">ID / Date</th>
                                <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-white/30">Client</th>
                                <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-white/30">Méthode</th>
                                <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-white/30">Statut</th>
                                <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-white/30 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentSubmissions.length > 0 ? (
                                recentSubmissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white group-hover:text-brand-primary transition-colors">#{sub.id.toString().slice(-4)}</span>
                                                <span className="text-[10px] font-medium text-white/30">{new Date(sub.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black border border-white/10 group-hover:border-brand-primary/30 transition-colors">
                                                    {sub.data?.fullName ? sub.data.fullName.charAt(0) : '?'}
                                                </div>
                                                <span className="text-sm font-medium text-white/80">{sub.data?.fullName || 'Anonyme'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                                                sub.method === 'orange' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                                    sub.method === 'mtn' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                                                        sub.method === 'wave' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                                            sub.method === 'bank' ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" :
                                                                "bg-white/5 text-white/50 border-white/10"
                                            )}>
                                                {sub.method}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="flex items-center gap-2 text-[10px] font-bold text-green-400 uppercase tracking-wider bg-green-500/5 px-3 py-1 rounded-full border border-green-500/10 max-w-fit">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                                    Sécurisé
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteSubmission(sub.id);
                                                }}
                                                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/10 group/del"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-10 text-center text-xs italic text-white/20">Aucune transaction récente</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-white/5">
                    {recentSubmissions.length > 0 ? (
                        recentSubmissions.map((sub) => (
                            <div key={sub.id} className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-black border border-white/10">
                                            {sub.data?.fullName ? sub.data.fullName.charAt(0) : '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white tracking-tight">{sub.data?.fullName || 'Anonyme'}</p>
                                            <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest">#{sub.id.toString().slice(-4)} • {new Date(sub.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider border",
                                        sub.method === 'orange' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                            sub.method === 'mtn' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                                                sub.method === 'wave' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                                    sub.method === 'bank' ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" :
                                                        "bg-white/5 text-white/50 border-white/10"
                                    )}>
                                        {sub.method}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                    <span className="text-[9px] font-black text-green-400 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        Capturé avec succès
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSubmission(sub.id);
                                            }}
                                            className="p-2 bg-red-500/10 rounded-lg border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <Link href="/dashboard/submissions" className="p-2 bg-white/5 rounded-lg border border-white/10">
                                            <ArrowRight className="w-4 h-4 text-white/40" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center text-xs italic text-white/20 uppercase tracking-widest">Aucune donnée</div>
                    )}
                </div>
            </section>

            {/* Geographic Map */}
            <GeographicMap />

            {/* Recent Links */}
            <div className="space-y-8">
                <div className="flex items-center gap-6">
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
                                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-text-dim/40 mb-1">CAPTURES / LIMITE</p>
                                        <p className="text-xs font-black text-white">
                                            {link.submission_count} / {link.submissions_limit === 0 ? '∝' : link.submissions_limit}
                                        </p>
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
