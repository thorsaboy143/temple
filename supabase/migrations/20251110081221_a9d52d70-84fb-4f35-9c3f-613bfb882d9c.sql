-- Fix search_path for generate_member_id function
CREATE OR REPLACE FUNCTION generate_member_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix search_path for assign_member_id function
CREATE OR REPLACE FUNCTION assign_member_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only assign member_id when status changes to 'approved' and member_id is null
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') AND NEW.member_id IS NULL THEN
    NEW.member_id := generate_member_id();
  END IF;
  
  RETURN NEW;
END;
$$;