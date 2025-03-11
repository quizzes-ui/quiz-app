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

-- Enable Row Level Security
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous select
CREATE POLICY "Allow anonymous select" ON public.quizzes
    FOR SELECT USING (true);

-- Create policy to allow anonymous insert
CREATE POLICY "Allow anonymous insert" ON public.quizzes
    FOR INSERT WITH CHECK (true);

-- Create policy to allow anonymous update
CREATE POLICY "Allow anonymous update" ON public.quizzes
    FOR UPDATE USING (true);

-- Create policy to allow anonymous delete
CREATE POLICY "Allow anonymous delete" ON public.quizzes
    FOR DELETE USING (true);

-- Create an index on the is_active column for faster filtering
CREATE INDEX idx_quizzes_is_active ON public.quizzes(is_active);

-- Create an index on the title for faster searching
CREATE INDEX idx_quizzes_title ON public.quizzes(title);
