"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { Printer, Users, FileText, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Footer } from "@/components/footer"

// Mock data - would be fetched from API in production
const pendingVerifications = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    role: "PRINTER",
    cipponId: "CIPPON12345",
    submittedAt: "2023-06-15",
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "PRINTER",
    cipponId: "CIPPON67890",
    submittedAt: "2023-06-18",
  },
]

const pendingDemos = [
  {
    id: "demo1",
    title: "Advanced Screen Printing Techniques",
    manufacturer: {
      id: "manu1",
      name: "ScreenTech International",
    },
    schedule: "2023-07-15",
    price: "₦5,000",
    submittedAt: "2023-06-10",
  },
  {
    id: "demo2",
    title: "Digital Press Maintenance Workshop",
    manufacturer: {
      id: "manu2",
      name: "Canon Nigeria",
    },
    schedule: "2023-07-18",
    price: "₦7,500",
    submittedAt: "2023-06-12",
  },
]

const disputedAgreements = [
  {
    id: "agreement1",
    title: "Banner Printing Project",
    initiator: {
      id: "user3",
      name: "Michael Johnson",
    },
    receiver: {
      id: "user4",
      name: "ScreenTech International",
    },
    disputedAt: "2023-06-20",
    reason: "Quality issues with the delivered banners",
  },
  {
    id: "agreement2",
    title: "Brochure Design and Printing",
    initiator: {
      id: "user5",
      name: "Sarah Williams",
    },
    receiver: {
      id: "user6",
      name: "GraphicPro Systems",
    },
    disputedAt: "2023-06-22",
    reason: "Delayed delivery beyond agreed timeline",
  },
]

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({
    totalUsers: 156,
    pendingVerifications: 2,
    pendingDemos: 2,
    disputedAgreements: 2,
  })

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/admin/dashboard")
    } else if (status === "authenticated" && session.user.role !== "ADMIN") {
      redirect("/dashboard")
    }
  }, [status, session])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!session || session.user.role !== "ADMIN") {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <div className="flex items-center gap-4">
            <Search />
            <UserAccountNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage users, agreements, forums, and demonstration approvals.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Registered users on the platform</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
                  <p className="text-xs text-muted-foreground">CIPPON verifications awaiting review</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Demos</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingDemos}</div>
                  <p className="text-xs text-muted-foreground">Demonstration classes awaiting approval</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Disputed Agreements</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.disputedAgreements}</div>
                  <p className="text-xs text-muted-foreground">Agreements requiring resolution</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="verifications">
              <TabsList>
                <TabsTrigger value="verifications">Pending Verifications</TabsTrigger>
                <TabsTrigger value="demos">Pending Demos</TabsTrigger>
                <TabsTrigger value="disputes">Disputed Agreements</TabsTrigger>
              </TabsList>

              <TabsContent value="verifications" className="mt-6">
                <div className="grid gap-4">
                  {pendingVerifications.map((user) => (
                    <Card key={user.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-lg">{user.name}</CardTitle>
                          <Badge variant="outline">{user.role}</Badge>
                        </div>
                        <CardDescription>Email: {user.email}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm">
                          <div>
                            <p className="font-medium">CIPPON ID: {user.cipponId}</p>
                            <p className="text-muted-foreground">Submitted: {user.submittedAt}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="destructive" size="sm">
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button size="sm">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Verify
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="demos" className="mt-6">
                <div className="grid gap-4">
                  {pendingDemos.map((demo) => (
                    <Card key={demo.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-lg">{demo.title}</CardTitle>
                          <Badge variant="outline">₦{demo.price}</Badge>
                        </div>
                        <CardDescription>By: {demo.manufacturer.name}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm">
                          <div>
                            <p className="font-medium">Scheduled for: {demo.schedule}</p>
                            <p className="text-muted-foreground">Submitted: {demo.submittedAt}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="destructive" size="sm">
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button size="sm">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="disputes" className="mt-6">
                <div className="grid gap-4">
                  {disputedAgreements.map((agreement) => (
                    <Card key={agreement.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-lg">{agreement.title}</CardTitle>
                          <Badge variant="destructive">Disputed</Badge>
                        </div>
                        <CardDescription>
                          Between: {agreement.initiator.name} and {agreement.receiver.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2 text-sm">
                          <p className="font-medium">Dispute Reason:</p>
                          <p className="text-muted-foreground">{agreement.reason}</p>
                          <p className="text-muted-foreground">Disputed on: {agreement.disputedAt}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/disputes/${agreement.id}`}>View Details</Link>
                        </Button>
                        <Button size="sm">Resolve Dispute</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/admin/users">Manage Users</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/forum">Manage Forum</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
