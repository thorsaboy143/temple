-- Add new columns to membership_applications table
ALTER TABLE public.membership_applications
ADD COLUMN pincode text,
ADD COLUMN city text,
ADD COLUMN state text,
ADD COLUMN aadhar_card_url text;

-- Create storage bucket for aadhaar cards
INSERT INTO storage.buckets (id, name, public)
VALUES ('aadhaar-cards', 'aadhaar-cards', false);

-- RLS policies for aadhaar-cards bucket
CREATE POLICY "Users can upload their own aadhaar card"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'aadhaar-cards' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own aadhaar card"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'aadhaar-cards' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all aadhaar cards"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'aadhaar-cards' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can delete their own aadhaar card"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'aadhaar-cards' AND
  auth.uid()::text = (storage.foldername(name))[1]
);