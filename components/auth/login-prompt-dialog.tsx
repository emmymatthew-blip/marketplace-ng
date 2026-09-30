"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { loginWithCallback } from "@/lib/auth-urls"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Path after login (e.g. `/demonstrations/abc?action=register`) */
  returnTo: string
  title?: string
  description?: string
}

/** Optional UX: explain before sending the user to the login page with callback. */
export function LoginPromptDialog({
  open,
  onOpenChange,
  returnTo,
  title = "Sign in to continue",
  description = "Create an account or sign in to complete this action and return here.",
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Not now
          </Button>
          <Button asChild>
            <Link href={loginWithCallback(returnTo)}>Sign in</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
