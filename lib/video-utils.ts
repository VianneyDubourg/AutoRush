// Utilitaires pour le traitement vidéo

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

export const getProcessedFileName = (originalName: string): string => {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
  const extension = originalName.split('.').pop()
  return `${nameWithoutExt}_processed.${extension || 'mp4'}`
}

export const uploadToSupabase = async (file: File): Promise<void> => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('/api/videos/upload', {
    method: 'POST',
    body: formData,
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erreur lors de l\'upload')
  }
}
