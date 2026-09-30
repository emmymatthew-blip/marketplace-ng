import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Users that match the mock conversations in app/messages/[id]/page.tsx
const messageUsers = [
  {
    id: "user1", // Using specific ID to match mock data
    name: "John Doe",
    email: "john@example.com",
    role: "COMMERCIAL_PRINTER" as UserRole,
    companyName: "PrintTech Solutions",
    image: "/profile-images/studio-portrait-of-decision-making-businesswoman-in-businesswear.webp",
    isVerified: true,
    country: "Nigeria",
    cityState: "Lagos",
    location: "Lagos, Nigeria",
    phone: "+234 801 234 5678",
    bio: "Leading provider of high-quality printing machinery and equipment. Specializing in offset printing machines.",
    password: "password123"
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "GRAPHIC_DESIGNER" as UserRole,
    companyName: "Design Studio",
    image: "/profile-images/portrait-of-beautiful-middle-aged-woman-indoors-space-for-text.webp",
    isVerified: false,
    country: "Nigeria",
    cityState: "Abuja",
    location: "Abuja, Nigeria",
    phone: "+234 802 345 6789",
    bio: "Creative design studio specializing in brand identity and marketing materials.",
    password: "password123"
  },
  {
    id: "user3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "SOFTWARE_DEVELOPER" as UserRole,
    companyName: "Tech Solutions Inc",
    image: "/profile-images/beauty-portrait-of-a-young-beautiful-asian-woman.webp",
    isVerified: true,
    country: "Nigeria",
    cityState: "Lagos",
    location: "Lagos, Nigeria",
    phone: "+234 803 456 7890",
    bio: "Custom software solutions for print workflow management and automation.",
    password: "password123"
  },
  {
    id: "user4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "CREATIVE_AGENCY" as UserRole,
    companyName: "Creative Designs",
    image: "/profile-images/skincare-portrait-and-woman-in-studio-for-beauty-wellness-and-acne-treatment-progress-or.webp",
    isVerified: true,
    country: "Nigeria",
    cityState: "Port Harcourt",
    location: "Port Harcourt, Nigeria",
    phone: "+234 804 567 8901",
    bio: "Award-winning creative agency specializing in brand identity and packaging design.",
    password: "password123"
  },
  {
    id: "user5",
    name: "Emily Chen",
    email: "emily@example.com",
    role: "SOFTWARE_DEVELOPER" as UserRole,
    companyName: "Web Development Co",
    image: "/profile-images/smiling-woman-with-hands-on-face-in-bathroom.webp",
    isVerified: true,
    country: "Nigeria",
    cityState: "Lagos",
    location: "Lagos, Nigeria",
    phone: "+234 805 678 9012",
    bio: "Web development and digital solutions for the printing industry.",
    password: "password123"
  },
  {
    id: "user6",
    name: "Alex Thompson",
    email: "alex@example.com",
    role: "SOFTWARE_DEVELOPER" as UserRole,
    companyName: "Mobile Apps Ltd",
    image: "/placeholder.svg",
    isVerified: false,
    country: "Nigeria",
    cityState: "Ibadan",
    location: "Ibadan, Nigeria",
    phone: "+234 806 789 0123",
    bio: "Mobile application development for print businesses.",
    password: "password123"
  },
  {
    id: "user7",
    name: "Lisa Anderson",
    email: "lisa@example.com",
    role: "CONTENT_CREATION_STUDIO" as UserRole,
    companyName: "Content Creation Studio",
    image: "/placeholder.svg",
    isVerified: true,
    country: "Nigeria",
    cityState: "Lagos",
    location: "Lagos, Nigeria",
    phone: "+234 807 890 1234",
    bio: "Content creation and marketing services for print businesses.",
    password: "password123"
  },
  {
    id: "user8",
    name: "Robert Garcia",
    email: "robert@example.com",
    role: "PRINT_CONSULTANT" as UserRole,
    companyName: "SEO Experts",
    image: "/placeholder.svg",
    isVerified: true,
    country: "Nigeria",
    cityState: "Abuja",
    location: "Abuja, Nigeria",
    phone: "+234 808 901 2345",
    bio: "SEO and digital marketing services for print businesses.",
    password: "password123"
  },
  {
    id: "user9",
    name: "Sophie Martin",
    email: "sophie@example.com",
    role: "MARKETING_AGENCY" as UserRole,
    companyName: "Social Media Agency",
    image: "/placeholder.svg",
    isVerified: false,
    country: "Nigeria",
    cityState: "Kano",
    location: "Kano, Nigeria",
    phone: "+234 809 012 3456",
    bio: "Social media marketing and advertising services.",
    password: "password123"
  }
]

async function main() {
  console.log('👥 Seeding message users (matching mock conversations)...')
  
  for (const userData of messageUsers) {
    try {
      // Check if user already exists by email
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (existingUser) {
        // Update existing user to match mock data
        const hashedPassword = await bcrypt.hash(userData.password, 12)
        
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: userData.name,
            companyName: userData.companyName,
            image: userData.image,
            isVerified: userData.isVerified,
            country: userData.country,
            cityState: userData.cityState,
            location: userData.location,
            phone: userData.phone,
            bio: userData.bio,
            role: userData.role,
            password: hashedPassword,
            emailVerified: new Date()
          }
        })
        console.log(`  ✅ Updated user: ${userData.name} (${userData.email})`)
      } else {
        // Try to create with specific ID first
        const hashedPassword = await bcrypt.hash(userData.password, 12)
        
        try {
          await prisma.user.create({
            data: {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              password: hashedPassword,
              role: userData.role,
              companyName: userData.companyName,
              image: userData.image,
              isVerified: userData.isVerified,
              country: userData.country,
              cityState: userData.cityState,
              location: userData.location,
              phone: userData.phone,
              bio: userData.bio,
              emailVerified: new Date()
            }
          })
          console.log(`  ✅ Created user: ${userData.name} (${userData.email}) with ID: ${userData.id}`)
        } catch (idError) {
          // If ID conflict, create without ID (let Prisma generate)
          const newUser = await prisma.user.create({
            data: {
              name: userData.name,
              email: userData.email,
              password: hashedPassword,
              role: userData.role,
              companyName: userData.companyName,
              image: userData.image,
              isVerified: userData.isVerified,
              country: userData.country,
              cityState: userData.cityState,
              location: userData.location,
              phone: userData.phone,
              bio: userData.bio,
              emailVerified: new Date()
            }
          })
          console.log(`  ✅ Created user: ${userData.name} (${userData.email}) with generated ID: ${newUser.id}`)
          console.log(`  ⚠️  Note: Mock conversation uses ID "${userData.id}", but user has ID "${newUser.id}"`)
        }
      }
    } catch (error) {
      console.log(`  ❌ Failed to create/update user: ${userData.name} - ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  console.log('🎉 Message users seeding completed!')
  console.log('📝 Note: If user IDs don\'t match mock conversations, the API will fetch users by email instead.')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding message users:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


