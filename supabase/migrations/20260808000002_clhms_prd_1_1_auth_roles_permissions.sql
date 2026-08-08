-- ==============================================================================
-- CLHMS PRD Version 1.1: User Account, Role & Permission Management Schema
-- Database-Auth-Agent (Supabase PostgreSQL + RLS + Permissions Matrix)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ROLES TABLE (PRD Section 6)
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- 'ADMIN', 'LAB_CHAIRMAN', 'LAB_TEACHER', 'SUBJECT_TEACHER', 'INVENTORY_OFFICER', 'COLLEGE_MANAGEMENT'
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PERMISSIONS TABLE (PRD Section 7)
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- e.g. 'users.create', 'labs.assign', 'hardware.verify'
    module TEXT NOT NULL,      -- 'users', 'labs', 'hardware', 'teachers', 'resources', 'reports', 'settings'
    action TEXT NOT NULL,      -- 'create', 'read', 'update', 'delete', 'approve', 'assign', 'verify'
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ROLE_PERMISSIONS TABLE (PRD Section 8)
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (role_id, permission_id)
);

-- 5. UPGRADE / CREATE PROFILES TABLE (PRD Section 5)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID,
    full_name TEXT NOT NULL DEFAULT 'Staff Member',
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    employee_id TEXT,
    profile_photo TEXT,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    account_status TEXT NOT NULL DEFAULT 'Active',
    specialization TEXT,
    active_load_count INT NOT NULL DEFAULT 0 CHECK (active_load_count >= 0),
    max_load_capacity INT NOT NULL DEFAULT 4,
    created_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Alter columns if table previously existed
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.profiles ALTER COLUMN specialization TYPE TEXT USING specialization::TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS auth_user_id UUID;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_photo TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_status TEXT NOT NULL DEFAULT 'Active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS max_load_capacity INT NOT NULL DEFAULT 4;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_by TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS active_load_count INT NOT NULL DEFAULT 0;

-- 6. USER_ROLES TABLE (PRD Section 9)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_by TEXT DEFAULT 'System Admin',
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- 7. AUDIT_LOGS TABLE (PRD Section 31, 32)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_name TEXT NOT NULL DEFAULT 'System Admin',
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    old_values JSONB DEFAULT '{}'::JSONB,
    new_values JSONB DEFAULT '{}'::JSONB,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. HARDWARE & TOOLS INVENTORY TABLE (PRD Section 23)
CREATE TABLE IF NOT EXISTS public.hardware (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_name TEXT NOT NULL,
    serial_number TEXT UNIQUE,
    category TEXT NOT NULL DEFAULT 'Programming Lab',
    lab_room TEXT NOT NULL DEFAULT 'LAB-101',
    is_operational BOOLEAN NOT NULL DEFAULT TRUE,
    condition_status TEXT NOT NULL DEFAULT 'OPERATIONAL',
    assigned_to_teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. LAB_SESSIONS TABLE (PRD Section 20, 21, 22)
CREATE TABLE IF NOT EXISTS public.lab_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_name TEXT NOT NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    lecturer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    lab_teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    lab_room TEXT NOT NULL DEFAULT 'LAB-101',
    category TEXT NOT NULL DEFAULT 'Programming',
    shift TEXT NOT NULL DEFAULT 'MORNING',
    status TEXT NOT NULL DEFAULT 'PENDING',
    hardware_requirements TEXT,
    resource_link TEXT,
    instructor_instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 10. DAILY_AUDITS TABLE (PRD Section 1)
CREATE TABLE IF NOT EXISTS public.daily_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.lab_sessions(id) ON DELETE CASCADE,
    lab_teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    lab_room TEXT NOT NULL,
    shift TEXT NOT NULL DEFAULT 'MORNING',
    audit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('COMPLETE', 'INCOMPLETE')),
    incomplete_reason TEXT,
    hardware_issues_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. ANNOUNCEMENTS & CAMPUS MESSAGING TABLE (PRD Section 25)
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL DEFAULT 'College Administration',
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'NORMAL',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    target_role TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 12. SEED DATA FOR PRD 1.1 DEPARTMENTS, ROLES, PERMISSIONS & USERS
-- ==============================================================================

