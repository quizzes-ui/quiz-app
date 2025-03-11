-- SQL script to create the quizzes table in Supabase

-- Create the quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add a comment to the table
COMMENT ON TABLE public.quizzes IS 'Stores quiz data including questions and answers';

-- Important: First disable RLS to reset all policies
ALTER TABLE public.quizzes DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start clean
DROP POLICY IF EXISTS "anon_select" ON public.quizzes;
DROP POLICY IF EXISTS "anon_insert" ON public.quizzes;
DROP POLICY IF EXISTS "anon_update" ON public.quizzes;
DROP POLICY IF EXISTS "anon_delete" ON public.quizzes;

-- Re-enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Create proper policies with correct syntax
CREATE POLICY "anon_select" ON public.quizzes 
    FOR SELECT TO anon 
    USING (true);

CREATE POLICY "anon_insert" ON public.quizzes 
    FOR INSERT TO anon 
    WITH CHECK (true);

CREATE POLICY "anon_update" ON public.quizzes 
    FOR UPDATE TO anon 
    USING (true);

CREATE POLICY "anon_delete" ON public.quizzes 
    FOR DELETE TO anon 
    USING (true);

-- Create an index on the is_active column for faster filtering
CREATE INDEX IF NOT EXISTS idx_quizzes_is_active ON public.quizzes(is_active);

-- Create an index on the title for faster searching
CREATE INDEX IF NOT EXISTS idx_quizzes_title ON public.quizzes(title);