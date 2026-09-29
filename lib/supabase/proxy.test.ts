/** @jest-environment node */

import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { updateSession } from './proxy';

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}));

describe('logged-out route access', () => {
  beforeEach(() => {
    jest.mocked(createServerClient).mockReturnValue({
      auth: { getClaims: jest.fn().mockResolvedValue({ data: null }) },
    } as unknown as ReturnType<typeof createServerClient>);
  });

  it.each(['/user/12345678-1234-1234-1234-123456789abc', '/feed/user-id/rss'])(
    'allows public route %s without a session',
    async (path) => {
      const response = await updateSession(new NextRequest(`http://localhost${path}`));
      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    }
  );

  it.each(['/', '/settings', '/source/anilist', '/users', '/user/id/settings'])(
    'keeps %s protected',
    async (path) => {
      const response = await updateSession(new NextRequest(`http://localhost${path}`));
      expect(response.headers.get('location')).toBe('http://localhost/login');
    }
  );
});
