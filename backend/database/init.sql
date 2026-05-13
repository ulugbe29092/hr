-- NEXUS Platform — PostgreSQL Init Script
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Row Level Security helper function
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS TEXT AS $$
  SELECT current_setting('app.tenant_id', TRUE);
$$ LANGUAGE SQL STABLE;

-- Indexes for performance
-- (TypeORM will create tables; this adds extra optimizations)

-- Full-text search indexes (created after tables exist via migrations)
-- CREATE INDEX CONCURRENTLY idx_employees_fts ON employees USING gin(to_tsvector('english', first_name || ' ' || last_name || ' ' || email));
-- CREATE INDEX CONCURRENTLY idx_clients_fts ON clients USING gin(to_tsvector('english', name || ' ' || COALESCE(email, '')));

COMMENT ON DATABASE nexus_db IS 'NEXUS ERP CRM HR AI Platform Database';
