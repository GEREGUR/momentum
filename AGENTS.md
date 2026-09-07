# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Stack

- React Native + Expo
- XState (client state machines)
- Effect.ts (business logic, sync layer, backend services)
- Expo SQLite (local persistence)
- Expo Router (navigation)
- React Hook Form + Zod (forms/validation)
- Reanimated + Gesture Handler (animations)
- TanStack Query (server state)

# Rules

- Never use Zustand — use XState for state machines
- Use Effect.ts for all business logic and sync operations
- Keep UI layer pure — no direct DB/HTTP calls from components
- Use Effect.ts Services and Layers for dependency injection
- All errors must be typed (Effect.ts Error channel)
