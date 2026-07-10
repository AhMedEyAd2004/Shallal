-- SQL script to create the notes table for the dashboard.
-- Please run this in your Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  priority TEXT CHECK (priority IN ('low', 'mid', 'high')) DEFAULT 'low',
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to automatically update the 'updated_at' column
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
DROP TRIGGER IF EXISTS trigger_set_updated_at ON notes;
CREATE TRIGGER trigger_set_updated_at
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to do everything (or adjust based on your auth model)
CREATE POLICY "Enable all operations for authenticated users on notes" 
ON notes FOR ALL TO authenticated USING (true);
