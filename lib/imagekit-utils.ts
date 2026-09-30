import ImageKit from "@imagekit/nodejs"

// Configure ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
})

/**
 * Deletes images from ImageKit by their URLs
 * @param imageUrls Array of ImageKit image URLs to delete
 * @returns Object with deleted URLs and any errors
 */
export async function deleteImageKitImages(imageUrls: string[]): Promise<{
  deleted: string[]
  errors: string[]
}> {
  const deleted: string[] = []
  const errors: string[] = []

  for (const url of imageUrls) {
    // Skip non-ImageKit URLs (blob URLs, placeholder URLs, etc.)
    if (!url || url.startsWith('blob:') || !url.includes('ik.imagekit.io')) {
      continue
    }

    try {
      // Extract file path from URL
      // ImageKit URL format: https://ik.imagekit.io/8vvqhvynx/path/to/file.jpg
      const urlObj = new URL(url)
      let filePath = urlObj.pathname
      // Remove leading slash if present
      if (filePath.startsWith('/')) {
        filePath = filePath.substring(1)
      }
      
      console.log("Attempting to delete image from ImageKit:", url, "Path:", filePath)
      
      // Normalize URL for comparison (remove query params and hash)
      const normalizedUrl = url.split('?')[0].split('#')[0]
      
      // Search for the file - try multiple strategies
      let fileId: string | null = null
      let searchError: string | null = null
      
      try {
        // Strategy 1: Search by path (most efficient)
        try {
          const filesByPath = await imagekit.listFiles({
            path: filePath,
            limit: 10,
          })
          
          if (filesByPath && Array.isArray(filesByPath) && filesByPath.length > 0) {
            // Find exact match by URL or filePath
            const exactMatch = filesByPath.find((f: any) => {
              const fUrl = f.url?.split('?')[0].split('#')[0] || ''
              return f.url === url || 
                     fUrl === normalizedUrl ||
                     f.filePath === filePath || 
                     f.filePath === `/${filePath}` ||
                     f.filePath === filePath.replace(/^\//, '')
            })
            
            if (exactMatch?.fileId) {
              fileId = exactMatch.fileId
              console.log("Found file by path search:", fileId)
            }
          }
        } catch (pathError: any) {
          console.log("Path search failed:", pathError.message)
          searchError = pathError.message
        }
        
        // Strategy 2: Search recent files and match by URL or path
        if (!fileId) {
          const allFiles = await imagekit.listFiles({
            limit: 100, // Search in recent files
          })
          
          if (allFiles && Array.isArray(allFiles)) {
            const exactMatch = allFiles.find((f: any) => {
              const fUrl = f.url?.split('?')[0].split('#')[0] || ''
              return f.url === url || 
                     fUrl === normalizedUrl ||
                     f.filePath === filePath || 
                     f.filePath === `/${filePath}` ||
                     f.filePath === filePath.replace(/^\//, '')
            })
            
            if (exactMatch?.fileId) {
              fileId = exactMatch.fileId
              console.log("Found file by full search:", fileId)
            }
          }
        }
      } catch (error: any) {
        console.error("Error searching for file in ImageKit:", error)
        searchError = error.message
      }
      
      // Delete the file if found
      if (fileId) {
        try {
          await imagekit.files.delete(fileId)
          deleted.push(url)
          console.log("Successfully deleted image from ImageKit:", url, "File ID:", fileId)
        } catch (deleteError: any) {
          console.error("Error calling delete API:", deleteError)
          errors.push(`Failed to delete ${url}: ${deleteError.message || deleteError}`)
        }
      } else {
        const errorMsg = searchError 
          ? `File not found: ${url} (Search error: ${searchError})`
          : `File not found: ${url}`
        console.warn(errorMsg)
        errors.push(errorMsg)
      }
    } catch (error: any) {
      console.error("Error deleting image from ImageKit:", url, error)
      errors.push(`Failed to delete ${url}: ${error.message}`)
    }
  }

  return { deleted, errors }
}
