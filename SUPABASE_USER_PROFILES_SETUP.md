# Configuration de la table user_profiles dans Supabase

## Instructions pour créer la table dans Supabase

1. **Accédez au SQL Editor dans Supabase**
   - Connectez-vous à votre projet Supabase : https://app.supabase.com
   - Allez dans **SQL Editor** dans le menu de gauche

2. **Exécutez le script SQL**
   - Cliquez sur **New Query**
   - Copiez le contenu du fichier `supabase/migrations/001_create_user_profiles.sql`
   - Collez-le dans l'éditeur SQL
   - Cliquez sur **Run** pour exécuter le script

3. **Vérification**
   - Allez dans **Table Editor** dans le menu de gauche
   - Vous devriez voir une nouvelle table `user_profiles`
   - La table devrait contenir les colonnes suivantes :
     - `id` (UUID, Primary Key)
     - `email` (TEXT)
     - `name` (TEXT)
     - `is_admin` (BOOLEAN)
     - `subscription_plan` (TEXT: 'free', 'pro', 'enterprise')
     - `created_at` (TIMESTAMP)
     - `updated_at` (TIMESTAMP)

## Fonctionnalités incluses

✅ **Table user_profiles** : Stocke les informations supplémentaires des utilisateurs
✅ **Index** : Optimisation pour les recherches par email, is_admin et subscription_plan
✅ **Trigger automatique** : Crée un profil utilisateur lors de l'inscription
✅ **RLS (Row Level Security)** : Sécurité au niveau des lignes
   - Les utilisateurs peuvent voir leur propre profil
   - Les administrateurs peuvent voir et modifier tous les profils
✅ **Mise à jour automatique** : Le champ `updated_at` est mis à jour automatiquement

## Plans d'abonnement

- **free** : Plan gratuit (par défaut)
- **pro** : Plan professionnel
- **enterprise** : Plan entreprise

## Première configuration d'un administrateur

Pour créer votre premier administrateur, vous pouvez exécuter cette requête SQL dans le SQL Editor :

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

## Notes importantes

- ⚠️ La table `user_profiles` est liée à la table `auth.users` de Supabase via la clé primaire `id`
- ⚠️ Les politiques RLS permettent uniquement aux administrateurs de modifier les profils des autres utilisateurs
- ⚠️ Un trigger automatique crée un profil pour chaque nouvel utilisateur qui s'inscrit
- ⚠️ Si un utilisateur est supprimé de `auth.users`, son profil est automatiquement supprimé (CASCADE)
