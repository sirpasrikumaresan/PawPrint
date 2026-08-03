CREATE TABLE public.passports (
  animal_id text PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  species text NOT NULL DEFAULT 'Dog',
  gender text NOT NULL DEFAULT 'Don''t Know',
  age text NOT NULL DEFAULT 'Don''t Know',
  breed text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT '',
  owner_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  registered_at date NOT NULL DEFAULT current_date,
  quality integer NOT NULL DEFAULT 0,
  last_confidence numeric,
  photo text NOT NULL DEFAULT '',
  shots jsonb NOT NULL DEFAULT '[]'::jsonb,
  vaccinations jsonb NOT NULL DEFAULT '[]'::jsonb,
  medical jsonb NOT NULL DEFAULT '[]'::jsonb,
  insurance jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.passports TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.passports TO authenticated;
GRANT ALL ON public.passports TO service_role;

ALTER TABLE public.passports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Passports are publicly readable"
  ON public.passports FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can register a passport"
  ON public.passports FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update a passport"
  ON public.passports FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_passports_updated_at
  BEFORE UPDATE ON public.passports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Passport photos are readable"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'passport-photos');
CREATE POLICY "Passport photos can be uploaded"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'passport-photos');

INSERT INTO public.passports (animal_id, name, species, gender, age, breed, color, owner_name, phone, location, notes, registered_at, quality, last_confidence, photo, shots, vaccinations, medical, insurance) VALUES
('DOG-2026-000124','Nova','Dog','Female','Adult','Golden Retriever','Golden','Aarav Mehta','+91 98200 41120','Bandra West, Mumbai','Friendly with children. Responds to whistle.','2026-03-14',97,98.4,'seed/dog-1.jpg',
 '[{"stage":"muzzle","quality":92,"image":"seed/dog-1.jpg","crop":"center 32%"},{"stage":"left","quality":99,"image":"seed/dog-1.jpg","crop":"38% center"},{"stage":"right","quality":98,"image":"seed/dog-1.jpg","crop":"62% center"},{"stage":"front","quality":97,"image":"seed/dog-1.jpg","crop":"center 45%"},{"stage":"back","quality":96,"image":"seed/dog-1.jpg","crop":"center 58%"},{"stage":"mark","quality":95,"image":"seed/dog-1.jpg","crop":"48% 60%"}]'::jsonb,
 '[{"label":"Rabies","date":"2026-01-08","clinic":"Paws & Care Veterinary"},{"label":"DHPP Booster","date":"2025-11-22","clinic":"Paws & Care Veterinary"}]'::jsonb,
 '[{"label":"Annual health check","date":"2026-02-02","detail":"All parameters normal."}]'::jsonb,
 '{"provider":"SafePaw Assurance","policyId":"SP-4471-2026","validUntil":"2027-01-31"}'::jsonb),
('DOG-2026-000125','Rex','Dog','Male','Adult','German Shepherd','Black & Tan','Municipal Shelter — Zone 4','+91 98111 20034','Sector 21, New Delhi','Shelter intake. Under behavioural observation.','2026-04-02',94,96.1,'seed/dog-2.jpg',
 '[{"stage":"muzzle","quality":92,"image":"seed/dog-2.jpg","crop":"center 32%"},{"stage":"left","quality":99,"image":"seed/dog-2.jpg","crop":"38% center"},{"stage":"right","quality":98,"image":"seed/dog-2.jpg","crop":"62% center"},{"stage":"front","quality":97,"image":"seed/dog-2.jpg","crop":"center 45%"},{"stage":"back","quality":96,"image":"seed/dog-2.jpg","crop":"center 58%"}]'::jsonb,
 '[{"label":"Rabies","date":"2026-04-03","clinic":"Zone 4 Shelter Clinic"}]'::jsonb,'[]'::jsonb,NULL),
('DOG-2026-000126','Pixie','Dog','Female','Puppy','Indie','White & Brown','Street Care Foundation','+91 90040 77821','Koramangala, Bengaluru','Community dog. Fed daily at 7th block.','2026-05-19',91,NULL,'seed/dog-3.jpg',
 '[{"stage":"muzzle","quality":92,"image":"seed/dog-3.jpg","crop":"center 32%"},{"stage":"left","quality":99,"image":"seed/dog-3.jpg","crop":"38% center"},{"stage":"right","quality":98,"image":"seed/dog-3.jpg","crop":"62% center"},{"stage":"front","quality":97,"image":"seed/dog-3.jpg","crop":"center 45%"},{"stage":"back","quality":96,"image":"seed/dog-3.jpg","crop":"center 58%"}]'::jsonb,
 '[]'::jsonb,'[{"label":"Deworming","date":"2026-05-20","detail":"First cycle completed."}]'::jsonb,NULL);