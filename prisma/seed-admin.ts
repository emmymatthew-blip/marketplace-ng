import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('👤 Creating/updating admin user...')

  try {
    const adminEmail = 'admin@printmarketng.com'
    const adminPassword = 'admin123'
    
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingUser) {
      // Update existing admin user with password and ensure role is ADMIN
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          role: 'ADMIN',
          isVerified: true,
          emailVerified: existingUser.emailVerified || new Date(),
        }
      })

      console.log(`✅ Updated admin user: ${updatedUser.name} (${updatedUser.id})`)
      console.log('📧 Email:', adminEmail)
      console.log('🔑 Password:', adminPassword)
      return updatedUser.id
    } else {
      // Create new admin user with password
      const hashedPassword = await bcrypt.hash(adminPassword, 12)

      const adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
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
      console.log('📧 Email:', adminEmail)
      console.log('🔑 Password:', adminPassword)
      console.log('\n⚠️  IMPORTANT: Change the default password after first login!')
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
