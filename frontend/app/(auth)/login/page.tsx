'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ShieldCheck, ArrowRight, AlertCircle, User, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        localStorage.removeItem('token');
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Si Supabase est configuré et que l'utilisateur entre un email
            if (isSupabaseConfigured() && identifier.includes('@')) {
                const { data, error: supaError } = await supabase.auth.signInWithPassword({
                    email: identifier.trim(),
                    password: password.trim(),
                });

                if (supaError) {
                    console.warn('Supabase auth warning, trying API fallback:', supaError.message);
                } else if (data.session) {
                    localStorage.setItem('token', data.session.access_token);
                    router.push('/dashboard');
                    return;
                }
            }

            // Fallback API Django
            const data = await api.post('/login/', {
                username: identifier.trim(),
                password: password.trim(),
            });

            if (data.token) {
                localStorage.setItem('token', data.token);
                router.push('/dashboard');
            } else {
                setError('Échec de la connexion. Informations invalides.');
            }
        } catch (err: any) {
            let msg = err.message || 'Identifiant ou mot de passe incorrect.';
            if (msg.includes('redémarre peut-être') || msg.includes('met trop de temps')) {
                msg = "Le serveur est en cours d'initialisation. Veuillez patienter un instant et réessayer.";
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center p-4 relative">
            <div className="w-full max-w-[400px] relative z-10">
                {/* Brand Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 mb-4 shadow-lg shadow-blue-500/10">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-tight">NexusLink Portal</h1>
                    <p className="text-xs text-slate-400 mt-1">Espace d'administration et de gestion des flux</p>
                </div>

                <div className="glass-card rounded-2xl p-6 sm:p-8">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-rose-300 text-xs">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                Identifiant ou adresse email
                            </label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="admin ou contact@domaine.com"
                                    className="input-field pl-10 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="input-field pl-10 text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-premium w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Authentification...</span>
                                </>
                            ) : (
                                <>
                                    <span>Accéder au Tableau de Bord</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
                        <Link
                            href="/register"
                            className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
                        >
                            Pas encore de compte administrateur ? <span className="text-blue-400 font-medium">Créer un compte</span>
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-center text-[11px] text-slate-400">
                    Infrastructure sécurisée NexusLink Solutions • Session cryptée
                </div>
            </div>
        </div>
    );
}
