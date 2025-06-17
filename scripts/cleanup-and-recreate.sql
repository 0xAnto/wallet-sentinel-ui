-- Clean up existing tables and recreate them properly
-- Run this in Supabase SQL Editor

-- Drop existing tables in correct order (due to foreign key constraints)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;

-- Recreate wallets table
CREATE TABLE wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  address TEXT NOT NULL,
  threshold NUMERIC(20,8) NOT NULL DEFAULT 10.0,
  nickname TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, address)
);

-- Recreate notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE NOT NULL,
  wallet_address TEXT NOT NULL,
  balance NUMERIC(20,8) NOT NULL,
  threshold NUMERIC(20,8) NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  email_sent BOOLEAN DEFAULT FALSE
);

-- Recreate user_settings table
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  notification_frequency TEXT DEFAULT 'immediate',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for wallets
CREATE POLICY "Users can manage their own wallets" ON wallets
  USING (auth.uid() = user_id);

-- Create policies for notifications  
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow service to insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Create policies for user_settings
CREATE POLICY "Users can manage their own settings" ON user_settings
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
