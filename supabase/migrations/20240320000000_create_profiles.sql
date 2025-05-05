drop trigger if exists on_auth_user_created on auth.users;

drop function if exists public.handle_new_user();

-- Drop all tables
drop table if exists public.profiles cascade;

create table profiles (
  id serial primary key,
  user_id uuid references auth.users on delete cascade,
  username text unique,
  phone text,
  role text,
  user_email text,
  email text
);

-- Create a trigger to create profile after user registration
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    user_id,
    username,
    phone,
    role,
    user_email,
    email
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', new.email),
    coalesce(new.raw_user_meta_data->>'phone', null),
    coalesce(new.raw_user_meta_data->>'role', 'user'),
    coalesce(new.raw_user_meta_data->>'user_email', new.email),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 