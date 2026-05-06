# Fleet health check

A facilities team runs digital signage across forty locations. Devices occasionally drop offline due to network blips, power cycles, or the rare hardware failure. Catching a stale device early matters because a frozen screen during business hours is visible to customers.

Instead of opening the dashboard and scanning device-status columns, an operator asks Claude every Monday morning:

> "Show me every device that hasn't checked in for more than 24 hours, grouped by location, and flag any group where more than 10% of devices are offline."

Expected tool calls:

1. `get_devices` — pull the full device list with last-check-in timestamps and group assignments

The filtering and aggregation happen client-side inside Claude. The MCP server returns the raw device list once; the assistant applies the time threshold, groups by location, and computes the per-group offline percentage. The output is a short table the operator can act on immediately.

This pattern applies to any list-and-filter query: stale schedules, presentations not assigned anywhere, device groups with zero members. One `get_*` call, one summarization, one decision.
