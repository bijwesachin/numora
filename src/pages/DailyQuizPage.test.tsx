import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from '@/app/router';
import { useProgressStore } from '@/state/progressStore';

beforeEach(() => {
  useProgressStore.setState({ status: 'ready', cards: {}, bookmarks: {}, quizScores: {} });
});

function renderAt(path: string) {
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />);
}

describe('Daily Quiz', () => {
  it('opens from the dashboard on the hint quiz and saves each submitted answer to progress', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.click(screen.getByRole('link', { name: /Hint Quiz/ }));
    expect(screen.getByRole('heading', { name: /Daily Quiz/ })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Need a hint/ }));
    await user.click(within(screen.getByRole('group', { name: 'Choices' })).getAllByRole('button')[0]!);
    expect(screen.getByRole('status')).toHaveTextContent(/Yes!|Not quite/);
    const rated = Object.values(useProgressStore.getState().cards);
    expect(rated).toHaveLength(1);
    expect(['hard', 'again']).toContain(rated[0]!.lastRating);

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Question 2 of 10')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Need a hint/ })).toHaveAttribute('aria-expanded', 'false');
  });

  it('runs the trick quiz and shows the worked trick after each answer', async () => {
    const user = userEvent.setup();
    renderAt('/quiz?tab=tricks');
    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();

    for (let i = 0; i < 10; i++) {
      await user.click(within(screen.getByRole('group', { name: 'Choices' })).getAllByRole('button')[0]!);
      expect(screen.getByRole('list', { name: 'Steps' })).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: i < 9 ? 'Next' : 'See my score' }));
    }
    expect(screen.getByRole('heading', { name: /\/ 10 tricks right/ })).toBeInTheDocument();
  });

  it('saves the score, shows it for review, and doesn’t restart a quiz already done today', async () => {
    const user = userEvent.setup();
    renderAt('/quiz?tab=tricks');
    for (let i = 0; i < 2; i++) {
      await user.click(within(screen.getByRole('group', { name: 'Choices' })).getAllByRole('button')[0]!);
      await user.click(screen.getByRole('button', { name: 'Next' }));
    }
    cleanup();

    // Reopening continues where it left off.
    renderAt('/quiz?tab=tricks');
    expect(screen.getByText('Question 3 of 10')).toBeInTheDocument();
    cleanup();

    renderAt('/quiz?tab=scores');
    const today = screen.getByRole('region', { name: 'Today' });
    expect(within(today).getByText(/2 of 10 answered/)).toBeInTheDocument();
    expect(within(today).getAllByRole('listitem')).toHaveLength(2);
    cleanup();

    renderAt('/');
    expect(screen.getByRole('region', { name: /Daily Quiz/ })).toHaveTextContent(/Today.*2 of 10 answered/);
  });
});
