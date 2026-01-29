# 📚 Routing dans Next.js - Guide Complet

## 🎯 Pourquoi Next.js n'utilise PAS React Router

**Next.js utilise son propre système de routing basé sur les fichiers (App Router)**. C'est bien plus puissant et moderne que React Router !

### Avantages du routing Next.js :
- ✅ **Routing basé sur les dossiers** - Pas besoin de configuration
- ✅ **Server Components** - Meilleure performance
- ✅ **Layouts imbriqués** - Réutilisation facile
- ✅ **Loading states** - États de chargement automatiques
- ✅ **Error handling** - Gestion d'erreurs intégrée
- ✅ **Parallel routes** - Routes parallèles
- ✅ **Intercepting routes** - Interception de routes (modals, etc.)

## 📁 Structure des Routes

```
app/
├── page.tsx                    → / (page d'accueil)
├── layout.tsx                  → Layout racine
├── (auth)/                     → Groupe de routes (n'affecte pas l'URL)
│   ├── login/
│   │   └── page.tsx           → /login
│   └── register/
│       └── page.tsx           → /register
├── dashboard/
│   ├── page.tsx               → /dashboard
│   └── layout.tsx             → Layout pour /dashboard/*
├── trading/
│   └── page.tsx               → /trading
└── portfolio/
    └── page.tsx               → /portfolio
```

## 🔗 Navigation

### Utiliser le composant Link
```tsx
import Link from 'next/link';

<Link href="/dashboard">Dashboard</Link>
<Link href="/trading">Trading</Link>
```

### Utiliser useRouter (navigation programmatique)
```tsx
'use client';
import { useRouter } from 'next/navigation';

export default function Component() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/dashboard');
  };
  
  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

## 🎨 Layouts

Les layouts permettent de partager des UI entre plusieurs pages :

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

## 📄 Pages Dynamiques

```
app/
└── crypto/
    └── [symbol]/
        └── page.tsx           → /crypto/BTC, /crypto/ETH, etc.
```

```tsx
// app/crypto/[symbol]/page.tsx
export default function CryptoPage({ params }: { params: { symbol: string } }) {
  return <h1>Crypto: {params.symbol}</h1>;
}
```

## 🔄 Loading States

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

## ❌ Error Handling

```tsx
// app/dashboard/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

## 🚀 Routes API

```tsx
// app/api/crypto/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await fetchCryptoData();
  return NextResponse.json(data);
}
```

## 📝 Résumé

**Vous n'avez PAS besoin de React Router avec Next.js !**

Le système de routing de Next.js est :
- Plus simple à utiliser
- Plus performant
- Mieux intégré
- Plus moderne

Créez simplement des dossiers et des fichiers `page.tsx` dans le dossier `app/` !
