"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Habit {
  id: string
  name: string
  description?: string
  category: string
  frequency: "daily" | "weekly"
  targetDays?: number[] // For weekly habits: 0=Sunday, 1=Monday, etc.
  streak: number
  longestStreak: number
  completedToday: boolean
  completedDates: string[] // ISO date strings
  createdAt: string
  updatedAt: string
}

interface HabitsContextType {
  habits: Habit[]
  isLoading: boolean
  addHabit: (
    habit: Omit<
      Habit,
      "id" | "streak" | "longestStreak" | "completedToday" | "completedDates" | "createdAt" | "updatedAt"
    >,
  ) => void
  updateHabit: (id: string, updates: Partial<Habit>) => void
  deleteHabit: (id: string) => void
  toggleHabitCompletion: (id: string) => void
  getHabitProgress: (id: string) => number
  getTodaysCompletedCount: () => number
  getLongestStreak: () => number
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined)

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load habits from localStorage on mount
  useEffect(() => {
    const loadHabits = () => {
      try {
        const storedHabits = localStorage.getItem("habits")
        if (storedHabits) {
          const parsedHabits = JSON.parse(storedHabits)
          setHabits(parsedHabits)
        } else {
          // Initialize with sample habits for demo
          const sampleHabits: Habit[] = [
            {
              id: "1",
              name: "Morning Exercise",
              description: "30 minutes of cardio or strength training",
              category: "Health",
              frequency: "daily",
              streak: 7,
              longestStreak: 12,
              completedToday: true,
              completedDates: [
                new Date().toISOString().split("T")[0], // Today
                new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
                new Date(Date.now() - 172800000).toISOString().split("T")[0], // 2 days ago
              ],
              createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
              updatedAt: new Date().toISOString(),
            },
            {
              id: "2",
              name: "Read 30 minutes",
              description: "Read books, articles, or educational content",
              category: "Learning",
              frequency: "daily",
              streak: 12,
              longestStreak: 15,
              completedToday: false,
              completedDates: [
                new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
                new Date(Date.now() - 172800000).toISOString().split("T")[0], // 2 days ago
              ],
              createdAt: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
              updatedAt: new Date().toISOString(),
            },
            {
              id: "3",
              name: "Drink 8 glasses of water",
              description: "Stay hydrated throughout the day",
              category: "Health",
              frequency: "daily",
              streak: 5,
              longestStreak: 8,
              completedToday: true,
              completedDates: [
                new Date().toISOString().split("T")[0], // Today
                new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
              ],
              createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
              updatedAt: new Date().toISOString(),
            },
          ]
          setHabits(sampleHabits)
          localStorage.setItem("habits", JSON.stringify(sampleHabits))
        }
      } catch (error) {
        console.error("Failed to load habits:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadHabits()
  }, [])

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("habits", JSON.stringify(habits))
    }
  }, [habits, isLoading])

  const addHabit = (
    habitData: Omit<
      Habit,
      "id" | "streak" | "longestStreak" | "completedToday" | "completedDates" | "createdAt" | "updatedAt"
    >,
  ) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      streak: 0,
      longestStreak: 0,
      completedToday: false,
      completedDates: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setHabits((prev) => [...prev, newHabit])
  }

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === id ? { ...habit, ...updates, updatedAt: new Date().toISOString() } : habit)),
    )
  }

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id))
  }

  const toggleHabitCompletion = (id: string) => {
    const today = new Date().toISOString().split("T")[0]

    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit

        const isCompletedToday = habit.completedDates.includes(today)
        let newCompletedDates: string[]
        let newStreak: number
        let newLongestStreak: number

        if (isCompletedToday) {
          // Remove today's completion
          newCompletedDates = habit.completedDates.filter((date) => date !== today)
          newStreak = calculateStreak(newCompletedDates)
        } else {
          // Add today's completion
          newCompletedDates = [...habit.completedDates, today].sort()
          newStreak = calculateStreak(newCompletedDates)
        }

        newLongestStreak = Math.max(habit.longestStreak, newStreak)

        return {
          ...habit,
          completedToday: !isCompletedToday,
          completedDates: newCompletedDates,
          streak: newStreak,
          longestStreak: newLongestStreak,
          updatedAt: new Date().toISOString(),
        }
      }),
    )
  }

  const calculateStreak = (completedDates: string[]): number => {
    if (completedDates.length === 0) return 0

    const sortedDates = completedDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    const today = new Date().toISOString().split("T")[0]

    let streak = 0
    const currentDate = new Date()

    // Check if today is completed or if we should start from yesterday
    if (sortedDates[0] === today) {
      streak = 1
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      currentDate.setDate(currentDate.getDate() - 1)
    }

    // Count consecutive days backwards
    for (let i = sortedDates[0] === today ? 1 : 0; i < sortedDates.length; i++) {
      const expectedDate = currentDate.toISOString().split("T")[0]
      if (sortedDates[i] === expectedDate) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  const getHabitProgress = (id: string): number => {
    const habit = habits.find((h) => h.id === id)
    if (!habit) return 0

    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
    const completedThisMonth = habit.completedDates.filter((date) => {
      const completedDate = new Date(date)
      const now = new Date()
      return completedDate.getMonth() === now.getMonth() && completedDate.getFullYear() === now.getFullYear()
    }).length

    return Math.round((completedThisMonth / daysInMonth) * 100)
  }

  const getTodaysCompletedCount = (): number => {
    return habits.filter((habit) => habit.completedToday).length
  }

  const getLongestStreak = (): number => {
    return Math.max(...habits.map((habit) => habit.longestStreak), 0)
  }

  const value: HabitsContextType = {
    habits,
    isLoading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitProgress,
    getTodaysCompletedCount,
    getLongestStreak,
  }

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
}

export function useHabits() {
  const context = useContext(HabitsContext)
  if (context === undefined) {
    throw new Error("useHabits must be used within a HabitsProvider")
  }
  return context
}
