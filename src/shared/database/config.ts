import { Context, Effect } from "effect";
import { ConfigError } from "./errors";

export interface TursoConfig {
  readonly url: string;
  readonly authToken: string;
}

export class TursoConfig extends Context.Tag("TursoConfig")<
  TursoConfig,
  TursoConfig
>() {}

export const makeTursoConfig = Effect.gen(function* () {
  const url = process.env.EXPO_PUBLIC_TURSO_DATABASE_URL;
  const authToken = process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN;

  if (!url) {
    return yield* new ConfigError({
      message: "EXPO_PUBLIC_TURSO_DATABASE_URL is not set",
    });
  }

  if (!authToken) {
    return yield* new ConfigError({
      message: "EXPO_PUBLIC_TURSO_AUTH_TOKEN is not set",
    });
  }

  return { url, authToken } as TursoConfig;
});
