interface Cache {
  time: number;
  data: string;
}

let DEFAULT_CACHE_EXPIRY_MS = 1000 * 60 * 60 * 24 * 365 / 12;
let db: Deno.Kv | undefined;

export function configCache(cacheKv: Deno.Kv, expiryMs: number) {
  db = cacheKv;
  DEFAULT_CACHE_EXPIRY_MS = expiryMs;
}

function getKvPath(namespace: string) {
  return ["__cache__", namespace];
}

export async function cacheProxy<T>(
  namespace: string,
  fallback: () => Promise<T>,
  expireMs: number = DEFAULT_CACHE_EXPIRY_MS,
) {
  if (!db) {
    throw new Error("You must call configCache before using cacheProxy");
  }
  const lastEntry = await db.get<Cache>(getKvPath(namespace));
  if (typeof lastEntry.value?.data !== "undefined") {
    if (Date.now() - lastEntry.value.time > expireMs) {
      await db.delete(getKvPath(namespace));
    } else {
      return JSON.parse(lastEntry.value.data) as T;
    }
  }

  const actualResults = await fallback();

  try {
    await db.set(getKvPath(namespace), {
      time: Date.now(),
      data: JSON.stringify(actualResults),
    });
  } catch (error) {
    console.error("Error setting cache", error)
  }

  return actualResults;
}
