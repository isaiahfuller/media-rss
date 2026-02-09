import { redirect } from 'next/navigation';
import { Center, Container, Stack } from '@mantine/core';
import IDField from '@/components/IDField/IDField';
import List from '@/components/List/List';
import Navbar from '@/components/Navbar/Navbar';
import getCombinedList from '@/lib/getCombinedList';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const list = await getCombinedList(user.id);

  return (
    <>
      <Navbar />
      <Container>
        <Stack>
          <Center>
            <IDField id={user?.id || ''} />
          </Center>
          <Center>
            <List list={{ list, service: 'global' }} />
          </Center>
        </Stack>
      </Container>
    </>
  );
}
