CREATE OR REPLACE FUNCTION get_farmer_harvestable_inventory(
    crop_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
    farmer_id UUID,
    farm_id TEXT,
    farmer_name TEXT,
    crop_name TEXT,
    harvestable_quantity NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id as farmer_id,
        up.farm_id as farm_id,
        up.first_name as farmer_name,
        fi.crop_name,
        SUM(COALESCE(fi.total_expected_quantity, 0))::NUMERIC as harvestable_quantity
    FROM user_profile up
    INNER JOIN farmer_inventory fi ON up.id = fi.farmer_id
    WHERE up.role = 'FARMER'
      AND fi.harvest_available_date <= CURRENT_DATE
      AND fi.total_expected_quantity > 0
      AND (crop_filter IS NULL OR LOWER(fi.crop_name) = LOWER(crop_filter))
      AND fi.is_deleted = FALSE
    GROUP BY up.id, up.farm_id, up.first_name, fi.crop_name
    ORDER BY harvestable_quantity DESC;
END;
$$;