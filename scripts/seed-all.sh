#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Seeding PrintMarket NG Database...${NC}"

# Step 1: Create default user
echo -e "${YELLOW}Step 1: Creating default user...${NC}"
npx ts-node prisma/seed-default-user.ts

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Default user created successfully${NC}"
else
    echo -e "${RED}❌ Failed to create default user${NC}"
    exit 1
fi

# Step 2: Seed products with categories
echo -e "${YELLOW}Step 2: Seeding products with categories...${NC}"
npx ts-node prisma/seed-products.ts

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Products seeded successfully${NC}"
else
    echo -e "${RED}❌ Failed to seed products${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Database seeding completed successfully!${NC}"
echo -e "${BLUE}📊 You can now test the marketplace with categorized products.${NC}"
