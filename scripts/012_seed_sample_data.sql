-- Seed sample data for CareerConnect

-- Insert sample companies with specific IDs for consistency
INSERT INTO public.companies (id, name, description, website, industry, company_size, location, is_verified) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'TechCorp Solutions', 'Leading technology company specializing in cloud solutions and enterprise software.', 'https://techcorp.example.com', 'Technology', '201-500', 'San Francisco, CA', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'DataFlow Analytics', 'Data analytics and business intelligence company helping businesses make data-driven decisions.', 'https://dataflow.example.com', 'Data & Analytics', '51-200', 'New York, NY', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'GreenTech Innovations', 'Sustainable technology solutions for a better tomorrow.', 'https://greentech.example.com', 'Clean Technology', '11-50', 'Austin, TX', true),
  ('550e8400-e29b-41d4-a716-446655440004', 'FinanceFlow', 'Modern financial services and fintech solutions.', 'https://financeflow.example.com', 'Financial Services', '501-1000', 'Chicago, IL', true),
  ('550e8400-e29b-41d4-a716-446655440005', 'HealthTech Plus', 'Healthcare technology improving patient outcomes worldwide.', 'https://healthtech.example.com', 'Healthcare Technology', '201-500', 'Boston, MA', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample jobs
INSERT INTO public.jobs (id, title, description, requirements, responsibilities, company_id, location, job_type, work_arrangement, experience_level, salary_min, salary_max, salary_currency, is_active) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Senior Frontend Developer', 'Join our dynamic team as a Senior Frontend Developer and help build the next generation of web applications. You will work with cutting-edge technologies and collaborate with cross-functional teams to deliver exceptional user experiences.', 'Bachelor''s degree in Computer Science or related field. 5+ years of experience in frontend development. Strong proficiency in JavaScript, React, and modern web technologies. Experience with responsive design and cross-browser compatibility.', 'Develop and maintain high-quality frontend applications. Collaborate with designers and backend developers. Optimize applications for maximum speed and scalability. Mentor junior developers and contribute to code reviews.', '550e8400-e29b-41d4-a716-446655440001', 'San Francisco, CA', 'full-time', 'hybrid', 'senior', 120000, 160000, 'USD', true),
  
  ('660e8400-e29b-41d4-a716-446655440002', 'Data Scientist', 'We are looking for a talented Data Scientist to join our analytics team. You will work with large datasets to extract insights and build predictive models that drive business decisions.', 'Master''s degree in Data Science, Statistics, or related field. 3+ years of experience in data analysis and machine learning. Proficiency in Python, SQL, and statistical analysis tools. Experience with cloud platforms preferred.', 'Analyze complex datasets to identify trends and patterns. Build and deploy machine learning models. Create data visualizations and reports for stakeholders. Collaborate with engineering teams to implement data solutions.', '550e8400-e29b-41d4-a716-446655440002', 'New York, NY', 'full-time', 'remote', 'mid', 90000, 130000, 'USD', true),
  
  ('660e8400-e29b-41d4-a716-446655440003', 'Full Stack Developer', 'Join our mission to create sustainable technology solutions. We are seeking a Full Stack Developer to work on innovative projects that make a positive environmental impact.', 'Bachelor''s degree in Computer Science or equivalent experience. 3+ years of full-stack development experience. Proficiency in JavaScript, Node.js, and database technologies. Passion for environmental sustainability.', 'Develop end-to-end web applications. Design and implement RESTful APIs. Work with databases and cloud infrastructure. Participate in agile development processes and code reviews.', '550e8400-e29b-41d4-a716-446655440003', 'Austin, TX', 'full-time', 'on-site', 'mid', 80000, 110000, 'USD', true),
  
  ('660e8400-e29b-41d4-a716-446655440004', 'DevOps Engineer', 'We are seeking a DevOps Engineer to help scale our financial technology platform. You will work on infrastructure automation, deployment pipelines, and system reliability.', 'Bachelor''s degree in Computer Science or related field. 4+ years of DevOps experience. Strong knowledge of AWS, Docker, and CI/CD pipelines. Experience with infrastructure as code and monitoring tools.', 'Design and maintain CI/CD pipelines. Manage cloud infrastructure and deployments. Implement monitoring and alerting systems. Collaborate with development teams on system architecture.', '550e8400-e29b-41d4-a716-446655440004', 'Chicago, IL', 'full-time', 'hybrid', 'senior', 110000, 140000, 'USD', true),
  
  ('660e8400-e29b-41d4-a716-446655440005', 'Product Manager', 'Lead product development for our healthcare technology solutions. You will work closely with engineering, design, and clinical teams to deliver products that improve patient outcomes.', 'Bachelor''s degree in Business, Engineering, or related field. 5+ years of product management experience, preferably in healthcare technology. Strong analytical and communication skills. Experience with agile methodologies.', 'Define product roadmap and strategy. Gather and prioritize product requirements. Work with cross-functional teams to deliver features. Analyze product metrics and user feedback to drive improvements.', '550e8400-e29b-41d4-a716-446655440005', 'Boston, MA', 'full-time', 'hybrid', 'senior', 130000, 170000, 'USD', true),
  
  ('660e8400-e29b-41d4-a716-446655440006', 'Junior Software Engineer', 'Perfect opportunity for a recent graduate or early-career developer to join our team. You will work on exciting projects while learning from experienced engineers.', 'Bachelor''s degree in Computer Science or related field. 0-2 years of professional experience. Strong foundation in programming fundamentals. Eagerness to learn and grow in a collaborative environment.', 'Contribute to software development projects. Write clean, maintainable code. Participate in code reviews and team meetings. Learn new technologies and best practices from senior team members.', '550e8400-e29b-41d4-a716-446655440001', 'San Francisco, CA', 'full-time', 'on-site', 'entry', 70000, 90000, 'USD', true)
ON CONFLICT (id) DO NOTHING;

-- Insert job skills relationships
DO $$
DECLARE
    js_skill_id uuid;
    react_skill_id uuid;
    python_skill_id uuid;
    sql_skill_id uuid;
    aws_skill_id uuid;
BEGIN
    -- Get skill IDs
    SELECT id INTO js_skill_id FROM public.skills WHERE name = 'JavaScript';
    SELECT id INTO react_skill_id FROM public.skills WHERE name = 'React';
    SELECT id INTO python_skill_id FROM public.skills WHERE name = 'Python';
    SELECT id INTO sql_skill_id FROM public.skills WHERE name = 'SQL';
    SELECT id INTO aws_skill_id FROM public.skills WHERE name = 'AWS';

    -- Insert job skills relationships
    IF js_skill_id IS NOT NULL THEN
        INSERT INTO public.job_skills (job_id, skill_id, is_required) VALUES
        ('660e8400-e29b-41d4-a716-446655440001', js_skill_id, true),
        ('660e8400-e29b-41d4-a716-446655440003', js_skill_id, true),
        ('660e8400-e29b-41d4-a716-446655440006', js_skill_id, true)
        ON CONFLICT (job_id, skill_id) DO NOTHING;
    END IF;
    
    IF react_skill_id IS NOT NULL THEN
        INSERT INTO public.job_skills (job_id, skill_id, is_required) VALUES
        ('660e8400-e29b-41d4-a716-446655440001', react_skill_id, true),
        ('660e8400-e29b-41d4-a716-446655440006', react_skill_id, false)
        ON CONFLICT (job_id, skill_id) DO NOTHING;
    END IF;
    
    IF python_skill_id IS NOT NULL THEN
        INSERT INTO public.job_skills (job_id, skill_id, is_required) VALUES
        ('660e8400-e29b-41d4-a716-446655440002', python_skill_id, true)
        ON CONFLICT (job_id, skill_id) DO NOTHING;
    END IF;
    
    IF sql_skill_id IS NOT NULL THEN
        INSERT INTO public.job_skills (job_id, skill_id, is_required) VALUES
        ('660e8400-e29b-41d4-a716-446655440002', sql_skill_id, true)
        ON CONFLICT (job_id, skill_id) DO NOTHING;
    END IF;
    
    IF aws_skill_id IS NOT NULL THEN
        INSERT INTO public.job_skills (job_id, skill_id, is_required) VALUES
        ('660e8400-e29b-41d4-a716-446655440004', aws_skill_id, true)
        ON CONFLICT (job_id, skill_id) DO NOTHING;
    END IF;

END $$;
