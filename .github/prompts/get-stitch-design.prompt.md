---
description: "Fetch and describe a single screen design from Google Stitch. Use this before building each screen — one screen at a time. Invoke with the exact screen name."
agent: agent
---

Fetch the design for **one specific screen** — the **{{feature}}** screen — from Google Stitch. Do not fetch, describe, or build any other screens.

## Rules

- **One screen per invocation.** If you find multiple matching screens, ask the user to confirm which exact one before proceeding.
- **Do not start building.** This prompt is for spec extraction only. Building happens separately after user confirmation.
- **Do not suggest building adjacent screens** even if you can see them in the project.

## Steps

1. Use the available Stitch MCP tools to list projects and find the relevant project for the Fala farmer app.
2. Find the **single screen** matching "{{feature}}" (or the closest match). If multiple screens match, list them and ask the user to pick one.
3. Fetch the full details of that one screen only.
4. Output a structured UI specification:

### Output Format

```
## Screen: [Screen Name]

### Layout
[Describe the overall layout — top-to-bottom structure, key sections]

### Components
[List each UI component visible on screen with its type and purpose]
- ComponentType: description

### Data Displayed
[What data fields are shown on this screen]

### User Actions
[What can the user do — buttons, forms, navigation]

### Design Notes
[Colors, spacing patterns, mobile vs desktop differences, any Kannada text visible]
```

5. After outputting the spec, ask the user:

   > **"Please paste a screenshot of this screen from Stitch (open it in your browser and screenshot it). This lets me match the visual design exactly. Once you share it, I'll use the screenshot + spec together to build this screen accurately."**

   Wait for the user to paste the screenshot. Once received, confirm it matches the screen described.

6. Only after the screenshot is provided (or user explicitly skips), ask: **"Should I build this screen now?"**

   If yes, build **only this screen's components**. Reference the screenshot continuously while building — verify layout, spacing, colors, and component shapes match before finishing. Do not build other screens.

