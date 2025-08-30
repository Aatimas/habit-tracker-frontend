"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Timer, Coffee, Brain } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { TimerStats } from "@/components/timer-stats"

export default function TimerPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Timer className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading timer...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Timer Section */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Stay Focused</h2>
              <p className="text-muted-foreground">Use the Pomodoro Technique to boost your productivity</p>
            </div>

            <PomodoroTimer />
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Focus Session</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  25 minutes of focused work on a single task without distractions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Coffee className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Short Break</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  5 minutes to relax, stretch, or grab a quick refreshment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Timer className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Long Break</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  15-30 minutes to recharge after completing 4 focus sessions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Timer Statistics */}
          <TimerStats />
        </div>
      </main>
    </div>
  )
}
