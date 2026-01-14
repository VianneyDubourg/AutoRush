import { useRef, useEffect, useCallback } from 'react'
import WaveSurfer from 'wavesurfer.js'

interface Silence {
  id: number
  start: number
  end: number
  duration: number
}

export function useWaveform(videoUrl: string | null, detectedSilences: Silence[], videoRef: React.RefObject<HTMLVideoElement>) {
  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const regionsRef = useRef<any[]>([])

  // Mettre à jour les régions de silence
  const updateSilenceRegions = useCallback(() => {
    if (!wavesurferRef.current) return
    
    // Supprimer les anciennes régions
    regionsRef.current.forEach((region) => {
      try {
        region.remove()
      } catch (e) {
        // Ignorer les erreurs si la région n'existe plus
      }
    })
    regionsRef.current = []
    
    // Ajouter les nouvelles régions
    detectedSilences.forEach((silence) => {
      try {
        const region = wavesurferRef.current?.addRegion({
          start: silence.start,
          end: silence.end,
          color: 'rgba(239, 68, 68, 0.3)',
          drag: false,
          resize: false,
        })
        if (region) {
          regionsRef.current.push(region)
        }
      } catch (e) {
        console.warn('Erreur lors de l\'ajout de la région:', e)
      }
    })
  }, [detectedSilences])

  // Initialiser la waveform quand la vidéo change
  useEffect(() => {
    if (!videoUrl || !waveformRef.current) return

    // Détruire l'instance précédente
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy()
      wavesurferRef.current = null
    }
    
    // Attendre un peu pour s'assurer que le conteneur est bien monté
    const timeoutId = setTimeout(() => {
      if (!waveformRef.current) return
      
      // Utiliser WebAudio backend qui fonctionne mieux avec les vidéos
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'hsl(var(--primary))',
        progressColor: 'hsl(var(--primary) / 0.5)',
        cursorColor: 'hsl(var(--primary))',
        barWidth: 2,
        barRadius: 2,
        barGap: 1,
        height: 120,
        normalize: true,
        backend: 'WebAudio',
        interact: false,
      })
      
      wavesurferRef.current = wavesurfer
      
      // Charger l'audio de la vidéo
      wavesurfer.load(videoUrl)
      
      wavesurfer.on('ready', () => {
        // Mettre à jour les régions une fois que la waveform est prête
        if (detectedSilences.length > 0) {
          updateSilenceRegions()
        }
      })
      
      wavesurfer.on('error', (error) => {
        console.error('Erreur WaveSurfer:', error)
      })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      // Nettoyer les régions
      regionsRef.current.forEach((region) => {
        try {
          region.remove()
        } catch (e) {
          // Ignorer les erreurs
        }
      })
      regionsRef.current = []
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy()
        wavesurferRef.current = null
      }
    }
  }, [videoUrl, updateSilenceRegions])

  // Mettre à jour les régions quand les silences changent
  useEffect(() => {
    if (wavesurferRef.current && detectedSilences.length > 0) {
      updateSilenceRegions()
    }
  }, [detectedSilences, updateSilenceRegions])

  // Synchroniser avec la vidéo
  useEffect(() => {
    if (!wavesurferRef.current || !videoRef.current || !videoUrl) return
    
    const video = videoRef.current
    const wavesurfer = wavesurferRef.current
    
    const handleTimeUpdate = () => {
      if (video.duration > 0 && wavesurfer.getDuration() > 0) {
        const progress = video.currentTime / video.duration
        const currentProgress = wavesurfer.getCurrentTime() / wavesurfer.getDuration()
        if (Math.abs(currentProgress - progress) > 0.01) {
          wavesurfer.seekTo(progress)
        }
      }
    }
    
    const handlePlay = () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.play()
      }
    }
    
    const handlePause = () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.pause()
      }
    }
    
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [videoUrl, videoRef])

  return { waveformRef }
}
