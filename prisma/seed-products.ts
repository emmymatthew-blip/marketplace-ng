import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  // Press Equipment
  {
    title: "Heidelberg Speedmaster XL 106",
    description: "High-performance offset printing press with advanced automation. Features perfecting, coating, and drying capabilities. Ideal for commercial printing and packaging.",
    images: JSON.stringify(["/printer/H09789ceced794a57b385e3eeaf9af2cfW.jpg_960x960q80.jpeg"]),
    contactInfo: "sales@heidelberg.com | +234 801 234 5678",
    categoryName: "Offset Press"
  },
  {
    title: "Komori Lithrone G40",
    description: "Advanced offset press with H-UV curing system. Features automatic plate changing and color management. Perfect for high-quality commercial printing.",
    images: JSON.stringify(["/printer/H24cf7d1c4cc549aaad4e2ac1bdcfb2f6c.jpg_960x960q80.jpeg"]),
    contactInfo: "info@komori.com | +234 802 345 6789",
    categoryName: "Offset Press"
  },
  {
    title: "HP Indigo 12000 Digital Press",
    description: "High-speed digital press for commercial printing. Features 7-color printing and advanced color management. Ideal for variable data printing.",
    images: JSON.stringify(["/printer/H319c504455484019822aa8d619db24e3I.jpg_960x960q80.jpeg"]),
    contactInfo: "digital@hp.com | +234 803 456 7890",
    categoryName: "Digital Press"
  },
  {
    title: "Canon imagePRESS C10000VP",
    description: "Production digital press with high-speed printing up to 100 pages per minute. Features advanced finishing options and color consistency.",
    images: JSON.stringify(["/printer/H791fd3324c1048c59de39dd48df9e0d9A.jpg_960x960q80.jpeg"]),
    contactInfo: "canon@print.com | +234 804 567 8901",
    categoryName: "Digital Press"
  },
  {
    title: "Vastex V-2000HD Screen Press",
    description: "Automatic screen printing press with 6-color capability. Features micro-registration and flash curing. Perfect for textile and poster printing.",
    images: JSON.stringify(["/printer/H86e497e1e3db45f98847fb01bd7c1f9e9.jpg_960x960q80.jpeg"]),
    contactInfo: "vastex@screen.com | +234 805 678 9012",
    categoryName: "Screen Press"
  },

  // Pre Press Equipment
  {
    title: "Kodak Magnus Q800 CTP System",
    description: "Computer-to-plate system for thermal plates. Features high-resolution imaging and automatic plate handling. Ideal for commercial printing.",
    images: JSON.stringify(["/printer/H8c3ff0af66a948eaa4694ef6f65b1e17U.jpg_960x960q80.jpeg"]),
    contactInfo: "ctp@kodak.com | +234 806 789 0123",
    categoryName: "CTP Systems"
  },
  {
    title: "Epson SureColor P9000 Proofing System",
    description: "Large format proofing printer with 11-color ink system. Features advanced color management and media handling. Perfect for contract proofing.",
    images: JSON.stringify(["/printer/H918bafd52a5041c98631010d9b2906a1q.jpg_960x960q80.jpeg"]),
    contactInfo: "proofing@epson.com | +234 807 890 1234",
    categoryName: "Proofing Systems"
  },
  {
    title: "Adobe Creative Suite 2024",
    description: "Complete design software suite including Photoshop, Illustrator, and InDesign. Features cloud integration and advanced design tools.",
    images: JSON.stringify(["/printer/Hb7e97600d9374e9fb5aeaf63c2223292X.jpg_960x960q80.jpeg"]),
    contactInfo: "adobe@creative.com | +234 808 901 2345",
    categoryName: "Pre-press Software"
  },

  // Post Press Equipment
  {
    title: "Polar 115 XT Cutting System",
    description: "Programmable cutting system with automatic knife adjustment. Features high-precision cutting and safety systems. Ideal for commercial finishing.",
    images: JSON.stringify(["/printer/Hc1782d3d7d0e496a92c48d950ba84c09n.jpg_960x960q80.jpeg"]),
    contactInfo: "polar@cutting.com | +234 809 012 3456",
    categoryName: "Cutting Equipment"
  },
  {
    title: "MBO K8 Folding Machine",
    description: "High-speed folding machine with 8-buckle capability. Features automatic setup and quality monitoring. Perfect for commercial folding.",
    images: JSON.stringify(["/printer/Hc3395a7bdcc04c129641524d1f203813o.jpg_960x960q80.jpeg"]),
    contactInfo: "mbo@folding.com | +234 810 123 4567",
    categoryName: "Folding Equipment"
  },
  {
    title: "Muller Martini Presto II Binder",
    description: "Perfect binding system with automatic setup. Features glue application and cover attachment. Ideal for book production.",
    images: JSON.stringify(["/printer/Hc360f8d99cce40c3a19a87492d556cd8w.jpeg"]),
    contactInfo: "muller@binding.com | +234 811 234 5678",
    categoryName: "Binding Equipment"
  },

  // Digital Printing
  {
    title: "Epson SureColor P20000",
    description: "Large format inkjet printer for signage and graphics. Features 10-color ink system and roll-to-roll printing. Perfect for outdoor applications.",
    images: JSON.stringify(["/printer/Hc54c402d5e0745b7be5402da1ed38433f.jpg_350x350.jpeg"]),
    contactInfo: "epson@largeformat.com | +234 812 345 6789",
    categoryName: "Inkjet Printers"
  },
  {
    title: "HP LaserJet Enterprise M806x",
    description: "High-speed laser printer for office and commercial use. Features automatic duplexing and finishing options. Ideal for high-volume printing.",
    images: JSON.stringify(["/printer/Hc7930e51ff864be78aa851bd9912f8cdI.jpg_350x350.jpeg"]),
    contactInfo: "hp@laser.com | +234 813 456 7890",
    categoryName: "Laser Printers"
  },
  {
    title: "Roland VersaUV LEF-300",
    description: "UV flatbed printer for rigid materials. Features white ink capability and LED curing. Perfect for signage and packaging.",
    images: JSON.stringify(["/printer/Hd858851d5a3044a9be0c7061a31a0268s.jpg_350x350.jpeg"]),
    contactInfo: "roland@uv.com | +234 814 567 8901",
    categoryName: "UV Printers"
  },

  // Web Printing
  {
    title: "Manroland Web Systems Lithoman",
    description: "High-speed web offset press for commercial printing. Features automatic plate changing and color control. Ideal for newspaper and magazine printing.",
    images: JSON.stringify(["/printer/Hda3a2791f58e48da94ca3d65ef5f37f63.jpg_960x960q80.jpeg"]),
    contactInfo: "manroland@web.com | +234 815 678 9012",
    categoryName: "Web Offset"
  },
  {
    title: "HP PageWide Web Press T490 HD",
    description: "High-speed web digital press for commercial printing. Features variable data printing and color consistency. Perfect for transactional printing.",
    images: JSON.stringify(["/printer/Hda5324c2306e4b33893659b83fc08234D.jpg_350x350.jpeg"]),
    contactInfo: "hp@pagewide.com | +234 816 789 0123",
    categoryName: "Web Digital"
  },

  // Flexo Printing
  {
    title: "Mark Andy Performance Series P7",
    description: "High-performance flexo press for label printing. Features 10-color capability and automatic registration. Ideal for label and packaging.",
    images: JSON.stringify(["/printer/He68d5f5e5dc4424687eeab37b2426221z.jpg_960x960q80.jpeg"]),
    contactInfo: "markandy@flexo.com | +234 817 890 1234",
    categoryName: "Flexo Presses"
  },
  {
    title: "DuPont Cyrel FAST 2000TD",
    description: "Thermal flexo plate making system. Features high-resolution imaging and automatic processing. Perfect for flexo plate production.",
    images: JSON.stringify(["/printer/Hf6f84423b372497eacf7db2fdf7fce3cm.jpg_350x350.jpeg"]),
    contactInfo: "dupont@cyrel.com | +234 818 901 2345",
    categoryName: "Flexo Plates"
  },

  // Software
  {
    title: "Adobe Illustrator 2024",
    description: "Professional vector graphics software. Features advanced drawing tools and cloud integration. Essential for graphic design.",
    images: JSON.stringify(["/printer/HLB1EBTdUbvpK1RjSZPiq6zmwXXax.jpg_350x350.jpeg"]),
    contactInfo: "adobe@illustrator.com | +234 819 012 3456",
    categoryName: "Design Software"
  },
  {
    title: "Harlequin RIP Software",
    description: "Professional RIP software for high-quality output. Features advanced color management and workflow automation. Ideal for commercial printing.",
    images: JSON.stringify(["/printer/HTB12MQHSpXXXXXWaXXXq6xXFXXXB.jpg_350x350.jpeg"]),
    contactInfo: "harlequin@rip.com | +234 820 123 4567",
    categoryName: "RIP Software"
  },
  {
    title: "EFI Fiery Command WorkStation",
    description: "Print workflow management software. Features job management and color control. Perfect for digital printing operations.",
    images: JSON.stringify(["/printer/HTB1Ef22ayfrK1RjSspbq6A4pFXat.jpg_350x350.jpeg"]),
    contactInfo: "efi@fiery.com | +234 821 234 5678",
    categoryName: "Workflow Software"
  },

  // Consumables
  {
    title: "Pantone Matching System Inks",
    description: "Premium spot color inks for precise color matching. Features 1,867 solid colors and metallic inks. Essential for brand consistency.",
    images: JSON.stringify(["/printer/HTB1H7bQSXXXXXbEXVXXq6xXFXXX9.webp"]),
    contactInfo: "pantone@inks.com | +234 822 345 6789",
    categoryName: "Inks"
  },
  {
    title: "Mohawk Premium Papers",
    description: "High-quality printing papers for commercial use. Features various weights and finishes. Perfect for premium printing projects.",
    images: JSON.stringify(["/printer/HTB1KRUaSXXXXXazXpXXq6xXFXXXg.webp"]),
    contactInfo: "mohawk@papers.com | +234 823 456 7890",
    categoryName: "Papers"
  },
  {
    title: "Kodak Sonora Process Free Plates",
    description: "Process-free printing plates for offset printing. Features no chemical processing and environmental benefits. Ideal for sustainable printing.",
    images: JSON.stringify(["/printer/HTB1pM54bgoQMeJjy1Xaq6ASsFXa0.webp"]),
    contactInfo: "kodak@plates.com | +234 824 567 8901",
    categoryName: "Plates"
  },
  {
    title: "Fujifilm Pressroom Chemicals",
    description: "Complete range of pressroom chemicals and solutions. Features fountain solutions and cleaning products. Essential for press maintenance.",
    images: JSON.stringify(["/printer/HTB1qcarSXXXXXcCXVXXxh4dFXXXI.webp"]),
    contactInfo: "fujifilm@chemicals.com | +234 825 678 9012",
    categoryName: "Chemicals"
  },

  // Others
  {
    title: "Heidelberg Spare Parts Kit",
    description: "Complete spare parts kit for Heidelberg presses. Features commonly needed components and maintenance items. Essential for press reliability.",
    images: JSON.stringify(["/printer/HTB1RBgHSpXXXXXraXXXq6xXFXXXN.jpg_350x350.jpeg"]),
    contactInfo: "heidelberg@parts.com | +234 826 789 0123",
    categoryName: "Spare Parts"
  },
  {
    title: "Printing Accessories Bundle",
    description: "Essential printing accessories including tools, measuring devices, and safety equipment. Perfect for print shop setup and maintenance.",
    images: JSON.stringify(["/printer/HTB1rf0cSFXXXXb1XXXXq6xXFXXXt.jpg_350x350.jpeg"]),
    contactInfo: "accessories@print.com | +234 827 890 1234",
    categoryName: "Accessories"
  },
  {
    title: "Print Shop Maintenance Service",
    description: "Comprehensive maintenance service for printing equipment. Features preventive maintenance and emergency repairs. Essential for equipment longevity.",
    images: JSON.stringify(["/printer/HTB1udCsX.zrK1RjSspmq6AOdFXag.jpg_350x350.jpeg"]),
    contactInfo: "maintenance@print.com | +234 828 901 2345",
    categoryName: "Services"
  }
]

