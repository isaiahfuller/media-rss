// supabase/functions/get-user-identities/index.ts

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://your-app.com",
  "Access-Control-Allow-Headers": "content-type, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const { userId } = await req.json();

    if (!userId || typeof userId !== "string") {
      return Response.json(
        { error: "userId is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    // Privileged client — NEVER expose this credential to the browser.
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error || !user) {
      // Deliberately don't distinguish "not found" from other lookup failures.
      return Response.json(
        { providers: [] },
        { headers: corsHeaders },
      );
    }

    const providers = [
      ...new Set(
        (user.identities ?? [])
          .filter(Boolean),
      ),
    ];

    return Response.json(
      { providers },
      { headers: corsHeaders },
    );
  } catch {
    return Response.json(
      { error: "Invalid request" },
      { status: 400, headers: corsHeaders },
    );
  }
});