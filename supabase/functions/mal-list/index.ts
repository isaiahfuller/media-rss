// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { corsHeaders } from '../_shared/cors.ts';
const url = 'https://api.myanimelist.net/v2';
const requestHeaders = new Headers();
requestHeaders.set('X-MAL-CLIENT-ID', Deno.env.get('MAL_CLIENT_ID'));
console.info('server started');
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const { username } = await req.json();
    const response = await fetch(`${url}/users/${username}/animelist?sort=list_updated_at&fields=main_picture,title,list_status,media_type`, {
      headers: requestHeaders
    });
    const data = await response.json();
    return new Response(JSON.stringify(data?.data), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        Connection: 'keep-alive'
      }
    });
  } catch (e) {
    return new Response('Internal Server Error', {
      status: 500
    });
  }
});
