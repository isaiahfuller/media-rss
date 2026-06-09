'use client';

import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mantine/core';
import { createClient } from '@/lib/supabase/client';

export default function GithubButton() {
  const supabase = createClient();
  async function signInWithGithub() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
  return (
    <Button leftSection={<FontAwesomeIcon icon={faGithub} />} onClick={signInWithGithub}>
      Sign in with GitHub
    </Button>
  );
}