-- 12.1 Insert Departments
INSERT INTO public.departments (name, code, description)
VALUES 
    ('Computer Science & Software', 'CS', 'Software development, programming languages, web & databases'),
    ('Networking & Telecommunications', 'NET', 'Cisco routing, switching, BGP, hardware & patch cabling'),
    ('Multimedia & Digital Media', 'MM', 'Video post-production, 4K graphics, studio recording & audio'),
    ('Cybersecurity & Forensics', 'SEC', 'Ethical hacking, packet inspection, network defense & cryptography'),
    ('Technical & Hardware Repair', 'TECH', 'PC maintenance, soldering, hardware component diagnostics')
ON CONFLICT (name) DO NOTHING;

-- 12.2 Insert 6 Official PRD Roles
INSERT INTO public.roles (name, description)
VALUES
    ('ADMIN', 'Full System Administration & User Management Control'),
    ('LAB_CHAIRMAN', 'Director of Labs - Session Approvals, Teacher Assignments & Lab Operations'),
    ('LAB_TEACHER', 'Lab Instructor - Daily Hardware Audits, Class Execution & Progress Tracking'),
    ('SUBJECT_TEACHER', 'Academic Lecturer - Lab Course Requests, Syllabus Resources & Student Coordination'),
    ('INVENTORY_OFFICER', 'Hardware Inventory Control, Scans, Transfers & Damage/Missing Reports'),
    ('COLLEGE_MANAGEMENT', 'Executive Read-Only Overview, Workload Analytics & Performance Reports')
ON CONFLICT (name) DO NOTHING;

-- 12.3 Insert Granular Permissions (PRD Section 7)
INSERT INTO public.permissions (name, module, action, description)
VALUES
    ('users.create', 'users', 'create', 'Create new staff user accounts'),
    ('users.read', 'users', 'read', 'View user directory and profiles'),
    ('users.update', 'users', 'update', 'Edit user profile information and status'),
    ('users.delete', 'users', 'delete', 'Deactivate or remove user accounts'),
    ('roles.manage', 'users', 'update', 'Change and assign user roles'),

    ('labs.create', 'labs', 'create', 'Publish upcoming lab session requirements'),
    ('labs.read', 'labs', 'read', 'View scheduled and ongoing lab sessions'),
    ('labs.update', 'labs', 'update', 'Update lab details, time, and rooms'),
    ('labs.delete', 'labs', 'delete', 'Cancel or delete lab session requests'),
    ('labs.approve', 'labs', 'approve', 'Approve incoming lecturer lab requests'),
    ('labs.assign', 'labs', 'assign', 'Assign lab instructors based on workload'),
    ('labs.complete', 'labs', 'complete', 'Mark lab session completed (-1 load decrement)'),

    ('hardware.create', 'hardware', 'create', 'Register new workstations, routers, and tools'),
    ('hardware.read', 'hardware', 'read', 'View hardware inventory and status'),
    ('hardware.update', 'hardware', 'update', 'Edit hardware specifications and condition'),
    ('hardware.delete', 'hardware', 'delete', 'Decommission or delete hardware records'),
    ('hardware.verify', 'hardware', 'verify', 'Perform and sign off daily inventory verification'),
    ('hardware.assign', 'hardware', 'assign', 'Assign equipment to specific labs or teachers'),
    ('hardware.transfer', 'hardware', 'transfer', 'Transfer equipment between laboratory rooms'),
    ('hardware.report_missing', 'hardware', 'update', 'Flag equipment as missing or damaged'),

    ('resources.create', 'resources', 'create', 'Upload course syllabi, lab sheets, and Google Drive links'),
    ('resources.read', 'resources', 'read', 'Access resource links and learning materials'),

    ('messages.create', 'messages', 'create', 'Broadcast campus announcements to instructors'),
    ('messages.read', 'messages', 'read', 'Read campus noticeboard and alerts'),
    ('reports.read', 'reports', 'read', 'View department analytics, teacher load and audit logs'),
    ('reports.export', 'reports', 'read', 'Export CSV and audit reports')
ON CONFLICT (name) DO NOTHING;

-- 12.4 Link Permissions to Roles (Role-Permissions Matrix)
DO $$
DECLARE
    v_admin_id UUID;
    v_chairman_id UUID;
    v_lab_teacher_id UUID;
    v_subject_teacher_id UUID;
    v_inventory_id UUID;
    v_management_id UUID;
    p RECORD;
