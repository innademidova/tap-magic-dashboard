CREATE OR REPLACE FUNCTION is_superadmin() RETURNS BOOLEAN AS $$
BEGIN
RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
      AND role = 'superadmin'
);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
