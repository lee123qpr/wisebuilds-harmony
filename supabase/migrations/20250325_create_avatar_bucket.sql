
-- Create avatar bucket if it doesn't exist
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('avatar', 'avatar', true)
    ON CONFLICT (id) DO NOTHING;
    
    -- Add policies for users to upload their own avatars
    BEGIN
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Users can upload their own avatars',
            'avatar',
            'INSERT',
            'auth.uid()::text = (storage.foldername(name))[1]'
        );
    EXCEPTION WHEN others THEN
        -- Policy might already exist, which is fine
        NULL;
    END;
    
    -- Add policies for users to select their avatars (public)
    BEGIN
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Anyone can view avatars', 
            'avatar', 
            'SELECT',
            'true'
        );
    EXCEPTION WHEN others THEN
        -- Policy might already exist, which is fine
        NULL;
    END;
    
    -- Add policies for users to update their own avatars
    BEGIN
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Users can update their own avatars',
            'avatar',
            'UPDATE',
            'auth.uid()::text = (storage.foldername(name))[1]'
        );
    EXCEPTION WHEN others THEN
        -- Policy might already exist, which is fine
        NULL;
    END;
    
    -- Add policies for users to delete their own avatars
    BEGIN
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Users can delete their own avatars',
            'avatar',
            'DELETE',
            'auth.uid()::text = (storage.foldername(name))[1]'
        );
    EXCEPTION WHEN others THEN
        -- Policy might already exist, which is fine
        NULL;
    END;
END $$;
