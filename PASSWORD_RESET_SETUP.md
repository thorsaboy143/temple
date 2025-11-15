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

2. Set the **Site URL** to your production domain (e.g., `https://your-temple-site.netlify.app`)

3. Add **Redirect URLs** (one per line):
   ```
   http://localhost:8080/auth*
   https://your-temple-site.netlify.app/auth*
   ```

4. **For Netlify deployment**, add this to Netlify Environment Variables:
   - Go to: Site settings → Environment variables
   - Add: `VITE_SITE_URL` = `https://your-temple-site.netlify.app`

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
1. Deploy to Netlify
2. Update `VITE_SITE_URL` in Netlify environment variables
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
