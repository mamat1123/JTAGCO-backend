-- Migration: Add PRESENT check-in fields for event_checkins table
-- These fields are used when sub_type is PRESENT or main_type is FIRST_VISIT

-- Add product selections JSONB column to store array of products with price ranges
ALTER TABLE public.event_checkins ADD COLUMN IF NOT EXISTS product_selections JSONB DEFAULT '[]'::jsonb;

-- Add delivery duration column (1 week, 2 weeks, etc.)
ALTER TABLE public.event_checkins ADD COLUMN IF NOT EXISTS delivery_duration VARCHAR(20);

-- Add purchase type column (monthly/ทยอย or yearly/ประจำปี)
ALTER TABLE public.event_checkins ADD COLUMN IF NOT EXISTS purchase_type VARCHAR(20);

-- Add purchase months array (for monthly purchase type)
ALTER TABLE public.event_checkins ADD COLUMN IF NOT EXISTS purchase_months TEXT[] DEFAULT '{}';

-- Add competitor brand column
ALTER TABLE public.event_checkins ADD COLUMN IF NOT EXISTS competitor_brand VARCHAR(255);

-- Add special requirements text column
ALTER TABLE public.event_checkins ADD COLUMN IF NOT EXISTS special_requirements TEXT;

-- Add comment explaining the usage
COMMENT ON COLUMN public.event_checkins.product_selections IS 'Array of products with price and price ranges for PRESENT sub_type or FIRST_VISIT main_type. Format: [{"product_id": "uuid", "name": "string", "price": number, "price_ranges": ["<400", "400-450"]}]';
COMMENT ON COLUMN public.event_checkins.delivery_duration IS 'Delivery duration: 1, 2, 3, 4, or 5+ weeks';
COMMENT ON COLUMN public.event_checkins.purchase_type IS 'Purchase type: monthly (ทยอย) or yearly (ประจำปี)';
COMMENT ON COLUMN public.event_checkins.purchase_months IS 'Array of purchase months (01-12) when purchase_type is monthly';
COMMENT ON COLUMN public.event_checkins.competitor_brand IS 'Competitor brand name';
COMMENT ON COLUMN public.event_checkins.special_requirements IS 'Special customer requirements';
