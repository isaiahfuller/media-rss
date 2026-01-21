import { createClient } from '@/lib/supabase/client';

export async function getAnilistId(username: string) {
  const supabase = createClient();
  const {
    data: { id },
  } = await supabase.functions.invoke('get-anilist-id', {
    body: {
      username,
    },
  });
  return id;
}

export async function getAnilistList(id: number) {
  const supabase = createClient();
  const {
    data: { list },
  } = await supabase.functions.invoke('get-anilist-list', {
    body: {
      id,
    },
  });
  return list;
}
