"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Check, MoreHorizontal, Edit, Trash2, Calendar } from "lucide-react"
import { useHabits, type Habit } from "@/contexts/habits-context"
import { cn } from "@/lib/utils"

interface HabitCardProps {
  habit: Habit
}

export function HabitCard({ habit }: HabitCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { toggleHabitCompletion, deleteHabit, getHabitProgress } = useHabits()

  const progress = getHabitProgress(habit.id)

  const handleToggleCompletion = () => {
    toggleHabitCompletion(habit.id)
  }

  const handleDelete = () => {
    deleteHabit(habit.id)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <Card className="transition-all hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 rounded-full p-0 border-2 transition-all",
                  habit.completedToday
                    ? "bg-primary border-primary text-primary-foreground hover:bg-primary/90"
                    : "border-muted-foreground hover:border-primary",
                )}
                onClick={handleToggleCompletion}
              >
                {habit.completedToday && <Check className="h-4 w-4" />}
              </Button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground truncate">{habit.name}</h3>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {habit.category}
                  </Badge>
                </div>
                {habit.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{habit.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className="capitalize">{habit.frequency}</span>
                  </div>
                  <div>
                    <span className="font-medium text-primary">{habit.streak}</span> day streak
                  </div>
                  <div>
                    Best: <span className="font-medium">{habit.longestStreak}</span>
                  </div>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit habit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete habit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monthly Progress</span>
              <span className="text-foreground font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{habit.name}"? This action cannot be undone and you will lose all
              progress data for this habit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Habit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
