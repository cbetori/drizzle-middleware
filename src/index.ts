import mysql from 'mysql2/promise';
import * as schema from './schema/schema';
import * as relationships from './schema/relationships';
import { wrapper } from './drizzle';
import { eq } from 'drizzle-orm';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'db',
  port: 3306,
});

const db = wrapper(connection, {
  schema: { ...schema, ...relationships },
  mode: 'default',
});

const user = await db.query.user.findFirst();

console.log('user', user);

const update = await db
  .update(schema.user)
  .set({ updatedDate: '2024-01-18' })
  .where(eq(schema.user.id, 1000000001));

console.log('update', update);
