import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const appUrl = new URL("../src/App.jsx", import.meta.url);
const pageUrl = new URL("../src/pages/NotFoundPage.jsx", import.meta.url);

test("app registers an explicit catch-all 404 route", async () => {
  const app = await readFile(appUrl, "utf8");
  assert.match(app, /import NotFoundPage/);
  assert.match(app, /<Route path="\*" element=\{<NotFoundPage \/>\}/);
});

test("not-found page provides back and home actions", async () => {
  const page = await readFile(pageUrl, "utf8");
  assert.match(page, /Page not found/);
  assert.match(page, /navigate\(-1\)/);
  assert.match(page, /navigate\(["']\/["']/);
});
