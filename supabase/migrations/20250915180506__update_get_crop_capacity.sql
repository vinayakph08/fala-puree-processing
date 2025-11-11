-- Update crop capacity function with revised values
CREATE OR REPLACE FUNCTION get_crop_capacity_per_gunta(crop_name_input TEXT)
RETURNS INTEGER AS $$
BEGIN
  -- Return capacity in kg per gunta based on crop type
  -- Updated values based on Karnataka farming data
  RETURN CASE UPPER(TRIM(crop_name_input))
    -- Primary Fala Crops - Leafy Vegetables
    WHEN 'SPINACH' THEN 80        -- Updated from 200
    WHEN 'CORIANDER' THEN 100      -- Updated from 150  
    WHEN 'MINT' THEN 120           -- Updated from 200 
    -- Default for other crops
    ELSE 100                       -- Updated from 250
  END;
END;
$$ LANGUAGE plpgsql;