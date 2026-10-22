import test from "node:test";
import assert from "node:assert";
import { readSource } from "../helpers/readSource.js";

// --- #494: restored multi-tab summary leaves suggested-prompts spinner stuck ---
//
// Multi-tab saves promptsCacheKey: null (service-worker.js). On restore the
// popup used to pass that null into startSuggestedQuestionsBg, so
// currentPromptsCacheKey stayed null while the worker rebuilt a URL key and
// broadcast suggested-prompts-ready with it. The listener then dropped the
// message and the spinner never cleared.

test("restored summary rebuilds a null promptsCacheKey before suggesting (#494)", () => {
  const appCode = readSource("../../ui/app.js", import.meta.url);

  const restoreBlock = appCode.match(
    /let selPromptsKey = state\.promptsCacheKey;([\s\S]*?)startSuggestedQuestionsBg\(/,
  );
  assert.ok(
    restoreBlock,
    "restore path still assigns selPromptsKey from state.promptsCacheKey",
  );

  assert.match(
    restoreBlock[1],
    /getPromptsCacheKeyForSettings/,
    "null saved key must be rebuilt from the tab URL before listening",
  );
});
