import { redirect } from 'next/navigation';
import { act, fireEvent, screen } from '@testing-library/react';
import { useViewportSize } from '@mantine/hooks';
import { createClient } from '@/lib/supabase/client';
import { render } from '@/test-utils';
import Navbar from './Navbar';

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

jest.mock('@mantine/hooks', () => ({
  ...jest.requireActual('@mantine/hooks'),
  useViewportSize: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('Navbar', () => {
  const mockSignOut = jest.fn();
  const mockUnsubscribe = jest.fn();
  let authListener: (event: string, session: object | null) => void;
  const mockOnAuthStateChange = jest.fn((callback) => {
    authListener = callback;
    callback('INITIAL_SESSION', { user: { id: 'test-user' } });
    return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
  });
  const mockSupabase = {
    auth: {
      signOut: mockSignOut,
      onAuthStateChange: mockOnAuthStateChange,
    },
  };

  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    (useViewportSize as jest.Mock).mockReturnValue({ width: 1024 });
  });

  it('updates navigation when login status changes and unsubscribes on unmount', () => {
    const { unmount } = render(<Navbar />);
    expect(screen.getByText('Settings')).toBeInTheDocument();

    act(() => authListener('SIGNED_OUT', null));
    expect(screen.getByText('Login').closest('a')).toHaveAttribute('href', '/login');
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();

    act(() => authListener('SIGNED_IN', { user: { id: 'test-user' } }));
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();

    mockUnsubscribe.mockClear();
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });

  it('renders branding', () => {
    render(<Navbar />);
    expect(screen.getByText('Media RSS')).toBeInTheDocument();
  });

  it('renders desktop navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Sources')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('renders mobile navigation links when burger is clicked', () => {
    (useViewportSize as jest.Mock).mockReturnValue({ width: 500 });
    render(<Navbar />);

    // Burger should be visible
    const burger = screen.getByLabelText(/toggle navigation/i);
    expect(burger).toBeInTheDocument();

    // Initially links might be hidden via Mantine logic if we don't mock opened state,
    // but the component shows them if 'opened' is true.
    // Navbar uses useDisclosure() which we didn't mock yet.
    // Let's click the burger.
    fireEvent.click(burger);

    expect(screen.getAllByText('Last.fm').length).toBeGreaterThan(0);
    expect(screen.getAllByText('AniList').length).toBeGreaterThan(0);
  });

  it('calls signOut and redirect when Logout is clicked', () => {
    render(<Navbar />);
    const logoutBtn = screen.getByText('Logout');
    fireEvent.click(logoutBtn);

    expect(mockSignOut).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith('/login');
  });
});
