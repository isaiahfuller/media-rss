import { redirect } from 'next/navigation';
import { Container } from '@mantine/core';
import Source from '@/components/Source/Source';
import { getAnilistId, getAnilistList } from '@/lib/anilist';
import { getMalList } from '@/lib/mal';
import { createClient } from '@/lib/supabase/server';
import { getLastfmList } from '@/lib/lastfm';

export default async function SourcePage({ params }: { params: Promise<{ source: string[] }> }) {
  const { source } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/media-rss/login');
  }

  async function _getMalList(username: string) {
    'use server';
    const list = await getMalList(username);
    return list;
  }

  async function _getAnilistList(id: number) {
    'use server';
    const list = await getAnilistList(id);
    return list;
  }

  async function _getAnilistId(username: string) {
    'use server';
    const id = await getAnilistId(username);
    return id;
  }

  async function _getLastfmList(username: string){
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
