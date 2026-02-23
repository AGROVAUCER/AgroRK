import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z.string().optional(),
  PORT: z.coerce.number().optional(),

  SUPABASE_URL: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  JWT_SECRET: z.string().min(1),
})

export type Env = z.infer<typeof EnvSchema>

export function loadEnv(): Env {
  const parsed = EnvSchema.safeParse(process.env)
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('Invalid environment configuration', parsed.error.flatten())
    throw new Error('Invalid environment variables')
  }
  return parsed.data
}