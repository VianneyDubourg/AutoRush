"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Upload, 
  Play, 
  Pause, 
  Download, 
  Settings, 
  Scissors,
  Volume2,
  Clock,
  FileVideo,
  X,
  CheckCircle2,
  Loader2
} from "lucide-react"
import { useState, useRef, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { usePlan } from "@/hooks/use-plan"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"

interface Silence {
  id: number
  start: number
  end: number
  duration: number
}

export default function AutoCutPage() {
  const { config, isFree } = usePlan()
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasVideo, setHasVideo] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [videoName, setVideoName] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [detectedSilences, setDetectedSilences] = useState<Silence[]>([])
  const [processingProgress, setProcessingProgress] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  
  // Réglages - fixes pour plan gratuit, ajustables pour Creator/Pro
  const [threshold, setThreshold] = useState(-40)
  const [minDuration, setMinDuration] = useState(500)
  const [padding, setPadding] = useState(isFree ? 0 : 100)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const ffmpegRef = useRef<FFmpeg | null>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('video/')) {
      // Créer une URL pour la vidéo
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
      setVideoFile(file)
      setVideoName(file.name)
      setHasVideo(true)
      setDetectedSilences([])
      setCurrentTime(0)
      setIsProcessing(false)
    }
  }

  // Gérer la lecture/pause de la vidéo
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Mettre à jour le temps actuel
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  // Mettre à jour la durée de la vidéo
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration)
    }
  }

  // Gérer le changement de position depuis le slider
  const handleSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value
      setCurrentTime(value)
    }
  }

  // Nettoyer l'URL de la vidéo lors du démontage
  const handleRemoveVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
    }
    if (videoRef.current) {
      videoRef.current.pause()
    }
    setHasVideo(false)
    setVideoName(null)
    setVideoUrl(null)
    setVideoFile(null)
    setDetectedSilences([])
    setCurrentTime(0)
    setIsPlaying(false)
    setIsProcessing(false)
  }

  // Initialiser FFmpeg
  const initFFmpeg = async () => {
    if (ffmpegRef.current && (ffmpegRef.current as any).loaded) {
      return ffmpegRef.current
    }

    const ffmpeg = new FFmpeg()
    ffmpegRef.current = ffmpeg

    // Ajouter un listener pour la progression
    ffmpeg.on('log', ({ message }) => {
      console.log('FFmpeg:', message)
    })

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
    
    setDownloadProgress(10)
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
    setDownloadProgress(30)

    return ffmpeg
  }

  // Traiter la vidéo pour supprimer les silences
  const processVideoWithFFmpeg = async (file: File, silences: Silence[]): Promise<Blob> => {
    const ffmpeg = await initFFmpeg()
    
    // Trier les silences par ordre chronologique
    const sortedSilences = [...silences].sort((a, b) => a.start - b.start)
    
    setDownloadProgress(40)
    // Écrire le fichier vidéo dans le système de fichiers virtuel
    await ffmpeg.writeFile('input.mp4', await fetchFile(file))
    setDownloadProgress(50)
    
    // Créer les segments à garder (tout sauf les silences)
    const segments: Array<{ start: number; end: number }> = []
    let currentTime = 0
    
    for (const silence of sortedSilences) {
      // Si il y a un segment avant le silence, l'ajouter
      if (silence.start > currentTime) {
        segments.push({ start: currentTime, end: silence.start })
      }
      currentTime = Math.max(currentTime, silence.end)
    }
    
    // Ajouter le dernier segment s'il reste de la vidéo après le dernier silence
    if (currentTime < videoDuration) {
      segments.push({ start: currentTime, end: videoDuration })
    }
    
    // Si aucun segment (toute la vidéo est silence), retourner une vidéo vide
    if (segments.length === 0) {
      throw new Error('Toute la vidéo est composée de silences')
    }
    
    setDownloadProgress(60)
    
    // Si un seul segment, utiliser trim directement
    if (segments.length === 1) {
      const seg = segments[0]
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-ss', seg.start.toString(),
        '-t', (seg.end - seg.start).toString(),
        '-c', 'copy',
        'output.mp4'
      ])
    } else {
      // Plusieurs segments : créer un filtre complexe pour trim et concat
      const filterParts: string[] = []
      const concatInputs: string[] = []
      
      segments.forEach((seg, i) => {
        const duration = seg.end - seg.start
        filterParts.push(`[0:v]trim=start=${seg.start}:duration=${duration},setpts=PTS-STARTPTS[v${i}]`)
        filterParts.push(`[0:a]atrim=start=${seg.start}:duration=${duration},asetpts=PTS-STARTPTS[a${i}]`)
        concatInputs.push(`[v${i}][a${i}]`)
      })
      
      // Construire le filtre concat correctement
      const filterComplex = `${filterParts.join(';')};${concatInputs.join('')}concat=n=${segments.length}:v=1:a=1[outv][outa]`
      
      // Exécuter FFmpeg
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
    }
    
    setDownloadProgress(90)
    
    // Lire le fichier de sortie
    const data = await ffmpeg.readFile('output.mp4')
    
    // Nettoyer les fichiers temporaires
    await ffmpeg.deleteFile('input.mp4')
    await ffmpeg.deleteFile('output.mp4')
    
    setDownloadProgress(100)
    return new Blob([data], { type: 'video/mp4' })
  }

  // Télécharger la vidéo traitée
  const handleDownloadProcessedVideo = async () => {
    if (!videoFile || detectedSilences.length === 0) {
      return
    }

    setIsDownloading(true)
    setDownloadProgress(0)
    
    try {
      // Traiter la vidéo avec FFmpeg pour supprimer les silences
      const processedBlob = await processVideoWithFFmpeg(videoFile, detectedSilences)
      
      // Créer un nom de fichier pour la vidéo traitée
      const originalName = videoName || 'video.mp4'
      const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
      const extension = originalName.split('.').pop()
      const processedFileName = `${nameWithoutExt}_processed.${extension}`
      
      // Convertir le Blob en File pour l'upload
      const processedFile = new File([processedBlob], processedFileName, { type: 'video/mp4' })
      
      // Uploader vers Supabase
      try {
        const formData = new FormData()
        formData.append('file', processedFile)
        
        const uploadResponse = await fetch('/api/videos/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (uploadResponse.ok) {
          const result = await uploadResponse.json()
          console.log('Vidéo traitée uploadée avec succès:', result)
        } else {
          const error = await uploadResponse.json()
          console.warn('Erreur lors de l\'upload vers Supabase:', error)
          // On continue quand même le téléchargement local
        }
      } catch (uploadError) {
        console.warn('Erreur lors de l\'upload vers Supabase:', uploadError)
        // On continue quand même le téléchargement local
      }
      
      // Créer un lien de téléchargement local
      const url = URL.createObjectURL(processedBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = processedFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Nettoyer l'URL après un délai
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 100)
      
    } catch (error) {
      console.error('Erreur lors du traitement:', error)
      alert(`Erreur lors du traitement de la vidéo: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setIsDownloading(false)
      setDownloadProgress(0)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleDetectSilences = () => {
    setIsProcessing(true)
    setProcessingProgress(0)
    
    // Simulation du traitement
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          // Simuler des silences détectés
          setDetectedSilences([
            { id: 1, start: 5.2, end: 7.8, duration: 2.6 },
            { id: 2, start: 12.5, end: 14.1, duration: 1.6 },
            { id: 3, start: 23.4, end: 26.2, duration: 2.8 },
            { id: 4, start: 45.7, end: 48.3, duration: 2.6 },
            { id: 5, start: 67.2, end: 70.1, duration: 2.9 },
            { id: 6, start: 89.5, end: 92.3, duration: 2.8 },
            { id: 7, start: 112.8, end: 115.4, duration: 2.6 },
            { id: 8, start: 134.2, end: 137.1, duration: 2.9 },
          ])
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const totalSilenceTime = detectedSilences.reduce((acc, s) => acc + s.duration, 0)
  const finalDuration = videoDuration - totalSilenceTime

  // Génération de la waveform (simulée)
  const generateWaveform = () => {
    // Augmenter le nombre de barres pour une meilleure résolution
    const barCount = Math.min(300, Math.max(150, Math.floor(videoDuration * 2)))
    return Array.from({ length: barCount }, (_, i) => {
      const position = (i / barCount) * videoDuration
      // Simuler des zones de silence avec des valeurs basses
      const isSilence = detectedSilences.some(s => 
        position >= s.start && position <= s.end
      )
      
      if (isSilence) {
        // Zones de silence : très bas niveau (5-15%)
        return Math.random() * 10 + 5
      } else {
        // Zones avec audio : variation plus réaliste (20-95%)
        // Simuler des pics et des creux naturels
        const base = Math.random() * 50 + 30
        const variation = Math.sin(i * 0.1) * 20
        return Math.max(20, Math.min(95, base + variation))
      }
    })
  }

  const waveform = generateWaveform()

  // Nettoyer l'URL de la vidéo lors du démontage
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [videoUrl])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Scissors className="h-8 w-8 text-primary" />
          AutoCut
        </h1>
        <p className="text-muted-foreground">
          Supprimez intelligemment les silences de vos vidéos avec preview et timeline audio
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Video Preview Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Preview vidéo</CardTitle>
                  <CardDescription>
                    {videoName || "Visualisez votre vidéo et les zones de silence détectées"}
                  </CardDescription>
                </div>
                {hasVideo && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveVideo}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div
                ref={dropZoneRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                  "aspect-video bg-muted rounded-lg flex items-center justify-center border-2 transition-colors",
                  isDragging ? "border-primary bg-primary/5" : "border-dashed",
                  hasVideo && "border-solid"
                )}
              >
                {hasVideo ? (
                  <div className="w-full h-full relative bg-background rounded overflow-hidden">
                    {videoUrl && (
                      <>
                        <video
                          ref={videoRef}
                          src={videoUrl}
                          className="w-full h-full object-contain"
                          onTimeUpdate={handleTimeUpdate}
                          onLoadedMetadata={handleLoadedMetadata}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onEnded={() => setIsPlaying(false)}
                        />
                        
                        {/* Contrôles de lecture */}
                        <div className="absolute top-4 left-4">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handlePlayPause}
                            className="bg-black/70 hover:bg-black/90 text-white"
                          >
                            {isPlaying ? (
                              <Pause className="h-4 w-4 mr-2" />
                            ) : (
                              <Play className="h-4 w-4 mr-2" />
                            )}
                            {isPlaying ? "Pause" : "Lecture"}
                          </Button>
                        </div>
                        
                        {/* Timeline avec waveform */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 space-y-2">
                          <div className="flex items-center justify-between text-white text-xs mb-2">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(videoDuration)}</span>
                          </div>
                          <div className="relative">
                            <Slider
                              value={[currentTime]}
                              max={videoDuration || 100}
                              step={0.1}
                              className="w-full"
                              onValueChange={([value]) => handleSeek(value)}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-4 p-8">
                    <Upload className={cn(
                      "h-12 w-12 mx-auto transition-colors",
                      isDragging ? "text-primary" : "text-muted-foreground"
                    )} />
                    <div>
                      <p className="text-sm font-medium mb-1">
                        {isDragging ? "Déposez votre vidéo ici" : "Aucune vidéo chargée"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Glissez-déposez une vidéo ou cliquez pour télécharger
                      </p>
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant={isDragging ? "default" : "outline"}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Télécharger une vidéo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileInput}
                    />
                  </div>
                )}
              </div>

              {/* Timeline Audio avec waveform */}
              {hasVideo && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Volume2 className="h-4 w-4" />
                      Waveform audio
                    </Label>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-primary"></div>
                        <span>Audio</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-destructive"></div>
                        <span>Silence</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative h-32 bg-gradient-to-b from-muted to-muted/50 rounded-lg border-2 border-border overflow-hidden">
                    {/* Ligne de référence centrale */}
                    <div className="absolute inset-0 flex items-center pointer-events-none">
                      <div className="w-full h-px bg-border/50"></div>
                    </div>
                    {/* Waveform */}
                    <div className="w-full h-full flex items-end justify-center gap-0.5 px-2 py-2 relative">
                      {waveform.map((height, i) => {
                        const position = (i / waveform.length) * videoDuration
                        const isInSilence = detectedSilences.some(s => 
                          position >= s.start && position <= s.end
                        )
                        const barHeight = Math.max(height, 5) // Minimum 5% pour visibilité
                        
                        return (
                          <div
                            key={i}
                            className={cn(
                              "flex-1 min-w-[2px] rounded-t transition-all duration-75",
                              isInSilence 
                                ? "bg-destructive shadow-sm shadow-destructive/30" 
                                : "bg-primary shadow-sm shadow-primary/20"
                            )}
                            style={{ 
                              height: `${barHeight}%`,
                              minHeight: '2px'
                            }}
                            title={`${formatTime(position)} - ${isInSilence ? 'Silence' : 'Audio'}`}
                          />
                        )
                      })}
                      {/* Indicateur de position actuelle */}
                      {videoDuration > 0 && (
                        <div 
                          className="absolute top-0 bottom-0 w-0.5 bg-primary z-20 pointer-events-none"
                          style={{ 
                            left: `${(currentTime / videoDuration) * 100}%`,
                            transform: 'translateX(-50%)'
                          }}
                        >
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-mono">{formatTime(0)}</span>
                    <span className="text-muted-foreground font-mono">{formatTime(videoDuration)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Liste des silences détectés */}
          {detectedSilences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Silences détectés ({detectedSilences.length})</CardTitle>
                <CardDescription>
                  Liste de tous les silences qui seront supprimés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {detectedSilences.map((silence) => (
                    <div
                      key={silence.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-destructive/20 flex items-center justify-center">
                          <Volume2 className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Silence #{silence.id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(silence.start)} - {formatTime(silence.end)} 
                            {" • "}
                            {silence.duration.toFixed(1)}s
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Réglages
              </CardTitle>
              <CardDescription>
                Configurez la détection des silences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="threshold">Seuil de silence</Label>
                  <span className="text-sm text-muted-foreground">{threshold} dB</span>
                </div>
                <Slider
                  id="threshold"
                  value={[threshold]}
                  onValueChange={([value]) => setThreshold(value)}
                  min={-60}
                  max={0}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Plus le seuil est bas, plus les silences sont détectés. Recommandé: -40 dB
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="duration">Durée minimum</Label>
                  <span className="text-sm text-muted-foreground">{minDuration} ms</span>
                </div>
                <Slider
                  id="duration"
                  value={[minDuration]}
                  onValueChange={([value]) => setMinDuration(value)}
                  min={100}
                  max={5000}
                  step={100}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Durée minimum d&apos;un silence pour être supprimé. Recommandé: 500 ms
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="padding">Padding</Label>
                  <span className="text-sm text-muted-foreground">{padding} ms</span>
                </div>
                <Slider
                  id="padding"
                  value={[padding]}
                  onValueChange={([value]) => setPadding(value)}
                  min={0}
                  max={1000}
                  step={50}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Espace conservé avant et après chaque coupure. Recommandé: 100 ms
                </p>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Traitement en cours...</span>
                    <span className="font-medium">{processingProgress}%</span>
                  </div>
                  <Progress value={processingProgress} />
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleDetectSilences}
                disabled={!hasVideo || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <Scissors className="h-4 w-4 mr-2" />
                    Détecter les silences
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Résultats */}
          {(detectedSilences.length > 0 || isProcessing) && (
            <Card>
              <CardHeader>
                <CardTitle>Résultats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Silences détectés
                    </span>
                    <span className="font-medium">{detectedSilences.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Temps économisé
                    </span>
                    <span className="font-medium">{formatTime(totalSilenceTime)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Durée originale</span>
                    <span className="font-medium">{formatTime(videoDuration)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Durée finale</span>
                    <span className="text-lg font-bold text-primary">{formatTime(finalDuration)}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Réduction</span>
                      <span>{((totalSilenceTime / videoDuration) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={(totalSilenceTime / videoDuration) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
                {isDownloading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Traitement de la vidéo...</span>
                      <span className="font-medium">{downloadProgress}%</span>
                    </div>
                    <Progress value={downloadProgress} />
                  </div>
                )}
                <Button 
                  className="w-full" 
                  disabled={isProcessing || detectedSilences.length === 0 || isDownloading}
                  onClick={handleDownloadProcessedVideo}
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger la vidéo traitée
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
