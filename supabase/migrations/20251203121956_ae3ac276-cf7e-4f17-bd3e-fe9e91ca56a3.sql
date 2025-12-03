-- Add temperature and humidity columns to EpoxyMix table
ALTER TABLE public."EpoxyMix"
ADD COLUMN IF NOT EXISTS "Temperature_1" text,
ADD COLUMN IF NOT EXISTS "Temperature_2" text,
ADD COLUMN IF NOT EXISTS "Humidity_1" text,
ADD COLUMN IF NOT EXISTS "Humidity_2" text,
ADD COLUMN IF NOT EXISTS "Sensor_Timestamp" text;