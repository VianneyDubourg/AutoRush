# Configuration Supabase pour AutoRush

## Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Créez un nouveau projet
4. Notez votre URL de projet et votre clé anonyme (anon key)

### 2. Configurer les variables d'environnement

1. Copiez le fichier `.env.local.example` vers `.env.local` :
   ```bash
   cp .env.local.example .env.local
   ```

2. Ouvrez `.env.local` et remplacez les valeurs par celles de votre projet Supabase :
   - `NEXT_PUBLIC_SUPABASE_URL` : L'URL de votre projet (trouvable dans Settings > API)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` : La clé anonyme (trouvable dans Settings > API)

   Exemple :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 3. Configurer l'authentification dans Supabase

1. Dans le dashboard Supabase, allez dans **Authentication** > **Providers**
2. Activez les providers OAuth que vous souhaitez utiliser :
   - **Google** : Configurez avec vos credentials Google OAuth
   - **GitHub** : Configurez avec vos credentials GitHub OAuth
   - **Apple** : Configurez avec vos credentials Apple OAuth
   - **Discord** : Configurez avec vos credentials Discord OAuth

### 4. Configurer les URLs de redirection

Dans chaque provider OAuth, ajoutez ces URLs de redirection :
- `http://localhost:3000/dashboard` (développement)
- `https://votre-domaine.com/dashboard` (production)

### 5. Configuration de la base de données

Supabase crée automatiquement les tables nécessaires pour l'authentification. Aucune migration supplémentaire n'est requise.

## Fonctionnalités disponibles

- ✅ Inscription par email/mot de passe
- ✅ Connexion par email/mot de passe
- ✅ OAuth (Google, GitHub, Apple, Discord)
- ✅ Réinitialisation de mot de passe
- ✅ Gestion de session automatique
- ✅ Protection des routes

## Test de l'authentification

1. Démarrez le serveur : `npm run dev`
2. Allez sur `/register` pour créer un compte
3. Allez sur `/login` pour vous connecter
4. Testez les providers OAuth
