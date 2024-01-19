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
db.addHook('beforeUpdate', (values) => {
  values.updatedDate = new Date();
  return values;
});

const update = await db
  .update(schema.user)
  .set({ updatedDate: '2024-01-29' })
  .where(eq(schema.user.id, 1));

console.log('update', update);

const user = await db.query.user.findFirst();

console.log('user', user);

const del = await db.delete(schema.user).where(eq(schema.user.id, 0));
console.log('del', del);

const { id, email, ...newUser } = user;

const insert = await db.insert(schema.user).values({
  ...newUser,
  email: (Math.random() + 1).toString(36).substring(7),
} as any);

console.log('insert', insert);
