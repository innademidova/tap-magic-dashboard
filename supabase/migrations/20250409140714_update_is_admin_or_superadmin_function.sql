CREATE OR REPLACE FUNCTION is_admin_or_superadmin() RETURNS BOOLEAN AS $$
BEGIN
RETURN EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid()
      AND role IN ('admin', 'superadmin')
);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

   -- Add comment to the function for documentation
COMMENT ON FUNCTION public.is_admin_or_superadmin() IS 'Checks if the currently authenticated user has admin or superadmin role';