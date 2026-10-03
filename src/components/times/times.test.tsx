import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { seededRandom } from '@/domain/deck/ordering';
import { factCardId } from '@/domain/timesTables';
import { useProgressStore } from '@/state/progressStore';
import { TimesExplorer } from './TimesExplorer';
import { TimesSprint } from './TimesSprint';

beforeEach(() => {
  useProgressStore.setState({ status: 'ready', cards: {}, bookmarks: {} });
});

function currentFact() {
  const [, a, b] = /(\d+) × (\d+)/.exec(screen.getByRole('heading', { level: 2 }).textContent ?? '')!;
  return { a: Number(a), b: Number(b) };
}

describe('TimesSprint', () => {
  it('runs a round in pick-it mode and saves each answer to progress', async () => {
    const user = userEvent.setup();
    render(<TimesSprint initialTables={[7]} random={seededRandom(5)} />, { wrapper: MemoryRouter });

    await user.click(screen.getByRole('button', { name: '10' }));
    await user.click(screen.getByRole('button', { name: 'Start sprint' }));

    const { a, b } = currentFact();
    expect(a).toBe(7);
    await user.click(screen.getByRole('button', { name: new RegExp(`^${a * b}\\b`) }));

    expect(screen.getByRole('status')).toHaveTextContent(`✓ ${a * b}`);
    expect(useProgressStore.getState().cards[factCardId(a, b)]?.timesCorrect).toBe(1);
  });

  it('shows the trick after a wrong answer and waits for Next', async () => {
    const user = userEvent.setup();
    render(<TimesSprint initialTables={[13]} random={seededRandom(9)} />, { wrapper: MemoryRouter });
    await user.click(screen.getByRole('button', { name: 'Start sprint' }));

    const { a, b } = currentFact();
    const wrong = screen
      .getAllByRole('button')
      .find((btn) => /^\d+/.test(btn.textContent ?? '') && !btn.textContent!.startsWith(String(a * b)))!;
    await user.click(wrong);

    expect(screen.getByRole('status')).toHaveTextContent(`Not quite — ${a} × ${b} = ${a * b}`);
    expect(screen.getByRole('list', { name: 'Steps' })).toBeInTheDocument();
    expect(useProgressStore.getState().cards[factCardId(a, b)]?.timesWrong).toBe(1);
    await user.click(screen.getByRole('button', { name: /Next/ }));
    expect(screen.getByText(/Question 2 of/)).toBeInTheDocument();
  });

  it('accepts typed answers from the number pad', async () => {
    const user = userEvent.setup();
    render(<TimesSprint initialTables={[12]} random={seededRandom(2)} />, { wrapper: MemoryRouter });
    await user.click(screen.getByRole('button', { name: 'Type it' }));
    await user.click(screen.getByRole('button', { name: 'Start sprint' }));

    const { a, b } = currentFact();
    const pad = screen.getByRole('group', { name: 'Number pad' });
    for (const digit of String(a * b)) await user.click(within(pad).getByRole('button', { name: digit }));
    await user.click(within(pad).getByRole('button', { name: 'Check answer' }));

    expect(useProgressStore.getState().cards[factCardId(a, b)]?.timesCorrect).toBe(1);
  });

  it('cannot start with no tables selected', async () => {
    const user = userEvent.setup();
    render(<TimesSprint initialTables={[7]} />, { wrapper: MemoryRouter });
    await user.click(screen.getByRole('button', { name: /× 7/ }));
    expect(screen.getByRole('button', { name: 'Start sprint' })).toBeDisabled();
  });
});

describe('TimesExplorer', () => {
  it('explains the fact you tap, with its trick', async () => {
    const user = userEvent.setup();
    render(<TimesExplorer onSprint={() => {}} />, { wrapper: MemoryRouter });

    expect(screen.getByText('Turnaround twin: 8 × 7 = 56')).toBeInTheDocument();
    await user.click(screen.getByRole('gridcell', { name: '13 times 6 equals 78' }));

    expect(screen.getByText(/Split 13 into 10 \+ 3/)).toBeInTheDocument();
    expect(screen.getByText('6 × 3 = 18')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '× 13 flashcards' })).toHaveAttribute('href', '/concepts/tt-13/study');
  });

  it('moves around the chart with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<TimesExplorer onSprint={() => {}} />, { wrapper: MemoryRouter });
    await user.click(screen.getByRole('gridcell', { name: '7 times 8 equals 56' }));
    await user.keyboard('{ArrowDown}{ArrowRight}');
    expect(screen.getByRole('gridcell', { name: '8 times 9 equals 72' })).toHaveAttribute('aria-selected', 'true');
  });
});
