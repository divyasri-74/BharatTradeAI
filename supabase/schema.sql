-- BharatTrade AI: Supabase starter schema
-- Run in Supabase SQL Editor. This schema stores user-specific paper trading data.
-- Enable RLS. Never expose the service_role key in the browser.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null,
  exchange text not null default 'NSE',
  company_name text,
  created_at timestamptz not null default now(),
  unique(user_id, symbol, exchange)
);

create table if not exists public.paper_portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My Paper Portfolio',
  virtual_cash numeric(18,2) not null default 100000 check (virtual_cash >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.paper_orders (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.paper_portfolios(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null,
  side text not null check (side in ('BUY','SELL')),
  quantity integer not null check (quantity > 0),
  price numeric(18,4) not null check (price > 0),
  status text not null default 'SIMULATED',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.watchlists enable row level security;
alter table public.paper_portfolios enable row level security;
alter table public.paper_orders enable row level security;

create policy "Users can read own profile" on public.profiles
for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
for update using (auth.uid() = id);

create policy "Users manage own watchlist" on public.watchlists
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own portfolios" on public.paper_portfolios
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own paper orders" on public.paper_orders
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Create a profile and default virtual portfolio when a new auth user registers.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', 'Trader'));
  insert into public.paper_portfolios (user_id, name, virtual_cash)
  values (new.id, 'My Paper Portfolio', 100000);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
