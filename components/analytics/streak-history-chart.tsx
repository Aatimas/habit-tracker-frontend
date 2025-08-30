"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Habit } from "@/contexts/habits-context"

interface StreakHistoryChartProps {
  habits: Habit[]
}

export function StreakHistoryChart({ habits }: StreakHistoryChartProps) {
  const chartData = useMemo(() => {
    return habits
      .map((habit) => ({
        name: habit.name.length > 15 ? habit.name.substring(0, 15) + "..." : habit.name,
        current: habit.streak,
        longest: habit.longestStreak,
        category: habit.category,
      }))
      .sort((a, b) => b.longest - a.longest)
  }, [habits])

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="name"
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-3 shadow-sm">
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Habit</span>
                        <span className="font-bold text-muted-foreground">{label}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Current Streak</span>
                        <span className="font-bold text-primary">{data.current} days</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Longest Streak</span>
                        <span className="font-bold text-secondary">{data.longest} days</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="current" fill="#ea580c" name="Current Streak" />
          <Bar dataKey="longest" fill="#f97316" name="Longest Streak" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
