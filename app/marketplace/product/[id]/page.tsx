import type { Metadata } from "next"
import React from "react"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { ProductDetail } from "@/components/marketplace/product-detail"
import { ProductImageGallery } from "@/components/marketplace/product-image-gallery"
import { ProductVendorCard } from "@/components/marketplace/product-vendor-card"
import { ProductVideoSection } from "@/components/marketplace/product-video-section"
import { ListingPageHeader } from "@/components/marketplace/listing-page-header"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { ProductChatButton } from "@/components/marketplace/product-chat-button"
import { TrackView } from "@/components/analytics/track-view"
import { PLACEHOLDER_IMAGE, stripHtml } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Tag, Calendar, Shield, FileText } from "lucide-react"
import { authOptions } from "@/lib/auth"

interface ProductPageProps {
  params: {
    id: string
  }
}

interface RelatedProduct {
  id: string
  title: string
  category: string
  images: string[]
  owner: {
    id: string
    name: string
    isVerified?: boolean
  }
}

// Mock data for development
const mockProduct = {
  id: "1",
  title: "Used GTO 52 Color GTO Printing Machine",
  description: "High-speed 4-color offset printing machine with a max printing speed of 13000r/h. Suitable for high-quality CMYK printing jobs like brochures, magazines, and posters. Supports a wide range of paper thicknesses from 0.03-0.6mm. Maximum sheet size of 520/560/740mm and precise plate dimensions of 510×410×0.15mm. Automatic operation enhances efficiency.",
  category: "Offset Printers",
  specifications: {
    "Brand Name": "Hans gronhi",
    "Condition": "Used",
    "Color & Page": "Multicolor",
    "Warranty": "1 Year",
    "Usage": "Bill Printer, Card Printer, Label Printer, Paper Printer",
    "Plate Type": "Flatbed Printer",
    "Type": "Offset Printer",
    "Voltage": "380V",
    "Place of Origin": "Liaoning, China",
    "Dimensions (L×W×H)": "4330×1820×1720mm",
    "Weight": "9000 KG",
    "Color Unit Number": "4 Units",
    "Max Printing Speed": "13000r/h",
    "Max Sheet Size": "520/560/740mm",
    "Paper Thickness": "0.03-0.6mm",
    "Application": "brochures, cardboard, advertising card",
    "Min Sheet Size": "100×148mm",
    "Max Printing Area": "510×360mm",
    "Plate Size": "510×410×0.15mm",
    "Feed Pile Height": "900mm",
    "Gross Power": "12Kw"
  },
  contactInfo: "For inquiries about this product, please use the contact button below or call us at +234 801 234 5678",
  images: [
    "/printer/H09789ceced794a57b385e3eeaf9af2cfW.jpg_960x960q80.jpeg",
    "/printer/H24cf7d1c4cc549aaad4e2ac1bdcfb2f6c.jpg_960x960q80.jpeg",
    "/printer/H319c504455484019822aa8d619db24e3I.jpg_960x960q80.jpeg",
    "/printer/H791fd3324c1048c59de39dd48df9e0d9A.jpg_960x960q80.jpeg",
    "/printer/H86e497e1e3db45f98847fb01bd7c1f9e9.jpg_960x960q80.jpeg",
    "/printer/H8c3ff0af66a948eaa4694ef6f65b1e17U.jpg_960x960q80.jpeg",
    "/printer/H918bafd52a5041c98631010d9b2906a1q.jpg_960x960q80.jpeg",
    "/printer/Hb7e97600d9374e9fb5aeaf63c2223292X.jpg_960x960q80.jpeg",
    "/printer/Hc1782d3d7d0e496a92c48d950ba84c09n.jpg_960x960q80.jpeg",
    "/printer/Hc3395a7bdcc04c129641524d1f203813o.jpg_960x960q80.jpeg"
  ],
  createdAt: "2024-03-15T10:00:00Z",
  location: "Liaoning, China",
  owner: {
    id: "user1",
    name: "Weifang Swan Machinery Co., Ltd.",
    companyName: "Weifang Swan Machinery Co., Ltd.",
    image: "/images/Nig-Print-Logo.png",
    bio: "Leading provider of high-quality printing machinery and equipment. Specializing in offset printing machines, with 9 years of experience. Mainly exports to Guatemala, Saudi Arabia, and Colombia, with high customer satisfaction and a positive review rate of 94.4%.",
    isVerified: true,
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
  }
}

