import {
  mysqlTable,
  index,
  foreignKey,
  primaryKey,
  int,
  datetime,
  mysqlEnum,
  varchar,
  unique,
  tinyint,
  char,
} from 'drizzle-orm/mysql-core';

export const user = mysqlTable(
  'user',
  {
    id: int('id').autoincrement().notNull(),
    uuid: char('uuid', { length: 36 }).notNull(),
    firstName: varchar('firstName', { length: 255 }).notNull(),
    middleName: varchar('middleName', { length: 255 }),
    lastName: varchar('lastName', { length: 255 }).notNull(),
    prefix: varchar('prefix', { length: 255 }),
    suffix: varchar('suffix', { length: 255 }),
    password: varchar('password', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 255 }),
    allowSso: tinyint('allowSso').default(0).notNull(),
    homeFacilityId: int('homeFacilityId'),
    entity: int('entity').notNull(),
    lastSeen: datetime('lastSeen', { mode: 'string' })
      .default('2023-11-18 20:31:37')
      .notNull(),
    timezone: varchar('timezone', { length: 255 }),
    suspended: tinyint('suspended').default(0).notNull(),
    noAccess: tinyint('noAccess').default(0).notNull(),
    forcePasswordReset: tinyint('forcePasswordReset').default(0).notNull(),
    createdDate: datetime('createdDate', { mode: 'string' }).notNull(),
    updatedDate: datetime('updatedDate', { mode: 'string' }).notNull(),
    deletedDate: datetime('deletedDate', { mode: 'string' }),
    createdBy: int('createdBy'),
    updatedBy: int('updatedBy'),
    deletedBy: int('deletedBy'),
  },
  (table) => {
    return {
      createdBy: index('createdBy').on(table.createdBy),
      deletedBy: index('deletedBy').on(table.deletedBy),
      updatedBy: index('updatedBy').on(table.updatedBy),
      userIbfk1: foreignKey({
        columns: [table.createdBy],
        foreignColumns: [table.id],
        name: 'user_ibfk_1',
      })
        .onUpdate('cascade')
        .onDelete('set null'),
      userIbfk2: foreignKey({
        columns: [table.updatedBy],
        foreignColumns: [table.id],
        name: 'user_ibfk_2',
      })
        .onUpdate('cascade')
        .onDelete('set null'),
      userIbfk3: foreignKey({
        columns: [table.deletedBy],
        foreignColumns: [table.id],
        name: 'user_ibfk_3',
      })
        .onUpdate('cascade')
        .onDelete('set null'),
      userId: primaryKey({ columns: [table.id], name: 'user_id' }),
      email: unique('email').on(table.email),
    };
  },
);

export const accesslog = mysqlTable(
  'accesslog',
  {
    id: int('id').autoincrement().notNull(),
    caseId: int('caseId'),
    accessDate: datetime('accessDate', { mode: 'string' }),
    status: mysqlEnum('status', ['ERROR', 'SUCCESS', 'FAILED']),
    type: mysqlEnum('type', ['REFRESH', 'LOGIN', 'LOGOUT', 'LOAD']),
    resource: varchar('resource', { length: 255 }),
    description: varchar('description', { length: 255 }),
    userId: int('userId').references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    email: varchar('email', { length: 255 }),
    ip: varchar('ip', { length: 255 }),
    agent: varchar('agent', { length: 255 }),
    os: varchar('os', { length: 255 }),
    browser: varchar('browser', { length: 255 }),
    version: varchar('version', { length: 255 }),
    platform: varchar('platform', { length: 255 }),
    error: varchar('error', { length: 255 }),
    createdDate: datetime('createdDate', { mode: 'string' }).notNull(),
    updatedDate: datetime('updatedDate', { mode: 'string' }).notNull(),
    deletedDate: datetime('deletedDate', { mode: 'string' }),
    createdBy: int('createdBy').references(() => user.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
    updatedBy: int('updatedBy').references(() => user.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
    deletedBy: int('deletedBy').references(() => user.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
  },
  (table) => {
    return {
      createdBy: index('createdBy').on(table.createdBy),
      deletedBy: index('deletedBy').on(table.deletedBy),
      updatedBy: index('updatedBy').on(table.updatedBy),
      userId: index('userId').on(table.userId),
      accesslogId: primaryKey({ columns: [table.id], name: 'accesslog_id' }),
    };
  },
);
