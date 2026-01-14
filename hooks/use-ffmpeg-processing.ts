import { useRef, useState } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

interface Silence {
  start: number
  end: number
}

export function useFFmpegProcessing() {
  const ffmpegRef = useRef<FFmpeg | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const initFFmpeg = async (): Promise<FFmpeg> => {
    if (ffmpegRef.current && (ffmpegRef.current as any).loaded) {
      return ffmpegRef.current
    }

    const ffmpeg = new FFmpeg()
    ffmpegRef.current = ffmpeg
    ffmpeg.on('log', ({ message }) => console.log('FFmpeg:', message))

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
    setDownloadProgress(10)
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
    setDownloadProgress(30)
    return ffmpeg
  }

  const processVideo = async (
    file: File,
    silences: Silence[],
    videoDuration: number
  ): Promise<Blob> => {
    try {
      const ffmpeg = await initFFmpeg()
      const sortedSilences = [...silences].sort((a, b) => a.start - b.start)
      
      setDownloadProgress(40)
      await ffmpeg.writeFile('input.mp4', await fetchFile(file))
      setDownloadProgress(50)
      
      // Calculer les segments à garder
      const segments: Array<{ start: number; end: number }> = []
      let currentTime = 0
      
      for (const silence of sortedSilences) {
        if (silence.start > currentTime) {
          segments.push({ start: currentTime, end: silence.start })
        }
        currentTime = Math.max(currentTime, silence.end)
      }
      
      if (currentTime < videoDuration) {
        segments.push({ start: currentTime, end: videoDuration })
      }
      
      if (segments.length === 0) {
        throw new Error('Toute la vidéo est composée de silences')
      }
      
      setDownloadProgress(60)
      
      // Traiter selon le nombre de segments
      if (segments.length === 1) {
        const seg = segments[0]
        try {
          await ffmpeg.exec([
            '-i', 'input.mp4',
            '-ss', seg.start.toString(),
            '-t', (seg.end - seg.start).toString(),
            '-c', 'copy',
            'output.mp4'
          ])
        } catch (execError) {
          console.error('Erreur FFmpeg exec (single segment):', execError)
          throw new Error(`Erreur lors du traitement vidéo: ${execError instanceof Error ? execError.message : 'Erreur inconnue'}`)
        }
      } else {
        const filterParts: string[] = []
        const concatInputs: string[] = []
        
        segments.forEach((seg, i) => {
          const duration = seg.end - seg.start
          filterParts.push(`[0:v]trim=start=${seg.start}:duration=${duration},setpts=PTS-STARTPTS[v${i}]`)
          filterParts.push(`[0:a]atrim=start=${seg.start}:duration=${duration},asetpts=PTS-STARTPTS[a${i}]`)
          concatInputs.push(`[v${i}][a${i}]`)
        })
        
        const filterComplex = `${filterParts.join(';')};${concatInputs.join('')}concat=n=${segments.length}:v=1:a=1[outv][outa]`
        
        try {
          await ffmpeg.exec([
            '-i', 'input.mp4',
            '-filter_complex', filterComplex,
            '-map', '[outv]',
            '-map', '[outa]',
            '-c:v', 'libx264',
            '-c:a', 'aac',
            '-preset', 'fast',
            '-crf', '23',
            '-shortest',
            'output.mp4'
          ])
        } catch (execError) {
          console.error('Erreur FFmpeg exec (multiple segments):', execError)
          throw new Error(`Erreur lors du traitement vidéo: ${execError instanceof Error ? execError.message : 'Erreur inconnue'}`)
        }
      }
      
      setDownloadProgress(90)
      
      // Lire le fichier de sortie
      let data: Uint8Array
      try {
        data = await ffmpeg.readFile('output.mp4') as Uint8Array
      } catch (readError) {
        console.error('Erreur lors de la lecture du fichier:', readError)
        throw new Error('Le fichier de sortie n\'a pas été créé ou est inaccessible')
      }
      
      // Nettoyer les fichiers temporaires
      try {
        await ffmpeg.deleteFile('input.mp4')
        await ffmpeg.deleteFile('output.mp4')
      } catch (cleanupError) {
        console.warn('Erreur lors du nettoyage:', cleanupError)
      }
      
      setDownloadProgress(100)
      
      if (!data || data.length === 0) {
        throw new Error('Le fichier de sortie est vide')
      }
      
      return new Blob([data], { type: 'video/mp4' })
    } catch (error) {
      console.error('Erreur dans processVideo:', error)
      throw error
    }
  }

  return { processVideo, downloadProgress, setDownloadProgress }
}
