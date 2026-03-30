-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text check (role in ('student', 'faculty', 'admin')),
  phone text,
  school text,
  department text,
  discipline text,
  designation text,
  specialization text,
  shortlist int[] default array[]::int[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) for profiles
alter table profiles enable row level security;

-- SECURITY UPDATE: Restrict this in production to authenticated users only
-- create policy "Public profiles are viewable by everyone." on profiles
--   for select using (auth.role() = 'authenticated');

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for companies (Industry Partners)
create table companies (
    id serial primary key,
    name text not null,
    location text,
    discipline text,
    image text,
    type text,
    capacity int,
    description text,
    date text, -- Storing date as text to match current frontend format, consider adjusting to date type later
    requirements text[], -- Array of strings
    tags text[],
    itinerary jsonb, -- Storing complex object array as JSONB
    representative jsonb, -- Storing representative info as JSONB
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for companies
alter table companies enable row level security;

create policy "Companies are viewable by everyone." on companies
  for select using (true);

-- Only admins/service role can insert/update companies for now
-- (Policies for insert/update are left restrictive by default)

-- Create a table for organization approval requests
create table organization_requests (
    id uuid default gen_random_uuid() primary key,
    organization_name text not null,
    website_url text,
    industry_sector text not null,
    expected_capacity text,
    contact_name text not null,
    contact_title text not null,
    contact_email text not null,
    contact_phone text,
    additional_notes text,
    status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for organization_requests
alter table organization_requests enable row level security;

-- Anyone can submit (anonymous insert)
create policy "Anyone can submit an organization request." on organization_requests
  for insert with check (true);

-- Only admins can view requests (or authenticated users, depending on strictness)
create policy "Admins can view organization requests." on organization_requests
  for select using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can update organization requests." on organization_requests
  for update using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
