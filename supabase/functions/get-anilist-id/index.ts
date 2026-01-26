// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
);

console.info('server started');
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }
  const authHeader = req.headers.get('Authorization')!;

  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getClaims(token);
  if (error) {
    return Response.json(
      { msg: 'Invalid JWT' },
      {
        status: 401,
      }
    );
  }
  const { username } = await req.json();
  const userQuery = `
    {
      User(name: "${username}") {
        id
        name
      }
    }
    `;
  const url = 'https://graphql.anilist.co';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: userQuery,
    }),
  };
  try {
    const response = await fetch(url, options);
    const res = await response.json();
    const data = {
      id: res.data.User.id,
    };
    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        Connection: 'keep-alive',
      },
    });
  } catch (e) {
    return new Response('Internal Server Error', {
      status: 500,
    });
  }
});
