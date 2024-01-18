import { MySqlTable } from 'drizzle-orm/mysql-core';
import {
  MySql2Database,
  drizzle,
  MySql2DrizzleConfig,
  MySql2Client,
} from 'drizzle-orm/mysql2';
import { update } from './update';

class Wrapper<TSchema extends Record<string, unknown> = Record<string, never>> {
  private db: MySql2Database<TSchema>;
  private query: MySql2Database<TSchema>['query'];

  constructor(client: MySql2Client, config?: MySql2DrizzleConfig<TSchema>) {
    this.db = drizzle(client, config);
    this.select = this.db.select;
    this.query = this.callQuery();
  }

  beforeUpdate(e: MySqlTable) {
    console.log(e);
  }

  callQuery() {
    console.log('query');
    return this.db.query;
  }

  update(e: MySqlTable) {
    this.beforeUpdate(e);
    const res = update(this.db.update(e), e);
    console.log('update fin');
    return res;
  }

  select() {
    console.log('select');
    return this.db.select();
  }
}

export function wrapper<
  TSchema extends Record<string, unknown> = Record<string, never>,
>(client: MySql2Client, config?: MySql2DrizzleConfig<TSchema>) {
  return new Wrapper(client, config) as unknown as MySql2Database<TSchema>;
}
//
