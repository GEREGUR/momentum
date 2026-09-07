# Momentum — Developer Execution Plan

> Personal Operating System built with React Native + Expo.
>
> Goal: Build a production-minded mobile application while learning React Native deeply.
>
> Stack: React Native, Expo, XState, Effect.ts

---

## 🎯 Project Goal

**Momentum** is a personal productivity application for:

- Daily planning
- Tasks
- Focus sessions
- Habits
- Daily reflection
- Productivity analytics

### Core User Loop

```text
Morning
   ↓
Plan your day
   ↓
Execute tasks
   ↓
Focus sessions
   ↓
Complete habits
   ↓
Evening reflection
   ↓
Analyze results
   ↓
Next day
```

---

## 🧠 Development Principles

### 1. Build Vertical Slices

Don't build the entire UI first and then add logic. Instead:

```text
Feature
│
├── UI
├── State
├── Business Logic
├── Storage
└── Tests
```

Each feature should work end-to-end before moving to the next one.

### 2. Start Local-First

Initial architecture:

```text
Mobile App
    ↓
SQLite
```

Do not build a backend immediately. Later:

```text
Mobile App
    ↓
Local Database
    ↓
Sync Layer
    ↓
Backend
```

**Why:**

- Faster development
- Less infrastructure
- Better learning experience
- Learn offline-first architecture
- Avoid premature complexity

### 3. Every Feature Must Teach Something

**Tasks** → Learn: Lists, Forms, Gestures, Persistence

**Planner** → Learn: Complex interactions, Drag & Drop, Reanimated, Gesture Handler

**Focus Mode** → Learn: App lifecycle, Background state, Notifications, Time calculations

---

## 🗺️ Project Milestones

```text
M0  ─ Foundation
│
M1  ─ App Shell
│
M2  ─ Tasks
│
M3  ─ Daily Planner
│
M4  ─ Focus Mode
│
M5  ─ Habits
│
M6  ─ Daily Reflection
│
M7  ─ Statistics
│
M8  ─ Offline Architecture
│
M9  ─ Backend + Sync
│
M10 ─ Performance
│
M11 ─ Testing
│
M12 ─ Production Release
```

---

## M0 — Foundation

### 🎯 Goal

Create a stable development environment.

### Tasks

#### Project Setup

```bash
npx create-expo-app@latest momentum
```

**Configure:**

- TypeScript strict mode
- ESLint
- Prettier
- Import aliases
- Environment variables
- Git hooks
- Commit conventions

#### Core Stack

**Framework:**

- Expo
- React Native
- TypeScript

**Navigation:**

- Expo Router

**Server State:**

- TanStack Query

**Client State:**

- XState

**Business Logic / Sync Layer:**

- Effect.ts

**Forms:**

- React Hook Form
- Zod

**Animations:**

- React Native Reanimated
- React Native Gesture Handler

**Storage:**

- Expo SQLite

**Native APIs:**

- Expo Notifications
- Expo Secure Store

#### Initial Project Structure

```text
src/
├── app/
├── features/
├── entities/
└── shared/
```

Do not over-engineer the architecture yet.

### Deliverable

- ✅ App runs on iOS
- ✅ App runs on Android
- ✅ App runs on a real device
- ✅ Lint works
- ✅ Typecheck works
- ✅ Formatting works

---

## M1 — App Shell

### 🎯 Goal

Create the main application structure.

### Screens

- Today
- Plan
- Focus
- Stats
- Settings

### Navigation

```text
Tabs
│
├── Today
├── Plan
├── Focus
└── Stats
```

Settings can be opened through Stack or Modal navigation.

### Tasks

- Setup Expo Router
- Setup Tab navigation
- Setup Stack navigation
- Create Modal route
- Add Deep Linking
- Configure navigation types

### Deliverable

```text
Open App
    ↓
Navigate between tabs
    ↓
Open modal
    ↓
Close modal
    ↓
Return to previous screen
```

---

## M2 — Tasks

### 🎯 Goal

Build the first complete feature.

### Domain Model

```typescript
type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  scheduledFor?: string;
};
```

### Features

```text
Tasks
│
├── Create
├── Edit
├── Delete
├── Complete
└── Schedule
```

