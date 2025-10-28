# ShopHub E-commerce - Setup Instructions

Welcome to ShopHub, a modern full-stack e-commerce platform built with Next.js 14, Supabase, and Tailwind CSS.

## Quick Start

### 1. Seed the Database

Visit `/setup` in your browser to populate the database with sample data:
- 10 product categories
- 15+ sample products
- Multiple offers and banners

### 2. Create User Account

1. Visit `/signup` to create a new account
2. Sign in with your credentials at `/login`

### 3. Create Admin User (Optional)

To access the admin dashboard:
1. Sign up for an account
2. Open your Supabase dashboard
3. Navigate to the `profiles` table
4. Find your user record and set `is_admin` to `true`
5. Sign out and sign in again
6. Access admin dashboard at `/admin`

## Features

### Customer Features
- **Home Page** - Hero banners, hot deals, categories, featured products
- **Product Browsing** - Category pages with filters, sorting, and search
- **Product Details** - Image galleries, variants, reviews, related products
- **Shopping Cart** - Add/remove items, quantity controls, real-time updates
- **Checkout** - Multi-step process with address, delivery, and payment options
- **User Profile** - Manage personal info, view orders, save addresses
- **Search** - Find products across the entire store

### Admin Features
- **Dashboard** - Overview of products, orders, revenue, and users
- **Order Management** - View and update order statuses
- **Product Management** - CRUD operations for products (basic)
- **Offers Management** - Manage promotional offers and deals

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Authentication**: Supabase Auth
- **State Management**: React Context API

## Pages Overview

### Public Pages
- `/` - Home page
- `/category/[slug]` - Category listing
- `/product/[slug]` - Product details
- `/search` - Search results
- `/deals` - Special offers
- `/new-arrivals` - Latest products

### User Pages (Protected)
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/profile` - User profile
- `/profile/orders` - Order history
- `/profile/addresses` - Saved addresses

### Admin Pages (Admin Only)
- `/admin` - Admin dashboard
- `/admin/orders` - Order management

### Auth Pages
- `/login` - Sign in
- `/signup` - Create account

## Database Schema

The application uses the following main tables:
- `profiles` - User profiles with admin flag
- `categories` - Product categories
- `products` - Products with images, variants, specifications
- `cart_items` - Shopping cart items
- `addresses` - User delivery addresses
- `orders` - Order records
- `order_items` - Items in each order
- `reviews` - Product reviews
- `offers` - Promotional offers and deals

## Design Features

- Fully responsive design for mobile, tablet, and desktop
- Dark mode support
- Smooth animations and transitions
- Modern UI with shadcn/ui components
- Optimized images from Pexels
- Professional color scheme (no purple/indigo by default)

## Next Steps

1. Customize the branding and colors in `tailwind.config.ts`
2. Add more products through the admin interface
3. Configure email notifications for orders
4. Add payment gateway integration
5. Implement product reviews submission
6. Add inventory management features
7. Create analytics and reporting

## Support

For issues or questions, please refer to:
- Next.js documentation: https://nextjs.org/docs
- Supabase documentation: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

Enjoy building your e-commerce store!
