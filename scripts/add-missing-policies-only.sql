-- If you want to keep existing tables and just add missing policies
-- Run this only if you want to preserve existing data

-- Drop existing policies first (if any)
DROP POLICY IF EXISTS "Users can manage their own wallets" ON wallets;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Allow service to insert notifications" ON notifications;
DROP POLICY IF EXISTS "Users can manage their own settings" ON user_settings;

-- Enable RLS (safe to run even if already enabled)
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own wallets" ON wallets
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow service to insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can manage their own settings" ON user_settings
  USING (auth.uid() = user_id);

-- Create indexes (safe to run, will skip if they exist)
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
