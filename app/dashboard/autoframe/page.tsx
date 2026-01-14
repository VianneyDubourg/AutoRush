"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Upload, Download, Frame, Monitor, Smartphone, Square, Settings } from "lucide-react"
import { useState } from "react"
import { usePlan } from "@/hooks/use-plan"

const formats = [
  {
    name: "16:9 (Landscape)",
    value: "16:9",
    icon: Monitor,
    description: "Format horizontal classique",
  },
  {
    name: "9:16 (Vertical)",
    value: "9:16",
    icon: Smartphone,
    description: "Format vertical pour réseaux sociaux",
  },
  {
    name: "1:1 (Carré)",
    value: "1:1",
    icon: Square,
    description: "Format carré pour Instagram",
  },
]

export default function AutoFramePage() {
  const { config, isFree } = usePlan()
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)
  const [hasVideo, setHasVideo] = useState(false)
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [zoom, setZoom] = useState(100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Frame className="h-8 w-8 text-primary" />
          AutoFrame
        </h1>
        <p className="text-muted-foreground">
          Adaptez vos vidéos à différents formats en ajustant le cadrage et le regard dans le cadre
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Video Preview Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview vidéo</CardTitle>
              <CardDescription>
                Visualisez votre vidéo adaptée au format sélectionné
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Format Preview */}
                <div
                  className={`bg-muted rounded-lg flex items-center justify-center border-2 border-dashed ${
                    selectedFormat === "16:9"
                      ? "aspect-video"
                      : selectedFormat === "9:16"
                      ? "aspect-[9/16]"
                      : selectedFormat === "1:1"
                      ? "aspect-square"
                      : "aspect-video"
                  }`}
                >
                  {hasVideo ? (
                    <div className="text-center space-y-2">
                      <Frame className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Preview {selectedFormat || "16:9"}</p>
                      <p className="text-xs text-muted-foreground">
                        Le cadrage sera ajusté automatiquement pour suivre le regard
                      </p>
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

                {/* Cadrage Controls */}
                {hasVideo && selectedFormat && (
                  <>
                    {isFree ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Mode standard (Gratuit)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <p>• Cadrage centré automatiquement</p>
                            <p>• Pas de repositionnement manuel</p>
                          </div>
                          <p className="text-xs text-muted-foreground pt-3 border-t mt-3">
                            Passez au plan Creator ou Pro pour débloquer le repositionnement manuel du cadre.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Ajustement du cadrage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label>Position horizontale</Label>
                              <span className="text-sm text-muted-foreground">{positionX}%</span>
                            </div>
                            <Slider
                              value={[positionX]}
                              onValueChange={([value]) => setPositionX(value)}
                              min={-50}
                              max={50}
                              step={1}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label>Position verticale</Label>
                              <span className="text-sm text-muted-foreground">{positionY}%</span>
                            </div>
                            <Slider
                              value={[positionY]}
                              onValueChange={([value]) => setPositionY(value)}
                              min={-50}
                              max={50}
                              step={1}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label>Zoom</Label>
                              <span className="text-sm text-muted-foreground">{zoom}%</span>
                            </div>
                            <Slider
                              value={[zoom]}
                              onValueChange={([value]) => setZoom(value)}
                              min={100}
                              max={200}
                              step={5}
                              className="w-full"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Format Selection */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Format de sortie</CardTitle>
              <CardDescription>
                Sélectionnez le format pour votre vidéo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {formats.map((format) => {
                const Icon = format.icon
                const isSelected = selectedFormat === format.value
                return (
                  <button
                    key={format.value}
                    onClick={() => setSelectedFormat(format.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="flex-1">
                        <div className={`font-medium ${isSelected ? "text-primary" : ""}`}>
                          {format.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {format.description}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {hasVideo && selectedFormat && (
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Format original</span>
                    <span className="font-medium">16:9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Format de sortie</span>
                    <span className="font-medium">{selectedFormat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Résolution</span>
                    <span className="font-medium">
                      {selectedFormat === "16:9"
                        ? "1920x1080"
                        : selectedFormat === "9:16"
                        ? "1080x1920"
                        : "1080x1080"}
                    </span>
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger la vidéo adaptée
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
