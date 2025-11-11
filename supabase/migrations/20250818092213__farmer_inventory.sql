-- create farmer inventory table
CREATE TABLE IF NOT EXISTS farmer_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Reference to the farmer
    farmer_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
    -- Crop details
    crop_name TEXT NOT NULL,
    number_of_guntas INTEGER NOT NULL CHECK (number_of_guntas > 0),
    seed_sowed_date DATE NOT NULL,
    harvest_available_date DATE NOT NULL,
    total_expected_quantity INTEGER NOT NULL  CHECK (total_expected_quantity > 0),
    is_available BOOLEAN DEFAULT TRUE,
    
    -- Soft delete fields
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES public.user_profile(id),
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Additional fields for inventory details
    crop_location TEXT,
    crop_imageURL TEXT
);

-- Create index for efficient queries excluding deleted records
CREATE INDEX idx_farmer_inventory_active ON farmer_inventory (farmer_id, is_deleted) WHERE is_deleted = FALSE;
CREATE INDEX idx_farmer_inventory_available ON farmer_inventory (harvest_available_date, is_deleted) WHERE is_deleted = FALSE;

ALTER TABLE farmer_inventory ENABLE ROW LEVEL SECURITY;

-- Create a helper function to get user role from user_profile
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT role 
        FROM public.user_profile 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced policies with proper role checking
-- 🚜 FARMER POLICY - Full access to own crops only
CREATE POLICY "farmer_manage_own_crops" ON farmer_inventory
  FOR ALL USING (
    get_user_role() = 'FARMER' 
    AND auth.uid() = farmer_id
    AND is_deleted = FALSE
  );

-- 👑 ADMIN POLICY - Full access for support and analytics
CREATE POLICY "admin_full_access_all_crops" ON farmer_inventory
  FOR ALL USING (get_user_role() = 'ADMIN');

-- 👥 USER POLICY - Staff can help farmers manage active inventory
CREATE POLICY "staff_manage_active_crops" ON farmer_inventory
  FOR ALL USING (
    get_user_role() = 'USER' 
    AND is_deleted = FALSE
  );

-- 🛒 CUSTOMER POLICY - View only today/tomorrow available crops
CREATE POLICY "customer_view_available_crops" ON farmer_inventory
  FOR SELECT USING (
    get_user_role() = 'CUSTOMER' 
    AND is_deleted = FALSE 
    AND is_available = TRUE
    AND harvest_available_date::date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '1 day')
  );

-- Fix soft delete function with proper syntax and Kannada messages
CREATE OR REPLACE FUNCTION soft_delete_inventory(inventory_id UUID)
RETURNS JSON AS $$
DECLARE
    affected_rows INTEGER;
    user_role TEXT;
