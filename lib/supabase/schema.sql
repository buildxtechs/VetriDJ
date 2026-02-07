-- Create a table for public profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  role text check (role in ('ADMIN', 'CREW', 'CLIENT')) default 'CLIENT',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles for
select using (true);

create policy "Users can insert their own profile." on profiles for
insert
with
    check (auth.uid () = id);

create policy "Users can update own profile." on profiles for
update using (auth.uid () = id);

-- Membee Equipment Checklist Table
create table if not exists public.membee_checklists (
  checklist_id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  equipment_name text not null,
  status text check (status in ('PENDING', 'COMPLETED')) default 'PENDING',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Invoices Table
create table if not exists public.invoices (
  invoice_id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount numeric not null,
  status text check (status in ('PAID', 'UNPAID')) default 'UNPAID',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Customer Status Table
create table if not exists public.customer_status (
  status_id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  customer_number text not null,
  payment_currency text default 'INR',
  status_update text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for new tables (Basic policies)
alter table public.membee_checklists enable row level security;

alter table public.invoices enable row level security;

alter table public.customer_status enable row level security;

-- Admin can convert anything, users can view own data
-- (Simplified for now, refine as needed)
create policy "Admins can view all checklists" on membee_checklists for
select using (
        exists (
            select 1
            from profiles
            where
                id = auth.uid ()
                and role = 'ADMIN'
        )
    );

create policy "Users can view own checklists" on membee_checklists for
select using (auth.uid () = user_id);

create policy "Admins can view all invoices" on invoices for
select using (
        exists (
            select 1
            from profiles
            where
                id = auth.uid ()
                and role = 'ADMIN'
        )
    );

create policy "Users can view own invoices" on invoices for
select using (auth.uid () = user_id);

-- Function to handle new user signup (trigger)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, role)
  values (new.id, new.raw_user_meta_data ->> 'username', COALESCE(new.raw_user_meta_data ->> 'role', 'CLIENT'));
  return new;
end;
$$;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();