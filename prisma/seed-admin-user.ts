import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('👤 Creating admin user with password...')

  try {
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@printmarketng.com' }
    })

    if (existingUser) {
      // Update existing admin user with password
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
        }
      })

      console.log(`✅ Updated admin user with password: ${updatedUser.name} (${updatedUser.id})`)
      console.log('📧 Email: admin@printmarketng.com')
      console.log('🔑 Password: admin123')
      return updatedUser.id
    } else {
      // Create new admin user with password
      const hashedPassword = await bcrypt.hash('admin123', 12)

      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@printmarketng.com',
          name: 'PrintMarket NG Admin',
          password: hashedPassword,
          emailVerified: new Date(),
          role: 'ADMIN',
          isVerified: true,
          location: 'Lagos, Nigeria',
          bio: 'Default administrator account for PrintMarket NG',
          firstName: 'Admin',
          lastName: 'User',
          country: 'nigeria',
          cityState: 'Lagos'
        }
      })

      console.log(`✅ Created admin user: ${adminUser.name} (${adminUser.id})`)
      console.log('📧 Email: admin@printmarketng.com')
      console.log('🔑 Password: admin123')
      return adminUser.id
    }
  } catch (error) {
    console.error('❌ Error creating/updating admin user:', error)
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
