import { load } from "https://deno.land/std@0.212.0/dotenv/mod.ts";

const localEnv = await load();

export function envGet(config: Record<string, string>) {
  const env: Record<string, string> = {};
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
