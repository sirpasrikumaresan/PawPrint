-- 1. Remove open read/update access
DROP POLICY IF EXISTS "Passports are publicly readable" ON public.passports;
DROP POLICY IF EXISTS "Anyone can update a passport" ON public.passports;

REVOKE SELECT, UPDATE ON public.passports FROM anon, authenticated;

-- Explicitly deny direct reads of the base table
CREATE POLICY "No direct passport reads" ON public.passports FOR SELECT USING (false);

-- 2. Public view without owner contact information
CREATE OR REPLACE VIEW public.passports_public AS
  SELECT animal_id, name, species, gender, age, breed, color,
         location, notes, registered_at, quality, last_confidence,
         photo, shots, vaccinations, medical, insurance, created_at, updated_at
  FROM public.passports;

GRANT SELECT ON public.passports_public TO anon, authenticated;

-- 3. Safe, narrow update path for identification confidence only
CREATE OR REPLACE FUNCTION public.record_identification(p_animal_id text, p_confidence numeric)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.passports SET last_confidence = p_confidence WHERE animal_id = p_animal_id;
$$;

GRANT EXECUTE ON FUNCTION public.record_identification(text, numeric) TO anon, authenticated;