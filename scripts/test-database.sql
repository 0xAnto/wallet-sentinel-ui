-- Test the database setup
-- Run this to verify everything works

-- Test data insertion (will be cleaned up)
DO $$
DECLARE
    test_user_id UUID := '00000000-0000-0000-0000-000000000000';
    test_wallet_id UUID;
BEGIN
    -- Insert test wallet
    INSERT INTO wallets (user_id, address, threshold, nickname)
    VALUES (test_user_id, '0xtest123', 10.0, 'Test Wallet')
    RETURNING id INTO test_wallet_id;
    
    -- Insert test notification
    INSERT INTO notifications (user_id, wallet_id, wallet_address, balance, threshold)
    VALUES (test_user_id, test_wallet_id, '0xtest123', 5.0, 10.0);
    
    -- Insert test settings
    INSERT INTO user_settings (user_id, email_notifications, notification_frequency)
    VALUES (test_user_id, true, 'immediate')
    ON CONFLICT (user_id) DO UPDATE SET
        email_notifications = EXCLUDED.email_notifications,
        notification_frequency = EXCLUDED.notification_frequency;
    
    -- Clean up test data
    DELETE FROM notifications WHERE user_id = test_user_id;
    DELETE FROM user_settings WHERE user_id = test_user_id;
    DELETE FROM wallets WHERE user_id = test_user_id;
    
    RAISE NOTICE 'Database test completed successfully!';
END $$;
