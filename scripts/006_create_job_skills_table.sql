-- Create job_skills junction table
create table if not exists public.job_skills (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete cascade,
  skill_id uuid references public.skills(id) on delete cascade,
  is_required boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(job_id, skill_id)
);

-- Enable RLS
alter table public.job_skills enable row level security;

-- RLS Policies for job_skills
create policy "job_skills_select_all"
  on public.job_skills for select
  using (true);

create policy "job_skills_insert_job_poster"
  on public.job_skills for insert
  with check (exists (
    select 1 from public.jobs where id = job_skills.job_id and posted_by = auth.uid()
  ));

create policy "job_skills_update_job_poster"
  on public.job_skills for update
  using (exists (
    select 1 from public.jobs where id = job_skills.job_id and posted_by = auth.uid()
  ));

create policy "job_skills_delete_job_poster"
  on public.job_skills for delete
  using (exists (
    select 1 from public.jobs where id = job_skills.job_id and posted_by = auth.uid()
  ));
