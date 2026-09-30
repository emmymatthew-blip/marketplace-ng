import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  // Equipment Manufacturers Products
  {
    title: "Heidelberg Speedmaster XL 106-8P",
    description: "8-color perfecting offset press with advanced automation. Features perfecting, coating, and drying capabilities. Ideal for commercial printing and packaging applications.",
    categoryName: "Offset Press",
    images: ["/images/Canon-pixma-2 1.png"],
    contactInfo: "info@heidelberg.ng | +234 801 234 5678",
    vendorEmail: "info@heidelberg.ng"
  },
  {
    title: "Komori Lithrone G40-8P",
    description: "Advanced 8-color offset press with H-UV curing system. Features automatic plate changing and advanced color management. Perfect for high-quality commercial printing.",
    categoryName: "Offset Press",
    images: ["/images/image 87.png"],
    contactInfo: "sales@komori-wa.com | +234 802 345 6789",
    vendorEmail: "sales@komori-wa.com"
  },
  {
    title: "HP Indigo 12000 Digital Press",
    description: "High-speed digital press for commercial printing. Features 7-color printing and advanced color management. Ideal for variable data printing and short runs.",
    categoryName: "Digital Press",
    images: ["/images/797867fbc3.jpg"],
    contactInfo: "print@hp.ng | +234 803 456 7890",
    vendorEmail: "print@hp.ng"
  },
  {
    title: "Canon imagePRESS C10000VP",
    description: "Production digital press with high-speed printing up to 100 pages per minute. Features advanced finishing options and color consistency.",
    categoryName: "Digital Press",
    images: ["/images/8921fe63ae.jpg"],
    contactInfo: "print@hp.ng | +234 803 456 7890",
    vendorEmail: "print@hp.ng"
  },

  // Consumables Products
  {
    title: "DIC Offset Inks - Premium Series",
    description: "High-quality offset printing inks with excellent color reproduction and fast drying properties. Available in CMYK and spot colors.",
    categoryName: "Inks",
    images: ["/images/IMG_9890 1 (2).png"],
    contactInfo: "info@dic-nigeria.com | +234 804 567 8901",
    vendorEmail: "info@dic-nigeria.com"
  },
  {
    title: "Flint Group UV Coatings",
    description: "Premium UV coatings for enhanced print finish and protection. Available in gloss, matte, and special effects finishes.",
    categoryName: "Chemicals",
    images: ["/images/Canon-pixma-2 1.png"],
    contactInfo: "sales@flintgroup-africa.com | +234 805 678 9012",
    vendorEmail: "sales@flintgroup-africa.com"
  },
  {
    title: "DIC Digital Toners",
    description: "High-quality digital toners for laser printers and digital presses. Excellent color accuracy and consistency.",
    categoryName: "Inks",
    images: ["/images/image 87.png"],
    contactInfo: "info@dic-nigeria.com | +234 804 567 8901",
    vendorEmail: "info@dic-nigeria.com"
  },

  // Commercial Printing Services
  {
    title: "Corporate Brochure Printing",
    description: "High-quality corporate brochure printing services. Full-color offset printing with various finishing options including binding, lamination, and embossing.",
    categoryName: "Offset Press",
    images: ["/images/797867fbc3.jpg"],
    contactInfo: "info@printtech.ng | +234 806 789 0123",
    vendorEmail: "info@printtech.ng"
  },
  {
    title: "Business Card Printing",
    description: "Premium business card printing with various paper stocks and finishing options. Fast turnaround and competitive pricing.",
    categoryName: "Digital Press",
    images: ["/images/8921fe63ae.jpg"],
    contactInfo: "contact@eliteprint.ng | +234 807 890 1234",
    vendorEmail: "contact@eliteprint.ng"
  },
  {
    title: "Marketing Materials Package",
    description: "Complete marketing materials package including business cards, letterheads, envelopes, and brochures. Consistent branding across all materials.",
    categoryName: "Digital Press",
    images: ["/images/IMG_9890 1 (2).png"],
    contactInfo: "hello@digitalprintexpress.ng | +234 808 901 2345",
    vendorEmail: "hello@digitalprintexpress.ng"
  },

  // Digital Printing Services
  {
    title: "Variable Data Printing",
    description: "Personalized printing services for direct mail campaigns. Variable text, images, and graphics for targeted marketing.",
    categoryName: "Digital Press",
    images: ["/images/Canon-pixma-2 1.png"],
    contactInfo: "hello@digitalprintexpress.ng | +234 808 901 2345",
    vendorEmail: "hello@digitalprintexpress.ng"
  },
  {
    title: "Express Business Cards",
    description: "Same-day business card printing service. High-quality digital printing with various paper options and finishes.",
    categoryName: "Digital Press",
    images: ["/images/image 87.png"],
    contactInfo: "info@quickprint.ng | +234 809 012 3456",
    vendorEmail: "info@quickprint.ng"
  },
  {
    title: "Photo Printing Services",
    description: "High-quality photo printing on various media including canvas, vinyl, and fine art papers. Professional color management.",
    categoryName: "Digital Press",
    images: ["/images/797867fbc3.jpg"],
    contactInfo: "info@quickprint.ng | +234 809 012 3456",
    vendorEmail: "info@quickprint.ng"
  },

  // Screen Printing Services
  {
    title: "T-Shirt Screen Printing",
    description: "Custom t-shirt printing services for events, promotions, and merchandise. High-quality screen printing on various fabric types.",
    categoryName: "Screen Press",
    images: ["/images/8921fe63ae.jpg"],
    contactInfo: "sales@screenmasters.ng | +234 810 123 4567",
    vendorEmail: "sales@screenmasters.ng"
  },
  {
    title: "Poster Screen Printing",
    description: "Large format poster printing using screen printing technology. Vibrant colors and durable prints for outdoor use.",
    categoryName: "Screen Press",
    images: ["/images/IMG_9890 1 (2).png"],
    contactInfo: "sales@screenmasters.ng | +234 810 123 4567",
    vendorEmail: "sales@screenmasters.ng"
  },

  // Large Format Printing
  {
    title: "Vehicle Wrap Printing",
    description: "Full vehicle wrap printing and installation services. High-quality vinyl printing with professional installation.",
    categoryName: "UV Printers",
    images: ["/images/Canon-pixma-2 1.png"],
    contactInfo: "info@bannerpro.ng | +234 811 234 5678",
    vendorEmail: "info@bannerpro.ng"
  },
  {
    title: "Billboard Printing",
    description: "Large format billboard printing for outdoor advertising. Weather-resistant materials and high-resolution printing.",
    categoryName: "UV Printers",
    images: ["/images/image 87.png"],
    contactInfo: "info@bannerpro.ng | +234 811 234 5678",
    vendorEmail: "info@bannerpro.ng"
  },
  {
    title: "Banner Printing Services",
    description: "Custom banner printing for events, trade shows, and advertising. Various sizes and materials available.",
    categoryName: "UV Printers",
    images: ["/images/797867fbc3.jpg"],
    contactInfo: "info@bannerpro.ng | +234 811 234 5678",
    vendorEmail: "info@bannerpro.ng"
  },

  // Packaging Printing
  {
    title: "Food Packaging Printing",
    description: "Specialized packaging printing for food products. FDA-compliant inks and materials for food safety.",
    categoryName: "Flexo Presses",
    images: ["/images/8921fe63ae.jpg"],
    contactInfo: "contact@packprint.ng | +234 812 345 6789",
    vendorEmail: "contact@packprint.ng"
  },
  {
    title: "Pharmaceutical Label Printing",
    description: "High-quality label printing for pharmaceutical products. Compliant with industry standards and regulations.",
    categoryName: "Flexo Presses",
    images: ["/images/IMG_9890 1 (2).png"],
    contactInfo: "contact@packprint.ng | +234 812 345 6789",
    vendorEmail: "contact@packprint.ng"
  },

  // Software Solutions
  {
    title: "Print Workflow Management System",
    description: "Comprehensive workflow management software for print businesses. Job tracking, scheduling, and resource management.",
    categoryName: "Workflow Software",
    images: ["/images/Canon-pixma-2 1.png"],
    contactInfo: "support@printsoft.ng | +234 814 567 8901",
    vendorEmail: "support@printsoft.ng"
  },
  {
    title: "Color Management Software",
    description: "Advanced color management software for consistent color reproduction across different devices and substrates.",
    categoryName: "Design Software",
    images: ["/images/image 87.png"],
    contactInfo: "support@printsoft.ng | +234 814 567 8901",
    vendorEmail: "support@printsoft.ng"
  },

  // Design Services
  {
    title: "Brand Identity Design",
    description: "Complete brand identity design including logo, business cards, letterheads, and brand guidelines.",
    categoryName: "Design Software",
    images: ["/images/797867fbc3.jpg"],
    contactInfo: "hello@creativedesign.ng | +234 813 456 7890",
    vendorEmail: "hello@creativedesign.ng"
  },
  {
    title: "Packaging Design Services",
    description: "Professional packaging design for products. Structural design, graphics, and print-ready artwork.",
    categoryName: "Design Software",
    images: ["/images/8921fe63ae.jpg"],
    contactInfo: "hello@creativedesign.ng | +234 813 456 7890",
    vendorEmail: "hello@creativedesign.ng"
  },

  // Equipment Sales
  {
    title: "Used Heidelberg Presses",
    description: "Quality used Heidelberg printing presses. Fully refurbished and tested. Includes installation and training.",
    categoryName: "Offset Press",
    images: ["/images/IMG_9890 1 (2).png"],
    contactInfo: "sales@printequipment.ng | +234 815 678 9012",
    vendorEmail: "sales@printequipment.ng"
  },
  {
    title: "Digital Press Maintenance",
    description: "Comprehensive maintenance services for digital printing equipment. Preventive maintenance and emergency repairs.",
    categoryName: "Digital Press",
    images: ["/images/Canon-pixma-2 1.png"],
    contactInfo: "sales@printequipment.ng | +234 815 678 9012",
    vendorEmail: "sales@printequipment.ng"
  },

  // Consulting Services
  {
    title: "Print Business Consulting",
    description: "Strategic consulting for print businesses. Business planning, workflow optimization, and technology implementation.",
    categoryName: "Workflow Software",
    images: ["/images/image 87.png"],
    contactInfo: "info@printconsult.africa | +234 816 789 0123",
    vendorEmail: "info@printconsult.africa"
  },
  {
    title: "Workflow Optimization",
    description: "Comprehensive workflow analysis and optimization services. Process improvement and efficiency enhancement.",
    categoryName: "Workflow Software",
    images: ["/images/797867fbc3.jpg"],
    contactInfo: "info@printconsult.africa | +234 816 789 0123",
    vendorEmail: "info@printconsult.africa"
  },

  // Training Services
  {
    title: "Print Technology Training",
    description: "Professional training programs for print technology. Hands-on training on modern printing equipment.",
    categoryName: "Workflow Software",
    images: ["/images/8921fe63ae.jpg"],
    contactInfo: "admissions@printacademy.ng | +234 817 890 1234",
    vendorEmail: "admissions@printacademy.ng"
  },
  {
    title: "Color Management Certification",
    description: "Certified color management training program. Industry-recognized certification for color professionals.",
    categoryName: "Design Software",
    images: ["/images/IMG_9890 1 (2).png"],
    contactInfo: "admissions@printacademy.ng | +234 817 890 1234",
    vendorEmail: "admissions@printacademy.ng"
  },

  // Small Business Services
  {
    title: "Local Print Services",
    description: "Comprehensive printing services for local businesses. Business cards, flyers, posters, and promotional materials.",
    categoryName: "Digital Press",
    images: ["/images/Canon-pixma-2 1.png"],
    contactInfo: "john@adebayoprint.ng | +234 818 901 2345",
    vendorEmail: "john@adebayoprint.ng"
  }
]

