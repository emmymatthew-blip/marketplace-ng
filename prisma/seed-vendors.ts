import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

// Professional portrait images from Unsplash
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
  'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=400&fit=crop&crop=faces',
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

const vendors = [
  // Equipment Manufacturers
  {
    name: "Heidelberg Nigeria",
    email: "info@heidelberg.ng",
    role: "EQUIPMENT_MANUFACTURER" as UserRole,
    companyName: "Heidelberg Nigeria Limited",
    jobTitle: "Sales Manager",
    companyWebsite: "https://heidelberg.ng",
    country: "Nigeria",
    cityState: "Lagos",
    location: "Lagos, Nigeria",
    phone: "+234 801 234 5678",
    bio: "Leading manufacturer of offset printing presses and digital printing solutions. Serving the Nigerian printing industry with world-class equipment and support.",
    isVerified: true,
    hasCipponMembership: true,
    cipponMembershipType: "CORPORATE" as any,
    cipponMembershipNumber: "CIPPON001",
    image: getRandomPortrait()
  },
  {
    name: "Komori West Africa",
    email: "sales@komori-wa.com",
    role: "EQUIPMENT_MANUFACTURER" as UserRole,
    companyName: "Komori West Africa",
    jobTitle: "Regional Director",
    companyWebsite: "https://komori-wa.com",
    country: "Nigeria",
    cityState: "Abuja",
    location: "Abuja, Nigeria",
    phone: "+234 802 345 6789",
    bio: "Specialized in advanced offset printing technology and automation solutions for the African market.",
    isVerified: true,
    hasCipponMembership: true,
    cipponMembershipType: "CORPORATE" as any,
    cipponMembershipNumber: "CIPPON002",
    image: getRandomPortrait()
  },
  {
    name: "HP Nigeria",
    email: "print@hp.ng",
    role: "EQUIPMENT_MANUFACTURER" as UserRole,
    companyName: "HP Nigeria",
    jobTitle: "Print Solutions Manager",
    companyWebsite: "https://hp.ng",
    country: "Nigeria",
    cityState: "Lagos",
    location: "Lagos, Nigeria",
    phone: "+234 803 456 7890",
    bio: "Global leader in digital printing technology, providing innovative solutions for commercial and industrial printing.",
    isVerified: true,
    hasCipponMembership: true,
    cipponMembershipType: "CORPORATE" as any,
    cipponMembershipNumber: "CIPPON003",
    image: getRandomPortrait()
  },

  // Consumables Manufacturers
  {
    name: "DIC Nigeria",
    email: "info@dic-nigeria.com",
    role: "CONSUMABLES_MANUFACTURER" as UserRole,
    companyName: "DIC Nigeria Limited",
    jobTitle: "Technical Director",
    companyWebsite: "https://dic-nigeria.com",
    country: "Nigeria",
    cityState: "Port Harcourt",
    location: "Port Harcourt, Nigeria",
    phone: "+234 804 567 8901",
    bio: "Manufacturer of high-quality printing inks, coatings, and consumables for all printing processes.",
    isVerified: true,
    hasCipponMembership: true,
    cipponMembershipType: "CORPORATE" as any,
    cipponMembershipNumber: "CIPPON004",
    image: getRandomPortrait()
  },
  {
    name: "Flint Group Africa",
    email: "sales@flintgroup-africa.com",
    role: "CONSUMABLES_MANUFACTURER" as UserRole,
    companyName: "Flint Group Africa",
    jobTitle: "Sales Director",
    companyWebsite: "https://flintgroup-africa.com",
    country: "Nigeria",
    cityState: "Kano",
    location: "Kano, Nigeria",
    phone: "+234 805 678 9012",
    bio: "Leading supplier of printing consumables including inks, plates, and chemicals for the African market.",
    isVerified: true,
    hasCipponMembership: true,
    cipponMembershipType: "CORPORATE" as any,
    cipponMembershipNumber: "CIPPON005",
    image: getRandomPortrait()
  },

  // Commercial Printers
  {
    name: "PrintTech Solutions",
    email: "info@printtech.ng",
    role: "COMMERCIAL_PRINTER" as UserRole,
    companyName: "PrintTech Solutions Limited",
    jobTitle: "Managing Director",
    companyWebsite: "https://printtech.ng",
    country: "Nigeria",
    cityState: "Lagos",
    location: "Lagos, Nigeria",
    phone: "+234 806 789 0123",
    bio: "Full-service commercial printing company specializing in high-quality offset and digital printing for corporate clients.",
    isVerified: true,
    hasCipponMembership: true,
    cipponMembershipType: "CORPORATE" as any,
    cipponMembershipNumber: "CIPPON006",
    image: getRandomPortrait()
  },
  {
    name: "Elite Print Services",
    email: "contact@eliteprint.ng",
    role: "COMMERCIAL_PRINTER" as UserRole,
    companyName: "Elite Print Services",
    jobTitle: "Operations Manager",
    companyWebsite: "https://eliteprint.ng",
    country: "Nigeria",
    cityState: "Ibadan",
    location: "Ibadan, Nigeria",
    phone: "+234 807 890 1234",
    bio: "Premium printing services with state-of-the-art equipment and exceptional customer service.",
    isVerified: true,
    hasCipponMembership: true,
    cipponMembershipType: "CORPORATE" as any,
    cipponMembershipNumber: "CIPPON007",
    image: getRandomPortrait()
  },

  // Digital Printers
  {
    name: "Digital Print Express",
    email: "hello@digitalprintexpress.ng",
    role: "DIGITAL_PRINTER" as UserRole,
    companyName: "Digital Print Express",
    jobTitle: "CEO",
    companyWebsite: "https://digitalprintexpress.ng",
    country: "Nigeria",
    cityState: "Lagos",
    location: "Lagos, Nigeria",
    phone: "+234 808 901 2345",
    bio: "Fast and reliable digital printing services for short runs, variable data printing, and personalized materials.",
    isVerified: true,
    hasCipponMembership: true,
    cipponMembershipType: "CORPORATE" as any,
    cipponMembershipNumber: "CIPPON008",
    image: getRandomPortrait()
  },
  {
    name: "Quick Print Nigeria",
    email: "info@quickprint.ng",
    role: "DIGITAL_PRINTER" as UserRole,
    companyName: "Quick Print Nigeria",
    jobTitle: "General Manager",
    companyWebsite: "https://quickprint.ng",
    country: "Nigeria",
    cityState: "Abuja",
    location: "Abuja, Nigeria",
    phone: "+234 809 012 3456",
    bio: "Express digital printing and copying services with multiple locations across Nigeria.",
    isVerified: true,
    hasCipponMembership: true,
    cipponMembershipType: "CORPORATE" as any,
    cipponMembershipNumber: "CIPPON009",
    image: getRandomPortrait()
  },

  // Screen Printers
  {
    name: "Screen Masters",
    email: "sales@screenmasters.ng",
    role: "SCREEN_PRINTER" as UserRole,
    companyName: "Screen Masters Limited",
    jobTitle: "Production Manager",
    companyWebsite: "https://screenmasters.ng",
    country: "Nigeria",
    cityState: "Lagos",
    location: "Lagos, Nigeria",
    phone: "+234 810 123 4567",
    bio: "Specialized screen printing services for textiles, posters, and promotional materials.",
    isVerified: true,
    hasCipponMembership: true,
    cipponMembershipType: "CORPORATE" as any,
    cipponMembershipNumber: "CIPPON010",
    image: getRandomPortrait()
  },

  // Large Format Printers
  {
    name: "Banner Pro Nigeria",
    email: "info@bannerpro.ng",
    role: "LARGE_FORMAT_PRINTER" as UserRole,
    companyName: "Banner Pro Nigeria",
    jobTitle: "Sales Director",
    companyWebsite: "https://bannerpro.ng",
    country: "Nigeria",
    cityState: "Lagos",
    location: "Lagos, Nigeria",
    phone: "+234 811 234 5678",
    bio: "Large format printing specialists for banners, billboards, vehicle wraps, and outdoor advertising.",
    isVerified: true,
    hasCipponMembership: true,
    cipponMembershipType: "CORPORATE" as any,
    cipponMembershipNumber: "CIPPON011",
    image: getRandomPortrait()
  },

  // Packaging Printers
  {
    name: "PackPrint Solutions",
    email: "contact@packprint.ng",
    role: "PACKAGING_PRINTER" as UserRole,
    companyName: "PackPrint Solutions",
    jobTitle: "Technical Director",
    companyWebsite: "https://packprint.ng",
    country: "Nigeria",
    cityState: "Kano",
    location: "Kano, Nigeria",
    phone: "+234 812 345 6789",
    bio: "Specialized packaging printing for food, pharmaceutical, and consumer goods industries.",
    isVerified: true,
    hasCipponMembership: true,
    cipponMembershipType: "CORPORATE" as any,
    cipponMembershipNumber: "CIPPON012",
    image: getRandomPortrait()
  },

  // Graphic Designers
  {
    name: "Creative Design Studio",
    email: "hello@creativedesign.ng",
    role: "GRAPHIC_DESIGNER" as UserRole,
    companyName: "Creative Design Studio",
    jobTitle: "Creative Director",
    companyWebsite: "https://creativedesign.ng",
    country: "Nigeria",
    cityState: "Lagos",
    location: "Lagos, Nigeria",
    phone: "+234 813 456 7890",
    bio: "Award-winning graphic design studio specializing in brand identity, packaging design, and marketing materials.",
    isVerified: true,
    hasCipponMembership: true,
    cipponMembershipType: "CORPORATE" as any,
    cipponMembershipNumber: "CIPPON013",
    image: getRandomPortrait()
  },

  // Software Providers
  {
    name: "PrintSoft Nigeria",
    email: "support@printsoft.ng",
    role: "SOFTWARE_DEVELOPER" as UserRole,
    companyName: "PrintSoft Nigeria",
    jobTitle: "Technical Manager",
    companyWebsite: "https://printsoft.ng",
    country: "Nigeria",
    cityState: "Lagos",
    location: "Lagos, Nigeria",
    phone: "+234 814 567 8901",
    bio: "Custom software solutions for print workflow management, MIS systems, and automation.",
    isVerified: true,
    hasCipponMembership: true,
    cipponMembershipType: "CORPORATE" as any,
    cipponMembershipNumber: "CIPPON014",
    image: getRandomPortrait()
  },

  // Distributors
  {
    name: "Print Equipment Nigeria",
    email: "sales@printequipment.ng",
    role: "EQUIPMENT_DEALER" as UserRole,
    companyName: "Print Equipment Nigeria Limited",
    jobTitle: "Sales Manager",
    companyWebsite: "https://printequipment.ng",
    country: "Nigeria",
    cityState: "Lagos",
    location: "Lagos, Nigeria",
    phone: "+234 815 678 9012",
    bio: "Authorized dealer for major printing equipment brands with comprehensive service and support.",
    isVerified: true,
    hasCipponMembership: true,
    cipponMembershipType: "CORPORATE" as any,
    cipponMembershipNumber: "CIPPON015",
    image: getRandomPortrait()
  },

  // Consultants
  {
    name: "Print Consult Africa",
    email: "info@printconsult.africa",
    role: "PRINT_CONSULTANT" as UserRole,
    companyName: "Print Consult Africa",
    jobTitle: "Senior Consultant",
    companyWebsite: "https://printconsult.africa",
    country: "Nigeria",
    cityState: "Lagos",
    location: "Lagos, Nigeria",
    phone: "+234 816 789 0123",
    bio: "Strategic consulting services for print businesses, workflow optimization, and technology implementation.",
    isVerified: true,
    hasCipponMembership: true,
    cipponMembershipType: "CORPORATE" as any,
    cipponMembershipNumber: "CIPPON016",
    image: getRandomPortrait()
  },

  // Training Providers
  {
    name: "Print Academy Nigeria",
    email: "admissions@printacademy.ng",
    role: "TRAINING_PROVIDER" as UserRole,
    companyName: "Print Academy Nigeria",
    jobTitle: "Director of Training",
    companyWebsite: "https://printacademy.ng",
    country: "Nigeria",
    cityState: "Lagos",
    location: "Lagos, Nigeria",
    phone: "+234 817 890 1234",
    bio: "Professional training and certification programs for the printing industry workforce.",
    isVerified: true,
    hasCipponMembership: true,
    cipponMembershipType: "CORPORATE" as any,
    cipponMembershipNumber: "CIPPON017",
    image: getRandomPortrait()
  },

  // Small Business Owners
  {
    name: "John Adebayo",
    email: "john@adebayoprint.ng",
    role: "SMALL_BUSINESS_OWNER" as UserRole,
    companyName: "Adebayo Print Services",
    jobTitle: "Owner",
    companyWebsite: "https://adebayoprint.ng",
    country: "Nigeria",
    cityState: "Ibadan",
    location: "Ibadan, Nigeria",
    phone: "+234 818 901 2345",
    bio: "Family-owned printing business serving the local community with quality printing services.",
    isVerified: false,
    hasCipponMembership: false,
    cipponMembershipType: "NONE" as any,
    image: getRandomPortrait()
  },

  // End Users
  {
    name: "Sarah Johnson",
    email: "sarah@johnsoncorp.ng",
    role: "CORPORATE_BUYER" as UserRole,
    companyName: "Johnson Corporation",
    jobTitle: "Marketing Manager",
    companyWebsite: "https://johnsoncorp.ng",
    country: "Nigeria",
    cityState: "Lagos",
    location: "Lagos, Nigeria",
    phone: "+234 819 012 3456",
    bio: "Corporate buyer looking for reliable printing partners for marketing materials and corporate communications.",
    isVerified: true,
    hasCipponMembership: false,
    cipponMembershipType: "NONE" as any,
    image: getRandomPortrait()
  }
]

