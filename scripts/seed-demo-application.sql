-- Demo Membership Application Data
-- This script inserts a sample membership application for testing

-- First, create a demo user (if not exists)
-- Note: This should be run in Supabase SQL Editor or via supabase CLI

-- Insert demo application
INSERT INTO public.membership_applications (
  user_id,
  full_name,
  address,
  phone,
  aadhar_number,
  pincode,
  city,
  state,
  family_members,
  donation_amount,
  status,
  member_id
) VALUES (
  -- Replace with actual user_id from your auth.users table
  (SELECT id FROM auth.users LIMIT 1),
  'Rajesh Kumar Sharma',
  '123, MG Road, Jayanagar 4th Block, Near BDA Complex',
  '9876543210',
  '123456789012',
  '560041',
  'Bangalore',
  'Karnataka',
  '[
    {"name": "Priya Sharma", "age": "35", "relation": "Wife"},
    {"name": "Arjun Sharma", "age": "12", "relation": "Son"},
    {"name": "Ananya Sharma", "age": "8", "relation": "Daughter"}
  ]'::jsonb,
  1000,
  'pending',
  'TM2025001'
)
ON CONFLICT DO NOTHING;

-- Insert another demo application
INSERT INTO public.membership_applications (
  user_id,
  full_name,
  address,
  phone,
  aadhar_number,
  pincode,
  city,
  state,
  family_members,
  donation_amount,
  status,
  member_id
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Lakshmi Devi',
  '45, Temple Street, Malleshwaram, Near Circle',
  '9123456789',
  '987654321098',
  '560003',
  'Bangalore',
  'Karnataka',
  '[
    {"name": "Venkatesh Rao", "age": "58", "relation": "Husband"},
    {"name": "Meera Rao", "age": "28", "relation": "Daughter"}
  ]'::jsonb,
  1000,
  'approved',
  'TM2025002'
)
ON CONFLICT DO NOTHING;

-- Insert a third demo application
INSERT INTO public.membership_applications (
  user_id,
  full_name,
  address,
  phone,
  aadhar_number,
  pincode,
  city,
  state,
  family_members,
  donation_amount,
  status
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Suresh Babu',
  '78, Residency Road, Richmond Town, Bangalore',
  '8765432109',
  '456789123456',
  '560025',
  'Bangalore',
  'Karnataka',
  '[]'::jsonb,
  1000,
  'rejected'
)
ON CONFLICT DO NOTHING;
