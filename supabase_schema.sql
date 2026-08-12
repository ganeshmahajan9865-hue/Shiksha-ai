-- Create the progress table for tracking student quiz scores
create table if not exists progress (
  id uuid default gen_random_uuid() primary key,
  student_id text not null,
  topic text not null,
  subject text not null,
  score integer not null,
  total integer not null,
  language text not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table progress enable row level security;

-- Create a policy that allows anyone to read/write (public access for development/MVP)
create policy "Allow public access" on progress
  for all
  using (true)
  with check (true);
