---
name: fsd-architecture
description: Feature-Sliced Design architecture for scalable, maintainable React Native applications.
---

# Feature-Sliced Design (FSD)

This skill provides architectural patterns using Feature-Sliced Design for organizing code in React Native apps.

## When to Use

Use this skill when:
- Organizing code into features, entities, and shared layers
- Creating new features or screens
- Refactoring existing code structure
- Implementing business logic separation

## Core Principles

### 1. Layer Structure
```
src/
├── app/              # App-level setup (providers, styles, global configs)
├── pages/            # Route-based components (screens)
├── widgets/          # Composite UI blocks (header, footer)
├── features/         # User interactions (login, search)
├── entities/         # Business entities (User, Post)
└── shared/           # Shared utilities, UI kit, API clients
```

### 2. Import Rules
- Lower layers import from higher layers only
- `shared` → `entities` → `features` → `widgets` → `pages` → `app`
- Never import upward (e.g., `shared` cannot import from `features`)

### 3. Feature Structure
```
src/features/auth/
├── ui/              # UI components
│   ├── LoginForm.tsx
│   └── index.ts
├── model/           # Business logic, state machines
│   ├── auth-machine.ts
│   └── index.ts
├── api/             # API calls, Effect services
│   ├── login.ts
│   └── index.ts
└── index.ts         # Public API exports
```

### 4. Entity Structure
```
src/entities/user/
├── ui/              # User-related UI components
│   ├── UserAvatar.tsx
│   └── index.ts
├── model/           # User types, validation
│   ├── user.ts
│   └── index.ts
├── api/             # User API endpoints
│   ├── get-user.ts
│   └── index.ts
└── index.ts
```

## Common Patterns

### Page Component
```tsx
// src/pages/home/ui/home-page.tsx
import { WelcomeWidget } from '@/widgets/welcome';
import { AuthFeature } from '@/features/auth';

export function HomePage() {
  return (
    <View>
      <WelcomeWidget />
      <AuthFeature />
    </View>
  );
}
```

### Feature with XState
```tsx
// src/features/auth/model/auth-machine.ts
import { createMachine } from 'xstate';

export const authMachine = createMachine({
  id: 'auth',
  initial: 'idle',
  states: {
    idle: {
      on: { LOGIN: 'loading' },
    },
    loading: {
      on: { SUCCESS: 'authenticated', ERROR: 'error' },
    },
    authenticated: {},
    error: {
      on: { RETRY: 'loading' },
    },
  },
});
```

### Entity API with Effect.ts
```tsx
// src/entities/user/api/get-user.ts
import { Effect } from 'effect';
import { ApiClient } from '@/shared/api/client';

export const getUser = (id: string) =>
  Effect.gen(function* () {
    const client = yield* ApiClient;
    return yield* client.get(`/users/${id}`);
  });
```

## Anti-Patterns

- ❌ Importing from lower layers (shared importing from features)
- ❌ Business logic in UI components
- ❌ API calls in UI components
- ❌ Skipping layers (e.g., pages importing from shared.api)
- ❌ Circular dependencies between features

## Benefits

- Scalable architecture
- Clear separation of concerns
- Easy to test and refactor
- Team collaboration friendly
- Predictable code organization
