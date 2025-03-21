
-- Create function to check if a user is verified
CREATE OR REPLACE FUNCTION public.is_user_verified(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM freelancer_verification
    WHERE freelancer_verification.user_id = is_user_verified.user_id
    AND verification_status = 'verified'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
