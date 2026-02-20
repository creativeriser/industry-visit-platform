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
