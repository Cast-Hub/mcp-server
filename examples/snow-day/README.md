# Snow day announcement

A school district administrator wakes up to a 6 AM closure decision. Instead of logging into the dashboard, opening each device group, and pushing a presentation manually, they ask Claude:

> "Push our snow day announcement to every hallway screen across all three campuses, and keep it up until 3 PM."

Expected tool calls:

1. `get_presentations` — locate the existing "Snow Day Closure" presentation
2. `assign_presentation` — assign it to each hallway device group
3. `assign_schedule` — bind a one-day schedule that ends at 15:00 local time

The CastHub governance layer steps in before the assignment commits. The MCP client receives a preview of the change ("3 device groups affected, 47 screens") and waits for the administrator to confirm. If they reply "looks good," the change is applied. If they spot a wrong group, they can say "skip the elementary campus" and the proxy retries with a narrower scope.

Rollback is one prompt away: "undo the snow day push" reverts each affected group to its prior assignment. The administrator never opens a browser.
