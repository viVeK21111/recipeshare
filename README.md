# RecipeShare - Global Recipe Sharing Platform

A modern, social recipe sharing platform where users can discover and share culinary creations from around the world. Built with Next.js, TypeScript, Tailwind CSS, Auth0, and Supabase.

## Features

- 🌍 **Global Recipe Discovery**: Browse recipes from different countries with country-based filtering
- 🔐 **Authentication**: Secure login with Auth0 (Google OAuth + username/password)
- ❤️ **Social Features**: Like and comment on recipes
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices
- 🍽️ **Rich Recipe Details**: Complete ingredients, instructions, prep/cook times, and serving sizes
- 👤 **User Profiles**: Personal recipe collections and user information
- 🏷️ **Country Tagging**: Each recipe is tagged with its country of origin

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Auth0
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Auth0 account
- Supabase account

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd recipe-share
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
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
```

### 3. Auth0 Setup

1. Create an Auth0 account at [auth0.com](https://auth0.com)
2. Create a new application (Single Page Application)
3. Add `http://localhost:3000/api/auth/callback` to Allowed Callback URLs
4. Add `http://localhost:3000` to Allowed Web Origins
5. Enable Google Social Connection in Auth0 Dashboard
6. Copy your Auth0 credentials to `.env.local`

### 4. Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase-schema.sql`
3. Copy your Supabase URL and keys to `.env.local`

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses the following main tables:

- **users**: User profiles and authentication data
- **recipes**: Recipe information with country tagging
- **likes**: User likes on recipes
- **comments**: User comments on recipes

See `supabase-schema.sql` for the complete schema.

## Key Features Implementation

### Authentication
- Auth0 integration with Google OAuth
- User session management
- Protected routes and API endpoints

### Recipe Management
- Create, read, update, delete recipes
- Rich text editing for ingredients and instructions
- Image upload support
- Country-based categorization

### Social Features
- Like/unlike recipes
- Comment system
- User profiles and recipe collections

### Country Filtering
- Filter recipes by country of origin
- Visual country flags and names
- "All Countries" option for global view

## Deployment

### Vercel
link: 

---

Built with ❤️ for food lovers around the world! 🌍🍽️