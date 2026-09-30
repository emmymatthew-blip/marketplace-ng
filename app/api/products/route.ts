import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

// Define validation schema
const productSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  categoryId: z.string(),
  images: z.array(z.string()).min(1, { message: "At least one image is required" }),
  contactInfo: z.string().optional(),
  condition: z.enum(["NEW", "USED"]).optional(),
  brand: z.string().optional(),
  location: z
    .string()
    .trim()
    .min(2, { message: "Equipment location must be specified (at least 2 characters)" })
    .max(200, { message: "Equipment location is too long" }),
  specifications: z.record(z.string()).optional(),
  videoUrl: z.union([
    z.string().url(),
    z.literal(""),
    z.null()
  ]).optional().transform(val => val === null || val === undefined ? "" : val),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId")
    const location = searchParams.get("location")
    const ownerId = searchParams.get("ownerId")
    const condition = searchParams.get("condition") // NEW or USED
    const brand = searchParams.get("brand")
    const search = searchParams.get("search") // Search query
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "24")
    const offset = (page - 1) * limit

    let sql = `
      SELECT p.*, u.name as "ownerName", u.role as "ownerRole", u."isVerified" as "ownerIsVerified", 
      u."companyName" as "ownerCompanyName", u.location as "ownerLocation",
      pc.name as "categoryName", pc.slug as "categorySlug"
      FROM "Product" p
      JOIN "User" u ON p."ownerId" = u.id
      LEFT JOIN "ProductCategory" pc ON p."categoryId" = pc.id
      WHERE 1=1
    `
    const params: any[] = []

    if (categoryId) {
      // Check if this is a main category and get all subcategory IDs
      const categoryQuery = await query(`
        WITH RECURSIVE "CategoryTree" AS (
          SELECT id, "parentId", 0 as level
          FROM "ProductCategory"
          WHERE id = ?
          
          UNION ALL
          
          SELECT pc.id, pc."parentId", ct.level + 1
          FROM "ProductCategory" pc
          INNER JOIN "CategoryTree" ct ON pc."parentId" = ct.id
        )
        SELECT id FROM "CategoryTree"
      `, [categoryId])
      
      const categoryIds = categoryQuery.map((row: any) => row.id)
      if (categoryIds.length > 0) {
        const placeholders = categoryIds.map(() => '?').join(',')
        sql += ` AND p."categoryId" IN (${placeholders})`
        params.push(...categoryIds)
      } else {
        // If no categories found, return empty result
        sql += ` AND 1=0`
      }
    }

    if (ownerId) {
      sql += ` AND p."ownerId" = ?`
      params.push(ownerId)
    }

    if (location) {
      sql += ` AND u.location LIKE ?`
      params.push(`%${location}%`)
    }

    if (condition && (condition === "NEW" || condition === "USED")) {
      sql += ` AND p.condition = ?`
      params.push(condition)
    }

    if (brand) {
      sql += ` AND p.brand = ?`
      params.push(brand)
    }

    if (search) {
      sql += ` AND (p.title LIKE ? OR p.description LIKE ?)`
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern)
    }

    // Get total count for pagination (before adding LIMIT/OFFSET)
    // Build count query by replacing SELECT clause with COUNT
    // We need to preserve the JOINs and WHERE clause but count distinct products
    let countSql = sql.replace(
      /SELECT[\s\S]*?FROM "Product" p/,
      'SELECT COUNT(DISTINCT p.id) as total FROM "Product" p'
    )
    // Remove any ORDER BY, LIMIT, or OFFSET clauses that might have been added
    countSql = countSql.replace(/\s+ORDER BY.*$/i, '')
    countSql = countSql.replace(/\s+LIMIT\s+\?/i, '')
    countSql = countSql.replace(/\s+OFFSET\s+\?/i, '')
    
    // Execute count query with the same params (but without limit/offset params)
    const countParams = [...params] // Copy params array
    const countResult = await query(countSql, countParams)
    const total = parseInt(String(countResult[0]?.total || 0)) || 0
    const totalPages = Math.ceil(total / limit)

    // Add ordering and pagination
    sql += ` ORDER BY p."createdAt" DESC LIMIT ? OFFSET ?`
    params.push(limit, offset)

    const products = await query(sql, params)

    // Format the products to match the expected structure
    const formattedProducts = products.map((product: any) => {
      let images = []
      try {
        if (product.images) {
          images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
        }
      } catch (e) {
        console.error('Error parsing images for product:', product.id, e)
        images = []
      }
      
      // Parse specifications if present
      let specifications = null
      try {
        if (product.specifications) {
          specifications = typeof product.specifications === 'string' 
            ? JSON.parse(product.specifications) 
            : product.specifications
        }
      } catch (e) {
        console.error('Error parsing specifications for product:', product.id, e)
        specifications = null
      }

      return {
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
    })

    return NextResponse.json({ 
      success: true, 
      data: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error: any) {
    console.error("Error fetching products:", error)
    console.error("Error details:", error.message, error.stack)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch products",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only sellers can create products (use isSeller helper)
    const { isSeller } = await import("@/lib/user-roles")
    if (!isSeller(session.user.role)) {
      return NextResponse.json({ error: "Only sellers can create products" }, { status: 403 })
    }

    const body = await req.json()
    console.log("Received product creation request:", {
      title: body.title,
      imagesCount: body.images?.length || 0,
      images: body.images
    })

    const { title, description, categoryId, images, contactInfo, condition, brand, location, specifications, videoUrl } = productSchema.parse(body)

    console.log("After schema validation:", {
      imagesCount: images?.length || 0,
      images: images,
      videoUrl: videoUrl || "No video URL"
    })

    // Validate images - ensure no blob URLs are being saved
    const validImages = Array.isArray(images) 
      ? images.filter((img: string) => {
          if (!img || typeof img !== 'string') {
            console.warn("Invalid image entry (not a string):", img)
            return false
          }
          // Reject blob URLs - these are temporary and shouldn't be saved
          if (img.startsWith('blob:')) {
            console.error("Rejected blob URL in product creation:", img)
            return false
          }
          // Only accept valid HTTP/HTTPS URLs (ImageKit URLs)
          const isValid = img.startsWith('http://') || img.startsWith('https://')
          if (!isValid) {
            console.warn("Rejected invalid image URL:", img)
          }
          return isValid
        })
      : []

    console.log("Valid images after filtering:", {
      count: validImages.length,
      images: validImages
    })

    if (validImages.length === 0) {
      console.error("No valid images found. Original images:", images)
      return NextResponse.json({ 
        error: "Invalid images", 
        message: "At least one valid image URL is required. Blob URLs cannot be saved.",
        receivedImages: images
      }, { status: 400 })
    }

    // Store specifications as JSON
    const specsJson = specifications ? JSON.stringify(specifications) : null

    // Generate a unique ID (using cuid-like format or UUID)
    const generateId = () => {
      return 'cm' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
    }
    const productId = generateId()

    // Try to insert with all columns, fallback if some columns don't exist
    const imagesJson = JSON.stringify(validImages)
    console.log("Saving product to database:", {
      productId,
      imagesJson,
      imagesCount: validImages.length
    })

    try {
      const insertResult = await query(
        `INSERT INTO "Product" (id, title, description, "categoryId", images, "contactInfo", "ownerId", condition, brand, location, specifications, "videoUrl", "createdAt", "updatedAt") 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [productId, title, description, categoryId, imagesJson, contactInfo || null, session.user.id, condition || "NEW", brand || null, location || null, specsJson, videoUrl || null],
      )
      console.log("Product INSERT query executed successfully with videoUrl:", videoUrl || "null")
      
      // Verify the product was saved correctly by fetching it back
      const verifyProduct = await query('SELECT id, images FROM "Product" WHERE id = ?', [productId])
      if (verifyProduct && (verifyProduct as any[]).length > 0) {
        const savedProduct = (verifyProduct as any[])[0]
        console.log("Verified saved product:", {
          productId: savedProduct.id,
          savedImages: savedProduct.images
        })
        try {
          const parsedImages = JSON.parse(savedProduct.images)
          console.log("Parsed saved images from database:", parsedImages)
          if (parsedImages.length !== validImages.length) {
            console.error("Image count mismatch! Expected:", validImages.length, "Got:", parsedImages.length)
          }
        } catch (e) {
          console.error("Error parsing saved images:", e, "Raw images:", savedProduct.images)
        }
      } else {
        console.error("Failed to verify product was saved - product not found after insert")
      }
    } catch (error: any) {
      // If some columns don't exist, try without them
      if (error.message?.includes("specifications") || error.message?.includes("videoUrl") || error.message?.includes("column") || error.message?.includes("does not exist")) {
        try {
          await query(
            `INSERT INTO "Product" (id, title, description, "categoryId", images, "contactInfo", "ownerId", condition, brand, location, "videoUrl", "createdAt", "updatedAt") 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [productId, title, description, categoryId, JSON.stringify(validImages), contactInfo || null, session.user.id, condition || "NEW", brand || null, location || null, videoUrl || null],
          )
        } catch (error2: any) {
          // Final fallback - insert without optional columns
          await query(
            `INSERT INTO "Product" (id, title, description, "categoryId", images, "contactInfo", "ownerId", condition, brand, "createdAt", "updatedAt") 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [productId, title, description, categoryId, JSON.stringify(validImages), contactInfo || null, session.user.id, condition || "NEW", brand || null],
          )
        }
      } else {
        throw error
      }
    }

    // Fetch the created product to return complete data
    const createdProduct = await query(
      `SELECT p.*, pc.name as "categoryName" 
       FROM "Product" p 
       LEFT JOIN "ProductCategory" pc ON p."categoryId" = pc.id 
       WHERE p.id = ?`,
      [productId]
    )

    const product = createdProduct && createdProduct.length > 0 
      ? {
          id: createdProduct[0].id,
          title: createdProduct[0].title,
          description: createdProduct[0].description,
          categoryId: createdProduct[0].categoryId,
          category: createdProduct[0].categoryName,
          images: validImages, // Use the validated images array
          contactInfo: createdProduct[0].contactInfo,
          condition: createdProduct[0].condition,
          brand: createdProduct[0].brand,
          location: createdProduct[0].location,
          specifications: createdProduct[0].specifications ? JSON.parse(createdProduct[0].specifications) : null,
          videoUrl: createdProduct[0].videoUrl || null,
          ownerId: createdProduct[0].ownerId,
          createdAt: createdProduct[0].createdAt,
          updatedAt: createdProduct[0].updatedAt,
        }
      : {
          id: productId,
          title,
          description,
          categoryId,
          images: validImages,
          contactInfo,
          condition: condition || "NEW",
          brand,
          location,
          specifications,
          videoUrl: videoUrl || null,
          ownerId: session.user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
