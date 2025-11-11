-- Migration: Add unique constraint on aadhar_number and create RPC to validate Aadhaar uniqueness
-- WARNING: This migration will fail if duplicate Aadhaar numbers already exist.

-- 1) Safety check: ensure there are no duplicate Aadhaar numbers
DO $$
DECLARE
    dup_count INT;
BEGIN
    SELECT COUNT(*) INTO dup_count
    FROM (
        SELECT aadhar_number
        FROM membership_applications
        WHERE aadhar_number IS NOT NULL AND trim(aadhar_number) <> ''
        GROUP BY aadhar_number
        HAVING COUNT(*) > 1
    ) t;

    IF dup_count > 0 THEN
        RAISE EXCEPTION 'Found % duplicate Aadhaar numbers in membership_applications. Resolve duplicates before running this migration.', dup_count;
    END IF;
END$$;

-- 2) Add unique constraint to enforce Aadhaar uniqueness at the DB level
ALTER TABLE IF EXISTS membership_applications
  ADD CONSTRAINT membership_applications_aadhar_number_key UNIQUE (aadhar_number);

-- 3) Create a server-side function (RPC) to check Aadhaar availability.
--    This centralizes the logic and avoids client-side race conditions.
-- If a prior version of the function exists with a different parameter name,
-- PostgreSQL may refuse to replace parameter names. Drop any existing
-- function with the same signature first to ensure the CREATE succeeds.
DROP FUNCTION IF EXISTS public.check_aadhar_unique(text, uuid);

CREATE OR REPLACE FUNCTION public.check_aadhar_unique(aadhar_text text, current_user_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF aadhar_text IS NULL OR trim(aadhar_text) = '' THEN
    RETURN true;
  END IF;

  -- If another user's application already uses this Aadhaar, it's not available
  IF EXISTS (
    SELECT 1 FROM public.membership_applications
    WHERE aadhar_number = aadhar_text
      AND (current_user_id IS NULL OR user_id <> current_user_id)
  ) THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$;

-- Grant execute to authenticated role (adjust role as needed)
GRANT EXECUTE ON FUNCTION public.check_aadhar_unique(text, uuid) TO authenticated;
