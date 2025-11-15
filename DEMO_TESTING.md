# Demo Application Testing Guide

## Overview
This guide explains how to test the Temple Membership application form with demo data.

## Quick Start

### Option 1: Using the "Fill Demo" Button
1. Navigate to the application form at `/apply`
2. Click the **"Fill Demo"** button in the top-right of the form
3. All form fields will be automatically populated with sample data
4. Upload required documents (Aadhar card and passport photo)
5. Click "Submit Application"

### Option 2: Using Demo Data Files

#### Database Seeding
Run the SQL script to populate the database with sample applications:

```bash
# Using Supabase CLI
supabase db execute --file scripts/seed-demo-application.sql

# Or copy the contents and run in Supabase SQL Editor
```

#### Demo Data Available
The system includes 3 sample applications:

**Application 1: Rajesh Kumar Sharma**
- Status: Pending
- Full Name: Rajesh Kumar Sharma
- Phone: 9876543210
- Aadhar: 123456789012
- Location: Bangalore, Karnataka (560041)
- Family: 3 members (Wife, 2 children)

**Application 2: Lakshmi Devi**
- Status: Approved
- Full Name: Lakshmi Devi
- Phone: 9123456789
- Aadhar: 987654321098
- Location: Bangalore, Karnataka (560003)
- Family: 2 members (Husband, Daughter)
- Member ID: TM2025002

**Application 3: Suresh Babu**
- Status: Rejected
- Full Name: Suresh Babu
- Phone: 8765432109
- Aadhar: 456789123456
- Location: Bangalore, Karnataka (560025)
- Family: None

## Form Fields

### Required Fields:
- ✅ Full Name (min 2 characters)
- ✅ Address (min 10 characters)
- ✅ Phone Number (10 digits)
- ✅ Aadhar Number (12 digits, unique)
- ✅ Pincode (6 digits)
- ✅ City (min 2 characters)
- ✅ State (min 2 characters)
- ✅ Aadhar Card Upload (JPG/PNG/PDF, max 5MB)
- ✅ Passport Photo Upload (JPG/PNG/PDF, max 5MB)

### Optional Fields:
- Family Members (Name, Age, Relation)

## Testing Document Uploads

Since actual document files aren't included in the repo, you can use:

### For Aadhar Card:
- Any sample ID card image
- Create a test PDF with dummy Aadhar details
- Use placeholder images from https://via.placeholder.com/600x400

### For Passport Photo:
- Any passport-size photo
- Use a profile picture
- Generate test images online

## Browser Console Testing

You can also use the browser console to fill the form:

```javascript
// Fill form with demo data
fillDemoApplication();

// Use alternative demo data sets
fillDemoApplication(demoApplicationData2);
fillDemoApplication(demoApplicationData3);
```

## Features to Test

### 1. Form Validation
- Try submitting with empty fields
- Test invalid phone numbers (< 10 digits)
- Test invalid Aadhar (not 12 digits)
- Test invalid pincode (not 6 digits)

### 2. Aadhar Uniqueness Check
- Enter an Aadhar number
- Watch for the real-time validation (✓ or ✗)
- Try using the same Aadhar twice

### 3. File Upload Validation
- Try uploading files > 5MB (should fail)
- Try uploading invalid file types (should fail)
- Test image preview functionality

### 4. Family Members
- Add multiple family members
- Remove family members
- Submit with/without family members

### 5. Application Updates
- Submit an application
- Go back to `/apply`
- Notice the form is pre-filled
- Make changes and submit again (updates existing)

## Admin Testing

### View Applications
1. Login as admin at `/admin/login`
2. View all submitted applications
3. Filter by status (pending/approved/rejected)

### Approve/Reject Applications
1. Click on any pending application
2. Click "Approve" or "Reject"
3. For approved applications, a Member ID is auto-generated

### Edit Member Details
1. Go to approved applications
2. Click "Edit" to modify member details
3. Update any information and save

## Common Issues

### Aadhar Already Exists
- Each Aadhar can only be used once
- Use different demo Aadhar numbers for testing
- Clear database between tests if needed

### File Upload Issues
- Ensure files are under 5MB
- Check file format (JPG, PNG, PDF only)
- Verify Supabase storage buckets exist

### Authentication Required
- Must be logged in to access `/apply`
- Create test account at `/auth`
- Use demo credentials if available

## API Endpoints Used

- `membership_applications` table (insert/update/select)
- `aadhaar-cards` storage bucket
- `passport-photos` storage bucket
- `check_aadhar_unique` RPC function

## Database Reset

To reset demo data:

```sql
-- Delete all applications
DELETE FROM membership_applications WHERE aadhar_number IN ('123456789012', '987654321098', '456789123456');

-- Or delete all applications
TRUNCATE membership_applications CASCADE;
```

## Support

For issues or questions:
- Check console for error messages
- Verify Supabase connection
- Check RLS policies are enabled
- Ensure storage buckets have correct policies
