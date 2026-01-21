import { redirect } from 'next/navigation';
import { Container } from '@mantine/core';
import Source from '@/components/Source/Source';
import { createClient } from '@/lib/supabase/server';

export default async function SourcePage({ params }: { params: Promise<{ source: string[] }> }) {
  const { source } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  return (
    <Container>
      <Source source={source} />
    </Container>
  );
}
