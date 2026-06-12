import * as SecureStore from 'expo-secure-store';

const DEVICE_CODE_URL = 'https://oauth2.googleapis.com/device/code';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const REVOKE_URL = 'https://oauth2.googleapis.com/revoke';
const SESSION_KEY = 'viuwu.youtube.session';
const YOUTUBE_SCOPE = 'https://www.googleapis.com/auth/youtube.readonly';

export interface YouTubeDeviceCode {
  deviceCode: string;
  userCode: string;
  verificationUrl: string;
  expiresAt: number;
  intervalSeconds: number;
}

export interface YouTubeSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

interface OAuthError {
  error?: string;
  error_description?: string;
}

export const youtubeClientId = process.env.EXPO_PUBLIC_YOUTUBE_TV_CLIENT_ID?.trim() ?? '';

function formBody(values: Record<string, string>) {
  return Object.entries(values)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

async function postForm<T>(url: string, values: Record<string, string>): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody(values),
  });
  const payload = (await response.json()) as T & OAuthError;

  if (!response.ok) {
    throw new Error(payload.error_description ?? payload.error ?? 'YouTube authorization failed.');
  }

  return payload;
}

async function saveSession(session: YouTubeSession) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function beginYouTubeConnection(): Promise<YouTubeDeviceCode> {
  if (!youtubeClientId) {
    throw new Error('This build is missing its YouTube TV OAuth client ID.');
  }

  const response = await postForm<{
    device_code: string;
    user_code: string;
    verification_url: string;
    expires_in: number;
    interval?: number;
  }>(DEVICE_CODE_URL, {
    client_id: youtubeClientId,
    scope: YOUTUBE_SCOPE,
  });

  return {
    deviceCode: response.device_code,
    userCode: response.user_code,
    verificationUrl: response.verification_url,
    expiresAt: Date.now() + response.expires_in * 1000,
    intervalSeconds: response.interval ?? 5,
  };
}

export async function pollForYouTubeSession(
  deviceCode: YouTubeDeviceCode,
): Promise<YouTubeSession | null> {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody({
      client_id: youtubeClientId,
      device_code: deviceCode.deviceCode,
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    }),
  });
  const payload = (await response.json()) as Partial<TokenResponse> & OAuthError;

  if (!response.ok) {
    if (payload.error === 'authorization_pending' || payload.error === 'slow_down') {
      return null;
    }
    throw new Error(payload.error_description ?? payload.error ?? 'YouTube authorization failed.');
  }

  const session: YouTubeSession = {
    accessToken: payload.access_token!,
    refreshToken: payload.refresh_token,
    expiresAt: Date.now() + payload.expires_in! * 1000,
  };
  await saveSession(session);
  return session;
}

export async function restoreYouTubeSession(): Promise<YouTubeSession | null> {
  const stored = await SecureStore.getItemAsync(SESSION_KEY);
  if (!stored || !youtubeClientId) return null;

  try {
    const session = JSON.parse(stored) as YouTubeSession;
    if (session.expiresAt > Date.now() + 60_000) return session;
    if (!session.refreshToken) {
      await SecureStore.deleteItemAsync(SESSION_KEY);
      return null;
    }

    const refreshed = await postForm<TokenResponse>(TOKEN_URL, {
      client_id: youtubeClientId,
      refresh_token: session.refreshToken,
      grant_type: 'refresh_token',
    });
    const nextSession: YouTubeSession = {
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token ?? session.refreshToken,
      expiresAt: Date.now() + refreshed.expires_in * 1000,
    };
    await saveSession(nextSession);
    return nextSession;
  } catch {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    return null;
  }
}

export async function disconnectYouTube(session: YouTubeSession) {
  try {
    await fetch(REVOKE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody({ token: session.refreshToken ?? session.accessToken }),
    });
  } finally {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }
}
