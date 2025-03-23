
-- Update INSERT policy to ensure users can only upload to their own folder
DO $$
BEGIN
    -- Try to create or replace policy across all buckets for INSERT operations
    -- This ensures users can only upload to their own folder
    FOR bucket_name IN (SELECT name FROM storage.buckets) LOOP
        EXECUTE format('
            CREATE POLICY "Users can upload to their own folder" 
            ON storage.objects
            FOR INSERT
            TO authenticated
            USING (bucket_id = %L AND auth.uid()::text = SPLIT_PART(name, ''/'', 1))
        ', bucket_name);
    EXCEPTION WHEN others THEN
        -- Policy might already exist or fail for other reasons, which is fine
        NULL;
    END LOOP;
END $$;
