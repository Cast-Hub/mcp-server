#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./auth.js";
import { connectRemote } from "./client.js";

const SERVER_NAME = "casthub";
const SERVER_VERSION = "0.1.0";

async function main(): Promise<void> {
  const config = loadConfig();
  const remote = await connectRemote(config);

  const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      capabilities: {
        tools: {},
        prompts: {},
        resources: {},
      },
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return await remote.client.listTools();
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return await remote.client.callTool(request.params);
  });

  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    try {
      return await remote.client.listPrompts();
    } catch {
      return { prompts: [] };
    }
  });

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    return await remote.client.getPrompt(request.params);
  });

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    try {
      return await remote.client.listResources();
    } catch {
      return { resources: [] };
    }
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    return await remote.client.readResource(request.params);
  });

  const cleanup = async (): Promise<void> => {
    await remote.close();
    process.exit(0);
  };
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`CastHub MCP: ${msg}\n`);
  process.exit(1);
});
