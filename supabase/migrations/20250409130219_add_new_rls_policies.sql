-- Create policies for users table
CREATE POLICY "Admins can select users" ON public.users
  FOR SELECT USING(
    is_admin_or_superadmin()
  );

-- PR Sessions policies
CREATE POLICY "Admins can select sessions" ON public.pr_sessions
  FOR SELECT USING (
    is_admin_or_superadmin()
  );