-- Migration to change filter_config column from jsonb to text
-- This allows storing URLs as strings instead of JSON objects

-- First, drop the existing index if it exists
DROP INDEX IF EXISTS idx_contact_leads_filter_config;

-- Change the column type from jsonb to text
ALTER TABLE public.contact_leads 
ALTER COLUMN filter_config TYPE text USING 
  CASE 
    WHEN filter_config IS NULL THEN NULL
    WHEN filter_config = '{}'::jsonb THEN NULL
    ELSE filter_config::text
  END;

-- Add a new index for the text column
CREATE INDEX IF NOT EXISTS idx_contact_leads_filter_config 
ON public.contact_leads USING btree (filter_config) 
WHERE filter_config IS NOT NULL;

-- Add a comment to document the change
COMMENT ON COLUMN public.contact_leads.filter_config IS 'URL string for filter configuration (changed from jsonb to text)';
