import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")

    let sql = `
      SELECT DISTINCT p.brand, COUNT(*) as count
      FROM "Product" p
      WHERE p.brand IS NOT NULL AND p.brand != ''
    `
    const params: any[] = []

    if (categoryId) {
      // Get all subcategory IDs
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
      const placeholders = categoryIds.map(() => '?').join(',')
      sql += ` AND p."categoryId" IN (${placeholders})`
      params.push(...categoryIds)
    }

    sql += " GROUP BY p.brand ORDER BY count DESC, p.brand ASC"

    const brands = await query(sql, params)

    return NextResponse.json({
      success: true,
      data: brands.map((row: any) => ({
        brand: row.brand,
        count: parseInt(row.count) || 0
      }))
    })
  } catch (error: any) {
    console.error("Error fetching brands:", error)
    console.error("Error details:", error.message, error.stack)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch brands",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

