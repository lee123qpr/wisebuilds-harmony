
-- This function allows running SQL queries with admin privileges
-- WARNING: This should be used carefully, only by admin users
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Set RLS policy for exec_sql to restrict access
-- (we will trigger this only from an edge function using service role)

ALTER FUNCTION exec_sql(text) OWNER TO postgres;
REVOKE ALL ON FUNCTION exec_sql(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;
