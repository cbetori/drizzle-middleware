import {
  MySqlDialect,
  MySqlSession,
  MySqlTable,
  MySqlUpdateBase,
  PreparedQueryHKTBase,
  QueryResultHKT,
} from 'drizzle-orm/mysql-core';

import { SQL, UpdateSet, entityKind } from 'drizzle-orm';

export class WhereWrapper<
  TTable extends MySqlTable,
  TQueryResult extends QueryResultHKT,
  TPreparedQueryHKT extends PreparedQueryHKTBase,
  TDynamic extends boolean = false,
  TExcludedMethods extends string = never,
> extends MySqlUpdateBase<
  TTable,
  TQueryResult,
  TPreparedQueryHKT,
  TDynamic,
  TExcludedMethods
> {
  static readonly [entityKind]: string = 'MySqlUpdate';
  beforeUpdate: Function[];
  afterUpdate: Function[];

  constructor(
    table: TTable,
    set: UpdateSet,
    session: MySqlSession,
    dialect: MySqlDialect,
    beforeUpdate: Function[],
    afterUpdate: Function[],
  ) {
    super(table, set, session, dialect);
    this.beforeUpdate = beforeUpdate;
    this.afterUpdate = afterUpdate;
  }

  where(where: SQL | undefined) {
    const res = super.where(where);
    return res;
  }

  execute = (values) => {
    const res = super.prepare().execute(values);
    this.afterUpdate.forEach((f) => f(res, this));
    return res;
  };
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
  beforeUpdate: Function[],
  afterUpdate: Function[],
) {
  return new WhereWrapper(
    table,
    queryResult,
    preparedQueryHKT,
    dynamic,
    beforeUpdate,
    afterUpdate,
  );
}

class Wrapper<TTable extends MySqlTable> {
  private table: TTable;
  private session: MySqlSession;
  private dialect: MySqlDialect;
  beforeUpdate: Function[];
  afterUpdate: Function[];

  constructor(
    table: TTable,
    session: MySqlSession,
    dialect: MySqlDialect,
    beforeUpdate: Function[],
    afterUpdate: Function[],
  ) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.beforeUpdate = beforeUpdate;
    this.afterUpdate = afterUpdate;
  }

  set(values: UpdateSet) {
    this.beforeUpdate.forEach((f) => (values = f(values, this)));
    const res = where(
      this.table,
      values,
      this.session,
      this.dialect,
      this.beforeUpdate,
      this.afterUpdate,
    );
    return res;
  }
}

export function update(
  table: MySqlTable,
  session: MySqlSession,
  dialect: MySqlDialect,
  beforeUpdate: Function[],
  afterUpdate: Function[],
) {
  return new Wrapper(table, session, dialect, beforeUpdate, afterUpdate);
}
