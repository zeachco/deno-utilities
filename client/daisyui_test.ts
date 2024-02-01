import { assertEquals } from "https://deno.land/std@0.213.0/assert/mod.ts";
import { addComponentClass } from "./daisyui.ts";


Deno.test(function addComponentClassTest() {
  const classes = 'p-2 px-4';
  assertEquals(addComponentClass(classes, "btn", "primary"), "p-2 px-4 btn btn-primary");
  assertEquals(addComponentClass(classes, "btn"), "p-2 px-4 btn");
});
