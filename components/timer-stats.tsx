"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Timer, TrendingUp, Clock, Target } from "lucide-react"

interface TimerSession {
  mode: "focus" | "shortBreak" | "longBreak"
  duration: number
  completedAt: string
}

export function TimerStats() {
  const [sessions, setSessions] = useState<TimerSession[]>([])

  useEffect(() => {
    const storedSessions = localStorage.getItem("pomodoro_sessions")
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions))
    }
  }, [])

  // Calculate today's stats
  const today = new Date().toISOString().split("T")[0]
  const todaySessions = sessions.filter((session) => session.completedAt.startsWith(today))

  const todayFocusSessions = todaySessions.filter((s) => s.mode === "focus").length
  const todayTotalTime = todaySessions.reduce((acc, session) => acc + session.duration, 0)
  const todayFocusTime = todaySessions
    .filter((s) => s.mode === "focus")
    .reduce((acc, session) => acc + session.duration, 0)

  // Calculate weekly stats for chart
  const weeklyData = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split("T")[0]

    const daySessions = sessions.filter((session) => session.completedAt.startsWith(dateString))

    const focusSessions = daySessions.filter((s) => s.mode === "focus").length
    const focusMinutes = Math.round(
      daySessions.filter((s) => s.mode === "focus").reduce((acc, session) => acc + session.duration, 0) / 60,
    )

    weeklyData.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      sessions: focusSessions,
      minutes: focusMinutes,
    })
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Sessions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayFocusSessions}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(todayFocusTime)}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(todayTotalTime)}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.filter((s) => s.mode === "focus").length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Chart */}
      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Focus Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                  <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
                                <span className="font-bold">
                                  {data.sessions} sessions ({data.minutes} min)
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="sessions" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Sessions */}
      {todaySessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todaySessions
                .slice(-5)
                .reverse()
                .map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant={session.mode === "focus" ? "default" : "secondary"}>
                        {session.mode === "focus"
                          ? "Focus"
                          : session.mode === "shortBreak"
                            ? "Short Break"
                            : "Long Break"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{formatTime(session.duration)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(session.completedAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
