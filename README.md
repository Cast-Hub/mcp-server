# CastHub MCP Server

> Model Context Protocol server for digital signage. Manage TV fleets, presentations, schedules, and emergency alerts from Claude, Cursor, ChatGPT, or any MCP client.

[![npm version](https://img.shields.io/npm/v/@cast-hub/mcp.svg)](https://www.npmjs.com/package/@cast-hub/mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

![CastHub MCP demo](./docs/demo.gif)

<!-- TODO: replace placeholder demo.gif with a real recording -->

## What this is

CastHub MCP Server lets AI assistants directly control digital signage networks. Instead of clicking through a dashboard, you tell Claude to update the lobby TV, push an emergency alert to all stores, or schedule next week's promotional content. The server exposes 30+ tools covering devices, presentations, schedules, alerts, and groups across the CastHub platform.

## Why this exists

Digital signage management is repetitive, multi-step work that maps cleanly to natural language. Several signage platforms (Fugo, Revel Digital, Screenly) have shipped MCP support over the last year. CastHub MCP differentiates on hosted endpoint architecture (no local install required for the basic path), a governance layer with preview-confirm-rollback for safe agent use, and native Amazon Signage Stick integration.

## Two ways to connect

### Option A: Hosted endpoint (recommended)

No installation required. Add the CastHub MCP server to your Claude Desktop, Cursor, or other MCP client config:

```json
{
  "mcpServers": {
    "casthub": {
      "url": "https://mcp.cast-hub.com",
      "auth": {
        "type": "bearer",
        "token": "YOUR_CASTHUB_API_KEY"
      }
    }
  }
}
```

Generate your API key at [dashboard.cast-hub.com](https://dashboard.cast-hub.com/).

### Option B: Install the SDK locally

For MCP clients that require a local stdio process:

```bash
npm install -g @cast-hub/mcp
```

Then configure your client:

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

The SDK forwards MCP protocol calls to the CastHub hosted endpoint. All tool execution happens server-side; the SDK is a transport shim.

## Available Tools (30+)

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

### Account and utility

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
| Governance layer (preview, confirm, rollback) | Yes | No | No | No |
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

More walkthroughs in [`examples/`](./examples).

## Documentation

- [CastHub MCP overview](https://cast-hub.com/mcp)
- [CastHub Dashboard](https://dashboard.cast-hub.com)
- [CastHub pricing](https://cast-hub.com/digital-signage-pricing/)

## License

MIT. See [LICENSE](LICENSE).

## Contributing

Issues and pull requests welcome at [github.com/Cast-Hub/mcp-server/issues](https://github.com/Cast-Hub/mcp-server/issues). For commercial questions or partnership inquiries, contact [info@cast-hub.com](mailto:info@cast-hub.com).
