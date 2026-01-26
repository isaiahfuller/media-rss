import { GlobalList } from '@/interfaces/globalList';
import { createClient } from '@/lib/supabase/client';

export async function getMalList(username: string): Promise<GlobalList> {
  const supabase = createClient();
  const { data } = await supabase.functions.invoke('mal-list', {
    body: {
      username,
    },
  });
  console.log('data', data);
  return data;
}
