#!/bin/bash

echo "🗄️ Setting up production database..."

# Check if Prisma is installed
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found. Please install Node.js and npm first."
    exit 1
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Check if migrations were successful
if [ $? -eq 0 ]; then
    echo "✅ Database setup complete!"
    echo "📝 Database is ready for production use."
else
    echo "❌ Database setup failed. Please check your DATABASE_URL and database connection."
    exit 1
fi

echo "🎉 Database setup complete!"
echo "📝 Next steps:"
echo "   1. Deploy your application"
echo "   2. Test all database operations"
echo "   3. Monitor database performance" 