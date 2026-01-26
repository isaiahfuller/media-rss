// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { GlobalList } from '../_shared/interfaces.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
);

const url = 'https://api.myanimelist.net/v2';
const requestHeaders = new Headers();
requestHeaders.set('X-MAL-CLIENT-ID', Deno.env.get('MAL_CLIENT_ID'));
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
  try {
    const { username } = await req.json();
    const response = await fetch(
      `${url}/users/${username}/animelist?sort=list_updated_at&fields=main_picture,title,list_status,media_type`,
      {
        headers: requestHeaders,
      }
    );
    const data = await response.json();
    const formattedList = formatList(data?.data);
    return new Response(JSON.stringify(formattedList), {
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

function formatList(data) {
  console.log('data', data);
  const res: GlobalList = {
    service: 'myanimelist',
    list: data.map((item) => {
      return {
        type: item.node?.media_type,
        id: item.node?.id,
        title: item.node?.title,
        image: item.node?.main_picture?.medium || null,
        timestamp: Date.parse(item.list_status?.updated_at),
      };
    }),
  };
  return res;
}
