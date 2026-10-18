-- Create projects table
CREATE TABLE IF NOT EXISTS public.project_s1 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    title_ta TEXT,
    location TEXT NOT NULL,
    location_ta TEXT,
    total_area TEXT,
    total_area_ta TEXT,
    ground_floor TEXT,
    ground_floor_ta TEXT,
    first_floor TEXT,
    first_floor_ta TEXT,
    highlights TEXT,
    highlights_ta TEXT,
    thumbnail TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    completion_date TEXT,
    status TEXT,
    gallery TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.project_s1 ENABLE ROW LEVEL SECURITY;

-- DROP existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public insert access" ON public.project_s1;
DROP POLICY IF EXISTS "Allow public read access" ON public.project_s1;
DROP POLICY IF EXISTS "Allow public update access" ON public.project_s1;
DROP POLICY IF EXISTS "Allow public delete access" ON public.project_s1;

-- Create policies (matching the existing 'leads' table pattern of open access for this phase)
CREATE POLICY "Allow public read access" ON public.project_s1 FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.project_s1 FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.project_s1 FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.project_s1 FOR DELETE USING (true);

-- Create Storage Bucket for Portfolio (matching frontend code) if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Drop existing to avoid conflicts if re-applying
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolio' );

CREATE POLICY "Public Insert"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'portfolio' );

CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'portfolio' );

CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'portfolio' );
