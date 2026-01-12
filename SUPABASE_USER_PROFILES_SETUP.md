# Configuration de la table user_profiles dans Supabase

## Instructions pour créer la table dans Supabase

1. **Accédez au SQL Editor dans Supabase**
   - Connectez-vous à votre projet Supabase : https://app.supabase.com
   - Allez dans **SQL Editor** dans le menu de gauche

2. **Exécutez les scripts SQL dans l'ordre :**
   
   **Étape 1 : Créer la table user_profiles**
   - Cliquez sur **New Query**
   - Copiez le contenu du fichier `supabase/migrations/001_create_user_profiles.sql`
   - Collez-le dans l'éditeur SQL
   - Cliquez sur **Run** pour exécuter le script

   **Étape 2 : Créer la vue complète des utilisateurs (optionnel)**
   - Créez une nouvelle query
   - Copiez le contenu du fichier `supabase/migrations/002_create_users_view.sql`
   - Collez-le dans l'éditeur SQL
   - Cliquez sur **Run** pour exécuter le script

   **Étape 3 : Synchroniser les utilisateurs existants**
   - Créez une nouvelle query
   - Copiez le contenu du fichier `supabase/migrations/003_sync_existing_users.sql`
   - Collez-le dans l'éditeur SQL
   - Cliquez sur **Run** pour exécuter le script
   - **IMPORTANT** : Exécutez ensuite cette commande pour synchroniser tous les utilisateurs existants :
   ```sql
   SELECT * FROM sync_all_existing_users();
   ```

3. **Vérification**
   - Allez dans **Table Editor** dans le menu de gauche
   - Vous devriez voir une nouvelle table `user_profiles`
   - Tous les utilisateurs qui ont créé un compte devraient avoir un profil dans cette table

## Structure de la table user_profiles

La table `user_profiles` contient les colonnes suivantes :

- `id` (UUID, Primary Key) - L'ID de l'utilisateur depuis auth.users
- `email` (TEXT) - L'email de l'utilisateur
- `name` (TEXT) - Le nom de l'utilisateur
- `is_admin` (BOOLEAN) - Indique si l'utilisateur est administrateur
- `subscription_plan` (TEXT) - Le plan d'abonnement : 'free', 'pro', 'enterprise'
- `created_at` (TIMESTAMP) - Date de création du profil
- `updated_at` (TIMESTAMP) - Date de dernière mise à jour

## Fonctionnalités incluses

✅ **Table user_profiles** : Stocke les informations supplémentaires des utilisateurs
✅ **Trigger automatique** : Crée un profil utilisateur lors de l'inscription
✅ **Fonction de synchronisation** : Synchronise les utilisateurs existants
✅ **Index** : Optimisation pour les recherches par email, is_admin et subscription_plan
✅ **RLS (Row Level Security)** : Sécurité au niveau des lignes
   - Les utilisateurs peuvent voir leur propre profil
   - Les administrateurs peuvent voir et modifier tous les profils
✅ **Mise à jour automatique** : Le champ `updated_at` est mis à jour automatiquement

## Plans d'abonnement

- **free** : Plan gratuit (par défaut)
- **pro** : Plan professionnel
- **enterprise** : Plan entreprise

## Première configuration d'un administrateur

Pour créer votre premier administrateur, exécutez cette requête SQL dans le SQL Editor :

```sql
-- Remplacez 'votre-email@example.com' par votre email
UPDATE user_profiles
SET is_admin = TRUE
WHERE email = 'votre-email@example.com';
```

Ou si vous connaissez l'ID de l'utilisateur :

```sql
-- Remplacez 'user-id' par l'ID de l'utilisateur
UPDATE user_profiles
SET is_admin = TRUE
WHERE id = 'user-id';
```

## Synchroniser les utilisateurs existants

Si vous avez déjà des utilisateurs dans votre base de données avant de créer la table `user_profiles`, exécutez cette commande pour créer leurs profils :

```sql
SELECT * FROM sync_all_existing_users();
```

Cette fonction retournera :
- `synced_count` : Le nombre d'utilisateurs pour lesquels un profil a été créé
- `already_exists_count` : Le nombre d'utilisateurs qui avaient déjà un profil

## Voir tous les utilisateurs

Pour voir tous les utilisateurs dans la table `user_profiles`, exécutez :

```sql
SELECT * FROM user_profiles ORDER BY created_at DESC;
```

## Notes importantes

- ⚠️ La table `user_profiles` est liée à la table `auth.users` de Supabase via la clé primaire `id`
- ⚠️ Les politiques RLS permettent uniquement aux administrateurs de modifier les profils des autres utilisateurs
- ⚠️ Un trigger automatique crée un profil pour chaque nouvel utilisateur qui s'inscrit
- ⚠️ Si un utilisateur est supprimé de `auth.users`, son profil est automatiquement supprimé (CASCADE)
- ⚠️ La table `user_profiles` contient **tous les utilisateurs** qui ont créé un compte, grâce au trigger automatique