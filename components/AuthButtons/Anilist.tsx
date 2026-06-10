'use client';

import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mantine/core';
import { createClient } from '@/lib/supabase/client';

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
    <Button leftSection={<FontAwesomeIcon icon={faGithub} />} onClick={link ? linkAniList : signInWithAniList}>
      {link ? 'Link AniList' : 'Sign in with AniList'}
    </Button>
  );
}
