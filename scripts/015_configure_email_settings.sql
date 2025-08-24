-- Configure additional email settings for CareerConnect
-- This script sets up professional email configuration

-- Update site configuration
UPDATE auth.config SET
  site_url = COALESCE(NULLIF(current_setting('app.settings.site_url', true), ''), 'http://localhost:3000'),
  uri_allow_list = COALESCE(NULLIF(current_setting('app.settings.uri_allow_list', true), ''), 'http://localhost:3000,https://*.vercel.app'),
  disable_signup = false,
  external_email_enabled = true,
  external_phone_enabled = false,
  mailer_secure_email_change_enabled = true,
  mailer_autoconfirm = false, -- Keep email confirmation enabled for security
  password_min_length = 8,
  refresh_token_rotation_enabled = true,
  reuse_refresh_tokens = false,
  security_refresh_token_reuse_interval = 10
WHERE TRUE;

-- Set email rate limits (prevent spam)
INSERT INTO auth.rate_limits (key_name, limit_value, period)
VALUES 
  ('email_confirmation', 3, 3600), -- 3 confirmation emails per hour
  ('password_recovery', 5, 3600),  -- 5 password resets per hour
  ('magic_link', 10, 3600)         -- 10 magic links per hour
ON CONFLICT (key_name) DO UPDATE SET
  limit_value = EXCLUDED.limit_value,
  period = EXCLUDED.period;

-- Create function to send welcome notification after email confirmation
CREATE OR REPLACE FUNCTION public.send_welcome_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only send welcome notification when email is confirmed for the first time
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    -- You can add logic here to send additional welcome notifications
    -- or trigger other onboarding processes
    
    -- Log the welcome event (optional)
    INSERT INTO public.user_events (user_id, event_type, event_data)
    VALUES (
      NEW.id,
      'welcome_sent',
      jsonb_build_object(
        'email', NEW.email,
        'confirmed_at', NEW.email_confirmed_at
      )
    ) ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create user_events table if it doesn't exist (for tracking user actions)
CREATE TABLE IF NOT EXISTS public.user_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on user_events
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- Create policies for user_events
CREATE POLICY "Users can view their own events" ON public.user_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert events" ON public.user_events
  FOR INSERT WITH CHECK (true);

-- Create trigger for welcome notifications
DROP TRIGGER IF EXISTS on_user_email_confirmed ON auth.users;
CREATE TRIGGER on_user_email_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.send_welcome_notification();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT ON public.user_events TO authenticated;
