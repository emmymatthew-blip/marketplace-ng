import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { deleteImageKitImages } from "@/lib/imagekit-utils"

/**
 * DELETE endpoint to clean up orphaned images from ImageKit
 * This is called when images are uploaded but the product creation is not completed
 */
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { imageUrls } = body

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json({ error: "Image URLs array is required" }, { status: 400 })
    }

    // Use the shared utility function to delete images
    const deleteResult = await deleteImageKitImages(imageUrls)

    return NextResponse.json({
      success: true,
      deleted: deleteResult.deleted.length,
      failed: deleteResult.errors.length,
      deletedUrls: deleteResult.deleted,
      errors: deleteResult.errors.length > 0 ? deleteResult.errors : undefined,
    })
  } catch (error: any) {
    console.error("Error in cleanup endpoint:", error)
    return NextResponse.json(
      { error: error.message || "Failed to cleanup images" },
      { status: 500 }
    )
  }
}
