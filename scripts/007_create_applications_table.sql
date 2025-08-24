-- Create applications table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete cascade,
  applicant_id uuid references public.profiles(id) on delete cascade,
  cover_letter text,
  resume_url text,
  status text check (status in ('pending', 'reviewing', 'interview', 'rejected', 'accepted')) default 'pending',
  applied_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(job_id, applicant_id)
);

-- Enable RLS
alter table public.applications enable row level security;

-- RLS Policies for applications
create policy "applications_select_own_or_job_poster"
  on public.applications for select
  using (
    auth.uid() = applicant_id or 
    exists (select 1 from public.jobs where id = applications.job_id and posted_by = auth.uid())
  );

create policy "applications_insert_own"
  on public.applications for insert
  with check (auth.uid() = applicant_id);

create policy "applications_update_own_or_job_poster"
  on public.applications for update
  using (
    auth.uid() = applicant_id or 
    exists (select 1 from public.jobs where id = applications.job_id and posted_by = auth.uid())
  );

create policy "applications_delete_own"
  on public.applications for delete
  using (auth.uid() = applicant_id);

-- Create updated_at trigger for applications
create trigger applications_updated_at
  before update on public.applications
  for each row
  execute function public.handle_updated_at();
