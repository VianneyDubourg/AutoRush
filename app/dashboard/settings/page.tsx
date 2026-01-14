"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Moon, Sun } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { theme } = useTheme()

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
              Personnalisez l'apparence de l'application
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
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-threshold">Seuil de silence par défaut (dB)</Label>
              <Input id="default-threshold" type="number" defaultValue="-40" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-duration">Durée minimum par défaut (ms)</Label>
              <Input id="default-duration" type="number" defaultValue="500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-padding">Padding par défaut (ms)</Label>
              <Input id="default-padding" type="number" defaultValue="100" />
            </div>
            <Button>Enregistrer les préférences</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stockage</CardTitle>
            <CardDescription>
              Gestion de l'espace de stockage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-2">
                <span>Espace utilisé</span>
                <span className="font-medium">2.4 GB / 10 GB</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "24%" }} />
              </div>
            </div>
            <Button variant="outline">Nettoyer les vidéos anciennes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
