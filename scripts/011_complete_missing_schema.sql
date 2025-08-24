-- Complete missing database schema for CareerConnect

-- Create user_skills junction table
CREATE TABLE IF NOT EXISTS public.user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level text CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience integer,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, skill_id)
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  requirements text,
  responsibilities text,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  posted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  location text,
  job_type text CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship', 'freelance')),
  work_arrangement text CHECK (work_arrangement IN ('remote', 'hybrid', 'on-site')),
  experience_level text CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
  salary_min integer,
  salary_max integer,
  salary_currency text DEFAULT 'USD',
  is_active boolean DEFAULT true,
  application_deadline timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create job_skills junction table
CREATE TABLE IF NOT EXISTS public.job_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES public.skills(id) ON DELETE CASCADE,
  is_required boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(job_id, skill_id)
);

-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_letter text,
  resume_url text,
  status text CHECK (status IN ('pending', 'reviewing', 'interview', 'rejected', 'accepted')) DEFAULT 'pending',
  applied_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(job_id, applicant_id)
);

-- Create connections table
CREATE TABLE IF NOT EXISTS public.connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  message text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(requester_id, recipient_id),
  CHECK (requester_id != recipient_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_skills
CREATE POLICY "user_skills_select_own_or_public" ON public.user_skills FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = user_skills.user_id AND is_active = true
  ));

CREATE POLICY "user_skills_insert_own" ON public.user_skills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_skills_update_own" ON public.user_skills FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "user_skills_delete_own" ON public.user_skills FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for jobs
CREATE POLICY "jobs_select_active" ON public.jobs FOR SELECT
  USING (is_active = true OR auth.uid() = posted_by);

CREATE POLICY "jobs_insert_authenticated" ON public.jobs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = posted_by);

CREATE POLICY "jobs_update_poster" ON public.jobs FOR UPDATE
  USING (auth.uid() = posted_by);

CREATE POLICY "jobs_delete_poster" ON public.jobs FOR DELETE
  USING (auth.uid() = posted_by);

-- RLS Policies for job_skills
CREATE POLICY "job_skills_select_all" ON public.job_skills FOR SELECT
  USING (true);

CREATE POLICY "job_skills_insert_job_poster" ON public.job_skills FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.jobs WHERE id = job_skills.job_id AND posted_by = auth.uid()
  ));

CREATE POLICY "job_skills_update_job_poster" ON public.job_skills FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.jobs WHERE id = job_skills.job_id AND posted_by = auth.uid()
  ));

CREATE POLICY "job_skills_delete_job_poster" ON public.job_skills FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.jobs WHERE id = job_skills.job_id AND posted_by = auth.uid()
  ));

-- RLS Policies for applications
CREATE POLICY "applications_select_own_or_job_poster" ON public.applications FOR SELECT
  USING (
    auth.uid() = applicant_id OR 
    EXISTS (SELECT 1 FROM public.jobs WHERE id = applications.job_id AND posted_by = auth.uid())
  );

CREATE POLICY "applications_insert_own" ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "applications_update_own_or_job_poster" ON public.applications FOR UPDATE
  USING (
    auth.uid() = applicant_id OR 
    EXISTS (SELECT 1 FROM public.jobs WHERE id = applications.job_id AND posted_by = auth.uid())
  );

CREATE POLICY "applications_delete_own" ON public.applications FOR DELETE
  USING (auth.uid() = applicant_id);

-- RLS Policies for connections
CREATE POLICY "connections_select_involved" ON public.connections FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

CREATE POLICY "connections_insert_as_requester" ON public.connections FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "connections_update_involved" ON public.connections FOR UPDATE
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

CREATE POLICY "connections_delete_involved" ON public.connections FOR DELETE
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

-- Create updated_at triggers
CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER connections_updated_at
  BEFORE UPDATE ON public.connections
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create profile trigger function and trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
