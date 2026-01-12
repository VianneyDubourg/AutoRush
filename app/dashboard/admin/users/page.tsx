"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Users, Shield, Crown, Sparkles, Save, Loader2 } from "lucide-react"
import { useAdmin } from "@/hooks/use-admin"
import { Badge } from "@/components/ui/badge"
import { getAllUsersFromProfiles, type UserComplete } from "@/lib/supabase/users"

interface UserProfile {
  id: string
  email: string | null
  name: string | null
  is_admin: boolean
  subscription_plan: 'free' | 'pro' | 'enterprise'
  created_at: string
  last_sign_in_at?: string | null
  email_confirmed_at?: string | null
}

export default function AdminUsersPage() {
  const router = useRouter()
  const { isAdmin, isLoading: isAdminLoading } = useAdmin()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAdminLoading) {
      if (!isAdmin) {
        router.push('/dashboard')
        return
      }
      loadUsers()
    }
  }, [isAdmin, isAdminLoading, router])

  async function loadUsers() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading users:', error)
        setError('Erreur lors du chargement des utilisateurs')
      } else {
        setUsers(data || [])
      }
    } catch (err) {
      console.error('Error loading users:', err)
      setError('Erreur lors du chargement des utilisateurs')
    } finally {
      setIsLoading(false)
    }
  }

  async function updateUser(userId: string, field: 'is_admin' | 'subscription_plan', value: boolean | string) {
    try {
      setSaving(userId)
      setError(null)

      const { error } = await supabase
        .from('user_profiles')
        .update({ [field]: value })
        .eq('id', userId)

      if (error) {
        console.error('Error updating user:', error)
        setError('Erreur lors de la mise à jour de l\'utilisateur')
        // Recharger les utilisateurs pour revenir à l'état précédent
        loadUsers()
      } else {
        // Mettre à jour l'état local
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, [field]: value }
            : user
        ))
      }
    } catch (err) {
      console.error('Error updating user:', err)
      setError('Erreur lors de la mise à jour de l\'utilisateur')
      loadUsers()
    } finally {
      setSaving(null)
    }
  }

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'default'
      case 'pro':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'Enterprise'
      case 'pro':
        return 'Pro'
      default:
        return 'Gratuit'
    }
  }

  if (isAdminLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Gestion des utilisateurs
        </h1>
        <p className="text-muted-foreground">
          Gérez les rôles et abonnements des utilisateurs
        </p>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            {users.length} utilisateur{users.length > 1 ? 's' : ''} au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {user.name || user.email || 'Utilisateur sans nom'}
                      </span>
                      {user.is_admin && (
                        <Badge variant="default" className="gap-1">
                          <Shield className="h-3 w-3" />
                          Admin
                        </Badge>
                      )}
                      <Badge variant={getPlanBadgeVariant(user.subscription_plan)}>
                        {getPlanLabel(user.subscription_plan)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`admin-${user.id}`}
                      checked={user.is_admin}
                      disabled={saving === user.id}
                      onCheckedChange={(checked) => {
                        updateUser(user.id, 'is_admin', checked as boolean)
                      }}
                    />
                    <label
                      htmlFor={`admin-${user.id}`}
                      className="text-sm font-medium cursor-pointer flex items-center gap-1"
                    >
                      <Shield className="h-4 w-4" />
                      Administrateur
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor={`plan-${user.id}`} className="text-sm font-medium">
                      Plan :
                    </label>
                    <Select
                      value={user.subscription_plan}
                      disabled={saving === user.id}
                      onValueChange={(value) => {
                        updateUser(user.id, 'subscription_plan', value)
                      }}
                    >
                      <SelectTrigger id={`plan-${user.id}`} className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Gratuit
                          </div>
                        </SelectItem>
                        <SelectItem value="pro">
                          <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4" />
                            Pro
                          </div>
                        </SelectItem>
                        <SelectItem value="enterprise">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Enterprise
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {saving === user.id && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun utilisateur trouvé
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
