# CastHub MCP Server

> Model Context Protocol server for digital signage. Manage TV fleets, presentations, schedules, and emergency alerts from Claude, ChatGPT, Microsoft Copilot, Google Gemini, Cursor, or any MCP-compatible client.

[![npm version](https://img.shields.io/npm/v/@cast-hub/mcp.svg)](https://www.npmjs.com/package/@cast-hub/mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

![CastHub MCP demo](./docs/demo.gif)

<!-- TODO: replace placeholder demo.gif with a real recording -->

## What this is

CastHub MCP Server lets AI assistants directly control digital signage networks. Instead of clicking through a dashboard, you tell your assistant to update the lobby TV, push an emergency alert to all stores, or schedule next week's promotional content. The server exposes approximately 45 tools across devices, presentations, schedules, alerts, groups, and device commands, so the whole CastHub platform is reachable in natural language.

## Why this exists

Digital signage management is repetitive, multi-step work that maps cleanly to natural language. Several signage platforms (Fugo, Revel Digital, Screenly) have shipped MCP support over the last year. CastHub differentiates in four ways. You connect to a hosted endpoint that uses OAuth 2.0 with PKCE and dynamic client registration, so you never paste an API key or run a local process for the standard path. Every tool ships with annotations (ReadOnly, Destructive, Idempotent) that drive proper confirmation prompts in each AI client before a disruptive action runs. Pricing is flat-rate with unlimited screens on the Pro plan rather than per-screen. And CastHub is an approved CMS partner on the Amazon Signage Stick.

## Connect from any AI assistant

The CastHub MCP server is hosted at `https://webapi.cast-hub.com/mcp`. Authentication uses OAuth 2.0 with PKCE and dynamic client registration, so you sign in once through your AI assistant and approve access. No API keys, no local install required for the standard path.

Connection instructions for each client are in the CastHub docs:

- Connect Claude (web, Desktop, mobile)
- Connect ChatGPT
- Connect Microsoft Copilot (Copilot Studio and GitHub Copilot in VS Code)
- Connect Google Gemini (Gemini Enterprise and Gemini CLI)
- Connect Cursor
- CastHub CLI for shell automation and CI

Full setup is at https://cast-hub.com/mcp.

### Local install for stdio-only clients

For MCP clients that can only launch a local stdio process, install the SDK and point it at the hosted endpoint:

```bash
npm install -g @cast-hub/mcp
```

```json
{
  "mcpServers": {
    "casthub": {
      "command": "casthub-mcp",
      "env": {
        "CASTHUB_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

The SDK is a transport shim. All tool execution happens server-side at `https://webapi.cast-hub.com/mcp`.

## Available tools

The server exposes approximately 45 tools across Devices, Device groups, Presentations, Schedules, Alerts, Device commands, and Account and dashboard. The authoritative tool list comes from calling `tools/list` against the live MCP server, which is the source of truth and may have grown since this README was last updated.

The tables below reflect the tool set as of the last README update. The live server is authoritative; tool inventory may have grown since.

### Devices

| Tool name | Description |
|---|---|
| get_devices | List all devices grouped by device group |
| update_device | Update a device's name |
| delete_device | Delete a device by ID |
| change_device_group | Move a device to a different group |
| issue_device_command | Send a remote command to an Amazon Signage Stick |
| get_device_commands | List recent remote commands and their status |
| create_device_command_schedule | Create a recurring command plan for a device group |
| get_device_command_schedules | List command plans for a device group |
| toggle_device_command_schedule | Enable or disable a command plan |
| delete_device_command_schedule | Delete a command plan |

### Device groups

| Tool name | Description |
|---|---|
| create_device_group | Create a new device group |
| update_device_group | Update a device group's title |
| delete_device_group | Delete a device group |

### Presentations

| Tool name | Description |
|---|---|
| get_presentations | List all presentations |
| get_presentation | Get a specific presentation with all slides |
| create_presentation | Create a new presentation |
| create_presentation_with_content | Create a presentation with slides in one step |
| update_presentation | Update presentation properties |
| delete_presentation | Delete a presentation |
| assign_presentation | Assign a presentation to a specific device group |
| assign_presentation_to_default | Assign a presentation to the default group |
| register_slide_image_upload | Step 1 of 3 for uploading an image slide |
| acknowledge_slide_image_upload | Step 3 of 3 for uploading an image slide |
| register_slide_video_upload | Step 1 of 3 for uploading a video slide |
| acknowledge_slide_video_upload | Step 3 of 3 for uploading a video slide |

### Schedules

| Tool name | Description |
|---|---|
| get_schedules | List all schedules |
| get_linear_schedule | Get a Simple Schedule with all time entries |
| get_weekly_schedule | Get a Weekly Schedule with all time slots |
| assign_schedule | Assign a schedule to a device group |
| remove_schedule | Remove the schedule from a device group |
| delete_schedule | Delete a schedule |

### Alerts

| Tool name | Description |
|---|---|
| assign_alert_presentation | Set the alert presentation for a specific device group |
| assign_alert_presentation_to_default | Set the alert presentation for the default group |
| remove_alert_presentation | Remove the alert presentation from a group |
| start_all_alerts | Start alerts on all device groups |
| start_group_alert | Start an alert on a specific group |
| start_text_alert | Start a text alert on all device groups |
| start_text_alert_for_group | Start a text alert on a specific group |
| stop_all_alerts | Stop alerts on all groups |
| stop_group_alert | Stop an alert on a specific group |

### Account and dashboard

| Tool name | Description |
|---|---|
| who_am_i | Check current login status |
| get_user_info | Get user profile and subscription details |
| get_dashboard | Get a comprehensive dashboard overview |
| get_current_utc_time | Returns the current UTC timestamp |

## How CastHub MCP compares

| Capability | CastHub MCP | Screenly MCP | Revel Digital MCP | Fugo MCP |
|---|---|---|---|---|
| MCP server available | Yes | Yes | Yes | Yes |
| Hosted endpoint (no local CLI install) | Yes | No (CLI-based) | Yes | Yes |
| OAuth 2.0 with PKCE and dynamic client registration | Yes | Unknown | Unknown | Unknown |
| Per-tool annotations for confirmation prompts (ReadOnly, Destructive, Idempotent) | Yes | Unknown | Unknown | Unknown |
| Amazon Signage Stick native support | Yes | No | Partial | No |
| Flat-rate pricing | Yes | Per-screen | Per-screen | Per-screen |
| Open-source player option | Roadmap | Yes (Pi via Anthias) | No | No |

## Example usage

### Update content for a specific group of screens

Prompt: `"Push the new winter sale presentation to all 12 store screens for next week"`

Tools called: `get_presentations`, `assign_presentation`, `assign_schedule`

### Trigger an emergency alert

Prompt: `"Start a fire drill alert across the warehouse group right now"`

Tools called: `start_text_alert_for_group`

### Audit fleet health

Prompt: `"Show me all devices that have not checked in for over 24 hours"`

Tools called: `get_devices` (filtered client-side)

### Roll out content from Microsoft Copilot or Gemini

Prompt: `"Schedule the new menu board presentation across the downtown cafe group for tomorrow morning"`

Tools called: `get_presentations`, `assign_presentation`, `assign_schedule`

More walkthroughs in [`examples/`](./examples).

## Documentation

- [CastHub MCP docs](https://cast-hub.com/mcp)
- [CastHub Dashboard](https://dashboard.cast-hub.com)
- [CastHub pricing](https://cast-hub.com/digital-signage-pricing/)
- [Signup](https://dashboard.cast-hub.com/register-user)

## License

MIT. See [LICENSE](LICENSE).

## Contributing

Issues and pull requests welcome at [github.com/Cast-Hub/mcp-server/issues](https://github.com/Cast-Hub/mcp-server/issues). For commercial questions or partnership inquiries, contact [info@cast-hub.com](mailto:info@cast-hub.com). For customer support questions, contact [support@cast-hub.com](mailto:support@cast-hub.com).
