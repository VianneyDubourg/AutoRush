-- Script pour synchroniser les utilisateurs existants depuis auth.users vers user_profiles
-- Ce script crée un profil pour tous les utilisateurs qui n'en ont pas encore

-- Fonction pour synchroniser un utilisateur existant
CREATE OR REPLACE FUNCTION sync_existing_user(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Vérifier si le profil existe déjà
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE id = user_id) THEN
    -- Créer le profil pour l'utilisateur
    INSERT INTO public.user_profiles (id, email, name, is_admin, subscription_plan)
    SELECT 
      u.id,
      u.email,
      COALESCE(u.raw_user_meta_data->>'name', ''),
      FALSE,
      'free'
    FROM auth.users u
    WHERE u.id = user_id AND u.deleted_at IS NULL
    ON CONFLICT (id) DO NOTHING;
  END IF;
END;
$$;

-- Fonction pour synchroniser tous les utilisateurs existants
CREATE OR REPLACE FUNCTION sync_all_existing_users()
RETURNS TABLE (
  synced_count INTEGER,
  already_exists_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_synced_count INTEGER := 0;
  v_already_exists_count INTEGER := 0;
BEGIN
  -- Créer des profils pour tous les utilisateurs qui n'en ont pas
  INSERT INTO public.user_profiles (id, email, name, is_admin, subscription_plan)
  SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'name', ''),
    FALSE,
    'free'
  FROM auth.users u
  WHERE u.deleted_at IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM user_profiles up WHERE up.id = u.id
    )
  ON CONFLICT (id) DO NOTHING;
  
  GET DIAGNOSTICS v_synced_count = ROW_COUNT;
  
  -- Compter les utilisateurs qui avaient déjà un profil
  SELECT COUNT(*) INTO v_already_exists_count
  FROM auth.users u
  WHERE u.deleted_at IS NULL
    AND EXISTS (SELECT 1 FROM user_profiles up WHERE up.id = u.id);
  
  RETURN QUERY SELECT v_synced_count, v_already_exists_count;
END;
$$;

-- Commentaires
COMMENT ON FUNCTION sync_existing_user IS 'Synchronise un utilisateur existant depuis auth.users vers user_profiles';
COMMENT ON FUNCTION sync_all_existing_users IS 'Synchronise tous les utilisateurs existants depuis auth.users vers user_profiles';
