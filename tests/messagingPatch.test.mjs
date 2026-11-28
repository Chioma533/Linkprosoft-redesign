import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const socketUrl = new URL("../src/utils/socketManager.js", import.meta.url);
const hookUrl = new URL("../src/hooks/useMessaging.js", import.meta.url);
const storeUrl = new URL("../src/store/messagingStore.js", import.meta.url);
const pagesUrl = new URL("../src/pages/MessagesPage.jsx", import.meta.url);

test("messaging socket connects for cookie-authenticated sessions", async () => {
  const socket = await readFile(socketUrl, "utf8");
  const hook = await readFile(hookUrl, "utf8");
  assert.doesNotMatch(socket, /if\s*\(!token\)\s*return null/);
  assert.match(socket, /auth:\s*token\s*\?\s*\{\s*token\s*\}\s*:\s*\{\}/);
  assert.doesNotMatch(hook, /token\s*\|\|/);
  assert.ok(hook.includes("if (!user?.id)"));
});

test("messaging loads send read accept decline and attachment actions", async () => {
  const store = await readFile(storeUrl, "utf8");
  const page = await readFile(pagesUrl, "utf8");
  assert.match(store, /SOCKET_EVENTS\.READ_MESSAGE/);
  assert.match(store, /deleteAttachment:/);
  assert.match(store, /respondToMessageRequest:/);
  assert.match(store, /handleRequestAccepted:/);
  assert.match(store, /handleRequestDeclined:/);
  assert.ok(page.includes("loadMessages(activeThreadId, 1, currentUser?.id)"));
});
