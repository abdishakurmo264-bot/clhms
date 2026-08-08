-- ==============================================================================
-- CLHMS: College Lab Management System - Full Database Schema & RLS Policies
-- Agent: Database-Auth-Agent (Supabase PostgreSQL & Security)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Enumeration Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'INSTRUCTOR', 'LAB_ASSISTANT', 'STUDENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE session_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE audit_status AS ENUM ('COMPLETE', 'INCOMPLETE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE hardware_condition AS ENUM ('OPERATIONAL', 'MAINTENANCE_REQUIRED', 'BROKEN', 'DECOMMISSIONED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Utility Function: Timestamp updater
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==============================================================================
-- 4. Table Definitions
-- ==============================================================================

-- Table 4.1: PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'INSTRUCTOR',
    department TEXT NOT NULL DEFAULT 'Computer Science & IT',
    specialization TEXT[] DEFAULT ARRAY[]::TEXT[],
    active_load_count INT NOT NULL DEFAULT 0 CHECK (active_load_count >= 0),
    max_daily_capacity INT NOT NULL DEFAULT 4,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 4.2: HARDWARE (Lab Computers, Switches, Routers, Projectors)
CREATE TABLE IF NOT EXISTS public.hardware (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_tag TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Workstation', 'Cisco Router', 'Switch', 'Projector', etc.
    lab_room TEXT NOT NULL, -- e.g., 'LAB-101', 'LAB-204'
    ip_address INET,
    mac_address MACADDR,
    condition hardware_condition NOT NULL DEFAULT 'OPERATIONAL',
    specifications JSONB DEFAULT '{}'::JSONB,
    last_inspected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 4.3: LAB_SESSIONS (Schedules, Time slots, Assigned Instructors)
CREATE TABLE IF NOT EXISTS public.lab_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    course_code TEXT NOT NULL,
    lab_room TEXT NOT NULL,
    instructor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    status session_status NOT NULL DEFAULT 'SCHEDULED',
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    student_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_session_time CHECK (scheduled_end > scheduled_start)
);

-- Table 4.4: DAILY_AUDITS (Instructor verification of lab state per session)
CREATE TABLE IF NOT EXISTS public.daily_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.lab_sessions(id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    status audit_status NOT NULL,
    incomplete_reason TEXT,
    hardware_issues_count INT NOT NULL DEFAULT 0 CHECK (hardware_issues_count >= 0),
    general_notes TEXT,
    checklist_payload JSONB DEFAULT '{}'::JSONB,
    audited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Business constraint: If status is INCOMPLETE, incomplete_reason cannot be empty
    CONSTRAINT chk_incomplete_audit_reason CHECK (
        (status = 'COMPLETE') OR 
        (status = 'INCOMPLETE' AND incomplete_reason IS NOT NULL AND length(trim(incomplete_reason)) > 0)
    )
);

-- Table 4.5: ANNOUNCEMENTS (System-wide or Lab-specific alerts)
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    target_role user_role, -- NULL means visible to everyone
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. Indexes for Performance
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_hardware_lab_room ON public.hardware(lab_room);
CREATE INDEX IF NOT EXISTS idx_hardware_condition ON public.hardware(condition);
CREATE INDEX IF NOT EXISTS idx_lab_sessions_instructor ON public.lab_sessions(instructor_id);
CREATE INDEX IF NOT EXISTS idx_lab_sessions_status ON public.lab_sessions(status);
CREATE INDEX IF NOT EXISTS idx_lab_sessions_schedule ON public.lab_sessions(scheduled_start, scheduled_end);
CREATE INDEX IF NOT EXISTS idx_daily_audits_session ON public.daily_audits(session_id);
CREATE INDEX IF NOT EXISTS idx_daily_audits_instructor ON public.daily_audits(instructor_id);
CREATE INDEX IF NOT EXISTS idx_daily_audits_status ON public.daily_audits(status);
CREATE INDEX IF NOT EXISTS idx_announcements_active ON public.announcements(is_active, priority);

-- ==============================================================================
-- 6. Trigger Bindings
-- ==============================================================================
DROP TRIGGER IF EXISTS trigger_update_profiles_timestamp ON public.profiles;
CREATE TRIGGER trigger_update_profiles_timestamp
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_hardware_timestamp ON public.hardware;
CREATE TRIGGER trigger_update_hardware_timestamp
    BEFORE UPDATE ON public.hardware
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_sessions_timestamp ON public.lab_sessions;
CREATE TRIGGER trigger_update_sessions_timestamp
    BEFORE UPDATE ON public.lab_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_audits_timestamp ON public.daily_audits;
CREATE TRIGGER trigger_update_audits_timestamp
    BEFORE UPDATE ON public.daily_audits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 7. Helper Security Functions for RLS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    );
