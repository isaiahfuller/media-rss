'use client';

import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mantine/core';
import { createClient } from '@/lib/supabase/client';

export default function AniListButton() {
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
  return (
    <Button leftSection={<FontAwesomeIcon icon={faGithub} />} onClick={signInWithAniList}>
      Sign in with AniList
    </Button>
  );
}
