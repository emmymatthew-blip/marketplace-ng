import { query } from '../lib/db'
import bcrypt from 'bcryptjs'

// Users that match the mock conversations in app/messages/[id]/page.tsx
const messageUsers = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    role: "COMMERCIAL_PRINTER",
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
    role: "GRAPHIC_DESIGNER",
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
    role: "SOFTWARE_DEVELOPER",
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
    role: "CREATIVE_AGENCY",
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
    role: "SOFTWARE_DEVELOPER",
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
    role: "SOFTWARE_DEVELOPER",
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
    role: "END_USER_PRINTER",
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
    role: "PRINT_CONSULTANT",
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
    role: "MARKETING_AGENCY",
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
      const existingUsers = await query(
        'SELECT id FROM User WHERE email = ?',
        [userData.email]
      )

      const hashedPassword = await bcrypt.hash(userData.password, 12)
      const emailVerified = new Date().toISOString().slice(0, 19).replace('T', ' ')

      if (existingUsers && (existingUsers as any[]).length > 0) {
        // Update existing user
        await query(
          `UPDATE User SET 
            name = ?,
            companyName = ?,
            image = ?,
            isVerified = ?,
            country = ?,
            cityState = ?,
            location = ?,
            phone = ?,
            bio = ?,
            role = ?,
            password = ?,
            emailVerified = ?
          WHERE email = ?`,
          [
            userData.name,
            userData.companyName,
            userData.image,
            userData.isVerified ? 1 : 0,
            userData.country,
            userData.cityState,
            userData.location,
            userData.phone,
            userData.bio,
            userData.role,
            hashedPassword,
            emailVerified,
            userData.email
          ]
        )
        console.log(`  ✅ Updated user: ${userData.name} (${userData.email})`)
      } else {
        // Try to create with specific ID
        try {
          await query(
            `INSERT INTO User (
              id, name, email, password, role, companyName, image, isVerified,
              country, cityState, location, phone, bio, emailVerified, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              userData.id,
              userData.name,
              userData.email,
              hashedPassword,
              userData.role,
              userData.companyName,
              userData.image,
              userData.isVerified ? 1 : 0,
              userData.country,
              userData.cityState,
              userData.location,
              userData.phone,
              userData.bio,
              emailVerified
            ]
          )
          console.log(`  ✅ Created user: ${userData.name} (${userData.email}) with ID: ${userData.id}`)
        } catch (idError: any) {
          // If ID conflict, create without ID (let database generate)
          const result = await query(
            `INSERT INTO User (
              name, email, password, role, companyName, image, isVerified,
              country, cityState, location, phone, bio, emailVerified, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              userData.name,
              userData.email,
              hashedPassword,
              userData.role,
              userData.companyName,
              userData.image,
              userData.isVerified ? 1 : 0,
              userData.country,
              userData.cityState,
              userData.location,
              userData.phone,
              userData.bio,
              emailVerified
            ]
          )
          console.log(`  ✅ Created user: ${userData.name} (${userData.email}) with generated ID`)
          console.log(`  ⚠️  Note: Mock conversation uses ID "${userData.id}", but user has a different ID`)
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


