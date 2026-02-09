import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  // TODO: implement feed
  // Get all feeds
  // Return them as a rss feed
  const { id } = await params;
  return NextResponse.json({ message: 'Hello', id });
}