async function main() {
  console.log('🛍️ Seeding additional products...')
  
  // Get all categories for mapping
  const categories = await prisma.productCategory.findMany({
    include: {
      children: true
    }
  })

  // Create category map
  const categoryMap = new Map()
  categories.forEach(category => {
    categoryMap.set(category.name, category.id)
    category.children?.forEach(child => {
      categoryMap.set(child.name, child.id)
    })
  })

  // Get all vendors for mapping
  const vendors = await prisma.user.findMany({
    where: {
      role: {
        not: 'ADMIN'
      }
    }
  })

  const vendorMap = new Map()
  vendors.forEach(vendor => {
    vendorMap.set(vendor.email, vendor.id)
  })

  for (const product of products) {
    try {
      const categoryId = categoryMap.get(product.categoryName)
      const ownerId = vendorMap.get(product.vendorEmail)

      if (!categoryId) {
        console.log(`  ⚠️  Category not found: ${product.categoryName}`)
        continue
      }

      if (!ownerId) {
        console.log(`  ⚠️  Vendor not found: ${product.vendorEmail}`)
        continue
      }

      // Check if product already exists
      const existingProduct = await prisma.product.findFirst({
        where: {
          title: product.title,
          ownerId: ownerId
        }
      })

      if (existingProduct) {
        console.log(`  ⚠️  Product already exists: ${product.title}`)
        continue
      }

      // Create product
      await prisma.product.create({
        data: {
          title: product.title,
          description: product.description,
          images: JSON.stringify(product.images),
          contactInfo: product.contactInfo,
          categoryId: categoryId,
          ownerId: ownerId
        }
      })

      console.log(`  ✅ Created product: ${product.title} (Category: ${product.categoryName}, Vendor: ${product.vendorEmail})`)
    } catch (error) {
      console.log(`  ❌ Failed to create product: ${product.title} - ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  console.log('🎉 Additional products seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding additional products:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
