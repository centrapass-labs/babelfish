import { createInstance } from "../entities/EntityHandler";

export interface Context {
  instance: ReturnType<typeof createInstance>;
}

export function createContext(): Context {
  const instance = createInstance();
  return { instance };
}
