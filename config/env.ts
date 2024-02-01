import { load } from "https://deno.land/std@0.212.0/dotenv/mod.ts";

const localEnv = await load();

export function envGet<T extends Record<string, string>>(config: T) {
  const env = {} as Record<keyof T, string>;
  for (const key in config) {
    env[key] = read(config[key]);
  }
  return env;
}

function read(key: string) {
  const value = Deno.env.get(key) || localEnv[key];
  if (!value) throw new Error(`define the env variable ${key}`);
  return value;
}
