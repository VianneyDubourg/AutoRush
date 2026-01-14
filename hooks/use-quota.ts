"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/auth-client'
import { getPlanConfig, type PlanType } from '@/lib/plans'
import { formatQuota } from '@/lib/quota'

interface QuotaData {
  quotaUsed: number
  quotaMax: number
  plan: PlanType
  percentage: number
  formattedUsed: string
  formattedMax: string
}

export function useQuota() {
  const [quota, setQuota] = useState<QuotaData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchQuota() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('user_profiles')
          .select('quota_used_mb, subscription_plan')
          .eq('id', user.id)
          .single()

        if (error || !data) {
          const plan = 'free' as PlanType
          const config = getPlanConfig(plan)
          setQuota({
            quotaUsed: 0,
            quotaMax: config.quotaMb,
            plan,
            percentage: 0,
            formattedUsed: '0 MB',
            formattedMax: formatQuota(config.quotaMb),
          })
          setIsLoading(false)
          return
        }

        const plan = (data.subscription_plan || 'free') as PlanType
        const config = getPlanConfig(plan)
        const quotaUsed = Number(data.quota_used_mb || 0)
        const percentage = (quotaUsed / config.quotaMb) * 100

        setQuota({
          quotaUsed,
          quotaMax: config.quotaMb,
          plan,
          percentage: Math.min(percentage, 100),
          formattedUsed: formatQuota(quotaUsed),
          formattedMax: formatQuota(config.quotaMb),
        })
      } catch (error) {
        console.error('Error fetching quota:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuota()
  }, [])

  return { quota, isLoading }
}
