# BookShop MVP - Complete Setup Guide

A production-ready Book Shop and Reader built with Next.js 14, Supabase, Stripe, and Resend.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **UI**: shadcn/ui, Tailwind CSS
- **Database**: Supabase (Postgres with RLS)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: Stripe (Checkout + Webhooks)
- **Email**: Resend
- **Deployment**: Vercel

## Features

✅ Public landing page with distinctive design
✅ Public book catalog
✅ User authentication (sign up, sign in, password reset)
✅ Protected reader dashboard
✅ Book reader with chapter navigation
✅ Automatic reading progress tracking
✅ Row Level Security (RLS) for data access
✅ Stripe subscription checkout
✅ Webhook-based access entitlements
✅ Welcome email on subscription
✅ Responsive design

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account
- Stripe account
- Resend account
- Vercel account (for deployment)

---

## Setup Instructions

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Supabase Setup

#### A. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be provisioned

#### B. Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/migrations/20240101000000_initial_schema.sql`
3. Paste into SQL Editor and click **Run**

This creates:
- `profiles` table with user data
- `books` table for book catalog
- `chapters` table for book content
- `reading_progress` table for tracking
- Row Level Security policies
- Storage bucket for book assets
- Triggers for automated timestamps

#### C. Get Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon/Public Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Go to **Project Settings** → **Database**
4. Scroll to **Connection Pooling** → Copy Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Stripe Setup

#### A. Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Create account and activate test mode

#### B. Create Product and Price

1. Go to **Products** → **Add Product**
2. Name: "BookShop Premium"
3. Set recurring price: $9.99/month
4. Save and copy the **Price ID** (starts with `price_`)
   - This is your `NEXT_PUBLIC_STRIPE_PRICE_ID`

#### C. Get Stripe Keys

1. Go to **Developers** → **API Keys**
2. Copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`

#### D. Setup Webhook (After Deployment)

> **Note**: Complete this step AFTER deploying to Vercel

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
4. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### 4. Resend Setup

1. Go to [resend.com](https://resend.com)
2. Create account and verify domain (or use sandbox)
3. Go to **API Keys** → Create API Key
4. Copy key → `RESEND_API_KEY`
5. Set sender email → `RESEND_FROM_EMAIL` (e.g., `noreply@yourdomain.com`)

### 5. Environment Variables

Create `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Local Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### 7. Seed Sample Data (Optional)

Run this SQL in Supabase SQL Editor to add sample books:

```sql
-- Insert sample book
INSERT INTO books (title, author, description, published)
VALUES (
  'The Great Adventure',
  'Jane Smith',
  'An epic tale of discovery and wonder that takes readers on an unforgettable journey through magical lands.',
  true
);

-- Get the book ID from the response and insert chapters
INSERT INTO chapters (book_id, title, content, chapter_number)
VALUES 
  (
    'BOOK_ID_HERE',
    'The Beginning',
    '<p>It was a dark and stormy night when our hero first set foot on the mysterious island...</p><p>The waves crashed against the shore, and lightning illuminated the ancient ruins in the distance.</p>',
    1
  ),
  (
    'BOOK_ID_HERE',
    'The Discovery',
    '<p>Morning brought new revelations. The ruins were not abandoned after all...</p><p>Strange symbols covered every surface, telling a story lost to time.</p>',
    2
  );
```

### 8. Deploy to Vercel

#### A. Connect to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to link project
```

#### B. Set Environment Variables in Vercel

1. Go to Vercel dashboard → Your Project → **Settings** → **Environment Variables**
2. Add all variables from `.env.local`
3. Update `NEXT_PUBLIC_APP_URL` to your production URL (e.g., `https://bookshop.vercel.app`)

#### C. Complete Stripe Webhook Setup

1. Now that you have production URL, go back to Stripe Webhooks
2. Add endpoint: `https://your-production-url.vercel.app/api/webhooks/stripe`
3. Update `STRIPE_WEBHOOK_SECRET` in Vercel

#### D. Redeploy

```bash
vercel --prod
```

---

## Manual Verification Checklist

### Authentication Features

- [ ] **Sign Up**
  - Visit `/auth/signup`
  - Create account with email/password
  - Check Supabase Auth users table for new user
  - Verify `profiles` table has matching record

- [ ] **Sign In**
  - Visit `/auth/signin`
  - Sign in with created account
  - Should redirect to `/reader` (or `/pricing` if no access)

- [ ] **Password Reset**
  - Visit `/auth/reset-password`
  - Enter email
  - Check email for reset link
  - Click link and set new password
  - Verify can sign in with new password

- [ ] **Sign Out**
  - Click Sign Out button
  - Should redirect to homepage
  - Session should be cleared

### Public Pages

- [ ] **Landing Page** (`/`)
  - Loads without errors
  - Navigation works
  - CTA buttons link correctly
  - Responsive on mobile

- [ ] **Books Catalog** (`/books`)
  - Shows published books
  - Book cards display correctly
  - "Get Access" button links to pricing

- [ ] **Pricing Page** (`/pricing`)
  - Shows pricing card
  - Lists all features
  - CTA adapts based on auth state:
    - Not logged in: "Get Started" → `/auth/signup`
    - Logged in without access: "Subscribe Now" → Stripe
    - Logged in with access: Redirects to `/reader`

