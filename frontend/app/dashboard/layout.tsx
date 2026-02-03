'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    Files,
    Link2,
    Settings as SettingsIcon,
    Bell,
    Menu,
    LogOut,
    User as UserIcon,
    Plus,
    Home,
    Search,
    History,
    Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { AnimatePresence, motion } from 'framer-motion';

const adminMenuItems = [
    { icon: Home, label: 'Accueil', href: '/dashboard' },
    { icon: History, label: 'Transactions', href: '/dashboard/submissions' },
    { icon: Link2, label: 'Liens', href: '/dashboard/links' },
    { icon: SettingsIcon, label: 'Réglages', href: '/dashboard/settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [adminName, setAdminName] = useState('Admin');
    const [appName, setAppName] = useState('NexusLink Solutions');
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const prevUnreadCount = useRef(0);
    const isFirstLoad = useRef(true);

    const playNotificationSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.error("Error playing sound:", e));
    };

    const fetchNotifications = async () => {
        try {
            const data = await api.get('/notifications/');
            setNotifications(data);

            const currentUnread = data.filter((n: any) => !n.is_read).length;

            // Play sound if we have NEW unread notifications
            if (currentUnread > prevUnreadCount.current && !isFirstLoad.current) {
                playNotificationSound();
            }

            prevUnreadCount.current = currentUnread;
            isFirstLoad.current = false;
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        const fetchDashboardInfo = async () => {
            try {
                const [profile, settings] = await Promise.all([
                    api.get('/profile/'),
                    api.get('/settings/singleton/')
                ]);
                setAdminName(profile.username);
                setAppName(settings.app_name);
            } catch (error) {
                console.error('Failed to fetch dashboard info:', error);
            }
        };
        fetchDashboardInfo();
        fetchNotifications();

        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    const markAllRead = async () => {
        try {
            await api.post('/notifications/mark_all_read/', {});
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all read');
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="min-h-screen bg-[#03040b] text-white">
            <nav className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 bg-brand-bg/50 backdrop-blur-xl z-[100] px-6 lg:px-10">
                <div className="h-full flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-brand-text-dim hover:text-white"><Menu className="w-6 h-6" /></button>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center -rotate-6 shadow-lg shadow-brand-primary/20"><span className="text-sm font-black">₿</span></div>
                            <div className="flex flex-col">
                                <span className="font-display font-bold tracking-tight text-[11px] sm:text-sm uppercase italic truncate max-w-[100px] sm:max-w-none">{appName}</span>
                                <span className="text-[8px] sm:text-[9px] font-black uppercase text-brand-primary tracking-widest leading-none">PANEL {adminName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-8">
                        {/* Admin Profile Display */}
                        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 transition-all">
                            <div className="w-7 h-7 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                <UserIcon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase tracking-widest text-white/90 leading-none mb-1">{adminName}</span>
                                <span className="text-[9px] font-bold text-green-500 uppercase leading-none">En ligne</span>
                            </div>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                                <Bell className={cn("w-5 h-5", unreadCount > 0 ? "text-brand-primary animate-bounce" : "text-brand-text-dim")} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(0,112,243,0.5)]">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {isNotifOpen && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-4 w-80 max-h-[500px] overflow-hidden bg-brand-bg border border-white/10 rounded-2xl shadow-2xl z-[120] flex flex-col"
                                        >
                                            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Notifications</span>
                                                <button onClick={markAllRead} className="text-[9px] font-black text-brand-primary uppercase hover:underline">Tout marquer</button>
                                            </div>
                                            <div className="overflow-y-auto no-scrollbar max-h-96">
                                                {notifications.length === 0 ? (
                                                    <div className="p-10 text-center opacity-30 italic text-xs">Aucune alerte</div>
                                                ) : (
                                                    notifications.map((n) => (
                                                        <div key={n.id} className={cn("px-6 py-4 border-b border-white/[0.02] hover:bg-white/[0.03] transition-all group relative pr-10", !n.is_read && "bg-brand-primary/[0.05]")}>
                                                            <div className="flex justify-between gap-2 mb-1">
                                                                <span className="text-[11px] font-black uppercase tracking-widest text-white/90">{n.title}</span>
                                                                <span className="text-[9px] font-black opacity-30">{new Date(n.created_at).toLocaleTimeString('fr-FR')}</span>
                                                            </div>
                                                            <p className="text-[11px] font-medium text-brand-text-dim leading-relaxed">{n.message}</p>
                                                            <button
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    try {
                                                                        await api.delete(`/notifications/${n.id}/`);
                                                                        setNotifications(prev => prev.filter(notif => notif.id !== n.id));
                                                                    } catch (err) {
                                                                        console.error("Failed to delete notification", err);
                                                                    }
                                                                }}
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-white/20"
                                                                title="Supprimer"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </motion.div>
                                        <div className="fixed inset-0 z-[110]" onClick={() => setIsNotifOpen(false)} />
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link href="/login" className="flex items-center gap-2 p-2 sm:p-2.5 px-3 sm:px-4 rounded-xl bg-red-400/5 border border-red-400/10 hover:bg-red-400/10 transition-all font-black text-[10px] text-red-400 uppercase tracking-widest shadow-[0_0_15px_rgba(248,113,113,0.1)] hover:scale-105 active:scale-95">
                            <LogOut className="w-4 h-4 shadow-sm" />
                            <span className="hidden sm:inline">DÉCONNEXION</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Desktop Side Nav Bar (Secondary) */}
            <div className="hidden lg:flex fixed top-20 left-0 right-0 h-16 bg-white/[0.03] border-b border-white/5 z-40 items-center overflow-hidden">
                <div className="container mx-auto px-10 h-full flex items-center justify-start gap-6">
                    {adminMenuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[4px] transition-all whitespace-nowrap italic border",
                                pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')
                                    ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20 shadow-[0_0_15px_rgba(0,112,243,0.1)]"
                                    : "text-brand-text-dim hover:text-white border-transparent hover:bg-white/5"
                            )}
                        >
                            <span className="text-sm grayscale opacity-70">{item.label === 'Dashboard' ? '🏠' : item.label === 'Soumissions' ? '📋' : item.label === 'Liens' ? '🔗' : '⚙️'}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Mobile Bottom Navigation Bar - Glassmorphism Premium Style */}
            <div className="lg:hidden fixed bottom-6 left-6 right-6 h-16 bg-white/[0.05] backdrop-blur-3xl border border-white/10 z-50 px-2 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[24px]">
                {adminMenuItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center w-12 h-12 transition-all duration-300",
                                isActive ? "text-brand-primary" : "text-white/40"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="mobileNavActive"
                                    className="absolute inset-0 bg-brand-primary/10 rounded-xl -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon className={cn("w-5 h-5 transition-transform", isActive ? "scale-110" : "scale-100")} />
                        </Link>
                    );
                })}

                {/* Mobile Floating Action Button (Center) */}
                <Link
                    href="/dashboard"
                    className="flex items-center justify-center w-12 h-12 bg-brand-primary rounded-xl shadow-[0_10px_20px_rgba(0,112,243,0.3)] text-white hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus className="w-6 h-6 stroke-[3px]" />
                </Link>
            </div>

            <main className="pt-24 lg:pt-36 pb-24 lg:pb-0 h-screen overflow-hidden">
                <div className="h-full overflow-y-auto px-4 lg:px-10 py-8 no-scrollbar">{children}</div>
            </main>
        </div>
    );
}
