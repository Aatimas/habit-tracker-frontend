"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Target, TrendingUp, BarChart3, Timer, CheckCircle } from "lucide-react"

interface OnboardingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OnboardingDialog({ open, onOpenChange }: OnboardingDialogProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to HabitFlow!",
      description: "Let's take a quick tour of your new habit tracking companion.",
      icon: Target,
      content: (
        <div className="text-center space-y-4">
          <Target className="h-16 w-16 text-primary mx-auto" />
          <p className="text-muted-foreground">
            HabitFlow helps you build lasting habits through simple tracking, streak building, and insightful analytics.
          </p>
        </div>
      ),
    },
    {
      title: "Track Your Habits",
      description: "Create and manage your daily and weekly habits with ease.",
      icon: CheckCircle,
      content: (
        <div className="space-y-4">
          <CheckCircle className="h-12 w-12 text-primary mx-auto" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">• Add custom habits with categories</p>
            <p className="text-sm text-muted-foreground">• Set daily or weekly frequencies</p>
            <p className="text-sm text-muted-foreground">• Mark habits complete with a simple click</p>
            <p className="text-sm text-muted-foreground">• Track your progress over time</p>
          </div>
        </div>
      ),
    },
    {
      title: "Build Streaks",
      description: "Stay motivated with streak counters and progress tracking.",
      icon: TrendingUp,
      content: (
        <div className="space-y-4">
          <TrendingUp className="h-12 w-12 text-primary mx-auto" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">• See your current streak for each habit</p>
            <p className="text-sm text-muted-foreground">• Track your longest streak achievements</p>
            <p className="text-sm text-muted-foreground">• Visual progress indicators</p>
            <p className="text-sm text-muted-foreground">• Stay motivated with streak milestones</p>
          </div>
        </div>
      ),
    },
    {
      title: "Analyze Your Progress",
      description: "Get insights into your habit patterns with detailed analytics.",
      icon: BarChart3,
      content: (
        <div className="space-y-4">
          <BarChart3 className="h-12 w-12 text-primary mx-auto" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">• View completion rates over time</p>
            <p className="text-sm text-muted-foreground">• Analyze habits by category</p>
            <p className="text-sm text-muted-foreground">• Weekly heatmaps and trends</p>
            <p className="text-sm text-muted-foreground">• Identify patterns and improve</p>
          </div>
        </div>
      ),
    },
    {
      title: "Stay Focused",
      description: "Use the built-in Pomodoro timer to boost your productivity.",
      icon: Timer,
      content: (
        <div className="space-y-4">
          <Timer className="h-12 w-12 text-primary mx-auto" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">• 25-minute focus sessions</p>
            <p className="text-sm text-muted-foreground">• 5-minute short breaks</p>
            <p className="text-sm text-muted-foreground">• 15-minute long breaks</p>
            <p className="text-sm text-muted-foreground">• Track your focus time and sessions</p>
          </div>
        </div>
      ),
    },
  ]

  const currentStepData = steps[currentStep]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onOpenChange(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{currentStepData.title}</DialogTitle>
          <DialogDescription>{currentStepData.description}</DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <Card>
            <CardContent className="p-6">{currentStepData.content}</CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${index === currentStep ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            <Button onClick={handleNext}>{currentStep === steps.length - 1 ? "Get Started" : "Next"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
