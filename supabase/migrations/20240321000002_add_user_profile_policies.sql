-- Allow users to read their own profile
create policy "Users can read own profile"
    on public.profiles
    for select
    to authenticated
    using (auth.uid() = user_id);

-- Allow users to update their own profile
create policy "Users can update own profile"
    on public.profiles
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Allow users to insert their own profile
create policy "Users can insert own profile"
    on public.profiles
    for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
grant all on public.profiles to authenticated; 