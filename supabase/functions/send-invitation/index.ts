import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    // Preflight request (CORS check from browser)
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "https://tap-magic-dashboard.lovable.app, http://localhost:8080",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const { email, redirectTo } = await req.json();

  if (!email) {
    return new Response("Missing email", {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "https://tap-magic-dashboard.lovable.app, http://localhost:8080",
      },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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
    return new Response(data?.message || "Invite failed", {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "https://tap-magic-dashboard.lovable.app, http://localhost:8080",
      },
    });
  }

  return new Response(JSON.stringify({ status: "invited", user: data }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://tap-magic-dashboard.lovable.app, http://localhost:8080",
    },
  });
});
