import { GlobalList } from '@/interfaces/globalList';
import { createClient } from '@/lib/supabase/server';

export async function getLastfmList(username: string): Promise<GlobalList> {
  const supabase = await createClient();
  const { data, error } = await supabase.functions.invoke<GlobalList>('get-lastfm-list', {
    body: {
      username,
    },
  });

  if (error || !data) {
    throw error || new Error('No data');
  }

  return data;
}