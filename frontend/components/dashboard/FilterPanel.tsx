'use client';

import { useState } from 'react';
import { Filter, X, Calendar, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterPanelProps {
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    method: string;
    dateFrom: string;
    dateTo: string;
    status: string;
}

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        method: '',
        dateFrom: '',
        dateTo: '',
        status: ''
    });

    const handleApply = () => {
        onFilterChange(filters);
        setIsOpen(false);
    };

    const handleReset = () => {
        const resetFilters = { method: '', dateFrom: '', dateTo: '', status: '' };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
            >
                <Filter className="w-4 h-4" />
                Filtres Avancés
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[90vw] max-w-2xl glass-card rounded-[32px] p-8 border-white/10 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[12px] font-black uppercase tracking-[4px] text-brand-primary flex items-center gap-2">
                                    <Filter className="w-4 h-4" /> Filtres Avancés
                                </h3>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/60">Méthode de paiement</label>
                                        <select
                                            value={filters.method}
                                            onChange={(e) => setFilters({ ...filters, method: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-primary transition-all"
                                        >
                                            <option value="">Toutes les méthodes</option>
                                            <option value="orange">Orange Money</option>
                                            <option value="mtn">MTN Mobile Money</option>
                                            <option value="wave">Wave</option>
                                            <option value="bank">Virement Bancaire</option>
                                            <option value="other">Autre</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/60">Statut</label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-primary transition-all"
                                        >
                                            <option value="">Tous les statuts</option>
                                            <option value="pending">En attente</option>
                                            <option value="verified">Vérifié</option>
                                            <option value="completed">Complété</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
                                            <Calendar className="w-3 h-3" /> Date de début
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.dateFrom}
                                            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-primary transition-all"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
                                            <Calendar className="w-3 h-3" /> Date de fin
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.dateTo}
                                            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={handleApply}
                                        className="flex-1 btn-premium py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
                                    >
                                        Appliquer les filtres
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
                                    >
                                        Réinitialiser
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
