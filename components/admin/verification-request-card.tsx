"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface VerificationRequest {
  id: string
  name: string
  email: string
  image?: string
  role: string
  cipponId?: string
  submittedAt: string
  companyName?: string
  location?: string
}

interface VerificationRequestCardProps {
  request: VerificationRequest
  onVerify: (userId: string, cipponId: string) => Promise<void>
  onReject: (userId: string) => Promise<void>
}

export function VerificationRequestCard({ request, onVerify, onReject }: VerificationRequestCardProps) {
  const [cipponId, setCipponId] = useState(request.cipponId || "")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const { toast } = useToast()

  const handleVerify = async () => {
    if (!cipponId.trim()) {
      toast({
        title: "CIPPON ID required",
        description: "Please enter a valid CIPPON ID to verify this printer.",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)
    try {
      await onVerify(request.id, cipponId)
      toast({
        title: "Verification successful",
        description: `${request.name} has been verified as a CIPPON member.`,
      })
    } catch (error) {
      console.error("Error verifying printer:", error)
      toast({
        title: "Verification failed",
        description: "There was an error verifying this printer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleReject = async () => {
    setIsRejecting(true)
    try {
      await onReject(request.id)
      toast({
        title: "Verification rejected",
        description: `${request.name}'s verification request has been rejected.`,
      })
    } catch (error) {
      console.error("Error rejecting verification:", error)
      toast({
        title: "Rejection failed",
        description: "There was an error rejecting this verification request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRejecting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">{request.name}</CardTitle>
          <Badge variant="outline">{request.role}</Badge>
        </div>
        <CardDescription>Email: {request.email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={request.image || "/placeholder.svg"} alt={request.name} />
            <AvatarFallback>{request.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="grid grid-cols-2 gap-2 flex-1">
            {request.companyName && (
              <div>
                <p className="text-sm font-medium">Company</p>
                <p className="text-sm text-muted-foreground">{request.companyName}</p>
              </div>
            )}
            {request.location && (
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{request.location}</p>
              </div>
            )}
            <div className="col-span-2">
              <p className="text-sm font-medium">Submitted</p>
              <p className="text-sm text-muted-foreground">{request.submittedAt}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`cippon-id-${request.id}`}>CIPPON ID</Label>
          <Input
            id={`cippon-id-${request.id}`}
            value={cipponId}
            onChange={(e) => setCipponId(e.target.value)}
            placeholder="Enter or confirm CIPPON ID"
          />
          <p className="text-xs text-muted-foreground">
            Verify the CIPPON ID provided by the printer or enter a new one if needed.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="destructive" size="sm" onClick={handleReject} disabled={isRejecting || isVerifying}>
          <XCircle className="mr-2 h-4 w-4" />
          {isRejecting ? "Rejecting..." : "Reject"}
        </Button>
        <Button size="sm" onClick={handleVerify} disabled={isVerifying || isRejecting}>
          <CheckCircle className="mr-2 h-4 w-4" />
          {isVerifying ? "Verifying..." : "Verify"}
        </Button>
      </CardFooter>
    </Card>
  )
}
