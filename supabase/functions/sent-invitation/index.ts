import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const { email, redirectTo } = await req.json();

  if (!email) {
    return new Response("Missing email", { status: 400 });
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
      redirect_to: redirectTo || "https://tap-magic-dashboard.lovable.app/signin"
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return new Response(data?.message || "Invite failed", { status: response.status });
  }

  return new Response(JSON.stringify({ status: "invited", user: data }), {
    headers: { "Content-Type": "application/json" }
  });
});
