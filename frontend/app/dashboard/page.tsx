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
    ArrowRight,
    ExternalLink,
    Check,
    CheckCircle2,
    Activity,
    Layers,
    Smartphone,
    Building2,
    CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { dataService } from '@/lib/dataService';
import Link from 'next/link';
import ActivityChart from '@/components/charts/ActivityChart';
import SourcesChart from '@/components/charts/SourcesChart';
import LiveStats from '@/components/dashboard/LiveStats';
import GeographicMap from '@/components/dashboard/GeographicMap';

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
                dataService.getSubmissions(),
                dataService.getLinks()
            ]);

            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            const monthStr = now.toISOString().slice(0, 7);

            setStats({
                total: submissionsData.length,
                today: submissionsData.filter((s: any) => (s.created_at || '').startsWith(todayStr)).length,
                month: submissionsData.filter((s: any) => (s.created_at || '').startsWith(monthStr)).length,
                methods: {
                    orange: submissionsData.filter((s: any) => s.method === 'orange').length,
                    mtn: submissionsData.filter((s: any) => s.method === 'mtn').length,
                    wave: submissionsData.filter((s: any) => s.method === 'wave').length,
                    bank: submissionsData.filter((s: any) => s.method === 'bank').length,
                    other: submissionsData.filter((s: any) => s.method === 'other').length,
                }
            });

            // Activity Chart (7 derniers jours)
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d.toISOString().split('T')[0];
            });

            const chartData = last7Days.map(date => ({
                date: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
                count: submissionsData.filter((s: any) => (s.created_at || '').startsWith(date)).length
            }));
            setActivityData(chartData);

            setRecentSubmissions(
                submissionsData
                    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 7)
            );

            setLinks(
                linksData
                    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 5)
            );
        } catch (error) {
            console.error('Erreur chargement dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleCreateLink = async () => {
        if (!newCampaign.name.trim()) return;
        setIsCreating(true);
        try {
            const limitVal = parseInt(newCampaign.limit);
            const res = await dataService.createLink({
                name: newCampaign.name.trim(),
                submissions_limit: isNaN(limitVal) ? 0 : limitVal
            });

            const linkId = res.link_id || (res as any).id;
            const fullUrl = `${window.location.origin}/form/${linkId}`;

            try {
                await navigator.clipboard.writeText(fullUrl);
            } catch {}

            setCopyStatus(linkId);
            setNewCampaign({ name: '', limit: '' });
            fetchData();
            setTimeout(() => setCopyStatus(null), 3000);
        } catch (err: any) {
            alert(`Erreur: ${err.message || 'Impossible de créer le lien'}`);
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

    const sourcesData = [
        { name: 'Orange Money', value: stats.methods.orange, color: '#f97316' },
        { name: 'MTN Mobile', value: stats.methods.mtn, color: '#eab308' },
        { name: 'Wave', value: stats.methods.wave, color: '#06b6d4' },
        { name: 'Virements', value: stats.methods.bank, color: '#3b82f6' },
        { name: 'Autres', value: stats.methods.other, color: '#8b5cf6' },
    ].filter(item => item.value > 0);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                <p className="text-xs text-slate-400">Synchronisation des flux...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header du Dashboard */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Vue d'Ensemble & Télémétrie</h1>
                    <p className="text-xs text-slate-400 mt-1">Supervision globale des flux de capture et des campagnes</p>
                </div>

                {/* Formulaire rapide de création de lien */}
                <div className="glass-card rounded-xl p-2 flex flex-col sm:flex-row items-center gap-2">
                    <input
                        type="text"
                        placeholder="Nom de la campagne..."
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                        className="bg-slate-900/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full sm:w-48"
                    />
                    <input
                        type="number"
                        placeholder="Limite (optionnel)"
                        value={newCampaign.limit}
                        onChange={(e) => setNewCampaign({ ...newCampaign, limit: e.target.value })}
                        className="bg-slate-900/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full sm:w-32 font-mono"
                    />
                    <button
                        onClick={handleCreateLink}
                        disabled={isCreating || !newCampaign.name.trim()}
                        className="btn-premium py-1.5 px-3 text-xs w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                        {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>Créer Lien</span>
                    </button>
                </div>
            </div>

            {/* Notification de copie de lien */}
            {copyStatus && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Lien généré et copié dans le presse-papier avec succès !</span>
                </div>
            )}

            {/* Cartes KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card rounded-2xl p-5 border-white/[0.06]">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-slate-400">Total Soumissions</span>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                            <Layers className="w-4 h-4" />
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-white block font-mono">{stats.total}</span>
                    <span className="text-[11px] text-slate-400 mt-1 block">Toutes campagnes confondues</span>
                </div>

                <div className="glass-card rounded-2xl p-5 border-white/[0.06]">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-slate-400">Aujourd'hui</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                            <Activity className="w-4 h-4" />
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-white block font-mono">{stats.today}</span>
                    <span className="text-[11px] text-emerald-400 mt-1 block flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Activité journalière
                    </span>
                </div>

                <div className="glass-card rounded-2xl p-5 border-white/[0.06]">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-slate-400">Ce Mois</span>
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                            <Calendar className="w-4 h-4" />
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-white block font-mono">{stats.month}</span>
                    <span className="text-[11px] text-slate-400 mt-1 block">Volume mensuel consolidé</span>
                </div>

                <div className="glass-card rounded-2xl p-5 border-white/[0.06]">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-slate-400">Campagnes Actives</span>
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                            <Link2 className="w-4 h-4" />
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-white block font-mono">{links.length}</span>
                    <span className="text-[11px] text-slate-400 mt-1 block">Liens de formulaires</span>
                </div>
            </div>

            {/* Graphiques analytiques */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 border-white/[0.06]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-sm font-semibold text-white">Activité Réseau (7 Derniers Jours)</h2>
                            <p className="text-xs text-slate-400">Évolution chronologique des soumissions de formulaires</p>
                        </div>
                    </div>
                    <ActivityChart data={activityData} />
                </div>

                <div className="glass-card rounded-2xl p-6 border-white/[0.06]">
                    <div className="mb-6">
                        <h2 className="text-sm font-semibold text-white">Répartition par Méthode</h2>
                        <p className="text-xs text-slate-400">Ventilation des moyens de paiement</p>
                    </div>
                    <SourcesChart data={sourcesData} />
                </div>
            </div>

            {/* Section 2 colonnes : Campagnes & Dernières Soumissions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Liens récents */}
                <div className="glass-card rounded-2xl p-6 border-white/[0.06] flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-white">Campagnes Récentes</h2>
                            <Link href="/dashboard/links" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                Tout voir
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {links.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-6">Aucune campagne créée</p>
                            ) : (
                                links.map((link) => (
                                    <div key={link.id || link.link_id} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                                        <div className="truncate mr-2">
                                            <span className="text-xs font-semibold text-white block truncate">{link.name}</span>
                                            <span className="text-[10px] text-slate-400 font-mono">
                                                {link.submission_count || 0} {link.submissions_limit ? `/ ${link.submissions_limit}` : 'soumissions'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => copyDirectLink(link.link_id)}
                                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
                                            title="Copier le lien"
                                        >
                                            {copyStatus === link.link_id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Dernières Soumissions */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 border-white/[0.06]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-white">Dernières Soumissions</h2>
                        <Link href="/dashboard/submissions" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                            Voir toutes les entrées
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-white/[0.06] text-slate-400">
                                    <th className="pb-3 font-medium">Titulaire</th>
                                    <th className="pb-3 font-medium">Méthode</th>
                                    <th className="pb-3 font-medium">Coordonnées</th>
                                    <th className="pb-3 font-medium">Date</th>
                                    <th className="pb-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {recentSubmissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-400">
                                            Aucune soumission enregistrée
                                        </td>
                                    </tr>
                                ) : (
                                    recentSubmissions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3">
                                                <span className="font-medium text-white block">{sub.full_name}</span>
                                                <span className="text-[10px] text-slate-400 font-mono">{sub.phone}</span>
                                            </td>
                                            <td className="py-3">
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    {sub.method}
                                                </span>
                                            </td>
                                            <td className="py-3 font-mono text-slate-300">
                                                {sub.account_number}
                                            </td>
                                            <td className="py-3 text-slate-400 font-mono text-[11px]">
                                                {sub.created_at ? new Date(sub.created_at).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                            </td>
                                            <td className="py-3 text-right">
                                                <Link
                                                    href={`/dashboard/submissions/${sub.id}`}
                                                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium"
                                                >
                                                    Détails <ArrowRight className="w-3 h-3" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
