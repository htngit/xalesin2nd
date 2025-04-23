-- Create tenant table
CREATE TABLE IF NOT EXISTS public.tenant (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE,
  industry TEXT,
  company_size TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profile table
CREATE TABLE IF NOT EXISTS public.profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  phone TEXT,
  position TEXT,
  tenant_id UUID REFERENCES public.tenant(id),
  onboarding_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create department table
CREATE TABLE IF NOT EXISTS public.department (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenant(id),
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create team table
CREATE TABLE IF NOT EXISTS public.team (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID REFERENCES public.department(id),
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profile(id),
  team_id UUID REFERENCES public.team(id),
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create invites table
CREATE TABLE IF NOT EXISTS public.invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invited_by UUID,
  tenant_id UUID,
  team_id UUID,
  email TEXT,
  role TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable realtime for all tables
alter publication supabase_realtime add table tenant;
alter publication supabase_realtime add table profile;
alter publication supabase_realtime add table department;
alter publication supabase_realtime add table team;
alter publication supabase_realtime add table team_members;
alter publication supabase_realtime add table invites;