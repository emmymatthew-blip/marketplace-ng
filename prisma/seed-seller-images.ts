import { PrismaClient } from '@prisma/client'
import { isSeller } from '../lib/user-roles'

const prisma = new PrismaClient()

// Professional portrait images from Unsplash
// Using specific photo IDs for consistent, professional-looking portraits
const unsplashPortraits = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1577880216142-8549e9488d6a?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1621592484082-2d05b1290d7a?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1639149888905-fb39731f2f6c?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1648415041078-d5b259c683be?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1654110455429-cf322b40a906?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1664203068145-b1d7d1680f6c?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1682089804117-cea5d901647f?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1700317440795-4f52d9364783?w=400&h=400&fit=crop&crop=faces',
]

// Get a random image from the array
function getRandomPortrait(): string {
  return unsplashPortraits[Math.floor(Math.random() * unsplashPortraits.length)]
}

async function main() {
  console.log('🖼️  Seeding seller profile images from Unsplash...')
  
  try {
    // Fetch all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true
      }
    })

    console.log(`📊 Found ${allUsers.length} total users`)

    // Filter to only sellers
    const sellers = allUsers.filter(user => isSeller(user.role))
    
    console.log(`👥 Found ${sellers.length} sellers to update`)

    let updated = 0
    let skipped = 0

    for (const seller of sellers) {
      try {
        // Skip if already has an Unsplash image
        if (seller.image && seller.image.includes('unsplash.com')) {
          console.log(`  ⏭️  Skipping ${seller.name || seller.email} - already has Unsplash image`)
          skipped++
          continue
        }

        // Get a random portrait
        const portraitUrl = getRandomPortrait()

        // Update the seller's image
        await prisma.user.update({
          where: { id: seller.id },
          data: { image: portraitUrl }
        })

        console.log(`  ✅ Updated ${seller.name || seller.email} with Unsplash image`)
        updated++
      } catch (error) {
        console.error(`  ❌ Failed to update ${seller.name || seller.email}:`, error instanceof Error ? error.message : String(error))
      }
    }

    console.log('\n📈 Summary:')
    console.log(`  ✅ Updated: ${updated}`)
    console.log(`  ⏭️  Skipped: ${skipped}`)
    console.log(`  📊 Total sellers: ${sellers.length}`)
    console.log('🎉 Seller image seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding seller images:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

