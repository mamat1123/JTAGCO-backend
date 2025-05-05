-- Create customer table
create table if not exists public.customer (
    id uuid primary key default gen_random_uuid(),
    contact_id uuid,
    company_id text references public.companies(id) on delete cascade,
    contact_name text not null,
    position text,
    email text,
    phone text,
    line_id text,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.customer enable row level security;

-- Create policies
create policy "Users can view customers of their companies"
    on public.customer
    for select
    to authenticated
    using (
        exists (
            select 1 from public.companies
            where companies.id = customer.company_id
            and companies.user_id = auth.uid()
        )
    );

create policy "Users can insert customers for their companies"
    on public.customer
    for insert
    to authenticated
    with check (
        exists (
            select 1 from public.companies
            where companies.id = customer.company_id
            and companies.user_id = auth.uid()
        )
    );

create policy "Users can update customers of their companies"
    on public.customer
    for update
    to authenticated
    using (
        exists (
            select 1 from public.companies
            where companies.id = customer.company_id
            and companies.user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from public.companies
            where companies.id = customer.company_id
            and companies.user_id = auth.uid()
        )
    );

create policy "Users can delete customers of their companies"
    on public.customer
    for delete
    to authenticated
    using (
        exists (
            select 1 from public.companies
            where companies.id = customer.company_id
            and companies.user_id = auth.uid()
        )
    );

-- Grant necessary permissions
grant all on public.customer to authenticated; 