# Product Categories System - PrintMarket NG

## Overview

The Product Categories system provides a comprehensive, hierarchical categorization structure for all products on PrintMarket NG. This system allows for easy navigation, filtering, and organization of printing equipment and supplies.

## 🏗️ Architecture

### Database Schema

```sql
-- ProductCategory Table
CREATE TABLE ProductCategory (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(191) UNIQUE NOT NULL,
  slug VARCHAR(191) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(191),
  parentId VARCHAR(191),
  isActive BOOLEAN DEFAULT true,
  sortOrder INT DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parentId) REFERENCES ProductCategory(id)
);

-- Updated Product Table
ALTER TABLE Product ADD COLUMN categoryId VARCHAR(191);
ALTER TABLE Product ADD FOREIGN KEY (categoryId) REFERENCES ProductCategory(id);
```

### Hierarchical Structure

The system supports unlimited nesting levels:
- **Root Categories**: Main product categories
- **Subcategories**: Specific product types within main categories
- **Product Assignment**: Products are linked to specific categories

## 📂 Category Structure

### 1. Press
- **Offset Press**: Commercial offset printing equipment
- **Digital Press**: Digital printing presses and equipment
- **Screen Press**: Screen printing presses and equipment

### 2. Pre Press
- **CTP Systems**: Computer-to-plate systems and equipment
- **Proofing Systems**: Digital proofing and color management
- **Pre-press Software**: Software for pre-press operations

### 3. Post Press
- **Cutting Equipment**: Cutting and trimming equipment
- **Folding Equipment**: Folding and creasing machines
- **Binding Equipment**: Binding and finishing equipment

### 4. Digital Printing
- **Inkjet Printers**: Inkjet printing equipment
- **Laser Printers**: Laser printing equipment
- **UV Printers**: UV printing equipment

### 5. Web Printing
- **Web Offset**: Web offset printing equipment
- **Web Digital**: Web digital printing equipment

### 6. Flexo Printing
- **Flexo Presses**: Flexographic printing presses
- **Flexo Plates**: Flexographic printing plates

### 7. Software
- **Design Software**: Graphic design and layout software
- **RIP Software**: Raster Image Processing software
- **Workflow Software**: Print workflow management software

### 8. Consumables
- **Inks**: Printing inks and toners
- **Papers**: Printing papers and substrates
- **Plates**: Printing plates and cylinders
- **Chemicals**: Printing chemicals and solutions

### 9. Others
- **Spare Parts**: Spare parts and components
- **Accessories**: Printing accessories and tools
- **Services**: Printing services and maintenance

## 🚀 Setup Instructions

### 1. Run the Setup Script

```bash
# Make script executable (if not already)
chmod +x scripts/setup-categories.sh

# Run the setup script
./scripts/setup-categories.sh
```

### 2. Manual Setup (Alternative)

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name add_product_categories

# Seed categories
npx ts-node prisma/seed-categories.ts
```

## 🔧 API Endpoints

### Get All Categories
```http
GET /api/products/categories
GET /api/products/categories?includeCounts=true
GET /api/products/categories?includeInactive=true
```

### Create Category
```http
POST /api/products/categories
Content-Type: application/json

{
  "name": "New Category",
  "slug": "new-category",
  "description": "Category description",
  "icon": "Printer",
  "parentId": "optional-parent-id",
  "sortOrder": 0,
  "isActive": true
}
```

### Update Category
```http
PUT /api/products/categories
Content-Type: application/json

{
  "id": "category-id",
  "name": "Updated Category",
  "slug": "updated-category",
  "description": "Updated description",
  "icon": "Monitor",
  "parentId": "new-parent-id",
  "sortOrder": 1,
  "isActive": true
}
```

### Delete Category
```http
DELETE /api/products/categories?id=category-id
```

## 🎨 UI Components

### ProductCategoryFilter
A sidebar component for filtering products by category with:
- Hierarchical display with expand/collapse
- Search functionality
- Product count badges
- Icon support

### ProductCategoryChips
Horizontal category chips for quick filtering:
- Compact display
- Active state indication
- Product count badges

## 📱 Usage Examples

### In Marketplace Page
```tsx
import { ProductCategoryFilter } from "@/components/marketplace/product-category-filter"

