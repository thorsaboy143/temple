# Demo Application Setup - Summary

## ✅ What Was Added

### 1. **Demo Data Script** (`src/lib/demoData.ts`)
- Pre-configured sample application data
- 3 different demo profiles (Rajesh, Lakshmi, Suresh)
- Auto-fill function for browser console
- Family member data included

### 2. **Database Seed Script** (`scripts/seed-demo-application.sql`)
- SQL script to populate database directly
- 3 sample applications with different statuses:
  - Pending (Rajesh Kumar Sharma)
  - Approved (Lakshmi Devi)
  - Rejected (Suresh Babu)

### 3. **"Fill Demo" Button** (Updated `src/pages/Apply.tsx`)
- New button in the application form header
- One-click auto-fill of all form fields
- Includes family members data
- Only shows when creating new application (not for updates)

### 4. **Testing Documentation** (`DEMO_TESTING.md`)
- Complete guide for testing the application
- Instructions for all testing scenarios
- Troubleshooting tips
- Database reset commands

## 🚀 How to Use

### Quick Test (UI Method)
1. Start your dev server (already running at http://localhost:8080)
2. Navigate to `/auth` and create/login to an account
3. Go to `/apply` 
4. Click the **"Fill Demo"** button
5. Upload test documents (Aadhar + Photo)
6. Submit the form

### Database Seeding (Backend Method)
```bash
# In Supabase SQL Editor, run:
scripts/seed-demo-application.sql
```

## 📋 Demo Data Details

### Application 1: Rajesh Kumar Sharma
```
Full Name: Rajesh Kumar Sharma
Phone: 9876543210
Aadhar: 123456789012
Address: 123, MG Road, Jayanagar 4th Block, Near BDA Complex, Bangalore
Pincode: 560041
City: Bangalore
State: Karnataka
Family: 
  - Priya Sharma (35, Wife)
  - Arjun Sharma (12, Son)
  - Ananya Sharma (8, Daughter)
```

### Application 2: Lakshmi Devi
```
Full Name: Lakshmi Devi
Phone: 9123456789
Aadhar: 987654321098
Address: 45, Temple Street, Malleshwaram, Near Circle, Bangalore
Pincode: 560003
City: Bangalore
State: Karnataka
Family:
  - Venkatesh Rao (58, Husband)
  - Meera Rao (28, Daughter)
```

### Application 3: Suresh Babu
```
Full Name: Suresh Babu
Phone: 8765432109
Aadhar: 456789123456
Address: 78, Residency Road, Richmond Town, Bangalore
Pincode: 560025
City: Bangalore
State: Karnataka
Family: None
```

## 🎯 Testing Scenarios

### ✅ Test Form Validation
- Empty fields → Should show validation errors
- Invalid phone (< 10 digits) → Error
- Invalid Aadhar (not 12 digits) → Error
- Invalid pincode (not 6 digits) → Error

### ✅ Test Aadhar Uniqueness
- Fill demo data
- Submit application
- Try using same Aadhar again → Should show "Aadhar already taken"

### ✅ Test File Uploads
- Upload Aadhar card (JPG/PNG/PDF < 5MB) → Success
- Upload passport photo → Success
- Try file > 5MB → Should fail
- Try invalid format → Should fail

### ✅ Test Family Members
- Add members using demo data
- Add custom members
- Remove members
- Submit with/without family

### ✅ Test Application Updates
- Submit an application
- Revisit `/apply`
- Form should be pre-filled
- Make changes and resubmit → Updates existing

## 📸 Screenshot Locations

The "Fill Demo" button appears:
- Location: Top-right of the form header
- Next to: "Temple Membership Form" title
- Visibility: Only when creating new application

## 🔧 File Changes Made

```
✅ Created:  src/lib/demoData.ts (New file)
✅ Created:  scripts/seed-demo-application.sql (New file)
✅ Created:  DEMO_TESTING.md (New file)
✅ Created:  DEMO_SETUP.md (This file)
✅ Modified: src/pages/Apply.tsx (Added Fill Demo button)
```

## 🎨 UI Enhancement

The button styling matches your temple theme:
- Uses `variant="outline"` for subtle appearance
- Positioned in header for easy access
- Shows toast notification when clicked
- Reminds user to upload documents

## 💡 Pro Tips

1. **Quick Reset**: Delete application from dashboard to test again
2. **Multiple Tests**: Use different Aadhar numbers (change last 3 digits)
3. **Console Access**: Type `fillDemoApplication()` in browser console
4. **Admin View**: Login as admin to see all demo applications

## 🐛 Known Limitations

- Document files must be uploaded manually (no auto-fill)
- Demo data uses same location (Bangalore) for all profiles
- Aadhar numbers are sequential, not realistic

## 📞 Next Steps

1. ✅ Demo data setup complete
2. 📝 Test the application form with demo data
3. 🎯 Verify all validations work correctly
4. 📊 Check admin dashboard shows applications
5. ✨ Test approval/rejection workflow

---

**Ready to test!** Navigate to http://localhost:8080/apply and click "Fill Demo" 🚀
