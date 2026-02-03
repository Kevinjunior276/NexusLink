'use client';

import { useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle2, Bell } from 'lucide-react';

interface NotificationToastProps {
    submissions: any[];
}

export default function NotificationToast({ submissions }: NotificationToastProps) {
    const prevCountRef = useRef(0);
    const isFirstLoadRef = useRef(true);

    useEffect(() => {
        if (isFirstLoadRef.current) {
            prevCountRef.current = submissions.length;
            isFirstLoadRef.current = false;
            return;
        }

        if (submissions.length > prevCountRef.current) {
            const newSubmission = submissions[0]; // Most recent

            // Play notification sound
            try {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.volume = 0.3;
                audio.play().catch(e => console.warn('Audio play failed:', e));
            } catch (e) {
                console.warn('Audio error:', e);
            }

            // Show toast
            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-md w-full bg-gradient-to-r from-brand-primary to-brand-secondary shadow-lg rounded-2xl pointer-events-auto flex items-center gap-4 p-4 border border-white/10`}
                >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Bell className="w-6 h-6 text-white animate-bounce" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">
                            🎉 Nouvelle Soumission !
                        </h4>
                        <p className="text-xs text-white/80 mt-1">
                            {newSubmission.data?.fullName || 'Client'} via{' '}
                            <span className="font-bold">
                                {newSubmission.method === 'orange' ? 'Orange Money' :
                                    newSubmission.method === 'mtn' ? 'MTN' :
                                        newSubmission.method === 'wave' ? 'Wave' :
                                            newSubmission.method === 'bank' ? 'Banque' : 'Autre'}
                            </span>
                        </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                </div>
            ), {
                duration: 5000,
                position: 'top-right',
            });

            prevCountRef.current = submissions.length;
        }
    }, [submissions]);

    return <Toaster position="top-right" />;
}
