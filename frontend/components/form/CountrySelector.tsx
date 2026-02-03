
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Country {
    name: string;
    code: string;
    dial: string;
    flag?: string; // fallback emoji if needed
}

interface CountrySelectorProps {
    countries: Country[];
    selectedDial: string;
    onSelect: (country: Country) => void;
}

export default function CountrySelector({ countries, selectedDial, onSelect }: CountrySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectedCountry = countries.find(c => c.dial === selectedDial) || countries[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [countries, selectedDial]);

    return (
        <div className="relative h-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="h-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-4 flex items-center gap-3 transition-all hover:border-brand-primary/50 min-w-[140px] group"
            >
                <div className="w-8 h-6 rounded bg-white/5 overflow-hidden relative shadow-sm border border-white/5">
                    <img
                        src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
                        alt={selectedCountry.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <span className="text-sm font-bold text-white group-hover:text-brand-primary transition-colors">{selectedCountry.dial}</span>
                <ChevronDown className={cn("w-4 h-4 text-brand-primary/50 group-hover:text-brand-primary transition-all duration-300", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[calc(100%+8px)] left-0 w-[360px] max-h-[400px] overflow-y-auto bg-[#0a0b14] border border-white/10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.9)] z-[9999] p-2 custom-scrollbar ring-1 ring-white/5"
                    >
                        {countries.map((country) => (
                            <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                    onSelect(country);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-4 p-3 rounded-2xl transition-all border border-transparent group shrink-0",
                                    selectedDial === country.dial
                                        ? "bg-brand-primary/10 border-brand-primary/20 shadow-inner"
                                        : "hover:bg-white/5 hover:border-white/5"
                                )}
                            >
                                <div className="w-8 h-6 rounded overflow-hidden shadow-sm relative shrink-0 border border-white/10">
                                    <img
                                        src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                        alt={country.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-0.5">
                                    <span className={cn("text-xs font-black uppercase tracking-wide text-left", selectedDial === country.dial ? "text-brand-primary" : "text-white")}>
                                        {country.name}
                                    </span>
                                    <span className="text-[10px] font-bold text-white/30">{country.dial}</span>
                                </div>
                                {selectedDial === country.dial && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                                        <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    </motion.div>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
