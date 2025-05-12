"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, AlertTriangle, FileText, MessageSquare } from "lucide-react"

interface AgreementParty {
  id: string
  name: string
  image?: string
  role: string
  isVerified: boolean
  companyName?: string
}

interface AgreementDetail {
  id: string
  title: string
  status: "PROPOSED" | "ACTIVE" | "COMPLETED" | "DISPUTED"
  initiator: AgreementParty
  receiver: AgreementParty
  terms: string
  notes?: string
  startDate?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
  isInitiator: boolean
}

interface AgreementDetailProps {
  agreement: AgreementDetail
  onAccept: () => void
  onReject: () => void
  onComplete: () => void
  onDispute: () => void
  isLoading: boolean
}

export function AgreementDetail({
  agreement,
  onAccept,
  onReject,
  onComplete,
  onDispute,
  isLoading,
}: AgreementDetailProps) {
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PROPOSED":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "DISPUTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PROPOSED":
        return <FileText className="h-5 w-5" />
      case "ACTIVE":
        return <CheckCircle className="h-5 w-5" />
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5" />
      case "DISPUTED":
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">{agreement.title}</CardTitle>
            <CardDescription>
              Created on {agreement.createdAt} • Last updated: {agreement.updatedAt}
            </CardDescription>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              agreement.status,
            )}`}
          >
            {getStatusIcon(agreement.status)}
            <span>{agreement.status}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Initiator</h3>
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={agreement.initiator.image || "/placeholder.svg"} alt={agreement.initiator.name} />
                <AvatarFallback>{agreement.initiator.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium flex items-center">
                  {agreement.initiator.name}
                  {agreement.initiator.isVerified && <CheckCircle className="ml-1 h-3 w-3 text-green-600" />}
                </div>
                <div className="text-sm text-muted-foreground">{agreement.initiator.role}</div>
                {agreement.initiator.companyName && <div className="text-sm">{agreement.initiator.companyName}</div>}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Receiver</h3>
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={agreement.receiver.image || "/placeholder.svg"} alt={agreement.receiver.name} />
                <AvatarFallback>{agreement.receiver.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium flex items-center">
                  {agreement.receiver.name}
                  {agreement.receiver.isVerified && <CheckCircle className="ml-1 h-3 w-3 text-green-600" />}
                </div>
                <div className="text-sm text-muted-foreground">{agreement.receiver.role}</div>
                {agreement.receiver.companyName && <div className="text-sm">{agreement.receiver.companyName}</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Terms and Conditions</h3>
          <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">{agreement.terms}</div>
        </div>

        {agreement.notes && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Notes</h3>
            <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">{agreement.notes}</div>
          </div>
        )}

        {agreement.startDate && agreement.dueDate && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Start Date</h4>
              <p>{agreement.startDate}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Due Date</h4>
              <p>{agreement.dueDate}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-end">
        {agreement.status === "PROPOSED" && !agreement.isInitiator && (
          <>
            <Button variant="outline" onClick={onReject} disabled={isLoading}>
              Reject
            </Button>
            <Button onClick={onAccept} disabled={isLoading}>
              {isLoading ? "Processing..." : "Accept Agreement"}
            </Button>
          </>
        )}

        {agreement.status === "ACTIVE" && (
          <>
            <Button variant="outline" onClick={onDispute} disabled={isLoading}>
              Report Issue
            </Button>
            <Button onClick={onComplete} disabled={isLoading}>
              {isLoading ? "Processing..." : "Mark as Completed"}
            </Button>
          </>
        )}

        {agreement.status === "DISPUTED" && (
          <Button 
            variant="outline" 
            onClick={() => router.push(`/agreements/${agreement.id}/dispute`)}
            className="flex items-center"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            View Dispute Details
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