### UI

```text
○ Finish project
✓ Workout
○ Learn React Native
○ Read
```

### Interactions

- **Tap** → Open task
- **Swipe** → Delete
- **Checkbox** → Complete

### Learning Goals

**React Native:**

- FlatList
- Pressable
- TextInput
- Keyboard
- Swipe gestures

**Architecture:**

- Feature folder structure
- Domain model
- Repository pattern

**State:**

- Local state
- Derived state

### Deliverable

```text
Create Task
    ↓
Save to SQLite
    ↓
Restart application
    ↓
Task still exists
```

---

## M3 — Daily Planner

### 🎯 Goal

Build the main feature of the application.

### Concept

The user plans their day.

```text
MORNING
  09:00  React Native
  11:00  Work

AFTERNOON
  14:00  Gym
  16:00  Project
```

### Version 1

Start without Drag & Drop.

```text
Create Task
    ↓
Assign Time
    ↓
Display Timeline
```

### Version 2

Add: Drag → Move → Drop

### Learning Goals

- Gesture Handler
- Reanimated
- Complex interactions
- Animated layout changes

### Deliverable

User can:

- ✅ Create task
- ✅ Assign time
- ✅ Move task
- ✅ Change task time
- ✅ Reorder tasks

---

## M4 — Focus Mode

### 🎯 Goal

Learn mobile lifecycle.

### Features

```text
Focus Session
┌─────────────────┐
│     25:00       │
│                 │
│ Task:           │
│ Learn React     │
│ Native          │
│                 │
│   [ Start ]     │
└─────────────────┘
```

### States

```text
IDLE
 │
 ▼
RUNNING
 │
 ├────► PAUSED
 │          │
 │          ▼
 │       RUNNING
 │
 ▼
COMPLETED
```

### Critical Requirement

The timer must work correctly when:

```text
Timer running
    ↓
User locks phone
    ↓
Application goes to background
    ↓
User returns
    ↓
Correct time is displayed
```

> **Important:** Do not use `setInterval()` as the source of truth.
> Instead store: `startedAt`, `duration`, `pausedAt`
> Then calculate: `remainingTime`

### Learning Goals

- AppState
- Application lifecycle
- Timestamps
- Notifications
- Background behavior

### Deliverable

Focus session works correctly:

- ✅ Foreground
- ✅ Background
- ✅ Locked screen
- ✅ App restart

---

## M5 — Habits

### 🎯 Goal

Build recurring domain logic.

### Model

```typescript
type Habit = {
  id: string;
  title: string;
  frequency: "daily" | "weekly";
  createdAt: string;
};
```

### Features

- Create Habit
- Daily / Weekly / Custom

### UI

```text
Workout
Mon ✓  Tue ✓  Wed ✓
Thu ○  Fri ○  Sat ○  Sun ○
```

### Challenge

Implement streak calculation: 🔥 12 days

### Learning Goals

- Date manipulation
- Derived state
- Database queries
- Calendar UI

---

## M6 — Daily Reflection

### 🎯 Goal

Add qualitative data to the application.

### Screen

```text
How was your day?

😩  😕  😐  🙂  🔥
```

### Questions

- What went well?
- What didn't go well?
- What will you improve tomorrow?

### Learning Goals

- Forms
- Keyboard handling
- Multiline inputs
- Persistence

### Deliverable

The user can create and view daily reflections.

---

## M7 — Statistics

### 🎯 Goal

Build analytics and data visualization.

### Metrics

- Tasks Completed
- Focus Time
- Habit Completion
- Daily Score

### Time Ranges

- Week
- Month
- Year

### Example

```text
FOCUS TIME

Mon  ██████
Tue  ███
Wed  ████████
Thu  █████
Fri  ███████
```

### Learning Goals

- Charts
- Data aggregation
- Performance
- Memoization

---

## M8 — Offline Architecture

### 🎯 Goal

Build a production-minded data architecture with Effect.ts as the sync/logic layer.

### Architecture

```text
UI
│
▼
XState (Client State)
│
▼
Effect.ts Services (Business Logic)
│
├──── Local Database (SQLite)
│
└──── Remote API (HTTP)
```

### Rule

