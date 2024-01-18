import mysql from 'mysql2/promise';
import * as schema from './schema/schema.js';
import * as relationships from './schema/relationships.js';
import { wrapper } from './drizzle.js';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/mysql2';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'betori12',
  database: 'db',
  port: 3306,
});

const d = drizzle(connection, {
  schema: { ...schema, ...relationships },
  mode: 'default',
});

const db = wrapper(d);

const user = await db.query.user.findFirst();

console.log('user', user);

const update = await db
  .update(schema.user)
  .set({ updatedDate: '2024-01-18' })
  .where(eq(schema.user.id, 1));

console.log('update', update);
