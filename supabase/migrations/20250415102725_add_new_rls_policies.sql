-- PR Articles
DROP POLICY IF EXISTS "Customer can see articles related to their sessions" ON public.pr_articles;

CREATE POLICY "Customer can manage articles related to their sessions"
  ON public.pr_articles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM pr_sessions s
      WHERE s.id = pr_articles.session_id
        AND s.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM pr_sessions s
      WHERE s.id = pr_articles.session_id
        AND s.user_id = auth.uid()
    )
  );


-- PR Talking points
CREATE POLICY "Customer can manage talking points related to their articles"
  ON public.pr_talking_points
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM pr_articles a
      JOIN pr_sessions s ON s.id = a.session_id
      WHERE a.id = pr_talking_points.article_id
        AND s.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM pr_articles a
      JOIN pr_sessions s ON s.id = a.session_id
      WHERE a.id = pr_talking_points.article_id
        AND s.user_id = auth.uid()
    )
  );

-- PR Blogs
CREATE POLICY "Admins can read all blogs" ON public.pr_blogs
  FOR SELECT USING (
                 is_admin_or_superadmin()
                 );

CREATE POLICY "Customers can manage blogs related to their articles"
  ON public.pr_blogs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM pr_articles a
      JOIN pr_sessions s ON s.id = a.session_id
      WHERE a.id = pr_blogs.article_id
        AND s.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM pr_articles a
      JOIN pr_sessions s ON s.id = a.session_id
      WHERE a.id = pr_blogs.article_id
        AND s.user_id = auth.uid()
    )
  );

-- ghl_contacts
ALTER TABLE public.ghl_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all contacts"
  ON public.ghl_contacts
  FOR ALL
  USING (
    is_admin_or_superadmin()
  )
  WITH CHECK (
    is_admin_or_superadmin()
  );

-- invitations
CREATE POLICY "Only superadmin can invite admins"
  ON public.invitations
  FOR INSERT
  WITH CHECK (
    role != 'admin' OR is_superadmin()
  );