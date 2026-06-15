'use client';

import { Button } from '@mantine/core';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import AniList from '@/img/AniList.svg';

export default function AniListButton({ link = false }: { link: boolean }) {
  const supabase = createClient();
  async function signInWithAniList() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'custom:anilist',
      options: {
        redirectTo: `${window.location.origin}/media-rss/auth/callback`,
      },
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
  async function linkAniList() {
    const { error } = await supabase.auth.linkIdentity({
      provider: 'custom:anilist',
      options: {
        redirectTo: `${window.location.origin}/media-rss/settings`,
      },
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
  return (
    <Button
      justify='space-between'
      leftSection={<Image src={AniList} alt="AniList" width={20} height={20} />}
      onClick={link ? linkAniList : signInWithAniList}
      rightSection={<span />}
    >
      {link ? 'Link AniList' : 'Sign in with AniList'}
    </Button>
  );
}
