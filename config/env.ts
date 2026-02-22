import * as z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().default("file:./dev.db"),
  JWT_SECRET: z.string().default("super-secret-key"),
  SUPERADMIN_EMAIL: z.string().email().default("admin@agro.local"),
  SUPERADMIN_PASSWORD: z.string().default("admin123"),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export const loadEnv = (): Env => {
  if (cachedEnv) return cachedEnv;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment configuration", parsed.error.flatten());
    throw new Error("Invalid environment variables");
  }
  cachedEnv = parsed.data;
  return cachedEnv;
};
