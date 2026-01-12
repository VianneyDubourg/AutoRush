-- Vue complète des utilisateurs combinant auth.users et user_profiles
-- Cette vue expose tous les utilisateurs avec leurs informations complètes

CREATE OR REPLACE VIEW users_complete AS
SELECT 
  u.id,
  u.email,
  u.phone,
  u.email_confirmed_at,
  u.phone_confirmed_at,
  u.confirmed_at,
  u.last_sign_in_at,
  u.app_metadata,
  u.user_metadata,
  u.created_at as auth_created_at,
  u.updated_at as auth_updated_at,
  u.banned_until,
  u.deleted_at,
  -- Données de user_profiles
  COALESCE(up.name, u.user_metadata->>'name', '') as name,
  up.is_admin,
  up.subscription_plan,
  up.created_at as profile_created_at,
  up.updated_at as profile_updated_at,
  -- Vérifier si le profil existe
  CASE WHEN up.id IS NOT NULL THEN TRUE ELSE FALSE END as has_profile
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
WHERE u.deleted_at IS NULL; -- Exclure les utilisateurs supprimés

-- Commentaire sur la vue
COMMENT ON VIEW users_complete IS 'Vue complète de tous les utilisateurs actifs avec leurs informations depuis auth.users et user_profiles';

-- Fonction pour obtenir tous les utilisateurs (utilisable depuis le client avec RLS)
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  phone TEXT,
  name TEXT,
  is_admin BOOLEAN,
  subscription_plan TEXT,
  email_confirmed_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  has_profile BOOLEAN
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email::TEXT,
    u.phone::TEXT,
    COALESCE(up.name, u.user_metadata->>'name', '')::TEXT as name,
    COALESCE(up.is_admin, FALSE) as is_admin,
    COALESCE(up.subscription_plan, 'free')::TEXT as subscription_plan,
    u.email_confirmed_at,
    u.last_sign_in_at,
    u.created_at,
    u.updated_at,
    CASE WHEN up.id IS NOT NULL THEN TRUE ELSE FALSE END as has_profile
  FROM auth.users u
  LEFT JOIN public.user_profiles up ON u.id = up.id
  WHERE u.deleted_at IS NULL
  ORDER BY u.created_at DESC;
END;
$$;

-- Fonction pour obtenir un utilisateur spécifique
CREATE OR REPLACE FUNCTION get_user_by_id(user_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  phone TEXT,
  name TEXT,
  is_admin BOOLEAN,
  subscription_plan TEXT,
  email_confirmed_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  has_profile BOOLEAN
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email::TEXT,
    u.phone::TEXT,
    COALESCE(up.name, u.user_metadata->>'name', '')::TEXT as name,
    COALESCE(up.is_admin, FALSE) as is_admin,
    COALESCE(up.subscription_plan, 'free')::TEXT as subscription_plan,
    u.email_confirmed_at,
    u.last_sign_in_at,
    u.created_at,
    u.updated_at,
    CASE WHEN up.id IS NOT NULL THEN TRUE ELSE FALSE END as has_profile
  FROM auth.users u
  LEFT JOIN public.user_profiles up ON u.id = up.id
  WHERE u.id = user_id AND u.deleted_at IS NULL;
END;
$$;
