---
name: expo
description: Expo SDK, routing, modules, and build configuration for React Native apps.
---

# Expo

This skill covers Expo SDK usage, Expo Router, and build configuration.

## When to Use

Use this skill when:
- Working with Expo Router (file-based routing)
- Using Expo modules (SQLite, SecureStore, Fonts, etc.)
- Configuring app.json/app.config.js
- Building with EAS (Expo Application Services)
- Debugging Expo-specific issues

## Core Principles

### 1. Expo Router (File-Based Routing)
- Use file-system routing in `app/` directory
- Use `_layout.tsx` for nested layouts
- Use `[param].tsx` for dynamic routes
- Use `+not-found.tsx` for 404 pages

```
app/
├── _layout.tsx           # Root layout
├── index.tsx             # Home screen (/)
├── (tabs)/
│   ├── _layout.tsx       # Tab layout
│   ├── index.tsx         # Tab 1 (/)
│   └── explore.tsx       # Tab 2 (/explore)
├── modal.tsx             # Modal route (/modal)
└── [id].tsx              # Dynamic route (/:id)
```

### 2. Expo Modules
- Use `expo-sqlite` for local persistence
- Use `expo-secure-store` for sensitive data
- Use `expo-font` for custom fonts
- Use `expo-splash-screen` for splash screen

### 3. Configuration (app.json)
```json
{
  "expo": {
    "name": "Momentum",
    "slug": "momentum",
    "version": "1.0.0",
    "scheme": "momentum",
    "platforms": ["ios", "android", "web"],
    "plugins": ["expo-router", "expo-font"],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### 4. Build & Development
- Use `expo start` for development
- Use EAS Build for production builds
- Use `expo prebuild` for native code generation
- Test on physical devices early

## Common Patterns

### Deep Linking
```json
{
  "expo": {
    "scheme": "myapp",
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": { "scheme": "myapp", "host": "*" }
        }
      ]
    }
  }
}
```

### Expo SQLite Usage
```tsx
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('mydb');

// Use Effect.ts wrapper for safe DB access
const executeQuery = Effect.gen(function* () {
  const result = yield* Effect.tryPromise({
    try: () => db.getAllAsync('SELECT * FROM users'),
    catch: (error) => new DatabaseError({ cause: error }),
  });
  return result;
});
```

## Anti-Patterns

- ❌ Using React Navigation directly (prefer Expo Router)
- ❌ Hardcoded colors (use design tokens)
- ❌ Skipping EAS Build for production
- ❌ Not testing on both iOS and Android
- ❌ Direct native module access without Expo wrappers

## Version Pinning

This project uses Expo SDK 57. Always check version compatibility when adding new Expo modules.
