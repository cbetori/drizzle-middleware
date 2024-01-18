import { entityKind, UpdateSet, SQL } from 'drizzle-orm';
import {
  MySqlTable,
  PreparedQueryHKTBase,
  MySqlSession,
  MySqlDialect,
  MySqlUpdateBase,
} from 'drizzle-orm/mysql-core';
import { QueryResultHKT } from 'drizzle-orm/pg-core';

export class WhereWrapper<
  TTable extends MySqlTable,
  TQueryResult extends QueryResultHKT,
  TPreparedQueryHKT extends PreparedQueryHKTBase,
  TDynamic extends boolean = false,
  TExcludedMethods extends string = never,
> extends MySqlUpdateBase<
  TTable,
  any,
  TPreparedQueryHKT,
  TDynamic,
  TExcludedMethods
> {
  static readonly [entityKind]: string = 'MySqlUpdate';

  constructor(
    table: TTable,
    set: UpdateSet,
    session: MySqlSession,
    dialect: MySqlDialect,
  ) {
    super(table, set, session, dialect);
  }

  where(where: SQL | undefined) {
    console.log('where', 'where');
    const res = super.where(where);
    return res;
  }
}

export function where<
  TTable extends MySqlTable,
  TQueryResult extends UpdateSet,
  TPreparedQueryHKT extends MySqlSession,
  TDynamic extends MySqlDialect,
>(
  table: TTable,
  queryResult: TQueryResult,
  preparedQueryHKT: TPreparedQueryHKT,
  dynamic: TDynamic,
) {
  return new WhereWrapper(table, queryResult, preparedQueryHKT, dynamic);
}
