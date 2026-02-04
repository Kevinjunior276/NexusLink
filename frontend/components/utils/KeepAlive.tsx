'use client';

import { useEffect } from 'react';
import { api } from '@/lib/api';

/**
 * Ce composant gère le maintien en éveil (keep-alive) du backend Render.
 * Il envoie un ping toutes les 10 minutes pour éviter que le serveur ne s'endorme.
 */
export default function KeepAlive() {
    useEffect(() => {
        const pingInterval = 10 * 60 * 1000; // 10 minutes

        const pingBackend = async () => {
            try {
                // On utilise l'endpoint de santé ou un point simple
                await api.get('/health/');
                console.log('Backend maintenance: server is awake.');
            } catch (err) {
                console.warn('Backend maintenance: wake up ping failed (might be starting up).');
            }
        };

        // Ping initial au chargement
        pingBackend();

        // Intervalle régulier
        const interval = setInterval(pingBackend, pingInterval);

        return () => clearInterval(interval);
    }, []);

    return null; // Composant invisible
}
