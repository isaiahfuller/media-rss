import { fireEvent, screen } from '@testing-library/react';
import { createClient } from '@/lib/supabase/client';
import { render } from '@/test-utils';
import GithubButton from './Github';

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('GithubButton', () => {
  const mockSignInWithOAuth = jest.fn();
  const mockSupabase = {
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
    },
  };

  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    mockSignInWithOAuth.mockResolvedValue({ error: null });
  });

  it('renders correctly', () => {
    render(<GithubButton />);
    expect(screen.getByRole('button', { name: /sign in with github/i })).toBeInTheDocument();
  });

  it('calls signInWithOAuth when clicked', async () => {
    render(<GithubButton />);
    const button = screen.getByRole('button', { name: /sign in with github/i });
    fireEvent.click(button);

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'github',
      options: {
        redirectTo: 'http://localhost/auth/callback',
      },
    });
  });

  it('logs error if signInWithOAuth fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSignInWithOAuth.mockResolvedValue({ error: new Error('Failed to sign in') });

    render(<GithubButton />);
    const button = screen.getByRole('button', { name: /sign in with github/i });
    fireEvent.click(button);

    // Need to wait for the async function to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
