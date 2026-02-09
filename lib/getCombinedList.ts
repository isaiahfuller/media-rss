import { getAnilistList } from './anilist';
import { getMalList } from './mal';
import { createClient } from './supabase/server';

export default async function getCombinedList(id: string) {
  const supabase = await createClient();
  const list = [];

  const { data: anilistId } = await supabase
    .from('anilist_user')
    .select('external_id')
    .eq('user_id', id);
  const { data: malId } = await supabase
    .from('myanimelist_user')
    .select('external_name')
    .eq('user_id', id);

  if (anilistId && anilistId.length) {
    const anilistData = await getAnilistList(anilistId[0].external_id);
    if (anilistData) {
      list.push(...anilistData.list);
    }
  }

  if (malId && malId.length) {
    const malData = await getMalList(malId[0].external_name);
    if (malData) {
      list.push(...malData.list);
    }
  }

  const sortedList = list.sort((a, b) => b.timestamp - a.timestamp);

  return sortedList;
}
