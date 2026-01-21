import { createClient } from '@/lib/supabase/client';

export async function getMalList(username: string) {
  const supabase = createClient();
  const {
    data: { list },
  } = await supabase.functions.invoke('mal-list', {
    body: {
      username,
    },
  });
  return list;
}
