-- Add member_id column to membership_applications
ALTER TABLE public.membership_applications 
ADD COLUMN IF NOT EXISTS member_id text UNIQUE;

-- Create function to generate member ID
CREATE OR REPLACE FUNCTION generate_member_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate member ID in format: TM-YYYY-XXXXX
    new_id := 'TM-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0');
    
    -- Check if ID already exists
    SELECT EXISTS(SELECT 1 FROM public.membership_applications WHERE member_id = new_id) INTO id_exists;
    
    -- Exit loop if ID is unique
    EXIT WHEN NOT id_exists;
  END LOOP;
  
  RETURN new_id;
END;
$$;

-- Create trigger to auto-generate member_id when application is approved
CREATE OR REPLACE FUNCTION assign_member_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only assign member_id when status changes to 'approved' and member_id is null
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') AND NEW.member_id IS NULL THEN
    NEW.member_id := generate_member_id();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS trigger_assign_member_id ON public.membership_applications;
CREATE TRIGGER trigger_assign_member_id
  BEFORE UPDATE ON public.membership_applications
  FOR EACH ROW
  EXECUTE FUNCTION assign_member_id();