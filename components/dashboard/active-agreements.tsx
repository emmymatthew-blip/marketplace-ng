import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
          <p className="text-muted-foreground">You don't have any active agreements yet.</p>
          <Button asChild className="mt-4">
            <Link href="/agreements/new">Create Agreement</Link>
          </Button>
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
