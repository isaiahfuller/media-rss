import { getAnilistList } from './anilist';
import { getLastfmList } from './lastfm';
import { getMalList } from './mal';
import { createClient } from './supabase/server';

export default async function getCombinedList(id: string) {
  const supabase = await createClient({
    global: {
      headers: {
        'x-supabase-auth-token': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
    },
  });
  const list = [];
  let anilistId: string | undefined, malId: string | undefined;

  // const { data: identities, error } = await supabase.auth.getUserIdentities();
  // console.log('identities', identities, error);
  // if (error) {
  //   throw error;
  // }
  // for (const identity of identities.identities) {
  //   if (identity.provider === 'custom:anilist') {
  //     anilistId = identity.identity_data?.sub;
  //   }
  //   if (identity.provider === 'custom:myanimelist') {
  //     malId = identity.identity_data?.preferred_username;
  //   }
  // }

  const { data, error } = await supabase.functions.invoke('get-user-identities', {
    body: {
      userId: id,
    },
  });

  console.log(data, error);
  for (const identity of data.providers) {
    console.log(identity.provider, identity.identity_data);
    if (identity.provider === 'custom:anilist') {
      anilistId = identity.identity_data?.sub;
    }
    if (identity.provider === 'custom:myanimelist') {
      malId = identity.identity_data?.preferred_username;
    }
  }

  if (error) {
    throw error;
  }

  // if (data && data.providers) {
  //   for (const provider of data.providers) {
  //     if (provider === 'custom:anilist') {
  //       anilistId = data.identities.find((identity) => identity.provider === 'custom:anilist')?.identity_data?.sub;
  //     }
  //     if (provider === 'custom:myanimelist') {
  //       malId = data.identities.find((identity) => identity.provider === 'custom:myanimelist')?.identity_data?.preferred_username;
  //     }
  //   }
  // }


  const { data: lastfmUsername } = await supabase
    .from('lastfm_user')
    .select('external_name')
    .eq('user_id', id);

  console.log(anilistId, malId, lastfmUsername);

  if (anilistId && anilistId.length) {
    const anilistData = await getAnilistList(Number(anilistId));
    if (anilistData && anilistData.list) {
      list.push(...anilistData.list);
    }
  }

  if (malId && malId.length) {
    const malData = await getMalList(malId);
    if (malData && malData.list) {
      list.push(...malData.list);
    }
  }

  if (lastfmUsername && lastfmUsername.length) {
    const lfmData = await getLastfmList(lastfmUsername[0].external_name);
    if (lfmData && lfmData.list) {
      list.push(...lfmData.list);
    }
  }

  const sortedList = list.sort((a, b) => b.timestamp - a.timestamp);

  return sortedList;
}
