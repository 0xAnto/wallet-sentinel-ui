-- Check existing tables and fix any issues
-- Run this in Supabase SQL Editor

-- First, let's see what tables exist
SELECT table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('wallets', 'notifications', 'user_settings')
ORDER BY table_name, ordinal_position;

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('wallets', 'notifications', 'user_settings');

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('wallets', 'notifications', 'user_settings');
