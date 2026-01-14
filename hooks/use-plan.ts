"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/auth-client'
import { getPlanConfig, type PlanType } from '@/lib/plans'

export function usePlan() {
  const [plan, setPlan] = useState<PlanType>('free')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPlan() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('user_profiles')
          .select('subscription_plan')
          .eq('id', user.id)
          .single()

        if (error || !data) {
          setPlan('free')
        } else {
          setPlan((data.subscription_plan || 'free') as PlanType)
        }
      } catch (error) {
        console.error('Error fetching plan:', error)
        setPlan('free')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlan()
  }, [])

  const config = getPlanConfig(plan)

  return {
    plan,
    config,
    isLoading,
    isFree: plan === 'free',
    isCreator: plan === 'creator',
    isPro: plan === 'pro',
  }
}