The UI should not know about SQLite, HTTP, or Effect runtime details.

### Effect.ts Services

```typescript
import { Effect, Layer } from "effect";

// Repository interface defined as Effect Service
interface TaskRepository {
  getTasks: Effect.Effect<Task[], DatabaseError>;
  createTask: (input: CreateTaskInput) => Effect.Effect<Task, DatabaseError>;
  updateTask: (
    id: string,
    input: UpdateTaskInput,
  ) => Effect.Effect<Task, DatabaseError>;
}

// Local implementation
const makeLocalTaskRepository = Effect.gen(function* () {
  const db = yield* DatabaseClient;
  return {
    getTasks: Effect.gen(function* () {
      return yield* db.query("SELECT * FROM tasks");
    }),
    createTask: (input) =>
      Effect.gen(function* () {
        return yield* db.query("INSERT INTO tasks ...", input);
      }),
  };
});

// Later: Synced implementation layers over local + sync queue
```

### Learning Goals

- Dependency boundaries
- Repository pattern
- Local-first architecture
- Dependency injection concepts

---

## M9 — Backend + Sync

### 🎯 Goal

Add multi-device synchronization using Effect.ts for the sync pipeline.

### Backend Features

- Authentication
- Users
- Tasks
- Habits
- Focus Sessions

### Sync Architecture

```text
Mobile App
    │
    ▼
XState Machine (UI State)
    │
    ▼
Effect.ts Services (Business Logic)
    │
    ├── Local Database (SQLite)
    │
    └── Sync Service (Effect.ts)
         │
         ▼
    Sync Queue (SQLite)
         │
         ▼
    Remote Backend (HTTP)
```

### Offline Mutation with Effect.ts

```typescript
import { Effect, Queue } from "effect";

const syncService = Effect.gen(function* () {
  const syncQueue = yield* SyncQueue;
  const httpClient = yield* HttpClient;

  const processMutation = (mutation: SyncMutation) =>
    Effect.gen(function* () {
      // 1. Apply locally
      yield* applyLocally(mutation);
      // 2. Enqueue for sync
      yield* syncQueue.offer(mutation);
      // 3. Attempt sync if online
      yield* attemptSync.pipe(
        Effect.catchAll(() => Effect.void), // defer to background
      );
    });

  const attemptSync = Effect.gen(function* () {
    const pending = yield* syncQueue.poll;
    yield* httpClient.post("/sync", pending);
    yield* syncQueue.drain;
  });
});
```

### Learning Goals

- Effect.ts services and layers
- Structured concurrency
- Error handling with typed errors
- Offline mutations with Effect pipelines
- Conflict resolution strategies
- Retry strategies with Effect

---

## M10 — Performance

### 🎯 Goal

Learn to profile and optimize React Native.

### Stress Tests

- **Lists:** 1,000 tasks
- **Habits:** 365 days
- **Statistics:** Thousands of records

### Check

- Unnecessary renders
- FlatList performance
- Memoization
- Image optimization
- JS thread blocking
- Animation performance
- Memory usage

### Performance Challenge

Create an intentionally bad screen.

```text
Bad Implementation
        ↓
Measure
        ↓
Profile
        ↓
Find Root Cause
        ↓
Optimize
        ↓
Measure Again
```

Document:

- Problem
- Root Cause
- Fix
- Result

---

## M11 — Testing

### Unit Tests

Test:

- Streak calculation
- Day score calculation
- Task scheduling

### Integration Tests

Test:

- Create Task
- Complete Habit
- Finish Focus Session

### E2E Tests

```text
Open App
    ↓
Create Task
    ↓
Schedule Task
    ↓
Start Focus Session
    ↓
Complete Task
    ↓
Daily Reflection
```

---

## M12 — Production Release

### Build Profiles

- development
- preview
- production

### CI Pipeline

```text
Push
  ↓
Lint
  ↓
Typecheck
  ↓
Tests
  ↓
Build
```

### Release Checklist

- [ ] App icon
- [ ] Splash screen
- [ ] Permissions
- [ ] Error tracking
- [ ] Analytics
- [ ] Production build
- [ ] Real device testing
- [ ] Performance testing

---

## 📂 Suggested Architecture

