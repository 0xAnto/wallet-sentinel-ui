-- Check what tables already exist and their structure
-- Run this first to see what's already in your database

-- Check if tables exist
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('wallets', 'notifications', 'user_settings');

-- Check wallets table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'wallets' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check notifications table structure  
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'notifications' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check user_settings table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_settings' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check existing policies
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies 
WHERE tablename IN ('wallets', 'notifications', 'user_settings');
