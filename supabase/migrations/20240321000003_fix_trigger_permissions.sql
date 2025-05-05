-- Grant necessary permissions to the trigger function
grant usage on schema public to postgres;
grant all on public.profiles to postgres;
grant all on public.profiles_id_seq to postgres;

-- Ensure the trigger function has the right permissions
alter function public.handle_new_user() security definer; 