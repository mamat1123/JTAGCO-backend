-- Add fullname column to profiles table
alter table public.profiles
  add column if not exists fullname text;

-- Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create a new function to handle profile creation with fullname
create or replace function public.handle_new_user()
returns trigger as $$
declare
    padded_id text;
begin
    -- Get the next ID from the sequence
    select nextval('profiles_id_seq') into padded_id;
    
    -- Pad the ID with leading zeros to make it 2 digits
    padded_id := lpad(padded_id::text, 2, '0');
    
    insert into public.profiles (
        id,
        user_id,
        username,
        phone,
        role,
        user_email,
        email,
        fullname
    )
    values (
        padded_id::integer,
        new.id,
        coalesce(new.raw_user_meta_data->>'username', new.email),
        coalesce(new.raw_user_meta_data->>'phone', null),
        coalesce(new.raw_user_meta_data->>'role', 'user'),
        coalesce(new.raw_user_meta_data->>'user_email', new.email),
        new.email,
        coalesce(new.raw_user_meta_data->>'fullname', null)
    );
    return new;
end;
$$ language plpgsql security definer;

-- Recreate the trigger
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user(); 