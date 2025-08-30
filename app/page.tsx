"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, Clock, Users, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <Target className="h-16 w-16 text-primary" />
              <Sparkles className="h-6 w-6 text-primary/60 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">
              Build Better Habits, One Day at a Time
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Track your daily routines, build lasting streaks, and achieve your goals with our simple and powerful
              habit tracker.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 hover:scale-105 transition-transform"
              onClick={() => router.push("/register")}
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-transparent hover:bg-accent transition-colors"
              onClick={() => router.push("/login")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Everything you need to succeed</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Simple tools to help you build and maintain healthy habits that stick.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Habit Tracking</CardTitle>
              <CardDescription>
                Easily track daily and weekly habits with simple check-offs and visual progress indicators.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Streak Building</CardTitle>
              <CardDescription>
                Build momentum with streak counters and never lose sight of your progress toward your goals.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Analytics & Insights</CardTitle>
              <CardDescription>
                Get detailed insights into your habit patterns with charts and completion rate analytics.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center hover:shadow-lg transition-shadow">
          <CardContent className="p-12">
            <Users className="h-12 w-12 text-primary mx-auto mb-6" />
            <CardTitle className="text-2xl mb-4">Ready to transform your life?</CardTitle>
            <CardDescription className="text-lg mb-6">
              Join thousands of people who are building better habits and achieving their goals with HabitFlow.
            </CardDescription>
            <Button
              size="lg"
              className="text-lg px-8 hover:scale-105 transition-transform"
              onClick={() => router.push("/register")}
            >
              Start Your Journey Today
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
