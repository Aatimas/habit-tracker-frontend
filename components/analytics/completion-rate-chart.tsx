"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Habit } from "@/contexts/habits-context"

interface CompletionRateChartProps {
  habits: Habit[]
  showDetailed?: boolean
}

export function CompletionRateChart({ habits, showDetailed = false }: CompletionRateChartProps) {
  const chartData = useMemo(() => {
    const days = showDetailed ? 60 : 30
    const data = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      const completedHabits = habits.filter((habit) => habit.completedDates.includes(dateString)).length

      const completionRate = habits.length > 0 ? (completedHabits / habits.length) * 100 : 0

      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        rate: Math.round(completionRate),
        completed: completedHabits,
        total: habits.length,
      })
    }

    return data
  }, [habits, showDetailed])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} domain={[0, 100]} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                        <span className="font-bold text-muted-foreground">{label}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Completion Rate</span>
                        <span className="font-bold">
                          {data.rate}% ({data.completed}/{data.total})
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#ea580c"
            strokeWidth={2}
            dot={{ fill: "#ea580c", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#ea580c", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
