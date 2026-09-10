import type { SessionContext } from "./store";

export const selectRemainingTime = (context: SessionContext): number => {
  if (context.startedAt === null) return context.duration;

  const elapsed =
    context.pausedAt !== null
      ? context.pausedAt - context.startedAt - context.totalPausedTime
      : Date.now() - context.startedAt - context.totalPausedTime;

  return Math.max(0, context.duration - Math.floor(elapsed / 1000));
};

export const selectElapsed = (context: SessionContext): number => {
  if (context.startedAt === null) return 0;

  const elapsed =
    context.pausedAt !== null
      ? context.pausedAt - context.startedAt - context.totalPausedTime
      : Date.now() - context.startedAt - context.totalPausedTime;

  return Math.max(0, Math.floor(elapsed / 1000));
};

export const selectProgress = (context: SessionContext): number => {
  if (context.duration === 0) return 0;
  const elapsed = selectElapsed(context);
  return Math.min(1, elapsed / context.duration);
};

export const selectIsRunning = (state: { value: string }): boolean =>
  state.value === "running";

export const selectIsPaused = (state: { value: string }): boolean =>
  state.value === "paused";

export const selectIsCompleted = (state: { value: string }): boolean =>
  state.value === "completed";

export const selectIsIdle = (state: { value: string }): boolean =>
  state.value === "idle";
