/**
 * Password gate for the whole site (Vercel Routing Middleware).
 *
 * Runs before every request — HTML, JavaScript, images — so the lesson content is protected,
 * not just the page shell. Visitors get the browser's standard sign-in prompt; the username
 * can be anything and the password must equal the APP_PASSWORD environment variable.
 *
 * Fails closed: if APP_PASSWORD isn't set, nobody gets in.
 */
import { createHash, timingSafeEqual } from 'node:crypto';
import { next } from '@vercel/functions';

const REALM = 'Numora';
const NO_INDEX = 'noindex, nofollow, noarchive, nosnippet, noimageindex';

/** Left open so crawlers can read "Disallow: /" instead of treating a 401 as "no rules". */
const OPEN_PATHS = new Set(['/robots.txt']);

const digest = (value: string) => createHash('sha256').update(value).digest();

/** True if an `Authorization: Basic …` header carries the expected password. */
export function passwordMatches(authorization: string | null, expected: string): boolean {
  if (!authorization?.startsWith('Basic ')) return false;
  const decoded = Buffer.from(authorization.slice('Basic '.length).trim(), 'base64').toString('utf8');
  const separator = decoded.indexOf(':');
  if (separator === -1) return false;
  const supplied = decoded.slice(separator + 1);
  // Compare fixed-length hashes in constant time so response timing doesn't leak the password.
  return timingSafeEqual(digest(supplied), digest(expected));
}

function plain(status: number, body: string, headers: Record<string, string> = {}): Response {
  return new Response(body, {
    status,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': NO_INDEX,
      ...headers,
    },
  });
}

export default function middleware(request: Request): Response {
  const { pathname } = new URL(request.url);
  if (OPEN_PATHS.has(pathname)) return next();

  const expected = process.env.APP_PASSWORD;
  if (!expected) {
    return plain(503, 'This site is not configured yet. Set the APP_PASSWORD environment variable and redeploy.');
  }

  if (passwordMatches(request.headers.get('authorization'), expected)) return next();

  return plain(401, 'Password required.', { 'www-authenticate': `Basic realm="${REALM}", charset="UTF-8"` });
}
