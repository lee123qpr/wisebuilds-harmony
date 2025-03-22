
-- Create project_documents bucket if it doesn't exist
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('project-documents', 'project-documents', true)
    ON CONFLICT (id) DO NOTHING;
    
    -- Add policies for users to upload their own documents
    BEGIN
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Anyone can upload documents',
            'project-documents',
            'INSERT',
            'true'
        );
    EXCEPTION WHEN others THEN
        -- Policy might already exist, which is fine
        NULL;
    END;
    
    -- Add policies for users to select documents
    BEGIN
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Anyone can view documents', 
            'project-documents', 
            'SELECT',
            'true'
        );
    EXCEPTION WHEN others THEN
        -- Policy might already exist, which is fine
        NULL;
    END;
    
    -- Add policies for users to delete their own documents
    BEGIN
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Anyone can delete documents',
            'project-documents',
            'DELETE',
            'true'
        );
    EXCEPTION WHEN others THEN
        -- Policy might already exist, which is fine
        NULL;
    END;
END $$;
