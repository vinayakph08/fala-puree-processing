-- Migration: Add farm functionality for farmer registration
-- Created: 2025-09-03
-- Purpose: Create farm table and extend user registration to generate farm IDs for farmers

-- ============================================================================
-- 1. TABLE STRUCTURE CHANGES
-- ============================================================================

-- Add farm-related columns to user_profile table
ALTER TABLE user_profile 
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS district TEXT, 
ADD COLUMN IF NOT EXISTS village TEXT,
ADD COLUMN IF NOT EXISTS farm_id TEXT;

-- Create farm table to store farm information
CREATE TABLE IF NOT EXISTS farm (
    farm_id TEXT PRIMARY KEY,
    farmer_id UUID NOT NULL REFERENCES user_profile(id) ON DELETE CASCADE,
    farm_name TEXT,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    village TEXT NOT NULL,
    farm_size_acres DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 2. SECURITY POLICIES
-- ============================================================================

-- Enable RLS for farm table
ALTER TABLE farm ENABLE ROW LEVEL SECURITY;

-- Farmers and Admins can manage farms
CREATE POLICY "Farmers and Admins can manage farms" ON farm
    FOR ALL USING (
        farmer_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM user_profile WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- ============================================================================
-- 3. FUNCTIONS (WITH EXPLICIT SCHEMA)
-- ============================================================================

-- Generate unique farm ID with explicit schema qualification
CREATE OR REPLACE FUNCTION generate_farm_id(p_farm_prefix TEXT) 
RETURNS TEXT AS $$
DECLARE
    new_farm_id TEXT;
    max_number INT;
    lock_key BIGINT;
BEGIN
    -- Validate input parameter
    IF p_farm_prefix IS NULL OR LENGTH(TRIM(p_farm_prefix)) != 6 THEN
        RAISE EXCEPTION 'Farm prefix must be exactly 6 characters';
    END IF;

    -- Create a unique lock key based on prefix
    lock_key := ('x' || md5(TRIM(p_farm_prefix)))::bit(32)::BIGINT;
    
    -- Acquire advisory lock for this prefix
    PERFORM pg_advisory_lock(lock_key);

    BEGIN
        -- Get the maximum number for this prefix
        SELECT COALESCE(MAX(CAST(SUBSTRING(farm_id FROM '[0-9]+$') AS INT)), 0)
        INTO max_number
        FROM public.farm 
        WHERE farm_id LIKE TRIM(p_farm_prefix) || '%';

        -- Check capacity limit
        IF max_number >= 9999 THEN
            RAISE EXCEPTION 'Maximum farm capacity reached for location';
        END IF;

        -- Generate new farm ID
        new_farm_id := TRIM(p_farm_prefix) || LPAD((max_number + 1)::TEXT, 4, '0');
        
        -- Release the advisory lock
        PERFORM pg_advisory_unlock(lock_key);
        
        RETURN new_farm_id;
    EXCEPTION
        WHEN OTHERS THEN
            -- Ensure lock is released even on error
            PERFORM pg_advisory_unlock(lock_key);
            RAISE;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- create a function to add the farm details in farm table
CREATE OR REPLACE FUNCTION public.add_farm_details(
    p_farm_id TEXT,
    p_farmer_id UUID,
    p_farm_name TEXT,
    p_state TEXT,
    p_district TEXT,
    p_village TEXT,
    p_farm_size_acres DECIMAL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
) RETURNS VOID AS $$
BEGIN
    INSERT INTO public.farm (
        farm_id, farmer_id, farm_name, state, district, village, farm_size_acres, created_at, updated_at    
    ) VALUES (
        p_farm_id, p_farmer_id, p_farm_name, p_state, p_district, p_village, p_farm_size_acres, created_at, updated_at  
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced user registration function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_phone TEXT;
    user_first_name TEXT;
    user_last_name TEXT;
    user_role TEXT;
    user_state TEXT;
    user_district TEXT;
    user_village TEXT;
    farm_id TEXT;
    generated_farm_id TEXT;
    detected_language TEXT;
BEGIN
    -- Extract user data from raw_user_meta_data JSON
    user_phone := NEW.raw_user_meta_data->>'phone_number';
    user_first_name := NEW.raw_user_meta_data->>'first_name';
    user_last_name := NEW.raw_user_meta_data->>'last_name';
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'FARMER');
    user_state := NEW.raw_user_meta_data->>'state';
    user_district := NEW.raw_user_meta_data->>'district';
    user_village := NEW.raw_user_meta_data->>'village';
    farm_id := NEW.raw_user_meta_data->>'farm_id';

    -- Detect language/script of the name
    detected_language := CASE 
        WHEN user_first_name ~ '[ಅ-ಹ]' THEN 'kn'
        ELSE 'en'
    END;

    -- Validate required fields
    IF user_phone IS NULL THEN
        RAISE EXCEPTION 'Phone number is required for farmer registration';
    END IF;
    
    IF user_first_name IS NULL OR TRIM(user_first_name) = '' THEN
        RAISE EXCEPTION 'First name is required for farmer registration';
    END IF;
    
    IF user_role IS NULL OR user_role NOT IN ('FARMER', 'CUSTOMER', 'ADMIN', 'USER') THEN
        RAISE EXCEPTION 'Valid role is required for registration';
    END IF;

    -- Insert user profile (fallback for missing multilingual columns)
    INSERT INTO public.user_profile (
        id,
        first_name,
        last_name,
        first_name_kn,
        last_name_kn,
        first_name_en,
        last_name_en,
        primary_name_language,
        mobile_number,
        state,
        district,
        village,
        farm_id,
        language_preference,
        role,
        is_verified,
        is_active
    ) VALUES (
        NEW.id,
        TRIM(user_first_name),
        TRIM(COALESCE(user_last_name, '')),
        CASE WHEN detected_language = 'kn' THEN TRIM(user_first_name) ELSE NULL END,
        CASE WHEN detected_language = 'kn' THEN TRIM(COALESCE(user_last_name, '')) ELSE NULL END,
        CASE WHEN detected_language = 'en' THEN TRIM(user_first_name) ELSE NULL END,
        CASE WHEN detected_language = 'en' THEN TRIM(COALESCE(user_last_name, '')) ELSE NULL END,
        detected_language,
        user_phone,
        TRIM(user_state),
        TRIM(user_district),
        TRIM(user_village),
        farm_id,
        COALESCE(NEW.raw_user_meta_data->>'language_preference', 'kn'),
        user_role,
        FALSE,
        TRUE
    );

    -- Now create farm record if farm_id exists
    IF farm_id IS NOT NULL AND user_role = 'FARMER' THEN
        PERFORM public.add_farm_details(
            farm_id,
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'farm_name', 'My Farm'),
            user_state,
            user_district,
            user_village,
            COALESCE((NEW.raw_user_meta_data->>'farm_size_acres')::DECIMAL, 0),
            TIMEZONE('utc'::text, NOW()),
            TIMEZONE('utc'::text, NOW())
        );
    END IF;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
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

-- ============================================================================
-- 5. PERMISSIONS
-- ============================================================================

-- Grant permissions explicitly
-- GRANT EXECUTE ON FUNCTION public.generate_farm_id(TEXT) TO authenticated;
-- GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;