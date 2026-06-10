import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

// 1. Define reusable CORS headers so your app can fetch this endpoint
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Adjust to your actual domain in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

Deno.serve(async (req) => {
  // 2. Handle browser CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 3. Extract the Bearer token passed from your client application
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. GraphQL query to extract necessary identity data from AniList
    const query = `
      query {
        Viewer {
          id
          name
          avatar {
            large
          }
        }
      }
    `;

    // 5. Forward the token directly to AniList's API
    const anilistResponse = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authHeader, // Inherits "Bearer <token>"
      },
      body: JSON.stringify({ query }),
    });

    const { data, errors } = await anilistResponse.json();

    if (errors || !data?.Viewer) {
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve user from AniList API', details: errors }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const user = data.Viewer;

    // 6. Map GraphQL response fields to an OIDC-compliant flat JSON object
    const profilePayload = {
      sub: String(user.id), // Stringified unique identifier required by GoTrue
      id: user.id,
      name: user.name,
      preferred_username: user.name,
      picture: user.avatar?.large,
      email: `${user.id}@anilist.internal`, // Workaround fallback email
      email_verified: true
    };

    return new Response(
      JSON.stringify(profilePayload),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
