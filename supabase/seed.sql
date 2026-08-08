-- ==============================================================================
-- CLHMS: College Lab & Hardware Management System - Initial Seed Data
-- Sub-Agent: Database-Auth-Agent (Supabase PostgreSQL)
-- ==============================================================================

-- 1. Insert Initial Hardware Assets (Workstations, Cisco Routers, Switches, Projectors)
INSERT INTO public.hardware (asset_name, serial_number, lab_room, category, is_operational)
VALUES
    ('Dell OptiPlex 7090 Micro Workstation', 'SN-LAB101-PC01', 'LAB-101 (Programming)', 'Workstation', true),
    ('Dell OptiPlex 7090 Micro Workstation', 'SN-LAB101-PC02', 'LAB-101 (Programming)', 'Workstation', true),
    ('Dell OptiPlex 7090 Micro Workstation', 'SN-LAB101-PC03', 'LAB-101 (Programming)', 'Workstation', true),
    ('Cisco 2901 Integrated Services Router', 'SN-CISCO-RTR-01', 'LAB-204 (Cisco Networks)', 'Cisco Routing', true),
    ('Cisco 2901 Integrated Services Router', 'SN-CISCO-RTR-02', 'LAB-204 (Cisco Networks)', 'Cisco Routing', true),
    ('Cisco Catalyst 2960-X 24-Port Switch', 'SN-SW-CAT2960-A', 'LAB-204 (Cisco Networks)', 'Network Hardware', true),
    ('Cisco Catalyst 2960-X 24-Port Switch', 'SN-SW-CAT2960-B', 'LAB-204 (Cisco Networks)', 'Network Hardware', false), -- Needs repair
    ('Epson 4K Laser Overhead Projector', 'SN-PRJ-EPS-01', 'LAB-101 (Programming)', 'Peripherals', true)
ON CONFLICT (serial_number) DO NOTHING;

-- 2. Sample Noticeboard Announcements
-- Note: Replace author_id with actual user UUID in production
-- INSERT INTO public.announcements (author_id, title, content, priority, is_pinned)
-- VALUES
--     ('00000000-0000-0000-0000-000000000000', 'Shift-ka Galabta: Cisco BGP Transit Labs', 'Dhammaan macalimiinta galabta fadlan hubiya in patch cables-ka ay diyaar u yihiin fadhiga Cisco BGP.', 'HIGH', true);
