import { assign, setup } from "xstate";

export interface SessionContext {
  sessionId: string | null;
  duration: number;
  startedAt: number | null;
  pausedAt: number | null;
  totalPausedTime: number;
  taskId: string | null;
}

export type SessionState =
  | { value: "idle"; context: SessionContext }
  | { value: "running"; context: SessionContext }
  | { value: "paused"; context: SessionContext }
  | { value: "completed"; context: SessionContext };

export const sessionMachine = setup({
  types: {
    context: {} as SessionContext,
    events: {} as
      | { type: "START"; duration: number; taskId?: string }
      | { type: "PAUSE" }
      | { type: "RESUME" }
      | { type: "COMPLETE" }
      | { type: "RESET" },
  },
  actions: {
    initializeSession: assign({
      sessionId: () => crypto.randomUUID(),
      duration: ({ event }) => {
        if (event.type !== "START") return 0;
        return event.duration;
      },
      startedAt: () => Date.now(),
      pausedAt: () => null,
      totalPausedTime: () => 0,
      taskId: ({ event }) => {
        if (event.type !== "START") return null;
        return event.taskId ?? null;
      },
    }),
    pauseSession: assign({
      pausedAt: () => Date.now(),
    }),
    resumeSession: assign({
      pausedAt: () => null,
      totalPausedTime: ({ context }) => {
        if (context.pausedAt === null) return context.totalPausedTime;
        return context.totalPausedTime + (Date.now() - context.pausedAt);
      },
    }),
    resetSession: assign({
      sessionId: () => null,
      duration: () => 0,
      startedAt: () => null,
      pausedAt: () => null,
      totalPausedTime: () => 0,
      taskId: () => null,
    }),
  },
}).createMachine({
  id: "session",
  initial: "idle",
  context: {
    sessionId: null,
    duration: 0,
    startedAt: null,
    pausedAt: null,
    totalPausedTime: 0,
    taskId: null,
  },
  states: {
    idle: {
      on: {
        START: {
          target: "running",
          actions: "initializeSession",
        },
      },
    },
    running: {
      on: {
        PAUSE: {
          target: "paused",
          actions: "pauseSession",
        },
        COMPLETE: {
          target: "completed",
        },
      },
    },
    paused: {
      on: {
        RESUME: {
          target: "running",
          actions: "resumeSession",
        },
        COMPLETE: {
          target: "completed",
        },
      },
    },
    completed: {
      on: {
        RESET: {
          target: "idle",
          actions: "resetSession",
        },
      },
    },
  },
});
