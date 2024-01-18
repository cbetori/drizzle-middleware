import {
  MySqlTable,
  MySqlUpdateBuilder,
  PreparedQueryHKTBase,
  QueryResultHKT,
  TableConfig,
} from 'drizzle-orm/mysql-core';
import {
  drizzle,
  MySql2QueryResultHKT,
  MySql2PreparedQueryHKT,
  MySql2Client,
} from 'drizzle-orm/mysql2';

class Wrapper<
  TTable extends MySqlTable,
  TQueryResult extends QueryResultHKT,
  TPreparedQueryHKT extends PreparedQueryHKTBase,
> {
  private db: MySqlUpdateBuilder<
    MySqlTable<TableConfig>,
    MySql2QueryResultHKT,
    MySql2PreparedQueryHKT
  >;
  constructor(
    update: MySqlUpdateBuilder<
      MySqlTable<TableConfig>,
      MySql2QueryResultHKT,
      MySql2PreparedQueryHKT
    >,
    other: any,
  ) {
    this.db = update;
    console.log(other);
  }

  beforeUpdate(e: MySqlTable) {
    console.log(e);
  }

  set(e, ...rest) {
    console.log(e);
    console.log('fdasdfsaf');
    return this.db.set(e);
  }
}

export function update(
  update: MySqlUpdateBuilder<
    MySqlTable<TableConfig>,
    MySql2QueryResultHKT,
    MySql2PreparedQueryHKT
  >,
  other: any,
) {
  return new Wrapper(update, other) as unknown as MySqlUpdateBuilder<
    MySqlTable<TableConfig>,
    MySql2QueryResultHKT,
    MySql2PreparedQueryHKT
  >;
}
//
