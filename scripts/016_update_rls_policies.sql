-- Update RLS policies for immediate access without email confirmation
-- Since email confirmation is disabled, users can access their data immediately

-- Update profiles RLS policy to allow immediate access
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Update applications RLS policy for immediate access
DROP POLICY IF EXISTS "Users can view own applications" ON applications;
DROP POLICY IF EXISTS "Users can create applications" ON applications;

CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update user_skills RLS policy for immediate access
DROP POLICY IF EXISTS "Users can manage own skills" ON user_skills;

CREATE POLICY "Users can view own skills" ON user_skills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own skills" ON user_skills
  FOR ALL USING (auth.uid() = user_id);

-- Update connections RLS policy for immediate access
DROP POLICY IF EXISTS "Users can manage own connections" ON connections;

CREATE POLICY "Users can view connections" ON connections
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = requested_id);

CREATE POLICY "Users can create connections" ON connections
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update connections" ON connections
  FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = requested_id);

-- Ensure all users can view public data
CREATE POLICY IF NOT EXISTS "Anyone can view companies" ON companies
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can view jobs" ON jobs
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can view skills" ON skills
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can view job skills" ON job_skills
  FOR SELECT USING (true);

-- Allow users to view other profiles (for networking)
CREATE POLICY IF NOT EXISTS "Anyone can view profiles" ON profiles
  FOR SELECT USING (true);
