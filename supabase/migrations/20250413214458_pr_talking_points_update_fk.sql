-- Drop old FK constraint
ALTER TABLE public.pr_talking_points
DROP CONSTRAINT IF EXISTS pr_talking_points_article_id_fkey;

-- Add new FK with ON DELETE CASCADE
ALTER TABLE public.pr_talking_points
    ADD CONSTRAINT pr_talking_points_article_id_fkey
        FOREIGN KEY (article_id) REFERENCES public.pr_articles(id) ON DELETE CASCADE;
