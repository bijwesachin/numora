import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="grid place-items-center gap-4 py-16 text-center">
      <p className="text-5xl" aria-hidden="true">
        🧭
      </p>
      <h1 className="text-2xl font-semibold">We couldn’t find that page.</h1>
      <Link to="/" className="rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700">
        Go home
      </Link>
    </div>
  );
}
