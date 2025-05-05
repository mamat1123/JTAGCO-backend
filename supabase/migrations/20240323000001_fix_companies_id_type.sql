-- First, let's check the current type of the id column
DO $$
BEGIN
    -- If the id column is not text, convert it
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'companies'
        AND column_name = 'id'
        AND data_type != 'text'
    ) THEN
        -- Create a temporary column
        ALTER TABLE public.companies ADD COLUMN id_new text;
        
        -- Copy data with type conversion
        UPDATE public.companies SET id_new = id::text;
        
        -- Drop the old column and rename the new one
        ALTER TABLE public.companies DROP COLUMN id;
        ALTER TABLE public.companies RENAME COLUMN id_new TO id;
        
        -- Make it the primary key
        ALTER TABLE public.companies ADD PRIMARY KEY (id);
    END IF;
END $$; 