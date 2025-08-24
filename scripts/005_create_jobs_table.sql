-- Create jobs table
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  requirements text,
  responsibilities text,
  company_id uuid references public.companies(id) on delete cascade,
  posted_by uuid references public.profiles(id) on delete set null,
  location text,
  job_type text check (job_type in ('full-time', 'part-time', 'contract', 'internship', 'freelance')),
  work_arrangement text check (work_arrangement in ('remote', 'hybrid', 'on-site')),
  experience_level text check (experience_level in ('entry', 'mid', 'senior', 'executive')),
  salary_min integer,
  salary_max integer,
  salary_currency text default 'USD',
  is_active boolean default true,
  application_deadline timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.jobs enable row level security;

-- RLS Policies for jobs
create policy "jobs_select_active"
  on public.jobs for select
  using (is_active = true or auth.uid() = posted_by);

create policy "jobs_insert_authenticated"
  on public.jobs for insert
  with check (auth.uid() is not null and auth.uid() = posted_by);

create policy "jobs_update_poster"
  on public.jobs for update
  using (auth.uid() = posted_by);

create policy "jobs_delete_poster"
  on public.jobs for delete
  using (auth.uid() = posted_by);

-- Create updated_at trigger for jobs
create trigger jobs_updated_at
  before update on public.jobs
  for each row
  execute function public.handle_updated_at();
