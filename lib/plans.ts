// Configuration des plans - hardcodé pour MVP minimal
export type PlanType = 'free' | 'creator' | 'pro'

export interface PlanConfig {
  name: string
  price: number
  quotaMb: number
  storageHours: number
  concurrentJobs: number
  autocutLevel: 'basic' | 'advanced'
  autoframeLevel: 'standard' | 'complete'
}

export const PLANS: Record<PlanType, PlanConfig> = {
  free: {
    name: 'Gratuit',
    price: 0,
    quotaMb: 500,
    storageHours: 24,
    concurrentJobs: 1,
    autocutLevel: 'basic',
    autoframeLevel: 'standard',
  },
  creator: {
    name: 'Creator',
    price: 4.99,
    quotaMb: 5120, // 5 Go
    storageHours: 72,
    concurrentJobs: 1,
    autocutLevel: 'advanced',
    autoframeLevel: 'complete',
  },
  pro: {
    name: 'Pro',
    price: 9.99,
    quotaMb: 15360, // 15 Go
    storageHours: 168, // 7 jours
    concurrentJobs: 2,
    autocutLevel: 'advanced',
    autoframeLevel: 'complete',
  },
}

export function getPlanConfig(plan: PlanType): PlanConfig {
  return PLANS[plan] || PLANS.free
}

export function canUploadVideo(
  plan: PlanType,
  quotaUsedMb: number,
  videoSizeMb: number
): { allowed: boolean; reason?: string } {
  const config = getPlanConfig(plan)
  const newTotal = quotaUsedMb + videoSizeMb

  if (newTotal > config.quotaMb) {
    return {
      allowed: false,
      reason: `Quota insuffisant. Vous avez ${quotaUsedMb.toFixed(2)} MB utilisés sur ${config.quotaMb} MB. Passez au plan ${plan === 'free' ? 'Creator' : 'Pro'} pour plus d'espace.`,
    }
  }

  return { allowed: true }
}
