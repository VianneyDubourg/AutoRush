import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, Download, Trash2, Eye } from "lucide-react"
import Link from "next/link"

const videos = [
  {
    id: 1,
    name: "video_tutoriel.mp4",
    type: "AutoCut",
    duration: "2:34",
    date: "Il y a 2 heures",
    size: "45 MB",
  },
  {
    id: 2,
    name: "presentation_vertical.mp4",
    type: "AutoFrame",
    format: "9:16",
    duration: "5:12",
    date: "Il y a 5 heures",
    size: "78 MB",
  },
  {
    id: 3,
    name: "interview_clean.mp4",
    type: "AutoCut",
    duration: "12:45",
    date: "Hier",
    size: "234 MB",
  },
]

export default function VideosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes vidéos</h1>
          <p className="text-muted-foreground">
            Gérez toutes vos vidéos traitées avec AutoRush
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {videos.map((video) => (
          <Card key={video.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-28 bg-muted rounded-lg flex items-center justify-center">
                  <Video className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold">{video.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{video.type}</span>
                    {video.format && <span>Format: {video.format}</span>}
                    <span>Durée: {video.duration}</span>
                    <span>Taille: {video.size}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{video.date}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {videos.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune vidéo</h3>
            <p className="text-muted-foreground mb-4">
              Commencez à traiter vos vidéos avec AutoCut ou AutoFrame
            </p>
            <div className="flex gap-2 justify-center">
              <Link href="/dashboard/autocut">
                <Button>Essayer AutoCut</Button>
              </Link>
              <Link href="/dashboard/autoframe">
                <Button variant="outline">Essayer AutoFrame</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
