import { relations } from 'drizzle-orm';
import * as schema from './schema.js';
export const userRelations = relations(schema.user, ({ one, many }) => ({
  createdByuser: one(schema.user, {
    fields: [schema.user.createdBy],
    references: [schema.user.id],
  }),
  updatedByuser: one(schema.user, {
    fields: [schema.user.updatedBy],
    references: [schema.user.id],
  }),
  deletedByuser: one(schema.user, {
    fields: [schema.user.deletedBy],
    references: [schema.user.id],
  }),
}));
export const accesslogRelations = relations(
  schema.accesslog,
  ({ one, many }) => ({
    userIdaccesslog: one(schema.user, {
      fields: [schema.accesslog.userId],
      references: [schema.user.id],
    }),
    createdByaccesslog: one(schema.user, {
      fields: [schema.accesslog.createdBy],
      references: [schema.user.id],
    }),
    updatedByaccesslog: one(schema.user, {
      fields: [schema.accesslog.updatedBy],
      references: [schema.user.id],
    }),
    deletedByaccesslog: one(schema.user, {
      fields: [schema.accesslog.deletedBy],
      references: [schema.user.id],
    }),
  }),
);
