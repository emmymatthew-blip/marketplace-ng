import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('👤 Creating default user...')

  try {
    // Check if default user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@printmarketng.com' }
    })

    if (existingUser) {
      console.log('✅ Default user already exists')
      return existingUser.id
    }

    // Create default user
    const defaultUser = await prisma.user.create({
      data: {
        email: 'admin@printmarketng.com',
        name: 'PrintMarket NG Admin',
        emailVerified: new Date(),
        role: 'ADMIN',
        isVerified: true,
        location: 'Lagos, Nigeria',
        bio: 'Default administrator account for PrintMarket NG'
      }
    })

    console.log(`✅ Created default user: ${defaultUser.name} (${defaultUser.id})`)
    return defaultUser.id
  } catch (error) {
    console.error('❌ Error creating default user:', error)
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
