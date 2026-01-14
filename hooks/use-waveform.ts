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

  const initWaveform = useCallback((url: string) => {
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy()
      wavesurferRef.current = null
    }
    
    if (!waveformRef.current || !videoRef.current) return
    
    const video = videoRef.current
    
    const initWhenReady = () => {
      if (video.readyState < 2) {
        video.addEventListener('loadedmetadata', initWhenReady, { once: true })
        return
      }
      
      const audio = document.createElement('audio')
      audio.src = url
      audio.crossOrigin = 'anonymous'
      
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current!,
        waveColor: 'hsl(var(--primary))',
        progressColor: 'hsl(var(--primary) / 0.5)',
        cursorColor: 'hsl(var(--primary))',
        barWidth: 2,
        barRadius: 2,
        barGap: 1,
        height: 120,
        normalize: true,
        backend: 'MediaElement',
        media: audio,
        interact: false,
      })
      
      wavesurferRef.current = wavesurfer
      wavesurfer.on('ready', () => {
        if (video) {
          updateSilenceRegions()
        }
      })
    }
    
    initWhenReady()
  }, [videoRef])

  const updateSilenceRegions = useCallback(() => {
    if (!wavesurferRef.current) return
    wavesurferRef.current.clearRegions()
    detectedSilences.forEach((silence) => {
      wavesurferRef.current?.addRegion({
        start: silence.start,
        end: silence.end,
        color: 'rgba(239, 68, 68, 0.3)',
        drag: false,
        resize: false,
      })
    })
  }, [detectedSilences])

  // Initialiser la waveform quand la vidéo change
  useEffect(() => {
    if (videoUrl) {
      initWaveform(videoUrl)
    }
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy()
        wavesurferRef.current = null
      }
    }
  }, [videoUrl, initWaveform])

  // Mettre à jour les régions quand les silences changent
  useEffect(() => {
    if (detectedSilences.length > 0) {
      updateSilenceRegions()
    }
  }, [detectedSilences, updateSilenceRegions])

  // Synchroniser avec la vidéo
  useEffect(() => {
    if (!wavesurferRef.current || !videoRef.current || !videoUrl) return
    
    const video = videoRef.current
    const wavesurfer = wavesurferRef.current
    
    const handleTimeUpdate = () => {
      if (video.duration > 0) {
        const progress = video.currentTime / video.duration
        if (Math.abs((wavesurfer.getCurrentTime() / wavesurfer.getDuration()) - progress) > 0.01) {
          wavesurfer.seekTo(progress)
        }
      }
    }
    
    const handlePlay = () => wavesurfer.play()
    const handlePause = () => wavesurfer.pause()
    
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [videoUrl])

  return { waveformRef }
}
