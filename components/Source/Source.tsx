'use client';

import { useEffect, useState } from 'react';
import { Button, Group, TextInput } from '@mantine/core';
import { getAnilistId, getAnilistList } from '@/lib/anilist';
import { getMalList } from '@/lib/mal';
import { createClient } from '@/lib/supabase/client';

export default function Source({ source }: { source: string[] }) {
  const [username, setUsername] = useState<string>('');
  const [externalId, setExternalId] = useState<number | null>(null); // Out of currently planned sources, only anilist uses ids
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getValue();
  }, []);

  useEffect(() => {
    switch (source[0]) {
      case 'anilist': {
        if (externalId) {
          getAnilistList(externalId);
        }
        break;
      }
      case 'myanimelist': {
        break;
      }
      case 'lastfm': {
        break;
      }
      case 'trakt': {
        break;
      }
      default:
        break;
    }
  }, [externalId, username]);

  async function getValue() {
    setLoading(true);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }
    const { data } = await supabase
      .from(`${source[0]}_user`)
      .select('external_id, external_name')
      .eq('user_id', user.id);
    if (data && data.length) {
      setUsername(data[0].external_name);
      switch (source[0]) {
        case 'anilist': {
          setExternalId(data[0].external_id);
          await getAnilistList(data[0].external_id);
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
        insertValue(id, username);
        break;
      }
      case 'myanimelist': {
        await getMalList(username);
        insertValue(-1, username);
        break;
      }
      default:
        break;
    }
    setLoading(false);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Source: {source}</h1>
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
      </form>
    </>
  );
}
