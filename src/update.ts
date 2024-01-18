import { MySqlDialect, MySqlSession, MySqlTable } from 'drizzle-orm/mysql-core';

import { where } from './where.js';
import { UpdateSet } from 'drizzle-orm';

class Wrapper<TTable extends MySqlTable> {
  private table: TTable;
  private session: MySqlSession;
  private dialect: MySqlDialect;

  constructor(
    table: TTable,
    session: MySqlSession,
    dialect: MySqlDialect,
    // other: any,
  ) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
  }

  beforeUpdate(e: MySqlTable) {
    console.log('update', 'beforeUpdate');
  }

  set(e: UpdateSet) {
    console.log('update', 'set');
    const res = where(this.table, e, this.session, this.dialect);
    return res;
  }
}

export function update(
  table: MySqlTable,
  session: MySqlSession,
  dialect: MySqlDialect,
) {
  return new Wrapper(table, session, dialect);
}
