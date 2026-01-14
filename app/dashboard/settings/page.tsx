"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Settings, Moon, Sun } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { useState } from "react"
import { useQuota } from "@/hooks/use-quota"
import { formatQuota } from "@/lib/plans"

export default function SettingsPage() {
  const { theme } = useTheme()
  const { quota, isLoading: isQuotaLoading } = useQuota()
  const [defaultThreshold, setDefaultThreshold] = useState(-40)
  const [defaultDuration, setDefaultDuration] = useState(500)
  const [defaultPadding, setDefaultPadding] = useState(100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-8 w-8 text-primary" />
          Paramètres
        </h1>
        <p className="text-muted-foreground">
          Gérez vos préférences et paramètres AutoRush
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Apparence</CardTitle>
            <CardDescription>
              Personnalisez l&apos;apparence de l&apos;application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Thème</Label>
                <p className="text-sm text-muted-foreground">
                  Choisissez entre le mode clair, sombre ou système
                </p>
              </div>
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {theme === "dark" ? (
                <>
                  <Moon className="h-4 w-4" />
                  <span>Mode sombre activé</span>
                </>
              ) : theme === "light" ? (
                <>
                  <Sun className="h-4 w-4" />
                  <span>Mode clair activé</span>
                </>
              ) : (
                <span>Thème système</span>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>
              Gérez les informations de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="votre@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" type="text" placeholder="Votre nom" />
            </div>
            <Button>Enregistrer les modifications</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Préférences AutoCut</CardTitle>
            <CardDescription>
              Paramètres par défaut pour AutoCut
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="default-threshold">Seuil de silence par défaut</Label>
                <span className="text-sm text-muted-foreground">{defaultThreshold} dB</span>
              </div>
              <Slider
                id="default-threshold"
                value={[defaultThreshold]}
                onValueChange={([value]) => setDefaultThreshold(value)}
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
                <Label htmlFor="default-duration">Durée minimum par défaut</Label>
                <span className="text-sm text-muted-foreground">{defaultDuration} ms</span>
              </div>
              <Slider
                id="default-duration"
                value={[defaultDuration]}
                onValueChange={([value]) => setDefaultDuration(value)}
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
                <Label htmlFor="default-padding">Padding par défaut</Label>
                <span className="text-sm text-muted-foreground">{defaultPadding} ms</span>
              </div>
              <Slider
                id="default-padding"
                value={[defaultPadding]}
                onValueChange={([value]) => setDefaultPadding(value)}
                min={0}
                max={1000}
                step={50}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Espace conservé avant et après chaque coupure. Recommandé: 100 ms
              </p>
            </div>

            <Button>Enregistrer les préférences</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stockage</CardTitle>
            <CardDescription>
              Gestion de l&apos;espace de stockage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-2">
                <span>Espace utilisé</span>
                <span className="font-medium">
                  {isQuotaLoading ? (
                    "Chargement..."
                  ) : quota ? (
                    `${formatQuota(quota.quotaUsed)} / ${formatQuota(quota.quotaMax)}`
                  ) : (
                    "0 MB / 0 MB"
                  )}
                </span>
              </div>
              {isQuotaLoading ? (
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-muted h-2 rounded-full animate-pulse" style={{ width: "50%" }} />
                </div>
              ) : quota ? (
                <Progress value={quota.percentage} className="h-2" />
              ) : (
                <Progress value={0} className="h-2" />
              )}
            </div>
            <Button variant="outline">Nettoyer les vidéos anciennes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