BEGIN
    user_role := get_user_role();
    
    -- Permission validation
    IF user_role NOT IN ('FARMER', 'ADMIN', 'USER') THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Insufficient permissions'
        );
    END IF;

    -- Check ownership for farmers
    IF user_role = 'FARMER' AND NOT EXISTS (
        SELECT 1 FROM farmer_inventory 
        WHERE id = inventory_id AND farmer_id = auth.uid() AND is_deleted = FALSE
    ) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Inventory not found or access denied'
        );
    END IF;

    -- Perform soft delete
    UPDATE farmer_inventory 
    SET 
        is_deleted = TRUE,
        deleted_at = CURRENT_TIMESTAMP,
        deleted_by = auth.uid(),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = inventory_id 
    AND is_deleted = FALSE
    AND (
        user_role = 'ADMIN' OR 
        (user_role IN ('FARMER', 'USER') AND farmer_id = auth.uid())
    );
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    
    RETURN json_build_object(
        'success', affected_rows > 0,
        'affected_rows', affected_rows,
        'message', CASE 
            WHEN affected_rows > 0 THEN 'Inventory deleted successfully'
            ELSE 'No changes made'
        END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix restore function with proper syntax and Kannada messages
CREATE OR REPLACE FUNCTION restore_inventory(inventory_id UUID)
RETURNS JSON AS $$
DECLARE
    affected_rows INTEGER;
    user_role TEXT;
BEGIN
    user_role := get_user_role();
    
    -- Farmers, users, and admins can restore
    IF user_role NOT IN ('FARMER', 'ADMIN', 'USER') THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Only farmers, users, and admins can restore inventory'
        );
    END IF;

    UPDATE farmer_inventory 
    SET 
        is_deleted = FALSE,
        deleted_at = NULL,
        deleted_by = NULL,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = inventory_id 
    AND is_deleted = TRUE
    AND (
        user_role = 'ADMIN' OR 
        (user_role IN ('FARMER', 'USER') AND farmer_id = auth.uid())
    );
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    
    RETURN json_build_object(
        'success', affected_rows > 0,
        'affected_rows', affected_rows,
        'message', CASE 
            WHEN affected_rows > 0 THEN 'Inventory restored successfully'
            ELSE 'No changes made'
        END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add helper function for farmers to get their active crops
CREATE OR REPLACE FUNCTION get_farmer_crops(farmer_uuid UUID DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    crop_name TEXT,
    number_of_guntas INTEGER,
    seed_sowed_date DATE,
    total_expected_quantity INTEGER,
    is_available BOOLEAN,
    harvest_available_date TIMESTAMP WITH TIME ZONE,
    crop_location TEXT,
    crop_imageurl TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    user_role TEXT;
    target_farmer UUID;
BEGIN
    user_role := get_user_role();
    target_farmer := COALESCE(farmer_uuid, auth.uid());
    
    -- Permission check for farmers
    IF user_role = 'FARMER' AND target_farmer != auth.uid() THEN
        RAISE EXCEPTION 'Farmers can only view their own crops';
    END IF;
    
    -- Return crops based on role
    RETURN QUERY
    SELECT 
        fi.id, fi.crop_name, fi.number_of_guntas, fi.seed_sowed_date,
        fi.total_expected_quantity, fi.is_available, fi.harvest_available_date, fi.crop_location, fi.crop_imageurl, fi.created_at
    FROM farmer_inventory fi
    WHERE fi.farmer_id = target_farmer
    AND (user_role = 'ADMIN' OR fi.is_deleted = FALSE)
    ORDER BY fi.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Create function to get crop capacity per gunta based on crop type
-- Focus on Fala's core crops: Spinach, Coriander, and Mint
CREATE OR REPLACE FUNCTION get_crop_capacity_per_gunta(crop_name_input TEXT)
RETURNS INTEGER AS $$
BEGIN
  -- Return capacity in kg per gunta based on crop type
  -- Values optimized for Karnataka's leafy vegetable farming
  RETURN CASE UPPER(TRIM(crop_name_input))
    -- 🥬 Primary Fala Crops - Leafy Vegetables
    WHEN 'SPINACH' THEN 200        -- ಪಾಲಕ್ - High yield leafy green
    WHEN 'CORIANDER' THEN 150      -- ಕೊತ್ತಂಬರಿ - Aromatic herb crop
    WHEN 'MINT' THEN 200           -- ಪುದೀನ - Fresh herb crop
    
    -- Default for any other crops (future expansion)
    ELSE 250
  END;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate total expected quantity
CREATE OR REPLACE FUNCTION calculate_total_expected_quantity(crop_name_input TEXT, number_of_gunta_input INTEGER)
RETURNS INTEGER AS $$
DECLARE
  capacity_per_gunta INTEGER;
  total_capacity INTEGER;
BEGIN
  -- Get capacity per gunta for the crop
  SELECT get_crop_capacity_per_gunta(crop_name_input) INTO capacity_per_gunta;
  
  -- Calculate total expected quantity
  total_capacity := capacity_per_gunta * number_of_gunta_input;
  
  RETURN total_capacity;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to automatically calculate total expected quantity
CREATE OR REPLACE FUNCTION set_total_expected_quantity()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate and set total expected quantity based on crop and gunta
  NEW.total_expected_quantity := calculate_total_expected_quantity(NEW.crop_name, NEW.number_of_guntas);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate total expected quantity
DROP TRIGGER IF EXISTS trigger_set_total_expected_quantity ON farmer_inventory;
CREATE TRIGGER trigger_set_total_expected_quantity
  BEFORE INSERT OR UPDATE OF crop_name, number_of_guntas ON farmer_inventory
  FOR EACH ROW
  EXECUTE FUNCTION set_total_expected_quantity();

-- Create function to calculate harvest dates based on start date
CREATE OR REPLACE FUNCTION calculate_harvest_dates(start_date DATE)
RETURNS TABLE(
  harvest_1 DATE
) AS $$
BEGIN
  -- First harvest: 25-30 days from start date (using 28 days as middle value)
  harvest_1 := start_date + INTERVAL '28 days';

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to automatically set harvest dates when sowed_date is inserted/updated
CREATE OR REPLACE FUNCTION set_harvest_dates()
RETURNS TRIGGER AS $$
DECLARE
  harvest_dates RECORD;
BEGIN
  -- Calculate harvest dates based on start_date
  SELECT * INTO harvest_dates FROM calculate_harvest_dates(NEW.seed_sowed_date);
  
  -- Set the calculated harvest dates
  NEW.harvest_available_date := harvest_dates.harvest_1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate harvest dates
DROP TRIGGER IF EXISTS trigger_set_harvest_dates ON farmer_inventory;
CREATE TRIGGER trigger_set_harvest_dates
  BEFORE INSERT OR UPDATE OF seed_sowed_date ON farmer_inventory
  FOR EACH ROW
  EXECUTE FUNCTION set_harvest_dates();


-- Grant permissions for authenticated farmers
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION get_farmer_crops(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION soft_delete_inventory(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION restore_inventory(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_harvest_dates(DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION get_crop_capacity_per_gunta(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_total_expected_quantity(TEXT, INTEGER) TO authenticated;
