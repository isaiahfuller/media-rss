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
  try {
    const { data: deletedUser, error: deleteError } = await supabase.auth.admin.deleteUser(data.claims.sub);
    if (deleteError) {
      return Response.json(
        { msg: 'Failed to delete user' },
        {
          status: 500,
        }
      );
    }
    return Response.json({
      msg: 'User deleted successfully',
    });
  } catch (e) {
    return new Response('Internal Server Error', {
      status: 500,
    });
  }
});
