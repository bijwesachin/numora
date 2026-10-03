// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import middleware, { passwordMatches } from './middleware';

const basic = (user: string, password: string) => `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`;
const request = (path = '/', authorization?: string) =>
  new Request(`https://numora.example${path}`, authorization ? { headers: { authorization } } : undefined);

describe('passwordMatches', () => {
  it('accepts the right password with any username', () => {
    expect(passwordMatches(basic('anyone', 'sunny-day-42'), 'sunny-day-42')).toBe(true);
    expect(passwordMatches(basic('', 'sunny-day-42'), 'sunny-day-42')).toBe(true);
  });

  it('rejects wrong, empty and malformed credentials', () => {
    expect(passwordMatches(basic('a', 'wrong'), 'sunny-day-42')).toBe(false);
    expect(passwordMatches(basic('a', ''), 'sunny-day-42')).toBe(false);
    expect(passwordMatches(null, 'sunny-day-42')).toBe(false);
    expect(passwordMatches('Bearer sunny-day-42', 'sunny-day-42')).toBe(false);
    expect(passwordMatches(`Basic ${Buffer.from('no-colon').toString('base64')}`, 'sunny-day-42')).toBe(false);
  });

  it('handles passwords containing colons and non-ASCII characters', () => {
    expect(passwordMatches(basic('u', 'a:b:c'), 'a:b:c')).toBe(true);
    expect(passwordMatches(basic('u', 'pässwörd-✓'), 'pässwörd-✓')).toBe(true);
  });

  it('is not fooled by a password that merely starts with the right one', () => {
    expect(passwordMatches(basic('u', 'sunny-day-42-extra'), 'sunny-day-42')).toBe(false);
    expect(passwordMatches(basic('u', 'sunny'), 'sunny-day-42')).toBe(false);
  });
});

describe('middleware', () => {
  const original = process.env.APP_PASSWORD;
  beforeEach(() => {
    process.env.APP_PASSWORD = 'sunny-day-42';
  });
  afterEach(() => {
    if (original === undefined) delete process.env.APP_PASSWORD;
    else process.env.APP_PASSWORD = original;
  });

  it('asks for a password when none is supplied', () => {
    const response = middleware(request('/'));
    expect(response.status).toBe(401);
    expect(response.headers.get('www-authenticate')).toMatch(/^Basic realm="Numora"/);
    expect(response.headers.get('x-robots-tag')).toContain('noindex');
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('protects every path, including the app bundle and deep links', () => {
    for (const path of ['/assets/index-abc123.js', '/concepts/fm-gcf/study', '/favicon.svg', '/_headers']) {
      expect(middleware(request(path)).status, path).toBe(401);
    }
  });

  it('refuses a wrong password', () => {
    expect(middleware(request('/', basic('u', 'nope'))).status).toBe(401);
  });

  it('lets a correct password through', () => {
    const response = middleware(request('/', basic('u', 'sunny-day-42')));
    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(503);
  });

  it('leaves robots.txt readable without a password', () => {
    expect(middleware(request('/robots.txt')).status).not.toBe(401);
  });

  it('fails closed when APP_PASSWORD is not set — even for an empty password', () => {
    delete process.env.APP_PASSWORD;
    expect(middleware(request('/')).status).toBe(503);
    expect(middleware(request('/', basic('u', ''))).status).toBe(503);
    process.env.APP_PASSWORD = '';
    expect(middleware(request('/', basic('u', ''))).status).toBe(503);
  });
});
