import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

// Generates URL-Safe SHA-256 hashes for the PKCE code challenge transformation
async function sha256Base64Url(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // --- STEP 1: INTERCEPT AUTHORIZE ROUTE ---
  if (url.pathname.endsWith("/authorize")) {
    const malAuthUrl = new URL("https://myanimelist.net/v1/oauth2/authorize");
    
    // Strict whitelist filters to strip invalid Supabase query parameters
    const allowedParams = ["response_type", "client_id", "redirect_uri", "state", "code_challenge"];

    url.searchParams.forEach((value, key) => {
      if (allowedParams.includes(key)) {
        if (key === "state" && value.length > 50) {
          malAuthUrl.searchParams.set(key, value.substring(0, 50));
        } else {
          malAuthUrl.searchParams.set(key, value);
        }
      }
    });

    // Translate challenge method to what MAL supports
    malAuthUrl.searchParams.set("code_challenge_method", "plain");
    
    return Response.redirect(malAuthUrl.toString(), 302);
  }

  // --- STEP 2: INTERCEPT TOKEN EXCHANGE ROUTE ---
  if (url.pathname.endsWith("/token") && req.method === "POST") {
    const rawBody = await req.text();
    const params = new URLSearchParams(rawBody);
    
    let clientId = params.get("client_id");
    let clientSecret = params.get("client_secret");

    // Extract Basic Credentials payload sent by Supabase
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.toLowerCase().startsWith("basic ")) {
      try {
        const base64Credentials = authHeader.substring(6).trim();
        const credentials = atob(base64Credentials);
        const [headerId, headerSecret] = credentials.split(":");
        if (!clientId) clientId = headerId;
        if (!clientSecret) clientSecret = headerSecret;
      } catch (e) {
        console.error("Failed to decode Basic Auth Header:", e);
      }
    }

    params.delete("client_id");
    params.delete("client_secret");

    // Recalculate original plain PKCE challenge string matching Step 1
    const originalVerifier = params.get("code_verifier");
    if (originalVerifier) {
      const encryptedChallengeAsPlainVerifier = await sha256Base64Url(originalVerifier);
      params.set("code_verifier", encryptedChallengeAsPlainVerifier);
    }

    if (clientId) params.set("client_id", clientId);
    if (clientSecret) params.set("client_secret", clientSecret);

    const malResponse = await fetch("https://myanimelist.net/v1/oauth2/token", {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "" 
      },
      body: params.toString()
    });

    if (!malResponse.ok) {
      const errText = await malResponse.text();
      return new Response(errText, { status: malResponse.status });
    }

    const malTokenData = await malResponse.json();

    // Reformat payload schema variables cleanly for Supabase
    const sanitizedTokenResponse = {
      access_token: malTokenData.access_token,
      refresh_token: malTokenData.refresh_token || "",
      token_type: malTokenData.token_type || "Bearer",
      expires_in: Number(malTokenData.expires_in) || 2419200
    };

    return new Response(JSON.stringify(sanitizedTokenResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  // --- STEP 3: INTERCEPT USERINFO ROUTE ---
  if (url.pathname.endsWith("/userinfo")) {
    const upstreamAuthHeader = req.headers.get("authorization");

    // CRITICAL: Handle Supabase's initial initialization testing check.
    // If Supabase reaches out without a Bearer token, return a dummy schema 
    // to verify the route is valid, preventing the MAL home page redirect loop.
    if (!upstreamAuthHeader || upstreamAuthHeader === "Bearer") {
      return new Response(JSON.stringify({ 
        sub: "test_probe_id", 
        email: "probe@myanimelist.internal",
        email_verified: true 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Process actual user profile fetching from MAL endpoint
    const malProfileResponse = await fetch("https://api.myanimelist.net/v2/users/@me", {
      method: "GET",
      headers: { "Authorization": upstreamAuthHeader }
    });

    if (!malProfileResponse.ok) {
      const errorText = await malProfileResponse.text();
      return new Response(errorText, { status: malProfileResponse.status });
    }

    const malProfileData = await malProfileResponse.json();
    const userIdString = String(malProfileData.id);
    const username = malProfileData.name;

    const strictOidcPayload = {
      id: userIdString,
      sub: userIdString,
      name: username,
      preferred_username: username,
      email: `${userIdString}@myanimelist.internal`,
      email_verified: true,
      picture: malProfileData.picture || null
    };

    return new Response(JSON.stringify(strictOidcPayload), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }

  return new Response("Not Found", { status: 404 });
});
