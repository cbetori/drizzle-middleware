import { entityKind } from 'drizzle-orm';
import {
  MySqlTable,
  PreparedQueryHKTBase,
  MySqlSession,
  MySqlDialect,
  QueryResultHKT,
  MySqlInsertBuilder,
  MySqlInsertValue,
  MySqlInsertBase,
} from 'drizzle-orm/mysql-core';

export class InsertWrapper<
  TTable extends MySqlTable,
  TQueryResult extends QueryResultHKT,
  TPreparedQueryHKT extends PreparedQueryHKTBase,
> extends MySqlInsertBuilder<TTable, TQueryResult, TPreparedQueryHKT> {
  static readonly [entityKind]: string = 'MySqlUpdate';
  beforeInsert: Function[];
  afterInsert: Function[];

  runExecute: any;

  constructor(
    table: TTable,
    session: MySqlSession,
    dialect: MySqlDialect,
    beforeInsert: Function[],
    afterInsert: Function[],
  ) {
    super(table, session, dialect);
    this.beforeInsert = beforeInsert;
    this.afterInsert = afterInsert;
    this.runExecute = this.execute;
  }

  values(
    value: MySqlInsertValue<TTable>,
  ): MySqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT>;
  values(
    values: MySqlInsertValue<TTable>[],
  ): MySqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT>;
  values(values: MySqlInsertValue<TTable> | MySqlInsertValue<TTable>[]) {
    this.beforeInsert.forEach((f) => (values = f(values, this)));
    const res = super.values(values as any);
    this.runExecute = res.execute;
    // @ts-ignore
    res.execute = this.execute;
    res;
    return res;
  }

  execute = (placeholderValues) => {
    const res = this.runExecute(placeholderValues);
    this.afterInsert.forEach((f) => f(res, this));
    return res;
  };
}

export function insert<
  TTable extends MySqlTable,
  TPreparedQueryHKT extends MySqlSession,
  TDynamic extends MySqlDialect,
>(
  table: TTable,
  preparedQueryHKT: TPreparedQueryHKT,
  dynamic: TDynamic,
  beforeInsert: Function[],
  afterInsert: Function[],
) {
  return new InsertWrapper(
    table,
    preparedQueryHKT,
    dynamic,
    beforeInsert,
    afterInsert,
  );
}
