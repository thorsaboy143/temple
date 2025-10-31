-- Fix function search path mutability by recreating with CASCADE
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Recreate dropped RLS policies
CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all applications" 
ON public.membership_applications 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all applications" 
ON public.membership_applications 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all aadhaar cards"
ON storage.objects
FOR SELECT
USING (bucket_id = 'aadhaar-cards' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Delete duplicate pending applications, keeping the oldest one
DELETE FROM public.membership_applications
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) as rn
    FROM public.membership_applications
    WHERE status = 'pending'
  ) t
  WHERE t.rn > 1
);

-- Add constraint to prevent multiple pending applications per user
CREATE UNIQUE INDEX IF NOT EXISTS one_pending_app_per_user 
ON public.membership_applications (user_id) 
WHERE status = 'pending';
