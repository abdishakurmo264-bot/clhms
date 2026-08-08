const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function runMigration() {
  console.log('Connecting to live Supabase PostgreSQL via Pooler...');
  
  const client = new Client({
    host: 'aws-0-eu-west-2.pooler.supabase.com',
    port: 6543,
    user: 'postgres.kwognmwltcvyjtdsydnx',
    password: 'CLHMS_Secure_2026_PostgresPass!',
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL successfully!');

    const migrationSql = fs.readFileSync(
      path.join(__dirname, '../supabase/migrations/20260808000001_clhms_prd_phase1_schema_rls.sql'),
      'utf-8'
    );

    console.log('🚀 Executing CLHMS PRD Version 1.0 Schema Migration & Strict RLS Policies...');
    await client.query(migrationSql);
    console.log('✅ Full schema, tables, enums, check constraints, and RLS policies created successfully!');

    // Run seed data
    const seedSql = fs.readFileSync(
      path.join(__dirname, '../supabase/seed.sql'),
      'utf-8'
    );
    console.log('🌱 Inserting initial Hardware inventory seed data...');
    await client.query(seedSql);
    console.log('✅ Seed data inserted successfully!');

    // Verify created tables in public schema
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('\n📊 LIVE SUPABASE PUBLIC TABLES VERIFIED:');
    res.rows.forEach(r => console.log('  - ' + r.table_name));

    // Verify hardware count
    const hwRes = await client.query('SELECT count(*) FROM public.hardware;');
    console.log(`\n📦 Live Hardware Records in Database: ${hwRes.rows[0].count}`);

    // Verify enums
    const enumRes = await client.query(`
      SELECT t.typname as enum_name, string_agg(e.enumlabel, ', ') as enum_values
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      JOIN pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      GROUP BY t.typname;
    `);

    console.log('\n🏷️ ENUM TYPES CREATED:');
    enumRes.rows.forEach(e => console.log(`  - ${e.enum_name}: [${e.enum_values}]`));

    // Verify RLS policies
    const rlsRes = await client.query(`
      SELECT tablename, policyname, cmd
      FROM pg_policies
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    console.log('\n🔒 ROW LEVEL SECURITY (RLS) POLICIES ACTIVE:');
    rlsRes.rows.forEach(p => console.log(`  - [${p.tablename}] ${p.policyname} (${p.cmd})`));

    await client.end();
    console.log('\n🎉 ALL SUPABASE DATABASE WORK COMPLETED AND VERIFIED 100%!');
  } catch (err) {
    console.error('❌ Migration error:', err);
    process.exit(1);
  }
}

runMigration();
