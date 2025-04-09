-- Users policies
CREATE POLICY "Customer can manage own profile"
  ON public.users
  FOR ALL
  USING (
    auth_id = auth.uid()
  )
  WITH CHECK (
    auth_id = auth.uid()
  );


-- PR Sessions 
CREATE POLICY "Customer can see own pr sessions"
  ON public.pr_sessions
  FOR SELECT
                 USING (
                 user_id = auth.uid()
                 );


-- PR Articles
CREATE POLICY "Customer can see articles related to their sessions"
  ON public.pr_articles
  FOR SELECT
                 USING (
                     EXISTS (
                     SELECT 1 FROM pr_sessions s
                     WHERE s.id = pr_articles.session_id
                     )
                 );