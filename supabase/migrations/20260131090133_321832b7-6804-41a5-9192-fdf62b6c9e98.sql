-- Create a validated enquiry submission function
-- This replaces the overly permissive INSERT policy with validated server-side logic

CREATE OR REPLACE FUNCTION public.submit_enquiry(
  p_property_id UUID,
  p_name TEXT,
  p_phone TEXT,
  p_message TEXT DEFAULT NULL,
  p_whatsapp BOOLEAN DEFAULT false
) RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_enquiry_id UUID;
  v_trimmed_name TEXT;
  v_trimmed_phone TEXT;
  v_trimmed_message TEXT;
BEGIN
  -- Trim inputs
  v_trimmed_name := TRIM(COALESCE(p_name, ''));
  v_trimmed_phone := TRIM(COALESCE(p_phone, ''));
  v_trimmed_message := TRIM(COALESCE(p_message, ''));
  
  -- Validate name (2-100 characters)
  IF LENGTH(v_trimmed_name) < 2 OR LENGTH(v_trimmed_name) > 100 THEN
    RAISE EXCEPTION 'Name must be between 2 and 100 characters';
  END IF;
  
  -- Validate phone (10-20 characters, basic format check)
  IF LENGTH(v_trimmed_phone) < 10 OR LENGTH(v_trimmed_phone) > 20 THEN
    RAISE EXCEPTION 'Phone number must be between 10 and 20 characters';
  END IF;
  
  -- Validate phone contains only valid characters (digits, +, -, spaces, parentheses)
  IF v_trimmed_phone !~ '^[0-9+\-\s\(\)]+$' THEN
    RAISE EXCEPTION 'Phone number contains invalid characters';
  END IF;
  
  -- Validate message length if provided (max 1000 characters)
  IF v_trimmed_message IS NOT NULL AND v_trimmed_message != '' AND LENGTH(v_trimmed_message) > 1000 THEN
    RAISE EXCEPTION 'Message must be 1000 characters or less';
  END IF;
  
  -- Validate property exists and is available
  IF NOT EXISTS (SELECT 1 FROM properties WHERE id = p_property_id AND available = true) THEN
    RAISE EXCEPTION 'Property not found or not available';
  END IF;
  
  -- Insert the enquiry
  INSERT INTO enquiries (property_id, name, phone, message, whatsapp)
  VALUES (
    p_property_id, 
    v_trimmed_name, 
    v_trimmed_phone, 
    NULLIF(v_trimmed_message, ''),
    COALESCE(p_whatsapp, false)
  )
  RETURNING id INTO v_enquiry_id;
  
  RETURN v_enquiry_id;
END;
$$;

-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can submit enquiries" ON enquiries;

-- Create a new restrictive policy that only allows inserts through the function
-- Since the function uses SECURITY INVOKER, we need a policy that allows the function to work
-- But we want to encourage use of the function, so we'll add basic validation
CREATE POLICY "Validated enquiry submissions only"
ON enquiries FOR INSERT
WITH CHECK (
  -- Name must be 2-100 characters
  LENGTH(TRIM(name)) >= 2 AND LENGTH(TRIM(name)) <= 100
  -- Phone must be 10-20 characters and contain only valid characters
  AND LENGTH(TRIM(phone)) >= 10 AND LENGTH(TRIM(phone)) <= 20
  AND TRIM(phone) ~ '^[0-9+\-\s\(\)]+$'
  -- Message must be null or under 1000 chars
  AND (message IS NULL OR LENGTH(message) <= 1000)
  -- Property must exist and be available
  AND EXISTS (SELECT 1 FROM properties WHERE id = property_id AND available = true)
);