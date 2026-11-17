'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Country {
    name: string;
    code: string;
    dial: string;
}

interface CountrySelectorProps {
    countries: Country[];
    selectedDial: string;
    onSelect: (country: Country) => void;
}

export default function CountrySelector({ countries, selectedDial, onSelect }: CountrySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const selectedCountry = countries.find(c => c.dial === selectedDial) || countries[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        } else {
            setSearchQuery('');
        }
    }, [isOpen]);

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.dial.includes(searchQuery) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative h-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="h-full bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 rounded-xl px-3.5 py-3 flex items-center gap-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 min-w-[130px] group"
            >
                <div className="w-6 h-4 rounded overflow-hidden relative shadow-sm shrink-0 border border-white/10">
                    <img
                        src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
                        alt={selectedCountry.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="text-sm font-semibold text-white font-mono">{selectedCountry.dial}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform ml-auto", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-[calc(100%+6px)] left-0 w-[320px] max-h-[380px] bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl z-[9999] p-2 flex flex-col ring-1 ring-white/10"
                    >
                        {/* Barre de recherche */}
                        <div className="relative mb-2 px-1 pt-1">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher un pays..."
                                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Liste des pays */}
                        <div className="overflow-y-auto max-h-[300px] space-y-0.5 pr-1">
                            {filteredCountries.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-4">Aucun pays trouvé</p>
                            ) : (
                                filteredCountries.map((country) => {
                                    const isSelected = selectedDial === country.dial;
                                    return (
                                        <button
                                            key={country.code}
                                            type="button"
                                            onClick={() => {
                                                onSelect(country);
                                                setIsOpen(false);
                                            }}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left",
                                                isSelected
                                                    ? "bg-blue-600/15 border border-blue-500/30 text-blue-400"
                                                    : "hover:bg-slate-800/60 text-slate-200 border border-transparent"
                                            )}
                                        >
                                            <div className="w-5 h-3.5 rounded overflow-hidden shrink-0 border border-white/10">
                                                <img
                                                    src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                                    alt={country.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="text-xs font-medium flex-1 truncate">{country.name}</span>
                                            <span className="text-xs font-mono text-slate-400">{country.dial}</span>
                                            {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 ml-1 shrink-0" />}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
