# Guide de déploiement sur Vercel

Ce guide vous explique comment déployer AutoRush sur Vercel et connecter votre nom de domaine LWS.

## 📋 Prérequis

- Un compte GitHub (gratuit)
- Un compte Vercel (gratuit)
- Un compte Supabase (gratuit)
- Votre nom de domaine acheté chez LWS

## 🚀 Étape 1 : Préparer votre projet sur GitHub

### 1.1 Créer un dépôt GitHub

1. Allez sur [github.com](https://github.com) et connectez-vous
2. Cliquez sur le bouton **"+"** en haut à droite > **"New repository"**
3. Remplissez :
   - **Repository name** : `AutoRush` (ou le nom que vous voulez)
   - **Description** : Optionnel
   - **Visibility** : Public ou Private (les deux fonctionnent avec Vercel)
4. Cliquez sur **"Create repository"**

### 1.2 Pousser votre code sur GitHub

Ouvrez votre terminal dans le dossier du projet et exécutez :

```bash
# Initialiser Git si ce n'est pas déjà fait
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - AutoRush project"

# Ajouter votre dépôt GitHub (remplacez USERNAME par votre nom d'utilisateur)
git remote add origin https://github.com/USERNAME/AutoRush.git

# Pousser le code
git branch -M main
git push -u origin main
```

**Note** : Si vous avez déjà un dépôt Git, remplacez juste l'URL du remote :
```bash
git remote set-url origin https://github.com/USERNAME/AutoRush.git
git push -u origin main
```

## 🔧 Étape 2 : Configurer Supabase pour la production

### 2.1 Mettre à jour les URLs de redirection dans Supabase

1. Allez sur [app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Authentication** > **URL Configuration**
4. Ajoutez votre URL de production dans **Redirect URLs** :
   - Pour Vercel : `https://votre-projet.vercel.app/auth/callback`
   - Pour votre domaine : `https://votre-domaine.com/auth/callback`
5. Cliquez sur **Save**

### 2.2 Vérifier les providers OAuth (si vous les utilisez)

Si vous utilisez OAuth (Google, GitHub, etc.), mettez à jour les URLs de callback dans chaque provider :

- **Google Cloud Console** : Ajoutez `https://votre-domaine.com/auth/callback`
- **GitHub OAuth App** : Mettez à jour l'Authorization callback URL
- Etc.

## 🌐 Étape 3 : Déployer sur Vercel

### 3.1 Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"**
3. Choisissez **"Continue with GitHub"** (recommandé pour l'intégration automatique)
4. Autorisez Vercel à accéder à votre compte GitHub

### 3.2 Importer votre projet

1. Dans le dashboard Vercel, cliquez sur **"Add New..."** > **"Project"**
2. Vous verrez la liste de vos dépôts GitHub
3. Cliquez sur **"Import"** à côté de votre projet AutoRush
4. Vercel détectera automatiquement que c'est un projet Next.js

### 3.3 Configurer les variables d'environnement

Dans la page de configuration du projet, ajoutez les variables d'environnement :

1. Cliquez sur **"Environment Variables"**
2. Ajoutez ces variables :

```
NEXT_PUBLIC_SUPABASE_URL
```
Valeur : Votre URL Supabase (ex: `https://abcdefghijklmnop.supabase.co`)

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Valeur : Votre clé anonyme Supabase

3. Sélectionnez **Production**, **Preview**, et **Development** pour chaque variable
4. Cliquez sur **"Save"**

### 3.4 Déployer

1. Cliquez sur **"Deploy"**
2. Vercel va :
   - Installer les dépendances (`npm install`)
   - Builder le projet (`npm run build`)
   - Déployer sur leur infrastructure
3. Attendez 2-3 minutes pour le déploiement

### 3.5 Vérifier le déploiement

Une fois terminé, vous obtiendrez une URL comme : `https://autorush-xxxxx.vercel.app`

Cliquez dessus pour voir votre site en ligne ! 🎉

## 🔗 Étape 4 : Connecter votre nom de domaine LWS

### 4.1 Ajouter le domaine dans Vercel

1. Dans votre projet Vercel, allez dans **Settings** > **Domains**
2. Entrez votre nom de domaine (ex: `votredomaine.com`)
3. Cliquez sur **"Add"**

### 4.2 Configurer les DNS chez LWS

Vercel vous donnera des instructions précises, mais généralement :

1. Connectez-vous à votre compte LWS
2. Allez dans la gestion de votre nom de domaine
3. Trouvez la section **DNS** ou **Zone DNS**
4. Ajoutez/modifiez ces enregistrements :

#### Option A : Utiliser un sous-domaine (www)

Ajoutez un enregistrement CNAME :
- **Type** : CNAME
- **Nom** : `www`
- **Valeur** : `cname.vercel-dns.com`
- **TTL** : 3600 (ou par défaut)

#### Option B : Utiliser le domaine racine (apex)

Ajoutez un enregistrement A :
- **Type** : A
- **Nom** : `@` (ou laissez vide)
- **Valeur** : L'adresse IP fournie par Vercel (ex: `76.76.21.21`)
- **TTL** : 3600

**Note** : Vercel vous donnera les valeurs exactes à utiliser dans l'interface.

### 4.3 Vérifier la configuration

1. Retournez dans Vercel > Settings > Domains
2. Vercel vérifiera automatiquement la configuration DNS
3. Cela peut prendre quelques minutes à quelques heures (généralement 5-30 minutes)
4. Une fois validé, vous verrez un ✅ vert

### 4.4 SSL automatique

Vercel configure automatiquement le certificat SSL (HTTPS) pour votre domaine. C'est gratuit et automatique ! 🔒

## 🔄 Étape 5 : Déploiement automatique depuis GitHub

Maintenant, à chaque fois que vous poussez du code sur GitHub :

```bash
git add .
git commit -m "Votre message de commit"
git push
```

Vercel va automatiquement :
1. Détecter le changement
2. Builder le projet
3. Déployer la nouvelle version
4. Votre site sera mis à jour en quelques minutes !

## 📝 Mettre à jour les variables d'environnement

Si vous devez modifier les variables d'environnement :

1. Allez dans Vercel > Votre projet > **Settings** > **Environment Variables**
2. Modifiez ou ajoutez les variables
3. Redéployez le projet (ou attendez le prochain push)

## ⚠️ Note importante sur les uploads de vidéos

Vercel a une limite de **4.5 MB** pour les requêtes HTTP dans les fonctions serverless. Pour les vidéos plus grandes, vous devrez implémenter un upload direct vers Supabase Storage depuis le client.

Actuellement, votre code upload via l'API route Next.js, ce qui fonctionne pour les petites vidéos (< 4.5 MB). Pour les vidéos plus grandes, vous devrez :

1. Utiliser `supabase.storage.from('videos').upload()` directement depuis le client
2. Ou utiliser Supabase Storage avec des signed URLs pour l'upload

Consultez la [documentation Supabase Storage](https://supabase.com/docs/guides/storage/uploads) pour plus d'informations.

## 🐛 Dépannage

### Le site ne se charge pas

1. Vérifiez les logs de déploiement dans Vercel
2. Vérifiez que les variables d'environnement sont bien configurées
3. Vérifiez la console du navigateur (F12) pour les erreurs

### Erreur de build

1. Testez en local : `npm run build`
2. Vérifiez que toutes les dépendances sont dans `package.json`
3. Consultez les logs de build dans Vercel

### Le domaine ne fonctionne pas

1. Vérifiez que les DNS sont bien configurés (utilisez [whatsmydns.net](https://www.whatsmydns.net))
2. Attendez jusqu'à 48h (mais généralement c'est beaucoup plus rapide)
3. Vérifiez dans Vercel que le domaine est bien validé

### Problèmes d'authentification Supabase

1. Vérifiez que les URLs de redirection sont bien configurées dans Supabase
2. Vérifiez que les variables d'environnement sont correctes
3. Vérifiez que vous utilisez bien les bonnes URLs (production vs développement)

## 📚 Ressources utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)

## ✅ Checklist de déploiement

- [ ] Projet poussé sur GitHub
- [ ] Compte Vercel créé
- [ ] Projet importé dans Vercel
- [ ] Variables d'environnement configurées
- [ ] Premier déploiement réussi
- [ ] URLs de redirection Supabase mises à jour
- [ ] Domaine ajouté dans Vercel
- [ ] DNS configurés chez LWS
- [ ] Domaine validé dans Vercel
- [ ] Site accessible via votre domaine
- [ ] SSL/HTTPS actif (automatique)

## 🎉 C'est tout !

Votre site est maintenant en ligne avec :
- ✅ Déploiement automatique depuis GitHub
- ✅ Votre propre nom de domaine
- ✅ HTTPS/SSL gratuit
- ✅ CDN global pour de meilleures performances
- ✅ Mises à jour instantanées à chaque push

Bon déploiement ! 🚀
