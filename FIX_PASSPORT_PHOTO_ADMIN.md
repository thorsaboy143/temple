# Fix: Admin Panel Passport Photo Not Showing

## Problem
When admins view member cards in the admin panel, passport photos are not displaying.

## Root Cause
The Supabase storage bucket policy for `passport-photos` only allowed users to view their own photos. Admins didn't have permission to view member passport photos when accessing member cards.

## Solution Applied

### 1. **Database Migration** (New)
Created migration: `20251115000000_admin_passport_photo_access.sql`

This adds a storage policy allowing admins to view all passport photos:
```sql
create policy "Admins can view all passport photos"
on storage.objects for select
to authenticated
using (
    bucket_id = 'passport-photos' AND
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);
```

### 2. **Improved Error Handling** 
Updated `src/pages/MemberCard.tsx` to:
- Log errors when signed URL generation fails
- Add fallback to public URL if signed URL fails
- Better error messages for debugging

## How to Apply the Fix

### Option 1: Using Supabase CLI
```bash
# Run the new migration
supabase db push
```

### Option 2: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/20251115000000_admin_passport_photo_access.sql`
4. Click **Run** to execute

### Option 3: Manual SQL Execution
Run this SQL in your Supabase SQL Editor:

```sql
-- Add admin permission to view all passport photos
drop policy if exists "Admins can view all passport photos" on storage.objects;
create policy "Admins can view all passport photos"
on storage.objects for select
to authenticated
using (
    bucket_id = 'passport-photos' AND
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);
```

## Testing the Fix

### 1. Ensure Admin User Exists
Make sure you have a user with admin role:
```sql
-- Check if admin role exists
SELECT * FROM user_roles WHERE role = 'admin';

-- If not, grant admin role to a user
INSERT INTO user_roles (user_id, role)
VALUES ('your-user-id-here', 'admin')
ON CONFLICT DO NOTHING;
```

### 2. Test Passport Photo Upload
1. Login as a regular user
2. Go to `/apply`
3. Fill out the form and upload a passport photo
4. Submit the application

### 3. Test Admin View
1. Login as admin user
2. Go to `/admin`
3. Find the application with uploaded passport photo
4. Click **"View Card"** button
5. ✅ Passport photo should now display on the member card

### 4. Check Browser Console
- Open browser DevTools (F12)
- Look for any error messages related to passport photo loading
- Should see no errors if everything is working

## What Changed

### Files Modified:
1. ✅ `supabase/migrations/20251110081600_add_passport_photo.sql` - Updated with admin policy
2. ✅ `src/pages/MemberCard.tsx` - Improved error handling
3. ✅ `supabase/migrations/20251115000000_admin_passport_photo_access.sql` - New migration

### Storage Policies Now Include:
- ✅ Users can view their own passport photos
- ✅ **Admins can view all passport photos** (NEW)
- ✅ Users can upload their own passport photos
- ✅ Users can update their own passport photos
- ✅ Users can delete their own passport photos
- ✅ **Admins can view all passport photos for member cards** (NEW)

## Troubleshooting

### Issue: Photos still not showing
**Solution:**
1. Clear browser cache
2. Check if migration was applied:
   ```sql
   SELECT * FROM storage.policies WHERE bucket_id = 'passport-photos';
   ```
3. Verify admin role:
   ```sql
   SELECT * FROM user_roles WHERE role = 'admin';
   ```

### Issue: "Access denied" errors in console
**Solution:**
- Run the migration again
- Ensure the user viewing the card has admin role
- Check RLS is enabled on storage.objects

### Issue: Old photos not loading
**Solution:**
- Existing passport photos should load automatically
- If not, check the `passport_photo_url` field in the database:
  ```sql
  SELECT id, full_name, passport_photo_url 
  FROM membership_applications 
  WHERE passport_photo_url IS NOT NULL;
  ```

## Verification Checklist

- [ ] New migration file created
- [ ] Migration applied to database
- [ ] Admin policy appears in storage policies
- [ ] Test application has passport photo uploaded
- [ ] Admin can view member card
- [ ] Passport photo displays on member card
- [ ] No errors in browser console
- [ ] Download/Print/Share functions work with photo

## Additional Benefits

This fix also:
- ✅ Improves debugging with better error logging
- ✅ Adds fallback mechanism for photo loading
- ✅ Maintains security (only admins and owners can view)
- ✅ Works for both new and existing applications

---

**Status:** ✅ Fix Ready to Deploy

After applying the migration, admins will be able to view all member passport photos when accessing member cards through the admin panel.
