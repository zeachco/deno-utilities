export function panic(msg: string, debugInfo = "") {
  if (debugInfo) console.trace(debugInfo);
  throw new Error(msg);
}
