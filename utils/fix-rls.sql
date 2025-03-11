-- This script fixes RLS issues with the quizzes table

-- First, disable RLS to reset policies
ALTER TABLE public.quizzes DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow anonymous select" ON public.quizzes;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.quizzes;
DROP POLICY IF EXISTS "Allow anonymous update" ON public.quizzes;
DROP POLICY IF EXISTS "Allow anonymous delete" ON public.quizzes;
DROP POLICY IF EXISTS "Allow anon select" ON public.quizzes;
DROP POLICY IF EXISTS "Allow anon insert" ON public.quizzes;
DROP POLICY IF EXISTS "Allow anon update" ON public.quizzes;
DROP POLICY IF EXISTS "Allow anon delete" ON public.quizzes;

-- Re-enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Create simple policies that allow all operations
CREATE POLICY "anon_select" ON public.quizzes FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert" ON public.quizzes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON public.quizzes FOR UPDATE TO anon USING (true);
CREATE POLICY "anon_delete" ON public.quizzes FOR DELETE TO anon USING (true);

-- Verify that the policies have been applied
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM
    pg_policies
WHERE
    tablename = 'quizzes';
