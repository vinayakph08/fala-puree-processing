---
description: "Fetch and describe a screen design from Google Stitch. Use this before building a new page or feature to get the UI spec. Invoke with the feature or screen name."
agent: agent
---

Fetch the design for the **{{feature}}** screen from Google Stitch and describe it clearly so it can be used as a UI specification for implementation.

## Steps

1. Use the available Stitch MCP tools to list projects and find the relevant project for the Fala farmer app.
2. Find the screen matching "{{feature}}" (or the closest match).
3. Fetch the full screen details.
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

5. After outputting the spec, ask the user: **"Should I use this spec to build the feature now?"**

If yes, the user can invoke the `new-feature` skill to proceed with implementation using this spec as the UI guide.
