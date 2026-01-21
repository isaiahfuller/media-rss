import { fireEvent, screen, waitFor } from '@testing-library/react';
import { createClient } from '@/lib/supabase/client';
import { render } from '@/test-utils';
import Source from './Source';

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('Source', () => {
  const mockGetUser = jest.fn();
  const mockFrom = jest.fn();
  const mockInvoke = jest.fn();
  const mockSupabase = {
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
    functions: {
      invoke: mockInvoke,
    },
  };

  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    mockGetUser.mockResolvedValue({ data: { user: { id: 'test-user-id' } } });
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: [{ external_name: 'test-user' }] }),
      upsert: jest.fn().mockResolvedValue({ error: null }),
    });
    mockInvoke.mockResolvedValue({ data: { id: 123 }, error: null });
  });

  it('renders correctly with source name', async () => {
    render(<Source source={['anilist']} />);
    expect(screen.getByText(/Source: anilist/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText(/Username/i)).toHaveValue('test-user'));
  });

  it('updates username on input change', async () => {
    render(<Source source={['anilist']} />);
    const input = screen.getByLabelText(/Username/i);
    await waitFor(() => expect(input).toHaveValue('test-user'));
    fireEvent.change(input, { target: { value: 'new-user' } });
    expect(input).toHaveValue('new-user');
  });

  it('calls supabase functions and inserts value on submit (anilist)', async () => {
    render(<Source source={['anilist']} />);
    const input = screen.getByLabelText(/Username/i);
    await waitFor(() => expect(input).toHaveValue('test-user'));

    fireEvent.change(input, { target: { value: 'new-user' } });

    const form = screen.getByRole('heading', { name: /Source: anilist/i }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockInvoke).toHaveBeenCalledWith('get-anilist-id', {
        body: { username: 'new-user' },
      });
    });
  });

  it('calls supabase functions on submit (myanimelist)', async () => {
    render(<Source source={['myanimelist']} />);
    const input = screen.getByLabelText(/Username/i);
    await waitFor(() => expect(input).toHaveValue('test-user'));

    fireEvent.change(input, { target: { value: 'mal-user' } });

    const form = screen.getByRole('heading', { name: /Source: myanimelist/i }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockInvoke).toHaveBeenCalledWith('mal-list', {
        body: { username: 'mal-user' },
      });
    });
  });
});
