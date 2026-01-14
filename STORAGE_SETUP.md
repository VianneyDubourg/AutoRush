# Guide de configuration - Supabase Storage et Migrations

## Étape 1 : Créer le bucket Supabase Storage

### 1.1 Accéder à Supabase Dashboard
1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet AutoRush

### 1.2 Créer le bucket "videos" (avec limite de 50 MB pour tester)
**Note** : Pour l'instant, on utilise la limite par défaut de 50 MB. Vous pourrez l'augmenter plus tard dans Storage Settings si nécessaire.

1. Cliquez sur **"New bucket"** ou **"Create bucket"**
2. Configurez le bucket :
   - **Name** : `videos` (exactement comme ça, en minuscules)
   - **Public bucket** : ✅ **Cochez cette case** (pour permettre l'accès aux vidéos)
   - **Restrict file size** : ❌ **Désactivez le toggle** (pour utiliser la limite globale de 50 MB)
   - **Restrict MIME types** : ❌ **Laissez désactivé** (ou activez et ajoutez `video/*` si vous voulez restreindre)
3. Cliquez sur **"Create bucket"**

**Note pour plus tard** : Pour augmenter la limite à 10 GB, allez dans Storage Settings (⚙️) et augmentez la "File size limit" globale, puis modifiez le bucket pour activer "Restrict file size" avec 10 GB.

### 1.3 Configurer les politiques RLS (Row Level Security)
1. Dans Storage, cliquez sur le bucket `videos`
2. Allez dans l'onglet **"Policies"**
3. Cliquez sur **"New Policy"** ou **"Add policy"**

#### Politique 1 : Les utilisateurs peuvent uploader leurs propres vidéos
- **Policy name** : `Users can upload own videos`
- **Allowed operation** : `INSERT`
- **Target roles** : `authenticated`
- **Policy definition** :
```sql
bucket_id = 'videos' AND (storage.foldername(name))[1] = auth.uid()::text
```

#### Politique 2 : Les utilisateurs peuvent lire leurs propres vidéos
- **Policy name** : `Users can read own videos`
- **Allowed operation** : `SELECT`
- **Target roles** : `authenticated`
- **Policy definition** :
```sql
bucket_id = 'videos' AND (storage.foldername(name))[1] = auth.uid()::text
```

#### Politique 3 : Les utilisateurs peuvent supprimer leurs propres vidéos
- **Policy name** : `Users can delete own videos`
- **Allowed operation** : `DELETE`
- **Target roles** : `authenticated`
- **Policy definition** :
```sql
bucket_id = 'videos' AND (storage.foldername(name))[1] = auth.uid()::text
```

**Note** : Ces politiques utilisent le fait que les fichiers sont stockés dans `{user_id}/filename`, donc le premier élément du chemin (foldername) est l'ID utilisateur.

---

## Étape 2 : Exécuter les migrations SQL

### 2.1 Accéder à l'éditeur SQL
1. Dans Supabase Dashboard, cliquez sur **"SQL Editor"** dans le menu de gauche
2. Cliquez sur **"New query"**

### 2.2 Exécuter la migration 004 (Quota et Videos)
1. Ouvrez le fichier `supabase/migrations/004_add_quota_and_videos.sql` dans votre éditeur
2. Copiez tout le contenu
3. Collez-le dans l'éditeur SQL de Supabase
4. Cliquez sur **"Run"** ou appuyez sur `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
5. Vérifiez qu'il n'y a pas d'erreurs (message "Success. No rows returned")

### 2.3 Exécuter la migration 005 (Mise à jour subscription_plan)
1. Ouvrez le fichier `supabase/migrations/005_update_subscription_plan_check.sql`
2. Copiez tout le contenu
3. Collez-le dans l'éditeur SQL de Supabase
4. Cliquez sur **"Run"**
5. Vérifiez qu'il n'y a pas d'erreurs

### 2.4 Vérifier que tout est créé
Exécutez cette requête pour vérifier :

```sql
-- Vérifier la table videos
SELECT * FROM videos LIMIT 1;

-- Vérifier que quota_used_mb existe dans user_profiles
SELECT quota_used_mb FROM user_profiles LIMIT 1;

-- Vérifier les plans disponibles
SELECT DISTINCT subscription_plan FROM user_profiles;
```

Si aucune erreur n'apparaît, c'est bon ✅

---

## Étape 3 : Tester l'upload avec vérification de quota

### 3.1 Préparer un fichier de test
1. Créez ou trouvez une petite vidéo de test (moins de 10 MB pour tester facilement)
2. Notez la taille du fichier

### 3.2 Tester depuis l'interface AutoCut
1. Démarrez votre serveur de développement :
   ```bash
   npm run dev
   ```
2. Connectez-vous à votre compte (ou créez-en un)
3. Allez sur `/dashboard/autocut`
4. Vérifiez que l'indicateur de quota s'affiche dans le header (en haut à droite)
5. Cliquez sur **"Télécharger une vidéo"** ou glissez-déposez une vidéo
6. **Résultat attendu** :
   - Si la vidéo est < 500 MB : l'upload devrait fonctionner
   - Si la vidéo est > 500 MB : vous devriez voir un message d'erreur "Quota insuffisant"

### 3.3 Vérifier dans Supabase
1. Allez dans **Storage** > **videos**
2. Vous devriez voir un dossier avec votre `user_id`
3. À l'intérieur, vous devriez voir votre fichier vidéo

### 3.4 Vérifier le quota dans la base de données
Exécutez cette requête dans SQL Editor :

```sql
-- Vérifier votre quota utilisé
SELECT 
  u.email,
  up.subscription_plan,
  up.quota_used_mb,
  (SELECT COUNT(*) FROM videos WHERE user_id = u.id) as video_count
FROM auth.users u
JOIN user_profiles up ON u.id = up.id
WHERE u.email = 'votre-email@exemple.com';
```

Remplacez `votre-email@exemple.com` par votre email.

### 3.5 Tester la limite de quota
1. Essayez d'uploader une vidéo qui dépasse votre quota
2. **Résultat attendu** : Message d'erreur clair avec suggestion d'upgrade

---

## Dépannage

### Erreur : "Bucket not found"
- Vérifiez que le bucket s'appelle exactement `videos` (minuscules)
- Vérifiez que vous êtes dans le bon projet Supabase

### Erreur : "Permission denied"
- Vérifiez que le bucket est **public**
- Vérifiez que les politiques RLS sont bien créées
- Vérifiez que vous êtes connecté avec un compte utilisateur

### Erreur : "Quota insuffisant" même avec une petite vidéo
- Vérifiez dans la base de données : `SELECT quota_used_mb FROM user_profiles WHERE id = 'votre-user-id'`
- Le quota peut être incorrect si vous avez déjà uploadé des vidéos avant

### Le quota ne s'affiche pas dans le header
- Vérifiez la console du navigateur (F12) pour les erreurs
- Vérifiez que `useQuota` hook fonctionne correctement
- Vérifiez que vous êtes bien connecté

---

## Vérification finale

✅ Bucket `videos` créé et configuré  
✅ Migrations SQL exécutées sans erreur  
✅ Indicateur de quota visible dans le header  
✅ Upload de vidéo fonctionne  
✅ Vérification de quota fonctionne  
✅ Vidéos visibles dans Supabase Storage  

Si tout est ✅, votre MVP minimal est opérationnel !
