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
import { AnimatePresence, motion } from 'framer-motion';

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

    const prevUnreadCount = useRef(0);
    const isFirstLoad = useRef(true);

    const playNotificationSound = () => {
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.volume = 0.4;
            audio.play().catch(() => {});
        } catch {}
    };

    const fetchNotifications = async () => {
        try {
            const data = await dataService.getNotifications();
            setNotifications(data || []);

            const currentUnread = (data || []).filter((n: any) => !n.is_read).length;
            if (currentUnread > prevUnreadCount.current && !isFirstLoad.current) {
                playNotificationSound();
            }
            prevUnreadCount.current = currentUnread;
            isFirstLoad.current = false;
        } catch (error) {
            console.warn('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        const fetchDashboardInfo = async () => {
            try {
                const settings = await dataService.getAppSettings();
                if (settings?.app_name) setAppName(settings.app_name);
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
                                className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white relative transition-colors"
                            >
                                <Bell className="w-4 h-4" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {isNotifOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                        className="absolute right-0 top-12 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 z-50 ring-1 ring-white/10"
                                    >
                                        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                                            <span className="text-xs font-semibold text-white">Notifications</span>
                                            <span className="text-[10px] text-slate-400 font-mono">{unreadCount} non lues</span>
                                        </div>

                                        <div className="max-h-64 overflow-y-auto space-y-2">
                                            {notifications.length === 0 ? (
                                                <p className="text-xs text-slate-400 text-center py-4">Aucune notification</p>
                                            ) : (
                                                notifications.map((n, idx) => (
                                                    <div key={idx} className="p-2.5 rounded-xl bg-slate-800/60 border border-white/5 text-xs">
                                                        <span className="font-semibold text-slate-200 block mb-0.5">{n.title}</span>
                                                        <span className="text-slate-400 block text-[11px] leading-relaxed">{n.message}</span>
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
        </div>
    );
}