// In your component
const [selectedCategory, setSelectedCategory] = useState<string>()

<ProductCategoryFilter
  categories={categories}
  selectedCategory={selectedCategory}
  onCategorySelect={setSelectedCategory}
  onSearchChange={setSearchQuery}
/>
```

### In Product Form
```tsx
// When creating/editing products
const [categoryId, setCategoryId] = useState<string>()

<Select value={categoryId} onValueChange={setCategoryId}>
  <SelectTrigger>
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    {categories.map(category => (
      <SelectItem key={category.id} value={category.id}>
        {category.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

## 🔍 Admin Interface

Access the category management interface at `/admin/categories`:

### Features
- **Hierarchical View**: Tree structure with expand/collapse
- **CRUD Operations**: Create, Read, Update, Delete categories
- **Drag & Drop**: Reorder categories (future enhancement)
- **Bulk Operations**: Select multiple categories (future enhancement)
- **Search & Filter**: Find categories quickly
- **Product Counts**: See how many products in each category

### Admin Actions
1. **Add Category**: Create new root or subcategories
2. **Edit Category**: Modify name, description, icon, parent
3. **Delete Category**: Remove categories (with safety checks)
4. **Toggle Active**: Enable/disable categories
5. **Reorder**: Change display order

## 🔒 Safety Features

### Deletion Protection
- Categories with products cannot be deleted
- Categories with subcategories cannot be deleted
- Confirmation dialogs for destructive actions

### Validation
- Unique category names and slugs
- Valid parent category references
- Required field validation

## 📈 Extensibility

### Adding New Categories
1. Use the admin interface at `/admin/categories`
2. Or add to the seed file and re-run seeding
3. Categories are automatically available in the UI

### Adding New Icons
1. Add icon to `iconOptions` array in components
2. Update the icon mapping
3. Icons are automatically available in forms

### Custom Fields
The schema supports additional fields:
- `metadata`: JSON field for custom data
- `imageUrl`: Category image/icon URL
- `seoTitle`: SEO-optimized title
- `seoDescription`: SEO-optimized description

## 🧪 Testing

### Unit Tests
```bash
# Test category API endpoints
npm test -- --testPathPattern=category

# Test category components
npm test -- --testPathPattern=ProductCategoryFilter
```

### Integration Tests
```bash
# Test category workflow
npm run test:integration -- --testPathPattern=category-workflow
```

## 📊 Analytics

### Category Performance
- Product count per category
- Search frequency per category
- Conversion rates per category
- User engagement metrics

### Reports
- Category popularity trends
- Product distribution analysis
- Search pattern analysis
- User behavior insights

## 🔄 Migration Guide

### From Old System
If migrating from a flat category system:

1. **Backup Data**: Export existing products and categories
2. **Run Migration**: Execute the setup script
3. **Map Categories**: Map old categories to new structure
4. **Update Products**: Assign products to new categories
5. **Verify**: Test all functionality

### Data Migration Script
```bash
# Run migration script
npx ts-node scripts/migrate-categories.ts
```

## 🐛 Troubleshooting

### Common Issues

1. **Categories Not Loading**
   - Check database connection
   - Verify API endpoint is working
   - Check browser console for errors

2. **Products Not Filtering**
   - Ensure products have `categoryId` assigned
   - Check category is active
   - Verify category hierarchy

3. **Admin Interface Issues**
   - Check user permissions
   - Verify admin role assignment
   - Check API authentication

### Debug Commands
```bash
# Check category data
npx ts-node -e "
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
prisma.productCategory.findMany({ include: { children: true } })
  .then(console.log)
  .finally(() => prisma.\$disconnect())
"

# Check product assignments
npx ts-node -e "
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
prisma.product.findMany({ include: { category: true } })
  .then(console.log)
  .finally(() => prisma.\$disconnect())
"
```

## 📞 Support

For issues or questions about the Product Categories system:

1. Check this documentation
2. Review the troubleshooting section
3. Check GitHub issues
4. Contact the development team

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Maintainer**: PrintMarket NG Development Team
