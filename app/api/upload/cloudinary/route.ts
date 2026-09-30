import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import ImageKit, { toFile } from "@imagekit/nodejs"

// Configure ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const customFolder = formData.get("folder") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type - accept images, videos, and PDFs (verification docs)
    const isImage = file.type.startsWith("image/")
    const isVideo = file.type.startsWith("video/")
    const isPdf = file.type === "application/pdf"
    
    if (!isImage && !isVideo && !isPdf) {
      return NextResponse.json({ error: "File must be an image, video, or PDF" }, { status: 400 })
    }

    // Validate file size - 5MB for images, 100MB for videos, 10MB for PDFs
    const maxSize = isImage ? 5 * 1024 * 1024 : isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeMB = isImage ? 5 : isVideo ? 100 : 10
      return NextResponse.json({ 
        error: `File size must be less than ${maxSizeMB}MB` 
      }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop() || (isImage ? 'jpg' : isVideo ? 'mp4' : 'pdf')
    
    // Use custom folder if provided, otherwise use default
    const folder = customFolder || (isPdf ? "/printmarket/verifications/" : isImage ? "/printmarket/products/" : "/printmarket/videos/")
    
    // Extract folder name without leading/trailing slashes for fileName
    const folderName = folder.replace(/^\/+|\/+$/g, '')
    const fileName = `${folderName}/${timestamp}-${randomString}.${fileExtension}`

    // Convert buffer to File object using ImageKit's toFile helper
    const fileObject = await toFile(buffer, fileName)

    // Upload to ImageKit
    // Use files.upload() method from the ImageKit SDK
    const uploadResult = await imagekit.files.upload({
      file: fileObject,
      fileName: fileName,
      folder: folder,
      // ImageKit will handle transformations via URL parameters when serving images
      // For now, we upload the original and can apply transformations when displaying
    })

    const response = {
      success: true,
      url: uploadResult.url,
      publicId: uploadResult.fileId,
      filePath: uploadResult.filePath, // Include filePath for cleanup purposes
    }

    return NextResponse.json(response)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    )
  }
}
