'use client';

import { Bell, Search, ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
    onMenuToggle?: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 border-b border-brand-border bg-brand-bg/50 backdrop-blur-xl z-[60] px-4 sm:px-6">
            <div className="h-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 text-brand-text-dim hover:text-white transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <Link href="/" className="font-display text-lg font-bold tracking-tighter flex items-center gap-2">
                        <div className="w-6 h-6 bg-brand-primary rounded-sm rotate-12 flex items-center justify-center">
                            <span className="text-[10px] text-white -rotate-12">₿</span>
                        </div>
                        CTP <span className="opacity-40 font-normal">PRO</span>
                    </Link>

                    <div className="ml-12 relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-dim" />
                        <input
                            type="text"
                            placeholder="Rechercher un actif..."
                            className="bg-white/5 border border-brand-border rounded-full py-1.5 pl-10 pr-4 text-[12px] w-64 focus:outline-none focus:border-brand-primary/50"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button className="relative p-2 text-brand-text-dim hover:text-white transition-colors group">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-primary rounded-full border border-brand-bg"></span>
                    </button>

                    <div className="h-8 w-px bg-brand-border hidden sm:block"></div>

                    <button className="flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-white/5 transition-all">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center font-bold text-[12px] text-white">
                            JD
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-[12px] font-bold">John Doe</p>
                            <p className="text-[10px] text-brand-text-dim uppercase tracking-tighter">Pro Account</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-brand-text-dim" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