async function main() {
  console.log('🌱 Seeding products with categories...')

  // Get or create default user
  let defaultUserId: string
  try {
    const defaultUser = await prisma.user.findUnique({
      where: { email: 'admin@printmarketng.com' }
    })
    
    if (defaultUser) {
      defaultUserId = defaultUser.id
      console.log('✅ Using existing default user')
    } else {
      console.log('⚠️  Default user not found. Please run seed-default-user.ts first.')
      return
    }
  } catch (error) {
    console.log('❌ Error finding default user:', error)
    return
  }

  // Get all categories for mapping
  const categories = await prisma.productCategory.findMany({
    include: {
      children: true
    }
  })

  // Create a map of category names to IDs
  const categoryMap = new Map()
  categories.forEach(category => {
    categoryMap.set(category.name, category.id)
    category.children?.forEach(child => {
      categoryMap.set(child.name, child.id)
    })
  })

  // Create products with category assignments
  for (const product of products) {
    const categoryId = categoryMap.get(product.categoryName)
    
    if (!categoryId) {
      console.log(`⚠️  Category not found: ${product.categoryName}`)
      continue
    }

    try {
      const createdProduct = await prisma.product.create({
        data: {
          title: product.title,
          description: product.description,
          images: product.images,
          contactInfo: product.contactInfo,
          categoryId: categoryId,
          ownerId: defaultUserId
        }
      })
      console.log(`  ✅ Created product: ${product.title} (Category: ${product.categoryName})`)
    } catch (error) {
      console.log(`  ❌ Failed to create product: ${product.title} - ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  console.log('🎉 Products seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding products:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