// Mock related products
const mockVendorProducts: RelatedProduct[] = [
  {
    id: "2",
    title: "High Speed 4 Color Offset Printing Machines",
    category: "Offset Printers",
    images: ["/printer/HTB1Ef22ayfrK1RjSspbq6A4pFXat.jpg_350x350.jpeg"],
    owner: {
      id: "user1",
      name: "Weifang Swan Machinery Co., Ltd.",
      isVerified: true
    }
  },
  {
    id: "3",
    title: "Germany Speed Master SM GTO Offset Printer",
    category: "Offset Printers",
    images: ["/printer/HTB1H7bQSXXXXXbEXVXXq6xXFXXX9.webp"],
    owner: {
      id: "user1",
      name: "Weifang Swan Machinery Co., Ltd.",
      isVerified: true
    }
  },
  {
    id: "4",
    title: "Automatic Second Hand Sheet-fed Offset Printing",
    category: "Offset Printers",
    images: ["/printer/HTB1KRUaSXXXXXazXpXXq6xXFXXXg.webp"],
    owner: {
      id: "user1",
      name: "Weifang Swan Machinery Co., Ltd.",
      isVerified: true
    }
  },
  {
    id: "5",
    title: "USED GTO 52 SM Speed Master 4 Color Offset",
    category: "Offset Printers",
    images: ["/printer/HTB1pM54bgoQMeJjy1Xaq6ASsFXa0.webp"],
    owner: {
      id: "user1",
      name: "Weifang Swan Machinery Co., Ltd.",
      isVerified: true
    }
  }
]

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.id)
  if (!product) {
    return { title: "Product Not Found | PrintMarket NG" }
  }
  const plainDescription = stripHtml(product.description)
  return {
    title: `${product.title} | PrintMarket NG`,
    description: plainDescription ? plainDescription.substring(0, 160) : undefined,
  }
}

async function getProduct(id: string) {
  try {
    const { query } = await import("@/lib/db")
    
    const sql = `
      SELECT p.*, u.name as "ownerName", u.role as "ownerRole", u."isVerified" as "ownerIsVerified", 
      u."companyName" as "ownerCompanyName", u.location as "ownerLocation", u.image as "ownerImage",
      pc.name as "categoryName", pc.slug as "categorySlug"
      FROM "Product" p
      JOIN "User" u ON p."ownerId" = u.id
      LEFT JOIN "ProductCategory" pc ON p."categoryId" = pc.id
      WHERE p.id = ?
    `
    const products = await query(sql, [id])

    if (!products || (products as any[]).length === 0) {
      return null
    }

    const product = (products as any[])[0]

    // Parse images
    let images = []
    try {
      images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
    } catch {
      images = []
    }

    // Parse specifications
    let specifications = null
    try {
      if (product.specifications) {
        specifications = typeof product.specifications === 'string' 
          ? JSON.parse(product.specifications) 
          : product.specifications
      }
    } catch {
      specifications = null
    }

    const videoUrl = product.videoUrl && product.videoUrl.trim() ? product.videoUrl.trim() : null

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      category: product.categoryName || "Uncategorized",
      specifications: specifications || {},
      contactInfo: product.contactInfo,
      images: images,
      location: product.location,
      condition: product.condition,
      brand: product.brand,
      videoUrl: videoUrl,
      createdAt: product.createdAt,
      owner: {
        id: product.ownerId,
        name: product.ownerName,
        companyName: product.ownerCompanyName,
        isVerified: Boolean(product.ownerIsVerified),
        image: product.ownerImage || null,
      },
    }
  } catch {
    return null
  }
}

async function getVendorOtherProducts(productId: string, vendorId: string) {
  // Always return mock data for now
  return mockVendorProducts.filter(p => 
    p.owner.id === vendorId && p.id !== productId
  ).slice(0, 6) // Limit to 6 products
}

