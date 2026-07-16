import Image from 'next/image';
import { redirect } from 'next/navigation';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Center, Container, Divider, Group, Stack, Text, Title } from '@mantine/core';
import AccountDeleteButton from '@/components/AuthButtons/AccountDelete';
import AuthButton from '@/components/AuthButtons/AuthButton';
import AniList from '@/img/AniList.svg';
import MyAnimeList from '@/img/MyAnimeList.svg';
import { createClient } from '@/lib/supabase/server';

export default async function Settings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }
  const { data: identities } = await supabase.auth.getUserIdentities();
  const linkedProviders = identities?.identities?.map((identity) => identity.provider);
  // if (identities && identities.identities) {
  //   for (const identity of identities.identities) {
  //     if (identity.provider === 'custom:anilist') {
  //       console.log('AniList linked');
  //       console.log(identity.identity_data);
  //     }
  //     if (identity.provider === 'custom:myanimelist') {
  //       console.log('MyAnimeList linked');
  //       console.log(identity.identity_data);
  //     }
  //     if (identity.provider === 'github') {
  //       console.log('GitHub linked');
  //       console.log(identity.identity_data);
  //     }
  //   }
  // }
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
            <AuthButton
              loggedIn
              providerText="custom:anilist"
              providerIcon={<Image src={AniList} alt="AniList" width={20} height={20} />}
              providerObj={identities?.identities.find(
                (identity) => identity.provider === 'custom:anilist'
              )}
              providerName="AniList"
            />
          ) : (
            <AuthButton
              loggedIn
              providerText="custom:anilist"
              providerIcon={<Image src={AniList} alt="AniList" width={20} height={20} />}
              providerName="AniList"
            />
          )}
        </Group>
        <Group>
          <Text>MyAnimeList</Text>
          {linkedProviders?.includes('custom:myanimelist') ? (
            <AuthButton
              loggedIn
              providerText="custom:myanimelist"
              providerIcon={<Image src={MyAnimeList} alt="MyAnimeList" width={20} height={20} />}
              providerObj={identities?.identities.find(
                (identity) => identity.provider === 'custom:myanimelist'
              )}
              providerName="MyAnimeList"
            />
          ) : (
            <AuthButton
              loggedIn
              providerText="custom:myanimelist"
              providerIcon={<Image src={MyAnimeList} alt="MyAnimeList" width={20} height={20} />}
              providerName="MyAnimeList"
            />
          )}
        </Group>
        <Group>
          <Text>GitHub</Text>
          {linkedProviders?.includes('github') ? (
            <AuthButton
              loggedIn
              providerText="github"
              providerIcon={<FontAwesomeIcon icon={faGithub} />}
              providerObj={identities?.identities.find(
                (identity) => identity.provider === 'github'
              )}
              providerName="GitHub"
            />
          ) : (
            <AuthButton
              loggedIn
              providerText="github"
              providerIcon={<FontAwesomeIcon icon={faGithub} />}
              providerName="GitHub"
            />
          )}
        </Group>
      </Stack>
      <Divider />
      <Stack>
        <Title c="red">Danger Zone</Title>
        <Text>Warning: This will delete your account and all data associated with it.</Text>
        <AccountDeleteButton id={user?.id} />
      </Stack>
    </Container>
  );
}
