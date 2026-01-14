import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkQuotaBeforeUpload } from '@/lib/quota'
import { getPlanConfig } from '@/lib/plans'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Vérifier que c'est une vidéo
    if (!file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'Le fichier doit être une vidéo' }, { status: 400 })
    }

    // Calculer la taille en MB
    const fileSizeMb = file.size / (1024 * 1024)

    // Vérifier le quota
    const quotaCheck = await checkQuotaBeforeUpload(user.id, fileSizeMb)

    if (!quotaCheck.allowed) {
      return NextResponse.json(
        { error: quotaCheck.reason || 'Quota insuffisant' },
        { status: 403 }
      )
    }

    // Récupérer le plan de l'utilisateur
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('subscription_plan')
      .eq('id', user.id)
      .single()

    const plan = (profile?.subscription_plan || 'free') as 'free' | 'creator' | 'pro'
    const config = getPlanConfig(plan)

    // Calculer la date d'expiration
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + config.storageHours)

    // Upload vers Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    const filePath = `videos/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'upload: ' + uploadError.message },
        { status: 500 }
      )
    }

    // Obtenir l'URL publique
    const {
      data: { publicUrl },
    } = supabase.storage.from('videos').getPublicUrl(filePath)

    // Créer l'entrée dans la table videos
    const { data: videoData, error: videoError } = await supabase
      .from('videos')
      .insert({
        user_id: user.id,
        filename: fileName,
        original_filename: file.name,
        size_mb: fileSizeMb,
        status: 'uploaded',
        storage_plan: plan,
        expires_at: expiresAt.toISOString(),
        processed_file_url: publicUrl,
      })
      .select()
      .single()

    if (videoError) {
      // Supprimer le fichier uploadé en cas d'erreur
      await supabase.storage.from('videos').remove([filePath])
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'enregistrement: ' + videoError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      video: videoData,
      quota: quotaCheck.quota,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'upload' },
      { status: 500 }
    )
  }
}
