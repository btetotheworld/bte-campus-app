# Design register

Every design gets a ref before it gets built. A PR implementing a design names the ref. No ref, no merge.

When a design changes, the ref stays and the version increments. Never silently replace.

Status is one of: `draft`, `approved`, `built`, `superseded`. Approval is the founder's.

| Ref     | What                 | Status  | Link                      | Built in |
| ------- | -------------------- | ------- | ------------------------- | -------- |
| `D-001` | Component vocabulary | `draft` | [handoff](handoff/D-001/) |          |
| `D-002` | List archetype       |         |                           |          |
| `D-003` | Record archetype     |         |                           |          |
| `D-004` | Form archetype       |         |                           |          |
| `D-005` | Dashboard archetype  |         |                           |          |
| `D-010` | Meeting report form  |         |                           | `M2`     |
