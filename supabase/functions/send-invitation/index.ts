
import { serve } from "https://deno.land/std/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  const { email, redirectTo, role } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ error: "Missing email" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  try {
    // Check if an invitation already exists for this email
    const { data: existingInvitation, error: fetchError } = await fetch(`${supabaseUrl}/rest/v1/invitations?email=eq.${encodeURIComponent(email)}&status=eq.pending`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    }).then(res => res.json());

    if (fetchError) {
      return new Response(JSON.stringify({ error: fetchError.message || "Failed to check existing invitations" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    if (existingInvitation && existingInvitation.length > 0) {
      return new Response(JSON.stringify({ error: "An invitation for this email already exists and is pending" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // Send invitation email
    const response = await fetch(`${supabaseUrl}/auth/v1/invite`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        redirect_to: redirectTo || "https://tap-magic-dashboard.lovable.app/signin",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data?.message || "Invite failed" }), {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // Create a record in the invitations table
    const invitationRole = role || 'customer';
    const { error: insertError } = await fetch(`${supabaseUrl}/rest/v1/invitations`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        email,
        role: invitationRole,
        status: "pending",
        created_at: new Date().toISOString(),
      }),
    }).then(res => {
      if (!res.ok) {
        return res.json().then(err => ({ error: err }));
      }
      return { error: null };
    });

    if (insertError) {
      console.error("Failed to insert invitation record:", insertError);
      // Continue even if the invitation record insertion fails
      // The user was still invited via email
    }

    return new Response(JSON.stringify({ status: "invited", user: data }), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error in send-invitation:", error);
    return new Response(JSON.stringify({ error: error.message || "An unexpected error occurred" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
});
