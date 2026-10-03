import { createBrowserRouter } from 'react-router-dom';
import { CategoryPage } from '@/pages/CategoryPage';
import { ConceptPage } from '@/pages/ConceptPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { TimesTablesPage } from '@/pages/TimesTablesPage';
import { ConceptStudyPage, DailyReviewPage, PracticePage, SavedPage } from '@/pages/StudyPages';
import { AppShell } from './AppShell';

export const routes = [
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/topics/:categoryId', element: <CategoryPage /> },
      { path: '/concepts/:conceptId', element: <ConceptPage /> },
      { path: '/concepts/:conceptId/study', element: <ConceptStudyPage /> },
      { path: '/review', element: <DailyReviewPage /> },
      { path: '/practice', element: <PracticePage /> },
      { path: '/saved', element: <SavedPage /> },
      { path: '/times-tables', element: <TimesTablesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
