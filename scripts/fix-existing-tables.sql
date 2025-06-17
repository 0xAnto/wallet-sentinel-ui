-- Fix existing tables if needed
-- Only run the parts that are missing

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Check and add nickname column to wallets if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'wallets' AND column_name = 'nickname') THEN
        ALTER TABLE wallets ADD COLUMN nickname TEXT;
    END IF;
    
    -- Check and add updated_at column to wallets if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'wallets' AND column_name = 'updated_at') THEN
        ALTER TABLE wallets ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can manage their own wallets" ON wallets;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Allow service to insert notifications" ON notifications;
DROP POLICY IF EXISTS "Users can manage their own settings" ON user_settings;

-- Create comprehensive policies
CREATE POLICY "Users can manage their own wallets" ON wallets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow service to insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can manage their own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
