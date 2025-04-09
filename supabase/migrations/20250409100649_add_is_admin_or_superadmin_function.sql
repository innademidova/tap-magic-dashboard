CREATE OR REPLACE FUNCTION is_admin_or_superadmin() RETURNS BOOLEAN AS $$
BEGIN
RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
      AND role IN ('admin', 'superadmin')
);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
