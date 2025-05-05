-- First, create a temporary column to store the UUID values
alter table public.companies 
  add column user_id_new uuid;

-- Update the temporary column with UUID values
-- Note: This assumes the integer user_id corresponds to auth.users.id
update public.companies c
set user_id_new = u.id::uuid
from auth.users u
where c.user_id::text = u.id::text;

-- Drop the old column and rename the new one
alter table public.companies 
  drop column user_id;

alter table public.companies 
  rename column user_id_new to user_id;

-- Add the foreign key constraint
alter table public.companies
  add constraint companies_user_id_fkey
  foreign key (user_id)
  references auth.users(id)
  on delete cascade; 