'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Search,
    Download,
    Trash2,
    RefreshCcw,
    Loader2,
    Filter,
    ArrowUpDown,
    FileText
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { api } from '@/lib/api';
import NotificationToast from '@/components/dashboard/NotificationToast';
import { generateSubmissionPDF } from '@/lib/pdfExport';
import FilterPanel, { FilterState } from '@/components/dashboard/FilterPanel';

interface Submission {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    method: string;
    country_name?: string;
    country_code?: string;
    created_at: string;
    status: string;
}

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<FilterState>({
        method: '',
        dateFrom: '',
        dateTo: '',
        status: ''
    });

    const fetchSubmissions = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.get('/submissions/');
            if (data) {
                setSubmissions(data);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubmissions();
        const interval = setInterval(fetchSubmissions, 30000);
        return () => clearInterval(interval);
    }, [fetchSubmissions]);

    const deleteSubmission = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette soumission ?')) return;
        try {
            await api.delete(`/submissions/${id}/`);
            fetchSubmissions();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const filteredSubmissions = useMemo(() => {
        return submissions.filter(s => {
            // Search filter
            const matchesSearch = s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.phone.includes(searchQuery);

            // Method filter
            const matchesMethod = !filters.method || s.method.toLowerCase() === filters.method.toLowerCase();

            // Status filter
            const matchesStatus = !filters.status || s.status.toLowerCase() === filters.status.toLowerCase();

            // Date filters
            const submissionDate = new Date(s.created_at);
            const matchesDateFrom = !filters.dateFrom || submissionDate >= new Date(filters.dateFrom);
            const matchesDateTo = !filters.dateTo || submissionDate <= new Date(filters.dateTo + 'T23:59:59');

            return matchesSearch && matchesMethod && matchesStatus && matchesDateFrom && matchesDateTo;
        });
    }, [submissions, searchQuery, filters]);

    const getMethodConfig = (method: string) => {
        const m = method.toLowerCase();
        switch (m) {
            case 'orange': return { label: 'Orange Money', color: 'text-orange-500', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg', bg: 'bg-orange-500/10' };
            case 'mtn': return { label: 'MTN MoMo', color: 'text-yellow-500', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/af/MTN_Logo.svg', bg: 'bg-yellow-500/10' };
            case 'wave': return { label: 'Wave', color: 'text-cyan-400', icon: '/wave-logo.png', bg: 'bg-cyan-400/10' };
            case 'bank': return { label: 'Virement', color: 'text-blue-500', icon: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png', bg: 'bg-blue-500/10' };
            default: return { label: method, color: 'text-white', icon: 'https://cdn-icons-png.flaticon.com/512/2343/2343604.png', bg: 'bg-white/10' };
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <NotificationToast submissions={submissions} />
            <div className="py-8 border-y border-white/5 bg-white/[0.01] flex items-center justify-between px-10">
                <div className="flex flex-col">
                    <h2 className="text-[12px] font-black uppercase tracking-[5px] text-white italic leading-none mb-1">📋 BASE DE DONNÉES CAPTURÉE</h2>
                    <span className="text-[10px] text-brand-primary font-bold uppercase tracking-widest">{filteredSubmissions.length} DOSSIERS TROUVÉS</span>
                </div>
                <button
                    onClick={fetchSubmissions}
                    className="flex items-center gap-3 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white/50 hover:text-white"
                >
                    <RefreshCcw className={cn("w-3.5 h-3.5", loading && "animate-spin")} /> ACTUALISER LE FLUX
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4">
                <div className="lg:col-span-3 relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary opacity-40" />
                    <input
                        type="text"
                        placeholder="Filtrer en temps réel (Nom, Email, Tel...)"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-3xl py-5 pl-16 pr-8 text-[14px] focus:border-brand-primary/40 focus:bg-white/[0.05] transition-all outline-none font-bold"
                    />
                </div>
                <FilterPanel onFilterChange={setFilters} />
            </div>

            <div className="glass-card rounded-[40px] overflow-hidden border-white/5 shadow-2xl relative min-h-[500px]">
                {loading && (
                    <div className="absolute inset-0 bg-brand-bg/40 backdrop-blur-md z-50 flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                    </div>
                )}

                {/* Desktop view */}
                <div className="hidden md:block overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.03] border-b border-white/5">
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[4px] text-brand-text-dim">CANDIDAT / ID</th>
                                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-[4px] text-brand-text-dim">COORDONNÉES</th>
                                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-[4px] text-brand-text-dim">MÉTHODE</th>
                                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-[4px] text-brand-text-dim">CAPTURÉ LE</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[4px] text-brand-text-dim text-right">GESTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredSubmissions.map((sub) => {
                                const config = getMethodConfig(sub.method);
                                return (
                                    <tr key={sub.id} className="group hover:bg-white/[0.02] transition-all">
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-[15px] text-white uppercase group-hover:text-brand-primary transition-colors">{sub.full_name}</span>
                                                    {sub.country_code && <span className="text-[9px] bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded font-black">{sub.country_code}</span>}
                                                </div>
                                                <span className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mt-1">ID: #{sub.id.toString().slice(-6)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[13px] font-bold flex items-center gap-2 opacity-80">📧 {sub.email}</span>
                                                <span className="text-[12px] font-bold opacity-30 tracking-[2px]">📱 {sub.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className={cn("inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl border border-white/5 font-black uppercase text-[10px] tracking-widest leading-none shadow-sm", config.bg, config.color)}>
                                                <div className="w-5 h-5 flex items-center justify-center overflow-hidden rounded-[6px] bg-white/10 p-1 shadow-inner">
                                                    <img src={config.icon} alt={sub.method} className="w-full h-full object-contain" />
                                                </div>
                                                {config.label}
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold opacity-60 italic">{formatDate(sub.created_at, 'long')}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-20 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                                <Link href={`/dashboard/submissions/${sub.id}`} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-brand-primary/20 hover:text-brand-primary transition-all text-[10px] font-black uppercase tracking-widest">[ DÉTAILS ]</Link>
                                                <button
                                                    onClick={() => generateSubmissionPDF(sub)}
                                                    className="p-3 rounded-xl bg-green-500/5 border border-green-500/10 hover:bg-green-500 hover:text-white transition-all text-green-500"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteSubmission(sub.id)}
                                                    className="p-3 rounded-xl bg-red-400/5 border border-red-400/10 hover:bg-red-500 hover:text-white transition-all text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile view */}
                <div className="md:hidden divide-y divide-white/5">
                    {filteredSubmissions.map((sub) => {
                        const config = getMethodConfig(sub.method);
                        return (
                            <div key={sub.id} className="p-6 space-y-5 hover:bg-white/[0.01] transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="text-base font-black text-white uppercase tracking-tight">{sub.full_name}</h3>
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[2px]">Capture: #{sub.id.toString().slice(-6)}</p>
                                    </div>
                                    <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 font-black uppercase text-[8px] tracking-widest shadow-sm", config.bg, config.color)}>
                                        <div className="w-3.5 h-3.5 flex items-center justify-center overflow-hidden rounded-[3px] bg-white/10 p-0.5">
                                            <img src={config.icon} alt={sub.method} className="w-full h-full object-contain" />
                                        </div>
                                        {config.label}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                                        <p className="text-[12px] font-bold text-white/80 flex items-center gap-2">📧 {sub.email}</p>
                                        <p className="text-[11px] font-bold text-white/40 tracking-wider mt-1">📱 {sub.phone}</p>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] font-bold text-white/30 px-1">
                                        <span>📅 {formatDate(sub.created_at, 'short')}</span>
                                        <span className="text-green-500/50 uppercase tracking-tighter text-[9px] font-black">ENCRYPTÉ SSL 256</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <Link href={`/dashboard/submissions/${sub.id}`} className="flex-1 bg-brand-primary py-3 rounded-xl text-center text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-brand-primary/20">Voir Détails</Link>
                                    <button onClick={() => generateSubmissionPDF(sub)} className="p-3 bg-white/5 rounded-xl border border-white/10 text-green-500"><Download className="w-4 h-4" /></button>
                                    <button onClick={() => deleteSubmission(sub.id)} className="p-3 bg-white/5 rounded-xl border border-white/10 text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {filteredSubmissions.length === 0 && !loading && (
                    <div className="py-40 text-center space-y-4 opacity-20">
                        <Search className="w-16 h-16 mx-auto" />
                        <p className="font-black uppercase text-xs tracking-[5px]">Aucune donnée correspondante</p>
                    </div>
                )}
            </div>
        </div>
    );
}
