-- Function 1: Get key dashboard metrics with crop filter
CREATE OR REPLACE FUNCTION get_dashboard_metrics(crop_filter TEXT DEFAULT NULL)
RETURNS TABLE (
    total_farmers INTEGER,
    total_land_sown INTEGER,
    total_inventory INTEGER,
    current_inventory INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        -- Total active farmers (for specific crop or all)
        (CASE 
            WHEN crop_filter IS NULL THEN 
                (SELECT COUNT(*)::INTEGER 
                 FROM user_profile 
                 WHERE role = 'FARMER' )
            ELSE 
                (SELECT COUNT(DISTINCT fi.farmer_id)::INTEGER 
                 FROM farmer_inventory fi
                 JOIN user_profile up ON up.id = fi.farmer_id
                 WHERE up.role = 'FARMER' 
                 AND fi.is_deleted = FALSE
                 AND fi.crop_name = crop_filter)
        END) as total_farmers,
        
        -- Total land sown in guntas (farmers only)
        (SELECT COALESCE(SUM(fi.number_of_guntas), 0)::INTEGER 
         FROM farmer_inventory fi
         JOIN user_profile up ON up.id = fi.farmer_id
         WHERE fi.is_deleted = FALSE
         AND up.role = 'FARMER'
         AND (crop_filter IS NULL OR fi.crop_name = crop_filter)) as total_land_sown,
        
        -- Total expected inventory (farmers only)
        (SELECT COALESCE(SUM(fi.total_expected_quantity), 0)::INTEGER 
         FROM farmer_inventory fi
         JOIN user_profile up ON up.id = fi.farmer_id
         WHERE fi.is_deleted = FALSE
         AND up.role = 'FARMER'
         AND (crop_filter IS NULL OR fi.crop_name = crop_filter)) as total_inventory,
        
        -- Current available inventory (farmers only)
        (SELECT COALESCE(SUM(fi.total_expected_quantity), 0)::INTEGER 
         FROM farmer_inventory fi
         JOIN user_profile up ON up.id = fi.farmer_id
         WHERE fi.is_deleted = FALSE 
         AND fi.is_available = TRUE 
         AND fi.harvest_available_date <= CURRENT_DATE
         AND up.role = 'FARMER'
         AND (crop_filter IS NULL OR fi.crop_name = crop_filter)) as current_inventory;
END;
$$;