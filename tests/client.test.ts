import { test } from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/auth.ts";

test("loadConfig returns config when CASTHUB_API_KEY is set", () => {
  const cfg = loadConfig({ CASTHUB_API_KEY: "test-key" });
  assert.equal(cfg.apiKey, "test-key");
  assert.equal(cfg.mcpUrl, "https://api.cast-hub.com/mcp");
});

test("loadConfig honors CASTHUB_MCP_URL override", () => {
  const cfg = loadConfig({
    CASTHUB_API_KEY: "test-key",
    CASTHUB_MCP_URL: "https://staging.example.com/mcp/",
  });
  assert.equal(cfg.mcpUrl, "https://staging.example.com/mcp");
});

test("loadConfig trims whitespace on both env vars", () => {
  const cfg = loadConfig({
    CASTHUB_API_KEY: "  spaced-key  ",
    CASTHUB_MCP_URL: "  https://x.example.com  ",
  });
  assert.equal(cfg.apiKey, "spaced-key");
  assert.equal(cfg.mcpUrl, "https://x.example.com");
});

test("loadConfig exits process with code 1 when API key missing", async () => {
  const { spawn } = await import("node:child_process");
  const child = spawn(
    process.execPath,
    [
      "--import",
      "tsx",
      "--eval",
      "import('../src/auth.ts').then(m => m.loadConfig({}))",
    ],
    { cwd: import.meta.dirname, env: { ...process.env, CASTHUB_API_KEY: "" } },
  );
  let stderr = "";
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });
  const code: number = await new Promise((resolve) => {
    child.on("exit", (c) => resolve(c ?? -1));
  });
  assert.equal(code, 1);
  assert.match(stderr, /CASTHUB_API_KEY/);
  assert.match(stderr, /dashboard\.cast-hub\.com/);
});
