'use client';

import { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    CheckCircle2,
    Clock,
    XCircle,
    FileSpreadsheet,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AdminSubmissions() {
    const [submissions] = useState([
        { id: '#00127', name: 'Jean Dupont', email: 'jean@mail.com', phone: '+237 690 12...', method: 'Orange', date: '29/01 14:23', status: 'Nouveau', methodColor: 'text-orange-500' },
        { id: '#00126', name: 'Marie Kamga', email: 'marie@mail.cm', phone: '+237 670 45...', method: 'MTN', date: '29/01 13:15', status: 'En cours', methodColor: 'text-yellow-500' },
        { id: '#00125', name: 'Paul Mbarga', email: 'paul@mail.cm', phone: '+237 699 88...', method: 'Banque', date: '29/01 11:45', status: 'Traité', methodColor: 'text-blue-500' },
        { id: '#00124', name: 'Alice Ngo', email: 'alice@mail.cm', phone: '+237 691 22...', method: 'Orange', date: '29/01 10:12', status: 'Nouveau', methodColor: 'text-orange-500' },
        { id: '#00123', name: 'David Tchoua', email: 'david@mail.cm', phone: '+237 677 55...', method: 'MTN', date: '29/01 09:34', status: 'Traité', methodColor: 'text-yellow-500' },
    ]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight">Toutes les soumissions</h1>
                    <p className="text-brand-text-dim text-[11px] font-bold uppercase tracking-[3px] mt-1">Total: 2,847 formulaires capturés</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-[12px] font-bold flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button className="px-5 py-2.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20 transition-all text-[12px] font-bold flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4" /> Excel
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="glass-card rounded-3xl p-6 border-white/5 flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-dim opacity-40" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email ou ID..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-brand-primary/50 transition-all"
                    />
                </div>
                <div className="flex gap-3 flex-wrap">
                    <select className="bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-[12px] font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer hover:bg-white/10 transition-all pr-12 min-w-[160px]">
                        <option>Toutes méthodes</option>
                        <option>Orange Money</option>
                        <option>MTN MoMo</option>
                        <option>Banques</option>
                    </select>
                    <select className="bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-[12px] font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer hover:bg-white/10 transition-all pr-12 min-w-[160px]">
                        <option>Tous statuts</option>
                        <option>Nouveau</option>
                        <option>En cours</option>
                        <option>Traité</option>
                        <option>Annulé</option>
                    </select>
                    <button className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        <Filter className="w-5 h-5 text-brand-text-dim" />
                    </button>
                </div>
            </div>

            {/* Submissions Table */}
            <div className="glass-card rounded-[32px] overflow-hidden border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-8 py-5">
                                    <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-brand-primary transition-all" />
                                </th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[2026-01-29T09:47:04+01:00px] text-brand-text-dim">ID & Nom</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[3px] text-brand-text-dim">Email/Téléphone</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[3px] text-brand-text-dim">Méthode</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[3px] text-brand-text-dim">Date</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[3px] text-brand-text-dim text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {submissions.map((sub, i) => (
                                <tr key={i} className="group hover:bg-white/[0.03] transition-all">
                                    <td className="px-8 py-6">
                                        <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-brand-primary transition-all" />
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-brand-primary mb-1">{sub.id}</span>
                                            <span className="text-[13px] font-bold text-white group-hover:text-brand-primary transition-colors">{sub.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col text-[12px]">
                                            <span className="font-semibold text-white/80">{sub.email}</span>
                                            <span className="text-brand-text-dim opacity-60">{sub.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-display font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-1.5 h-1.5 rounded-full", sub.methodColor.replace('text', 'bg'))} />
                                            <span className={sub.methodColor}>{sub.method}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col text-[11px] font-medium uppercase tracking-tighter opacity-60">
                                            <span>{sub.date.split(' ')[0]}</span>
                                            <span>{sub.date.split(' ')[1]}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            <Link
                                                href={`/admin/submissions/${sub.id.replace('#', '')}`}
                                                className="p-2.5 rounded-xl bg-white/5 hover:bg-brand-primary shadow-xl hover:shadow-brand-primary/20 transition-all font-bold text-[11px]"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <button className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/80 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Table Footer */}
                <div className="p-8 bg-white/[0.01] border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="text-[11px] font-bold text-brand-text-dim uppercase tracking-widest whitespace-nowrap">
                        Affichage: <span className="text-white">1-10</span> sur <span className="text-white">2,847</span> résultats
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-brand-text-dim hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all" disabled>
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex gap-2">
                            {[1, 2, 3, '...', 95].map((page, i) => (
                                <button
                                    key={i}
                                    className={cn(
                                        "w-10 h-10 rounded-xl font-bold text-[11px] transition-all",
                                        page === 1 ? "bg-brand-primary text-white" : "bg-white/5 border border-white/5 text-brand-text-dim hover:bg-white/10"
                                    )}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-brand-text-dim hover:text-white transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
