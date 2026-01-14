import { useState, useRef, useCallback } from 'react'

export function useVideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration)
    }
  }, [])

  const handleSeek = useCallback((value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value
      setCurrentTime(value)
    }
  }, [])

  return {
    videoRef,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    videoDuration,
    setVideoDuration,
    handlePlayPause,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSeek,
  }
}
