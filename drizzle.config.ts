import type { Config } from 'drizzle-kit';
export default {
  schema: './src/schema.ts',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: { uri: 'mysql://root:betori12@localhost:3306/db' },
} satisfies Config;
