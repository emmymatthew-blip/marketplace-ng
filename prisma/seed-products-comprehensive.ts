import { Pool } from 'pg'
import { resolveDatabaseUrl } from '../lib/supabase'

// Get all available printer images
const printerImages = [
  "/printer/A4a39b0d1f1c74f23a9ae22724ca992ecW.jpg_350x350.jpeg",
  "/printer/Ad762eb0c64f64ac0bdfba384ff1cba4fX.jpg_350x350.jpeg",
  "/printer/H06241d9ffd34458784640af2e8338f02k.jpg_350x350.jpeg",
  "/printer/H09789ceced794a57b385e3eeaf9af2cfW.jpg_960x960q80.jpeg",
  "/printer/H217e786c462d434fa47a7579605461f3m.jpg_350x350.jpeg",
  "/printer/H240cabeff3084e44b3b8ea1a097e9967T.jpg_350x350.jpeg",
  "/printer/H24cf7d1c4cc549aaad4e2ac1bdcfb2f6c.jpg_960x960q80.jpeg",
  "/printer/H2737e28217e14024931a86da87586d1du.jpg_350x350.webp",
  "/printer/H281adac213224f60b37e605db2a07550f.jpg_350x350.jpeg",
  "/printer/H2c466b5931834d5584dff621c1370a86h.webp",
  "/printer/H319c504455484019822aa8d619db24e3I.jpg_960x960q80.jpeg",
  "/printer/H390e01421c964650977a56163849229eh.jpeg",
  "/printer/H391b5e6cbf9a43b0ae14b9235feb018eo.jpg_350x350.jpeg",
  "/printer/H4148b8a9d60f498a8b5d17d74f11d40bz.jpg_350x350.jpeg",
  "/printer/H4f17c88cfc774b0ebcc1806cd3b437c4K.jpg_350x350.jpeg",
  "/printer/H584d8639ebe14c5aa87238db16ce5545q.jpg_350x350.jpeg",
  "/printer/H5914d7f285c043ba9b55be74d385d9eew.jpg_350x350.jpeg",
  "/printer/H65a80532c11847439bb67b121fcb8f9eC.jpg_350x350.jpeg",
  "/printer/H671411ddf41243578674ecb563bd0aa8n.webp",
  "/printer/H7741a6762eb94098be15fcb2ce9bc2498.jpeg",
  "/printer/H791fd3324c1048c59de39dd48df9e0d9A.jpg_960x960q80.jpeg",
  "/printer/H86e497e1e3db45f98847fb01bd7c1f9e9.jpg_960x960q80.jpeg",
  "/printer/H870ea4fe73e74d03a0451df6aaf22a52K.jpg_350x350.jpeg",
  "/printer/H8b8cf1add7e046f5bfad016df2cfa80eL.jpg_350x350.jpeg",
  "/printer/H8c3ff0af66a948eaa4694ef6f65b1e17U.jpg_960x960q80.jpeg",
  "/printer/H8d61b07db2004c1897d5f9a9fd47dec8g.webp",
  "/printer/H918bafd52a5041c98631010d9b2906a1q.jpg_960x960q80.jpeg",
  "/printer/H9b38020d91d9444ea083fa2d7d3a4670n.jpg_350x350.jpeg",
  "/printer/H9cf3d4cbb8d34059be66dfb8ea667b777.jpg_350x350.jpeg",
  "/printer/Ha6db6f2a47e042998e5e38b4e35d94e0a.webp",
  "/printer/Hb7e97600d9374e9fb5aeaf63c2223292X.jpg_960x960q80.jpeg",
  "/printer/Hc1782d3d7d0e496a92c48d950ba84c09n.jpg_960x960q80.jpeg",
  "/printer/Hc3395a7bdcc04c129641524d1f203813o.jpg_960x960q80.jpeg",
  "/printer/Hc360f8d99cce40c3a19a87492d556cd8w.jpeg",
  "/printer/Hc54c402d5e0745b7be5402da1ed38433f.jpg_350x350.jpeg",
  "/printer/Hc7930e51ff864be78aa851bd9912f8cdI.jpg_350x350.jpeg",
  "/printer/Hd858851d5a3044a9be0c7061a31a0268s.jpg_350x350.jpeg",
  "/printer/Hda3a2791f58e48da94ca3d65ef5f37f63.jpg_960x960q80.jpeg",
  "/printer/Hda5324c2306e4b33893659b83fc08234D.jpg_350x350.jpeg",
  "/printer/He68d5f5e5dc4424687eeab37b2426221z.jpg_960x960q80.jpeg",
  "/printer/Hf6f84423b372497eacf7db2fdf7fce3cm.jpg_220x220.jpeg",
  "/printer/Hf6f84423b372497eacf7db2fdf7fce3cm.jpg_350x350.jpeg",
  "/printer/HLB1EBTdUbvpK1RjSZPiq6zmwXXax.jpg_350x350.jpeg",
  "/printer/HTB12MQHSpXXXXXWaXXXq6xXFXXXB.jpg_350x350.jpeg",
  "/printer/HTB1Ef22ayfrK1RjSspbq6A4pFXat.jpg_350x350.jpeg",
  "/printer/HTB1H7bQSXXXXXbEXVXXq6xXFXXX9.webp",
  "/printer/HTB1KRUaSXXXXXazXpXXq6xXFXXXg.webp",
  "/printer/HTB1pM54bgoQMeJjy1Xaq6ASsFXa0.webp",
  "/printer/HTB1qcarSXXXXXcCXVXXxh4dFXXXI.webp",
  "/printer/HTB1RBgHSpXXXXXraXXXq6xXFXXXN.jpg_350x350.jpeg",
  "/printer/HTB1rf0cSFXXXXb1XXXXq6xXFXXXt.jpg_350x350.jpeg",
  "/printer/HTB1udCsX.zrK1RjSspmq6AOdFXag.jpg_350x350.jpeg",
  "/printer/HTB1ufwXOFXXXXc3XXXXq6xXFXXXt.webp",
  "/printer/HTB1vcbiSXXXXXcoaVXXq6xXFXXX5.webp",
  "/printer/HTB1xE8fbT0ATuJjSZFEq6yp2FXae.jpg_350x350.jpeg",
  "/printer/UTB82FSFE0oSdeJk43Owq6ya4XXaw.jpg_350x350.jpeg",
  "/printer/UTB8LuTcF8ahduJk43Jaq6zM8FXaB.jpg_350x350.jpeg"
]

