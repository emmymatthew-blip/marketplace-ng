"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  FileText,
  Presentation,
  MessageCircle,
  BarChart3,
  Shield,
  Eye,
  Bookmark,
  Plus,
  Building2,
} from "lucide-react"

interface UnifiedDashboardProps {
  stats?: {
    listings: number
    views: number
    messages: number
    agreements: number
    inquiries: number
    demoRegistrations: number
  }
}

export function UnifiedDashboard({
  stats = {
    listings: 0,
    views: 0,
    messages: 0,
    agreements: 0,
    inquiries: 0,
    demoRegistrations: 0,
  },
}: UnifiedDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Listings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.listings}</div>
            <p className="text-xs text-muted-foreground">Advertised products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.views}</div>
            <p className="text-xs text-muted-foreground">Listing views</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messages}</div>
            <p className="text-xs text-muted-foreground">Inquiries & conversations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agreements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.agreements}</div>
            <p className="text-xs text-muted-foreground">Active agreements</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
          <CardDescription>Manage your listings and connect with partners</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/marketplace">
                <LayoutDashboard className="h-6 w-6 mb-2" />
                <span className="font-semibold">Explore listings</span>
                <span className="text-xs text-muted-foreground mt-1">Browse products & services</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/marketplace/my-products/new">
                <Plus className="h-6 w-6 mb-2" />
                <span className="font-semibold">Advertise product</span>
                <span className="text-xs text-muted-foreground mt-1">Create new listing</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/marketplace/my-products">
                <Package className="h-6 w-6 mb-2" />
                <span className="font-semibold">My listings</span>
                <span className="text-xs text-muted-foreground mt-1">Manage your advertisements</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/messages">
                <MessageSquare className="h-6 w-6 mb-2" />
                <span className="font-semibold">Messages</span>
                <span className="text-xs text-muted-foreground mt-1">Contact companies</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/agreements">
                <FileText className="h-6 w-6 mb-2" />
                <span className="font-semibold">Agreements</span>
                <span className="text-xs text-muted-foreground mt-1">View & manage</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/demonstrations">
                <Presentation className="h-6 w-6 mb-2" />
                <span className="font-semibold">Demonstrations</span>
                <span className="text-xs text-muted-foreground mt-1">Live demos & events</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/forum">
                <MessageCircle className="h-6 w-6 mb-2" />
                <span className="font-semibold">Forum</span>
                <span className="text-xs text-muted-foreground mt-1">Industry discussions</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/verification">
                <Shield className="h-6 w-6 mb-2" />
                <span className="font-semibold">Verification</span>
                <span className="text-xs text-muted-foreground mt-1">Build trust</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="listings">My listings</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
          <TabsTrigger value="demos">Demonstrations</TabsTrigger>
          <TabsTrigger value="forum">Forum activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Your activity at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Product views (listings)</p>
                  <p className="text-2xl font-bold">{stats.views}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Inquiries received</p>
                  <p className="text-2xl font-bold">{stats.inquiries}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Agreement requests</p>
                  <p className="text-2xl font-bold">{stats.agreements}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Demo registrations</p>
                  <p className="text-2xl font-bold">{stats.demoRegistrations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My listings</CardTitle>
                <CardDescription>Products and services you advertise</CardDescription>
              </div>
              <Button asChild>
                <Link href="/marketplace/my-products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Advertise product
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {stats.listings === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No listings yet</p>
                  <Button asChild>
                    <Link href="/marketplace/my-products/new">Advertise your first product</Link>
                  </Button>
                </div>
              ) : (
                <Button asChild variant="outline">
                  <Link href="/marketplace/my-products">Manage listings</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Conversations with companies and partners</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/messages">Open messages</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agreements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Agreements</CardTitle>
              <CardDescription>Negotiate and manage agreements with partners</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/agreements">View agreements</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Demonstrations</CardTitle>
              <CardDescription>Live demos and featured events</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/demonstrations">View demonstrations</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forum" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Forum activity</CardTitle>
              <CardDescription>Join industry discussions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/forum">Go to forum</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Listing views, inquiries, agreement requests, demo registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium text-muted-foreground">Product views</p>
                  <p className="text-2xl font-bold">{stats.views}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium text-muted-foreground">Inquiries received</p>
                  <p className="text-2xl font-bold">{stats.inquiries}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium text-muted-foreground">Agreement requests</p>
                  <p className="text-2xl font-bold">{stats.agreements}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium text-muted-foreground">Demo registrations</p>
                  <p className="text-2xl font-bold">{stats.demoRegistrations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification</CardTitle>
              <CardDescription>Verified Company and Enterprise Verified badges build trust with partners</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/verification">Verification Center</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
