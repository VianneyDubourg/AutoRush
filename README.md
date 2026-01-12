# AutoRush

Application web AutoRush - Tableau de bord utilisateur

## Technologies

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Shadcn UI** - Composants UI modernes
- **Tailwind CSS** - Styling utilitaire
- **Radix UI** - Composants accessibles

## Installation

1. Installez les dépendances :

```bash
npm install
```

2. Lancez le serveur de développement :

```bash
npm run dev
```

3. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du projet

```
AutoRush/
├── app/                    # Pages Next.js (App Router)
│   ├── dashboard/         # Pages du dashboard
│   ├── layout.tsx         # Layout principal
│   └── globals.css        # Styles globaux
├── components/            # Composants React
│   ├── ui/               # Composants Shadcn UI
│   └── dashboard/        # Composants du dashboard
├── lib/                   # Utilitaires
└── public/               # Fichiers statiques
```

## Fonctionnalités

- ✅ Dashboard utilisateur avec statistiques
- ✅ Navigation latérale
- ✅ En-tête avec recherche et profil utilisateur
- ✅ Design moderne et responsive
- ✅ Dark mode prêt (à activer)

## Développement

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm start` - Lance l'application en mode production
- `npm run lint` - Vérifie le code avec ESLint
