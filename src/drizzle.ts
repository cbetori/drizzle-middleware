import {
  MySqlDialect,
  MySqlSession,
  MySqlTable,
  PreparedQueryHKTBase,
  QueryResultHKT,
  QueryResultKind,
} from 'drizzle-orm/mysql-core';
import { MySql2Database, MySql2DrizzleConfig } from 'drizzle-orm/mysql2';
import { update } from './update.js';
import { insert } from './insert.js';
import { deleteWrapper } from './delete.js';
import {
  TablesRelationalConfig,
  ExtractTablesWithRelations,
  RelationalSchemaConfig,
  SQLWrapper,
} from 'drizzle-orm';
import { ResultSetHeader } from 'mysql2';

class Wrapper<
  TQueryResult extends QueryResultHKT,
  TPreparedQueryHKT extends PreparedQueryHKTBase,
  TFullSchema extends Record<string, unknown> = {},
  TSchema extends TablesRelationalConfig = ExtractTablesWithRelations<TFullSchema>,
> {
  private client: MySql2Database<TSchema>;
  private dialect: MySqlDialect;
  private session: MySqlSession<any, any, any, any>;
  schema: RelationalSchemaConfig<TSchema> | undefined;

  beforeDelete: Function[];
  afterDelete: Function[];
  beforeUpdate: Function[];
  afterUpdate: Function[];
  beforeInsert: Function[];
  afterInsert: Function[];

  constructor(client: MySql2Database<TSchema>) {
    Object.assign(this, client);
    this.client = client;
    // @ts-ignore
    this.dialect = client.dialect;
    // @ts-ignore
    this.session = client.session;
    this.beforeDelete = [];
    this.afterDelete = [];
    this.beforeUpdate = [];
    this.afterUpdate = [];
    this.beforeInsert = [];
    this.afterInsert = [];
  }

  update<TTable extends MySqlTable>(e: TTable) {
    const res = update(
      e,
      this.session,
      this.dialect,
      this.beforeUpdate,
      this.afterUpdate,
    );
    return res;
  }

  delete<TTable extends MySqlTable>(e: TTable) {
    const res = deleteWrapper(
      e,
      this.session,
      this.dialect,
      this.beforeDelete,
      this.afterDelete,
    );
    return res;
  }

  insert<TTable extends MySqlTable>(e: TTable) {
    const res = insert(
      e,
      this.session,
      this.dialect,
      this.beforeInsert,
      this.afterInsert,
    );
    return res;
  }

  addHook(hookName: string, hookFunction: Function) {
    if (hookName === 'beforeDelete') {
      this.beforeDelete.push(hookFunction);
      return;
    }
    if (hookName === 'afterDelete') {
      this.afterDelete.push(hookFunction);
      return;
    }
    if (hookName === 'beforeUpdate') {
      this.beforeUpdate.push(hookFunction);
      return;
    }
    if (hookName === 'afterUpdate') {
      this.afterUpdate.push(hookFunction);
      return;
    }
    if (hookName === 'beforeInsert') {
      this.beforeInsert.push(hookFunction);
      return;
    }
    if (hookName === 'afterInsert') {
      this.afterInsert.push(hookFunction);
      return;
    }
  }
}

export function wrapper<
  TSchema extends Record<string, unknown> = Record<string, never>,
>(client: MySql2Database<TSchema>, config?: MySql2DrizzleConfig<TSchema>) {
  return new Wrapper(client) as unknown as MySql2Database<TSchema> & {
    addHook: any;
  };
}
