-- Create companies table
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  website text,
  logo_url text,
  industry text,
  company_size text check (company_size in ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
  location text,
  founded_year integer,
  is_verified boolean default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.companies enable row level security;

-- RLS Policies for companies
create policy "companies_select_all"
  on public.companies for select
  using (true);

create policy "companies_insert_authenticated"
  on public.companies for insert
  with check (auth.uid() is not null);

create policy "companies_update_creator"
  on public.companies for update
  using (auth.uid() = created_by);

create policy "companies_delete_creator"
  on public.companies for delete
  using (auth.uid() = created_by);

-- Create updated_at trigger for companies
create trigger companies_updated_at
  before update on public.companies
  for each row
  execute function public.handle_updated_at();