// Product data with realistic printing equipment
const products = [
  // Offset Printing Presses
  { title: "Heidelberg Speedmaster XL 106", description: "High-performance 6-color offset printing press with perfecting capability. Maximum sheet size 1060x750mm. Features advanced automation, coating unit, and drying system. Ideal for commercial printing and packaging applications.", categoryName: "Offset Press", brand: "Heidelberg", condition: "USED", imageIndex: 3 },
  { title: "Komori Lithrone G40", description: "Advanced 4-color offset press with H-UV curing system. Features automatic plate changing, color management, and quality monitoring. Perfect for high-quality commercial printing with fast turnaround.", categoryName: "Offset Press", brand: "Komori", condition: "NEW", imageIndex: 6 },
  { title: "KBA Rapida 106", description: "Large format 6-color offset press with perfecting. Maximum sheet size 1060x750mm. Features advanced automation, coating, and drying capabilities. Ideal for commercial and packaging printing.", categoryName: "Offset Press", brand: "KBA", condition: "USED" , imageIndex: 20 },
  { title: "Manroland Roland 700", description: "High-speed 5-color offset press with perfecting. Features automatic plate changing and advanced color control. Perfect for commercial printing with high productivity.", categoryName: "Offset Press", brand: "Manroland", condition: "USED" , imageIndex: 21 },
  { title: "Ryobi 520HX", description: "Compact 2-color offset press. Maximum sheet size 520x360mm. Features automatic plate changing and color management. Ideal for small to medium print runs.", categoryName: "Offset Press", brand: "Ryobi", condition: "NEW" , imageIndex: 22 },
  
  // Digital Printing Presses
  { title: "HP Indigo 12000 Digital Press", description: "High-speed digital press for commercial printing. Features 7-color printing, advanced color management, and variable data printing. Ideal for short to medium runs with high quality.", categoryName: "Digital Press", brand: "HP", condition: "NEW" , imageIndex: 10 },
  { title: "Canon imagePRESS C10000VP", description: "Production digital press with high-speed printing up to 100 pages per minute. Features advanced finishing options, color consistency, and workflow integration. Perfect for commercial printing.", categoryName: "Digital Press", brand: "Canon", condition: "NEW" , imageIndex: 20 },
  { title: "Xerox Versant 3100", description: "High-speed digital press with 5-color capability. Features automatic duplexing, finishing options, and advanced color management. Ideal for commercial and transactional printing.", categoryName: "Digital Press", brand: "Xerox", condition: "USED" , imageIndex: 23 },
  { title: "Ricoh Pro C9200", description: "Production digital press with 5-color printing. Features high-speed output, advanced finishing, and color consistency. Perfect for commercial printing applications.", categoryName: "Digital Press", brand: "Ricoh", condition: "NEW" , imageIndex: 24 },
  { title: "Konica Minolta AccurioPress C6085", description: "High-speed digital press with 5-color capability. Features advanced color management and finishing options. Ideal for commercial printing with high productivity.", categoryName: "Digital Press", brand: "Konica Minolta", condition: "USED" , imageIndex: 25 },
  
  // Screen Printing Equipment
  { title: "Vastex V-2000HD Screen Press", description: "Automatic screen printing press with 6-color capability. Features micro-registration, flash curing, and automatic indexing. Perfect for textile and poster printing.", categoryName: "Screen Press", brand: "Vastex", condition: "USED" , imageIndex: 21 },
  { title: "M&R Challenger III", description: "High-performance automatic screen press with 10-color capability. Features automatic registration, flash curing, and advanced controls. Ideal for high-volume textile printing.", categoryName: "Screen Press", brand: "M&R", condition: "NEW" , imageIndex: 26 },
  { title: "Anatol Titan", description: "Automatic screen printing press with 8-color capability. Features precision registration and flash curing. Perfect for textile and promotional product printing.", categoryName: "Screen Press", brand: "Anatol", condition: "USED" , imageIndex: 27 },
  
  // Large Format Printers
  { title: "Epson SureColor P20000", description: "Large format inkjet printer for signage and graphics. Features 10-color ink system, roll-to-roll printing, and advanced media handling. Perfect for outdoor applications and banners.", categoryName: "Large Format", brand: "Epson", condition: "NEW" , imageIndex: 35 },
  { title: "HP Latex 3600", description: "Large format latex printer for signage. Features 6-color printing, white ink capability, and eco-solvent technology. Ideal for indoor and outdoor applications.", categoryName: "Large Format", brand: "HP", condition: "NEW" , imageIndex: 36 },
  { title: "Roland VersaUV LEF-300", description: "UV flatbed printer for rigid materials. Features white ink capability, LED curing, and advanced media handling. Perfect for signage, packaging, and display applications.", categoryName: "Large Format", brand: "Roland", condition: "USED" , imageIndex: 35 },
  { title: "Mimaki JFX200-2531", description: "UV LED flatbed printer with high-speed output. Features 6-color printing, white ink, and advanced curing. Ideal for signage and display applications.", categoryName: "Large Format", brand: "Mimaki", condition: "NEW" , imageIndex: 37 },
  
  // CTP Systems
  { title: "Kodak Magnus Q800 CTP System", description: "Computer-to-plate system for thermal plates. Features high-resolution imaging, automatic plate handling, and workflow integration. Ideal for commercial printing.", categoryName: "CTP Systems", brand: "Kodak", condition: "USED" , imageIndex: 22 },
  { title: "Fujifilm Luxel V-9600", description: "High-speed CTP system for thermal plates. Features automatic plate handling and advanced imaging. Perfect for high-volume plate production.", categoryName: "CTP Systems", brand: "Fujifilm", condition: "NEW" , imageIndex: 28 },
  { title: "Screen PlateRite 8600", description: "CTP system with high-resolution imaging. Features automatic plate handling and workflow integration. Ideal for commercial and packaging printing.", categoryName: "CTP Systems", brand: "Screen", condition: "USED" , imageIndex: 29 },
  
  // Finishing Equipment
  { title: "Polar 115 XT Cutting System", description: "Programmable cutting system with automatic knife adjustment. Features high-precision cutting, safety systems, and workflow integration. Ideal for commercial finishing.", categoryName: "Cutting Equipment", brand: "Polar", condition: "USED" , imageIndex: 30 },
  { title: "MBO K8 Folding Machine", description: "High-speed folding machine with 8-buckle capability. Features automatic setup, quality monitoring, and advanced controls. Perfect for commercial folding applications.", categoryName: "Folding Equipment", brand: "MBO", condition: "NEW" , imageIndex: 31 },
  { title: "Muller Martini Presto II Binder", description: "Perfect binding system with automatic setup. Features glue application, cover attachment, and quality control. Ideal for book production and perfect binding.", categoryName: "Binding Equipment", brand: "Muller Martini", condition: "USED" , imageIndex: 32 },
  { title: "Heidelberg Stahlfolder TH 82", description: "High-speed folding machine with 8-buckle capability. Features automatic setup and quality monitoring. Perfect for commercial folding operations.", categoryName: "Folding Equipment", brand: "Heidelberg", condition: "USED" , imageIndex: 33 },
  
  // Web Printing
  { title: "Manroland Web Systems Lithoman", description: "High-speed web offset press for commercial printing. Features automatic plate changing, color control, and advanced automation. Ideal for newspaper and magazine printing.", categoryName: "Web Offset", brand: "Manroland", condition: "USED" , imageIndex: 37 },
  { title: "HP PageWide Web Press T490 HD", description: "High-speed web digital press for commercial printing. Features variable data printing, color consistency, and workflow integration. Perfect for transactional and commercial printing.", categoryName: "Web Digital", brand: "HP", condition: "NEW" , imageIndex: 38 },
  
  // Flexo Printing
  { title: "Mark Andy Performance Series P7", description: "High-performance flexo press for label printing. Features 10-color capability, automatic registration, and advanced controls. Ideal for label and packaging printing.", categoryName: "Flexo Presses", brand: "Mark Andy", condition: "NEW" , imageIndex: 39 },
  { title: "DuPont Cyrel FAST 2000TD", description: "Thermal flexo plate making system. Features high-resolution imaging, automatic processing, and workflow integration. Perfect for flexo plate production.", categoryName: "Flexo Plates", brand: "DuPont", condition: "USED" , imageIndex: 40 },
  
  // Consumables
  { title: "Pantone Matching System Inks", description: "Premium spot color inks for precise color matching. Features 1,867 solid colors and metallic inks. Essential for brand consistency and color accuracy.", categoryName: "Inks", brand: "Pantone", condition: "NEW" , imageIndex: 42 },
  { title: "Mohawk Premium Papers", description: "High-quality printing papers for commercial use. Features various weights, finishes, and colors. Perfect for premium printing projects and brand materials.", categoryName: "Papers", brand: "Mohawk", condition: "NEW" , imageIndex: 43 },
  { title: "Kodak Sonora Process Free Plates", description: "Process-free printing plates for offset printing. Features no chemical processing, environmental benefits, and high quality. Ideal for sustainable printing operations.", categoryName: "Plates", brand: "Kodak", condition: "NEW" , imageIndex: 44 },
  { title: "Fujifilm Pressroom Chemicals", description: "Complete range of pressroom chemicals and solutions. Features fountain solutions, cleaning products, and maintenance supplies. Essential for press operation and maintenance.", categoryName: "Chemicals", brand: "Fujifilm", condition: "NEW" , imageIndex: 45 },
  
  // Additional Equipment
  { title: "Heidelberg Spare Parts Kit", description: "Complete spare parts kit for Heidelberg presses. Features commonly needed components, maintenance items, and replacement parts. Essential for press reliability and uptime.", categoryName: "Spare Parts", brand: "Heidelberg", condition: "NEW" , imageIndex: 46 },
  { title: "Printing Accessories Bundle", description: "Essential printing accessories including tools, measuring devices, and safety equipment. Perfect for print shop setup, maintenance, and daily operations.", categoryName: "Accessories", brand: "Various", condition: "NEW" , imageIndex: 47 },
  { title: "Used GTO 52 Color GTO Printing Machine", description: "High-speed 4-color offset printing machine with a max printing speed of 13000r/h. Suitable for high-quality CMYK printing jobs like brochures, magazines, and posters. Supports a wide range of paper thicknesses from 0.03-0.6mm.", categoryName: "Offset Press", brand: "Heidelberg", condition: "USED" , imageIndex: 3 },
  { title: "High Speed 4 Color Offset Printing Machines", description: "Professional 4-color offset press with high-speed output. Features automatic plate changing, color management, and quality monitoring. Ideal for commercial printing applications.", categoryName: "Offset Press", brand: "Various", condition: "USED" , imageIndex: 48 },
  { title: "Germany Speed Master SM GTO Offset Printer", description: "German-engineered offset printing press with advanced automation. Features high-speed output, color consistency, and reliability. Perfect for commercial printing operations.", categoryName: "Offset Press", brand: "Heidelberg", condition: "USED" , imageIndex: 49 },
  { title: "Automatic Second Hand Sheet-fed Offset Printing", description: "Used sheet-fed offset press with automatic feeding and delivery. Features color management and quality control. Ideal for commercial printing applications.", categoryName: "Offset Press", brand: "Various", condition: "USED" , imageIndex: 50 },
  { title: "USED GTO 52 SM Speed Master 4 Color Offset", description: "Used 4-color offset press with high-speed capability. Features automatic plate changing and color management. Perfect for commercial printing with cost-effective operation.", categoryName: "Offset Press", brand: "Heidelberg", condition: "USED" , imageIndex: 51 }
]

