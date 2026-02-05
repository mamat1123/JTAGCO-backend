-- New columns for events table to support conditional form fields
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS sales_before_vat INTEGER;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS business_type VARCHAR(255);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS shoe_order_quantity INTEGER;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS has_appointment BOOLEAN DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS purchase_months TEXT[];
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS test_result VARCHAR(50);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS test_result_reason TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS got_job VARCHAR(50);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS got_job_reason TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS problem_type VARCHAR(100);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS present_time TIME;
