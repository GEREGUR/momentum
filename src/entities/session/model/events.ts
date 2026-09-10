export type SessionEvent =
  | { type: "START"; duration: number; taskId?: string }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "COMPLETE" }
  | { type: "RESET" };
