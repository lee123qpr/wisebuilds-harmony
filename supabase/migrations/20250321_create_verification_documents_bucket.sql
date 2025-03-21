
-- Create verification_documents bucket if it doesn't exist
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('verification_documents', 'verification_documents', false)
    ON CONFLICT (id) DO NOTHING;
    
    -- Add policies for users to upload their own documents
    BEGIN
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Users can upload their own documents',
            'verification_documents',
            'INSERT',
            '(bucket_id = ''verification_documents'' AND auth.uid()::text = SPLIT_PART(name, ''/'', 1))'
        );
    EXCEPTION WHEN others THEN
        -- Policy might already exist, which is fine
        NULL;
    END;
    
    -- Add policies for users to select their own documents
    BEGIN
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Users can view their own documents', 
            'verification_documents', 
            'SELECT',
            '(bucket_id = ''verification_documents'' AND auth.uid()::text = SPLIT_PART(name, ''/'', 1))'
        );
    EXCEPTION WHEN others THEN
        -- Policy might already exist, which is fine
        NULL;
    END;
    
    -- Add policies for users to delete their own documents
    BEGIN
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Users can delete their own documents',
            'verification_documents',
            'DELETE',
            '(bucket_id = ''verification_documents'' AND auth.uid()::text = SPLIT_PART(name, ''/'', 1))'
        );
    EXCEPTION WHEN others THEN
        -- Policy might already exist, which is fine
        NULL;
    END;
END $$;
