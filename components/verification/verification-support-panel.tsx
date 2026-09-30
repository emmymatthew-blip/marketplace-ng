"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Clock, FileCheck, Mail } from "lucide-react"

export function VerificationSupportPanel() {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm sticky top-24">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Trust & verification help
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          Verified companies build trust faster, stand out in listings, and inspire greater
          confidence during inquiries and agreements. Partners can see your verification
          status and methods when they view your profile and listings.
        </p>
        <div>
          <p className="font-medium text-foreground mb-1 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Review timelines
          </p>
          <p>
            Most submissions are reviewed within 2–5 business days. You will be notified
            by email once your documents have been reviewed.
          </p>
        </div>
        <div>
          <p className="font-medium text-foreground mb-1 flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Accepted documents
          </p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>PDF, JPG, or PNG format</li>
            <li>Max 5MB per file</li>
            <li>Clear, readable copies (no screenshots of screens)</li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-foreground mb-1 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Support
          </p>
          <p>
            Need help? Contact support for verification questions, clarification on accepted
            documents, or if you need to submit additional information for a pending review.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
