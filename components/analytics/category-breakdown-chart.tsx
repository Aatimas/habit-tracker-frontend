"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import type { Habit } from "@/contexts/habits-context"

interface CategoryBreakdownChartProps {
  habits: Habit[]
}

const COLORS = [
  "#ea580c", // Primary orange
  "#f97316", // Secondary orange
  "#fb923c", // Light orange
  "#fed7aa", // Very light orange
  "#dc2626", // Red accent
]

export function CategoryBreakdownChart({ habits }: CategoryBreakdownChartProps) {
  const chartData = useMemo(() => {
    const categoryCount = habits.reduce(
      (acc, habit) => {
        acc[habit.category] = (acc[habit.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(categoryCount).map(([category, count]) => ({
      name: category,
      value: count,
      percentage: Math.round((count / habits.length) * 100),
    }))
  }, [habits])

  if (habits.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">No habits to display</p>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name} (${percentage}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Category</span>
                        <span className="font-bold text-muted-foreground">{data.name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Habits</span>
                        <span className="font-bold">
                          {data.value} ({data.percentage}%)
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
