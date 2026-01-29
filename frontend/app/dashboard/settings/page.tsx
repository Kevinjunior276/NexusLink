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
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({ username: '', email: '' });
    const [passwords, setPasswords] = useState({ current: '', next: '' });
    const [appSettings, setAppSettings] = useState({
        id: 1,
        app_name: 'CryptoTrade Pro',
        welcome_message: '',
        primary_color: '#1a1f3a',
        accent_color: '#f7931a'
    });
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const [profileData, settingsData] = await Promise.all([
                    api.get('/profile/'),
                    api.get('/settings/singleton/')
                ]);
                setProfile(profileData);
                setAppSettings(settingsData);
            } catch (error) {
                console.error('Failed to load settings:', error);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch('/profile/update_profile/', profile);
            showSuccess('Profil mis à jour !');
        } catch (error) {
            alert('Erreur lors de la mise à jour du profil');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwords.next) return;
        setSaving(true);
        try {
            await api.patch('/profile/update_profile/', { password: passwords.next });
            setPasswords({ current: '', next: '' });
            showSuccess('Mot de passe changé !');
        } catch (error) {
            alert('Erreur lors du changement de mot de passe');
        } finally {
            setSaving(false);
        }
    };

    const handleAppSettingsUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch('/settings/singleton/', appSettings);
            showSuccess('Paramètres de l\'app enregistrés !');
        } catch (error) {
            alert('Erreur lors de l\'enregistrement');
        } finally {
            setSaving(false);
        }
    };

    const handleMaintenanceAction = async (action: 'delete_old' | 'reset_all') => {
        const confirmMsg = action === 'reset_all'
            ? '⚠️ ATTENTION : Cela va supprimer TOUTES les données (liens et soumissions). Continuer ?'
            : 'Supprimer les soumissions de plus de 6 mois ?';

        if (!confirm(confirmMsg)) return;

        setSaving(true);
        try {
            if (action === 'delete_old') {
                await api.delete('/submissions/delete_old/');
            } else {
                await api.post('/submissions/reset_all/', {});
            }
            showSuccess('Action effectuée avec succès !');
        } catch (error) {
            alert('Erreur de maintenance');
        } finally {
            setSaving(false);
        }
    };

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
        </div>
    );

    return (
        <div className="space-y-12 animate-fade-in pb-32 max-w-5xl mx-auto relative">

            {/* Success Toast */}
            {successMessage && (
                <div className="fixed top-24 right-10 z-[300] bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in-right">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-bold uppercase tracking-widest text-xs">{successMessage}</span>
                </div>
            )}

            <div className="py-6 border-y border-white/5 bg-white/[0.01] flex items-center justify-center">
                <h2 className="text-[11px] font-black uppercase tracking-[5px] text-white">⚙️ PARAMÈTRES DE L&apos;APPLICATION</h2>
            </div>

            {/* Profil Admin */}
            <section className="glass-card rounded-2xl border-white/5 overflow-hidden">
                <div className="px-8 py-4 bg-white/[0.02] border-b border-white/5 text-[10px] font-black uppercase tracking-[2px] opacity-40">👤 PROFIL ADMINISTRATEUR</div>
                <form onSubmit={handleProfileUpdate} className="p-10 space-y-8">
                    <div className="space-y-3">
                        <p className="text-xs opacity-40 font-bold uppercase tracking-widest">Username</p>
                        <input
                            value={profile.username}
                            onChange={e => setProfile({ ...profile, username: e.target.value })}
                            type="text" className="w-full bg-[#03040b] border border-white/10 rounded-xl py-4 px-6 text-sm font-bold shadow-inner outline-none focus:border-brand-primary/40 transition-all"
                        />
                    </div>
                    <div className="space-y-3">
                        <p className="text-xs opacity-40 font-bold uppercase tracking-widest">Email de contact</p>
                        <input
                            value={profile.email}
                            onChange={e => setProfile({ ...profile, email: e.target.value })}
                            type="email" className="w-full bg-[#03040b] border border-white/10 rounded-xl py-4 px-6 text-sm font-bold shadow-inner outline-none focus:border-brand-primary/40 transition-all"
                        />
                    </div>
                    <button disabled={saving} className="btn-premium px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        [ SAUVEGARDER LE PROFIL ]
                    </button>
                </form>
            </section>

            {/* Sécurité */}
            <section className="glass-card rounded-2xl border-white/5 overflow-hidden">
                <div className="px-8 py-4 bg-white/[0.02] border-b border-white/5 text-[10px] font-black uppercase tracking-[2px] opacity-40">🔐 SÉCURITÉ & ACCÈS</div>
                <form onSubmit={handlePasswordChange} className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <p className="text-xs opacity-40 font-bold uppercase tracking-widest">Nouveau mot de passe</p>
                            <input
                                value={passwords.next}
                                onChange={e => setPasswords({ ...passwords, next: e.target.value })}
                                type="password" placeholder="••••••••••••" className="w-full bg-[#03040b] border border-white/10 rounded-xl py-4 px-6 text-sm font-bold outline-none focus:border-brand-primary/40 transition-all"
                            />
                        </div>
                    </div>
                    <button disabled={saving || !passwords.next} className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[11px] flex items-center gap-2 disabled:opacity-20">
                        <Shield className="w-4 h-4" /> [ CHANGER LE MOT DE PASSE ]
                    </button>
                </form>
            </section>

            {/* Personnalisation */}
            <section className="glass-card rounded-3xl border-brand-primary/20 bg-brand-primary/[0.01] overflow-hidden">
                <div className="px-8 py-4 bg-brand-primary/10 border-b border-brand-primary/20 text-[10px] font-black uppercase tracking-[2px] text-brand-primary">🎨 PERSONNALISATION DU FORMULAIRE CLIENT</div>
                <form onSubmit={handleAppSettingsUpdate} className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <p className="text-xs opacity-40 font-bold uppercase tracking-widest">Nom de l&apos;application</p>
                            <input
                                value={appSettings.app_name}
                                onChange={e => setAppSettings({ ...appSettings, app_name: e.target.value })}
                                type="text" className="w-full bg-[#03040b] border border-white/10 rounded-xl py-4 px-6 text-sm font-bold outline-none focus:border-brand-primary/40 transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <p className="text-xs opacity-40 font-bold uppercase tracking-widest">Couleur Primaire</p>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={appSettings.primary_color}
                                        onChange={e => setAppSettings({ ...appSettings, primary_color: e.target.value })}
                                        className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer"
                                    />
                                    <span className="text-[10px] font-mono opacity-60 uppercase">{appSettings.primary_color}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className="text-xs opacity-40 font-bold uppercase tracking-widest">Couleur Accent</p>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={appSettings.accent_color}
                                        onChange={e => setAppSettings({ ...appSettings, accent_color: e.target.value })}
                                        className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer"
                                    />
                                    <span className="text-[10px] font-mono opacity-60 uppercase">{appSettings.accent_color}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <p className="text-xs opacity-40 font-bold uppercase tracking-widest">Message de bienvenue (Page Client)</p>
                        <textarea
                            value={appSettings.welcome_message}
                            onChange={e => setAppSettings({ ...appSettings, welcome_message: e.target.value })}
                            className="w-full bg-[#03040b] border border-white/10 rounded-xl p-6 text-sm h-32 outline-none focus:border-brand-primary/40 transition-all resize-none font-bold"
                            placeholder="Message s'affichant sur l'écran d'accueil..."
                        />
                    </div>
                    <div className="flex gap-4">
                        <button disabled={saving} className="flex-1 btn-premium py-4 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                            <Save className="w-4 h-4" /> [ ENREGISTRER LA CONFIG ]
                        </button>
                    </div>
                </form>
            </section>

            {/* Zone Dangereuse */}
            <section className="glass-card rounded-2xl border-red-500/20 bg-red-500/[0.01] overflow-hidden">
                <div className="px-8 py-4 bg-red-500/10 border-b border-red-500/20 text-[10px] font-black uppercase tracking-[2px] text-red-400 font-bold italic">⚠️ ZONE DANGEREUSE / MAINTENANCE</div>
                <div className="p-10 space-y-6">
                    <button
                        onClick={() => handleMaintenanceAction('delete_old')}
                        className="w-full py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase text-[10px] tracking-[3px] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                        <RefreshCw className="w-4 h-4" /> [ NETTOYER LES ANCIENNES DONNÉES (&gt; 6 MOIS) ]
                    </button>
                    <button
                        onClick={() => handleMaintenanceAction('reset_all')}
                        className="w-full py-4 rounded-xl bg-red-600 text-white font-black uppercase text-[10px] tracking-[3px] hover:brightness-125 transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-3"
                    >
                        <AlertTriangle className="w-4 h-4" /> [ RÉINITIALISER TOTALEMENT L&apos;APPLICATION ]
                    </button>
                    <p className="text-center text-[10px] font-bold text-red-500 italic opacity-60 leading-none">⚠️ Attention : Toutes les soumissions et tous les liens seront perdus</p>
                </div>
            </section>
        </div>
    );
}