export default async function ProductPage({ params }: ProductPageProps) {
  const session = await getServerSession(authOptions)
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  const vendorOtherProducts = await getVendorOtherProducts(params.id, product.owner.id)

  const dateListed = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : null
  const conditionLabel = product.condition === "NEW" ? "New Machines" : product.condition === "USED" ? "Used Machines" : product.condition || null
  const isOwner = session?.user?.id === product.owner.id

  return (
    <>
      <TrackView eventType="product_detail_view" productId={product.id} />
      <MainNav />
      <div className="min-h-screen relative bg-muted/30 pt-16">
        {/* Listing header: breadcrumb, title, company, meta, quick actions */}
        <ListingPageHeader product={product} />

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left column: gallery, quick facts, detail, video, more listings */}
            <div className="flex-1 min-w-0 lg:max-w-[66.666%] space-y-6">
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <ProductImageGallery images={product.images} />
              </div>

              {/* Quick facts strip */}
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  {product.category && (
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Tag className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="font-medium text-foreground">Category:</span> {product.category}
                    </span>
                  )}
                  {conditionLabel && (
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="font-medium text-foreground">Condition:</span> {conditionLabel}
                    </span>
                  )}
                  {product.brand && (
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">Brand:</span> {product.brand}
                    </span>
                  )}
                  {product.location && (
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="font-medium text-foreground">Equipment location:</span> {product.location}
                    </span>
                  )}
                  {dateListed && (
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                      Listed {dateListed}
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <ProductDetail product={product} />
              </div>

              {product.videoUrl && product.videoUrl.trim() && (
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <ProductVideoSection
                    productId={product.id}
                    productName={product.title}
                    vendorName={product.owner.name || product.owner.companyName}
                    vendorId={product.owner.id}
                    videoUrl={product.videoUrl}
                    videoTitle="Product Demonstration"
                    videoDescription="Watch this video to see our product in action and learn about its features, specifications, and capabilities."
                    isEditable={false}
                  />
                </div>
              )}

              {/* More listings from this company */}
              {vendorOtherProducts.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">More Listings from this Company</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">Explore other listings from the same company</p>
                    </div>
                    <Link
                      href={`/marketplace/vendor/${product.owner.id}`}
                      className="text-sm font-medium text-primary hover:text-primary/80 shrink-0"
                    >
                      View company
                    </Link>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 scrollbar-thin">
                    {vendorOtherProducts.map((relatedProduct: RelatedProduct) => (
                      <Link
                        key={relatedProduct.id}
                        href={`/marketplace/product/${relatedProduct.id}`}
                        className="flex-shrink-0 w-[200px] group rounded-lg border border-border bg-background overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-200"
                      >
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          <Image
                            src={relatedProduct.images?.[0] ?? PLACEHOLDER_IMAGE}
                            alt={relatedProduct.title}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                            sizes="200px"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {relatedProduct.title}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {relatedProduct.category && (
                              <span className="text-xs text-muted-foreground">{relatedProduct.category}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column: trust + actions sidebar */}
            <div className="w-full lg:w-[340px] lg:flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                <ProductVendorCard vendor={product.owner} productId={params.id} productTitle={product.title} />

                {/* Listing summary */}
                <Card className="rounded-xl border border-border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">Listing summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    {product.category && <p><span className="font-medium text-foreground">Category:</span> {product.category}</p>}
                    {conditionLabel && <p><span className="font-medium text-foreground">Condition:</span> {conditionLabel}</p>}
                    {product.brand && <p><span className="font-medium text-foreground">Brand:</span> {product.brand}</p>}
                    {product.location && (
                      <p>
                        <span className="font-medium text-foreground">Equipment location:</span> {product.location}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Agreement / platform mediation guidance */}
                <Card className="rounded-xl border border-border shadow-sm bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary shrink-0" aria-hidden />
                      {isOwner ? "Owner controls" : "Platform protection"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {isOwner ? (
                      <>
                        <p>
                          Manage this listing from your workspace, respond to incoming conversations, and review performance from analytics.
                        </p>
                        <div className="mt-3 space-y-2">
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href={`/marketplace/my-products/${product.id}/edit`}>
                              <FileText className="h-4 w-4 mr-1.5 shrink-0" aria-hidden />
                              Edit listing
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href="/messages">View messages</Link>
                          </Button>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href={`/dashboard/analytics?productId=${product.id}`}>View analytics</Link>
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>
                          You can contact the company directly at any time. If you want PrintMarket NG to help mediate this transaction in case of issues, create an agreement before proceeding.
                        </p>
                        <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                          <Link href={`/agreements/new?recipient=${product.owner.id}&product=${product.id}`}>
                            <FileText className="h-4 w-4 mr-1.5 shrink-0" aria-hidden />
                            Create agreement
                          </Link>
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <ProductChatButton
        sellerId={product.owner.id}
        sellerName={product.owner.name || product.owner.companyName || "Vendor"}
        sellerImage={product.owner.image}
        productId={product.id}
        productTitle={product.title}
        companyName={product.owner.companyName}
      />
    </>
  )
}
