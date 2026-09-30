import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Inbox, MessageSquare } from "lucide-react"

interface Agreement {
  id: string
  title: string
  status: "PROPOSED" | "ACTIVE" | "COMPLETED" | "DISPUTED"
  counterparty: {
    name: string
    role: string
  }
  service: string
  startDate: string
  dueDate: string
  value: string
}

interface ActiveAgreementsProps {
  agreements: Agreement[]
}

export function ActiveAgreements({ agreements }: ActiveAgreementsProps) {
  if (!agreements.length) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            You do not have any active agreements yet. Agreements usually begin after a conversation or inquiry.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button asChild variant="outline">
              <Link href="/messages">
                <MessageSquare className="mr-1.5 h-4 w-4" />
                Go to Messages
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/inquiries">
                <Inbox className="mr-1.5 h-4 w-4" />
                View Inquiries
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {agreements.map((agreement) => (
        <Card key={agreement.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-lg">{agreement.title}</CardTitle>
              <Badge
                variant={
                  agreement.status === "ACTIVE"
                    ? "default"
                    : agreement.status === "PROPOSED"
                      ? "outline"
                      : agreement.status === "COMPLETED"
                        ? "secondary"
                        : "destructive"
                }
              >
                {agreement.status.charAt(0) + agreement.status.slice(1).toLowerCase()}
              </Badge>
            </div>
            <CardDescription>With: {agreement.counterparty.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm">
              <div>
                <p className="font-medium">Service: {agreement.service}</p>
                <p className="text-muted-foreground">Started: {agreement.startDate}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Value: {agreement.value}</p>
                <p className="text-muted-foreground">Due: {agreement.dueDate}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href={`/agreements/${agreement.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
