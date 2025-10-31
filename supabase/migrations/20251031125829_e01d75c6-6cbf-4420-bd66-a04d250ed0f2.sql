-- Add UPI ID column to membership_applications table
ALTER TABLE public.membership_applications
ADD COLUMN upi_id text;