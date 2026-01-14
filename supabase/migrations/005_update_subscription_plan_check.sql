-- Mettre à jour la contrainte CHECK pour inclure 'creator'
ALTER TABLE user_profiles
DROP CONSTRAINT IF EXISTS user_profiles_subscription_plan_check;

ALTER TABLE user_profiles
ADD CONSTRAINT user_profiles_subscription_plan_check
CHECK (subscription_plan IN ('free', 'creator', 'pro', 'enterprise'));
