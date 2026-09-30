"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Check, User, Building2, Briefcase, Shield } from "lucide-react"

interface OnboardingChecklistCardProps {
  hasName: boolean
  hasCompany: boolean
  hasRole: boolean
  isVerified: boolean
}

const steps = [
  { key: "profile", label: "Basic profile", href: "/onboarding", icon: User },
  { key: "company", label: "Company details", href: "/onboarding", icon: Building2 },
  { key: "industry", label: "Industry role", href: "/onboarding", icon: Briefcase },
  { key: "verification", label: "Verification", href: "/verification", icon: Shield },
]

export function OnboardingChecklistCard({
  hasName,
  hasCompany,
  hasRole,
  isVerified,
}: OnboardingChecklistCardProps) {
  const completed = [hasName, hasCompany, hasRole, isVerified].filter(Boolean).length
  const total = 4
  const progress = (completed / total) * 100
  const allDone = completed === total

  if (allDone) return null

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Complete your profile</CardTitle>
        <CardDescription>
          Finish onboarding to get the most out of PrintMarket NG.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="h-2" />
        <ul className="space-y-2 text-sm">
          {steps.map((s, i) => {
            const done = [hasName, hasCompany, hasRole, isVerified][i]
            const Icon = s.icon
            return (
              <li key={s.key} className="flex items-center gap-2">
                {done ? (
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                ) : (
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span className={done ? "text-muted-foreground" : ""}>{s.label}</span>
              </li>
            )
          })}
        </ul>
        <Button asChild variant="outline" size="sm">
          <Link href="/onboarding">Continue onboarding</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
