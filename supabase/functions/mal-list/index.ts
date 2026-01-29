// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { GlobalList } from '../_shared/interfaces.ts';
import mapFormat from '../_shared/mapFormat.ts';

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
    console.log('username', username);
    const animeResponse = await fetch(
      `${url}/users/${username}/animelist?sort=list_updated_at&fields=main_picture,title,list_status,media_type`,
      {
        headers: requestHeaders,
      }
    );
    const animeData = await animeResponse.json();
    const formattedAnimeList = formatList(animeData?.data);
    const mangaResponse = await fetch(
      `${url}/users/${username}/mangalist?sort=list_updated_at&fields=main_picture,title,list_status,media_type`,
      {
        headers: requestHeaders,
      }
    );
    const mangaData = await mangaResponse.json();
    const formattedMangaList = formatList(mangaData?.data, 'manga');
    const mergedList = [...formattedAnimeList.list, ...formattedMangaList.list].sort(
      (a, b) => b.timestamp - a.timestamp
    );

    return new Response(JSON.stringify({ service: 'myanimelist', list: mergedList }), {
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

function formatList(data, type = 'anime') {
  console.log('data', data);
  const res: GlobalList = {
    service: 'myanimelist',
    list: data.map((item) => {
      return {
        type: mapFormat(item.node?.media_type.toUpperCase()),
        id: item.node?.id,
        title: item.node?.title,
        image: item.node?.main_picture?.medium || null,
        timestamp: Date.parse(item.list_status?.updated_at),
        url: `https://myanimelist.net/${type}/${item.node?.id}`,
      };
    }),
  };
  return res;
}
