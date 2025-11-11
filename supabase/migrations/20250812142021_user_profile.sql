-- Create user_profile table (extends auth.users)
CREATE TABLE user_profile (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  title TEXT CHECK (title IN ('sri', 'srimati')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,  -- Changed to NOT NULL
  mobile_number TEXT UNIQUE NOT NULL,
  email TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  role TEXT NOT NULL DEFAULT 'ADMIN' CHECK (role IN ( 'ADMIN', 'USER')),  -- Changed to NOT NULL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Check if user is admin
create or replace function is_admin()
returns boolean AS $$
select exists(
    select 1
    from user_profile
    where id = auth.uid() and role = 'ADMIN'
)
$$ language sql security definer stable;

-- Enable RLS (Row Level Security)
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

-- add row level security policies for admin
create policy "admins can update/insert/delete any profile" on user_profile
  for all using (is_admin());

-- Create policy for users to only access their own profile
CREATE POLICY "Users can view own profile" ON user_profile
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profile
  FOR UPDATE USING (auth.uid() = id);

-- Allow system to insert new user profiles during signup
CREATE POLICY "System can insert user profiles" ON user_profile
  FOR INSERT WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profile_updated_at
    BEFORE UPDATE ON user_profile
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user sign up and create profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_phone TEXT;
    user_first_name TEXT;
    user_last_name TEXT;
    user_role TEXT;
BEGIN
    -- Extract user data from raw_user_meta_data JSON
    user_phone := NEW.raw_user_meta_data->>'phone_number';
    user_first_name := NEW.raw_user_meta_data->>'first_name';
    user_last_name := NEW.raw_user_meta_data->>'last_name';
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'ADMIN');

    -- Validate all required fields for admin registration
    IF user_phone IS NULL THEN
        RAISE EXCEPTION 'Phone number is required for admin registration';
    END IF;
    
    IF user_first_name IS NULL OR TRIM(user_first_name) = '' THEN
        RAISE EXCEPTION 'First name is required for admin registration';
    END IF;
    
    IF user_last_name IS NULL OR TRIM(user_last_name) = '' THEN
        RAISE EXCEPTION 'Last name is required for admin registration';
    END IF;
    
    IF user_role IS NULL OR user_role NOT IN ('ADMIN', 'USER') THEN
        RAISE EXCEPTION 'Valid role is required for registration';
    END IF;

    -- Insert user profile with extracted data
    INSERT INTO public.user_profile (
        id,
        first_name,
        last_name,
        mobile_number,
        role,
        is_verified,
        is_active
    ) VALUES (
        NEW.id,
        TRIM(user_first_name),
        TRIM(user_last_name),
        user_phone,
        user_role,
        FALSE,
        TRUE
    );

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error and re-raise to block the sign up
        RAISE EXCEPTION 'Failed to create farmer profile: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 4. TRIGGERS
-- ============================================================================

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- -- Grant necessary permissions for farmer operations
-- GRANT USAGE ON SCHEMA public TO authenticated;
-- GRANT ALL ON public.user_profile TO authenticated;