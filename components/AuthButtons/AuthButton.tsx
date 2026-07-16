'use client';

import { redirect } from 'next/navigation';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Provider, UserIdentity } from '@supabase/supabase-js';
import { Button } from '@mantine/core';
import { createClient } from '@/lib/supabase/client';

export default function AuthButton({
  loggedIn = false,
  providerText = '',
  providerIcon,
  providerObj = null,
  providerName,
}: {
  loggedIn: boolean;
  providerText: string;
  providerIcon: React.ReactNode;
  providerObj?: null | UserIdentity;
  providerName: string;
}) {
  const supabase = createClient();
  async function signInWithProvider() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: providerText as Provider,
      options: {
        redirectTo: loggedIn
          ? `${window.location.origin}/media-rss/settings`
          : `${window.location.origin}/media-rss/auth/callback`,
      },
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
  async function linkProvider() {
    if (providerObj) {
      const { data, error } = await supabase.auth.unlinkIdentity(providerObj);
      if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
      await supabase.auth.signOut();
      redirect('/login');
    }
    const { error } = await supabase.auth.linkIdentity({
      provider: providerText as Provider,
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
      justify="space-between"
      leftSection={providerIcon}
      onClick={loggedIn ? linkProvider : signInWithProvider}
      rightSection={<span />}
    >
      {loggedIn
        ? providerObj
          ? 'Unlink ' + providerName
          : 'Link ' + providerName
        : 'Sign in with ' + providerName}
    </Button>
  );
}
