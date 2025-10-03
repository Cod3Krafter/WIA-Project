-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  bio TEXT,
  profile_picture TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT
);

-- user_roles table
CREATE TABLE user_roles (
  user_id INT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('client', 'freelancer')),
  PRIMARY KEY (user_id, role),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- contact_methods table
CREATE TABLE contact_methods (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  whatsapp TEXT,
  email TEXT,
  linkedin TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- skills table
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  skill_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  skill_id INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT,
  price_range TEXT,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- jobs table
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  budget TEXT,
  category TEXT,
  deadline DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'open',
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

-- job_applications table
CREATE TABLE job_applications (
  id SERIAL PRIMARY KEY,
  job_id INT NOT NULL,
  freelancer_id INT NOT NULL,
  job_title TEXT,
  proposal TEXT,
  expected_budget TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  freelancer_contact TEXT,
  status TEXT DEFAULT 'pending',
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- saved_jobs table
CREATE TABLE saved_jobs (
  id SERIAL PRIMARY KEY,
  freelancer_id INT NOT NULL,
  job_id INT NOT NULL,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);
