# Upstash Setup Guide for Rate Limiting

## Quick Setup (5 minutes)

### Step 1: Create Upstash Account
1. Visit [https://console.upstash.com/](https://console.upstash.com/)
2. Sign up using GitHub, Google, or email

### Step 2: Create Redis Database
1. Click **"Create Database"** in the Upstash console
2. Fill in the details:
   - **Name**: `nexustimer-ratelimit` (or any name you prefer)
   - **Type**: Select **Regional** (recommended for most use cases) or **Global** (for worldwide distribution)
   - **Region**: Choose the region closest to where your application is deployed
     - For Vercel: Choose the same region as your deployment
     - US East: `us-east-1`
     - Europe: `eu-west-1`
     - Asia: `ap-southeast-1`
3. Click **"Create"**

### Step 3: Get Credentials
1. After creating the database, you'll see the **Database Details** page
2. Scroll down to find **REST API** section
3. Copy the following:
   - **UPSTASH_REDIS_REST_URL**: The REST URL (e.g., `https://example.upstash.io`)
   - **UPSTASH_REDIS_REST_TOKEN**: The REST Token

### Step 4: Configure Environment Variables
1. Open your `.env` file in the project root
2. Replace the placeholder values:
   ```env
   UPSTASH_REDIS_REST_URL=https://your-actual-url.upstash.io
   UPSTASH_REDIS_REST_TOKEN=AYourActualTokenHere123...
   ```

### Step 5: Test the Setup
1. Start your development server:
   ```bash
   pnpm run dev
   ```

2. Test an API endpoint:
   ```bash
   curl http://localhost:3000/api/v1/leaderboards
   ```

3. Make multiple requests quickly to trigger the rate limit:
   ```bash
   # On Windows PowerShell:
   for ($i=0; $i -lt 35; $i++) { curl http://localhost:3000/api/v1/leaderboards }
   
   # On macOS/Linux:
   for i in {1..35}; do curl http://localhost:3000/api/v1/leaderboards; done
   ```

4. After exceeding the limit (30 requests for leaderboards), you should see:
   ```json
   {
     "error": "Too many requests. Please try again later.",
     "limit": 30,
     "remaining": 0,
     "reset": "2025-10-22T12:34:56.789Z"
   }
   ```

## Verify Analytics

1. Go back to the [Upstash Console](https://console.upstash.com/)
2. Select your Redis database
3. You should see rate limit data and analytics in the dashboard

## Pricing

### Free Tier (Perfect for development and small apps)
- ✅ 10,000 commands per day
- ✅ 256 MB storage
- ✅ Unlimited databases
- ✅ All regions available

### Pro Plan (For production)
- Starts at $0.2 per 100K commands
- Pay only for what you use
- No monthly minimums

## Troubleshooting

### Issue: "Rate limiter error" in logs
**Solution**: Check that your Upstash credentials are correct in `.env`

### Issue: Rate limits not working
**Solution**: 
1. Verify Redis connection by checking Upstash console for activity
2. Ensure environment variables are loaded (restart dev server)
3. Check console logs for error messages

### Issue: All requests getting 429
**Solution**: 
1. Check if rate limit is too strict (adjust in `src/lib/rate-limiter.ts`)
2. Clear Redis keys in Upstash console if testing
3. Wait for the rate limit window to reset

## Production Deployment

### Vercel
Upstash works perfectly with Vercel:
1. Add environment variables in Vercel dashboard:
   - Settings → Environment Variables
   - Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
2. Redeploy your application

### Other Platforms (Netlify, AWS, etc.)
1. Add environment variables in your platform's settings
2. Ensure your Redis region is close to your deployment region for best performance

## Next Steps

- Review the [full documentation](./RATE_LIMITING.md)
- Adjust rate limits in `src/lib/rate-limiter.ts` based on your needs
- Monitor usage in Upstash console
- Consider upgrading to Pro plan when ready for production

## Need Help?

- [Upstash Documentation](https://docs.upstash.com/)
- [Upstash Discord](https://discord.gg/upstash)
- [GitHub Issues](https://github.com/upstash/ratelimit/issues)
