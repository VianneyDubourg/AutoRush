import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Scissors, Frame, Clock, Zap, FileVideo } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const stats = [
  {
    title: "Vidéos traitées",
    value: "127",
    description: "+23 cette semaine",
    icon: Video,
    trend: "up",
  },
  {
    title: "Temps économisé",
    value: "8h 42m",
    description: "Ce mois-ci",
    icon: Clock,
    trend: "up",
  },
  {
    title: "AutoCut utilisés",
    value: "89",
    description: "Suppressions de silences",
    icon: Scissors,
    trend: "up",
  },
  {
    title: "AutoFrame utilisés",
    value: "38",
    description: "Adaptations de format",
    icon: Frame,
    trend: "up",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenue sur AutoRush - Préparez vos vidéos rapidement
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-primary/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-primary" />
              <CardTitle>AutoCut</CardTitle>
            </div>
            <CardDescription>
              Supprimez intelligemment les silences de vos vidéos avec preview et timeline audio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/autocut">
              <Button className="w-full">Commencer avec AutoCut</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-primary/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Frame className="h-5 w-5 text-primary" />
              <CardTitle>AutoFrame</CardTitle>
            </div>
            <CardDescription>
              Adaptez vos vidéos à différents formats (16:9, vertical, carré) en ajustant le cadrage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/autoframe">
              <Button className="w-full">Commencer avec AutoFrame</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Mes vidéos récentes</CardTitle>
            <CardDescription>
              Dernières vidéos traitées avec AutoRush
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <FileVideo className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">video_tutoriel.mp4</p>
                  <p className="text-xs text-muted-foreground">AutoCut • Il y a 2 heures</p>
                </div>
                <Button variant="ghost" size="sm">Voir</Button>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <FileVideo className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">presentation_vertical.mp4</p>
                  <p className="text-xs text-muted-foreground">AutoFrame • Il y a 5 heures</p>
                </div>
                <Button variant="ghost" size="sm">Voir</Button>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <FileVideo className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">interview_clean.mp4</p>
                  <p className="text-xs text-muted-foreground">AutoCut • Hier</p>
                </div>
                <Button variant="ghost" size="sm">Voir</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Historique de vos actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Vidéo traitée avec AutoCut</p>
                  <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Format adapté avec AutoFrame</p>
                  <p className="text-xs text-muted-foreground">Il y a 5 heures</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Vidéo téléchargée</p>
                  <p className="text-xs text-muted-foreground">Hier</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
