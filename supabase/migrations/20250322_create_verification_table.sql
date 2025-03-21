
-- Create the freelancer_verification table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.freelancer_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  id_document_path TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'not_submitted')),
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add updated_at trigger
CREATE TRIGGER set_freelancer_verification_updated_at
BEFORE UPDATE ON public.freelancer_verification
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Enable RLS on the table
ALTER TABLE public.freelancer_verification ENABLE ROW LEVEL SECURITY;

-- Create policy allowing users to view only their own verification data
DROP POLICY IF EXISTS "Users can view own verification data" ON public.freelancer_verification;
CREATE POLICY "Users can view own verification data"
  ON public.freelancer_verification
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy allowing users to insert their own verification data
DROP POLICY IF EXISTS "Users can insert own verification data" ON public.freelancer_verification;
CREATE POLICY "Users can insert own verification data"
  ON public.freelancer_verification
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy allowing users to update their own verification data
DROP POLICY IF EXISTS "Users can update own verification data" ON public.freelancer_verification;
CREATE POLICY "Users can update own verification data"
  ON public.freelancer_verification
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy allowing admin to perform all operations on verification data
DROP POLICY IF EXISTS "Admin can manage all verification data" ON public.freelancer_verification;
CREATE POLICY "Admin can manage all verification data"
  ON public.freelancer_verification
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE auth.users.is_super_admin = true
  ));
