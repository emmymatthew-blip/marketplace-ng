import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

function escapeCsvField(value: string | null | undefined): string {
  const s = value == null ? "" : String(value)
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function slugForFilename(title: string): string {
  return title
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60) || "demo"
}

export async function GET(_req: Request, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const demoId = context.params.id
    const demoRows = await query<{ id: string; title: string; manufacturerId: string }>(
      `SELECT d.id, d.title, d."manufacturerId"
       FROM "DemoClass" d
       WHERE d.id = ?
       LIMIT 1`,
      [demoId]
    )

    if (!demoRows.length) {
      return NextResponse.json({ error: "Demo not found" }, { status: 404 })
    }

    const demo = demoRows[0]
    const canAccess = session.user.role === "ADMIN" || demo.manufacturerId === session.user.id
    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const leads = await query<{
      name: string | null
      email: string
      companyName: string | null
      phone: string | null
      message: string | null
      source: string | null
      createdAt: Date | string
    }>(
      `SELECT name, email, "companyName", phone, message, source, "createdAt"
       FROM "DemoRegistration"
       WHERE "demoId" = ?
       ORDER BY "createdAt" DESC`,
      [demoId]
    )

    const header = ["name", "email", "company", "phone", "message", "source", "registeredAt"]
    const rows = leads.map((row) => {
      const registeredAt =
        row.createdAt instanceof Date
          ? row.createdAt.toISOString()
          : new Date(row.createdAt).toISOString()
      return [
        escapeCsvField(row.name),
        escapeCsvField(row.email),
        escapeCsvField(row.companyName),
        escapeCsvField(row.phone),
        escapeCsvField(row.message),
        escapeCsvField(row.source),
        escapeCsvField(registeredAt),
      ].join(",")
    })

    const csv = "\uFEFF" + [header.join(","), ...rows].join("\r\n")
    const filename = `demo-leads-${slugForFilename(demo.title)}-${demoId.slice(0, 8)}.csv`

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Error exporting demo leads:", error)
    return NextResponse.json({ error: "Failed to export leads" }, { status: 500 })
  }
}
