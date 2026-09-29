import { createClient } from "./supabase/server";

export default async function getUsernames(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.functions.invoke('get-user-identities', {
    body: {
      userId: id,
    },
  });

  if (error) {
    throw error;
  }

  const usernames: {
    [key: string]: string
  } = {}
  
  const lfm = await supabase
    .from('lastfm_user')
    .select('external_name')
    .eq('user_id', id);

  if(lfm && lfm.data && lfm.data.length){
    usernames.lastfm = lfm.data[0].external_name
  }

  for (const identity of data.providers) {
    usernames[identity.provider.replace("custom:","")] = identity.identity_data.preferred_username
  }

  return usernames;
}