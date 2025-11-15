# Password Reset Configuration Guide

## Issue
When users click "Forgot Password" and receive the email, clicking the link shows "ERR_CONNECTION_REFUSED" because the redirect URL points to `localhost`.

## Solution Implemented

### 1. Environment Variable Added
Added `VITE_SITE_URL` to `.env` file:
```env
VITE_SITE_URL="http://localhost:8080"
```

For production, you'll need to update this to your actual domain.

### 2. Code Changes
- Updated password reset redirect URL to use `VITE_SITE_URL` environment variable
- Added password recovery flow handling in Auth.tsx
- Added new password update form with confirmation field
- Handles the `type=recovery` URL parameter from email link

### 3. Supabase Dashboard Configuration

**IMPORTANT**: You must configure the Site URL in your Supabase dashboard:

1. Go to: https://supabase.com/dashboard/project/dkdzjjftxwoipvzfnkjp/auth/url-configuration

2. Set the **Site URL** to your production domain (e.g., `https://your-temple-site.vercel.app`)

3. Add **Redirect URLs** (one per line):
   ```
   http://localhost:8080/auth*
   https://your-temple-site.vercel.app/auth*
   ```

4. **For Vercel deployment**, add this to Vercel Environment Variables:
   - Go to: Your Project → Settings → Environment Variables
   - Add: `VITE_SITE_URL` = `https://your-temple-site.vercel.app`
   - **Important**: Select all three environments (Production, Preview, Development)
   - Click "Save"

### 4. How It Works Now

1. User clicks "Forgot Password"
2. Enters email and submits
3. Receives email with reset link pointing to: `${VITE_SITE_URL}/auth?type=recovery`
4. Clicks link → Opens password recovery form
5. Enters new password and confirmation
6. Password is updated successfully

### 5. Testing

**Local Testing:**
```bash
# Make sure dev server is running
npm run dev

# Test forgot password flow:
1. Go to http://localhost:8080/auth
2. Click "Forgot Password?"
3. Enter your email
4. Check email and click the reset link
5. Should see "Set New Password" form
6. Enter new password (twice)
7. Submit to update password
```

**Production Testing:**
1. Deploy to Vercel
2. Update `VITE_SITE_URL` in Vercel environment variables
3. Configure Supabase Site URL and Redirect URLs
4. Test the forgot password flow

### 6. Important Notes

- The password reset link expires after 1 hour (Supabase default)
- Users must be verified to reset password
- Password must be at least 6 characters
- Both password fields must match
- After successful reset, user is redirected to login page

## Troubleshooting

### Still seeing localhost in emails?
- Check Supabase Site URL is set correctly
- Verify environment variables are loaded (restart dev server)
- Clear browser cache

### Link expired error?
- Password reset links are valid for 1 hour only
- User needs to request a new reset link

### Email not arriving?
- Check spam folder
- Verify email in Supabase Auth users table
- Check Supabase email templates are configured

### Redirect not working?
- Ensure redirect URL is whitelisted in Supabase dashboard
- Check Site URL matches your deployment URL exactly
- Include trailing wildcard: `/auth*`

## Vercel Deployment Steps

### 1. Deploy to Vercel
```bash
# If not already installed
npm i -g vercel

# Deploy from your project directory
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set up project (use defaults for Vite)
# - Deploy
```

### 2. Configure Environment Variables
1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your temple project
3. Go to Settings → Environment Variables
4. Add the following variables:
   - `VITE_SUPABASE_URL` = `https://dkdzjjftxwoipvzfnkjp.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = (copy from your .env file)
   - `VITE_SITE_URL` = `https://your-project.vercel.app` (use your actual Vercel URL)
5. Select all environments (Production, Preview, Development)
6. Click "Save"

### 3. Configure Supabase
1. Copy your Vercel deployment URL (e.g., `https://temple-xyz.vercel.app`)
2. Go to Supabase Dashboard → Authentication → URL Configuration
3. Set **Site URL** to your Vercel URL
4. Add to **Redirect URLs**:
   ```
   https://your-project.vercel.app/auth*
   http://localhost:8080/auth*
   ```

### 4. Redeploy
After adding environment variables, trigger a new deployment:
```bash
vercel --prod
```

Or push to your GitHub repository if you've connected it to Vercel (auto-deploys).

### 5. Test
1. Visit your Vercel URL
2. Go to `/auth`
3. Click "Forgot Password?"
4. Enter your email
5. Check email and click reset link
6. Should open your Vercel site with password reset form
