import AniListButton from '@/components/AuthButtons/Anilist';
import GithubButton from '@/components/AuthButtons/Github';
import MalButton from '@/components/AuthButtons/Mal';
import { createClient } from '@/lib/supabase/server';
import { Button, Center, Container, Divider, Group, Stack, Title } from "@mantine/core";
import { Text } from "@mantine/core";

export default async function Settings() {
  const supabase = await createClient();
  const { data: identities, error } = await supabase.auth.getUserIdentities();
  const linkedProviders = identities?.identities?.map((identity) => identity.provider)
  console.log("identities", identities?.identities)
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
          {linkedProviders?.includes("custom:anilist") ? <Text>Already linked</Text> : <AniListButton link={true} />}
        </Group>
        <Group>
          <Text>MyAnimeList</Text>
          {linkedProviders?.includes("custom:myanimelist") ? <Text>Already linked</Text> : <MalButton link={true} />}
        </Group>
        <Group>
          <Text>GitHub</Text>
          {linkedProviders?.includes("github") ? <Text>Already linked</Text> : <GithubButton link={true} />}
        </Group>
      </Stack>
    </Container>
  );
}