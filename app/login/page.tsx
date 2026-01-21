import { redirect } from 'next/navigation';
import { Center } from '@mantine/core';
import GithubButton from '@/components/AuthButtons/Github';
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
      <GithubButton />
    </Center>
  );
}
