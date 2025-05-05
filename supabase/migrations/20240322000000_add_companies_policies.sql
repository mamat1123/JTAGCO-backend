-- Enable RLS
alter table public.companies enable row level security;

-- Create policies for authenticated users
create policy "Users can view their own companies"
    on public.companies
    for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert their own companies"
    on public.companies
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own companies"
    on public.companies
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own companies"
    on public.companies
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
grant all on public.companies to authenticated; 