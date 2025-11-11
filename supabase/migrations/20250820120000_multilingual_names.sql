-- Migration to add multilingual name support
-- This adds support for storing names in multiple languages/scripts

-- Add new columns for multilingual name support
ALTER TABLE user_profile 
ADD COLUMN first_name_kn TEXT,
ADD COLUMN last_name_kn TEXT,
ADD COLUMN first_name_en TEXT,
ADD COLUMN last_name_en TEXT,
ADD COLUMN primary_name_language TEXT DEFAULT 'kn' CHECK (primary_name_language IN ('kn', 'en'));

-- Migrate existing data to new structure
-- Detect script and populate appropriate columns
UPDATE user_profile 
SET 
  first_name_kn = CASE 
    WHEN first_name ~ '[ಅ-ಹ]' THEN first_name 
    ELSE NULL 
  END,
  last_name_kn = CASE 
    WHEN last_name ~ '[ಅ-ಹ]' THEN last_name 
    ELSE NULL 
  END,
  first_name_en = CASE 
    WHEN first_name ~ '^[a-zA-Z\s]+$' THEN first_name 
    ELSE NULL 
  END,
  last_name_en = CASE 
    WHEN last_name ~ '^[a-zA-Z\s]+$' THEN last_name 
    ELSE NULL 
  END,
  primary_name_language = CASE 
    WHEN first_name ~ '[ಅ-ಹ]' THEN 'kn' 
    ELSE 'en' 
  END;

-- Create function to get display name based on preference
CREATE OR REPLACE FUNCTION get_display_name(
  profile_row user_profile,
  display_language TEXT DEFAULT 'kn'
) RETURNS TEXT AS $$
BEGIN
  -- Try to get name in requested language
  IF display_language = 'kn' THEN
    IF profile_row.first_name_kn IS NOT NULL THEN
      RETURN CONCAT(
        COALESCE(profile_row.first_name_kn, ''),
        CASE WHEN profile_row.last_name_kn IS NOT NULL 
             THEN ' ' || profile_row.last_name_kn 
             ELSE '' END
      );
    END IF;
  END IF;
  
  IF display_language = 'en' THEN
    IF profile_row.first_name_en IS NOT NULL THEN
      RETURN CONCAT(
        COALESCE(profile_row.first_name_en, ''),
        CASE WHEN profile_row.last_name_en IS NOT NULL 
             THEN ' ' || profile_row.last_name_en 
             ELSE '' END
      );
    END IF;
  END IF;
  
  -- Fallback to primary language
  IF profile_row.primary_name_language = 'kn' THEN
    RETURN CONCAT(
      COALESCE(profile_row.first_name_kn, profile_row.first_name),
      CASE WHEN COALESCE(profile_row.last_name_kn, profile_row.last_name) IS NOT NULL 
           THEN ' ' || COALESCE(profile_row.last_name_kn, profile_row.last_name)
           ELSE '' END
    );
  ELSE
    RETURN CONCAT(
      COALESCE(profile_row.first_name_en, profile_row.first_name),
      CASE WHEN COALESCE(profile_row.last_name_en, profile_row.last_name) IS NOT NULL 
           THEN ' ' || COALESCE(profile_row.last_name_en, profile_row.last_name)
           ELSE '' END
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Add constraint to ensure at least one name variant exists
ALTER TABLE user_profile ADD CONSTRAINT check_name_exists 
CHECK (
  (first_name_kn IS NOT NULL OR first_name_en IS NOT NULL) AND
  (first_name IS NOT NULL) -- Keep backward compatibility
);

-- Update the handle_new_user function to support multilingual names
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_phone TEXT;
    user_first_name TEXT;
    user_last_name TEXT;
    user_location TEXT;
    user_role TEXT;
    detected_language TEXT;
BEGIN
    -- Extract user data from raw_user_meta_data JSON
    user_phone := NEW.raw_user_meta_data->>'phone_number';
    user_first_name := NEW.raw_user_meta_data->>'first_name';
    user_last_name := NEW.raw_user_meta_data->>'last_name';
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'FARMER');

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
    
    IF user_location IS NULL OR TRIM(user_location) = '' THEN
        RAISE EXCEPTION 'Location is required for farmer registration';
    END IF;
    
    IF user_role IS NULL OR user_role NOT IN ('FARMER', 'CUSTOMER', 'ADMIN', 'USER') THEN
        RAISE EXCEPTION 'Valid role is required for registration';
    END IF;

    -- Insert user profile with multilingual name support
    INSERT INTO public.user_profile (
        id,
        first_name, -- Keep for backward compatibility
        last_name,
        first_name_kn,
        last_name_kn,
        first_name_en,
        last_name_en,
        primary_name_language,
        mobile_number,
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
        COALESCE(NEW.raw_user_meta_data->>'language_preference', 'kn'),
        user_role,
        FALSE,
        TRUE
    );

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to create farmer profile: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
