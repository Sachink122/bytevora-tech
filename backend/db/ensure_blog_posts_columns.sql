          CREATE TABLE IF NOT EXISTS public.blog_posts (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY
);

ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS title text NOT NULL;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS slug text NOT NULL;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS meta_title text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS meta_description text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS summary text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS content text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS images text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS published boolean DEFAULT false;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
-- Ensure compatibility with older schema variants: add fallback columns
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS internal_links text DEFAULT '' NOT NULL;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS author text DEFAULT '' NOT NULL;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS status text DEFAULT 'Published' NOT NULL;

-- Ensure defaults are present for future INSERTs and existing NULLs are set
ALTER TABLE public.blog_posts ALTER COLUMN internal_links SET DEFAULT '';
UPDATE public.blog_posts SET internal_links = '' WHERE internal_links IS NULL;
ALTER TABLE public.blog_posts ALTER COLUMN internal_links SET NOT NULL;

ALTER TABLE public.blog_posts ALTER COLUMN author SET DEFAULT '';
UPDATE public.blog_posts SET author = '' WHERE author IS NULL;
ALTER TABLE public.blog_posts ALTER COLUMN author SET NOT NULL;

ALTER TABLE public.blog_posts ALTER COLUMN status SET DEFAULT 'Published';
UPDATE public.blog_posts SET status = 'Published' WHERE status IS NULL;
ALTER TABLE public.blog_posts ALTER COLUMN status SET NOT NULL;

-- If slug column exists, ensure it's unique (create index will be idempotent)

-- Create unique index on slug if not exists
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_slug_unique ON public.blog_posts (slug);
