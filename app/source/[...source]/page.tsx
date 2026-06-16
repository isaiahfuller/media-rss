import { redirect } from 'next/navigation';
import { Container } from '@mantine/core';
import Source from '@/components/Source/Source';
import { getAnilistId, getAnilistList } from '@/lib/anilist';
import { getMalList } from '@/lib/mal';
import { createClient } from '@/lib/supabase/server';
import { getLastfmList } from '@/lib/lastfm';
import { GlobalList } from '@/interfaces/globalList';

export default async function SourcePage({ params }: { params: Promise<{ source: string[] }> }) {
  const { source } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  let anilistId: string | undefined, malId: string | undefined;
  const { data: identities, error } = await supabase.auth.getUserIdentities();
  if (error) {
    throw error;
  }
  for (const identity of identities?.identities!) {
    if (identity.provider === "custom:anilist") {
      anilistId = identity.identity_data?.sub;
    }
    if (identity.provider === "custom:myanimelist") {
      malId = identity.identity_data?.preferred_username;
    }
  }

  async function _getMalList(): Promise<GlobalList> {
    'use server';
    // const { malId } = await getIdentities();
    if (malId) {
      const list = await getMalList(malId);
      return list;
    }
    return { service: 'myanimelist', list: [] };
  }

  async function _getAnilistList(): Promise<GlobalList> {
    'use server';
    // const { anilistId } = await getIdentities();
    if (anilistId) {
      const list = await getAnilistList(Number(anilistId));
      return list;
    }
    return { service: 'anilist', list: [] };
  }

  async function _getAnilistId(username: string) {
    'use server';
    const id = await getAnilistId(username);
    return id;
  }

  async function _getLastfmList(username: string): Promise<GlobalList> {
    'use server';
    const list = await getLastfmList(username)
    return list;
  }

  return (
    <Container>
      <Source
        source={source}
        getMalList={_getMalList}
        getAnilistId={_getAnilistId}
        getAnilistList={_getAnilistList}
        getLastfmList={_getLastfmList}
      />
    </Container>
  );
}
