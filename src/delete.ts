import { entityKind, SQL } from 'drizzle-orm';
import {
  MySqlTable,
  PreparedQueryHKTBase,
  MySqlSession,
  MySqlDialect,
  MySqlDeleteBase,
} from 'drizzle-orm/mysql-core';

export class DeleteWrapper<
  TTable extends MySqlTable,
  TPreparedQueryHKT extends PreparedQueryHKTBase,
  TDynamic extends boolean = false,
  TExcludedMethods extends string = never,
> extends MySqlDeleteBase<
  TTable,
  any,
  TPreparedQueryHKT,
  TDynamic,
  TExcludedMethods
> {
  static readonly [entityKind]: string = 'MySqlUpdate';
  beforeDelete: Function[];
  afterDelete: Function[];

  constructor(
    table: TTable,
    session: MySqlSession,
    dialect: MySqlDialect,
    beforeDelete: Function[],
    afterDelete: Function[],
  ) {
    super(table, session, dialect);
    this.beforeDelete = beforeDelete;
    this.afterDelete = afterDelete;
  }

  where(where: SQL | undefined) {
    this.beforeDelete.forEach((f) => f(where, this));
    const res = super.where(where);
    return res;
  }

  execute: ReturnType<this['prepare']>['execute'] = (values) => {
    const res = super.prepare().execute(values);
    this.afterDelete.forEach((f) => f(res, this));
    return res;
  };
}

export function deleteWrapper<
  TTable extends MySqlTable,
  TPreparedQueryHKT extends MySqlSession,
  TDynamic extends MySqlDialect,
>(
  table: TTable,
  preparedQueryHKT: TPreparedQueryHKT,
  dynamic: TDynamic,
  beforeDelete: Function[],
  afterDelete: Function[],
) {
  return new DeleteWrapper(
    table,
    preparedQueryHKT,
    dynamic,
    beforeDelete,
    afterDelete,
  );
}
