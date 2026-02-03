'use client';

import {
    User,
    Shield,
    Palette,
    Bell,
    Database,
    AlertTriangle,
    Save,
    Eye,
    RefreshCw,
    Loader2,
    CheckCircle2,
    Lock,
    Mail,
    Trash2,
    Terminal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({ username: '', email: '' });
    const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
    const [appSettings, setAppSettings] = useState({
        id: 1,
        app_name: 'NexusLink Solutions',
        welcome_message: '',
        primary_color: '#0070f3',
        accent_color: '#7928ca'
    });
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'app' | 'maintenance'>('profile');

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const [profileData, settingsData] = await Promise.all([
                    api.get('/profile/'),
                    api.get('/settings/singleton/')
                ]);
                setProfile({
                    username: profileData.username,
                    email: profileData.email || ''
                });
                if (settingsData) {
                    setAppSettings(settingsData);
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch('/profile/update_profile/', profile);
            showSuccess('Profil mis à jour avec succès !');
        } catch (error) {
            console.error('Profile update failed:', error);
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwords.next || passwords.next !== passwords.confirm) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }
        setSaving(true);
        try {
            await api.patch('/profile/update_profile/', { password: passwords.next });
            setPasswords({ current: '', next: '', confirm: '' });
            showSuccess('Mot de passe modifié !');
        } catch (error) {
            console.error('Password change failed:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleAppSettingsUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch('/settings/singleton/', appSettings);
            showSuccess('Configuration enregistrée !');
        } catch (error) {
            console.error('App settings update failed:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleMaintenanceAction = async (action: 'delete_old' | 'reset_all') => {
        const confirmMsg = action === 'reset_all'
            ? '⚠️ ATTENTION : Cette action supprimera TOUS vos liens et soumissions. Cette opération est irréversible. Continuer ?'
            : 'Voulez-vous supprimer toutes les soumissions de plus de 6 mois ?';

        if (!confirm(confirmMsg)) return;

        setSaving(true);
        try {
            if (action === 'delete_old') {
                await api.delete('/submissions/delete_old/');
            } else {
                await api.post('/submissions/reset_all/', {});
            }
            showSuccess('Opération réussie !');
        } catch (error) {
            console.error('Maintenance failed:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[4px] text-white/40">Initialisation du système...</p>
        </div>
    );

    const tabs = [
        { id: 'profile', label: 'Profil Admin', icon: User },
        { id: 'security', label: 'Sécurité', icon: Shield },
        { id: 'app', label: 'Apparence', icon: Palette },
        { id: 'maintenance', label: 'Maintenance', icon: Terminal },
    ];

    return (
        <div className="container mx-auto max-w-6xl pb-32">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-2xl sm:text-4xl font-display font-black text-white italic uppercase tracking-tight mb-2">Configuration Système</h1>
                <p className="text-[11px] font-black text-brand-primary uppercase tracking-[4px]">Panel de Gestion Globale • v2.0</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-3 space-y-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border italic group",
                                activeTab === tab.id
                                    ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary shadow-[0_10px_30px_-10px_rgba(0,112,243,0.3)]"
                                    : "bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/[0.05] hover:text-white"
                            )}
                        >
                            <tab.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", activeTab === tab.id ? "text-brand-primary" : "text-white/20")} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="glass-card rounded-[40px] border-white/5 overflow-hidden"
                        >
                            {/* Tab Profile */}
                            {activeTab === 'profile' && (
                                <div className="p-8 sm:p-12 space-y-10">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-black uppercase italic text-white flex items-center gap-3">
                                            <User className="text-brand-primary" /> Informations du Compte
                                        </h3>
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[3px]">Gérez votre identité administrative</p>
                                    </div>

                                    <form onSubmit={handleProfileUpdate} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase text-brand-primary tracking-widest ml-1">Nom d&apos;utilisateur</label>
                                                <div className="relative">
                                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                    <input
                                                        value={profile.username}
                                                        onChange={e => setProfile({ ...profile, username: e.target.value })}
                                                        className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-5 px-14 text-sm font-bold focus:border-brand-primary outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase text-brand-primary tracking-widest ml-1">Email Administratif</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                    <input
                                                        type="email"
                                                        value={profile.email}
                                                        onChange={e => setProfile({ ...profile, email: e.target.value })}
                                                        className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-5 px-14 text-sm font-bold focus:border-brand-primary outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button disabled={saving} className="btn-premium px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 italic">
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Mettre à jour le profil
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Tab Security */}
                            {activeTab === 'security' && (
                                <div className="p-8 sm:p-12 space-y-10">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-black uppercase italic text-white flex items-center gap-3">
                                            <Shield className="text-brand-primary" /> Sécurité & Accès
                                        </h3>
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[3px]">Protégez votre espace de travail</p>
                                    </div>

                                    <form onSubmit={handlePasswordChange} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase text-brand-primary tracking-widest ml-1">Nouveau Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                    <input
                                                        type="password"
                                                        value={passwords.next}
                                                        onChange={e => setPasswords({ ...passwords, next: e.target.value })}
                                                        placeholder="••••••••••••"
                                                        className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-5 px-14 text-sm font-bold focus:border-brand-primary outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase text-brand-primary tracking-widest ml-1">Confirmer Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                    <input
                                                        type="password"
                                                        value={passwords.confirm}
                                                        onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                                        placeholder="••••••••••••"
                                                        className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-5 px-14 text-sm font-bold focus:border-brand-primary outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button disabled={saving || !passwords.next} className="btn-premium px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 italic">
                                            <Shield className="w-4 h-4" /> Sauvegarder les accès
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Tab App Appearance */}
                            {activeTab === 'app' && (
                                <div className="p-8 sm:p-12 space-y-10">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-black uppercase italic text-white flex items-center gap-3">
                                            <Palette className="text-brand-primary" /> Personnalisation Branding
                                        </h3>
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[3px]">Adaptez le formulaire à votre image</p>
                                    </div>

                                    <form onSubmit={handleAppSettingsUpdate} className="space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase text-brand-primary tracking-widest ml-1">Nom du Système (Frontend)</label>
                                                <input
                                                    value={appSettings.app_name}
                                                    onChange={e => setAppSettings({ ...appSettings, app_name: e.target.value })}
                                                    className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold focus:border-brand-primary outline-none transition-all"
                                                />
                                            </div>
                                            <div className="flex gap-8">
                                                <div className="space-y-4 flex-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest ml-1">Couleur Primaire</label>
                                                    <div className="flex items-center gap-4 bg-[#03040b] border border-white/5 p-4 rounded-2xl">
                                                        <input
                                                            type="color"
                                                            value={appSettings.primary_color}
                                                            onChange={e => setAppSettings({ ...appSettings, primary_color: e.target.value })}
                                                            className="w-10 h-10 bg-transparent border-none cursor-pointer p-0"
                                                        />
                                                        <span className="text-xs font-mono font-bold uppercase">{appSettings.primary_color}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-4 flex-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest ml-1">Couleur Accent</label>
                                                    <div className="flex items-center gap-4 bg-[#03040b] border border-white/5 p-4 rounded-2xl">
                                                        <input
                                                            type="color"
                                                            value={appSettings.accent_color}
                                                            onChange={e => setAppSettings({ ...appSettings, accent_color: e.target.value })}
                                                            className="w-10 h-10 bg-transparent border-none cursor-pointer p-0"
                                                        />
                                                        <span className="text-xs font-mono font-bold uppercase">{appSettings.accent_color}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase text-brand-primary tracking-widest ml-1 text-glow">Message d&apos;accueil (Page Client)</label>
                                            <textarea
                                                rows={4}
                                                value={appSettings.welcome_message}
                                                onChange={e => setAppSettings({ ...appSettings, welcome_message: e.target.value })}
                                                placeholder="Laissez vide pour le message par défaut..."
                                                className="w-full bg-[#03040b] border border-white/10 rounded-3xl py-6 px-8 text-sm font-bold focus:border-brand-primary outline-none transition-all resize-none"
                                            />
                                        </div>

                                        <button disabled={saving} className="btn-premium px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 italic">
                                            <Palette className="w-4 h-4" /> Appliquer les styles
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Tab Maintenance */}
                            {activeTab === 'maintenance' && (
                                <div className="p-8 sm:p-12 space-y-12">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-black uppercase italic text-red-500 flex items-center gap-3">
                                            <AlertTriangle className="animate-pulse" /> Maintenance Critique
                                        </h3>
                                        <p className="text-[10px] font-bold text-red-500/40 uppercase tracking-[3px]">Actions destructives sur la base de données</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="p-10 rounded-[32px] bg-white/[0.02] border border-white/5 flex flex-col items-center text-center space-y-6">
                                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20"><Database className="w-8 h-8" /></div>
                                            <div className="space-y-2">
                                                <h4 className="text-[11px] font-black uppercase tracking-widest">Optimisation</h4>
                                                <p className="text-[10px] text-white/30 font-medium">Nettoyage des soumissions de plus de 6 mois pour améliorer les performances.</p>
                                            </div>
                                            <button
                                                onClick={() => handleMaintenanceAction('delete_old')}
                                                className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-black text-[10px] uppercase tracking-[3px]"
                                            >
                                                Purger l&apos;historique
                                            </button>
                                        </div>

                                        <div className="p-10 rounded-[32px] bg-red-500/[0.02] border border-red-500/10 flex flex-col items-center text-center space-y-6">
                                            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500/50"><Trash2 className="w-8 h-8" /></div>
                                            <div className="space-y-2">
                                                <h4 className="text-[11px] font-black uppercase tracking-widest text-red-500">Nettoyage Total</h4>
                                                <p className="text-[10px] text-red-500/40 font-medium italic">🚨 Attention : Supprime tous les liens et toutes les données saisies.</p>
                                            </div>
                                            <button
                                                onClick={() => handleMaintenanceAction('reset_all')}
                                                className="w-full py-4 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase tracking-[3px] shadow-[0_15px_30px_-10px_rgba(239,68,68,0.4)]"
                                            >
                                                Réinitialiser Tout
                                            </button>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-white/5 flex items-center gap-3 opacity-20">
                                        <Terminal className="w-4 h-4" />
                                        <span className="text-[8px] font-black uppercase tracking-[5px]">SECURITY LOG : ACCESS LEVEL 10 AUTHENTICATED</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Success Notification Toast */}
            <AnimatePresence>
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-10 right-10 z-[500] px-8 py-5 rounded-2xl bg-brand-primary border border-brand-primary/20 shadow-[0_20px_50px_rgba(0,112,243,0.5)] flex items-center gap-4"
                    >
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-white" /></div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white">{successMessage}</p>
                            <p className="text-[8px] font-bold text-white/60 uppercase">Système mis à jour avec succès</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
