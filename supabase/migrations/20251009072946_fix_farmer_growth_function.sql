-- Fix farmer growth data to count by registration date instead of inventory creation date
CREATE OR REPLACE FUNCTION get_farmer_growth_data(crop_filter TEXT DEFAULT NULL)
RETURNS TABLE (
    month TEXT,
    farmers INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH months AS (
        SELECT 
            generate_series(
                DATE_TRUNC('month', CURRENT_DATE - INTERVAL '7 months'),
                DATE_TRUNC('month', CURRENT_DATE),
                INTERVAL '1 month'
            ) AS month_date
    )
    SELECT 
        TO_CHAR(m.month_date, 'Mon') as month,
        COALESCE(
            (SELECT COUNT(DISTINCT up.id)::INTEGER 
             FROM user_profile up
             WHERE up.role = 'FARMER' 
             AND DATE_TRUNC('month', up.created_at) = m.month_date
             AND (crop_filter IS NULL OR EXISTS (
                 SELECT 1 FROM farmer_inventory fi 
                 WHERE fi.farmer_id = up.id 
                 AND fi.is_deleted = FALSE 
                 AND fi.crop_name = crop_filter
             ))), 
            0
        ) as farmers
    FROM months m
    ORDER BY m.month_date;
END;
$$;