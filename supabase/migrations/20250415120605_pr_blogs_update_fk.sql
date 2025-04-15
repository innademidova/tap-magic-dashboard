-- Drop the old FK constraint
ALTER TABLE public.pr_blogs
DROP CONSTRAINT IF EXISTS pr_blogs_article_id_fkey;

-- Add new FK constraint with ON DELETE CASCADE
ALTER TABLE public.pr_blogs
    ADD CONSTRAINT pr_blogs_article_id_fkey
        FOREIGN KEY (article_id)
            REFERENCES pr_articles(id)
            ON DELETE CASCADE;