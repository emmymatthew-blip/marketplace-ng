"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { 
  ShoppingCart, 
  Heart, 
  Package, 
  Search, 
  TrendingUp,
  Eye,
  MessageSquare,
  Bookmark
} from "lucide-react"

interface BuyerDashboardProps {
  stats?: {
    bookmarks: number
    orders: number
    messages: number
    viewedProducts: number
  }
}

export function BuyerDashboard({ stats = { bookmarks: 0, orders: 0, messages: 0, viewedProducts: 0 } }: BuyerDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bookmarks}</div>
            <p className="text-xs text-muted-foreground">Saved products</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders}</div>
            <p className="text-xs text-muted-foreground">Active orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messages}</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viewed</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.viewedProducts}</div>
            <p className="text-xs text-muted-foreground">Products viewed</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with these actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/marketplace">
                <Search className="h-6 w-6 mb-2" />
                <span className="font-semibold">Browse Marketplace</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Find products and services
                </span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/bookmarks">
                <Heart className="h-6 w-6 mb-2" />
                <span className="font-semibold">My Bookmarks</span>
                <span className="text-xs text-muted-foreground mt-1">
                  View saved items
                </span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/messages">
                <MessageSquare className="h-6 w-6 mb-2" />
                <span className="font-semibold">Messages</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Contact sellers
                </span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="bookmarks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookmarks" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Products</CardTitle>
              <CardDescription>Products you've bookmarked</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.bookmarks === 0 ? (
                <div className="text-center py-8">
                  <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No bookmarks yet</p>
                  <Button asChild>
                    <Link href="/marketplace">Browse Marketplace</Link>
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">Bookmarked products will appear here</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
              <CardDescription>Track your purchases and agreements</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.orders === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Button asChild>
                    <Link href="/agreements">View Agreements</Link>
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">Your orders will appear here</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recently Viewed</CardTitle>
              <CardDescription>Products you've recently browsed</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.viewedProducts === 0 ? (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No recent views</p>
                  <Button asChild>
                    <Link href="/marketplace">Start Browsing</Link>
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">Recently viewed products will appear here</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
