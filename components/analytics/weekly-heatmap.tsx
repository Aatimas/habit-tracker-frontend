"use client"

import { useMemo } from "react"
import type { Habit } from "@/contexts/habits-context"
import { cn } from "@/lib/utils"

interface WeeklyHeatmapProps {
  habits: Habit[]
}

export function WeeklyHeatmap({ habits }: WeeklyHeatmapProps) {
  const heatmapData = useMemo(() => {
    const weeks = 12 // Show last 12 weeks
    const data = []

    for (let week = weeks - 1; week >= 0; week--) {
      const weekData = []
      for (let day = 0; day < 7; day++) {
        const date = new Date()
        date.setDate(date.getDate() - week * 7 - (6 - day))
        const dateString = date.toISOString().split("T")[0]

        const completedHabits = habits.filter((habit) => habit.completedDates.includes(dateString)).length

        const completionRate = habits.length > 0 ? completedHabits / habits.length : 0

        weekData.push({
          date: dateString,
          day: date.getDate(),
          completionRate,
          completedHabits,
          totalHabits: habits.length,
        })
      }
      data.push(weekData)
    }

    return data
  }, [habits])

  const getIntensityClass = (rate: number) => {
    if (rate === 0) return "bg-gray-100 dark:bg-gray-800"
    if (rate <= 0.25) return "bg-orange-200 dark:bg-orange-900"
    if (rate <= 0.5) return "bg-orange-300 dark:bg-orange-700"
    if (rate <= 0.75) return "bg-orange-400 dark:bg-orange-600"
    return "bg-orange-500 dark:bg-orange-500"
  }

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800"></div>
          <div className="w-3 h-3 rounded-sm bg-orange-200 dark:bg-orange-900"></div>
          <div className="w-3 h-3 rounded-sm bg-orange-300 dark:bg-orange-700"></div>
          <div className="w-3 h-3 rounded-sm bg-orange-400 dark:bg-orange-600"></div>
          <div className="w-3 h-3 rounded-sm bg-orange-500"></div>
        </div>
        <span>More</span>
      </div>

      <div className="grid grid-cols-12 gap-1">
        {heatmapData.map((week, weekIndex) => (
          <div key={weekIndex} className="space-y-1">
            {week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={cn(
                  "w-4 h-4 rounded-sm transition-colors cursor-pointer",
                  getIntensityClass(day.completionRate),
                )}
                title={`${day.date}: ${day.completedHabits}/${day.totalHabits} habits completed (${Math.round(day.completionRate * 100)}%)`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground">
        {dayLabels.map((label) => (
          <div key={label} className="text-center">
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