BEGIN
    SELECT id INTO v_admin_id FROM public.roles WHERE name = 'ADMIN';
    SELECT id INTO v_chairman_id FROM public.roles WHERE name = 'LAB_CHAIRMAN';
    SELECT id INTO v_lab_teacher_id FROM public.roles WHERE name = 'LAB_TEACHER';
    SELECT id INTO v_subject_teacher_id FROM public.roles WHERE name = 'SUBJECT_TEACHER';
    SELECT id INTO v_inventory_id FROM public.roles WHERE name = 'INVENTORY_OFFICER';
    SELECT id INTO v_management_id FROM public.roles WHERE name = 'COLLEGE_MANAGEMENT';

    -- 1. ADMIN GETS ALL PERMISSIONS
    FOR p IN SELECT id FROM public.permissions LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (v_admin_id, p.id) ON CONFLICT DO NOTHING;
    END LOOP;

    -- 2. LAB CHAIRMAN PERMISSIONS
    FOR p IN SELECT id FROM public.permissions WHERE module IN ('labs', 'teachers', 'hardware', 'resources', 'messages', 'reports') AND name NOT IN ('users.delete', 'roles.manage') LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (v_chairman_id, p.id) ON CONFLICT DO NOTHING;
    END LOOP;

    -- 3. LAB TEACHER PERMISSIONS
    FOR p IN SELECT id FROM public.permissions WHERE name IN ('labs.read', 'labs.complete', 'hardware.read', 'hardware.verify', 'hardware.report_missing', 'resources.create', 'resources.read', 'messages.read') LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (v_lab_teacher_id, p.id) ON CONFLICT DO NOTHING;
    END LOOP;

    -- 4. SUBJECT TEACHER (LECTURER) PERMISSIONS
    FOR p IN SELECT id FROM public.permissions WHERE name IN ('labs.create', 'labs.read', 'labs.update', 'resources.create', 'resources.read', 'messages.read', 'hardware.read') LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (v_subject_teacher_id, p.id) ON CONFLICT DO NOTHING;
    END LOOP;

    -- 5. INVENTORY OFFICER PERMISSIONS
    FOR p IN SELECT id FROM public.permissions WHERE module = 'hardware' OR name IN ('reports.read', 'reports.export', 'messages.read') LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (v_inventory_id, p.id) ON CONFLICT DO NOTHING;
    END LOOP;

    -- 6. COLLEGE MANAGEMENT PERMISSIONS (READ-ONLY)
    FOR p IN SELECT id FROM public.permissions WHERE action = 'read' OR name IN ('reports.read', 'reports.export') LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (v_management_id, p.id) ON CONFLICT DO NOTHING;
    END LOOP;
END $$;

-- 12.5 Insert 6 Official Seed Users (PRD Section 1)
DO $$
DECLARE
    v_cs_id UUID;
    v_net_id UUID;
    v_admin_user_id UUID;
    v_chairman_user_id UUID;
    v_teacher1_user_id UUID;
    v_teacher2_user_id UUID;
    v_inventory_user_id UUID;
    v_mgmt_user_id UUID;

    v_role_admin UUID;
    v_role_chairman UUID;
    v_role_lab_teacher UUID;
    v_role_sub_teacher UUID;
    v_role_inventory UUID;
    v_role_mgmt UUID;
