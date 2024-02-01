import { panic } from "../debug/error.ts";

export const store = await Deno.openKv();

export let timeToWait = 60 * 1000;
export let db = await Deno.openKv();

export function configTripwire(
  cacheKv: Deno.Kv,
  timeToKeep: number = timeToWait,
) {
  db = cacheKv;
  timeToWait = timeToKeep;
}

function getKvPath(namespace: string) {
  return ["_rate_limit:", namespace];
}

export async function checkTripwire(
  namespace: string,
  doesntRearmAfterTrip = false,
) {
  const lastFail = await db.get(getKvPath(namespace));
  if (typeof lastFail.value === "string") {
    const lastFailTime = parseInt(lastFail.value);
    if (doesntRearmAfterTrip) {
      panic(
        `Rate limit exceeded, locking for ${Math.round(timeToWait / 1000)}s`,
      );
    }
    if (Date.now() - lastFailTime < timeToWait) {
      timeToWait *= 1.5;
      panic(
        `Rate limit exceeded, locking for ${Math.round(timeToWait / 1000)}s`,
      );
    }
  }
}

export async function recordFail(namespace: string) {
  await db.set(getKvPath(namespace), Date.now().toString());
  panic(
    `Too many requests for "${namespace}". Wait before retrying is ${
      Math.round(
        timeToWait / 1000,
      )
    }s`,
  );
}