// Generate ID using cuid-like format
function generateId() {
  return 'cm' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

async function main() {
  console.log('🌱 Seeding comprehensive products database...')

  // Use URL derived from NEXT_PUBLIC_SUPABASE_URL + SUPABASE_DB_PASSWORD
  const dbUrl = resolveDatabaseUrl()
  if (!dbUrl) {
    throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_DB_PASSWORD in .env')
  }
  const urlMatch = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/)
  if (!urlMatch) {
    throw new Error('Invalid resolved database URL format')
  }
  
  const [, user, password, host, port, database] = urlMatch
  
  // Create a connection pool for seeding
  const pool = new Pool({
    host,
    port: parseInt(port),
    database,
    user,
    password,
    max: 1, // Use single connection for seeding
    ssl: { rejectUnauthorized: false }, // Required for Supabase connections
  })
  
  const client = await pool.connect()

  try {
    // Add condition and brand columns if they don't exist (PostgreSQL uses different syntax)
    try {
      await client.query(`
        ALTER TABLE "Product" 
        ADD COLUMN IF NOT EXISTS condition VARCHAR(10) DEFAULT 'NEW',
        ADD COLUMN IF NOT EXISTS brand VARCHAR(191) NULL
      `)
      console.log('✅ Added condition and brand columns')
    } catch (error: any) {
      if (error.code === '42701') { // duplicate_column error code
        console.log('✅ Condition and brand columns already exist')
      } else {
        console.log('⚠️  Could not add columns (may already exist):', error.message)
      }
    }

    // Get all users (vendors) to assign products to
    const usersResult = await client.query('SELECT id, email, name FROM "User" WHERE role != $1 AND role != $2 LIMIT 20', ['ADMIN', 'CORPORATE_BUYER'])
    const users = usersResult.rows
    
    if (!users || users.length === 0) {
      console.log('⚠️  No vendors found. Please seed vendors first.')
      return
    }

    console.log(`✅ Found ${users.length} vendors`)

    // Get all categories
    const categoriesResult = await client.query('SELECT id, name FROM "ProductCategory"')
    const categoryMap = new Map()
    categoriesResult.rows.forEach((cat: any) => {
      categoryMap.set(cat.name, cat.id)
    })

    console.log(`✅ Found ${categoriesResult.rows.length} categories`)

  let createdCount = 0
  let skippedCount = 0

  // Helper function to add delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const categoryId = categoryMap.get(product.categoryName)
    
    if (!categoryId) {
      console.log(`⚠️  Category not found: ${product.categoryName} - Skipping product: ${product.title}`)
      skippedCount++
      continue
    }

    // Assign to a vendor (round-robin)
    const vendor = users[i % users.length]
    
    // Get image(s) - use the specified index, or cycle through available images
    const imageIndex = product.imageIndex !== undefined ? product.imageIndex : i % printerImages.length
    const primaryImage = printerImages[imageIndex]
    // Add a few more images for variety
    const additionalImages = [
      printerImages[(imageIndex + 1) % printerImages.length],
      printerImages[(imageIndex + 2) % printerImages.length]
    ].filter(img => img !== primaryImage).slice(0, 2)
    const allImages = [primaryImage, ...additionalImages]
    
    try {
      // Check if product already exists
      const existingResult = await client.query(
        'SELECT id FROM "Product" WHERE title = $1 AND "ownerId" = $2',
        [product.title, vendor.id]
      )

      if (existingResult.rows.length > 0) {
        console.log(`  ⚠️  Product already exists: ${product.title}`)
        skippedCount++
        continue
      }

      // Generate ID
      const productId = generateId()

      // Create product
      await client.query(
        `INSERT INTO "Product" (
          id, title, description, images, "contactInfo", "categoryId", "ownerId", 
          condition, brand, "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
        [
          productId,
          product.title,
          product.description,
          JSON.stringify(allImages),
          `Contact ${vendor.name} for pricing and availability | +234 ${800 + i} ${100 + i} ${2000 + i}`,
          categoryId,
          vendor.id,
          product.condition,
          product.brand
        ]
      )

      createdCount++
      console.log(`  ✅ Created: ${product.title} (${product.categoryName}) - Owner: ${vendor.name}`)
      
      // Add small delay every 5 products to avoid connection issues
      if ((i + 1) % 5 === 0) {
        await delay(100)
      }
    } catch (error) {
      console.log(`  ❌ Failed: ${product.title} - ${error instanceof Error ? error.message : String(error)}`)
      skippedCount++
      // Add delay on error too
      await delay(200)
    }
  }

  console.log('')
  console.log('🎉 Product seeding completed!')
  console.log(`   ✅ Created: ${createdCount} products`)
  console.log(`   ⚠️  Skipped: ${skippedCount} products`)
  console.log(`   📸 Used images from: public/printer/`)
  } finally {
    client.release()
    await pool.end()
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding products:', e)
    process.exit(1)
  })

