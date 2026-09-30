"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, ArrowRight, Shield, LayoutDashboard } from "lucide-react"

const WELCOME_MODAL_STORAGE_KEY = "printmarket_welcome_modal_seen"

export function getWelcomeModalStorageKey(userId: string) {
  return `${WELCOME_MODAL_STORAGE_KEY}_${userId}`
}

export function hasSeenWelcomeModal(userId: string): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem(getWelcomeModalStorageKey(userId))
}

export function markWelcomeModalSeen(userId: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(getWelcomeModalStorageKey(userId), "1")
}

interface WelcomeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onContinue?: () => void
}

export function WelcomeModal({
  open,
  onOpenChange,
  userId,
  onContinue,
}: WelcomeModalProps) {
  const handleStartSetup = () => {
    markWelcomeModalSeen(userId)
    onOpenChange(false)
  }

  const handleCompleteVerification = () => {
    markWelcomeModalSeen(userId)
    onOpenChange(false)
  }

  const handleContinueToDashboard = () => {
    markWelcomeModalSeen(userId)
    onOpenChange(false)
    onContinue?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl border border-border shadow-lg bg-card">
        <DialogHeader className="space-y-4 text-center sm:text-left">
          <div className="mx-auto sm:mx-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" aria-hidden />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Welcome to PrintMarket NG
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            Start building your presence on the platform by completing your profile
            and verification. Verified companies stand out more clearly and inspire
            greater confidence during inquiries and agreements. You can continue to
            the dashboard without completing these steps.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-col sm:gap-3 pt-2">
          <Button
            onClick={handleStartSetup}
            className="w-full sm:w-auto"
            asChild
          >
            <Link href="/onboarding">
              Start Setup
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button
            variant="secondary"
            onClick={handleCompleteVerification}
            className="w-full sm:w-auto"
            asChild
          >
            <Link href="/verification">
              <Shield className="mr-2 h-4 w-4" aria-hidden />
              Complete Verification
            </Link>
          </Button>
          <Button
            variant="ghost"
            onClick={handleContinueToDashboard}
            className="w-full sm:w-auto text-muted-foreground"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden />
            Continue to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
