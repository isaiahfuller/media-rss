import { redirect } from 'next/navigation';
import { Button, Center, Container, Divider, Group, Stack, Text, Title } from '@mantine/core';
import AccountDeleteButton from '@/components/AuthButtons/AccountDelete';
import AniListButton from '@/components/AuthButtons/Anilist';
import GithubButton from '@/components/AuthButtons/Github';
import MalButton from '@/components/AuthButtons/Mal';
import { createClient } from '@/lib/supabase/server';

export default async function Settings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }
  const { data: identities, error } = await supabase.auth.getUserIdentities();
  const linkedProviders = identities?.identities?.map((identity) => identity.provider);
  // console.log(identities?.identities)
  if (identities?.identities) {
    for (const identity of identities?.identities) {
      if (identity.provider === 'custom:anilist') {
        console.log('AniList linked');
        console.log(identity.identity_data);
      }
      if (identity.provider === 'custom:myanimelist') {
        console.log('MyAnimeList linked');
        console.log(identity.identity_data);
      }
      if (identity.provider === 'github') {
        console.log('GitHub linked');
        console.log(identity.identity_data);
      }
    }
  }
  return (
    <Container>
      <Center>
        <Text size="xl">Settings</Text>
      </Center>
      <Divider />
      <Stack>
        <Title>Link your accounts</Title>
        <Text>Link your social accounts to get started</Text>
        <Group>
          <Text>AniList</Text>
          {linkedProviders?.includes('custom:anilist') ? (
            <Text>Already linked</Text>
          ) : (
            <AniListButton loggedIn={true} />
          )}
        </Group>
        <Group>
          <Text>MyAnimeList</Text>
          {linkedProviders?.includes('custom:myanimelist') ? (
            <Text>Already linked</Text>
          ) : (
            <MalButton loggedIn={true} />
          )}
        </Group>
        <Group>
          <Text>GitHub</Text>
          {linkedProviders?.includes('github') ? (
            <GithubButton
              loggedIn={true}
              provider={identities?.identities.find((identity) => identity.provider === 'github')}
            />
          ) : (
            <GithubButton loggedIn={true} />
          )}
        </Group>
      </Stack>
      <Divider />
      <Stack>
        <Title c="red">Danger Zone</Title>
        <Text>Warning: This will delete your account and all data associated with it.</Text>
        <AccountDeleteButton id={user?.id!} />
      </Stack>
    </Container>
  );
}
