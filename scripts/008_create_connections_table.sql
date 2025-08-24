-- Create connections table for networking
create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references public.profiles(id) on delete cascade,
  recipient_id uuid references public.profiles(id) on delete cascade,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(requester_id, recipient_id),
  check (requester_id != recipient_id)
);

-- Enable RLS
alter table public.connections enable row level security;

-- RLS Policies for connections
create policy "connections_select_involved"
  on public.connections for select
  using (auth.uid() = requester_id or auth.uid() = recipient_id);

create policy "connections_insert_as_requester"
  on public.connections for insert
  with check (auth.uid() = requester_id);

create policy "connections_update_involved"
  on public.connections for update
  using (auth.uid() = requester_id or auth.uid() = recipient_id);

create policy "connections_delete_involved"
  on public.connections for delete
  using (auth.uid() = requester_id or auth.uid() = recipient_id);

-- Create updated_at trigger for connections
create trigger connections_updated_at
  before update on public.connections
  for each row
  execute function public.handle_updated_at();
