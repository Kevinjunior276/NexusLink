# 🚀 CryptoTrade Pro - Frontend Next.js

Application de trading de cryptomonnaies professionnelle construite avec **Next.js 16**, **TypeScript**, et **Tailwind CSS**.

## ✨ Fonctionnalités

- ✅ **Landing Page moderne** avec animations et prix en temps réel
- ✅ **Authentification** (Login/Register) avec design glassmorphism
- ✅ **Dashboard** avec statistiques et graphiques
- ✅ **Routing Next.js** (pas besoin de React Router !)
- ✅ **TypeScript** pour la sécurité des types
- ✅ **Tailwind CSS** pour le styling
- ✅ **API Client** prêt pour l'intégration backend
- ✅ **Design responsive** et moderne

## 📁 Structure du Projet

```
frontend/
├── app/                        # App Router Next.js
│   ├── (auth)/                # Groupe de routes d'authentification
│   │   ├── login/            # Page de connexion
│   │   └── register/         # Page d'inscription
│   ├── dashboard/            # Dashboard principal
│   ├── trading/              # Interface de trading (à venir)
│   ├── portfolio/            # Gestion du portfolio (à venir)
│   ├── globals.css           # Styles globaux
│   ├── layout.tsx            # Layout racine
│   └── page.tsx              # Page d'accueil
├── components/               # Composants réutilisables
│   ├── ui/                   # Composants UI de base
│   ├── charts/               # Graphiques crypto
│   ├── trading/              # Composants de trading
│   └── layout/               # Layout components
├── lib/                      # Utilitaires et configurations
│   ├── api.ts               # Client API
│   ├── websocket.ts         # WebSocket (à venir)
│   └── utils.ts             # Fonctions utilitaires
├── types/                    # Types TypeScript
│   └── index.ts             # Types principaux
├── public/                   # Fichiers statiques
├── .env.local               # Variables d'environnement
├── tailwind.config.ts       # Configuration Tailwind
├── next.config.ts           # Configuration Next.js
└── package.json             # Dépendances

```

## 🚀 Démarrage Rapide

### Installation

```bash
cd frontend
npm install
```

### Développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Build Production

```bash
npm run build
npm start
```

## 🎨 Pages Disponibles

| Route | Description |
|-------|-------------|
| `/` | Landing page avec présentation |
| `/login` | Page de connexion |
| `/register` | Page d'inscription |
| `/dashboard` | Dashboard principal |
| `/trading` | Interface de trading (à venir) |
| `/portfolio` | Gestion du portfolio (à venir) |

## 🔧 Technologies Utilisées

- **Next.js 16** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS v4** - Framework CSS utilitaire
- **clsx & tailwind-merge** - Gestion des classes CSS

## 📝 Routing Next.js

**Important :** Next.js n'utilise PAS React Router !

Le routing est basé sur les fichiers dans le dossier `app/` :
- Créez un dossier = créez une route
- Ajoutez `page.tsx` = page accessible
- Ajoutez `layout.tsx` = layout partagé
- Utilisez `(groupes)` = organisation sans impact sur l'URL

Voir [ROUTING.md](./ROUTING.md) pour plus de détails.

## 🎨 Styles et Design

### Thème de Couleurs

```css
--background: #0a0e27      /* Fond principal */
--card: #1a1f3a            /* Fond des cartes */
--primary: #3b82f6         /* Bleu primaire */
--secondary: #8b5cf6       /* Violet secondaire */
--success: #10b981         /* Vert succès */
--danger: #ef4444          /* Rouge danger */
--warning: #f59e0b         /* Orange warning */
```

### Classes Utilitaires Personnalisées

```css
.glass                     /* Effet glassmorphism */
.gradient-text            /* Texte avec gradient */
.card-hover               /* Animation hover pour cartes */
.btn                      /* Bouton de base */
.btn-primary              /* Bouton primaire */
.btn-secondary            /* Bouton secondaire */
.input                    /* Input stylisé */
```

## 🔌 API Client

Le client API est configuré dans `lib/api.ts` :

```typescript
import { apiClient } from '@/lib/api';

// Authentification
await apiClient.login({ email, password });
await apiClient.register({ email, username, password });

// Cryptomonnaies
await apiClient.getCryptocurrencies();
await apiClient.getCryptocurrency('BTC');

// Portfolio
await apiClient.getPortfolio();

// Trading
await apiClient.createOrder({ ... });
await apiClient.getOrders();
```

## 🌐 Variables d'Environnement

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_APP_NAME=CryptoTrade Pro
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📦 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm start            # Serveur de production
npm run lint         # Linter ESLint
```

## 🎯 Prochaines Étapes

- [ ] Implémenter la page Trading avec graphiques en temps réel
- [ ] Ajouter la page Portfolio avec gestion des actifs
- [ ] Intégrer WebSocket pour les prix en temps réel
- [ ] Ajouter des graphiques avec Chart.js ou Recharts
- [ ] Implémenter l'authentification JWT complète
- [ ] Ajouter des tests unitaires et E2E
- [ ] Optimiser les performances et SEO

## 🤝 Intégration Backend

Le frontend est prêt à être connecté à votre backend Django/NestJS :

1. Configurez `NEXT_PUBLIC_API_URL` dans `.env.local`
2. Le client API (`lib/api.ts`) gère automatiquement :
   - Les tokens JWT
   - Les headers d'authentification
   - La gestion des erreurs
   - Le refresh des tokens

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

## 🎨 Design System

Le projet utilise un design system cohérent avec :
- **Glassmorphism** pour les cartes et modales
- **Gradients** pour les éléments importants
- **Animations** subtiles pour l'UX
- **Dark mode** par défaut
- **Responsive** sur tous les écrans

---

**Développé avec ❤️ pour CryptoTrade Pro**
