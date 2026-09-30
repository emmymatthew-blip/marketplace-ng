import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const productCategories = [
  {
    name: 'Press',
    slug: 'press',
    description: 'Printing presses and machinery for various printing processes',
    icon: 'Printer',
    sortOrder: 1,
    children: [
      {
        name: 'Offset Press',
        slug: 'offset-press',
        description: 'Offset printing presses for commercial printing',
        icon: 'Printer',
        sortOrder: 1
      },
      {
        name: 'Digital Press',
        slug: 'digital-press',
        description: 'Digital printing presses and equipment',
        icon: 'Printer',
        sortOrder: 2
      },
      {
        name: 'Screen Press',
        slug: 'screen-press',
        description: 'Screen printing presses and equipment',
        icon: 'Printer',
        sortOrder: 3
      }
    ]
  },
  {
    name: 'Pre Press',
    slug: 'pre-press',
    description: 'Pre-press equipment and software for print preparation',
    icon: 'Monitor',
    sortOrder: 2,
    children: [
      {
        name: 'CTP Systems',
        slug: 'ctp-systems',
        description: 'Computer-to-plate systems and equipment',
        icon: 'Monitor',
        sortOrder: 1
      },
      {
        name: 'Proofing Systems',
        slug: 'proofing-systems',
        description: 'Digital proofing and color management systems',
        icon: 'Monitor',
        sortOrder: 2
      },
      {
        name: 'Pre-press Software',
        slug: 'pre-press-software',
        description: 'Software for pre-press operations',
        icon: 'Monitor',
        sortOrder: 3
      }
    ]
  },
  {
    name: 'Post Press',
    slug: 'post-press',
    description: 'Post-press finishing equipment and machinery',
    icon: 'Scissors',
    sortOrder: 3,
    children: [
      {
        name: 'Cutting Equipment',
        slug: 'cutting-equipment',
        description: 'Cutting and trimming equipment',
        icon: 'Scissors',
        sortOrder: 1
      },
      {
        name: 'Folding Equipment',
        slug: 'folding-equipment',
        description: 'Folding and creasing machines',
        icon: 'Scissors',
        sortOrder: 2
      },
      {
        name: 'Binding Equipment',
        slug: 'binding-equipment',
        description: 'Binding and finishing equipment',
        icon: 'Scissors',
        sortOrder: 3
      }
    ]
  },
  {
    name: 'Digital Printing',
    slug: 'digital-printing',
    description: 'Digital printing equipment and solutions',
    icon: 'Monitor',
    sortOrder: 4,
    children: [
      {
        name: 'Inkjet Printers',
        slug: 'inkjet-printers',
        description: 'Inkjet printing equipment',
        icon: 'Monitor',
        sortOrder: 1
      },
      {
        name: 'Laser Printers',
        slug: 'laser-printers',
        description: 'Laser printing equipment',
        icon: 'Monitor',
        sortOrder: 2
      },
      {
        name: 'UV Printers',
        slug: 'uv-printers',
        description: 'UV printing equipment',
        icon: 'Monitor',
        sortOrder: 3
      }
    ]
  },
  {
    name: 'Web Printing',
    slug: 'web-printing',
    description: 'Web printing equipment and machinery',
    icon: 'Globe',
    sortOrder: 5,
    children: [
      {
        name: 'Web Offset',
        slug: 'web-offset',
        description: 'Web offset printing equipment',
        icon: 'Globe',
        sortOrder: 1
      },
      {
        name: 'Web Digital',
        slug: 'web-digital',
        description: 'Web digital printing equipment',
        icon: 'Globe',
        sortOrder: 2
      }
    ]
  },
  {
    name: 'Flexo Printing',
    slug: 'flexo-printing',
    description: 'Flexographic printing equipment and supplies',
    icon: 'Printer',
    sortOrder: 6,
    children: [
      {
        name: 'Flexo Presses',
        slug: 'flexo-presses',
        description: 'Flexographic printing presses',
        icon: 'Printer',
        sortOrder: 1
      },
      {
        name: 'Flexo Plates',
        slug: 'flexo-plates',
        description: 'Flexographic printing plates',
        icon: 'Printer',
        sortOrder: 2
      }
    ]
  },
  {
    name: 'Software',
    slug: 'software',
    description: 'Printing and design software solutions',
    icon: 'Monitor',
    sortOrder: 7,
    children: [
      {
        name: 'Design Software',
        slug: 'design-software',
        description: 'Graphic design and layout software',
        icon: 'Monitor',
        sortOrder: 1
      },
      {
        name: 'RIP Software',
        slug: 'rip-software',
        description: 'Raster Image Processing software',
        icon: 'Monitor',
        sortOrder: 2
      },
      {
        name: 'Workflow Software',
        slug: 'workflow-software',
        description: 'Print workflow management software',
        icon: 'Monitor',
        sortOrder: 3
      }
    ]
  },
  {
    name: 'Consumables',
    slug: 'consumables',
    description: 'Printing consumables and supplies',
    icon: 'Package',
    sortOrder: 8,
    children: [
      {
        name: 'Inks',
        slug: 'inks',
        description: 'Printing inks and toners',
        icon: 'Package',
        sortOrder: 1
      },
      {
        name: 'Papers',
        slug: 'papers',
        description: 'Printing papers and substrates',
        icon: 'Package',
        sortOrder: 2
      },
      {
        name: 'Plates',
        slug: 'plates',
        description: 'Printing plates and cylinders',
        icon: 'Package',
        sortOrder: 3
      },
      {
        name: 'Chemicals',
        slug: 'chemicals',
        description: 'Printing chemicals and solutions',
        icon: 'Package',
        sortOrder: 4
      }
    ]
  },
  {
    name: 'Others',
    slug: 'others',
    description: 'Other printing equipment and supplies',
    icon: 'Package',
    sortOrder: 9,
    children: [
      {
        name: 'Spare Parts',
        slug: 'spare-parts',
        description: 'Spare parts and components',
        icon: 'Package',
        sortOrder: 1
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Printing accessories and tools',
        icon: 'Package',
        sortOrder: 2
      },
      {
        name: 'Services',
        slug: 'services',
        description: 'Printing services and maintenance',
        icon: 'Package',
        sortOrder: 3
      }
    ]
  }
]

async function main() {
  console.log('🌱 Seeding product categories...')

  for (const categoryData of productCategories) {
    const { children, ...categoryInfo } = categoryData
    
    // Create parent category
    const parentCategory = await prisma.productCategory.upsert({
      where: { slug: categoryInfo.slug },
      update: categoryInfo,
      create: categoryInfo
    })

    console.log(`✅ Created category: ${parentCategory.name}`)

    // Create child categories
    if (children) {
      for (const childData of children) {
        await prisma.productCategory.upsert({
          where: { slug: childData.slug },
          update: { ...childData, parentId: parentCategory.id },
          create: { ...childData, parentId: parentCategory.id }
        })
        console.log(`  ✅ Created subcategory: ${childData.name}`)
      }
    }
  }

  console.log('🎉 Product categories seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding categories:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
