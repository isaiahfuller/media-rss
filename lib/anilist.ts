import { GlobalList } from '@/interfaces/globalList';
import { createClient } from '@/lib/supabase/server';

export async function getAnilistId(username: string) {
  const supabase = await createClient();
  const {
    data: { id },
  } = await supabase.functions.invoke('get-anilist-id', {
    body: {
      username,
    },
  });
  console.log('data', id);
  return id;
}

export async function getAnilistList(id: number): Promise<GlobalList> {
  const supabase = await createClient();
  const { data, error } = await supabase.functions.invoke<GlobalList>('get-anilist-list', {
    body: {
      id,
    },
  });

  if (error || !data) {
    throw error || new Error('No data');
  }

  console.log('data', data);
  return data;
}
