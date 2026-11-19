'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ShieldCheck, ArrowRight, AlertCircle, User, Loader2, AlertTriangle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [configured, setConfigured] = useState(true);

    useEffect(() => {
        localStorage.removeItem('token');
        setConfigured(isSupabaseConfigured());
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const cleanIdentifier = identifier.trim();
        const cleanPassword = password.trim();

        if (!isSupabaseConfigured()) {
            setError(
                "La clé API Supabase (NEXT_PUBLIC_SUPABASE_ANON_KEY) n'est pas encore reconnue. " +
                "Vérifiez vos variables d'environnement sur Vercel et relancez un Redeploy."
            );
            setLoading(false);
            return;
        }

        try {
            // Transformation automatique en email si l'admin saisit un identifiant court
            const emailToTry = cleanIdentifier.includes('@')
                ? cleanIdentifier
                : `${cleanIdentifier}@nexuslink.pro`;

            const { data, error: supaError } = await supabase.auth.signInWithPassword({
                email: emailToTry,
                password: cleanPassword,
            });

            if (supaError) {
                const msg = supaError.message.toLowerCase();
                if (msg.includes('email not confirmed')) {
                    setError(
                        "Votre email doit être confirmé avant de vous connecter. " +
                        "👉 Allez dans Supabase > Authentication > Providers > Email, décochez 'Confirm email' puis validez pour vous connecter directement."
                    );
                } else if (msg.includes('invalid login credentials')) {
                    setError(
                        "Identifiant ou mot de passe incorrect. Avez-vous déjà créé votre compte administrateur sur ce nouveau projet Supabase ? (Cliquez sur 'Créer un compte' ci-dessous)"
                    );
                } else {
                    setError(supaError.message);
                }
                setLoading(false);
                return;
            }

            if (data.session) {
                localStorage.setItem('token', data.session.access_token);
                router.push('/dashboard');
                return;
            }
        } catch (err: any) {
            setError(err.message || "Erreur de connexion.");
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
                    {!configured && (
                        <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>
                                Clé Supabase manquante. Ajoutez <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> dans les paramètres Vercel puis faites Redeploy.
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-rose-300 text-xs leading-relaxed">
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
                                    <span>Connexion en cours...</span>
                                </>
                            ) : (
                                <>
                                    <span>Accéder au Tableau de Bord</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-white/[0.06] text-center space-y-2">
                        <Link
                            href="/register"
                            className="text-xs text-slate-400 hover:text-blue-400 transition-colors block"
                        >
                            Pas encore de compte administrateur ? <span className="text-blue-400 font-medium">Créer un compte</span>
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-center text-[11px] text-slate-500">
                    Infrastructure sécurisée NexusLink Solutions • Connexion Supabase
                </div>
            </div>
        </div>
    );
}
