"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Play, Pause, Download, Settings, Scissors } from "lucide-react"
import { useState } from "react"

export default function AutoCutPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasVideo, setHasVideo] = useState(false)

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
              <CardTitle>Preview vidéo</CardTitle>
              <CardDescription>
                Visualisez votre vidéo et les zones de silence détectées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                {hasVideo ? (
                  <div className="text-center space-y-4">
                    <div className="w-full h-full bg-background rounded flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <Play className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Preview vidéo</p>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Lecture
                      </Button>
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 p-8">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium mb-1">Aucune vidéo chargée</p>
                      <p className="text-xs text-muted-foreground">
                        Glissez-déposez une vidéo ou cliquez pour télécharger
                      </p>
                    </div>
                    <Button onClick={() => setHasVideo(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Télécharger une vidéo
                    </Button>
                  </div>
                )}
              </div>

              {/* Timeline Audio */}
              {hasVideo && (
                <div className="mt-4 space-y-2">
                  <Label>Timeline audio</Label>
                  <div className="h-20 bg-muted rounded-lg border flex items-center p-2">
                    <div className="w-full h-full flex items-end gap-px">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-primary/60 rounded-sm"
                          style={{ height: `${Math.random() * 80 + 20}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0:00</span>
                    <span>2:34</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="threshold">Seuil de silence (dB)</Label>
                <Input
                  id="threshold"
                  type="number"
                  defaultValue="-40"
                  min="-60"
                  max="0"
                />
                <p className="text-xs text-muted-foreground">
                  Plus le seuil est bas, plus les silences sont détectés
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Durée minimum (ms)</Label>
                <Input
                  id="duration"
                  type="number"
                  defaultValue="500"
                  min="100"
                  max="5000"
                />
                <p className="text-xs text-muted-foreground">
                  Durée minimum d'un silence pour être supprimé
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="padding">Padding (ms)</Label>
                <Input
                  id="padding"
                  type="number"
                  defaultValue="100"
                  min="0"
                  max="1000"
                />
                <p className="text-xs text-muted-foreground">
                  Espace conservé avant et après chaque coupure
                </p>
              </div>

              <Button
                className="w-full"
                onClick={() => setIsProcessing(!isProcessing)}
                disabled={!hasVideo}
              >
                <Scissors className="h-4 w-4 mr-2" />
                {isProcessing ? "Traitement en cours..." : "Détecter les silences"}
              </Button>
            </CardContent>
          </Card>

          {hasVideo && (
            <Card>
              <CardHeader>
                <CardTitle>Résultats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Silences détectés</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Temps économisé</span>
                    <span className="font-medium">1m 23s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Durée finale</span>
                    <span className="font-medium">2m 15s</span>
                  </div>
                </div>
                <Button className="w-full" disabled={!isProcessing}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger la vidéo traitée
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
