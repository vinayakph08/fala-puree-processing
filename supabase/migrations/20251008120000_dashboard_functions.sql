-- Dashboard SQL Functions
-- Run this migration to add optimized dashboard data functions

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
        
        -- Total land sown in guntas
        (SELECT COALESCE(SUM(number_of_guntas), 0)::INTEGER 
         FROM farmer_inventory 
         WHERE is_deleted = FALSE
         AND (crop_filter IS NULL OR crop_name = crop_filter)) as total_land_sown,
        
        -- Total expected inventory
        (SELECT COALESCE(SUM(total_expected_quantity), 0)::INTEGER 
         FROM farmer_inventory 
         WHERE is_deleted = FALSE
         AND (crop_filter IS NULL OR crop_name = crop_filter)) as total_inventory,
        
        -- Current available inventory
        (SELECT COALESCE(SUM(total_expected_quantity), 0)::INTEGER 
         FROM farmer_inventory 
         WHERE is_deleted = FALSE 
         AND is_available = TRUE 
         AND harvest_available_date <= CURRENT_DATE
         AND (crop_filter IS NULL OR crop_name = crop_filter)) as current_inventory;
END;
$$;

-- Function 2: Get farmer growth data with crop filter (last 8 months)
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

-- Function 3: Get inventory usage data by crop type
CREATE OR REPLACE FUNCTION get_inventory_usage_data()
RETURNS TABLE (
    name TEXT,
    value INTEGER,
    color TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH crop_totals AS (
        SELECT 
            fi.crop_name,
            SUM(fi.total_expected_quantity) as total_quantity
        FROM farmer_inventory fi
        WHERE fi.is_deleted = FALSE
        GROUP BY fi.crop_name
        ORDER BY total_quantity DESC
    ),
    crop_colors AS (
        VALUES 
            ('Spinach', '#22c55e'),
            ('Coriander', '#3b82f6'),
            ('Mint', '#f59e0b'),
            ('Cabbage', '#ef4444'),
            ('Tomato', '#8b5cf6'),
            ('Onion', '#06b6d4'),
            ('Carrot', '#f97316'),
            ('Beans', '#84cc16')
    )
    SELECT 
        ct.crop_name as name,
        ct.total_quantity::INTEGER as value,
        COALESCE(cc.column2, '#64748b') as color
    FROM crop_totals ct
    LEFT JOIN crop_colors cc ON cc.column1 = ct.crop_name
    WHERE ct.total_quantity > 0
    LIMIT 8;
END;
$$;

-- Function 4: Get inventory growth data with crop filter (last 8 months)
CREATE OR REPLACE FUNCTION get_inventory_growth_data(crop_filter TEXT DEFAULT NULL)
RETURNS TABLE (
    month TEXT,
    inventory INTEGER
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
            (SELECT SUM(fi.total_expected_quantity)::INTEGER
             FROM farmer_inventory fi
             WHERE fi.is_deleted = FALSE
             AND DATE_TRUNC('month', fi.created_at) = m.month_date
             AND (crop_filter IS NULL OR fi.crop_name = crop_filter)), 
            0
        ) as inventory
    FROM months m
    ORDER BY m.month_date;
END;
$$;

-- Function 5: Get available crops for dropdown
CREATE OR REPLACE FUNCTION get_available_crops()
RETURNS TABLE (
    crop_name TEXT,
    total_quantity INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fi.crop_name,
        SUM(fi.total_expected_quantity)::INTEGER as total_quantity
    FROM farmer_inventory fi
    WHERE fi.is_deleted = FALSE
    GROUP BY fi.crop_name
    HAVING SUM(fi.total_expected_quantity) > 0
    ORDER BY total_quantity DESC;
END;
$$;