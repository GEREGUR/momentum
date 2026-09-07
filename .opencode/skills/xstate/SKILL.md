---
name: xstate
description: XState v5 for state machines, statecharts, and actor-based state management in React Native.
---

# XState

This skill covers XState v5 for creating predictable state machines and statecharts in React Native apps.

## When to Use

Use this skill when:
- Managing complex UI state (forms, wizards, modals)
- Implementing authentication flows
- Building multi-step processes
- Handling async workflows
- Debugging state-related bugs

## Core Principles

### 1. State Machine Definition
```tsx
import { createMachine } from 'xstate';

const authMachine = createMachine({
  id: 'auth',
  initial: 'idle',
  context: {
    user: null,
    error: null,
  },
  states: {
    idle: {
      on: { LOGIN: 'loading' },
    },
    loading: {
      invoke: {
        src: 'loginService',
        onDone: {
          target: 'authenticated',
          actions: 'setUser',
        },
        onError: {
          target: 'error',
          actions: 'setError',
        },
      },
    },
    authenticated: {
      on: { LOGOUT: 'idle' },
    },
    error: {
      on: { RETRY: 'loading' },
    },
  },
});
```

### 2. Machine with Context
```tsx
import { assign } from 'xstate';

interface AuthContext {
  user: User | null;
  error: string | null;
  retryCount: number;
}

const authMachine = createMachine({
  id: 'auth',
  initial: 'idle',
  context: {
    user: null,
    error: null,
    retryCount: 0,
  } satisfies AuthContext,
  states: {
    idle: {
      on: { LOGIN: 'loading' },
    },
    loading: {
      entry: assign({ retryCount: ({ context }) => context.retryCount + 1 }),
      invoke: {
        src: 'loginService',
        onDone: {
          target: 'authenticated',
          actions: assign({
            user: ({ event }) => event.output.user,
            error: () => null,
          }),
        },
        onError: {
          target: 'error',
          actions: assign({
            error: ({ event }) => event.error.message,
          }),
        },
      },
    },
    authenticated: {
      on: { LOGOUT: 'idle' },
    },
    error: {
      on: {
        RETRY: {
          target: 'loading',
          guard: ({ context }) => context.retryCount < 3,
        },
      },
    },
  },
});
```

### 3. Actor Model
```tsx
import { createActor } from 'xstate';

// Create actor (instance of machine)
const authActor = createActor(authMachine);

// Subscribe to state changes
authActor.subscribe((state) => {
  console.log('Current state:', state.value);
  console.log('Context:', state.context);
});

// Start the actor
authActor.start();

// Send events
authActor.send({ type: 'LOGIN' });
authActor.send({ type: 'LOGOUT' });
```

### 4. React Integration
```tsx
import { useMachine } from '@xstate/react';

function LoginForm() {
  const [state, send] = useMachine(authMachine);

  if (state.matches('loading')) {
    return <LoadingSpinner />;
  }

  if (state.matches('error')) {
    return (
      <View>
        <Text>Error: {state.context.error}</Text>
        <Button onPress={() => send({ type: 'RETRY' })} title="Retry" />
      </View>
    );
  }

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button
        onPress={() => send({ type: 'LOGIN' })}
        title="Login"
        disabled={state.matches('idle')}
      />
    </View>
  );
}
```

## Common Patterns

### Multi-Step Form Wizard
```tsx
const wizardMachine = createMachine({
  id: 'wizard',
  initial: 'step1',
  context: {
    step1Data: null,
    step2Data: null,
    step3Data: null,
  },
  states: {
    step1: {
      on: { NEXT: 'step2' },
    },
    step2: {
      on: { NEXT: 'step3', BACK: 'step1' },
    },
    step3: {
      on: { BACK: 'step2', SUBMIT: 'submitting' },
    },
    submitting: {
      invoke: {
        src: 'submitForm',
        onDone: 'success',
        onError: 'error',
      },
    },
    success: {},
    error: {},
  },
});
```

### Parallel States
```tsx
const editorMachine = createMachine({
  id: 'editor',
  type: 'parallel',
  states: {
    saving: {
      initial: 'idle',
      states: {
        idle: {
          on: { SAVE: 'saving' },
        },
        saving: {
          invoke: {
            src: 'saveDocument',
            onDone: 'idle',
            onError: 'error',
          },
        },
        error: {
          on: { RETRY: 'saving' },
        },
      },
    },
    validation: {
      initial: 'valid',
      states: {
        valid: {
          on: { INVALID: 'invalid' },
        },
        invalid: {
          on: { VALID: 'valid' },
        },
      },
    },
  },
});
```

### History States
```tsx
const navigationMachine = createMachine({
  id: 'navigation',
  initial: 'home',
  states: {
    home: {
      on: { GO_PROFILE: 'profile' },
    },
    profile: {
      initial: 'details',
      states: {
        details: {
          on: { EDIT: 'editing' },
        },
        editing: {
          on: { SAVE: 'details' },
        },
        hist: { type: 'history' },
      },
      on: { GO_HOME: 'home' },
    },
  },
});
```

## Integration with Effect.ts

```tsx
import { Effect } from 'effect';

// Effect service for auth
class AuthService extends Context.Tag('AuthService')<
  AuthService,
  {
    login: (credentials: Credentials) => Effect.Effect<User>;
    logout: () => Effect.Effect<void>;
  }
>() {};

// Machine with Effect services
const authMachine = createMachine({
  id: 'auth',
  initial: 'idle',
  states: {
    idle: {
      on: { LOGIN: 'loading' },
    },
    loading: {
      invoke: {
        src: 'loginService',
        onDone: 'authenticated',
        onError: 'error',
      },
    },
    authenticated: {},
    error: {},
  },
}, {
  actors: {
    loginService: fromPromise(async ({ input }) => {
      const { credentials } = input;
      return Effect.runPromise(
        Effect.gen(function* () {
          const auth = yield* AuthService;
          return yield* auth.login(credentials);
        })
      );
    }),
  },
});
```

## Anti-Patterns

- ❌ Using state machines for simple boolean state
- ❌ Not defining context types
- ❌ Mutable context in assign
- ❌ Side effects in machine definitions
- ❌ Deeply nested states (flatten or use parallel)
- ❌ Not using guards for conditional transitions

## Benefits

- Predictable state transitions
- Visualizable statecharts
- Built-in side effect handling
- Type-safe events and context
- Easy to test and debug
- Actor model for isolation
