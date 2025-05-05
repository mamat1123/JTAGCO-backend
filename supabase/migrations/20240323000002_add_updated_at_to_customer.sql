-- Add updated_at column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'customer'
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.customer
        ADD COLUMN updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS update_customer_updated_at ON public.customer;

-- Create the trigger
CREATE TRIGGER update_customer_updated_at
    BEFORE UPDATE ON public.customer
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column(); 