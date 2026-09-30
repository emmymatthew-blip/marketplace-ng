"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

interface VerificationNudgeCardProps {
  isVerified: boolean
}

export function VerificationNudgeCard({ isVerified }: VerificationNudgeCardProps) {
  if (isVerified) return null

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Verify your business</CardTitle>
        </div>
        <CardDescription>
          Increase buyer trust with identity and business verification. Optional but recommended for sellers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild size="sm">
          <Link href="/verification">Go to Verification Center</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
