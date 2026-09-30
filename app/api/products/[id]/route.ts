import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"
import { deleteImageKitImages } from "@/lib/imagekit-utils"

// Define validation schema
const productUpdateSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).optional(),
  categoryId: z.string().optional(),
  images: z.array(z.string()).min(1, { message: "At least one image is required" }).optional(),
  contactInfo: z.string().optional(),
  condition: z.enum(["NEW", "USED"]).optional(),
  brand: z.string().optional(),
  location: z
    .string()
    .trim()
    .min(2, { message: "Equipment location must be specified (at least 2 characters)" })
    .max(200, { message: "Equipment location is too long" })
    .optional(),
  specifications: z.record(z.string()).optional(),
  videoUrl: z.union([
    z.string().url(),
    z.literal(""),
    z.null()
  ]).optional().transform(val => val === null || val === undefined ? "" : val),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = `
      SELECT p.*, u.name as "ownerName", u.role as "ownerRole", u."isVerified" as "ownerIsVerified", 
      u."companyName" as "ownerCompanyName", u.location as "ownerLocation",
      pc.name as "categoryName", pc.slug as "categorySlug"
      FROM "Product" p
      JOIN "User" u ON p."ownerId" = u.id
      LEFT JOIN "ProductCategory" pc ON p."categoryId" = pc.id
      WHERE p.id = ?
    `
    const products = await query(sql, [params.id])

    if (!products || (products as any[]).length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const product = (products as any[])[0]

    // Parse images
    let images = []
    try {
      images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
    } catch (e) {
      console.error('Error parsing images:', e)
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
    } catch (e) {
      console.error('Error parsing specifications:', e)
      specifications = null
    }

    // Format the product to match the expected structure
    const formattedProduct = {
      id: product.id,
      title: product.title,
      description: product.description,
      categoryId: product.categoryId,
      category: product.categoryName ? {
        name: product.categoryName,
        slug: product.categorySlug
      } : null,
      images: images,
      contactInfo: product.contactInfo,
      condition: product.condition || "NEW",
      brand: product.brand || null,
      location: product.location || null,
      specifications: specifications,
      videoUrl: product.videoUrl || null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      owner: {
        id: product.ownerId,
        name: product.ownerName,
        companyName: product.ownerCompanyName,
        location: product.ownerLocation,
        isVerified: Boolean(product.ownerIsVerified),
        role: product.ownerRole,
      },
    }

    return NextResponse.json(formattedProduct)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if product exists
    const existingProducts = await query('SELECT * FROM "Product" WHERE id = ?', [params.id])

    if (!existingProducts || (existingProducts as any[]).length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const product = (existingProducts as any[])[0]

    // Check if user is the owner of the product
    if (product.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "You are not authorized to update this product" }, { status: 403 })
    }

    const body = await req.json()
    let parsedData
    try {
      parsedData = productUpdateSchema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ 
          error: "Validation error", 
          details: error.errors 
        }, { status: 400 })
      }
      throw error
    }
    const { title, description, categoryId, images, contactInfo, condition, brand, location, specifications, videoUrl } = parsedData

    // If images are being updated, check for removed images and delete them from ImageKit
    if (images !== undefined) {
      try {
        // Parse existing images from database
        let existingImages: string[] = []
        try {
          if (product.images) {
            existingImages = typeof product.images === 'string' 
              ? JSON.parse(product.images) 
              : product.images
          }
        } catch (e) {
          console.error('Error parsing existing images:', e)
        }

        // Find images that were removed
        // Normalize URLs for comparison (remove query params, trailing slashes)
        const normalizeUrl = (url: string) => {
          try {
            const urlObj = new URL(url)
            // Return base URL without query params or hash
            return urlObj.origin + urlObj.pathname
          } catch {
            // If URL parsing fails, return as-is
            return url
          }
        }
        
        const normalizedExisting = existingImages.map(normalizeUrl)
        const normalizedNew = images.map(normalizeUrl)
        
        // Find removed images by comparing normalized URLs
        const removedImages = existingImages.filter((img: string, index: number) => {
          const normalized = normalizeUrl(img)
          return !normalizedNew.includes(normalized)
        })
        
        if (removedImages.length > 0) {
          console.log("Removed images detected, deleting from ImageKit:", removedImages)
          const deleteResult = await deleteImageKitImages(removedImages)
          console.log("ImageKit deletion result:", {
            deleted: deleteResult.deleted.length,
            errors: deleteResult.errors.length
          })
          // Log errors but don't fail the update if deletion fails
          if (deleteResult.errors.length > 0) {
            console.warn("Some images could not be deleted from ImageKit:", deleteResult.errors)
          }
        }
      } catch (error) {
        // Log error but don't fail the update
        console.error("Error deleting removed images from ImageKit:", error)
      }
    }

    // Build the update query dynamically based on provided fields
    let updateSql = 'UPDATE "Product" SET "updatedAt" = NOW()'
    const updateParams: any[] = []

    if (title !== undefined) {
      updateSql += ", title = ?"
      updateParams.push(title)
    }

    if (description !== undefined) {
      updateSql += ", description = ?"
      updateParams.push(description)
    }

    if (categoryId !== undefined) {
      updateSql += ', "categoryId" = ?'
      updateParams.push(categoryId)
    }

    if (images !== undefined) {
      updateSql += ", images = ?"
      updateParams.push(JSON.stringify(images))
    }

    if (contactInfo !== undefined) {
      updateSql += ', "contactInfo" = ?'
      updateParams.push(contactInfo)
    }

    if (condition !== undefined) {
      updateSql += ", condition = ?"
      updateParams.push(condition)
    }

    if (brand !== undefined) {
      updateSql += ", brand = ?"
      updateParams.push(brand)
    }

    if (location !== undefined) {
      updateSql += ", location = ?"
      updateParams.push(location)
    }

    if (specifications !== undefined) {
      updateSql += ", specifications = ?"
      updateParams.push(specifications ? JSON.stringify(specifications) : null)
    }

    if (videoUrl !== undefined) {
      updateSql += ', "videoUrl" = ?'
      // Convert empty string to null
      updateParams.push(videoUrl && videoUrl.trim() ? videoUrl.trim() : null)
    }

    updateSql += " WHERE id = ?"
    updateParams.push(params.id)

    try {
      await query(updateSql, updateParams)
    } catch (error: any) {
      console.error("Error updating product in database:", error)
      return NextResponse.json({ 
        error: "Failed to update product in database",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 })
    }

    // Fetch the updated product with category info
    const updatedProducts = await query(
      `SELECT p.*, pc.name as "categoryName", pc.slug as "categorySlug"
       FROM "Product" p 
       LEFT JOIN "ProductCategory" pc ON p."categoryId" = pc.id 
       WHERE p.id = ?`,
      [params.id]
    )
    const updatedProduct = (updatedProducts as any[])[0]

    // Parse JSON fields
    let parsedImages = []
    try {
      parsedImages = typeof updatedProduct.images === 'string' ? JSON.parse(updatedProduct.images) : updatedProduct.images
    } catch (e) {
      console.error('Error parsing images:', e)
    }

    let parsedSpecs = null
    try {
      if (updatedProduct.specifications) {
        parsedSpecs = typeof updatedProduct.specifications === 'string' 
          ? JSON.parse(updatedProduct.specifications) 
          : updatedProduct.specifications
      }
    } catch (e) {
      console.error('Error parsing specifications:', e)
    }

    return NextResponse.json({
      id: updatedProduct.id,
      title: updatedProduct.title,
      description: updatedProduct.description,
      categoryId: updatedProduct.categoryId,
      category: updatedProduct.categoryName ? {
        name: updatedProduct.categoryName,
        slug: updatedProduct.categorySlug
      } : null,
      images: parsedImages,
      contactInfo: updatedProduct.contactInfo,
      condition: updatedProduct.condition || "NEW",
      brand: updatedProduct.brand,
      location: updatedProduct.location,
      specifications: parsedSpecs,
      videoUrl: updatedProduct.videoUrl,
      ownerId: updatedProduct.ownerId,
      createdAt: updatedProduct.createdAt,
      updatedAt: updatedProduct.updatedAt,
    })
  } catch (error: any) {
    console.error("Error updating product:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to update product",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if product exists
    const existingProducts = await query('SELECT * FROM "Product" WHERE id = ?', [params.id])

    if (!existingProducts || (existingProducts as any[]).length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const product = (existingProducts as any[])[0]

    // Check if user is the owner of the product or an admin
    if (product.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "You are not authorized to delete this product" }, { status: 403 })
    }

    // Delete all product images from ImageKit before deleting the product
    try {
      let productImages: string[] = []
      try {
        if (product.images) {
          productImages = typeof product.images === 'string' 
            ? JSON.parse(product.images) 
            : product.images
        }
      } catch (e) {
        console.error('Error parsing product images for deletion:', e)
      }

      if (productImages.length > 0) {
        console.log("Deleting product images from ImageKit:", productImages)
        const deleteResult = await deleteImageKitImages(productImages)
        console.log("ImageKit deletion result:", {
          deleted: deleteResult.deleted.length,
          errors: deleteResult.errors.length
        })
        // Log errors but don't fail the deletion if image deletion fails
        if (deleteResult.errors.length > 0) {
          console.warn("Some images could not be deleted from ImageKit:", deleteResult.errors)
        }
      }
    } catch (error) {
      // Log error but don't fail the product deletion
      console.error("Error deleting product images from ImageKit:", error)
    }

    await query('DELETE FROM "Product" WHERE id = ?', [params.id])

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
