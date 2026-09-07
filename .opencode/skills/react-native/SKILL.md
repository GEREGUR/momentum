---
name: react-native
description: React Native development best practices, patterns, and conventions for building mobile apps with Expo.
---

# React Native

This skill provides best practices and patterns for React Native development with Expo.

## When to Use

Use this skill when:
- Building or extending React Native components
- Working with React Native APIs (gestures, animations, storage)
- Debugging cross-platform issues
- Implementing platform-specific code
- Optimizing React Native performance

## Core Principles

### 1. Component Architecture
- Functional components only — no class components
- Custom hooks for reusable logic
- Keep components small and focused
- Extract business logic to hooks or services

### 2. Styling
- Use NativeWind (Tailwind CSS) for styling
- Use semantic design tokens, not raw colors
- Support light/dark mode via system preferences
- Use `StyleSheet.create()` for performance-critical styles

### 3. Performance
- Avoid inline functions in render
- Use `React.memo()` for expensive components
- Use `useMemo()` and `useCallback()` strategically
- Lazy load heavy components with `React.lazy()`
- Use FlatList for long lists, never ScrollView

### 4. Platform-Specific Code
```tsx
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: { shadowColor: '#000' },
      android: { elevation: 4 },
    }),
  },
});
```

### 5. TypeScript
- Strict mode enabled
- Type all props and state
- Use discriminated unions for variant props
- Avoid `any` — use `unknown` and narrow

### 6. Testing
- Jest + React Native Testing Library
- Test behavior, not implementation
- Mock native modules at the boundary
- Use `renderHook()` for custom hooks

## Anti-Patterns

- ❌ Class components
- ❌ Inline styles in render
- ❌ Direct DOM manipulation
- ❌ Platform-specific code without `Platform.select`
- ❌ Deep nested components (flatten structure)
- ❌ Business logic in components

## File Structure

```
src/
├── components/          # Reusable UI components
├── features/            # Feature modules (FSD-like)
├── hooks/               # Custom hooks
├── services/            # API clients, Effect services
├── stores/              # XState machines
├── types/               # Shared TypeScript types
└── utils/               # Pure utility functions
```
