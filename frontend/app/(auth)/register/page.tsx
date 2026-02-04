'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, User as UserIcon } from 'lucide-react';
import { api } from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setLoading(true);

        try {
            const data = await api.post('/register/', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            if (data.token) {
                localStorage.setItem('token', data.token);
                alert('Compte créé avec succès !');
                router.push('/dashboard');
            } else {
                setError('Échec de la création du compte.');
            }
        } catch (err: any) {
            let msg = err.message || 'Une erreur est survenue lors de l\'inscription.';
            if (msg.includes('contacter le serveur')) {
                msg = "Le serveur est en cours de démarrage. Réessayez dans 30 secondes.";
            }
            setError(msg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-[#03040b] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="orb orb-purple opacity-10" />

            <div className="w-full max-w-[420px] relative z-10 animate-fade-in">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 mb-6 group transition-all hover:scale-110">
                        <UserIcon className="w-8 h-8 text-brand-primary group-hover:rotate-12 transition-transform" />
                    </div>
                    <h2 className="text-[10px] font-black uppercase tracking-[4px] text-brand-primary mb-2">💎 INITIALISATION DU COMPTE ADMIN</h2>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-white uppercase italic">Créer un Compte</h1>
                </div>

                <article className="glass-card rounded-[32px] p-10 border-white/5 bg-white/[0.01]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-brand-text-dim uppercase tracking-widest ml-1">Username Admin</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-dim" />
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="admin_pro"
                                    className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-6 pl-12 text-sm focus:outline-none focus:border-brand-primary/50 transition-all text-white shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-brand-text-dim uppercase tracking-widest ml-1">Email (Optionnel)</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-dim" />
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="admin@nexuslink.pro"
                                    className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-6 pl-12 text-sm focus:outline-none focus:border-brand-primary/50 transition-all text-white shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-brand-text-dim uppercase tracking-widest ml-1">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-dim" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••••••"
                                    className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-6 pl-12 text-sm focus:outline-none focus:border-brand-primary/50 transition-all text-white shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-brand-text-dim uppercase tracking-widest ml-1">Confirmer mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-dim" />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••••••"
                                    className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-4 px-6 pl-12 text-sm focus:outline-none focus:border-brand-primary/50 transition-all text-white shadow-inner"
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full btn-premium py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 relative overflow-hidden group shadow-lg shadow-brand-primary/20"
                        >
                            <span className="relative z-10">{loading ? 'Création...' : '🚀 CRÉER LE COMPTE'}</span>
                            {!loading && <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />}
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[12px] text-brand-text-dim">
                            Déjà un compte ?{' '}
                            <Link href="/login" className="text-brand-primary font-bold hover:underline">Se connecter</Link>
                        </p>
                    </div>
                </article>

                <div className="mt-8 flex items-center justify-center gap-3 text-brand-text-dim opacity-40">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[2px]">🛡️ Inscription sécurisée par protocole SSL</span>
                </div>
            </div>
        </div>
    );
}
