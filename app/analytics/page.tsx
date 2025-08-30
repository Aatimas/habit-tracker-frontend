"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, TrendingUp, Calendar, BarChart3 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useHabits } from "@/contexts/habits-context"
import { CompletionRateChart } from "@/components/analytics/completion-rate-chart"
import { StreakHistoryChart } from "@/components/analytics/streak-history-chart"
import { CategoryBreakdownChart } from "@/components/analytics/category-breakdown-chart"
import { WeeklyHeatmap } from "@/components/analytics/weekly-heatmap"

export default function AnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { habits, isLoading: habitsLoading } = useHabits()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading || habitsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  // Calculate analytics data
  const totalHabits = habits.length
  const activeStreaks = habits.filter((h) => h.streak > 0).length
  const longestStreak = Math.max(...habits.map((h) => h.longestStreak), 0)
  const avgCompletionRate =
    habits.length > 0
      ? Math.round(
          habits.reduce((acc, habit) => {
            const completedDays = habit.completedDates.length
            const daysSinceCreated = Math.max(
              1,
              Math.ceil((Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
            )
            return acc + (completedDays / daysSinceCreated) * 100
          }, 0) / habits.length,
        )
      : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHabits}</div>
              <p className="text-xs text-muted-foreground">Active habits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Streaks</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeStreaks}</div>
              <p className="text-xs text-muted-foreground">Habits with streaks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{longestStreak}</div>
              <p className="text-xs text-muted-foreground">Days in a row</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgCompletionRate}%</div>
              <p className="text-xs text-muted-foreground">Overall rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="streaks">Streaks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Completion Heatmap</CardTitle>
                  <CardDescription>Your habit completion pattern over the past weeks</CardDescription>
                </CardHeader>
                <CardContent>
                  <WeeklyHeatmap habits={habits} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Completion Rate Trend</CardTitle>
                  <CardDescription>Daily completion rates over the past 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <CompletionRateChart habits={habits} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Completion Rate Trends</CardTitle>
                <CardDescription>Track your progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <CompletionRateChart habits={habits} showDetailed />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Habits by Category</CardTitle>
                  <CardDescription>Distribution of your habits across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoryBreakdownChart habits={habits} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>Completion rates by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(
                      habits.reduce(
                        (acc, habit) => {
                          if (!acc[habit.category]) {
                            acc[habit.category] = { total: 0, completed: 0 }
                          }
                          acc[habit.category].total += 1
                          if (habit.completedToday) {
                            acc[habit.category].completed += 1
                          }
                          return acc
                        },
                        {} as Record<string, { total: number; completed: number }>,
                      ),
                    ).map(([category, data]) => {
                      const rate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{category}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {data.completed}/{data.total} habits
                            </span>
                          </div>
                          <div className="text-sm font-medium">{rate}%</div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="streaks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Streak History</CardTitle>
                <CardDescription>Track your longest streaks over time</CardDescription>
              </CardHeader>
              <CardContent>
                <StreakHistoryChart habits={habits} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Streaks</CardTitle>
                  <CardDescription>Your active habit streaks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {habits
                      .filter((h) => h.streak > 0)
                      .sort((a, b) => b.streak - a.streak)
                      .slice(0, 5)
                      .map((habit) => (
                        <div key={habit.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{habit.name}</p>
                            <p className="text-sm text-muted-foreground">{habit.category}</p>
                          </div>
                          <Badge variant="outline">{habit.streak} days</Badge>
                        </div>
                      ))}
                    {habits.filter((h) => h.streak > 0).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No active streaks yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Best Streaks</CardTitle>
                  <CardDescription>Your longest streaks ever</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {habits
                      .sort((a, b) => b.longestStreak - a.longestStreak)
                      .slice(0, 5)
                      .map((habit) => (
                        <div key={habit.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{habit.name}</p>
                            <p className="text-sm text-muted-foreground">{habit.category}</p>
                          </div>
                          <Badge variant="outline">{habit.longestStreak} days</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
