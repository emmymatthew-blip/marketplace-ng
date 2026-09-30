"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Shield, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

interface TrustworthinessCheckProps {
  userId: string
  userName: string
  isVerified: boolean
}

interface TrustCheckResult {
  trustScore: number
  details: {
    accountAge: number
    isVerified: boolean
    messageCount: number
    positiveReviews: number
    negativeReviews: number
    recentActivity: Array<{
      activity_type: 'message' | 'review'
      activity_date: string
    }>
  }
}

interface ParsedDetails {
  accountAge: string
  messageCount: string
  reviews: string
  recentActivity: string
}

export function TrustworthinessCheck({ userId, userName, isVerified }: TrustworthinessCheckProps) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<null | {
    status: 'success' | 'warning' | 'danger'
    message: string
    details: ParsedDetails
    score?: number
  }>(null)

  const handleCheck = async () => {
    setIsChecking(true)
    try {
      const response = await fetch(`/api/users/${userId}/trustworthiness`)
      if (!response.ok) {
        throw new Error('Failed to fetch trustworthiness data')
      }
      
      const data: TrustCheckResult = await response.json()
      
      // Determine status based on trust score
      const status = data.trustScore >= 70 ? 'success' : data.trustScore >= 40 ? 'warning' : 'danger'
      
      // Format account age
      const ageInMonths = Math.floor(data.details.accountAge / 30)
      const accountAgeText = ageInMonths > 0 
        ? `${ageInMonths} month${ageInMonths > 1 ? 's' : ''}`
        : `${data.details.accountAge} day${data.details.accountAge > 1 ? 's' : ''}`

      // Format recent activity
      const recentActivityCount = data.details.recentActivity.length
      const hasRecentActivity = recentActivityCount > 0

      const parsedDetails: ParsedDetails = {
        accountAge: accountAgeText,
        messageCount: `${data.details.messageCount} message${data.details.messageCount !== 1 ? 's' : ''}`,
        reviews: `${data.details.positiveReviews} positive, ${data.details.negativeReviews} negative`,
        recentActivity: hasRecentActivity 
          ? `${recentActivityCount} action${recentActivityCount > 1 ? 's' : ''} in the past week`
          : 'No recent activity'
      }
      
      setCheckResult({
        status,
        score: data.trustScore,
        message: getTrustMessage(data.trustScore),
        details: parsedDetails
      })
    } catch (error) {
      setCheckResult({
        status: 'danger',
        message: "Failed to complete background check",
        details: {
          accountAge: 'N/A',
          messageCount: 'N/A',
          reviews: 'N/A',
          recentActivity: 'Service temporarily unavailable'
        }
      })
    } finally {
      setIsChecking(false)
    }
  }

  const getTrustMessage = (score: number) => {
    if (score >= 70) return "High Trust"
    if (score >= 40) return "Moderate Trust"
    return "Low Trust"
  }

  const getStatusIcon = () => {
    if (!checkResult) return <Shield className="h-5 w-5" />
    switch (checkResult.status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'danger':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusColor = () => {
    if (!checkResult) return ""
    switch (checkResult.status) {
      case 'success':
        return "border-green-200"
      case 'warning':
        return "border-yellow-200"
      case 'danger':
        return "border-red-200"
    }
  }

  const getProgressColor = () => {
    if (!checkResult?.score) return "bg-gray-200"
    if (checkResult.score >= 70) return "bg-green-500"
    if (checkResult.score >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  const handleViewDetails = () => {
    router.push(`/users/${userId}/trust`)
  }

  return (
    <Card className={`mt-4 ${getStatusColor()} transition-all duration-300`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle className="text-base">Trust Score</CardTitle>
          </div>
          {isVerified && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Verified User
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {checkResult ? (
          <div className="space-y-3">
            <div className="relative">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">{checkResult.message}</span>
                <span className="text-sm font-medium">{checkResult.score}/100</span>
              </div>
              <Progress 
                value={checkResult.score} 
                className="h-2 transition-all duration-500"
                indicatorClassName={getProgressColor()}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleViewDetails}
            >
              View Detailed Trust Report
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleCheck}
            disabled={isChecking}
            className="w-full transition-all duration-300 hover:shadow-md"
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Check Trust Score
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
} 