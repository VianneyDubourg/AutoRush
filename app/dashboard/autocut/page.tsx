"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, Play, Pause, Download, Settings, Scissors,
  Volume2, Clock, X, CheckCircle2, Loader2
} from "lucide-react"
import { useState, useRef, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { usePlan } from "@/hooks/use-plan"
import { useVideoPlayer } from "@/hooks/use-video-player"
import { useWaveform } from "@/hooks/use-waveform"
import { useFFmpegProcessing } from "@/hooks/use-ffmpeg-processing"
import { formatTime, downloadBlob, getProcessedFileName, uploadToSupabase } from "@/lib/video-utils"

interface Silence {
  id: number
  start: number
  end: number
  duration: number
}

export default function AutoCutPage() {
  const { isFree } = usePlan()
  const [hasVideo, setHasVideo] = useState(false)
  const [videoName, setVideoName] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [detectedSilences, setDetectedSilences] = useState<Silence[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  
  const [threshold, setThreshold] = useState(-40)
  const [minDuration, setMinDuration] = useState(500)
  const [padding, setPadding] = useState(isFree ? 0 : 100)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  
  const videoPlayer = useVideoPlayer()
  const { waveformRef } = useWaveform(videoUrl, detectedSilences, videoPlayer.videoRef)
  const { processVideo, downloadProgress, setDownloadProgress } = useFFmpegProcessing()

  const handleFileSelect = useCallback((file: File) => {
    if (!file?.type.startsWith('video/')) return
    
    const url = URL.createObjectURL(file)
    setVideoUrl(url)
    setVideoFile(file)
    setVideoName(file.name)
    setHasVideo(true)
    setDetectedSilences([])
    videoPlayer.setCurrentTime(0)
    setIsProcessing(false)
  }, [videoPlayer])

  const handleRemoveVideo = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    videoPlayer.videoRef.current?.pause()
    setHasVideo(false)
    setVideoName(null)
    setVideoUrl(null)
    setVideoFile(null)
    setDetectedSilences([])
    videoPlayer.setCurrentTime(0)
    videoPlayer.setIsPlaying(false)
    setIsProcessing(false)
  }, [videoUrl, videoPlayer])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files[0])
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDetectSilences = () => {
    setIsProcessing(true)
    setProcessingProgress(0)
    
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
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

  const handleDownloadProcessedVideo = async () => {
    if (!videoFile || detectedSilences.length === 0) return

    setIsDownloading(true)
    setDownloadProgress(0)
    
    try {
      const processedBlob = await processVideo(videoFile, detectedSilences, videoPlayer.videoDuration)
      const processedFileName = getProcessedFileName(videoName || 'video.mp4')
      const processedFile = new File([processedBlob], processedFileName, { type: 'video/mp4' })
      
      try {
        await uploadToSupabase(processedFile)
        console.log('Vidéo traitée uploadée avec succès')
      } catch (error) {
        console.warn('Erreur lors de l\'upload:', error)
      }
      
      downloadBlob(processedBlob, processedFileName)
    } catch (error) {
      console.error('Erreur lors du traitement:', error)
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setIsDownloading(false)
      setDownloadProgress(0)
    }
  }

  const totalSilenceTime = detectedSilences.reduce((acc, s) => acc + s.duration, 0)
  const finalDuration = videoPlayer.videoDuration - totalSilenceTime

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
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
                  <Button variant="ghost" size="icon" onClick={handleRemoveVideo}>
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
                          ref={videoPlayer.videoRef}
                          src={videoUrl}
                          className="w-full h-full object-contain"
                          onTimeUpdate={videoPlayer.handleTimeUpdate}
                          onLoadedMetadata={videoPlayer.handleLoadedMetadata}
                          onPlay={() => videoPlayer.setIsPlaying(true)}
                          onPause={() => videoPlayer.setIsPlaying(false)}
                          onEnded={() => videoPlayer.setIsPlaying(false)}
                        />
                        <div className="absolute top-4 left-4">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={videoPlayer.handlePlayPause}
                            className="bg-black/70 hover:bg-black/90 text-white"
                          >
                            {videoPlayer.isPlaying ? (
                              <><Pause className="h-4 w-4 mr-2" />Pause</>
                            ) : (
                              <><Play className="h-4 w-4 mr-2" />Lecture</>
                            )}
                          </Button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 space-y-2">
                          <div className="flex items-center justify-between text-white text-xs mb-2">
                            <span>{formatTime(videoPlayer.currentTime)}</span>
                            <span>{formatTime(videoPlayer.videoDuration)}</span>
                          </div>
                          <Slider
                            value={[videoPlayer.currentTime]}
                            max={videoPlayer.videoDuration || 100}
                            step={0.1}
                            className="w-full"
                            onValueChange={([value]) => videoPlayer.handleSeek(value)}
                          />
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
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    />
                  </div>
                )}
              </div>

              {hasVideo && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Volume2 className="h-4 w-4" />
                      Waveform audio
                    </Label>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-primary" />
                        <span>Audio</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-destructive/30" />
                        <span>Silence</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative rounded-lg border-2 border-border overflow-hidden bg-muted/50">
                    <div ref={waveformRef} className="w-full" />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-mono">{formatTime(0)}</span>
                    <span className="text-muted-foreground font-mono">{formatTime(videoPlayer.videoDuration)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {detectedSilences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Silences détectés ({detectedSilences.length})</CardTitle>
                <CardDescription>Liste de tous les silences qui seront supprimés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {detectedSilences.map((silence) => (
                    <div key={silence.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-destructive/20 flex items-center justify-center">
                          <Volume2 className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Silence #{silence.id}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(silence.start)} - {formatTime(silence.end)} • {silence.duration.toFixed(1)}s
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

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Réglages
              </CardTitle>
              <CardDescription>Configurez la détection des silences</CardDescription>
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
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Traitement...</>
                ) : (
                  <><Scissors className="h-4 w-4 mr-2" />Détecter les silences</>
                )}
              </Button>
            </CardContent>
          </Card>

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
                    <span className="font-medium">{formatTime(videoPlayer.videoDuration)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Durée finale</span>
                    <span className="text-lg font-bold text-primary">{formatTime(finalDuration)}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Réduction</span>
                      <span>{((totalSilenceTime / videoPlayer.videoDuration) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={(totalSilenceTime / videoPlayer.videoDuration) * 100} className="h-2" />
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
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Traitement en cours...</>
                  ) : (
                    <><Download className="h-4 w-4 mr-2" />Télécharger la vidéo traitée</>
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
