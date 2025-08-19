declare namespace NodeJS {
  interface ProcessEnv {
    readonly PORT?: string;
    readonly NODE_ENV: "development" | "production" | "test";
    readonly DATABASE_URI: string;
    readonly JWT_SECRET: string;
  }
}