```text
src/
├── app/
│   ├── providers/
│   ├── navigation/
│   └── config/
│
├── features/
│   ├── tasks/
│   │   ├── api/
│   │   ├── model/
│   │   ├── ui/
│   │   └── hooks/
│   │
│   ├── planner/
│   ├── focus/
│   ├── habits/
│   └── reflection/
│
├── entities/
│   ├── task/
│   ├── habit/
│   └── user/
│
├── sync/
│   ├── services/       # Effect.ts services (TaskSyncService, etc.)
│   ├── layers/         # Effect.ts Layer implementations
│   ├── queue/          # Sync queue management
│   └── conflict/       # Conflict resolution strategies
│
└── shared/
    ├── ui/
    ├── lib/
    ├── hooks/
    ├── api/
    └── config/
```

---

## 📋 Definition of Done

Every feature is complete only when:

- [ ] Works
- [ ] Data persists
- [ ] Empty state exists
- [ ] Loading state exists
- [ ] Error state exists
- [ ] Keyboard behavior tested
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Performance checked
- [ ] Architecture reviewed

---

## 🌳 Git Workflow

### Branches

- `main`
- `feature/tasks`
- `feature/focus`
- `feature/habits`

### Commit Examples

```text
feat(tasks): add task creation
feat(tasks): add task completion
feat(planner): add daily timeline
feat(focus): implement session timer
```

---

## 📅 Weekly Development Cadence

| Day     | Focus                             |
| ------- | --------------------------------- |
| Day 1   | Research, Architecture, Planning  |
| Day 2–3 | Implementation                    |
| Day 4   | Polish, Edge Cases, UX            |
| Day 5   | Testing, Refactoring, Performance |

---

## 🚀 Recommended Development Order

```text
Foundation
    ↓
App Shell
    ↓
Tasks
    ↓
Daily Planner
    ↓
Focus Mode
    ↓
Habits
    ↓
Daily Reflection
    ↓
Statistics
    ↓
Offline Architecture
    ↓
Backend + Sync
    ↓
Performance
    ↓
Testing
    ↓
Production Release
```

---

## 🏁 Final Definition of Success

The project is successful when:

- I use the application personally
- It works offline
- It runs on iOS
- It runs on Android
- It has production-quality navigation
- It has complex gestures
- It has smooth animations
- It has local persistence
- It supports sync
- It has notifications
- It performs well
- It has automated tests
- It has a production build

---

## 🔥 First Sprint

### Sprint 0 — Foundation

**Goal:** Create the project foundation.

**Tasks:**

- Create Expo project
- Configure TypeScript
- Configure ESLint
- Configure Prettier
- Setup Expo Router
- Setup navigation
- Create basic design tokens
- Setup SQLite
- Setup project architecture
- Create Git repository
- Configure commit conventions

### Sprint 1 — Tasks

**Goal:** Build the first production-ready feature.

**Tasks:**

- Create Task domain model
- Create SQLite schema
- Create Task repository
- Create task list
- Create task creation form
- Add validation
- Add task completion
- Add task editing
- Add task deletion
- Add empty state
- Add error handling
- Test on iOS
- Test on Android

---

## 📚 Learning Rule

For every feature:

```text
Learn → Build → Break → Profile → Fix → Document
```

---

## 🧠 Developer Notes

### Architecture Decisions

| Decision    | Context                    | Alternatives                   | Why                                                                      |
| ----------- | -------------------------- | ------------------------------ | ------------------------------------------------------------------------ |
| XState      | Client state management    | Zustand, Redux, Jotai, Context | Explicit state machines, better for complex UI flows, visualizable       |
| Effect.ts   | Business logic, sync layer | RxJS, fp-ts, raw Promises      | Typed errors, structured concurrency, composable services, Layer pattern |
| Expo SQLite | Local storage              | WatermelonDB, AsyncStorage     | Built-in, synchronous, no extra deps                                     |
| Expo Router | Navigation                 | React Navigation               | File-based, simpler mental model                                         |

### Problems Encountered

| Problem | Root Cause | Solution | What I Learned |
| ------- | ---------- | -------- | -------------- |
| ...     | ...        | ...      | ...            |

---
