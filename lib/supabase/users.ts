import { supabase } from '@/lib/auth-client'

export interface UserComplete {
  id: string
  email: string | null
  phone: string | null
  name: string | null
  is_admin: boolean
  subscription_plan: 'free' | 'pro' | 'enterprise'
  email_confirmed_at: string | null
  last_sign_in_at: string | null
  created_at: string
  updated_at: string
  has_profile: boolean
}

/**
 * Récupère tous les utilisateurs (nécessite les droits admin)
 */
export async function getAllUsers(): Promise<UserComplete[]> {
  const { data, error } = await supabase.rpc('get_all_users')

  if (error) {
    console.error('Error fetching users:', error)
    throw error
  }

  return data || []
}

/**
 * Récupère un utilisateur par son ID
 */
export async function getUserById(userId: string): Promise<UserComplete | null> {
  const { data, error } = await supabase.rpc('get_user_by_id', {
    user_id: userId
  })

  if (error) {
    console.error('Error fetching user:', error)
    throw error
  }

  return data?.[0] || null
}

/**
 * Récupère tous les utilisateurs depuis la table user_profiles (alternative)
 */
export async function getAllUsersFromProfiles() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users from profiles:', error)
    throw error
  }

  return data
}
