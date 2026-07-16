'use client';

import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mantine/core';
import { createClient } from '@/lib/supabase/client';

export default function GithubButton({ loggedIn = false }: { loggedIn: boolean }) {
  const supabase = createClient();
  async function signInWithGithub() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: loggedIn ? `${window.location.origin}/media-rss/settings` : `${window.location.origin}/media-rss/auth/callback`,
      },
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
  async function linkGithub() {
    const { error } = await supabase.auth.linkIdentity({
      provider: 'github',
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
      leftSection={<FontAwesomeIcon icon={faGithub} />}
      onClick={loggedIn ? linkGithub : signInWithGithub}
      rightSection={<span />}
    >
      {loggedIn ? 'loggedIn GitHub' : 'Sign in with GitHub'}
    </Button>
  );
}
