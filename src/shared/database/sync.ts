import { Context, Effect, Layer } from "effect";
import { Database, BindParams } from "@tursodatabase/sync-react-native";
import { SyncError } from "./errors";

export interface TursoSync {
  readonly connect: () => Effect.Effect<void, SyncError>;
  readonly pull: () => Effect.Effect<boolean, SyncError>;
  readonly push: () => Effect.Effect<void, SyncError>;
  readonly stats: () => Effect.Effect<
    {
      cdcOperations: number;
      mainWalSize: number;
      revertWalSize: number;
      lastPullUnixTime: number;
      lastPushUnixTime: number;
      networkSentBytes: number;
      networkReceivedBytes: number;
      revision: string | null;
    },
    SyncError
  >;
  readonly exec: (sql: string) => Effect.Effect<void, SyncError>;
  readonly run: (
    sql: string,
    ...params: BindParams[]
  ) => Effect.Effect<{ changes: number; lastInsertRowid: number }, SyncError>;
  readonly get: (
    sql: string,
    ...params: BindParams[]
  ) => Effect.Effect<Record<string, unknown> | undefined, SyncError>;
  readonly all: (
    sql: string,
    ...params: BindParams[]
  ) => Effect.Effect<Record<string, unknown>[], SyncError>;
  readonly close: () => Effect.Effect<void, SyncError>;
}

export const TursoSync = Context.GenericTag<TursoSync>("TursoSync");

export interface TursoSyncConfig {
  readonly path: string;
  readonly url?: string;
  readonly authToken?: string | (() => Promise<string>);
}

export const TursoSyncConfig =
  Context.GenericTag<TursoSyncConfig>("TursoSyncConfig");

export const makeTursoSync = Effect.gen(function* () {
  const config = yield* TursoSyncConfig;

  const db = yield* Effect.try({
    try: () =>
      new Database({
        path: config.path,
        url: config.url,
        authToken: config.authToken,
      }),
    catch: (e) =>
      new SyncError({
        message: "Failed to create Turso database",
        cause: e,
      }),
  });

  yield* Effect.tryPromise({
    try: () => db.connect(),
    catch: (e) =>
      new SyncError({
        message: "Failed to connect to Turso",
        cause: e,
      }),
  });

  return {
    connect: () =>
      Effect.tryPromise({
        try: () => db.connect(),
        catch: (e) =>
          new SyncError({
            message: "Failed to connect",
            cause: e,
          }),
      }),
    pull: () =>
      Effect.tryPromise({
        try: () => db.pull(),
        catch: (e) =>
          new SyncError({
            message: "Failed to pull changes",
            cause: e,
          }),
      }),
    push: () =>
      Effect.tryPromise({
        try: () => db.push(),
        catch: (e) =>
          new SyncError({
            message: "Failed to push changes",
            cause: e,
          }),
      }),
    stats: () =>
      Effect.tryPromise({
        try: () => db.stats(),
        catch: (e) =>
          new SyncError({
            message: "Failed to get sync stats",
            cause: e,
          }),
      }),
    exec: (sql) =>
      Effect.tryPromise({
        try: () => db.exec(sql),
        catch: (e) =>
          new SyncError({
            message: `Failed to execute SQL: ${sql}`,
            cause: e,
          }),
      }),
    run: (sql, ...params) =>
      Effect.tryPromise({
        try: () => db.run(sql, ...params),
        catch: (e) =>
          new SyncError({
            message: `Failed to execute statement: ${sql}`,
            cause: e,
          }),
      }),
    get: (sql, ...params) =>
      Effect.tryPromise({
        try: () => db.get(sql, ...params),
        catch: (e) =>
          new SyncError({
            message: `Failed to execute query: ${sql}`,
            cause: e,
          }),
      }),
    all: (sql, ...params) =>
      Effect.tryPromise({
        try: () => db.all(sql, ...params),
        catch: (e) =>
          new SyncError({
            message: `Failed to execute query: ${sql}`,
            cause: e,
          }),
      }),
    close: () =>
      Effect.sync(() => {
        db.close();
      }),
  } satisfies TursoSync;
});

export const TursoSyncLive = Layer.scoped(TursoSync, makeTursoSync);
