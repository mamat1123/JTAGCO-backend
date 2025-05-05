-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Service role can do everything"
    on public.profiles
    for all
    to service_role
    using (true)
    with check (true);

-- Grant necessary permissions
grant all on public.profiles to service_role;
grant usage on schema public to service_role; 