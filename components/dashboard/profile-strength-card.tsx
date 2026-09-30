"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { ImagePlus, Video, Shield, CheckCircle } from "lucide-react"

export interface ProfileStrengthItem {
  id: string
  label: string
  done: boolean
  href?: string
}

interface ProfileStrengthCardProps {
  percentage?: number
  items?: ProfileStrengthItem[]
}

const defaultItems: ProfileStrengthItem[] = [
  { id: "logo", label: "Upload logo", done: false, href: "/profile" },
  { id: "description", label: "Complete company description", done: false, href: "/profile" },
  { id: "verify", label: "Verify your business", done: false, href: "/verification" },
]

export function ProfileStrengthCard({
  percentage = 0,
  items = defaultItems,
}: ProfileStrengthCardProps) {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Profile strength</CardTitle>
        <CardDescription>Complete your profile to build trust with partners</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{percentage}%</span>
              <span className="text-muted-foreground">Complete</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        </div>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 text-sm">
              {item.done ? (
                <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
              )               : item.id === "logo" ? (
                <ImagePlus className="h-4 w-4 text-muted-foreground shrink-0" />
              ) : item.id === "description" ? (
                <Video className="h-4 w-4 text-muted-foreground shrink-0" />
              ) : item.id === "video" ? (
                <Video className="h-4 w-4 text-muted-foreground shrink-0" />
              ) : (
                <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              {item.href && !item.done ? (
                <Link href={item.href} className="text-primary hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className={item.done ? "text-muted-foreground" : ""}>{item.label}</span>
              )}
            </li>
          ))}
        </ul>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href="/profile">Complete profile</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
