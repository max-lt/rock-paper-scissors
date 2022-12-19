import { Guess, IGameState } from '~/interfaces';

export type InternalGameState = IGameState & { nonce: string; computerGuess: Guess };

function tryParse<T>(value: string): T | null {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
}

export function setItem<T>(store: KVNamespace, key: string, value: T) {
  return store.put(key, JSON.stringify(value));
}

export async function getItem<T>(store: KVNamespace, key: string): Promise<T | null> {
  const value = await store.get(key);
  return value ? tryParse<T>(value) : null;
}
