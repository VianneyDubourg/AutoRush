import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scissors, Frame, Clock } from "lucide-react"

const history = [
  {
    id: 1,
    action: "AutoCut",
    video: "video_tutoriel.mp4",
    icon: Scissors,
    time: "Il y a 2 heures",
    status: "completed",
    details: "12 silences supprimés, 1m 23s économisés",
  },
  {
    id: 2,
    action: "AutoFrame",
    video: "presentation_vertical.mp4",
    icon: Frame,
    time: "Il y a 5 heures",
    status: "completed",
    details: "Format adapté en 9:16",
  },
  {
    id: 3,
    action: "AutoCut",
    video: "interview_clean.mp4",
    icon: Scissors,
    time: "Hier",
    status: "completed",
    details: "8 silences supprimés, 45s économisés",
  },
]

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Historique</h1>
        <p className="text-muted-foreground">
          Consultez l&apos;historique de vos traitements vidéo
        </p>
      </div>

      <div className="space-y-4">
        {history.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{item.action}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {item.status === "completed" ? "Terminé" : "En cours"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.video}</p>
                    <p className="text-xs text-muted-foreground">{item.details}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
