
-- Create a function to update invitation status when a user signs up
CREATE OR REPLACE FUNCTION public.handle_invitation_used()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the invitation status to 'accepted' when a user signs up with the invited email
  UPDATE public.invitations
  SET status = 'accepted'
  WHERE email = NEW.email
    AND status = 'pending';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that runs after a new user is inserted in auth.users
-- This will automatically update the invitation status
DROP TRIGGER IF EXISTS on_auth_user_created_update_invitation ON auth.users;
CREATE TRIGGER on_auth_user_created_update_invitation
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_invitation_used();
