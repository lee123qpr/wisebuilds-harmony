
-- Update INSERT policy to ensure users can only upload to their own folder
CREATE OR REPLACE POLICY "Freelancers can upload their own avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.uid()::text = SPLIT_PART(key, '/', 1)
);
