---
name: effect-ts
description: Effect.ts for typed business logic, dependency injection, error handling, and async operations.
---

# Effect.ts

This skill covers Effect.ts for building production-ready TypeScript applications with typed errors and dependency injection.

## When to Use

Use this skill when:
- Writing business logic with typed errors
- Implementing dependency injection
- Handling async operations safely
- Creating services and layers
- Working with retries, schedules, and concurrency

## Core Principles

### 1. Effect Type
```tsx
Effect<Success, Error, Requirements>
//     │        │        │
//     │        │        └── Dependencies needed
//     │        └── What can fail
//     └── What it returns
```

### 2. Creating Effects
```tsx
import { Effect } from 'effect';

// Sync effect
const syncEffect = Effect.succeed(42);

// Async effect
const asyncEffect = Effect.tryPromise({
  try: () => fetch('/api/data'),
  catch: (error) => new NetworkError({ cause: error }),
});

// Generator-based (recommended)
const program = Effect.gen(function* () {
  const user = yield* getUser(1);
  const posts = yield* getPosts(user.id);
  return posts;
});
```

### 3. Error Handling
```tsx
import { Data } from 'effect';

// Define typed errors
class DatabaseError extends Data.TaggedError('DatabaseError')<{
  readonly cause: unknown;
}> {}

class NotFoundError extends Data.TaggedError('NotFoundError')<{
  readonly message: string;
}> {}

// Handle errors
const program = Effect.gen(function* () {
  const result = yield* riskyOperation.pipe(
    Effect.catchTag('DatabaseError', (error) =>
      Effect.succeed(fallbackValue)
    ),
    Effect.catchTag('NotFoundError', (error) =>
      Effect.fail(new UserNotFoundError({ userId: id }))
    ),
  );
  return result;
});
```

### 4. Dependency Injection (Services)
```tsx
import { Context, Layer } from 'effect';

// Define service
class DatabaseService extends Context.Tag('DatabaseService')<
  DatabaseService,
  { readonly query: (sql: string) => Effect.Effect<unknown> }
>() {}

// Create implementation
const DatabaseLive = Layer.succeed(DatabaseService, {
  query: (sql) => Effect.tryPromise({
    try: () => db.query(sql),
    catch: (error) => new DatabaseError({ cause: error }),
  }),
});

// Use in program
const program = Effect.gen(function* () {
  const db = yield* DatabaseService;
  const users = yield* db.query('SELECT * FROM users');
  return users;
});

// Run with dependencies
Effect.runPromise(program.pipe(Effect.provide(DatabaseLive)));
```

### 5. Retry & Schedules
```tsx
import { Schedule } from 'effect';

const retryPolicy = Schedule.exponential('100 millis').pipe(
  Schedule.compose(Schedule.recurs(3)),
);

const program = Effect.gen(function* () {
  return yield* fetch('/api/data').pipe(
    Effect.retry(retryPolicy),
  );
});
```

## Common Patterns

### API Client Service
```tsx
import { Context, Effect } from 'effect';

class ApiClient extends Context.Tag('ApiClient')<
  ApiClient,
  {
    readonly get: <A>(url: string) => Effect.Effect<A>;
    readonly post: <A>(url: string, body: unknown) => Effect.Effect<A>;
  }
>() {};
```

### Repository Pattern
```tsx
class UserRepository extends Context.Tag('UserRepository')<
  UserRepository,
  {
    readonly findById: (id: string) => Effect.Effect<Option<User>>;
    readonly save: (user: User) => Effect.Effect<void>;
  }
>() {};
```

### Effect with React Hook
```tsx
import { useEffect, useState } from 'react';
import { Effect } from 'effect';

function useEffectProgram<T>(program: Effect.Effect<T>) {
  const [state, setState] = useState<{
    data: T | null;
    error: Error | null;
    loading: boolean;
  }>({ data: null, error: null, loading: true });

  useEffect(() => {
    const fiber = Effect.runFork(program.pipe(
      Effect.match({
        onSuccess: (data) => setState({ data, error: null, loading: false }),
        onFailure: (error) => setState({ data: null, error, loading: false }),
      }),
    ));

    return () => Effect.runPromise(Effect.interruptFiber(fiber));
  }, []);

  return state;
}
```

## Anti-Patterns

- ❌ Using `any` in Effect types
- ❌ Catching errors without typing
- ❌ Skipping dependency injection
- ❌ Using `Effect.runPromise` in components directly
- ❌ Not handling all error cases
- ❌ Mixing Effect with raw Promises

## Benefits

- Typed errors in function signatures
- Automatic dependency resolution
- Composable error handling
- Built-in retry and scheduling
- Testable with mock layers