BEGIN
    SELECT id INTO v_cs_id FROM public.departments WHERE code = 'CS' LIMIT 1;
    SELECT id INTO v_net_id FROM public.departments WHERE code = 'NET' LIMIT 1;

    SELECT id INTO v_role_admin FROM public.roles WHERE name = 'ADMIN';
    SELECT id INTO v_role_chairman FROM public.roles WHERE name = 'LAB_CHAIRMAN';
    SELECT id INTO v_role_lab_teacher FROM public.roles WHERE name = 'LAB_TEACHER';
    SELECT id INTO v_role_sub_teacher FROM public.roles WHERE name = 'SUBJECT_TEACHER';
    SELECT id INTO v_role_inventory FROM public.roles WHERE name = 'INVENTORY_OFFICER';
    SELECT id INTO v_role_mgmt FROM public.roles WHERE name = 'COLLEGE_MANAGEMENT';

    -- User 1: Admin
    INSERT INTO public.profiles (full_name, email, phone, employee_id, department_id, account_status, specialization, created_by)
    VALUES ('System Administrator', 'admin@college.edu', '+252 61 500 0001', 'ADM-001', v_cs_id, 'Active', 'Full Administration', 'System Setup')
    ON CONFLICT (email) DO UPDATE SET employee_id = 'ADM-001', phone = '+252 61 500 0001', full_name = EXCLUDED.full_name
    RETURNING id INTO v_admin_user_id;

    -- User 2: Lab Chairman
    INSERT INTO public.profiles (full_name, email, phone, employee_id, department_id, account_status, specialization, created_by)
    VALUES ('Dr. Cabdiraxmaan Cali (Chairman)', 'chairman@college.edu', '+252 61 500 0002', 'CHM-001', v_cs_id, 'Active', 'Lab Operations & Scheduling', 'System Admin')
    ON CONFLICT (email) DO UPDATE SET employee_id = 'CHM-001', phone = '+252 61 500 0002', full_name = EXCLUDED.full_name
    RETURNING id INTO v_chairman_user_id;

    -- User 3: Lab Teacher
    INSERT INTO public.profiles (full_name, email, phone, employee_id, department_id, account_status, specialization, active_load_count, created_by)
    VALUES ('Eng. Sacdiya Maxamuud', 'teacher1@college.edu', '+252 61 500 0003', 'LT-001', v_net_id, 'Active', 'Cisco Routing & Hardware', 1, 'System Admin')
    ON CONFLICT (email) DO UPDATE SET employee_id = 'LT-001', phone = '+252 61 500 0003', full_name = EXCLUDED.full_name
    RETURNING id INTO v_teacher1_user_id;

    -- User 4: Subject Teacher (Lecturer)
    INSERT INTO public.profiles (full_name, email, phone, employee_id, department_id, account_status, specialization, created_by)
    VALUES ('Ust. Cali Nuur (Academic Lecturer)', 'teacher2@college.edu', '+252 61 500 0004', 'ST-001', v_cs_id, 'Active', 'Database Systems & Algorithms', 'System Admin')
    ON CONFLICT (email) DO UPDATE SET employee_id = 'ST-001', phone = '+252 61 500 0004', full_name = EXCLUDED.full_name
    RETURNING id INTO v_teacher2_user_id;

    -- User 5: Inventory Officer
    INSERT INTO public.profiles (full_name, email, phone, employee_id, department_id, account_status, specialization, created_by)
    VALUES ('Eng. Mustafe Xuseen (Inventory)', 'inventory@college.edu', '+252 61 500 0005', 'INV-001', v_net_id, 'Active', 'Equipment Scans & Maintenance', 'System Admin')
    ON CONFLICT (email) DO UPDATE SET employee_id = 'INV-001', phone = '+252 61 500 0005', full_name = EXCLUDED.full_name
    RETURNING id INTO v_inventory_user_id;

    -- User 6: College Management
    INSERT INTO public.profiles (full_name, email, phone, employee_id, department_id, account_status, specialization, created_by)
    VALUES ('Dean of Academic Affairs', 'management@college.edu', '+252 61 500 0006', 'MGT-001', v_cs_id, 'Active', 'Executive Reports & Analytics', 'System Admin')
    ON CONFLICT (email) DO UPDATE SET employee_id = 'MGT-001', phone = '+252 61 500 0006', full_name = EXCLUDED.full_name
    RETURNING id INTO v_mgmt_user_id;

    -- Map User Roles in user_roles table
    INSERT INTO public.user_roles (user_id, role_id, assigned_by)
    VALUES 
        (v_admin_user_id, v_role_admin, 'System Initialization'),
        (v_chairman_user_id, v_role_chairman, 'System Admin'),
        (v_teacher1_user_id, v_role_lab_teacher, 'System Admin'),
        (v_teacher2_user_id, v_role_sub_teacher, 'System Admin'),
        (v_inventory_user_id, v_role_inventory, 'System Admin'),
        (v_mgmt_user_id, v_role_mgmt, 'System Admin')
    ON CONFLICT DO NOTHING;

    -- Initial Audit Log
    INSERT INTO public.audit_logs (actor_user_id, actor_name, action, entity_type, description)
    VALUES 
        (v_admin_user_id, 'System Administrator', 'SYSTEM_INITIALIZED', 'system', 'CLHMS PRD 1.1 User Accounts, Roles & Permissions successfully initialized');
END $$;
