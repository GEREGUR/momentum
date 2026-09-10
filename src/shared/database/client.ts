import { Context, Effect, Layer } from "effect";
import * as SQLite from "expo-sqlite";
import { DatabaseError } from "./errors";

export interface DatabaseClient {
  readonly getAllAsync: <T>(
    sql: string,
    params?: SQLite.SQLiteBindParams
  ) => Effect.Effect<T[], DatabaseError>;
  readonly getFirstAsync: <T>(
    sql: string,
    params?: SQLite.SQLiteBindParams
  ) => Effect.Effect<T | null, DatabaseError>;
  readonly runAsync: (
    sql: string,
    params?: SQLite.SQLiteBindParams
  ) => Effect.Effect<SQLite.SQLiteRunResult, DatabaseError>;
  readonly execAsync: (sql: string) => Effect.Effect<void, DatabaseError>;
  readonly withTransactionAsync: (
    task: () => Effect.Effect<void>
  ) => Effect.Effect<void, DatabaseError>;
  readonly syncLibSQL: () => Effect.Effect<void, DatabaseError>;
  readonly closeAsync: () => Effect.Effect<void, DatabaseError>;
}

export const DatabaseClient =
  Context.GenericTag<DatabaseClient>("DatabaseClient");

export const makeDatabaseClient = Effect.gen(function* () {
  const db = yield* Effect.tryPromise({
    try: () =>
      SQLite.openDatabaseAsync("momentum.db", {
        libSQLOptions: process.env.EXPO_PUBLIC_TURSO_DATABASE_URL
          ? {
              url: process.env.EXPO_PUBLIC_TURSO_DATABASE_URL,
              authToken: process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN ?? "",
            }
          : undefined,
      }),
    catch: (e) =>
      new DatabaseError({
        message: "Failed to open database",
        cause: e,
      }),
  });

  return {
    getAllAsync: <T>(sql: string, params?: SQLite.SQLiteBindParams) =>
      Effect.gen(function* () {
        const result = yield* Effect.tryPromise({
          try: () => db.getAllAsync<Record<string, unknown>>(sql, params ?? []),
          catch: (e) =>
            new DatabaseError({
              message: `Failed to execute query: ${sql}`,
              cause: e,
            }),
        });
        return result as T[];
      }),
    getFirstAsync: <T>(sql: string, params?: SQLite.SQLiteBindParams) =>
      Effect.gen(function* () {
        const result = yield* Effect.tryPromise({
          try: () =>
            db.getFirstAsync<Record<string, unknown>>(sql, params ?? []),
          catch: (e) =>
            new DatabaseError({
              message: `Failed to execute query: ${sql}`,
              cause: e,
            }),
        });
        return result as T | null;
      }),
    runAsync: (sql: string, params?: SQLite.SQLiteBindParams) =>
      Effect.tryPromise({
        try: () => db.runAsync(sql, params ?? []),
        catch: (e) =>
          new DatabaseError({
            message: `Failed to execute statement: ${sql}`,
            cause: e,
          }),
      }),
    execAsync: (sql: string) =>
      Effect.tryPromise({
        try: () => db.execAsync(sql),
        catch: (e) =>
          new DatabaseError({
            message: `Failed to execute SQL: ${sql}`,
            cause: e,
          }),
      }),
    withTransactionAsync: (task) =>
      Effect.tryPromise({
        try: () =>
          db.withExclusiveTransactionAsync(async () => {
            const effect = task();
            await Effect.runPromise(effect);
          }),
        catch: (e) =>
          new DatabaseError({
            message: "Transaction failed",
            cause: e,
          }),
      }),
    syncLibSQL: () =>
      Effect.tryPromise({
        try: () => db.syncLibSQL(),
        catch: (e) =>
          new DatabaseError({
            message: "Failed to sync with Turso",
            cause: e,
          }),
      }),
    closeAsync: () =>
      Effect.tryPromise({
        try: () => db.closeAsync(),
        catch: (e) =>
          new DatabaseError({
            message: "Failed to close database",
            cause: e,
          }),
      }),
  } satisfies DatabaseClient;
});

export const DatabaseLive = Layer.scoped(DatabaseClient, makeDatabaseClient);
