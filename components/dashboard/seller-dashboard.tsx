"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Package,
  TrendingUp,
  Eye,
  MessageSquare,
  Plus,
  BarChart3,
  DollarSign,
  Users,
  Building2,
  Sparkles,
} from "lucide-react"
import { WEEKLY_DEMO_APPLICATION_HREF } from "@/lib/demo-routes"

interface SellerDashboardProps {
  stats?: {
    products: number
    views: number
    messages: number
    revenue: number
    orders: number
  }
}

export function SellerDashboard({ stats = { products: 0, views: 0, messages: 0, revenue: 0, orders: 0 } }: SellerDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
            <p className="text-xs text-muted-foreground">Active listings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.views}</div>
            <p className="text-xs text-muted-foreground">Total views</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messages}</div>
            <p className="text-xs text-muted-foreground">Unread inquiries</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders}</div>
            <p className="text-xs text-muted-foreground">Active orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your seller account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/marketplace/my-products/new">
                <Plus className="h-6 w-6 mb-2" />
                <span className="font-semibold">Add Product</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Create new listing
                </span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/marketplace/my-products">
                <Package className="h-6 w-6 mb-2" />
                <span className="font-semibold">My Products</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Manage listings
                </span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href={WEEKLY_DEMO_APPLICATION_HREF}>
                <Sparkles className="h-6 w-6 mb-2" />
                <span className="font-semibold">Weekly demo</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Apply to host (curated)
                </span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/messages">
                <MessageSquare className="h-6 w-6 mb-2" />
                <span className="font-semibold">Messages</span>
                <span className="text-xs text-muted-foreground mt-1">
                  View inquiries
                </span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/marketplace/vendor/setup">
                <Building2 className="h-6 w-6 mb-2" />
                <span className="font-semibold">Vendor Profile</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Setup your profile
                </span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">My Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Product Listings</CardTitle>
                <CardDescription>Manage your product catalog</CardDescription>
              </div>
              <Button asChild>
                <Link href="/marketplace/my-products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {stats.products === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No products yet</p>
                  <Button asChild>
                    <Link href="/marketplace/my-products/new">Create Your First Product</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-muted-foreground">You have {stats.products} active products</p>
                  <Button asChild variant="outline">
                    <Link href="/marketplace/my-products">Manage Products</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Insights</CardTitle>
              <CardDescription>Track your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Views</span>
                    <span className="text-2xl font-bold">{stats.views}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Orders</span>
                    <span className="text-2xl font-bold">{stats.orders}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Unread Messages</span>
                    <span className="text-2xl font-bold">{stats.messages}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Products Listed</span>
                    <span className="text-2xl font-bold">{stats.products}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="promotions" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Weekly demonstrations</CardTitle>
                <CardDescription>Curated programme — apply first, then schedule after approval</CardDescription>
              </div>
              <Button asChild>
                <Link href={WEEKLY_DEMO_APPLICATION_HREF}>
                  <Plus className="h-4 w-4 mr-2" />
                  Apply to host
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Host a scheduled weekly spotlight session — start with a demonstration application.
                </p>
                <Button asChild>
                  <Link href={WEEKLY_DEMO_APPLICATION_HREF}>Start application</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
