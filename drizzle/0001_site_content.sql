-- Site-wide editable content (Home, About, etc.)
CREATE TABLE IF NOT EXISTS site_content (
  id serial PRIMARY KEY,
  section varchar(50) NOT NULL UNIQUE,
  content text NOT NULL,
  updated_at timestamp DEFAULT now()
);