
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectTo, role } = await req.json();
    
    // Validate required fields
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create Supabase client with service role key for admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // Check if invitation already exists
    const { data: existingInvitation, error: fetchError } = await supabaseAdmin
      .from("invitations")
      .select("*")
      .eq("email", email)
      .eq("status", "pending")
      .single();

    if (existingInvitation) {
      return new Response(
        JSON.stringify({ 
          error: "An invitation for this email already exists and is pending",
          invitation: existingInvitation
        }),
        { 
          status: 409, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Generate a magic link for sign-up
    const { data: magicLinkData, error: magicLinkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: email,
      options: {
        redirectTo: redirectTo || 'https://tap-magic-dashboard.lovable.app',
      },
    });

    if (magicLinkError) {
      console.error("Error generating magic link:", magicLinkError);
      return new Response(
        JSON.stringify({ error: magicLinkError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create invitation record
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from("invitations")
      .insert([
        { 
          email, 
          role: role || "customer", 
          status: "pending",
          invited_by: req.headers.get("Authorization")?.split(" ")[1] // Assuming JWT token contains user ID
        }
      ])
      .select()
      .single();

    if (invitationError) {
      console.error("Error creating invitation:", invitationError);
      return new Response(
        JSON.stringify({ error: invitationError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Generated sign-up link for:", email);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Invitation sent to ${email}`,
        invitation: invitation
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
