"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Scissors,
  Frame,
  Video,
  Settings,
  History,
  Zap,
  Shield
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAdmin } from "@/hooks/use-admin"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AutoCut", href: "/dashboard/autocut", icon: Scissors },
  { name: "AutoFrame", href: "/dashboard/autoframe", icon: Frame },
  { name: "Mes vidéos", href: "/dashboard/videos", icon: Video },
  { name: "Historique", href: "/dashboard/history", icon: History },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isAdmin } = useAdmin()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">AutoRush</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
        {isAdmin && (
          <>
            <div className="my-2 border-t" />
            <Link
              href="/dashboard/admin/users"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/dashboard/admin/users"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Shield className="h-5 w-5" />
              Administration
            </Link>
          </>
        )}
      </nav>
    </div>
  )
}
