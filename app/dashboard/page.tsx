"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useHabits } from "@/contexts/habits-context"
import { AddHabitDialog } from "@/components/add-habit-dialog"
import { HabitCard } from "@/components/habit-card"
import { OnboardingDialog } from "@/components/onboarding-dialog"

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { habits, isLoading: habitsLoading, getTodaysCompletedCount, getLongestStreak } = useHabits()
  const router = useRouter()
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!authLoading && !habitsLoading && user && habits.length === 0) {
      const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")
      if (!hasSeenOnboarding) {
        setShowOnboarding(true)
      }
    }
  }, [user, habits, authLoading, habitsLoading])

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true")
    setShowOnboarding(false)
  }

  if (authLoading || habitsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Target className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const todaysCompleted = getTodaysCompletedCount()
  const longestStreak = getLongestStreak()
  const completionRate = habits.length > 0 ? Math.round((todaysCompleted / habits.length) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      <OnboardingDialog open={showOnboarding} onOpenChange={handleOnboardingComplete} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h2>
          <p className="text-muted-foreground">Here's your habit tracking progress for today.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{habits.length}</div>
              <p className="text-xs text-muted-foreground">Active habits</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{longestStreak}</div>
              <p className="text-xs text-muted-foreground">Days in a row</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <p className="text-xs text-muted-foreground">Habits completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Habits List */}
        {habits.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Today's Habits</h3>
              <Badge variant="secondary" className="text-xs">
                {todaysCompleted} of {habits.length} completed
              </Badge>
            </div>

            <div className="grid gap-4">
              {habits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Card className="inline-block hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="mb-2">No habits yet</CardTitle>
                <p className="text-muted-foreground mb-4">Start building better habits by creating your first one</p>
                <AddHabitDialog />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
