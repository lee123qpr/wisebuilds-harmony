
-- Create helper function to create storage policies
CREATE OR REPLACE FUNCTION public.create_storage_policy(
  bucket_name TEXT,
  policy_name TEXT,
  operation TEXT,
  policy_definition TEXT
) RETURNS VOID AS $$
BEGIN
  -- Check if policy already exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = policy_name AND bucket_id = bucket_name
  ) THEN
    -- Create the policy
    INSERT INTO storage.policies (name, bucket_id, operation, definition)
    VALUES (policy_name, bucket_name, operation, policy_definition);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
