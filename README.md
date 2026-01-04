# RecipeShare - Global Recipe Sharing Platform

A modern social recipe sharing platform where food lovers can discover and share culinary creations from around the world. <br>
![homepage](/public/home.png)
<br>

## Key Features

### Recipe Management
- Create, read, update, delete recipes
- Rich text editing for ingredients and instructions
- Image upload support
- Favorite recipes can be bookmarked

### Social Features
- Like/unlike recipes
- Comment system
- User profiles and recipe collections
- Friend and unfreind users
- Best global recipes (TBA)
- Shorts and stories (TBA)

### Country Filtering
- Filter recipes by country of origin
- "All Countries" option for global view

### AI chat bot
- Users can chat with trained AI bot for food recipes or excellent suggestions and recommendations.

### Food type Filtering
- Filter recipes by veg,non-veg and vegan
- Filter recipes by type like breakfast, brunch, dinner etc..

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Auth0
- **Deployment**: Vercel 

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


## Deployment

### Vercel
link: https://recipeshare-ten.vercel.app

---

Built with ❤️ for food lovers around the world! 🌍🍽️