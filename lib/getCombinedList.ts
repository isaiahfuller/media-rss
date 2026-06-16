import { getAnilistList } from './anilist';
import { getLastfmList } from './lastfm';
import { getMalList } from './mal';
import { createClient } from './supabase/server';

export default async function getCombinedList(id: string) {
  const supabase = await createClient();
  const { data: identities, error } = await supabase.auth.getUserIdentities();
  const list = [];
  let anilistId: string | undefined, malId: string | undefined;

  for (const identity of identities?.identities!) {
    if (identity.provider === "custom:anilist") {
      anilistId = identity.identity_data?.sub;
    }
    if (identity.provider === "custom:myanimelist") {
      malId = identity.identity_data?.preferred_username;
    }
  }

  const { data: lastfmUsername } = await supabase
    .from('lastfm_user')
    .select('external_name')
    .eq('user_id', id);

  if (anilistId && anilistId.length) {
    const anilistData = await getAnilistList(Number(anilistId));
    if (anilistData) {
      list.push(...anilistData.list);
    }
  }

  if (malId && malId.length) {
    const malData = await getMalList(malId);
    if (malData) {
      list.push(...malData.list);
    }
  }

  if (lastfmUsername && lastfmUsername.length) {
    const lfmData = await getLastfmList(lastfmUsername[0].external_name);
    if (lfmData) {
      list.push(...lfmData.list);
    }
  }

  const sortedList = list.sort((a, b) => b.timestamp - a.timestamp);

  return sortedList;
}
