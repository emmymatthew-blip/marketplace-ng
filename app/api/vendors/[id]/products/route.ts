import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vendorId = params.id

    if (!vendorId) {
      return NextResponse.json({ error: "Vendor ID is required" }, { status: 400 })
    }

    // Fetch products for the vendor
    const products = await query(
      `SELECT id, title, description, "categoryId", images, "contactInfo", "createdAt", "updatedAt"
       FROM "Product" 
       WHERE "ownerId" = ?
       ORDER BY "createdAt" DESC`,
      [vendorId],
    )

    // Parse the images JSON string to an array
    const formattedProducts = products.map((product: any) => ({
      ...product,
      images: typeof product.images === "string" ? JSON.parse(product.images) : product.images,
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error("Error fetching vendor products:", error)
    return NextResponse.json(
      { error: "Failed to fetch vendor products. Please try again later." },
      { status: 500 }
    )
  }
}
