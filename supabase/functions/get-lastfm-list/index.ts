// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { GlobalList } from '../_shared/interfaces.ts';
import mapFormat from '../_shared/mapFormat.ts';
import mapStatus from '../_shared/mapStatus.ts';

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
  try {
    const { username } = await req.json();
    const url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${Deno.env.get('LASTFM_CLIENT_ID')}&format=json`;
    const lfmResponse = await fetch(url);
    const lfmData = await lfmResponse.json();
    const formattedList = formatList(lfmData?.recenttracks?.track);
    console.log(formattedList)

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

function formatList(data, type = 'music') {
  const res: GlobalList = {
    service: 'lastfm',
    list: data.map((item) => {
      const type = 'music'
      const status = 'played'
      const album = item.album["#text"]
      return {
        type,
        id: item.mbid || item.date.uts,
        title: item.name,
        image: item.image[1]["#text"] || null,
        timestamp: item.date.uts * 1000,
        url: item.url,
        status,
        album,
      };
    }),
  };
  return res;
}
