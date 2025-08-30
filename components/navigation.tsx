"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Target, Moon, Sun, User, LogOut, Settings, BarChart3, Timer, Home } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"

export function Navigation() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else if (theme === "light") {
      setTheme("system")
    } else {
      setTheme("dark")
    }
  }

  const effectiveTheme =
    theme === "system"
      ? typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme

  if (!user) return null

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            <Link href="/dashboard" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
              HabitFlow
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              size="sm"
              asChild
              className="hover:bg-accent transition-colors"
            >
              <Link href="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>

            <Button
              variant={pathname === "/timer" ? "secondary" : "ghost"}
              size="sm"
              asChild
              className="hover:bg-accent transition-colors"
            >
              <Link href="/timer">
                <Timer className="h-4 w-4 mr-2" />
                Timer
              </Link>
            </Button>

            <Button
              variant={pathname === "/analytics" ? "secondary" : "ghost"}
              size="sm"
              asChild
              className="hover:bg-accent transition-colors"
            >
              <Link href="/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-1">
              <Button variant="ghost" size="icon" asChild className="hover:bg-accent transition-colors">
                <Link href="/dashboard">
                  <Home className="h-4 w-4" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </Button>

              <Button variant="ghost" size="icon" asChild className="hover:bg-accent transition-colors">
                <Link href="/timer">
                  <Timer className="h-4 w-4" />
                  <span className="sr-only">Timer</span>
                </Link>
              </Button>

              <Button variant="ghost" size="icon" asChild className="hover:bg-accent transition-colors">
                <Link href="/analytics">
                  <BarChart3 className="h-4 w-4" />
                  <span className="sr-only">Analytics</span>
                </Link>
              </Button>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-accent transition-colors"
              title={`Current theme: ${theme}. Click to toggle.`}
            >
              {!mounted ? (
                <Sun className="h-4 w-4" />
              ) : (
                <>
                  <Sun
                    className={`h-4 w-4 transition-all ${effectiveTheme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"}`}
                  />
                  <Moon
                    className={`absolute h-4 w-4 transition-all ${effectiveTheme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`}
                  />
                </>
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-accent transition-colors">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/timer">
                    <Timer className="mr-2 h-4 w-4" />
                    <span>Focus Timer</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
