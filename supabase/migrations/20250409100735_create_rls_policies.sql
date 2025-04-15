-- Enable Row Level Security on tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pr_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pr_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pr_talking_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pr_blogs ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Admins can insert users" ON public.users
  FOR INSERT WITH CHECK (
    is_admin_or_superadmin()
  );

CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE USING (
                        is_admin_or_superadmin()
                        ) WITH CHECK (
                        is_admin_or_superadmin()
                        );

CREATE POLICY "Admins can delete users" ON public.users
  FOR DELETE USING (
    is_admin_or_superadmin()
  );

-- PR Sessions policies
CREATE POLICY "Admins can insert sessions" ON public.pr_sessions
  FOR INSERT WITH CHECK (
    is_admin_or_superadmin()
  );

CREATE POLICY "Admins can update sessions" ON public.pr_sessions
  FOR UPDATE USING (
                        is_admin_or_superadmin()
                        ) WITH CHECK (
                        is_admin_or_superadmin()
                        );

CREATE POLICY "Admins can delete sessions" ON public.pr_sessions
  FOR DELETE USING (
    is_admin_or_superadmin()
  );

-- PR Articles policies
CREATE POLICY "Admins can see all articles" ON public.pr_articles
  FOR SELECT USING (
    is_admin_or_superadmin()
  );             
             
CREATE POLICY "Admins can insert articles" ON public.pr_articles
  FOR INSERT WITH CHECK (
    is_admin_or_superadmin()
  );

CREATE POLICY "Admins can update articles" ON public.pr_articles
  FOR UPDATE USING (
                        is_admin_or_superadmin()
                        ) WITH CHECK (
                        is_admin_or_superadmin()
                        );

CREATE POLICY "Admins can delete articles" ON public.pr_articles
  FOR DELETE USING (
    is_admin_or_superadmin()
  );

-- PR Talking Points policies
CREATE POLICY "Admins can read all talking points" ON public.pr_talking_points
  FOR SELECT USING (
                                     is_admin_or_superadmin()
                                     );             
             
CREATE POLICY "Admins can insert talking points" ON public.pr_talking_points
  FOR INSERT WITH CHECK (
    is_admin_or_superadmin()
  );

CREATE POLICY "Admins can update talking points" ON public.pr_talking_points
  FOR UPDATE USING (
                        is_admin_or_superadmin()
                        ) WITH CHECK (
                        is_admin_or_superadmin()
                        );

CREATE POLICY "Admins can delete talking points" ON public.pr_talking_points
  FOR DELETE USING (
    is_admin_or_superadmin()
  );

-- PR Blogs policies
CREATE POLICY "Admins can insert blogs" ON public.pr_blogs
  FOR INSERT WITH CHECK (
    is_admin_or_superadmin()
  );

CREATE POLICY "Admins can update blogs" ON public.pr_blogs
  FOR UPDATE USING (
                        is_admin_or_superadmin()
                        ) WITH CHECK (
                        is_admin_or_superadmin()
                        );

CREATE POLICY "Admins can delete blogs" ON public.pr_blogs
  FOR DELETE USING (
    is_admin_or_superadmin()
  );

-- Add comment to explain RLS setup
COMMENT ON TABLE public.users IS 'User profiles with role-based security through RLS';
COMMENT ON TABLE public.pr_sessions IS 'PR Sessions with row level security';
COMMENT ON TABLE public.pr_articles IS 'PR Articles with row level security';
COMMENT ON TABLE public.pr_talking_points IS 'PR Talking Points with row level security';
COMMENT ON TABLE public.pr_blogs IS 'PR Blogs with row level security';