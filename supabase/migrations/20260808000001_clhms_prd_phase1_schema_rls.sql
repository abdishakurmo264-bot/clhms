-- ==============================================================================
-- CLHMS: College Lab & Hardware Management System - Version 1.0
-- Database-Auth-Agent: Phase 1 Schema Migration & Role-Based RLS Policies
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS DEFINITIONS (Exact PRD Section 5 Specification)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'ROLE_ADMIN',
        'ROLE_LAB_HEAD',
        'ROLE_LAB_TEACHER',
        'ROLE_LECTURER'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE lab_specialization AS ENUM (
        'PROGRAMMING',
        'TECHNICAL',
        'HYBRID'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE shift_type AS ENUM (
        'MORNING',
        'AFTERNOON',
        'BOTH'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE audit_status AS ENUM (
        'COMPLETE',
        'INCOMPLETE'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE session_status AS ENUM (
        'PENDING',
        'ASSIGNED',
        'IN_PROGRESS',
        'COMPLETED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ==============================================================================
-- 3. TABLES DEFINITION (Exact PRD Section 5 Specification)
-- ==============================================================================

-- 3.1 USERS PROFILE TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'ROLE_LAB_TEACHER',
    specialization lab_specialization,
    shift shift_type DEFAULT 'MORNING',
    active_load_count INT DEFAULT 0 CHECK (active_load_count >= 0),
    avatar_url TEXT,
    department TEXT DEFAULT 'Faculty of Computer Science & Engineering',
    phone TEXT,
    is_on_duty BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 HARDWARE INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.hardware (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    asset_name TEXT NOT NULL,
    serial_number TEXT UNIQUE,
    lab_room TEXT NOT NULL,
    category TEXT NOT NULL,
    is_operational BOOLEAN DEFAULT TRUE,
    specifications JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 DAILY MANUAL AUDITS TABLE
CREATE TABLE IF NOT EXISTS public.daily_audits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lab_teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    lab_room TEXT NOT NULL,
    shift shift_type NOT NULL,
    audit_date DATE DEFAULT CURRENT_DATE,
    status audit_status NOT NULL,
    incomplete_reason TEXT, -- Mandatory constraint if status = 'INCOMPLETE'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_incomplete_reason_required CHECK (
        (status = 'COMPLETE') OR 
        (status = 'INCOMPLETE' AND incomplete_reason IS NOT NULL AND length(trim(incomplete_reason)) > 0)
    )
);

-- 3.4 LAB SESSIONS WORKFLOW TABLE
CREATE TABLE IF NOT EXISTS public.lab_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lecturer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lab_teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    course_name TEXT NOT NULL,
    required_specialization lab_specialization NOT NULL,
    hardware_requirements TEXT,
    status session_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5 ANNOUNCEMENTS / NOTICEBOARD TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_shift ON public.profiles(shift);
CREATE INDEX IF NOT EXISTS idx_profiles_specialization ON public.profiles(specialization);
CREATE INDEX IF NOT EXISTS idx_hardware_lab_room ON public.hardware(lab_room);
CREATE INDEX IF NOT EXISTS idx_hardware_operational ON public.hardware(is_operational);
CREATE INDEX IF NOT EXISTS idx_daily_audits_teacher ON public.daily_audits(lab_teacher_id);
CREATE INDEX IF NOT EXISTS idx_daily_audits_date ON public.daily_audits(audit_date);
CREATE INDEX IF NOT EXISTS idx_daily_audits_status ON public.daily_audits(status);
CREATE INDEX IF NOT EXISTS idx_lab_sessions_status ON public.lab_sessions(status);
CREATE INDEX IF NOT EXISTS idx_lab_sessions_lecturer ON public.lab_sessions(lecturer_id);
CREATE INDEX IF NOT EXISTS idx_lab_sessions_teacher ON public.lab_sessions(lab_teacher_id);

-- ==============================================================================
-- 5. RLS HELPER SECURITY FUNCTIONS
-- ==============================================================================

-- Check if current user is Super Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ROLE_ADMIN'
    );
$$;

-- Check if current user is Lab Head or Admin
CREATE OR REPLACE FUNCTION public.is_lab_head_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('ROLE_ADMIN', 'ROLE_LAB_HEAD')
    );
$$;

-- Get current authenticated user's role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT role FROM public.profiles
    WHERE id = auth.uid();
$$;

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hardware ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 6.1 PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Authenticated users can view all profiles (needed for teacher cards & search)
CREATE POLICY "Profiles viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

-- Users can update their own profile; Admins & Lab Heads can manage
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id OR public.is_lab_head_or_admin())
    WITH CHECK (auth.uid() = id OR public.is_lab_head_or_admin());

CREATE POLICY "Admins can insert or delete profiles"
    ON public.profiles FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 6.2 HARDWARE POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Hardware is viewable by all authenticated users"
    ON public.hardware FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Lab Heads and Admins manage hardware"
    ON public.hardware FOR ALL
    TO authenticated
    USING (public.is_lab_head_or_admin())
    WITH CHECK (public.is_lab_head_or_admin());

-- ------------------------------------------------------------------------------
-- 6.3 DAILY_AUDITS POLICIES
-- ------------------------------------------------------------------------------
-- Instructors view their own audits; Lab Heads & Admins view all
CREATE POLICY "Instructors view own audits; Admins and Lab Heads view all"
    ON public.daily_audits FOR SELECT
    TO authenticated
    USING (
        auth.uid() = lab_teacher_id 
        OR public.is_lab_head_or_admin()
    );

-- Lab Teachers & Admins can create audits
CREATE POLICY "Lab Teachers can insert daily audits"
    ON public.daily_audits FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = lab_teacher_id 
        OR public.is_lab_head_or_admin()
    );

-- Instructors update own audits; Admins/Lab Heads can update all
CREATE POLICY "Instructors update own audits"
    ON public.daily_audits FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = lab_teacher_id 
        OR public.is_lab_head_or_admin()
    )
    WITH CHECK (
        auth.uid() = lab_teacher_id 
        OR public.is_lab_head_or_admin()
    );

-- ------------------------------------------------------------------------------
-- 6.4 LAB_SESSIONS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Lab sessions viewable by authenticated users"
    ON public.lab_sessions FOR SELECT
    TO authenticated
    USING (true);

-- Lecturers can create session requests
CREATE POLICY "Lecturers can create lab session requests"
    ON public.lab_sessions FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = lecturer_id 
        OR public.is_lab_head_or_admin()
    );

-- Lab Heads assign sessions; Teachers update status to completed; Admins manage all
CREATE POLICY "Lab Heads and Assigned Teachers update sessions"
    ON public.lab_sessions FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = lecturer_id
        OR auth.uid() = lab_teacher_id
        OR public.is_lab_head_or_admin()
    )
    WITH CHECK (
        auth.uid() = lecturer_id
        OR auth.uid() = lab_teacher_id
        OR public.is_lab_head_or_admin()
    );

-- ------------------------------------------------------------------------------
-- 6.5 ANNOUNCEMENTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Announcements viewable by all authenticated users"
    ON public.announcements FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins and Lab Heads create and manage announcements"
    ON public.announcements FOR ALL
    TO authenticated
    USING (public.is_lab_head_or_admin())
    WITH CHECK (public.is_lab_head_or_admin());

-- ==============================================================================
-- 7. SUPABASE REALTIME REPLICATION SETUP
-- ==============================================================================
-- Enable Realtime publication for tables with instant live feeds
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_audits;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.lab_sessions;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.hardware;
EXCEPTION WHEN others THEN
    -- Handled gracefully if publication already contains tables
    null;
END $$;
