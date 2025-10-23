-- Jobs table schema for CSV bulk import
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  location TEXT NOT NULL,
  salary_range TEXT,
  job_description TEXT NOT NULL,
  apply_link TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL CHECK (source IN ('JobStreet', 'LinkedIn', 'CareerFuture SG', 'Other')),
  category TEXT,
  company_logo_url TEXT,
  hero_banner_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_company_name ON jobs(company_name);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_source ON jobs(source);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_apply_link ON jobs(apply_link);

-- Import logs table to track all import operations
CREATE TABLE IF NOT EXISTS import_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  total_rows INTEGER NOT NULL,
  successful_imports INTEGER DEFAULT 0,
  failed_imports INTEGER DEFAULT 0,
  duplicate_count INTEGER DEFAULT 0,
  import_status TEXT CHECK (import_status IN ('pending', 'processing', 'completed', 'failed')),
  error_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Failed imports table for debugging
CREATE TABLE IF NOT EXISTS failed_imports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  import_log_id UUID REFERENCES import_logs(id),
  row_number INTEGER,
  row_data JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pre-defined job categories
CREATE TABLE IF NOT EXISTS job_categories (
  id SERIAL PRIMARY KEY,
  category_name TEXT UNIQUE NOT NULL,
  keywords TEXT[] -- Keywords to help with AI categorization
);

-- Insert default categories
INSERT INTO job_categories (category_name, keywords) VALUES
  ('Software Development', ARRAY['software', 'developer', 'engineer', 'programmer', 'coding', 'full stack', 'backend', 'frontend']),
  ('Data Science & Analytics', ARRAY['data', 'analyst', 'scientist', 'analytics', 'machine learning', 'AI', 'ML']),
  ('Design & UX', ARRAY['designer', 'UX', 'UI', 'graphic', 'product design', 'visual']),
  ('Marketing & Sales', ARRAY['marketing', 'sales', 'business development', 'account manager', 'digital marketing']),
  ('Finance & Accounting', ARRAY['finance', 'accounting', 'accountant', 'financial', 'audit', 'tax']),
  ('Human Resources', ARRAY['HR', 'human resources', 'recruiter', 'talent', 'people operations']),
  ('Operations & Logistics', ARRAY['operations', 'logistics', 'supply chain', 'warehouse', 'coordinator']),
  ('Customer Service', ARRAY['customer service', 'support', 'customer success', 'helpdesk']),
  ('Healthcare', ARRAY['healthcare', 'medical', 'nurse', 'doctor', 'clinical', 'health']),
  ('Education & Training', ARRAY['education', 'teacher', 'trainer', 'tutor', 'instructor']),
  ('Engineering (Non-Software)', ARRAY['mechanical', 'electrical', 'civil', 'chemical engineer', 'manufacturing']),
  ('Legal & Compliance', ARRAY['legal', 'lawyer', 'compliance', 'attorney', 'counsel']),
  ('Administration', ARRAY['admin', 'administrative', 'office', 'secretary', 'assistant']),
  ('Hospitality & Tourism', ARRAY['hospitality', 'hotel', 'restaurant', 'tourism', 'chef']),
  ('Other', ARRAY[])
ON CONFLICT (category_name) DO NOTHING;

-- Create RLS policies (adjust based on your auth setup)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE failed_imports ENABLE ROW LEVEL SECURITY;

-- Public read access for jobs (adjust as needed)
CREATE POLICY "Jobs are viewable by everyone" ON jobs
  FOR SELECT USING (is_active = TRUE);

-- Admin-only insert/update/delete (you'll need to adjust this based on your auth)
-- For demo purposes, we'll allow all operations
CREATE POLICY "Enable insert for all users" ON jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON jobs FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON jobs FOR DELETE USING (true);

CREATE POLICY "Enable all for import_logs" ON import_logs FOR ALL USING (true);
CREATE POLICY "Enable all for failed_imports" ON failed_imports FOR ALL USING (true);