$$;

CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT role FROM public.profiles
    WHERE id = auth.uid();
$$;

-- Atomic RPC Function: Complete lab session and decrement instructor workload
CREATE OR REPLACE FUNCTION public.rpc_complete_lab_session(
    p_session_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_instructor_id UUID;
    v_current_status session_status;
    v_new_load INT;
BEGIN
    -- Check permissions: user must be admin or the assigned instructor
    SELECT instructor_id, status 
    INTO v_instructor_id, v_current_status
    FROM public.lab_sessions
    WHERE id = p_session_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Lab session not found');
    END IF;

    IF v_instructor_id != auth.uid() AND NOT public.is_admin() THEN
        RETURN jsonb_build_object('success', false, 'error', 'Unauthorized to modify this session');
    END IF;

    IF v_current_status = 'COMPLETED' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Session is already completed');
    END IF;

    -- Update session status
    UPDATE public.lab_sessions
    SET status = 'COMPLETED',
        actual_end = NOW(),
        updated_at = NOW()
    WHERE id = p_session_id;

    -- Atomically decrement active_load_count on instructor profile (min 0)
    UPDATE public.profiles
    SET active_load_count = GREATEST(0, active_load_count - 1),
        updated_at = NOW()
    WHERE id = v_instructor_id
    RETURNING active_load_count INTO v_new_load;

    RETURN jsonb_build_object(
        'success', true,
        'sessionId', p_session_id,
        'instructorId', v_instructor_id,
        'activeLoadCount', v_new_load
    );
END;
$$;

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on ALL tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hardware ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 8.1 PROFILES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins have full access to all profiles"
    ON public.profiles FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8.2 HARDWARE POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Hardware is viewable by authenticated users"
    ON public.hardware FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins and Lab Assistants can manage hardware"
    ON public.hardware FOR ALL
    TO authenticated
    USING (public.is_admin() OR public.get_auth_role() = 'LAB_ASSISTANT')
    WITH CHECK (public.is_admin() OR public.get_auth_role() = 'LAB_ASSISTANT');

-- ------------------------------------------------------------------------------
-- 8.3 LAB_SESSIONS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Lab sessions are viewable by authenticated users"
    ON public.lab_sessions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Instructors can update their assigned lab sessions"
    ON public.lab_sessions FOR UPDATE
    TO authenticated
    USING (auth.uid() = instructor_id OR public.is_admin())
    WITH CHECK (auth.uid() = instructor_id OR public.is_admin());

CREATE POLICY "Admins can manage all lab sessions"
    ON public.lab_sessions FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8.4 DAILY_AUDITS POLICIES (Strict Business Rule Enforcement)
-- ------------------------------------------------------------------------------

-- Rule: Lab Instructors can ONLY SELECT their own audits, Admins see ALL
CREATE POLICY "Instructors can view their own audits; Admins view all"
    ON public.daily_audits FOR SELECT
    TO authenticated
    USING (
        auth.uid() = instructor_id 
        OR public.is_admin()
    );

-- Rule: Lab Instructors can INSERT their own audits
CREATE POLICY "Instructors can create audits for their sessions"
    ON public.daily_audits FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = instructor_id
        OR public.is_admin()
    );

-- Rule: Lab Instructors can UPDATE only their own audits; Admins can update all
CREATE POLICY "Instructors can update only their own audits"
    ON public.daily_audits FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = instructor_id 
        OR public.is_admin()
    )
    WITH CHECK (
        auth.uid() = instructor_id 
        OR public.is_admin()
    );

-- Rule: Only Admins can DELETE daily audits
CREATE POLICY "Only Admins can delete daily audits"
    ON public.daily_audits FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8.5 ANNOUNCEMENTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view active announcements matching role"
    ON public.announcements FOR SELECT
    TO authenticated
    USING (
        is_active = true 
        AND (target_role IS NULL OR target_role = public.get_auth_role() OR public.is_admin())
    );

CREATE POLICY "Admins can manage announcements"
    ON public.announcements FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
