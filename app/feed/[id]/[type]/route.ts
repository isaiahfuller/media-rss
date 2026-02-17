import { NextRequest, NextResponse } from 'next/server';
import { Feed } from 'feed';
import getCombinedList from '@/lib/getCombinedList';
import { createClient } from '@/lib/supabase/server';

export async function GET(_req: NextRequest, { params }: { params: { id: string; type: string } }) {
  const { id, type } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    await supabase.auth.signInAnonymously();
  }
  const list = await getCombinedList(id);
  const feed = new Feed({
    title: 'Media Tracker',
    description: 'Media Tracker',
    id: 'https://isaiah.moe',
    link: 'https://isaiah.moe',
    language: 'en',
  });
  list.forEach((item) => {
    feed.addItem({
      title: item.title,
      id: item.timestamp + '',
      link: item.url || '',
      description: item.status,
      content: item.album || '',
      image: item.image || '',
      date: new Date(item.timestamp),
      extensions: [
        {
          name: 'exdata',
          objects: {
            title: item.title,
            image: item.image,
            status: item.status,
            album: item.album,
            artist: item.artist,
            type: item.type,
            episodes: item.album,
            chapters: item.album,
            url: item.url,
            timestamp: item.timestamp,
          }
        }
      ]
    });
  });
  if (type.toLowerCase() === 'rss') {
    return new NextResponse(feed.rss2(), { headers: { 'Content-Type': 'application/rss+xml' } });
  }
  if (type.toLowerCase() === 'atom') {
    return new NextResponse(feed.atom1(), { headers: { 'Content-Type': 'application/atom+xml' } });
  }
  if (type.toLowerCase() === 'json') {
    return NextResponse.json(list, { headers: { 'Content-Type': 'application/json' } });
  }
  return new NextResponse(feed.rss2(), { headers: { 'Content-Type': 'application/rss+xml' } });
}
