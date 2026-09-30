"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Mail, Building2, Award, ArrowRight } from "lucide-react"

export interface VerificationStatus {
  emailVerified: boolean
  businessVerified: boolean
  enterpriseVerified: boolean
}

interface VerificationStatusCardProps {
  status?: Partial<VerificationStatus>
}

export function VerificationStatusCard({ status }: VerificationStatusCardProps) {
  const emailVerified = status?.emailVerified ?? false
  const businessVerified = status?.businessVerified ?? false
  const enterpriseVerified = status?.enterpriseVerified ?? false

  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <span className="rounded-lg bg-muted/80 p-2"><Shield className="h-4 w-4 text-muted-foreground" aria-hidden /></span>
          Verification status
        </CardTitle>
        <CardDescription>Trust badges for your company profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Email Verified
          </span>
          {emailVerified ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800">Verified</Badge>
          ) : (
            <Badge variant="outline">Pending</Badge>
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            Business Verified
          </span>
          {businessVerified ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800">Verified</Badge>
          ) : (
            <Badge variant="outline">Pending</Badge>
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            Enterprise Verification
          </span>
          {enterpriseVerified ? (
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">Verified</Badge>
          ) : (
            <Badge variant="outline">Not applied</Badge>
          )}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-2" asChild>
          <Link href="/verification">
            Manage verification
            <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
