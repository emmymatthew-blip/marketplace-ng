"use client"

import { useState } from "react"
import { Calendar, MapPin, User, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useSession } from "next-auth/react"
import { RichText } from "@/components/shared/rich-text"

interface Product {
  id: string
  title: string
  description: string
  category: string
  specifications?: Record<string, string>
  contactInfo?: string
  images: string[]
  createdAt: string
  location?: string
  condition?: string
  brand?: string
  videoUrl?: string
  owner?: {
    id: string
    name: string
    companyName?: string
    isVerified?: boolean
  }
}

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [activeTab, setActiveTab] = useState("description")
  const { data: session } = useSession()

  const isOwnProduct = product.owner?.id && session?.user?.id && product.owner.id === (session.user as any).id

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }


  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Badge variant="secondary" className="px-3 py-1 text-sm">
            {product.category}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          {product.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" aria-hidden />
              <span>
                <span className="font-medium text-foreground">Equipment location: </span>
                {product.location}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Listed on {formatDate(product.createdAt)}</span>
          </div>
          {product.owner && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>{product.owner.name}</span>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          <RichText html={product.description} />
        </TabsContent>

        <TabsContent value="specifications" className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
            <div className="grid gap-4">
              {product.specifications ? (
                Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <span className="font-medium">{key}:</span>
                      <span className="text-gray-600 ml-2">{value}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No specifications provided</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.contactInfo || "Please contact the company directly for inquiries about this product."}
            </p>
            {!isOwnProduct && (
              <p className="text-sm text-muted-foreground">
                Use the <strong>Contact Company</strong> button in the sidebar to message the company or create an agreement.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

    </div>
  )
}
