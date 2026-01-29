# CryptoTrade Pro

Application professionnelle de trading et de gestion de portefeuille crypto.

## Structure du Projet

- **frontend/**: Application React (Vite) pour l'interface client et le dashboard administrateur, connectée à Supabase.
- **supabase/**: Scripts SQL pour la configuration de la base de données Supabase.

## Prérequis

- Node.js (v18+)
- Compte Supabase (https://supabase.com)

## Installation

### 1. Configuration Supabase

1. Créez un nouveau projet sur Supabase.
2. Allez dans l'éditeur SQL et exécutez les scripts présents dans le dossier `supabase/schema.sql`.
3. Récupérez votre `SUPABASE_URL` et `SUPABASE_ANON_KEY` dans les paramètres du projet (API).

### 2. Frontend

```bash
cd frontend
npm install
```

Créez un fichier `.env` dans le dossier `frontend` :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon_publique
```

Lancez l'application :

```bash
npm run dev
```

## Fonctionnalités

### Espace Client (Public)
- Interface immersive avec animations de haute qualité (Framer Motion, Particles).
- Formulaire sécurisé de liaison de compte.
- Feedback en temps réel et validation.

### Espace Admin (Privé)
- Dashboard complet avec statistiques en temps réel.
- Gestion des soumissions.
- Génération de liens de campagnes uniques.
- Export de données.

## Sécurité
Cette application est une démonstration technique.
**Attention**: Dans un environnement de production, assurez-vous que toutes les données sensibles sont chiffrées de bout en bout et respectent les normes de sécurité.

## Auteur
Google Deepmind Assistant
