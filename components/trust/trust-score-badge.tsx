"use client"

import { Shield, CheckCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getTrustLevel } from "@/lib/trust-score"

interface TrustScoreBadgeProps {
  score: number | null
  isLoading?: boolean
  onClick?: () => void
  className?: string
  showLabel?: boolean
  size?: "sm" | "md"
}

export function TrustScoreBadge({
  score,
  isLoading,
  onClick,
  className,
  showLabel = true,
  size = "md",
}: TrustScoreBadgeProps) {
  const level = score != null ? getTrustLevel(score) : null

  const levelStyles = {
    Excellent: "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    Strong: "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400",
    Moderate: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    Limited: "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-400",
  }

  const icon =
    score == null && !isLoading ? (
      <Shield className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
    ) : isLoading ? (
      <Shield className={cn(size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4", "animate-pulse")} />
    ) : score >= 70 ? (
      <CheckCircle className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
    ) : score >= 40 ? (
      <Shield className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
    ) : (
      <AlertTriangle className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
    )

  const styleClass =
    level && level in levelStyles
      ? (levelStyles as Record<string, string>)[level]
      : "border-border bg-muted/50 text-muted-foreground"

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors hover:opacity-90",
        size === "sm" ? "px-2 py-1 text-xs" : "px-2.5 py-1.5 text-sm",
        styleClass,
        className
      )}
      disabled={isLoading}
      aria-label={score != null ? `Trust score: ${score} out of 100, ${level}` : "Check trust score"}
    >
      {icon}
      {showLabel && (
        <>
          {isLoading ? (
            <span>Checking…</span>
          ) : score != null ? (
            <>
              <span>{score}/100</span>
              {level && <span className="hidden sm:inline">· {level}</span>}
            </>
          ) : (
            <span>Check Trust Score</span>
          )}
        </>
      )}
    </button>
  )
}
