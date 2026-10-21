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

  it('learns a table: fill in the hidden answers, then answer it shuffled', async () => {
    const user = userEvent.setup();
    renderAt('/quiz?tab=tables');
    expect(screen.getByRole('heading', { name: /Learning the 2 table/ })).toBeInTheDocument();
    const type = async (n: number) => {
      for (const d of String(n)) await user.click(within(screen.getByRole('group', { name: 'Number pad' })).getByRole('button', { name: d }));
      await user.click(screen.getByRole('button', { name: 'Check answer' }));
    };
    const hiddenRow = () => {
      const row = within(screen.getByRole('region', { name: '2 table' })).getByLabelText('Your answer').closest('li')!;
      return Number(/2 × (\d+)/.exec(row.textContent!)![1]);
    };

    await type(2 * hiddenRow() + 1);
    expect(screen.getByRole('status')).toHaveTextContent(/2 × \d+ = \d+/);
    await user.click(screen.getByRole('button', { name: /Next/ }));
    for (let i = 0; i < 2; i++) {
      await type(2 * hiddenRow());
      expect(await screen.findByText('Question ' + (i + 3) + ' of 13')).toBeInTheDocument();
    }

    await user.click(screen.getByRole('button', { name: 'Start' }));
    for (let i = 0; i < 10; i++) {
      const b = Number(/2 × (\d+)/.exec(screen.getByRole('region', { name: 'Question' }).textContent!)![1]);
      await type(2 * b);
      if (i < 9) expect(await screen.findByText(`Question ${i + 5} of 13`)).toBeInTheDocument();
    }
    expect(await screen.findByRole('heading', { name: '12 / 13 answers right' })).toBeInTheDocument();
    expect(screen.getByText(/try this level again/)).toBeInTheDocument();
  }, 20_000); // each right answer pauses before moving on
});
