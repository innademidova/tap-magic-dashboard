
-- Drop the existing views if they exist
DROP VIEW IF EXISTS blog_content_view;
DROP VIEW IF EXISTS session_articles_blogs_view;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
                                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    bio TEXT,
    industry TEXT,
    subject_matter TEXT,
    audience TEXT,
    usp TEXT,
    writing_style TEXT,
    keywords TEXT[]
    );

-- Create pr_sessions table
CREATE TABLE IF NOT EXISTS public.pr_sessions (
                                                  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    datetime TIMESTAMP WITH TIME ZONE DEFAULT now(),
    bio TEXT,
    industry TEXT,
    subject_matter TEXT,
    audience TEXT,
    usp TEXT,
    writing_style TEXT,
    keywords TEXT[],
    summary_content TEXT
    );

-- Create pr_articles table
CREATE TABLE IF NOT EXISTS public.pr_articles (
                                                  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.pr_sessions(id),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    confidence_score REAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );

-- Create pr_blogs table
CREATE TABLE IF NOT EXISTS public.pr_blogs (
                                               id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.pr_articles(id) UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );

-- Create pr_talking_points table
CREATE TABLE IF NOT EXISTS public.pr_talking_points (
                                                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.pr_articles(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );

-- Create ghl_contacts table
CREATE TABLE IF NOT EXISTS public.ghl_contacts (
                                                   id TEXT PRIMARY KEY,
                                                   location_id TEXT NOT NULL,
                                                   first_name TEXT,
                                                   last_name TEXT,
                                                   email TEXT,
                                                   phone TEXT,
                                                   address1 TEXT,
                                                   city TEXT,
                                                   state TEXT,
                                                   postal_code TEXT,
                                                   country TEXT DEFAULT 'US',
                                                   company_name TEXT,
                                                   contact_name TEXT,
                                                   website TEXT,
                                                   type TEXT,
                                                   source TEXT,
                                                   assigned_to TEXT,
                                                   tags JSONB DEFAULT '[]',
                                                   date_added TIMESTAMP WITH TIME ZONE DEFAULT now(),
    date_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    date_of_birth DATE,
    dnd BOOLEAN DEFAULT false,
    timezone TEXT DEFAULT 'UTC',
    last_activity BIGINT,
    event_date_time VARCHAR,
    event_location VARCHAR,
    number_of_gamers INTEGER
    );

-- Create invitations table to track sent invitations
CREATE TABLE IF NOT EXISTS public.invitations (
                                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                    email TEXT NOT NULL,
                                    role TEXT NOT NULL DEFAULT 'customer',
                                    status TEXT NOT NULL DEFAULT 'pending',
                                    invited_by UUID REFERENCES public.users(id),
                                    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                                    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days')
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.invitations(email);

-- Create blog_content_view
CREATE OR REPLACE VIEW blog_content_view AS
SELECT
    pr_blogs.content as blog_content,
    pr_sessions.session_id
FROM pr_blogs
         JOIN pr_articles ON pr_blogs.article_id = pr_articles.id
         JOIN pr_sessions ON pr_articles.session_id = pr_sessions.id;

-- Create session_articles_blogs_view
CREATE OR REPLACE VIEW session_articles_blogs_view AS
SELECT
    s.id as session_id,
    s.session_id as session_identifier,
    s.user_id,
    a.id as article_id,
    a.title as article_title,
    b.id as blog_id,
    b.title as blog_title,
    b.content as blog_body,
    tp.id as talking_point_id,
    tp.content as talking_point_content
FROM pr_sessions s
         LEFT JOIN pr_articles a ON s.id = a.session_id
         LEFT JOIN pr_blogs b ON a.id = b.article_id
         LEFT JOIN pr_talking_points tp ON a.id = tp.article_id;
