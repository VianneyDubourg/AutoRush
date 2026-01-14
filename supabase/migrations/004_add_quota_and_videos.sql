-- Migration pour ajouter le système de quota et la table videos
-- MVP minimal : pas de table subscription_plans (hardcodé dans le code)

-- Ajouter quota_used_mb à user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS quota_used_mb DECIMAL(10, 2) DEFAULT 0;

-- Créer la table videos
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  size_mb DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'completed', 'failed', 'expired')),
  storage_plan TEXT NOT NULL DEFAULT 'free' CHECK (storage_plan IN ('free', 'creator', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  processed_file_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS videos_user_id_idx ON videos(user_id);
CREATE INDEX IF NOT EXISTS videos_status_idx ON videos(status);
CREATE INDEX IF NOT EXISTS videos_expires_at_idx ON videos(expires_at);
CREATE INDEX IF NOT EXISTS user_profiles_quota_used_idx ON user_profiles(quota_used_mb);

-- RLS (Row Level Security)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir leurs propres vidéos
CREATE POLICY "Users can view own videos"
  ON videos FOR SELECT
  USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent créer leurs propres vidéos
CREATE POLICY "Users can create own videos"
  ON videos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent mettre à jour leurs propres vidéos
CREATE POLICY "Users can update own videos"
  ON videos FOR UPDATE
  USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent supprimer leurs propres vidéos
CREATE POLICY "Users can delete own videos"
  ON videos FOR DELETE
  USING (auth.uid() = user_id);

-- Fonction pour calculer le quota utilisé d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_quota_used(user_uuid UUID)
RETURNS DECIMAL(10, 2) AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(size_mb) FROM videos WHERE user_id = user_uuid AND status != 'expired'),
    0
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour mettre à jour le quota utilisé
CREATE OR REPLACE FUNCTION update_user_quota()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles
  SET quota_used_mb = get_user_quota_used(NEW.user_id)
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour le quota automatiquement
CREATE TRIGGER update_quota_on_video_change
  AFTER INSERT OR UPDATE OR DELETE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_user_quota();
