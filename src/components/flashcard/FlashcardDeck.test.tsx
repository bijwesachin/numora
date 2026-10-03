import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { curriculum } from '@/content';
import { progressionOrder } from '@/domain/deck/ordering';
import { useProgressStore } from '@/state/progressStore';
import { FlashcardDeck } from './FlashcardDeck';

const cards = progressionOrder(curriculum.cardsOfConcept('fractions-equivalent'));

function renderDeck(deck = cards) {
  return render(
    <MemoryRouter>
      <FlashcardDeck cards={deck} exitTo={{ href: '/', label: 'Back' }} />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  useProgressStore.setState({ status: 'ready', cards: {}, bookmarks: {} });
});

describe('FlashcardDeck (Equivalent Fractions slice)', () => {
  it('starts with the concept card and only allows rating after flipping', async () => {
    const user = userEvent.setup();
    renderDeck();

    const question = screen.getByRole('region', { name: 'Question' });
    expect(within(question).getByRole('heading')).toHaveTextContent('What are equivalent fractions?');
    expect(screen.getByRole('button', { name: /^Good/ })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /Show answer/ }));
    expect(screen.getByRole('button', { name: /^Good/ })).toBeEnabled();
    expect(screen.getByText('Fractions that look different but name the same amount.')).toBeInTheDocument();
  });

  it('records a rating, schedules the card and advances', async () => {
    const user = userEvent.setup();
    renderDeck();

    await user.click(screen.getByRole('button', { name: /Show answer/ }));
    await user.click(screen.getByRole('button', { name: /^Good/ }));

    const progress = useProgressStore.getState().cards['fractions-equivalent-001'];
    expect(progress?.intervalDays).toBe(3);
    expect(progress?.timesCorrect).toBe(1);
    expect(screen.getByRole('status')).toHaveTextContent(/Next review in 3 days/);
    expect(within(screen.getByRole('region', { name: 'Question' })).getByRole('heading')).toHaveTextContent(/Why does multiplying/);
  });

  it('supports keyboard: space to flip, number keys to rate', async () => {
    const user = userEvent.setup();
    renderDeck();

    await user.keyboard(' ');
    await user.keyboard('1');
    expect(useProgressStore.getState().cards['fractions-equivalent-001']?.timesWrong).toBe(1);
  });

  it('brings missed cards back later in the session and summarizes at the end', async () => {
    const user = userEvent.setup();
    renderDeck(cards.slice(0, 2));

    await user.keyboard(' 1'); // miss card 1 → re-queued
    await user.keyboard(' 3'); // card 2
    expect(within(screen.getByRole('region', { name: 'Question' })).getByRole('heading')).toHaveTextContent('What are equivalent fractions?');
    await user.keyboard(' 3'); // card 1 again

    expect(screen.getByText('Session complete!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Practice the 1 I missed/ })).toBeInTheDocument();
  });

  it('bookmarks the current card', async () => {
    const user = userEvent.setup();
    renderDeck();
    await user.click(screen.getByRole('button', { name: /Save/ }));
    expect(useProgressStore.getState().bookmarks['fractions-equivalent-001']).toBe(true);
  });

  it('shows hints and step-by-step solutions on solve cards', async () => {
    const user = userEvent.setup();
    renderDeck([curriculum.card('fractions-equivalent-008')!]);

    await user.click(screen.getByRole('button', { name: /Need a hint/ }));
    expect(screen.getByText(/What do you multiply 3 by to get 6/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Show answer/ }));
    await user.click(screen.getByRole('button', { name: /Show steps/ }));
    expect(within(screen.getByRole('list', { name: 'Steps' })).getAllByRole('listitem')).toHaveLength(3);
  });
});
