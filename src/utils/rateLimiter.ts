export interface RateLimitState {
  attempts: number;
  lockedUntil: number | null;
  lastAttempt: number;
}

const ATTEMPTS_MAP = new Map<string, RateLimitState>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 60 * 1000; // 60 seconds lockout

export function checkRateLimit(key: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const state = ATTEMPTS_MAP.get(key);

  if (!state) {
    return { allowed: true };
  }

  // Check if currently locked
  if (state.lockedUntil && now < state.lockedUntil) {
    const remainingSeconds = Math.ceil((state.lockedUntil - now) / 1000);
    return { allowed: false, waitSeconds: remainingSeconds };
  }

  // If lockout window passed, reset
  if (now - state.lastAttempt > LOCKOUT_WINDOW_MS) {
    ATTEMPTS_MAP.delete(key);
    return { allowed: true };
  }

  if (state.attempts >= MAX_ATTEMPTS) {
    state.lockedUntil = now + LOCKOUT_WINDOW_MS;
    return { allowed: false, waitSeconds: 60 };
  }

  return { allowed: true };
}

export function recordFailedAttempt(key: string): { locked: boolean; remainingAttempts: number; waitSeconds?: number } {
  const now = Date.now();
  const state = ATTEMPTS_MAP.get(key) || { attempts: 0, lockedUntil: null, lastAttempt: now };

  state.attempts += 1;
  state.lastAttempt = now;

  if (state.attempts >= MAX_ATTEMPTS) {
    state.lockedUntil = now + LOCKOUT_WINDOW_MS;
    ATTEMPTS_MAP.set(key, state);
    return { locked: true, remainingAttempts: 0, waitSeconds: 60 };
  }

  ATTEMPTS_MAP.set(key, state);
  return { locked: false, remainingAttempts: MAX_ATTEMPTS - state.attempts };
}

export function resetRateLimit(key: string) {
  ATTEMPTS_MAP.delete(key);
}
