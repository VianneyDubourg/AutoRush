import { createClient } from '@/lib/supabase/server'
import { getPlanConfig, canUploadVideo, type PlanType } from './plans'

export async function getUserQuota(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .select('quota_used_mb, subscription_plan')
    .eq('id', userId)
    .single()

  if (error || !data) {
    return {
      quotaUsed: 0,
      quotaMax: 500,
      plan: 'free' as PlanType,
    }
  }

  const plan = (data.subscription_plan || 'free') as PlanType
  const config = getPlanConfig(plan)

  return {
    quotaUsed: Number(data.quota_used_mb || 0),
    quotaMax: config.quotaMb,
    plan,
    config,
  }
}

export async function checkQuotaBeforeUpload(
  userId: string,
  videoSizeMb: number
) {
  const supabase = await createClient()
  const quota = await getUserQuota(userId)
  const check = canUploadVideo(quota.plan, quota.quotaUsed, videoSizeMb)

  return {
    ...check,
    quota,
  }
}

export function formatQuota(mb: number): string {
  if (mb < 1024) {
    return `${mb.toFixed(2)} MB`
  }
  return `${(mb / 1024).toFixed(2)} Go`
}
