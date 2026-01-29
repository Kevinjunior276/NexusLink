'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    TrendingUp,
    Wallet,
    History,
    Settings,
    LogOut,
    Bell,
    Shield,
    CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard' },
    { icon: TrendingUp, label: 'Trading', href: '/trading' },
    { icon: Wallet, label: 'Portefeuille', href: '/portfolio' },
    { icon: History, label: 'Historique', href: '/history' },
    { icon: Shield, label: 'Sécurité', href: '/security' },
    { icon: CreditCard, label: 'Dépôt / Retrait', href: '/funds' },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-brand-bg/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={cn(
                "fixed left-0 top-0 h-screen w-64 border-r border-brand-border bg-brand-bg/50 backdrop-blur-xl z-50 flex flex-col pt-20 transition-transform lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all group",
                                    isActive
                                        ? "bg-brand-primary/10 text-brand-primary shadow-[0_0_20px_rgba(0,112,243,0.1)]"
                                        : "text-brand-text-dim hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className={cn("w-4 h-4", isActive ? "text-brand-primary" : "text-brand-text-dim group-hover:text-white")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-brand-border space-y-2">
                    <Link
                        href="/settings"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium text-brand-text-dim hover:text-white hover:bg-white/5 transition-all"
                    >
                        <Settings className="w-4 h-4" />
                        Paramètres
                    </Link>
                    <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                    </button>
                </div>
            </aside>
        </>
    );
}
