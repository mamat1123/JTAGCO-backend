-- Migration: Add TEST_RESULT check-in fields for event_checkins table
-- These fields are used when sub_type is TEST_RESULT

-- Add test result column (pass/fail)
ALTER TABLE public.event_checkins ADD COLUMN IF NOT EXISTS test_result VARCHAR(10);

-- Add test result reason column
ALTER TABLE public.event_checkins ADD COLUMN IF NOT EXISTS test_result_reason TEXT;

-- Add got job column (yes/no)
ALTER TABLE public.event_checkins ADD COLUMN IF NOT EXISTS got_job VARCHAR(10);

-- Add got job reason column
ALTER TABLE public.event_checkins ADD COLUMN IF NOT EXISTS got_job_reason TEXT;

-- Add comments explaining the usage
COMMENT ON COLUMN public.event_checkins.test_result IS 'Test result: pass (ผ่าน) or fail (ไม่ผ่าน)';
COMMENT ON COLUMN public.event_checkins.test_result_reason IS 'Reason for test failure when test_result is fail';
COMMENT ON COLUMN public.event_checkins.got_job IS 'Whether got the job: yes (ได้) or no (ไม่ได้)';
COMMENT ON COLUMN public.event_checkins.got_job_reason IS 'Reason for not getting job when got_job is no';
