-- Migration: Add problem_types column for FOUND_PROBLEM check-ins
-- This field is used when sub_type is FOUND_PROBLEM

-- Add problem_types array column
ALTER TABLE public.event_checkins ADD COLUMN IF NOT EXISTS problem_types TEXT[] DEFAULT '{}';

-- Add comment explaining usage
COMMENT ON COLUMN public.event_checkins.problem_types IS 'Array of problem types for FOUND_PROBLEM sub_type. Values: sole (พื้น), leather (หนัง), eyelet (ตาไก่), steel_toe (หัวเหล็ก), lining (ผ้าซับใน), insole (แผ่นรองใน)';
