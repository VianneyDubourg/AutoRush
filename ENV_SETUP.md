# Configuration des variables d'environnement

## Fichier .env.local

Créez un fichier `.env.local` à la racine du projet avec le contenu suivant :

```env
# ============================================
# Supabase Configuration
# ============================================
# 
# Pour obtenir ces valeurs :
# 1. Allez sur https://app.supabase.com
# 2. Sélectionnez votre projet
# 3. Allez dans Settings > API
# 4. Copiez l'URL du projet et la clé anonyme (anon key)
#
# ============================================

# URL de votre projet Supabase
# Format: https://xxxxxxxxxxxxx.supabase.co
# Exemple: https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Clé anonyme (anon key) de votre projet Supabase
# Cette clé est publique et peut être utilisée côté client
# Format: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Où trouver ces valeurs dans Supabase

1. **Connectez-vous** à [https://app.supabase.com](https://app.supabase.com)
2. **Sélectionnez votre projet** (ou créez-en un nouveau)
3. **Allez dans Settings** (Paramètres) dans le menu de gauche
4. **Cliquez sur API** dans le sous-menu
5. **Copiez les valeurs suivantes** :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Exemple de fichier .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example_key_here
```

## Important

- Le fichier `.env.local` est déjà dans `.gitignore` et ne sera **pas commité** dans Git
- Ne partagez **jamais** vos clés API publiquement
- Redémarrez le serveur de développement après avoir créé/modifié `.env.local`

## Vérification

Après avoir créé le fichier, redémarrez votre serveur :

```bash
npm run dev
```

L'application devrait maintenant se connecter à votre projet Supabase.
