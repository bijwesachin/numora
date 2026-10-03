import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from '@/app/router';
import { useProgressStore } from '@/state/progressStore';

beforeEach(() => {
  useProgressStore.setState({ status: 'ready', cards: {}, bookmarks: {} });
});

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

describe('Search', () => {
  it('shows suggestions, then live results for topics and cards', async () => {
    const user = userEvent.setup();
    renderAt('/search');
    expect(screen.getByText('Popular searches')).toBeInTheDocument();

    await user.type(screen.getByRole('searchbox'), 'equivalent fractions');
    const topics = screen.getByRole('region', { name: 'Topics' });
    expect(within(topics).getAllByRole('link')[0]).toHaveTextContent('Equivalent Fractions');
    expect(screen.getByRole('region', { name: 'Cards' })).toBeInTheDocument();
  });

  it('opens a single card from a result', async () => {
    const user = userEvent.setup();
    const router = renderAt('/search?q=7x8');
    await user.click(screen.getAllByRole('link', { name: /7 × 8 = \?/ })[0]!);
    expect(router.state.location.pathname).toBe('/cards/tt-7-008');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('7 × 8 = ?');
    expect(screen.getByRole('link', { name: /Study the whole/ })).toHaveAttribute('href', '/concepts/tt-7/study');
  });

  it('says so when nothing matches', async () => {
    renderAt('/search?q=zzqxwv');
    expect(screen.getByText(/No matches for/)).toBeInTheDocument();
  });

  it('marks topics that have no cards yet', () => {
    renderAt('/search?q=volume');
    expect(screen.getAllByText('Coming soon').length).toBeGreaterThan(0);
  });

  it('jumps to search when you press /', async () => {
    const user = userEvent.setup();
    const router = renderAt('/');
    await user.keyboard('/');
    expect(router.state.location.pathname).toBe('/search');
  });
});
