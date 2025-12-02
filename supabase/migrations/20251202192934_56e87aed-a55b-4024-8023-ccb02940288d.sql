-- Add Cup A and Cup B columns to EpoxyMix table
ALTER TABLE public."EpoxyMix" 
ADD COLUMN IF NOT EXISTS "Cup A" text,
ADD COLUMN IF NOT EXISTS "Cup B" text;