CREATE TABLE IF NOT EXISTS team_members (
  id serial PRIMARY KEY,
  name text NOT NULL,
  role text,
  email text,
  phone text,
  skills text,
  status varchar(50) DEFAULT 'Active',
  created timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id serial PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  meta_title text,
  meta_description text,
  summary text,
  content text,
  images text,
  published boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leads (
  id serial PRIMARY KEY,
  first_name text,
  last_name text,
  service text,
  email text NOT NULL,
  phone text,
  budget text,
  project_details text,
  status varchar(50) DEFAULT 'New',
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id serial PRIMARY KEY,
  sender_name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status varchar(50) DEFAULT 'New',
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  role varchar(50) DEFAULT 'Admin' NOT NULL,
  password_hash text NOT NULL,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
  id serial PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL,
  summary text,
  description text,
  icon text,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id serial PRIMARY KEY,
  title text NOT NULL,
  category text,
  description text,
  image text,
  project_url text,
  tags text,
  status varchar(50) DEFAULT 'Published',
  created_at timestamp DEFAULT now()
);
