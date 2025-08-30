"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react"

type TimerMode = "focus" | "shortBreak" | "longBreak"

interface TimerSession {
  mode: TimerMode
  duration: number
  completedAt: string
}

const TIMER_DURATIONS = {
  focus: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
}

const TIMER_LABELS = {
  focus: "Focus Time",
  shortBreak: "Short Break",
  longBreak: "Long Break",
}

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("focus")
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.focus)
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [sessions, setSessions] = useState<TimerSession[]>([])

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load sessions from localStorage
  useEffect(() => {
    const storedSessions = localStorage.getItem("pomodoro_sessions")
    if (storedSessions) {
      const parsedSessions = JSON.parse(storedSessions)
      setSessions(parsedSessions)
      setCompletedSessions(parsedSessions.filter((s: TimerSession) => s.mode === "focus").length)
    }

    // Create audio element for notifications
    audioRef.current = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
    )
  }, [])

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("pomodoro_sessions", JSON.stringify(sessions))
    }
  }, [sessions])

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      handleTimerComplete()
    }
  }, [timeLeft, isRunning])

  const handleTimerComplete = () => {
    setIsRunning(false)

    // Play notification sound
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Fallback for browsers that don't allow autoplay
        console.log("Could not play notification sound")
      })
    }

    // Save completed session
    const newSession: TimerSession = {
      mode,
      duration: TIMER_DURATIONS[mode],
      completedAt: new Date().toISOString(),
    }

    setSessions((prev) => [...prev, newSession])

    if (mode === "focus") {
      setCompletedSessions((prev) => prev + 1)
    }

    // Auto-switch to next mode
    const nextMode = getNextMode()
    setMode(nextMode)
    setTimeLeft(TIMER_DURATIONS[nextMode])

    // Show browser notification if supported
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`${TIMER_LABELS[mode]} completed!`, {
        body: `Time for ${TIMER_LABELS[nextMode].toLowerCase()}`,
        icon: "/favicon.ico",
      })
    }
  }

  const getNextMode = (): TimerMode => {
    if (mode === "focus") {
      // After 4 focus sessions, take a long break
      const focusSessions = sessions.filter((s) => s.mode === "focus").length + 1
      return focusSessions % 4 === 0 ? "longBreak" : "shortBreak"
    }
    return "focus"
  }

  const handleStart = () => {
    setIsRunning(true)

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(TIMER_DURATIONS[mode])
  }

  const handleSkip = () => {
    setIsRunning(false)
    const nextMode = getNextMode()
    setMode(nextMode)
    setTimeLeft(TIMER_DURATIONS[nextMode])
  }

  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(TIMER_DURATIONS[newMode])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((TIMER_DURATIONS[mode] - timeLeft) / TIMER_DURATIONS[mode]) * 100

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex justify-center gap-2">
        <Button
          variant={mode === "focus" ? "default" : "outline"}
          size="sm"
          onClick={() => handleModeChange("focus")}
          disabled={isRunning}
        >
          Focus
        </Button>
        <Button
          variant={mode === "shortBreak" ? "default" : "outline"}
          size="sm"
          onClick={() => handleModeChange("shortBreak")}
          disabled={isRunning}
        >
          Short Break
        </Button>
        <Button
          variant={mode === "longBreak" ? "default" : "outline"}
          size="sm"
          onClick={() => handleModeChange("longBreak")}
          disabled={isRunning}
        >
          Long Break
        </Button>
      </div>

      {/* Timer Display */}
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <Badge variant="secondary" className="text-sm">
              {TIMER_LABELS[mode]}
            </Badge>
            <div className="text-6xl font-mono font-bold text-foreground">{formatTime(timeLeft)}</div>
          </div>

          <Progress value={progress} className="h-2" />

          <div className="flex justify-center gap-2">
            {!isRunning ? (
              <Button onClick={handleStart} size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Start
              </Button>
            ) : (
              <Button onClick={handlePause} size="lg" variant="outline" className="gap-2 bg-transparent">
                <Pause className="h-5 w-5" />
                Pause
              </Button>
            )}

            <Button onClick={handleReset} size="lg" variant="outline" className="gap-2 bg-transparent">
              <RotateCcw className="h-5 w-5" />
              Reset
            </Button>

            <Button onClick={handleSkip} size="lg" variant="outline" className="gap-2 bg-transparent">
              <SkipForward className="h-5 w-5" />
              Skip
            </Button>
          </div>

          {completedSessions > 0 && (
            <div className="text-sm text-muted-foreground">
              Completed sessions today: <span className="font-medium text-primary">{completedSessions}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
