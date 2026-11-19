'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Search,
    Download,
    RefreshCcw,
    Loader2,
    ArrowRight,
    CheckCircle2,
    XCircle,
    Clock,
    KeyRound,
    ExternalLink,
    Copy,
    Check,
    Link2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { dataService } from '@/lib/dataService';
import { generateSubmissionPDF } from '@/lib/pdfExport';

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchSubmissions = useCallback(async () => {
        try {
            const data = await dataService.getSubmissions();
            setSubmissions(data || []);
        } catch (error) {
            console.error('Erreur chargement soumissions:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubmissions();
        const interval = setInterval(fetchSubmissions, 4000);
        return () => clearInterval(interval);
    }, [fetchSubmissions]);

    const handleQuickAction = async (id: string, newStatus: string) => {
        setActionLoading(id);
        try {
            await dataService.updateSubmissionStatus(id, newStatus);
            fetchSubmissions();
        } catch (err: any) {
            alert(`Erreur: ${err.message || 'Action impossible'}`);
        } finally {
            setActionLoading(null);
        }
    };

    const copyText = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {}
    };

    const filteredSubmissions = useMemo(() => {
        return submissions.filter(s => {
            const matchesSearch =
                (s.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (s.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (s.phone || '').includes(searchQuery) ||
                (s.account_number || '').includes(searchQuery) ||
                (s.verification_code || '').includes(searchQuery);

            const matchesStatus = !statusFilter || s.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [submissions, searchQuery, statusFilter]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Gestion des Demandes & Validations</h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Examinez en direct les demandes de réactivation, débloquez les codes, accédez aux liens transmis et validez les transactions.
                    </p>
                </div>

                <button
                    onClick={fetchSubmissions}
                    className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 self-start cursor-pointer"
                >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>Actualiser</span>
                </button>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="glass-card rounded-2xl p-4 border-white/[0.06] flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, téléphone, compte ou code/lien..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10 text-xs w-full"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-field text-xs py-2 px-3 w-full md:w-56"
                >
                    <option value="">Tous les statuts</option>
                    <option value="En attente">En attente d'examen</option>
                    <option value="Approuvé (Attente code)">Approuvé (Attente code)</option>
                    <option value="Code reçu">Code / Lien reçu du client</option>
                    <option value="Finalisé">Finalisé</option>
                    <option value="Rejeté">Rejeté</option>
                </select>
            </div>

            {/* Tableau principal des demandes */}
            <div className="glass-card rounded-2xl p-6 border-white/[0.06]">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-300">
                        {filteredSubmissions.length} demande(s) répertoriée(s)
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : filteredSubmissions.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-12">Aucune demande trouvée.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-white/[0.06] text-slate-400">
                                    <th className="pb-3 font-medium">Titulaire & Contact</th>
                                    <th className="pb-3 font-medium">Moyen de paiement</th>
                                    <th className="pb-3 font-medium">Lien / Code Reçu du Client</th>
                                    <th className="pb-3 font-medium">Statut Actuel</th>
                                    <th className="pb-3 font-medium">Horodatage</th>
                                    <th className="pb-3 font-medium text-right">Actions Administrateur</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {filteredSubmissions.map((sub) => {
                                    const isPending = sub.status === 'En attente' || !sub.status;
                                    const isCodeReceived = sub.status === 'Code reçu';
                                    const codeOrUrl = sub.verification_code || '';
                                    const isUrl = codeOrUrl.startsWith('http://') || codeOrUrl.startsWith('https://');

                                    return (
                                        <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3.5">
                                                <span className="font-semibold text-white block">{sub.full_name}</span>
                                                <span className="text-[11px] text-slate-400 font-mono block">{sub.phone}</span>
                                            </td>
                                            <td className="py-3.5">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-300">
                                                    {sub.method || 'Non spécifié'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 max-w-xs">
                                                {codeOrUrl ? (
                                                    <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/25 p-1.5 rounded-lg">
                                                        <span className="font-mono text-[11px] text-blue-300 truncate max-w-[170px]" title={codeOrUrl}>
                                                            {codeOrUrl}
                                                        </span>
                                                        <button
                                                            onClick={() => copyText(codeOrUrl, `code-${sub.id}`)}
                                                            className="p-1 hover:bg-blue-500/20 rounded text-slate-400 hover:text-white transition-colors"
                                                            title="Copier"
                                                        >
                                                            {copiedId === `code-${sub.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                                        </button>
                                                        {isUrl && (
                                                            <a
                                                                href={codeOrUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-1 hover:bg-blue-500/20 rounded text-blue-400 hover:text-blue-300 transition-colors"
                                                                title="Ouvrir le lien"
                                                            >
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-600 text-[11px] italic">En attente</span>
                                                )}
                                            </td>
                                            <td className="py-3.5">
                                                <span className={cn(
                                                    "badge text-[10px]",
                                                    sub.status === 'Finalisé' ? "badge-success" :
                                                    sub.status === 'Code reçu' ? "badge-primary animate-pulse" :
                                                    sub.status === 'Approuvé (Attente code)' ? "badge-warning" :
                                                    sub.status === 'Rejeté' ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" :
                                                    "badge-warning"
                                                )}>
                                                    {sub.status || 'En attente'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 font-mono text-slate-400 text-[11px]">
                                                {sub.created_at ? new Date(sub.created_at).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                            </td>
                                            <td className="py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* Étape 1 : Approuver pour demander le code / lien au client */}
                                                    {isPending && (
                                                        <>
                                                            <button
                                                                onClick={() => handleQuickAction(sub.id, 'Approuvé (Attente code)')}
                                                                disabled={actionLoading === sub.id}
                                                                className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-[11px] font-semibold cursor-pointer"
                                                                title="Approuver pour demander le code/lien"
                                                            >
                                                                Approuver
                                                            </button>
                                                            <button
                                                                onClick={() => handleQuickAction(sub.id, 'Rejeté')}
                                                                disabled={actionLoading === sub.id}
                                                                className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 text-[11px] font-semibold cursor-pointer"
                                                                title="Refuser"
                                                            >
                                                                Refuser
                                                            </button>
                                                        </>
                                                    )}

                                                    {/* Étape 2 : Valider la transaction dès que le code ou lien est reçu */}
                                                    {isCodeReceived && (
                                                        <button
                                                            onClick={() => handleQuickAction(sub.id, 'Finalisé')}
                                                            disabled={actionLoading === sub.id}
                                                            className="btn-premium py-1 px-3 text-[11px] font-semibold cursor-pointer shadow-md shadow-blue-500/20"
                                                            title="Valider la transaction et confirmer au client"
                                                        >
                                                            <span>Valider Transaction</span>
                                                        </button>
                                                    )}

                                                    {/* Bouton pour copier l'URL de la session client */}
                                                    {sub.link_id && (
                                                        <button
                                                            onClick={() => copyText(`${window.location.origin}/form/${sub.link_id}`, `link-${sub.id}`)}
                                                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                                            title="Copier le lien du formulaire client"
                                                        >
                                                            {copiedId === `link-${sub.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link2 className="w-3.5 h-3.5" />}
                                                        </button>
                                                    )}

                                                    <Link
                                                        href={`/dashboard/submissions/${sub.id}`}
                                                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                                        title="Fiche détaillée"
                                                    >
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
