-- Create user_skills junction table
create table if not exists public.user_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  skill_id uuid references public.skills(id) on delete cascade,
  proficiency_level text check (proficiency_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, skill_id)
);

-- Enable RLS
alter table public.user_skills enable row level security;

-- RLS Policies for user_skills
create policy "user_skills_select_own_or_public"
  on public.user_skills for select
  using (auth.uid() = user_id or exists (
    select 1 from public.profiles where id = user_skills.user_id and is_active = true
  ));

create policy "user_skills_insert_own"
  on public.user_skills for insert
  with check (auth.uid() = user_id);

create policy "user_skills_update_own"
  on public.user_skills for update
  using (auth.uid() = user_id);

create policy "user_skills_delete_own"
  on public.user_skills for delete
  using (auth.uid() = user_id);
