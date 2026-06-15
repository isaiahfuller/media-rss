'use client';

import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mantine/core';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import MyAnimeList from '@/img/MyAnimeList.svg';

export default function MalButton({ link = false }: { link: boolean }) {
  const supabase = createClient();
  async function signInWithMal() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'custom:myanimelist',
      options: {
        redirectTo: `${window.location.origin}/media-rss/auth/callback`,
      },
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
  async function linkMal() {
    const { error } = await supabase.auth.linkIdentity({
      provider: 'custom:myanimelist',
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
      leftSection={<Image src={MyAnimeList} alt="MyAnimeList" width={20} height={20} />}
      onClick={link ? linkMal : signInWithMal}
      rightSection={<span />}
    >
      {link ? 'Link MyAnimeList' : 'Sign in with MyAnimeList'}
    </Button>
  );
}
