#!/bin/bash

echo "🍽️  RecipeShare Setup Script"
echo "=============================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.local.example .env.local 2>/dev/null || cat > .env.local << 'EOF'
# Auth0 Configuration
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR_AUTH0_DOMAIN.auth0.com'
AUTH0_CLIENT_ID='YOUR_AUTH0_CLIENT_ID'
AUTH0_CLIENT_SECRET='YOUR_AUTH0_CLIENT_SECRET'

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL='YOUR_SUPABASE_URL'
NEXT_PUBLIC_SUPABASE_ANON_KEY='YOUR_SUPABASE_ANON_KEY'
SUPABASE_SERVICE_ROLE_KEY='YOUR_SUPABASE_SERVICE_ROLE_KEY'
EOF
    echo "✅ .env.local created"
else
    echo "⚠️  .env.local already exists, skipping creation"
fi

# Generate Auth0 secret
echo ""
echo "🔐 Generating Auth0 secret..."
AUTH0_SECRET=$(openssl rand -hex 32)
echo "Generated AUTH0_SECRET: $AUTH0_SECRET"
echo ""
echo "📋 Please update your .env.local file with the following:"
echo "AUTH0_SECRET='$AUTH0_SECRET'"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Auth0 and Supabase credentials"
echo "2. Run the Supabase schema: supabase-schema.sql"
echo "3. Start the development server: npm run dev"
echo ""
echo "For detailed setup instructions, see README.md"
