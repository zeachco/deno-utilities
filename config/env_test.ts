import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.213.0/assert/mod.ts";
import { envGet } from "./env.ts";

Deno.test(function validateEnvTest() {
  const env = envGet({ test: "ENV_TEST" });
  assertEquals(env.test, "env_value_test");
  assertThrows(() => envGet({ notFound: "ENV_TEST_NOT_FOUND" }));
});
