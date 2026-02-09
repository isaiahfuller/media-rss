import { NextRequest, NextResponse } from 'next/server';
import { Feed } from 'feed';
import getCombinedList from '@/lib/getCombinedList';
import { createClient } from '@/lib/supabase/server';

export async function GET(_req: NextRequest, { params }: { params: { id: string; type: string } }) {
  // TODO: implement feed
  // Get all feeds
  // Return them as a rss feed
  const { id, type } = await params;
  console.log(id, type);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
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
      id: item.url,
      link: item.url || '',
      description: item.title,
      image: item.image || '',
      date: new Date(item.timestamp),
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
