import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { CastHubConfig } from "./auth.js";

// NOTE: webapi.cast-hub.com/mcp is the live hosted endpoint.
// The hosted endpoint is the source of truth for tool definitions and execution.
// This module is a transport shim only.

const CLIENT_NAME = "casthub-mcp-proxy";
const CLIENT_VERSION = "0.1.0";

export interface RemoteClient {
  client: Client;
  close: () => Promise<void>;
}

export async function connectRemote(config: CastHubConfig): Promise<RemoteClient> {
  const transport = new StreamableHTTPClientTransport(new URL(config.mcpUrl), {
    requestInit: {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "User-Agent": `${CLIENT_NAME}/${CLIENT_VERSION}`,
      },
    },
  });

  const client = new Client(
    { name: CLIENT_NAME, version: CLIENT_VERSION },
    { capabilities: {} },
  );

  try {
    await client.connect(transport);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Failed to connect to CastHub hosted endpoint at ${config.mcpUrl}: ${msg}`,
    );
  }

  return {
    client,
    close: async () => {
      try {
        await client.close();
      } catch {
        // ignore — close best-effort
      }
    },
  };
}
