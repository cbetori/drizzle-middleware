import {
  MySqlDialect,
  MySqlSession,
  MySqlTable,
  PreparedQueryHKTBase,
  QueryResultHKT,
} from 'drizzle-orm/mysql-core';
import { MySql2Database, MySql2DrizzleConfig } from 'drizzle-orm/mysql2';
import { update } from './update.js';
import {
  TablesRelationalConfig,
  ExtractTablesWithRelations,
  RelationalSchemaConfig,
} from 'drizzle-orm';

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

  constructor(client: MySql2Database<TSchema>) {
    Object.assign(this, client);
    this.client = client;
    // @ts-ignore
    this.dialect = client.dialect;
    // @ts-ignore
    this.session = client.session;
  }

  update<TTable extends MySqlTable>(e: TTable) {
    const res = update(e, this.session, this.dialect);
    console.log('drizzle', 'update');
    return res;
  }
}

export function wrapper<
  TSchema extends Record<string, unknown> = Record<string, never>,
>(client: MySql2Database<TSchema>, config?: MySql2DrizzleConfig<TSchema>) {
  // console.log(client._.schema);
  // const dialect = new MySqlDialect();

  console.log(client._.schema);
  return new Wrapper(client) as unknown as MySql2Database<TSchema>;
}
//
