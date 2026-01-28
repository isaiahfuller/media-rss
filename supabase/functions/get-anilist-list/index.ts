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

console.info('server started');
Deno.serve(async (req: any) => {
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
  const { id } = await req.json();
  const query = `
    {
      Page(perPage: 20, page: 1) {
        activities(userId: ${id}, type: MEDIA_LIST, sort: ID_DESC) {
          ... on ListActivity {
            media {
              id
              siteUrl
              title {
                userPreferred
                english
              }
              coverImage {
                color
                large
              }
              format
              isAdult
              staff {
                edges {
                  role
                  node {
                    name {
                      full
                    }
                  }
                }
              }
            }
            id
            createdAt
          }
        }
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
      query: query,
    }),
  };
  const response = await fetch(url, options);
  const result = await response.json();
  return new Response(JSON.stringify(formatList(result.data.Page.activities)), {
    headers: {
      'Content-Type': 'application/json',
      Connection: 'keep-alive',
      ...corsHeaders,
    },
  });
});

function formatList(data: any) {
  console.log('data', data);
  const res: GlobalList = {
    service: 'anilist',
    list: data.map((item: any) => {
      console.log(item.media?.staff?.edges);
      const artist = item.media?.staff?.edges?.find((edge: any) => edge.role.startsWith('Story'))
        ?.node?.name?.full;
      return {
        type: mapFormat(item.media?.format),
        id: item.media?.id,
        title: item.media?.title?.userPreferred,
        image: item.media?.coverImage?.large || null,
        timestamp: item.createdAt * 1000,
        url: item.media?.siteUrl,
        artist: artist,
      };
    }),
  };
  return res;
}