async function main() {
  console.log('👥 Seeding vendors...')
  
  for (const vendor of vendors) {
    try {
      // Check if vendor already exists
      const existingVendor = await prisma.user.findUnique({
        where: { email: vendor.email }
      })

      if (existingVendor) {
        console.log(`  ⚠️  Vendor already exists: ${vendor.name}`)
        continue
      }

      // Create vendor
      const newVendor = await prisma.user.create({
        data: {
          name: vendor.name,
          email: vendor.email,
          role: vendor.role,
          companyName: vendor.companyName,
          jobTitle: vendor.jobTitle,
          companyWebsite: vendor.companyWebsite,
          country: vendor.country,
          cityState: vendor.cityState,
          location: vendor.location,
          phone: vendor.phone,
          bio: vendor.bio,
          isVerified: vendor.isVerified,
          hasCipponMembership: vendor.hasCipponMembership,
          cipponMembershipType: vendor.cipponMembershipType,
          cipponMembershipNumber: vendor.cipponMembershipNumber,
          image: vendor.image,
          emailVerified: new Date()
        }
      })

      console.log(`  ✅ Created vendor: ${vendor.name} (${vendor.role})`)
    } catch (error) {
      console.log(`  ❌ Failed to create vendor: ${vendor.name} - ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  console.log('🎉 Vendor seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding vendors:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
