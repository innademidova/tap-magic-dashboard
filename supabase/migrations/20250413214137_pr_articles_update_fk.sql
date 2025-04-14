-- Drop the old FK constraint
ALTER TABLE public.pr_articles
DROP CONSTRAINT IF EXISTS pr_articles_session_id_fkey;

-- Add new FK constraint with ON DELETE CASCADE
ALTER TABLE public.pr_articles
    ADD CONSTRAINT pr_articles_session_id_fkey
        FOREIGN KEY (session_id) REFERENCES public.pr_sessions(id) ON DELETE CASCADE;
