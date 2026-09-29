import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Center, Container, Group, Stack, Text, Title, List as Li, ListItem } from '@mantine/core';
import IDField from '@/components/IDField/IDField';
import List from '@/components/List/List';
import Navbar from '@/components/Navbar/Navbar';
import AniList from '@/img/AniList.svg';
import Lastfm from '@/img/Lastfm.svg';
import MyAnimeList from '@/img/MyAnimeList.svg';
import getCombinedList from '@/lib/getCombinedList';
import getUsernames from '@/lib/getUsernames';

export const metadata = {
  title: 'User feeds | Media RSS',
};

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    notFound();
  }

  const list = await getCombinedList(id);
  const usernames = await getUsernames(id);

  return (
    <Container py="md">
      <Navbar />
      <Stack>
        <Title order={1}>User feeds</Title>
        <Title order={2}>Sources</Title>
          {Object.entries(usernames).map(([service, name]) => {
            let img
            let url
            switch (service) {
              case "myanimelist":
                img = MyAnimeList
                url = `https://myanimelist.net/profile/${name}`
                break;
              case "anilist":
                img = AniList
                url = `https://anilist.co/user/${name}`
                break;
              case "lastfm":
                img = Lastfm
                url = `https://last.fm/user/${name}`
                break;
              default:
                return
            }
            return (
              <a href={url} target='_blank'>
                <Group>
                <Image src={img} alt="MyAnimeList" width={20} height={20} />
                <Text>{name}</Text>
                </Group>
              </a>
            );
          })}
        {list.length > 0 ? (
          <List list={{ list, service: 'global' }} />
        ) : (
          <Text c="dimmed">No feed items found for this user.</Text>
        )}
      </Stack>
    </Container>
  );
}