### Payment Flow

- [ ] **Stripe Checkout**
  - Logged in user without access clicks "Subscribe Now"
  - Redirects to Stripe Checkout
  - Use test card: `4242 4242 4242 4242`
  - Complete payment
  - Should redirect to `/reader?success=true`

- [ ] **Webhook Processing**
  - After successful payment, check:
    - `profiles.has_access` is `true`
    - `profiles.stripe_customer_id` is set
    - `profiles.stripe_subscription_id` is set
  - Welcome email received (check spam folder)

- [ ] **Access Grant**
  - After payment, user should see reader dashboard
  - Books should be accessible

### Protected Features

- [ ] **Reader Dashboard** (`/reader`)
  - Only accessible when logged in with access
  - Shows all published books
  - Shows "Continue Reading" section if progress exists
  - User info displayed in header

- [ ] **Book Reader** (`/reader/book/[id]`)
  - Click on a book
  - Chapter content displays
  - Navigation between chapters works
  - "Back to Library" button works

- [ ] **Progress Tracking**
  - Read a chapter for 3+ seconds
  - Check `reading_progress` table in Supabase
  - Should have record with correct percentage
  - Progress bar shows on dashboard
  - "Continue Reading" picks up where left off

### Database & Security

- [ ] **Row Level Security**
  - Verify policies in Supabase dashboard
  - User can only see their own profile
  - User without access cannot read chapters
  - User with access can read chapters
  - All tables have RLS enabled

- [ ] **Storage Bucket**
  - Verify `book-assets` bucket exists
  - Test upload (if implementing file uploads)
  - Verify access policies work

### Email

- [ ] **Welcome Email**
  - Complete subscription
  - Check inbox for welcome email
  - Email has correct branding
  - "Start Reading" link works

### Edge Cases

- [ ] **Unauthenticated Access**
  - Try visiting `/reader` without login
  - Should redirect to `/auth/signin`

- [ ] **No Access**
  - Sign in without subscription
  - Try visiting `/reader`
  - Should redirect to `/pricing`

- [ ] **No Books**
  - Delete all books from database
  - Visit `/reader`
  - Should show "No books available" message

- [ ] **No Chapters**
  - Delete chapters for a book
  - Visit book reader page
  - Should show appropriate message

### Performance & UX

- [ ] **Loading States**
  - Pages load quickly
  - No layout shift
  - Forms are responsive

- [ ] **Mobile Responsive**
  - Test on mobile device
  - Navigation works
  - Reader is readable
  - Forms are usable

- [ ] **Browser Compatibility**
  - Test in Chrome, Firefox, Safari
  - All features work

---

## Project Structure

```
book-shop-mvp/
├── app/
│   ├── actions/           # Server Actions
│   │   ├── auth.ts       # Authentication actions
│   │   ├── reader.ts     # Reading progress actions
│   │   └── stripe.ts     # Checkout actions
│   ├── api/
│   │   └── webhooks/
│   │       └── stripe/   # Stripe webhook handler
│   ├── auth/             # Authentication pages
│   │   ├── signin/
│   │   ├── signup/
│   │   └── reset-password/
│   ├── books/            # Public books catalog
│   ├── pricing/          # Pricing page
│   ├── reader/           # Protected reader
│   │   └── book/[id]/   # Individual book reader
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── components/
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── supabase.ts       # Supabase client utilities
│   ├── stripe.ts         # Stripe utilities
│   ├── email.ts          # Resend email utilities
│   └── utils.ts          # Helper functions
├── supabase/
│   └── migrations/       # Database migrations
└── public/               # Static assets
```

## Common Issues & Solutions

### Stripe webhook not receiving events

- Ensure webhook URL is correct: `https://your-domain.vercel.app/api/webhooks/stripe`
- Check Stripe Dashboard → Webhooks → Click your webhook → View logs
- Verify `STRIPE_WEBHOOK_SECRET` is correct in Vercel
- Redeploy after adding webhook secret

### Email not sending

- Check Resend dashboard for logs
- Verify domain is verified (or using sandbox mode)
- Check `RESEND_FROM_EMAIL` matches verified domain
- Check spam folder

### RLS blocking access

- Verify user has `has_access = true` in profiles table
- Check RLS policies in Supabase dashboard
- Use SQL Editor to test queries manually
- Ensure service role key is used in webhook handler

### User can't access reader after payment

- Check Stripe webhook logs
- Verify webhook was received and processed
- Check `profiles` table for updated fields
- Ensure `STRIPE_WEBHOOK_SECRET` is correct

---

## Next Steps

After verification, consider:

1. **Add more books**: Use Supabase SQL Editor or build an admin panel
2. **Enhance reader**: Add bookmarks, highlights, font size controls
3. **Analytics**: Track popular books, reading time
4. **Social features**: Reviews, ratings, discussions
5. **Mobile app**: Use React Native with same backend
6. **Admin panel**: Manage books, users, subscriptions

---

## Support

- **Supabase**: [docs.supabase.com](https://docs.supabase.com)
- **Stripe**: [stripe.com/docs](https://stripe.com/docs)
- **Resend**: [resend.com/docs](https://resend.com/docs)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

## License

MIT
