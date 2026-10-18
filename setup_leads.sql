-- Create leads table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- DROP existing policies to avoid conflicts if re-running
DROP POLICY IF EXISTS "Allow public insert access" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated read access" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated delete access" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated update access" ON public.leads;
DROP POLICY IF EXISTS "Allow public read access" ON public.leads;
DROP POLICY IF EXISTS "Allow public delete access" ON public.leads;

-- Create policy to allow anyone to insert leads (for the calculator)
CREATE POLICY "Allow public insert access" ON public.leads
    FOR INSERT WITH CHECK (true);

-- Create policy to allow public read access (for the admin dashboard with hardcoded auth)
CREATE POLICY "Allow public read access" ON public.leads
    FOR SELECT USING (true);

-- Create policy to allow public delete access (for the admin dashboard with hardcoded auth)
CREATE POLICY "Allow public delete access" ON public.leads
    FOR DELETE USING (true);

-- Create policy to allow public update access
CREATE POLICY "Allow public update access" ON public.leads
    FOR UPDATE USING (true);
