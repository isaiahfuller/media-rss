'use client';

import { useEffect, useState } from 'react';
import { Button, Group, TextInput } from '@mantine/core';
import { createClient } from '@/lib/supabase/client';

export default function Source({ source }: { source: string[] }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

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
    const { data } = await supabase
      .from(`${source[0]}_user`)
      .select('external_id, external_name')
      .eq('user_id', user.id);
    if (data && data.length) {
      setUsername(data[0].external_name);
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
    const supabase = await createClient();
    setLoading(true);
    switch (source[0]) {
      case 'anilist': {
        const {
          data: { id },
        } = await supabase.functions.invoke('get-anilist-id', {
          body: {
            username,
          },
        });
        insertValue(id, username);
        break;
      }
      case 'myanimelist': {
        const { error } = await supabase.functions.invoke('mal-list', {
          body: {
            username,
          },
        });
        if (error) {
          return;
        }
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
