# Quick Start Guide

Get your BookShop MVP running in 15 minutes!

## Prerequisites

- Node.js 18+ installed
- Accounts created on:
  - [Supabase](https://supabase.com)
  - [Stripe](https://stripe.com)
  - [Resend](https://resend.com)

## Step-by-Step Setup

### 1. Install Dependencies (2 min)

```bash
npm install
```

### 2. Setup Supabase (5 min)

1. Create new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Copy/paste `supabase/migrations/20240101000000_initial_schema.sql`
4. Run the migration
5. **Optional**: Run `supabase/seed.sql` to add sample books
6. Get your credentials:
   - Project Settings → API → Copy URL and Anon Key
   - Project Settings → Database → Copy Service Role Key

### 3. Setup Stripe (4 min)

1. Create account at [stripe.com](https://stripe.com)
2. Switch to **Test Mode**
3. Products → Add Product:
   - Name: "BookShop Premium"
   - Price: $9.99/month (recurring)
   - Copy the Price ID (starts with `price_`)
4. Developers → API Keys:
   - Copy Publishable Key
   - Copy Secret Key

### 4. Setup Resend (2 min)

1. Create account at [resend.com](https://resend.com)
2. API Keys → Create → Copy key
3. Set sender email (use sandbox `onboarding@resend.dev` for testing)

### 5. Configure Environment (2 min)

Copy `.env.example` to `.env.local` and fill in:

```env
# From Supabase (Step 2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# From Stripe (Step 3)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...

# From Resend (Step 4)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@resend.dev

# Local development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Leave this empty for now, will add after deployment
STRIPE_WEBHOOK_SECRET=
```

### 6. Run Locally (1 min)

```bash
npm run dev
```

Visit http://localhost:3000

## Test the App

### Test Authentication

1. Go to http://localhost:3000/auth/signup
2. Create an account
3. Sign in at http://localhost:3000/auth/signin

### Test Stripe Checkout (Test Mode)

1. Go to http://localhost:3000/pricing
2. Click "Subscribe Now"
3. Use test card: `4242 4242 4242 4242`
4. Expiry: Any future date
5. CVC: Any 3 digits
6. Complete payment

**Note**: Webhook won't work locally, so access won't be granted automatically. To test the full flow, you need to deploy (see below).

### Manually Grant Access (For Local Testing)

Run this in Supabase SQL Editor:

```sql
-- Replace 'your-user-id' with your actual user ID from auth.users table
UPDATE profiles 
SET has_access = true 
WHERE email = 'your-email@example.com';
```

Now you can access http://localhost:3000/reader

## Deploy to Vercel (Optional)

### Quick Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

### Add Environment Variables in Vercel

1. Go to Vercel dashboard → Your Project → Settings → Environment Variables
2. Add all variables from `.env.local`
3. **Important**: Change `NEXT_PUBLIC_APP_URL` to your production URL

### Setup Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
4. Copy Signing Secret → Add to Vercel as `STRIPE_WEBHOOK_SECRET`
5. Redeploy: `vercel --prod`

Now the full payment flow works! 🎉

## Troubleshooting

### "Supabase client error"
- Check that all Supabase env vars are correct
- Verify project URL includes `https://`

### "Stripe checkout not working"
- Ensure you're in Test Mode in Stripe
- Verify Price ID is correct
- Check that publishable and secret keys match

### "No books showing"
- Run the seed.sql file in Supabase SQL Editor
- Check that `published = true` for books

### "Can't access reader after payment"
- This is expected locally (webhook doesn't work)
- Deploy to Vercel and setup webhook properly
- Or manually grant access via SQL (see above)

## Next Steps

1. ✅ Add more books using `supabase/seed.sql` as template
2. ✅ Customize design in `app/globals.css`
3. ✅ Update branding (colors, fonts, logo)
4. ✅ Deploy to production
5. ✅ Setup real Stripe webhook
6. ✅ Test complete payment flow

## Need Help?

Check the full README.md for:
- Complete verification checklist
- Detailed troubleshooting
- Project structure explanation
- Advanced configuration

Happy reading! 📚
