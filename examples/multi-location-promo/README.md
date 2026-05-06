# Multi-location flash sale

A regional retail manager has a 24-hour flash sale starting Friday at 9 AM. They have a finished promotional asset in CastHub but it isn't scheduled yet. The standard approach is to open each store's device group, assign the presentation, and configure the schedule. With twelve stores in the region, that is twelve repetitions of the same five-click flow.

Instead they prompt Claude:

> "Roll out the Friday flash-sale presentation to the Northeast retail group, scheduled for Friday 9 AM through Saturday 9 AM, and send me a summary of which screens it landed on."

Expected tool calls:

1. `get_presentations` — find the "Friday Flash Sale" asset
2. `assign_presentation` — bind it to the Northeast retail device group
3. `assign_schedule` — apply the 24-hour weekly schedule to that group
4. `get_devices` — pull the device list under the group for the summary report

The governance preview surfaces exactly which twelve stores and how many physical screens are affected before any change commits. The manager confirms once and the rollout completes in seconds rather than the typical hour of dashboard clicks.
