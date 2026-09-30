import { getServerSession } from "next-auth/next"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

// GET - Fetch all categories with hierarchy
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get("includeInactive") === "true"
    const includeCounts = searchParams.get("includeCounts") === "true"

    let whereClause: any = {}
    if (!includeInactive) {
      whereClause.isActive = true
    }

    // Fetch all categories
    let categoriesSql = ''
    
    if (includeCounts) {
      // When including counts, we need GROUP BY
      categoriesSql = `
        SELECT 
          pc.id,
          pc.name,
          pc.slug,
          pc.description,
          pc.icon,
          pc."parentId",
          pc."isActive",
          pc."sortOrder",
          pc."createdAt",
          pc."updatedAt",
          COUNT(DISTINCT p.id) as "productCount"
        FROM "ProductCategory" pc
        LEFT JOIN "Product" p ON pc.id = p."categoryId"
        ${includeInactive ? 'WHERE 1=1' : 'WHERE pc."isActive" = true'}
        GROUP BY pc.id, pc.name, pc.slug, pc.description, pc.icon, pc."parentId", pc."isActive", pc."sortOrder", pc."createdAt", pc."updatedAt"
        ORDER BY pc."sortOrder" ASC, pc.name ASC
      `
    } else {
      // Simple query without counts
      categoriesSql = `
        SELECT 
          pc.id,
          pc.name,
          pc.slug,
          pc.description,
          pc.icon,
          pc."parentId",
          pc."isActive",
          pc."sortOrder",
          pc."createdAt",
          pc."updatedAt"
        FROM "ProductCategory" pc
        ${includeInactive ? 'WHERE 1=1' : 'WHERE pc."isActive" = true'}
        ORDER BY pc."sortOrder" ASC, pc.name ASC
      `
    }
    
    const categories = await query(categoriesSql, [])

    // If including counts, we need to calculate total counts including subcategories
    if (includeCounts) {
      // Get all category IDs with their descendants
      const categoryHierarchy = await query(`
        WITH RECURSIVE "CategoryTree" AS (
          SELECT id, "parentId", 0 as level
          FROM "ProductCategory"
          WHERE "parentId" IS NULL
          
          UNION ALL
          
          SELECT pc.id, pc."parentId", ct.level + 1
          FROM "ProductCategory" pc
          INNER JOIN "CategoryTree" ct ON pc."parentId" = ct.id
        )
        SELECT 
          ct.id as "categoryId",
          ct."parentId",
          ct.level,
          COUNT(p.id) as "directProductCount"
        FROM "CategoryTree" ct
        LEFT JOIN "Product" p ON ct.id = p."categoryId"
        GROUP BY ct.id, ct."parentId", ct.level
        ORDER BY ct.level, ct.id
      `, [])

      // Create a map of category IDs to their total counts (including descendants)
      const totalCountMap = new Map()
      
      // First, get direct counts for all categories
      categoryHierarchy.forEach((row: any) => {
        totalCountMap.set(row.categoryId, parseInt(row.directProductCount) || 0)
      })

      // Then, add descendant counts to parent categories
      categoryHierarchy.forEach((row: any) => {
        if (row.parentId || row["parentId"]) {
          const parentId = row.parentId || row["parentId"]
          const categoryId = row.categoryId || row["categoryId"]
          const parentCount = totalCountMap.get(parentId) || 0
          const childCount = totalCountMap.get(categoryId) || 0
          totalCountMap.set(parentId, parentCount + childCount)
        }
      })

      // Update the categories with total counts
      categories.forEach((category: any) => {
        category.productCount = totalCountMap.get(category.id) || 0
      })
    }

    // Build hierarchy
    const categoryMap = new Map()
    const rootCategories: any[] = []

    // First pass: create map of all categories
    categories.forEach((category: any) => {
      categoryMap.set(category.id, {
        ...category,
        children: [],
        productCount: includeCounts ? parseInt(category.productCount) : undefined
      })
    })

    // Second pass: build hierarchy
    categories.forEach((category: any) => {
      const categoryNode = categoryMap.get(category.id)
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId)
        if (parent) {
          parent.children.push(categoryNode)
        }
      } else {
        rootCategories.push(categoryNode)
      }
    })

    return NextResponse.json({
      success: true,
      data: rootCategories
    })
  } catch (error: any) {
    console.error("Error fetching categories:", error)
    console.error("Error details:", error.message, error.stack)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch categories",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can create categories
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can create categories" }, { status: 403 })
    }

    const body = await request.json()
    const { name, slug, description, icon, parentId, sortOrder } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required" },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingCategory = await query(
      'SELECT id FROM "ProductCategory" WHERE slug = ?',
      [slug]
    )

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { success: false, error: "Category with this slug already exists" },
        { status: 409 }
      )
    }

    // Generate ID using cuid-like format
    const generateId = () => {
      return 'cm' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
    }
    const categoryId = generateId()

    // Insert new category
    await query(
      `INSERT INTO "ProductCategory" (id, name, slug, description, icon, "parentId", "sortOrder", "isActive", "createdAt", "updatedAt") 
       VALUES (?, ?, ?, ?, ?, ?, ?, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [categoryId, name, slug, description || null, icon || null, parentId || null, sortOrder || 0]
    )

    const newCategory = await query(
      'SELECT * FROM "ProductCategory" WHERE id = ?',
      [categoryId]
    )

    return NextResponse.json({
      success: true,
      data: newCategory[0]
    })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    )
  }
}

// PUT - Update category
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can update categories
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can update categories" }, { status: 403 })
    }

    const body = await request.json()
    const { id, name, slug, description, icon, parentId, sortOrder, isActive } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      )
    }

    // Check if category exists
    const existingCategory = await query(
      'SELECT id FROM "ProductCategory" WHERE id = ?',
      [id]
    )

    if (existingCategory.length === 0) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      )
    }

      // Check if slug is being changed and if it already exists
      if (slug) {
        const slugExists = await query(
          'SELECT id FROM "ProductCategory" WHERE slug = ? AND id != ?',
          [slug, id]
        )

      if (slugExists.length > 0) {
        return NextResponse.json(
          { success: false, error: "Category with this slug already exists" },
          { status: 409 }
        )
      }
    }

    // Update category
    await query(
      `UPDATE "ProductCategory" 
       SET name = COALESCE(?, name),
           slug = COALESCE(?, slug),
           description = COALESCE(?, description),
           icon = COALESCE(?, icon),
           "parentId" = COALESCE(?, "parentId"),
           "sortOrder" = COALESCE(?, "sortOrder"),
           "isActive" = COALESCE(?, "isActive"),
           "updatedAt" = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, slug, description, icon, parentId, sortOrder, isActive, id]
    )

    const updatedCategory = await query(
      'SELECT * FROM "ProductCategory" WHERE id = ?',
      [id]
    )

    return NextResponse.json({
      success: true,
      data: updatedCategory[0]
    })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    )
  }
}

// DELETE - Delete category
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can delete categories
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can delete categories" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      )
    }

    // Check if category has products
    const productsInCategory = await query(
      'SELECT COUNT(*) as count FROM "Product" WHERE "categoryId" = ?',
      [id]
    )

    if (parseInt(productsInCategory[0].count) > 0) {
      return NextResponse.json(
        { success: false, error: "Cannot delete category with existing products" },
        { status: 400 }
      )
    }

    // Check if category has children
    const childrenCount = await query(
      'SELECT COUNT(*) as count FROM "ProductCategory" WHERE "parentId" = ?',
      [id]
    )

    if (parseInt(childrenCount[0].count) > 0) {
      return NextResponse.json(
        { success: false, error: "Cannot delete category with subcategories" },
        { status: 400 }
      )
    }

    // Delete category
    await query('DELETE FROM "ProductCategory" WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    )
  }
}
