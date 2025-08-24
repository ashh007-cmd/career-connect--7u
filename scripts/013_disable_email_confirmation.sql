-- Disable email confirmation for immediate signup
-- This allows users to sign up and login immediately without email verification

-- Update auth settings to disable email confirmation
UPDATE auth.config 
SET 
  enable_signup = true,
  enable_confirmations = false,
  email_confirm_changes = false
WHERE id = 1;

-- If the above doesn't work (depending on Supabase version), you can also try:
-- This is typically done through Supabase Dashboard > Authentication > Settings
-- But we'll include the SQL approach as well

-- Ensure users are automatically confirmed upon signup
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically confirm the user
  UPDATE auth.users 
  SET email_confirmed_at = NOW(), confirmed_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-confirm users on signup
DROP TRIGGER IF EXISTS on_auth_user_created_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_confirm
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();
