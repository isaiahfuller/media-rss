'use client';

import { useEffect, useState } from 'react';
import { Button, Center, Divider, Group, Loader, Stack, TextInput } from '@mantine/core';
import { GlobalList } from '@/interfaces/globalList';
import { createClient } from '@/lib/supabase/client';
import List from '../List/List';

export default function Source({
  source,
  getMalList,
  getAnilistId,
  getAnilistList,
  getLastfmList,
}: {
  source: string[];
  getMalList: () => Promise<GlobalList>;
  getAnilistId: (username: string) => Promise<number>;
  getAnilistList: () => Promise<GlobalList>;
  getLastfmList: (username: string) => Promise<GlobalList>;
}) {
  const [username, setUsername] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [externalId, setExternalId] = useState<number | null>(null); // Out of currently planned sources, only anilist uses ids
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<GlobalList | null>(null);

  useEffect(() => {
    getValue();
  }, []);

  async function getValue() {
    setLoading(true);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }
    switch (source[0]) {
      case 'anilist': {
        const list = await getAnilistList();
        setList(list);
        break;
      }
      case 'myanimelist': {
        const list = await getMalList();
        setList(list);
        break;
      }
    }
    if(list && list.list?.length){
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from(`${source[0]}_user`)
      .select('external_id, external_name')
      .eq('user_id', user.id);
    if (data && data.length) {
      setUsername(data[0].external_name);
      switch (source[0]) {
        case 'lastfm': {
          setList(null);
          const list = await getLastfmList(data[0].external_name);
          setList(list);
          break;
        }
        default:
          break;
      }
    }
    setLoading(false);
  }

  async function insertValue(id: number, name: string) {
    setLoading(true);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }
    const { error } = await supabase.from(`${source[0]}_user`).upsert(
      {
        external_id: id,
        external_name: name,
        user_id: user.id,
      },
      { onConflict: 'user_id' }
    );
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    switch (source[0]) {
      case 'anilist': {
        const id = await getAnilistId(username);
        setList(null);
        const newList = await getAnilistList();
        setList(newList);
        break;
      }
      case 'myanimelist': {
        setList(null);
        const newList = await getMalList();
        setList(newList);
        break;
      }
      case 'lastfm': {
        insertValue(-1, username);
        setList(null);
        const newList = await getLastfmList(username);
        setList(newList);
        break;
      }
      default:
        break;
    }
    setLoading(false);
  }

  return (
    <Stack>
      <form onSubmit={handleSubmit}>
        <h1>Source: {source}</h1>
        {source[0] === 'anilist' || source[0] === 'myanimelist' ? null : (
          <Center>
            <Group align="flex-end">
            <TextInput
              placeholder="Enter your username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button loading={loading} type="submit">
              Submit
            </Button>
          </Group>
        </Center>
        )}
      </form>
      {
        loading ? <Center>
                    <Group>
                      <Loader />
                      <p>Getting list...</p>
                    </Group>
                  </Center> :
        (list || username) && !(source[0] === 'anilist' || source[0] === 'myanimelist') ? 
        <>
          <Divider />
        </>
        : null
      }
      <Center>
        {list ? (
          <>
            <List list={list} />
          </>
        ): null}
      </Center>
    </Stack>
  );
}
