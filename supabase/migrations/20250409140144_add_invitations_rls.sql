-- Add RLS policies to protect the invitations table
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can see all invitations" ON public.invitations;
DROP POLICY IF EXISTS "Admins can create invitations" ON public.invitations;
DROP POLICY IF EXISTS "Admins can update invitations" ON public.invitations;

-- Only admin users can see invitations
CREATE POLICY "Admins can see all invitations" 
ON public.invitations 
FOR SELECT
               USING (
                is_admin_or_superadmin()
               );

-- Only admin users can create invitations
CREATE POLICY "Admins can create invitations" 
ON public.invitations 
FOR INSERT 
WITH CHECK (
  is_admin_or_superadmin()
);

-- Only admin users can update invitations
CREATE POLICY "Admins can update invitations" 
ON public.invitations 
FOR UPDATE
                      USING (
                      is_admin_or_superadmin()
                      );