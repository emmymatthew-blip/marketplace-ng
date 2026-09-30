import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('👤 Creating test user with password...')

  try {
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@printmarketng.com' }
    })

    if (existingUser) {
      console.log('✅ Test user already exists')
      return existingUser.id
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 12)

    // Create test user with password
    const testUser = await prisma.user.create({
      data: {
        email: 'test@printmarketng.com',
        name: 'Test User',
        password: hashedPassword,
        emailVerified: new Date(),
        role: 'END_USER_PRINTER',
        isVerified: true,
        location: 'Lagos, Nigeria',
        bio: 'Test user account for PrintMarket NG',
        firstName: 'Test',
        lastName: 'User',
        country: 'nigeria',
        cityState: 'Lagos'
      }
    })

    console.log(`✅ Created test user: ${testUser.name} (${testUser.id})`)
    console.log('📧 Email: test@printmarketng.com')
    console.log('🔑 Password: password123')
    return testUser.id
  } catch (error) {
    console.error('❌ Error creating test user:', error)
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
