-- Create skills table
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.skills enable row level security;

-- RLS Policies for skills
create policy "skills_select_all"
  on public.skills for select
  using (true);

create policy "skills_insert_authenticated"
  on public.skills for insert
  with check (auth.uid() is not null);

-- Insert common skills
insert into public.skills (name, category) values
  ('JavaScript', 'Programming'),
  ('TypeScript', 'Programming'),
  ('React', 'Frontend'),
  ('Next.js', 'Frontend'),
  ('Node.js', 'Backend'),
  ('Python', 'Programming'),
  ('Java', 'Programming'),
  ('SQL', 'Database'),
  ('PostgreSQL', 'Database'),
  ('MongoDB', 'Database'),
  ('AWS', 'Cloud'),
  ('Docker', 'DevOps'),
  ('Git', 'Tools'),
  ('Project Management', 'Management'),
  ('Leadership', 'Management'),
  ('Communication', 'Soft Skills'),
  ('Problem Solving', 'Soft Skills'),
  ('Team Collaboration', 'Soft Skills')
on conflict (name) do nothing;
