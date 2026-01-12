# Configuration OAuth avec BetterAuth

## Providers disponibles

AutoRush supporte l'authentification OAuth avec les providers suivants :
- **Google**
- **GitHub**
- **Apple**
- **Discord**

## Configuration

### 1. Variables d'environnement

Ajoutez les variables suivantes dans votre fichier `.env.local` :

```env
# BetterAuth
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-here
DATABASE_URL=file:./auth.db

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Apple OAuth
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret

# Discord OAuth
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
```

### 2. Configuration des providers

#### Google OAuth

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+ 
4. Allez dans "Identifiants" > "Créer des identifiants" > "ID client OAuth 2.0"
5. Configurez l'écran de consentement OAuth
6. Ajoutez les URI de redirection autorisés :
   - `http://localhost:3000/api/auth/callback/google` (développement)
   - `https://votre-domaine.com/api/auth/callback/google` (production)
7. Copiez le Client ID et Client Secret dans votre `.env.local`

#### GitHub OAuth

1. Allez sur [GitHub Developer Settings](https://github.com/settings/developers)
2. Cliquez sur "New OAuth App"
3. Remplissez les informations :
   - Application name: AutoRush
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copiez le Client ID et créez un Client Secret
5. Ajoutez-les dans votre `.env.local`

#### Apple OAuth

1. Allez sur [Apple Developer Portal](https://developer.apple.com/)
2. Créez un App ID avec Sign in with Apple activé
3. Créez un Service ID
4. Configurez les domaines et redirections
5. Générez une clé privée pour Sign in with Apple
6. Configurez les credentials dans votre `.env.local`

#### Discord OAuth

1. Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Créez une nouvelle application
3. Allez dans "OAuth2" > "General"
4. Ajoutez une redirection :
   - `http://localhost:3000/api/auth/callback/discord`
5. Copiez le Client ID et créez un Client Secret
6. Ajoutez-les dans votre `.env.local`

### 3. Activer/Désactiver des providers

Pour activer ou désactiver un provider, modifiez le fichier `lib/auth.ts` et commentez/décommentez les providers dans le tableau `providers`.

### 4. URLs de callback

BetterAuth génère automatiquement les routes de callback :
- `/api/auth/callback/google`
- `/api/auth/callback/github`
- `/api/auth/callback/apple`
- `/api/auth/callback/discord`

Assurez-vous que ces URLs sont configurées dans les paramètres de vos applications OAuth.

## Utilisation

Une fois configuré, les boutons OAuth apparaîtront automatiquement sur :
- La page de connexion (`/login`)
- La page d'inscription (`/register`)

Les utilisateurs peuvent cliquer sur un bouton pour s'authentifier avec leur compte du provider choisi.
