'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, User as UserIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }

        setLoading(true);

        try {
            if (isSupabaseConfigured()) {
                const { data: supaData, error: supaError } = await supabase.auth.signUp({
                    email: formData.email.trim(),
                    password: formData.password,
                    options: {
                        data: {
                            username: formData.username.trim(),
                        }
                    }
                });

                if (supaError) {
                    setError(supaError.message);
                    return;
                }

                if (supaData.session) {
                    localStorage.setItem('token', supaData.session.access_token);
                    router.push('/dashboard');
                    return;
                } else if (supaData.user) {
                    setSuccessMessage(
                        "Compte créé avec succès ! Si un email de confirmation vous a été envoyé, validez-le puis connectez-vous."
                    );
                    setTimeout(() => router.push('/login'), 2500);
                    return;
                }
            }

            // Fallback si Supabase n'est pas encore configuré
            const data = await api.post('/register/', {
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });

            if (data.token) {
                localStorage.setItem('token', data.token);
                router.push('/dashboard');
            } else {
                setError('Échec de la création du compte.');
            }
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue lors de l'inscription.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center p-4 relative">
            <div className="w-full max-w-[420px] relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 mb-4 shadow-lg shadow-blue-500/10">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Inscription Administrateur</h1>
                    <p className="text-xs text-slate-400 mt-1">Créez votre accès à l'infrastructure NexusLink</p>
                </div>

                <div className="glass-card rounded-2xl p-6 sm:p-8">
                    {successMessage && (
                        <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-emerald-300 text-xs">
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-rose-300 text-xs">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                Nom d'utilisateur
                            </label>
                            <div className="relative">
                                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="admin_nexus"
                                    className="input-field pl-10 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                Adresse email professionnelle
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="admin@organisation.com"
                                    className="input-field pl-10 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                Mot de passe (min. 6 caractères)
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••••••"
                                    className="input-field pl-10 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="••••••••••••"
                                    className="input-field pl-10 text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-premium w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer mt-4"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Création du compte...</span>
                                </>
                            ) : (
                                <>
                                    <span>Valider l'Inscription</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
                        <Link
                            href="/login"
                            className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
                        >
                            Déjà titulaire d'un compte ? <span className="text-blue-400 font-medium">Se connecter</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
