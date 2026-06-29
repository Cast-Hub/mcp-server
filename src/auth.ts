const DASHBOARD_URL = "https://dashboard.cast-hub.com";

export interface CastHubConfig {
  apiKey: string;
  mcpUrl: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): CastHubConfig {
  const apiKey = env.CASTHUB_API_KEY?.trim();

  if (!apiKey) {
    process.stderr.write(
      [
        "",
        "CastHub MCP: CASTHUB_API_KEY environment variable is required.",
        "",
        `Generate a token at ${DASHBOARD_URL} and pass it via your MCP client config:`,
        "",
        '  "env": { "CASTHUB_API_KEY": "your-api-key-here" }',
        "",
      ].join("\n"),
    );
    process.exit(1);
  }

  const mcpUrl = (env.CASTHUB_MCP_URL?.trim() || "https://webapi.cast-hub.com/mcp").replace(
    /\/+$/,
    "",
  );

  return { apiKey, mcpUrl };
}
