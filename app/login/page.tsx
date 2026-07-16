import Image from 'next/image';
import { redirect } from 'next/navigation';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Center, Stack } from '@mantine/core';
import AuthButton from '@/components/AuthButtons/AuthButton';
import AniList from '@/img/AniList.svg';
import MyAnimeList from '@/img/MyAnimeList.svg';
import { createClient } from '@/lib/supabase/server';

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  return (
    <Center h="100vh">
      <Stack>
        <AuthButton
          loggedIn={false}
          providerText="github"
          providerIcon={<FontAwesomeIcon icon={faGithub} />}
          providerName="GitHub"
        />
        <AuthButton
          loggedIn={false}
          providerText="custom:myanimelist"
          providerIcon={<Image src={MyAnimeList} alt="MyAnimeList" width={20} height={20} />}
          providerName="MyAnimeList"
        />
        <AuthButton
          loggedIn={false}
          providerText="custom:anilist"
          providerIcon={<Image src={AniList} alt="AniList" width={20} height={20} />}
          providerName="AniList"
        />
      </Stack>
    </Center>
  );
}
