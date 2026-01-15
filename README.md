# AutoRush

AutoRush est un outil simple et accessible qui aide les créateurs vidéo à nettoyer et préparer leurs vidéos avant diffusion. 

## Fonctionnalités principales

### AutoCut
Supprime intelligemment les silences d'une vidéo avec :
- Interface avec preview vidéo
- Timeline audio pour visualiser les silences
- Réglages simples (seuil, durée, padding)

### AutoFrame
Adapte une vidéo à différents formats :
- 16:9 (Landscape) - Format horizontal classique
- 9:16 (Vertical) - Format vertical pour réseaux sociaux
- 1:1 (Carré) - Format carré pour Instagram
- Ajustement automatique du cadrage et du regard dans le cadre

## Technologies

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Shadcn UI** - Composants UI modernes
- **Tailwind CSS** - Styling utilitaire
- **Radix UI** - Composants accessibles
- **Supabase** - Authentification et base de données

## Installation

1. Installez les dépendances :

```bash
npm install
```

2. Configurez Supabase :

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

Pour obtenir ces valeurs :
- Créez un projet sur [supabase.com](https://supabase.com)
- Allez dans Settings > API
- Copiez l'URL du projet et la clé anonyme (anon key)

Voir `SUPABASE_SETUP.md` pour plus de détails.

3. Lancez le serveur de développement :

```bash
npm run dev
```

4. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du projet

```
AutoRush/
├── app/                    # Pages Next.js (App Router)
│   ├── dashboard/         # Pages du dashboard
│   │   ├── autocut/       # Page AutoCut
│   │   ├── autoframe/     # Page AutoFrame
│   │   ├── videos/        # Gestion des vidéos
│   │   ├── history/       # Historique des traitements
│   │   └── settings/      # Paramètres
│   ├── layout.tsx         # Layout principal
│   └── globals.css        # Styles globaux
├── components/            # Composants React
│   ├── ui/               # Composants Shadcn UI
│   └── dashboard/        # Composants du dashboard
├── lib/                   # Utilitaires
└── public/               # Fichiers statiques
```

## Fonctionnalités

- ✅ Dashboard avec statistiques vidéo
- ✅ AutoCut - Suppression intelligente des silences
- ✅ AutoFrame - Adaptation de formats vidéo
- ✅ Gestion des vidéos traitées
- ✅ Historique des traitements
- ✅ Paramètres personnalisables
- ✅ Interface moderne et responsive

## Développement

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm start` - Lance l'application en mode production
- `npm run lint` - Vérifie le code avec ESLint

## 🚀 Déploiement

Pour déployer votre site sur Vercel avec votre propre nom de domaine, consultez le guide complet : **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)**

Ce guide vous explique :
- Comment connecter votre projet à GitHub
- Comment déployer sur Vercel (gratuit)
- Comment connecter votre nom de domaine LWS
- Comment configurer le déploiement automatique