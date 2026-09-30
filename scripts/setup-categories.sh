#!/bin/bash

echo "🚀 Setting up Product Categories for PrintMarket NG..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting product category setup..."

# Step 1: Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate
if [ $? -eq 0 ]; then
    print_success "Prisma client generated successfully"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

# Step 2: Run database migrations
print_status "Running database migrations..."
npx prisma migrate dev --name add_product_categories
if [ $? -eq 0 ]; then
    print_success "Database migrations completed successfully"
else
    print_error "Failed to run database migrations"
    exit 1
fi

# Step 3: Seed the categories
print_status "Seeding product categories..."
npx ts-node prisma/seed-categories.ts
if [ $? -eq 0 ]; then
    print_success "Product categories seeded successfully"
else
    print_error "Failed to seed product categories"
    exit 1
fi

# Step 4: Verify the setup
print_status "Verifying category setup..."
npx ts-node -e "
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function verifySetup() {
  try {
    const categories = await prisma.productCategory.findMany({
      include: { children: true }
    })
    
    console.log('✅ Found', categories.length, 'root categories')
    
    let totalCategories = categories.length
    categories.forEach(cat => {
      totalCategories += cat.children.length
      console.log('  📁', cat.name, '(', cat.children.length, 'subcategories)')
    })
    
    console.log('📊 Total categories:', totalCategories)
    
    await prisma.\$disconnect()
  } catch (error) {
    console.error('❌ Verification failed:', error)
    process.exit(1)
  }
}

verifySetup()
"

if [ $? -eq 0 ]; then
    print_success "Category setup verification completed"
else
    print_error "Category setup verification failed"
    exit 1
fi

print_success "🎉 Product Categories setup completed successfully!"
echo ""
echo "📋 What was set up:"
echo "  • Database schema with ProductCategory table"
echo "  • Hierarchical category structure"
echo "  • 9 main categories with subcategories"
echo "  • API endpoints for category management"
echo "  • Admin interface for category management"
echo ""
echo "🔧 Next steps:"
echo "  1. Access admin panel at /admin/categories"
echo "  2. Customize categories as needed"
echo "  3. Assign products to categories"
echo "  4. Test the marketplace filtering"
echo ""
echo "📚 Categories created:"
echo "  • Press (Offset, Digital, Screen)"
echo "  • Pre Press (CTP, Proofing, Software)"
echo "  • Post Press (Cutting, Folding, Binding)"
echo "  • Digital Printing (Inkjet, Laser, UV)"
echo "  • Web Printing (Web Offset, Web Digital)"
echo "  • Flexo Printing (Flexo Presses, Plates)"
echo "  • Software (Design, RIP, Workflow)"
echo "  • Consumables (Inks, Papers, Plates, Chemicals)"
echo "  • Others (Spare Parts, Accessories, Services)"
echo ""
