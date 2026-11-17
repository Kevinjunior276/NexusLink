'use client';

import { useState, useEffect } from 'react';
import {
    Link2,
    Plus,
    Copy,
    Trash2,
    ExternalLink,
    Loader2,
    CheckCircle2,
    Clock,
    Users,
    Check
} from 'lucide-react';
import { dataService } from '@/lib/dataService';
import Link from 'next/link';

export default function AdminLinksPage() {
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [copyStatus, setCopyStatus] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newLink, setNewLink] = useState({
        name: '',
        description: '',
        submissions_limit: 0
    });

    const fetchLinks = async () => {
        setLoading(true);
        try {
            const data = await dataService.getLinks();
            setLinks(data || []);
        } catch (error) {
            console.error('Erreur chargement liens:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const handleCreateLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLink.name.trim()) return;
        setIsCreating(true);
        try {
            await dataService.createLink({
                name: newLink.name.trim(),
                description: newLink.description.trim(),
                submissions_limit: Number(newLink.submissions_limit) || 0,
            });
            setNewLink({ name: '', description: '', submissions_limit: 0 });
            fetchLinks();
        } catch (error: any) {
            alert(`Erreur: ${error.message || 'Impossible de créer le lien'}`);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteLink = async (id: number | string, linkId?: string) => {
        if (!confirm('Êtes-vous certain de vouloir supprimer cette campagne ?')) return;
        try {
            await dataService.deleteLink(id, linkId);
            fetchLinks();
        } catch (error) {
            console.error('Erreur suppression:', error);
        }
    };

    const copyDirectLink = async (linkId: string) => {
        const fullUrl = `${window.location.origin}/form/${linkId}`;
        await navigator.clipboard.writeText(fullUrl);
        setCopyStatus(linkId);
        setTimeout(() => setCopyStatus(null), 2000);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Gestion des Campagnes & Liens</h1>
                <p className="text-xs text-slate-400 mt-1">Créez et configurez des points d'accès uniques pour la collecte sécurisée</p>
            </div>

            {/* Formulaire de création */}
            <div className="glass-card rounded-2xl p-6 border-white/[0.06]">
                <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-blue-400" />
                    Créer une Nouvelle Campagne
                </h2>

                <form onSubmit={handleCreateLink} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Nom de la campagne</label>
                        <input
                            type="text"
                            required
                            placeholder="ex: Campagne Février 2026"
                            value={newLink.name}
                            onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                            className="input-field text-xs"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Description (Optionnelle)</label>
                        <input
                            type="text"
                            placeholder="ex: Validation Orange & MTN"
                            value={newLink.description}
                            onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                            className="input-field text-xs"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Quota maximal (0 = illimité)</label>
                        <input
                            type="number"
                            min="0"
                            value={newLink.submissions_limit}
                            onChange={(e) => setNewLink({ ...newLink, submissions_limit: parseInt(e.target.value) || 0 })}
                            className="input-field text-xs font-mono"
                        />
                    </div>

                    <div className="md:col-span-3 flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="btn-premium py-2 px-5 text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                            <span>Générer le Lien Sécurisé</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Liste des liens */}
            <div className="glass-card rounded-2xl p-6 border-white/[0.06]">
                <h2 className="text-sm font-semibold text-white mb-4">Campagnes Actives ({links.length})</h2>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                ) : links.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">Aucun lien n'a été créé pour le moment.</p>
                ) : (
                    <div className="space-y-3">
                        {links.map((link) => {
                            const isExpired = link.expiry_date && new Date() > new Date(link.expiry_date);
                            const isMaxed = link.submissions_limit > 0 && link.submission_count >= link.submissions_limit;

                            return (
                                <div
                                    key={link.id || link.link_id}
                                    className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-white">{link.name}</span>
                                            {isExpired ? (
                                                <span className="badge badge-warning text-[10px]">Expiré</span>
                                            ) : isMaxed ? (
                                                <span className="badge badge-warning text-[10px]">Plafond atteint</span>
                                            ) : (
                                                <span className="badge badge-success text-[10px]">Actif</span>
                                            )}
                                        </div>
                                        {link.description && (
                                            <p className="text-xs text-slate-400">{link.description}</p>
                                        )}
                                        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3 text-slate-400" />
                                                {link.submission_count || 0} {link.submissions_limit ? `/ ${link.submissions_limit}` : 'soumissions'}
                                            </span>
                                            <span>•</span>
                                            <span>Créé le {new Date(link.created_at).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => copyDirectLink(link.link_id)}
                                            className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 cursor-pointer"
                                            title="Copier l'URL publique"
                                        >
                                            {copyStatus === link.link_id ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                    <span className="text-emerald-400">Copié</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" />
                                                    <span>Copier le Lien</span>
                                                </>
                                            )}
                                        </button>

                                        <Link
                                            href={`/form/${link.link_id}`}
                                            target="_blank"
                                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                            title="Tester le formulaire"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>

                                        <button
                                            onClick={() => handleDeleteLink(link.id, link.link_id)}
                                            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                            title="Supprimer la campagne"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
