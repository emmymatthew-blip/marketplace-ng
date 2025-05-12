
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model account
 * 
 */
export type account = $Result.DefaultSelection<Prisma.$accountPayload>
/**
 * Model agreement
 * 
 */
export type agreement = $Result.DefaultSelection<Prisma.$agreementPayload>
/**
 * Model complaint
 * 
 */
export type complaint = $Result.DefaultSelection<Prisma.$complaintPayload>
/**
 * Model democlass
 * 
 */
export type democlass = $Result.DefaultSelection<Prisma.$democlassPayload>
/**
 * Model forumcategory
 * 
 */
export type forumcategory = $Result.DefaultSelection<Prisma.$forumcategoryPayload>
/**
 * Model forumpost
 * 
 */
export type forumpost = $Result.DefaultSelection<Prisma.$forumpostPayload>
/**
 * Model forumthread
 * 
 */
export type forumthread = $Result.DefaultSelection<Prisma.$forumthreadPayload>
/**
 * Model product
 * 
 */
export type product = $Result.DefaultSelection<Prisma.$productPayload>
/**
 * Model session
 * 
 */
export type session = $Result.DefaultSelection<Prisma.$sessionPayload>
/**
 * Model user
 * 
 */
export type user = $Result.DefaultSelection<Prisma.$userPayload>
/**
 * Model verificationtoken
 * 
 */
export type verificationtoken = $Result.DefaultSelection<Prisma.$verificationtokenPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const agreement_status: {
  PROPOSED: 'PROPOSED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  DISPUTED: 'DISPUTED'
};

export type agreement_status = (typeof agreement_status)[keyof typeof agreement_status]


export const user_role: {
  PRINTER: 'PRINTER',
  MANUFACTURER: 'MANUFACTURER',
  CONSUMER: 'CONSUMER',
  ADMIN: 'ADMIN'
};

export type user_role = (typeof user_role)[keyof typeof user_role]


export const democlass_status: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type democlass_status = (typeof democlass_status)[keyof typeof democlass_status]


export const user_cipponMembershipType: {
  INDIVIDUAL: 'INDIVIDUAL',
  CORPORATE: 'CORPORATE',
  NONE: 'NONE'
};

export type user_cipponMembershipType = (typeof user_cipponMembershipType)[keyof typeof user_cipponMembershipType]

}

export type agreement_status = $Enums.agreement_status

export const agreement_status: typeof $Enums.agreement_status

export type user_role = $Enums.user_role

export const user_role: typeof $Enums.user_role

export type democlass_status = $Enums.democlass_status

export const democlass_status: typeof $Enums.democlass_status

export type user_cipponMembershipType = $Enums.user_cipponMembershipType

export const user_cipponMembershipType: typeof $Enums.user_cipponMembershipType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Accounts
 * const accounts = await prisma.account.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.account`: Exposes CRUD operations for the **account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.accountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.agreement`: Exposes CRUD operations for the **agreement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Agreements
    * const agreements = await prisma.agreement.findMany()
    * ```
    */
  get agreement(): Prisma.agreementDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.complaint`: Exposes CRUD operations for the **complaint** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Complaints
    * const complaints = await prisma.complaint.findMany()
    * ```
    */
  get complaint(): Prisma.complaintDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.democlass`: Exposes CRUD operations for the **democlass** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Democlasses
    * const democlasses = await prisma.democlass.findMany()
    * ```
    */
  get democlass(): Prisma.democlassDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.forumcategory`: Exposes CRUD operations for the **forumcategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Forumcategories
    * const forumcategories = await prisma.forumcategory.findMany()
    * ```
    */
  get forumcategory(): Prisma.forumcategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.forumpost`: Exposes CRUD operations for the **forumpost** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Forumposts
    * const forumposts = await prisma.forumpost.findMany()
    * ```
    */
  get forumpost(): Prisma.forumpostDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.forumthread`: Exposes CRUD operations for the **forumthread** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Forumthreads
    * const forumthreads = await prisma.forumthread.findMany()
    * ```
    */
  get forumthread(): Prisma.forumthreadDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.productDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.sessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **user** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.userDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verificationtoken`: Exposes CRUD operations for the **verificationtoken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Verificationtokens
    * const verificationtokens = await prisma.verificationtoken.findMany()
    * ```
    */
  get verificationtoken(): Prisma.verificationtokenDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    account: 'account',
    agreement: 'agreement',
    complaint: 'complaint',
    democlass: 'democlass',
    forumcategory: 'forumcategory',
    forumpost: 'forumpost',
    forumthread: 'forumthread',
    product: 'product',
    session: 'session',
    user: 'user',
    verificationtoken: 'verificationtoken'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "account" | "agreement" | "complaint" | "democlass" | "forumcategory" | "forumpost" | "forumthread" | "product" | "session" | "user" | "verificationtoken"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      account: {
        payload: Prisma.$accountPayload<ExtArgs>
        fields: Prisma.accountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.accountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.accountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountPayload>
          }
          findFirst: {
            args: Prisma.accountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.accountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountPayload>
          }
          findMany: {
            args: Prisma.accountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountPayload>[]
          }
          create: {
            args: Prisma.accountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountPayload>
          }
          createMany: {
            args: Prisma.accountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.accountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountPayload>
          }
          update: {
            args: Prisma.accountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountPayload>
          }
          deleteMany: {
            args: Prisma.accountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.accountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.accountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.accountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.accountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      agreement: {
        payload: Prisma.$agreementPayload<ExtArgs>
        fields: Prisma.agreementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.agreementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$agreementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.agreementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$agreementPayload>
          }
          findFirst: {
            args: Prisma.agreementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$agreementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.agreementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$agreementPayload>
          }
          findMany: {
            args: Prisma.agreementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$agreementPayload>[]
          }
          create: {
            args: Prisma.agreementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$agreementPayload>
          }
          createMany: {
            args: Prisma.agreementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.agreementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$agreementPayload>
          }
          update: {
            args: Prisma.agreementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$agreementPayload>
          }
          deleteMany: {
            args: Prisma.agreementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.agreementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.agreementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$agreementPayload>
          }
          aggregate: {
            args: Prisma.AgreementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgreement>
          }
          groupBy: {
            args: Prisma.agreementGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgreementGroupByOutputType>[]
          }
          count: {
            args: Prisma.agreementCountArgs<ExtArgs>
            result: $Utils.Optional<AgreementCountAggregateOutputType> | number
          }
        }
      }
      complaint: {
        payload: Prisma.$complaintPayload<ExtArgs>
        fields: Prisma.complaintFieldRefs
        operations: {
          findUnique: {
            args: Prisma.complaintFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$complaintPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.complaintFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$complaintPayload>
          }
          findFirst: {
            args: Prisma.complaintFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$complaintPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.complaintFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$complaintPayload>
          }
          findMany: {
            args: Prisma.complaintFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$complaintPayload>[]
          }
          create: {
            args: Prisma.complaintCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$complaintPayload>
          }
          createMany: {
            args: Prisma.complaintCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.complaintDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$complaintPayload>
          }
          update: {
            args: Prisma.complaintUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$complaintPayload>
          }
          deleteMany: {
            args: Prisma.complaintDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.complaintUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.complaintUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$complaintPayload>
          }
          aggregate: {
            args: Prisma.ComplaintAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateComplaint>
          }
          groupBy: {
            args: Prisma.complaintGroupByArgs<ExtArgs>
            result: $Utils.Optional<ComplaintGroupByOutputType>[]
          }
          count: {
            args: Prisma.complaintCountArgs<ExtArgs>
            result: $Utils.Optional<ComplaintCountAggregateOutputType> | number
          }
        }
      }
      democlass: {
        payload: Prisma.$democlassPayload<ExtArgs>
        fields: Prisma.democlassFieldRefs
        operations: {
          findUnique: {
            args: Prisma.democlassFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$democlassPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.democlassFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$democlassPayload>
          }
          findFirst: {
            args: Prisma.democlassFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$democlassPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.democlassFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$democlassPayload>
          }
          findMany: {
            args: Prisma.democlassFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$democlassPayload>[]
          }
          create: {
            args: Prisma.democlassCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$democlassPayload>
          }
          createMany: {
            args: Prisma.democlassCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.democlassDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$democlassPayload>
          }
          update: {
            args: Prisma.democlassUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$democlassPayload>
          }
          deleteMany: {
            args: Prisma.democlassDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.democlassUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.democlassUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$democlassPayload>
          }
          aggregate: {
            args: Prisma.DemoclassAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDemoclass>
          }
          groupBy: {
            args: Prisma.democlassGroupByArgs<ExtArgs>
            result: $Utils.Optional<DemoclassGroupByOutputType>[]
          }
          count: {
            args: Prisma.democlassCountArgs<ExtArgs>
            result: $Utils.Optional<DemoclassCountAggregateOutputType> | number
          }
        }
      }
      forumcategory: {
        payload: Prisma.$forumcategoryPayload<ExtArgs>
        fields: Prisma.forumcategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.forumcategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumcategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.forumcategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumcategoryPayload>
          }
          findFirst: {
            args: Prisma.forumcategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumcategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.forumcategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumcategoryPayload>
          }
          findMany: {
            args: Prisma.forumcategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumcategoryPayload>[]
          }
          create: {
            args: Prisma.forumcategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumcategoryPayload>
          }
          createMany: {
            args: Prisma.forumcategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.forumcategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumcategoryPayload>
          }
          update: {
            args: Prisma.forumcategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumcategoryPayload>
          }
          deleteMany: {
            args: Prisma.forumcategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.forumcategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.forumcategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumcategoryPayload>
          }
          aggregate: {
            args: Prisma.ForumcategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateForumcategory>
          }
          groupBy: {
            args: Prisma.forumcategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<ForumcategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.forumcategoryCountArgs<ExtArgs>
            result: $Utils.Optional<ForumcategoryCountAggregateOutputType> | number
          }
        }
      }
      forumpost: {
        payload: Prisma.$forumpostPayload<ExtArgs>
        fields: Prisma.forumpostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.forumpostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumpostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.forumpostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumpostPayload>
          }
          findFirst: {
            args: Prisma.forumpostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumpostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.forumpostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumpostPayload>
          }
          findMany: {
            args: Prisma.forumpostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumpostPayload>[]
          }
          create: {
            args: Prisma.forumpostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumpostPayload>
          }
          createMany: {
            args: Prisma.forumpostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.forumpostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumpostPayload>
          }
          update: {
            args: Prisma.forumpostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumpostPayload>
          }
          deleteMany: {
            args: Prisma.forumpostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.forumpostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.forumpostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumpostPayload>
          }
          aggregate: {
            args: Prisma.ForumpostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateForumpost>
          }
          groupBy: {
            args: Prisma.forumpostGroupByArgs<ExtArgs>
            result: $Utils.Optional<ForumpostGroupByOutputType>[]
          }
          count: {
            args: Prisma.forumpostCountArgs<ExtArgs>
            result: $Utils.Optional<ForumpostCountAggregateOutputType> | number
          }
        }
      }
      forumthread: {
        payload: Prisma.$forumthreadPayload<ExtArgs>
        fields: Prisma.forumthreadFieldRefs
        operations: {
          findUnique: {
            args: Prisma.forumthreadFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumthreadPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.forumthreadFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumthreadPayload>
          }
          findFirst: {
            args: Prisma.forumthreadFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumthreadPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.forumthreadFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumthreadPayload>
          }
          findMany: {
            args: Prisma.forumthreadFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumthreadPayload>[]
          }
          create: {
            args: Prisma.forumthreadCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumthreadPayload>
          }
          createMany: {
            args: Prisma.forumthreadCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.forumthreadDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumthreadPayload>
          }
          update: {
            args: Prisma.forumthreadUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumthreadPayload>
          }
          deleteMany: {
            args: Prisma.forumthreadDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.forumthreadUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.forumthreadUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$forumthreadPayload>
          }
          aggregate: {
            args: Prisma.ForumthreadAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateForumthread>
          }
          groupBy: {
            args: Prisma.forumthreadGroupByArgs<ExtArgs>
            result: $Utils.Optional<ForumthreadGroupByOutputType>[]
          }
          count: {
            args: Prisma.forumthreadCountArgs<ExtArgs>
            result: $Utils.Optional<ForumthreadCountAggregateOutputType> | number
          }
        }
      }
      product: {
        payload: Prisma.$productPayload<ExtArgs>
        fields: Prisma.productFieldRefs
        operations: {
          findUnique: {
            args: Prisma.productFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.productFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          findFirst: {
            args: Prisma.productFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.productFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          findMany: {
            args: Prisma.productFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>[]
          }
          create: {
            args: Prisma.productCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          createMany: {
            args: Prisma.productCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.productDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          update: {
            args: Prisma.productUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          deleteMany: {
            args: Prisma.productDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.productUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.productUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.productGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.productCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      session: {
        payload: Prisma.$sessionPayload<ExtArgs>
        fields: Prisma.sessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.sessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.sessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionPayload>
          }
          findFirst: {
            args: Prisma.sessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.sessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionPayload>
          }
          findMany: {
            args: Prisma.sessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionPayload>[]
          }
          create: {
            args: Prisma.sessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionPayload>
          }
          createMany: {
            args: Prisma.sessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.sessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionPayload>
          }
          update: {
            args: Prisma.sessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionPayload>
          }
          deleteMany: {
            args: Prisma.sessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.sessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.sessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.sessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.sessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      user: {
        payload: Prisma.$userPayload<ExtArgs>
        fields: Prisma.userFieldRefs
        operations: {
          findUnique: {
            args: Prisma.userFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.userFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          findFirst: {
            args: Prisma.userFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.userFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          findMany: {
            args: Prisma.userFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>[]
          }
          create: {
            args: Prisma.userCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          createMany: {
            args: Prisma.userCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.userDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          update: {
            args: Prisma.userUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          deleteMany: {
            args: Prisma.userDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.userUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.userUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.userGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.userCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      verificationtoken: {
        payload: Prisma.$verificationtokenPayload<ExtArgs>
        fields: Prisma.verificationtokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.verificationtokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationtokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.verificationtokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationtokenPayload>
          }
          findFirst: {
            args: Prisma.verificationtokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationtokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.verificationtokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationtokenPayload>
          }
          findMany: {
            args: Prisma.verificationtokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationtokenPayload>[]
          }
          create: {
            args: Prisma.verificationtokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationtokenPayload>
          }
          createMany: {
            args: Prisma.verificationtokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.verificationtokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationtokenPayload>
          }
          update: {
            args: Prisma.verificationtokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationtokenPayload>
          }
          deleteMany: {
            args: Prisma.verificationtokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.verificationtokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.verificationtokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationtokenPayload>
          }
          aggregate: {
            args: Prisma.VerificationtokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerificationtoken>
          }
          groupBy: {
            args: Prisma.verificationtokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationtokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.verificationtokenCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationtokenCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    account?: accountOmit
    agreement?: agreementOmit
    complaint?: complaintOmit
    democlass?: democlassOmit
    forumcategory?: forumcategoryOmit
    forumpost?: forumpostOmit
    forumthread?: forumthreadOmit
    product?: productOmit
    session?: sessionOmit
    user?: userOmit
    verificationtoken?: verificationtokenOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AgreementCountOutputType
   */

  export type AgreementCountOutputType = {
    complaint: number
  }

  export type AgreementCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    complaint?: boolean | AgreementCountOutputTypeCountComplaintArgs
  }

  // Custom InputTypes
  /**
   * AgreementCountOutputType without action
   */
  export type AgreementCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgreementCountOutputType
     */
    select?: AgreementCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AgreementCountOutputType without action
   */
  export type AgreementCountOutputTypeCountComplaintArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: complaintWhereInput
  }


  /**
   * Count Type ForumcategoryCountOutputType
   */

  export type ForumcategoryCountOutputType = {
    forumthread: number
  }

  export type ForumcategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    forumthread?: boolean | ForumcategoryCountOutputTypeCountForumthreadArgs
  }

  // Custom InputTypes
  /**
   * ForumcategoryCountOutputType without action
   */
  export type ForumcategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ForumcategoryCountOutputType
     */
    select?: ForumcategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ForumcategoryCountOutputType without action
   */
  export type ForumcategoryCountOutputTypeCountForumthreadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: forumthreadWhereInput
  }


  /**
   * Count Type ForumthreadCountOutputType
   */

  export type ForumthreadCountOutputType = {
    forumpost: number
  }

  export type ForumthreadCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    forumpost?: boolean | ForumthreadCountOutputTypeCountForumpostArgs
  }

  // Custom InputTypes
  /**
   * ForumthreadCountOutputType without action
   */
  export type ForumthreadCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ForumthreadCountOutputType
     */
    select?: ForumthreadCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ForumthreadCountOutputType without action
   */
  export type ForumthreadCountOutputTypeCountForumpostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: forumpostWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    account: number
    agreement_agreement_initiatorIdTouser: number
    agreement_agreement_receiverIdTouser: number
    complaint: number
    democlass: number
    forumpost: number
    forumthread: number
    product: number
    session: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | UserCountOutputTypeCountAccountArgs
    agreement_agreement_initiatorIdTouser?: boolean | UserCountOutputTypeCountAgreement_agreement_initiatorIdTouserArgs
    agreement_agreement_receiverIdTouser?: boolean | UserCountOutputTypeCountAgreement_agreement_receiverIdTouserArgs
    complaint?: boolean | UserCountOutputTypeCountComplaintArgs
    democlass?: boolean | UserCountOutputTypeCountDemoclassArgs
    forumpost?: boolean | UserCountOutputTypeCountForumpostArgs
    forumthread?: boolean | UserCountOutputTypeCountForumthreadArgs
    product?: boolean | UserCountOutputTypeCountProductArgs
    session?: boolean | UserCountOutputTypeCountSessionArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: accountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAgreement_agreement_initiatorIdTouserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: agreementWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAgreement_agreement_receiverIdTouserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: agreementWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountComplaintArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: complaintWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDemoclassArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: democlassWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountForumpostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: forumpostWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountForumthreadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: forumthreadWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProductArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: productWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: sessionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountSumAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refresh_token: number
    access_token: number
    expires_at: number
    token_type: number
    scope: number
    id_token: number
    session_state: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    expires_at?: true
  }

  export type AccountSumAggregateInputType = {
    expires_at?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which account to aggregate.
     */
    where?: accountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountOrderByWithRelationInput | accountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: accountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type accountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: accountWhereInput
    orderBy?: accountOrderByWithAggregationInput | accountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: accountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends accountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type accountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>



  export type accountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
  }

  export type accountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "provider" | "providerAccountId" | "refresh_token" | "access_token" | "expires_at" | "token_type" | "scope" | "id_token" | "session_state", ExtArgs["result"]["account"]>
  export type accountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | userDefaultArgs<ExtArgs>
  }

  export type $accountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "account"
    objects: {
      user: Prisma.$userPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      provider: string
      providerAccountId: string
      refresh_token: string | null
      access_token: string | null
      expires_at: number | null
      token_type: string | null
      scope: string | null
      id_token: string | null
      session_state: string | null
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type accountGetPayload<S extends boolean | null | undefined | accountDefaultArgs> = $Result.GetResult<Prisma.$accountPayload, S>

  type accountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<accountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface accountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['account'], meta: { name: 'account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {accountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends accountFindUniqueArgs>(args: SelectSubset<T, accountFindUniqueArgs<ExtArgs>>): Prisma__accountClient<$Result.GetResult<Prisma.$accountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {accountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends accountFindUniqueOrThrowArgs>(args: SelectSubset<T, accountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__accountClient<$Result.GetResult<Prisma.$accountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends accountFindFirstArgs>(args?: SelectSubset<T, accountFindFirstArgs<ExtArgs>>): Prisma__accountClient<$Result.GetResult<Prisma.$accountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends accountFindFirstOrThrowArgs>(args?: SelectSubset<T, accountFindFirstOrThrowArgs<ExtArgs>>): Prisma__accountClient<$Result.GetResult<Prisma.$accountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends accountFindManyArgs>(args?: SelectSubset<T, accountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$accountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {accountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends accountCreateArgs>(args: SelectSubset<T, accountCreateArgs<ExtArgs>>): Prisma__accountClient<$Result.GetResult<Prisma.$accountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {accountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends accountCreateManyArgs>(args?: SelectSubset<T, accountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Account.
     * @param {accountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends accountDeleteArgs>(args: SelectSubset<T, accountDeleteArgs<ExtArgs>>): Prisma__accountClient<$Result.GetResult<Prisma.$accountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {accountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends accountUpdateArgs>(args: SelectSubset<T, accountUpdateArgs<ExtArgs>>): Prisma__accountClient<$Result.GetResult<Prisma.$accountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {accountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends accountDeleteManyArgs>(args?: SelectSubset<T, accountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends accountUpdateManyArgs>(args: SelectSubset<T, accountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Account.
     * @param {accountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends accountUpsertArgs>(args: SelectSubset<T, accountUpsertArgs<ExtArgs>>): Prisma__accountClient<$Result.GetResult<Prisma.$accountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends accountCountArgs>(
      args?: Subset<T, accountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends accountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: accountGroupByArgs['orderBy'] }
        : { orderBy?: accountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, accountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the account model
   */
  readonly fields: accountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__accountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, userDefaultArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the account model
   */
  interface accountFieldRefs {
    readonly id: FieldRef<"account", 'String'>
    readonly userId: FieldRef<"account", 'String'>
    readonly type: FieldRef<"account", 'String'>
    readonly provider: FieldRef<"account", 'String'>
    readonly providerAccountId: FieldRef<"account", 'String'>
    readonly refresh_token: FieldRef<"account", 'String'>
    readonly access_token: FieldRef<"account", 'String'>
    readonly expires_at: FieldRef<"account", 'Int'>
    readonly token_type: FieldRef<"account", 'String'>
    readonly scope: FieldRef<"account", 'String'>
    readonly id_token: FieldRef<"account", 'String'>
    readonly session_state: FieldRef<"account", 'String'>
  }
    

  // Custom InputTypes
  /**
   * account findUnique
   */
  export type accountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account
     */
    select?: accountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the account
     */
    omit?: accountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountInclude<ExtArgs> | null
    /**
     * Filter, which account to fetch.
     */
    where: accountWhereUniqueInput
  }

  /**
   * account findUniqueOrThrow
   */
  export type accountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account
     */
    select?: accountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the account
     */
    omit?: accountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountInclude<ExtArgs> | null
    /**
     * Filter, which account to fetch.
     */
    where: accountWhereUniqueInput
  }

  /**
   * account findFirst
   */
  export type accountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account
     */
    select?: accountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the account
     */
    omit?: accountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountInclude<ExtArgs> | null
    /**
     * Filter, which account to fetch.
     */
    where?: accountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountOrderByWithRelationInput | accountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for accounts.
     */
    cursor?: accountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * account findFirstOrThrow
   */
  export type accountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account
     */
    select?: accountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the account
     */
    omit?: accountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountInclude<ExtArgs> | null
    /**
     * Filter, which account to fetch.
     */
    where?: accountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountOrderByWithRelationInput | accountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for accounts.
     */
    cursor?: accountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * account findMany
   */
  export type accountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account
     */
    select?: accountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the account
     */
    omit?: accountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where?: accountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountOrderByWithRelationInput | accountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing accounts.
     */
    cursor?: accountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * account create
   */
  export type accountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account
     */
    select?: accountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the account
     */
    omit?: accountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountInclude<ExtArgs> | null
    /**
     * The data needed to create a account.
     */
    data: XOR<accountCreateInput, accountUncheckedCreateInput>
  }

  /**
   * account createMany
   */
  export type accountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many accounts.
     */
    data: accountCreateManyInput | accountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * account update
   */
  export type accountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account
     */
    select?: accountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the account
     */
    omit?: accountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountInclude<ExtArgs> | null
    /**
     * The data needed to update a account.
     */
    data: XOR<accountUpdateInput, accountUncheckedUpdateInput>
    /**
     * Choose, which account to update.
     */
    where: accountWhereUniqueInput
  }

  /**
   * account updateMany
   */
  export type accountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update accounts.
     */
    data: XOR<accountUpdateManyMutationInput, accountUncheckedUpdateManyInput>
    /**
     * Filter which accounts to update
     */
    where?: accountWhereInput
    /**
     * Limit how many accounts to update.
     */
    limit?: number
  }

  /**
   * account upsert
   */
  export type accountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account
     */
    select?: accountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the account
     */
    omit?: accountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountInclude<ExtArgs> | null
    /**
     * The filter to search for the account to update in case it exists.
     */
    where: accountWhereUniqueInput
    /**
     * In case the account found by the `where` argument doesn't exist, create a new account with this data.
     */
    create: XOR<accountCreateInput, accountUncheckedCreateInput>
    /**
     * In case the account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<accountUpdateInput, accountUncheckedUpdateInput>
  }

  /**
   * account delete
   */
  export type accountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account
     */
    select?: accountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the account
     */
    omit?: accountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountInclude<ExtArgs> | null
    /**
     * Filter which account to delete.
     */
    where: accountWhereUniqueInput
  }

  /**
   * account deleteMany
   */
  export type accountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which accounts to delete
     */
    where?: accountWhereInput
    /**
     * Limit how many accounts to delete.
     */
    limit?: number
  }

  /**
   * account without action
   */
  export type accountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account
     */
    select?: accountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the account
     */
    omit?: accountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountInclude<ExtArgs> | null
  }


  /**
   * Model agreement
   */

  export type AggregateAgreement = {
    _count: AgreementCountAggregateOutputType | null
    _min: AgreementMinAggregateOutputType | null
    _max: AgreementMaxAggregateOutputType | null
  }

  export type AgreementMinAggregateOutputType = {
    id: string | null
    initiatorId: string | null
    receiverId: string | null
    status: $Enums.agreement_status | null
    terms: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AgreementMaxAggregateOutputType = {
    id: string | null
    initiatorId: string | null
    receiverId: string | null
    status: $Enums.agreement_status | null
    terms: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AgreementCountAggregateOutputType = {
    id: number
    initiatorId: number
    receiverId: number
    status: number
    terms: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AgreementMinAggregateInputType = {
    id?: true
    initiatorId?: true
    receiverId?: true
    status?: true
    terms?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AgreementMaxAggregateInputType = {
    id?: true
    initiatorId?: true
    receiverId?: true
    status?: true
    terms?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AgreementCountAggregateInputType = {
    id?: true
    initiatorId?: true
    receiverId?: true
    status?: true
    terms?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AgreementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which agreement to aggregate.
     */
    where?: agreementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of agreements to fetch.
     */
    orderBy?: agreementOrderByWithRelationInput | agreementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: agreementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` agreements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` agreements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned agreements
    **/
    _count?: true | AgreementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgreementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgreementMaxAggregateInputType
  }

  export type GetAgreementAggregateType<T extends AgreementAggregateArgs> = {
        [P in keyof T & keyof AggregateAgreement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgreement[P]>
      : GetScalarType<T[P], AggregateAgreement[P]>
  }




  export type agreementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: agreementWhereInput
    orderBy?: agreementOrderByWithAggregationInput | agreementOrderByWithAggregationInput[]
    by: AgreementScalarFieldEnum[] | AgreementScalarFieldEnum
    having?: agreementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgreementCountAggregateInputType | true
    _min?: AgreementMinAggregateInputType
    _max?: AgreementMaxAggregateInputType
  }

  export type AgreementGroupByOutputType = {
    id: string
    initiatorId: string
    receiverId: string
    status: $Enums.agreement_status
    terms: string
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: AgreementCountAggregateOutputType | null
    _min: AgreementMinAggregateOutputType | null
    _max: AgreementMaxAggregateOutputType | null
  }

  type GetAgreementGroupByPayload<T extends agreementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgreementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgreementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgreementGroupByOutputType[P]>
            : GetScalarType<T[P], AgreementGroupByOutputType[P]>
        }
      >
    >


  export type agreementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    initiatorId?: boolean
    receiverId?: boolean
    status?: boolean
    terms?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user_agreement_initiatorIdTouser?: boolean | userDefaultArgs<ExtArgs>
    user_agreement_receiverIdTouser?: boolean | userDefaultArgs<ExtArgs>
    complaint?: boolean | agreement$complaintArgs<ExtArgs>
    _count?: boolean | AgreementCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agreement"]>



  export type agreementSelectScalar = {
    id?: boolean
    initiatorId?: boolean
    receiverId?: boolean
    status?: boolean
    terms?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type agreementOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "initiatorId" | "receiverId" | "status" | "terms" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["agreement"]>
  export type agreementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user_agreement_initiatorIdTouser?: boolean | userDefaultArgs<ExtArgs>
    user_agreement_receiverIdTouser?: boolean | userDefaultArgs<ExtArgs>
    complaint?: boolean | agreement$complaintArgs<ExtArgs>
    _count?: boolean | AgreementCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $agreementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "agreement"
    objects: {
      user_agreement_initiatorIdTouser: Prisma.$userPayload<ExtArgs>
      user_agreement_receiverIdTouser: Prisma.$userPayload<ExtArgs>
      complaint: Prisma.$complaintPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      initiatorId: string
      receiverId: string
      status: $Enums.agreement_status
      terms: string
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["agreement"]>
    composites: {}
  }

  type agreementGetPayload<S extends boolean | null | undefined | agreementDefaultArgs> = $Result.GetResult<Prisma.$agreementPayload, S>

  type agreementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<agreementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AgreementCountAggregateInputType | true
    }

  export interface agreementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['agreement'], meta: { name: 'agreement' } }
    /**
     * Find zero or one Agreement that matches the filter.
     * @param {agreementFindUniqueArgs} args - Arguments to find a Agreement
     * @example
     * // Get one Agreement
     * const agreement = await prisma.agreement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends agreementFindUniqueArgs>(args: SelectSubset<T, agreementFindUniqueArgs<ExtArgs>>): Prisma__agreementClient<$Result.GetResult<Prisma.$agreementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Agreement that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {agreementFindUniqueOrThrowArgs} args - Arguments to find a Agreement
     * @example
     * // Get one Agreement
     * const agreement = await prisma.agreement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends agreementFindUniqueOrThrowArgs>(args: SelectSubset<T, agreementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__agreementClient<$Result.GetResult<Prisma.$agreementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Agreement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agreementFindFirstArgs} args - Arguments to find a Agreement
     * @example
     * // Get one Agreement
     * const agreement = await prisma.agreement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends agreementFindFirstArgs>(args?: SelectSubset<T, agreementFindFirstArgs<ExtArgs>>): Prisma__agreementClient<$Result.GetResult<Prisma.$agreementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Agreement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agreementFindFirstOrThrowArgs} args - Arguments to find a Agreement
     * @example
     * // Get one Agreement
     * const agreement = await prisma.agreement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends agreementFindFirstOrThrowArgs>(args?: SelectSubset<T, agreementFindFirstOrThrowArgs<ExtArgs>>): Prisma__agreementClient<$Result.GetResult<Prisma.$agreementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Agreements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agreementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Agreements
     * const agreements = await prisma.agreement.findMany()
     * 
     * // Get first 10 Agreements
     * const agreements = await prisma.agreement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agreementWithIdOnly = await prisma.agreement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends agreementFindManyArgs>(args?: SelectSubset<T, agreementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$agreementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Agreement.
     * @param {agreementCreateArgs} args - Arguments to create a Agreement.
     * @example
     * // Create one Agreement
     * const Agreement = await prisma.agreement.create({
     *   data: {
     *     // ... data to create a Agreement
     *   }
     * })
     * 
     */
    create<T extends agreementCreateArgs>(args: SelectSubset<T, agreementCreateArgs<ExtArgs>>): Prisma__agreementClient<$Result.GetResult<Prisma.$agreementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Agreements.
     * @param {agreementCreateManyArgs} args - Arguments to create many Agreements.
     * @example
     * // Create many Agreements
     * const agreement = await prisma.agreement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends agreementCreateManyArgs>(args?: SelectSubset<T, agreementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Agreement.
     * @param {agreementDeleteArgs} args - Arguments to delete one Agreement.
     * @example
     * // Delete one Agreement
     * const Agreement = await prisma.agreement.delete({
     *   where: {
     *     // ... filter to delete one Agreement
     *   }
     * })
     * 
     */
    delete<T extends agreementDeleteArgs>(args: SelectSubset<T, agreementDeleteArgs<ExtArgs>>): Prisma__agreementClient<$Result.GetResult<Prisma.$agreementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Agreement.
     * @param {agreementUpdateArgs} args - Arguments to update one Agreement.
     * @example
     * // Update one Agreement
     * const agreement = await prisma.agreement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends agreementUpdateArgs>(args: SelectSubset<T, agreementUpdateArgs<ExtArgs>>): Prisma__agreementClient<$Result.GetResult<Prisma.$agreementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Agreements.
     * @param {agreementDeleteManyArgs} args - Arguments to filter Agreements to delete.
     * @example
     * // Delete a few Agreements
     * const { count } = await prisma.agreement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends agreementDeleteManyArgs>(args?: SelectSubset<T, agreementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Agreements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agreementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Agreements
     * const agreement = await prisma.agreement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends agreementUpdateManyArgs>(args: SelectSubset<T, agreementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Agreement.
     * @param {agreementUpsertArgs} args - Arguments to update or create a Agreement.
     * @example
     * // Update or create a Agreement
     * const agreement = await prisma.agreement.upsert({
     *   create: {
     *     // ... data to create a Agreement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Agreement we want to update
     *   }
     * })
     */
    upsert<T extends agreementUpsertArgs>(args: SelectSubset<T, agreementUpsertArgs<ExtArgs>>): Prisma__agreementClient<$Result.GetResult<Prisma.$agreementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Agreements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agreementCountArgs} args - Arguments to filter Agreements to count.
     * @example
     * // Count the number of Agreements
     * const count = await prisma.agreement.count({
     *   where: {
     *     // ... the filter for the Agreements we want to count
     *   }
     * })
    **/
    count<T extends agreementCountArgs>(
      args?: Subset<T, agreementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgreementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Agreement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgreementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgreementAggregateArgs>(args: Subset<T, AgreementAggregateArgs>): Prisma.PrismaPromise<GetAgreementAggregateType<T>>

    /**
     * Group by Agreement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {agreementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends agreementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: agreementGroupByArgs['orderBy'] }
        : { orderBy?: agreementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, agreementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgreementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the agreement model
   */
  readonly fields: agreementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for agreement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__agreementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user_agreement_initiatorIdTouser<T extends userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, userDefaultArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user_agreement_receiverIdTouser<T extends userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, userDefaultArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    complaint<T extends agreement$complaintArgs<ExtArgs> = {}>(args?: Subset<T, agreement$complaintArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$complaintPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the agreement model
   */
  interface agreementFieldRefs {
    readonly id: FieldRef<"agreement", 'String'>
    readonly initiatorId: FieldRef<"agreement", 'String'>
    readonly receiverId: FieldRef<"agreement", 'String'>
    readonly status: FieldRef<"agreement", 'agreement_status'>
    readonly terms: FieldRef<"agreement", 'String'>
    readonly notes: FieldRef<"agreement", 'String'>
    readonly createdAt: FieldRef<"agreement", 'DateTime'>
    readonly updatedAt: FieldRef<"agreement", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * agreement findUnique
   */
  export type agreementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agreement
     */
    select?: agreementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the agreement
     */
    omit?: agreementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: agreementInclude<ExtArgs> | null
    /**
     * Filter, which agreement to fetch.
     */
    where: agreementWhereUniqueInput
  }

  /**
   * agreement findUniqueOrThrow
   */
  export type agreementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agreement
     */
    select?: agreementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the agreement
     */
    omit?: agreementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: agreementInclude<ExtArgs> | null
    /**
     * Filter, which agreement to fetch.
     */
    where: agreementWhereUniqueInput
  }

  /**
   * agreement findFirst
   */
  export type agreementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agreement
     */
    select?: agreementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the agreement
     */
    omit?: agreementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: agreementInclude<ExtArgs> | null
    /**
     * Filter, which agreement to fetch.
     */
    where?: agreementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of agreements to fetch.
     */
    orderBy?: agreementOrderByWithRelationInput | agreementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for agreements.
     */
    cursor?: agreementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` agreements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` agreements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of agreements.
     */
    distinct?: AgreementScalarFieldEnum | AgreementScalarFieldEnum[]
  }

  /**
   * agreement findFirstOrThrow
   */
  export type agreementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agreement
     */
    select?: agreementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the agreement
     */
    omit?: agreementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: agreementInclude<ExtArgs> | null
    /**
     * Filter, which agreement to fetch.
     */
    where?: agreementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of agreements to fetch.
     */
    orderBy?: agreementOrderByWithRelationInput | agreementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for agreements.
     */
    cursor?: agreementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` agreements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` agreements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of agreements.
     */
    distinct?: AgreementScalarFieldEnum | AgreementScalarFieldEnum[]
  }

  /**
   * agreement findMany
   */
  export type agreementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agreement
     */
    select?: agreementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the agreement
     */
    omit?: agreementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: agreementInclude<ExtArgs> | null
    /**
     * Filter, which agreements to fetch.
     */
    where?: agreementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of agreements to fetch.
     */
    orderBy?: agreementOrderByWithRelationInput | agreementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing agreements.
     */
    cursor?: agreementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` agreements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` agreements.
     */
    skip?: number
    distinct?: AgreementScalarFieldEnum | AgreementScalarFieldEnum[]
  }

  /**
   * agreement create
   */
  export type agreementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agreement
     */
    select?: agreementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the agreement
     */
    omit?: agreementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: agreementInclude<ExtArgs> | null
    /**
     * The data needed to create a agreement.
     */
    data: XOR<agreementCreateInput, agreementUncheckedCreateInput>
  }

  /**
   * agreement createMany
   */
  export type agreementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many agreements.
     */
    data: agreementCreateManyInput | agreementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * agreement update
   */
  export type agreementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agreement
     */
    select?: agreementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the agreement
     */
    omit?: agreementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: agreementInclude<ExtArgs> | null
    /**
     * The data needed to update a agreement.
     */
    data: XOR<agreementUpdateInput, agreementUncheckedUpdateInput>
    /**
     * Choose, which agreement to update.
     */
    where: agreementWhereUniqueInput
  }

  /**
   * agreement updateMany
   */
  export type agreementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update agreements.
     */
    data: XOR<agreementUpdateManyMutationInput, agreementUncheckedUpdateManyInput>
    /**
     * Filter which agreements to update
     */
    where?: agreementWhereInput
    /**
     * Limit how many agreements to update.
     */
    limit?: number
  }

  /**
   * agreement upsert
   */
  export type agreementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agreement
     */
    select?: agreementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the agreement
     */
    omit?: agreementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: agreementInclude<ExtArgs> | null
    /**
     * The filter to search for the agreement to update in case it exists.
     */
    where: agreementWhereUniqueInput
    /**
     * In case the agreement found by the `where` argument doesn't exist, create a new agreement with this data.
     */
    create: XOR<agreementCreateInput, agreementUncheckedCreateInput>
    /**
     * In case the agreement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<agreementUpdateInput, agreementUncheckedUpdateInput>
  }

  /**
   * agreement delete
   */
  export type agreementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agreement
     */
    select?: agreementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the agreement
     */
    omit?: agreementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: agreementInclude<ExtArgs> | null
    /**
     * Filter which agreement to delete.
     */
    where: agreementWhereUniqueInput
  }

  /**
   * agreement deleteMany
   */
  export type agreementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which agreements to delete
     */
    where?: agreementWhereInput
    /**
     * Limit how many agreements to delete.
     */
    limit?: number
  }

  /**
   * agreement.complaint
   */
  export type agreement$complaintArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the complaint
     */
    select?: complaintSelect<ExtArgs> | null
    /**
     * Omit specific fields from the complaint
     */
    omit?: complaintOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: complaintInclude<ExtArgs> | null
    where?: complaintWhereInput
    orderBy?: complaintOrderByWithRelationInput | complaintOrderByWithRelationInput[]
    cursor?: complaintWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ComplaintScalarFieldEnum | ComplaintScalarFieldEnum[]
  }

  /**
   * agreement without action
   */
  export type agreementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agreement
     */
    select?: agreementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the agreement
     */
    omit?: agreementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: agreementInclude<ExtArgs> | null
  }


  /**
   * Model complaint
   */

  export type AggregateComplaint = {
    _count: ComplaintCountAggregateOutputType | null
    _min: ComplaintMinAggregateOutputType | null
    _max: ComplaintMaxAggregateOutputType | null
  }

  export type ComplaintMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    status: string | null
    userId: string | null
    agreementId: string | null
    evidence: string | null
    resolution: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ComplaintMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    status: string | null
    userId: string | null
    agreementId: string | null
    evidence: string | null
    resolution: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ComplaintCountAggregateOutputType = {
    id: number
    title: number
    description: number
    status: number
    userId: number
    agreementId: number
    evidence: number
    resolution: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ComplaintMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    userId?: true
    agreementId?: true
    evidence?: true
    resolution?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ComplaintMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    userId?: true
    agreementId?: true
    evidence?: true
    resolution?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ComplaintCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    userId?: true
    agreementId?: true
    evidence?: true
    resolution?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ComplaintAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which complaint to aggregate.
     */
    where?: complaintWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of complaints to fetch.
     */
    orderBy?: complaintOrderByWithRelationInput | complaintOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: complaintWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` complaints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` complaints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned complaints
    **/
    _count?: true | ComplaintCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ComplaintMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ComplaintMaxAggregateInputType
  }

  export type GetComplaintAggregateType<T extends ComplaintAggregateArgs> = {
        [P in keyof T & keyof AggregateComplaint]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComplaint[P]>
      : GetScalarType<T[P], AggregateComplaint[P]>
  }




  export type complaintGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: complaintWhereInput
    orderBy?: complaintOrderByWithAggregationInput | complaintOrderByWithAggregationInput[]
    by: ComplaintScalarFieldEnum[] | ComplaintScalarFieldEnum
    having?: complaintScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ComplaintCountAggregateInputType | true
    _min?: ComplaintMinAggregateInputType
    _max?: ComplaintMaxAggregateInputType
  }

  export type ComplaintGroupByOutputType = {
    id: string
    title: string
    description: string
    status: string
    userId: string
    agreementId: string | null
    evidence: string | null
    resolution: string | null
    createdAt: Date
    updatedAt: Date
    _count: ComplaintCountAggregateOutputType | null
    _min: ComplaintMinAggregateOutputType | null
    _max: ComplaintMaxAggregateOutputType | null
  }

  type GetComplaintGroupByPayload<T extends complaintGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ComplaintGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ComplaintGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ComplaintGroupByOutputType[P]>
            : GetScalarType<T[P], ComplaintGroupByOutputType[P]>
        }
      >
    >


  export type complaintSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    userId?: boolean
    agreementId?: boolean
    evidence?: boolean
    resolution?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agreement?: boolean | complaint$agreementArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["complaint"]>



  export type complaintSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    userId?: boolean
    agreementId?: boolean
    evidence?: boolean
    resolution?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type complaintOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "status" | "userId" | "agreementId" | "evidence" | "resolution" | "createdAt" | "updatedAt", ExtArgs["result"]["complaint"]>
  export type complaintInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agreement?: boolean | complaint$agreementArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
  }

  export type $complaintPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "complaint"
    objects: {
      agreement: Prisma.$agreementPayload<ExtArgs> | null
      user: Prisma.$userPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      status: string
      userId: string
      agreementId: string | null
      evidence: string | null
      resolution: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["complaint"]>
    composites: {}
  }

  type complaintGetPayload<S extends boolean | null | undefined | complaintDefaultArgs> = $Result.GetResult<Prisma.$complaintPayload, S>

  type complaintCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<complaintFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ComplaintCountAggregateInputType | true
    }

  export interface complaintDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['complaint'], meta: { name: 'complaint' } }
    /**
     * Find zero or one Complaint that matches the filter.
     * @param {complaintFindUniqueArgs} args - Arguments to find a Complaint
     * @example
     * // Get one Complaint
     * const complaint = await prisma.complaint.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends complaintFindUniqueArgs>(args: SelectSubset<T, complaintFindUniqueArgs<ExtArgs>>): Prisma__complaintClient<$Result.GetResult<Prisma.$complaintPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Complaint that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {complaintFindUniqueOrThrowArgs} args - Arguments to find a Complaint
     * @example
     * // Get one Complaint
     * const complaint = await prisma.complaint.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends complaintFindUniqueOrThrowArgs>(args: SelectSubset<T, complaintFindUniqueOrThrowArgs<ExtArgs>>): Prisma__complaintClient<$Result.GetResult<Prisma.$complaintPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Complaint that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {complaintFindFirstArgs} args - Arguments to find a Complaint
     * @example
     * // Get one Complaint
     * const complaint = await prisma.complaint.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends complaintFindFirstArgs>(args?: SelectSubset<T, complaintFindFirstArgs<ExtArgs>>): Prisma__complaintClient<$Result.GetResult<Prisma.$complaintPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Complaint that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {complaintFindFirstOrThrowArgs} args - Arguments to find a Complaint
     * @example
     * // Get one Complaint
     * const complaint = await prisma.complaint.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends complaintFindFirstOrThrowArgs>(args?: SelectSubset<T, complaintFindFirstOrThrowArgs<ExtArgs>>): Prisma__complaintClient<$Result.GetResult<Prisma.$complaintPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Complaints that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {complaintFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Complaints
     * const complaints = await prisma.complaint.findMany()
     * 
     * // Get first 10 Complaints
     * const complaints = await prisma.complaint.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const complaintWithIdOnly = await prisma.complaint.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends complaintFindManyArgs>(args?: SelectSubset<T, complaintFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$complaintPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Complaint.
     * @param {complaintCreateArgs} args - Arguments to create a Complaint.
     * @example
     * // Create one Complaint
     * const Complaint = await prisma.complaint.create({
     *   data: {
     *     // ... data to create a Complaint
     *   }
     * })
     * 
     */
    create<T extends complaintCreateArgs>(args: SelectSubset<T, complaintCreateArgs<ExtArgs>>): Prisma__complaintClient<$Result.GetResult<Prisma.$complaintPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Complaints.
     * @param {complaintCreateManyArgs} args - Arguments to create many Complaints.
     * @example
     * // Create many Complaints
     * const complaint = await prisma.complaint.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends complaintCreateManyArgs>(args?: SelectSubset<T, complaintCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Complaint.
     * @param {complaintDeleteArgs} args - Arguments to delete one Complaint.
     * @example
     * // Delete one Complaint
     * const Complaint = await prisma.complaint.delete({
     *   where: {
     *     // ... filter to delete one Complaint
     *   }
     * })
     * 
     */
    delete<T extends complaintDeleteArgs>(args: SelectSubset<T, complaintDeleteArgs<ExtArgs>>): Prisma__complaintClient<$Result.GetResult<Prisma.$complaintPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Complaint.
     * @param {complaintUpdateArgs} args - Arguments to update one Complaint.
     * @example
     * // Update one Complaint
     * const complaint = await prisma.complaint.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends complaintUpdateArgs>(args: SelectSubset<T, complaintUpdateArgs<ExtArgs>>): Prisma__complaintClient<$Result.GetResult<Prisma.$complaintPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Complaints.
     * @param {complaintDeleteManyArgs} args - Arguments to filter Complaints to delete.
     * @example
     * // Delete a few Complaints
     * const { count } = await prisma.complaint.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends complaintDeleteManyArgs>(args?: SelectSubset<T, complaintDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Complaints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {complaintUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Complaints
     * const complaint = await prisma.complaint.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends complaintUpdateManyArgs>(args: SelectSubset<T, complaintUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Complaint.
     * @param {complaintUpsertArgs} args - Arguments to update or create a Complaint.
     * @example
     * // Update or create a Complaint
     * const complaint = await prisma.complaint.upsert({
     *   create: {
     *     // ... data to create a Complaint
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Complaint we want to update
     *   }
     * })
     */
    upsert<T extends complaintUpsertArgs>(args: SelectSubset<T, complaintUpsertArgs<ExtArgs>>): Prisma__complaintClient<$Result.GetResult<Prisma.$complaintPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Complaints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {complaintCountArgs} args - Arguments to filter Complaints to count.
     * @example
     * // Count the number of Complaints
     * const count = await prisma.complaint.count({
     *   where: {
     *     // ... the filter for the Complaints we want to count
     *   }
     * })
    **/
    count<T extends complaintCountArgs>(
      args?: Subset<T, complaintCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ComplaintCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Complaint.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComplaintAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ComplaintAggregateArgs>(args: Subset<T, ComplaintAggregateArgs>): Prisma.PrismaPromise<GetComplaintAggregateType<T>>

    /**
     * Group by Complaint.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {complaintGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends complaintGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: complaintGroupByArgs['orderBy'] }
        : { orderBy?: complaintGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, complaintGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetComplaintGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the complaint model
   */
  readonly fields: complaintFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for complaint.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__complaintClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    agreement<T extends complaint$agreementArgs<ExtArgs> = {}>(args?: Subset<T, complaint$agreementArgs<ExtArgs>>): Prisma__agreementClient<$Result.GetResult<Prisma.$agreementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    user<T extends userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, userDefaultArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the complaint model
   */
  interface complaintFieldRefs {
    readonly id: FieldRef<"complaint", 'String'>
    readonly title: FieldRef<"complaint", 'String'>
    readonly description: FieldRef<"complaint", 'String'>
    readonly status: FieldRef<"complaint", 'String'>
    readonly userId: FieldRef<"complaint", 'String'>
    readonly agreementId: FieldRef<"complaint", 'String'>
    readonly evidence: FieldRef<"complaint", 'String'>
    readonly resolution: FieldRef<"complaint", 'String'>
    readonly createdAt: FieldRef<"complaint", 'DateTime'>
    readonly updatedAt: FieldRef<"complaint", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * complaint findUnique
   */
  export type complaintFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the complaint
     */
    select?: complaintSelect<ExtArgs> | null
    /**
     * Omit specific fields from the complaint
     */
    omit?: complaintOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: complaintInclude<ExtArgs> | null
    /**
     * Filter, which complaint to fetch.
     */
    where: complaintWhereUniqueInput
  }

  /**
   * complaint findUniqueOrThrow
   */
  export type complaintFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the complaint
     */
    select?: complaintSelect<ExtArgs> | null
    /**
     * Omit specific fields from the complaint
     */
    omit?: complaintOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: complaintInclude<ExtArgs> | null
    /**
     * Filter, which complaint to fetch.
     */
    where: complaintWhereUniqueInput
  }

  /**
   * complaint findFirst
   */
  export type complaintFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the complaint
     */
    select?: complaintSelect<ExtArgs> | null
    /**
     * Omit specific fields from the complaint
     */
    omit?: complaintOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: complaintInclude<ExtArgs> | null
    /**
     * Filter, which complaint to fetch.
     */
    where?: complaintWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of complaints to fetch.
     */
    orderBy?: complaintOrderByWithRelationInput | complaintOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for complaints.
     */
    cursor?: complaintWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` complaints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` complaints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of complaints.
     */
    distinct?: ComplaintScalarFieldEnum | ComplaintScalarFieldEnum[]
  }

  /**
   * complaint findFirstOrThrow
   */
  export type complaintFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the complaint
     */
    select?: complaintSelect<ExtArgs> | null
    /**
     * Omit specific fields from the complaint
     */
    omit?: complaintOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: complaintInclude<ExtArgs> | null
    /**
     * Filter, which complaint to fetch.
     */
    where?: complaintWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of complaints to fetch.
     */
    orderBy?: complaintOrderByWithRelationInput | complaintOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for complaints.
     */
    cursor?: complaintWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` complaints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` complaints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of complaints.
     */
    distinct?: ComplaintScalarFieldEnum | ComplaintScalarFieldEnum[]
  }

  /**
   * complaint findMany
   */
  export type complaintFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the complaint
     */
    select?: complaintSelect<ExtArgs> | null
    /**
     * Omit specific fields from the complaint
     */
    omit?: complaintOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: complaintInclude<ExtArgs> | null
    /**
     * Filter, which complaints to fetch.
     */
    where?: complaintWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of complaints to fetch.
     */
    orderBy?: complaintOrderByWithRelationInput | complaintOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing complaints.
     */
    cursor?: complaintWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` complaints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` complaints.
     */
    skip?: number
    distinct?: ComplaintScalarFieldEnum | ComplaintScalarFieldEnum[]
  }

  /**
   * complaint create
   */
  export type complaintCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the complaint
     */
    select?: complaintSelect<ExtArgs> | null
    /**
     * Omit specific fields from the complaint
     */
    omit?: complaintOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: complaintInclude<ExtArgs> | null
    /**
     * The data needed to create a complaint.
     */
    data: XOR<complaintCreateInput, complaintUncheckedCreateInput>
  }

  /**
   * complaint createMany
   */
  export type complaintCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many complaints.
     */
    data: complaintCreateManyInput | complaintCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * complaint update
   */
  export type complaintUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the complaint
     */
    select?: complaintSelect<ExtArgs> | null
    /**
     * Omit specific fields from the complaint
     */
    omit?: complaintOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: complaintInclude<ExtArgs> | null
    /**
     * The data needed to update a complaint.
     */
    data: XOR<complaintUpdateInput, complaintUncheckedUpdateInput>
    /**
     * Choose, which complaint to update.
     */
    where: complaintWhereUniqueInput
  }

  /**
   * complaint updateMany
   */
  export type complaintUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update complaints.
     */
    data: XOR<complaintUpdateManyMutationInput, complaintUncheckedUpdateManyInput>
    /**
     * Filter which complaints to update
     */
    where?: complaintWhereInput
    /**
     * Limit how many complaints to update.
     */
    limit?: number
  }

  /**
   * complaint upsert
   */
  export type complaintUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the complaint
     */
    select?: complaintSelect<ExtArgs> | null
    /**
     * Omit specific fields from the complaint
     */
    omit?: complaintOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: complaintInclude<ExtArgs> | null
    /**
     * The filter to search for the complaint to update in case it exists.
     */
    where: complaintWhereUniqueInput
    /**
     * In case the complaint found by the `where` argument doesn't exist, create a new complaint with this data.
     */
    create: XOR<complaintCreateInput, complaintUncheckedCreateInput>
    /**
     * In case the complaint was found with the provided `where` argument, update it with this data.
     */
    update: XOR<complaintUpdateInput, complaintUncheckedUpdateInput>
  }

  /**
   * complaint delete
   */
  export type complaintDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the complaint
     */
    select?: complaintSelect<ExtArgs> | null
    /**
     * Omit specific fields from the complaint
     */
    omit?: complaintOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: complaintInclude<ExtArgs> | null
    /**
     * Filter which complaint to delete.
     */
    where: complaintWhereUniqueInput
  }

  /**
   * complaint deleteMany
   */
  export type complaintDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which complaints to delete
     */
    where?: complaintWhereInput
    /**
     * Limit how many complaints to delete.
     */
    limit?: number
  }

  /**
   * complaint.agreement
   */
  export type complaint$agreementArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agreement
     */
    select?: agreementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the agreement
     */
    omit?: agreementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: agreementInclude<ExtArgs> | null
    where?: agreementWhereInput
  }

  /**
   * complaint without action
   */
  export type complaintDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the complaint
     */
    select?: complaintSelect<ExtArgs> | null
    /**
     * Omit specific fields from the complaint
     */
    omit?: complaintOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: complaintInclude<ExtArgs> | null
  }


  /**
   * Model democlass
   */

  export type AggregateDemoclass = {
    _count: DemoclassCountAggregateOutputType | null
    _avg: DemoclassAvgAggregateOutputType | null
    _sum: DemoclassSumAggregateOutputType | null
    _min: DemoclassMinAggregateOutputType | null
    _max: DemoclassMaxAggregateOutputType | null
  }

  export type DemoclassAvgAggregateOutputType = {
    price: number | null
  }

  export type DemoclassSumAggregateOutputType = {
    price: number | null
  }

  export type DemoclassMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    videoUrl: string | null
    schedule: Date | null
    price: number | null
    isPaid: boolean | null
    status: $Enums.democlass_status | null
    manufacturerId: string | null
    category: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DemoclassMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    videoUrl: string | null
    schedule: Date | null
    price: number | null
    isPaid: boolean | null
    status: $Enums.democlass_status | null
    manufacturerId: string | null
    category: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DemoclassCountAggregateOutputType = {
    id: number
    title: number
    description: number
    videoUrl: number
    schedule: number
    price: number
    isPaid: number
    status: number
    manufacturerId: number
    category: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DemoclassAvgAggregateInputType = {
    price?: true
  }

  export type DemoclassSumAggregateInputType = {
    price?: true
  }

  export type DemoclassMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    videoUrl?: true
    schedule?: true
    price?: true
    isPaid?: true
    status?: true
    manufacturerId?: true
    category?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DemoclassMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    videoUrl?: true
    schedule?: true
    price?: true
    isPaid?: true
    status?: true
    manufacturerId?: true
    category?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DemoclassCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    videoUrl?: true
    schedule?: true
    price?: true
    isPaid?: true
    status?: true
    manufacturerId?: true
    category?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DemoclassAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which democlass to aggregate.
     */
    where?: democlassWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of democlasses to fetch.
     */
    orderBy?: democlassOrderByWithRelationInput | democlassOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: democlassWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` democlasses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` democlasses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned democlasses
    **/
    _count?: true | DemoclassCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DemoclassAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DemoclassSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DemoclassMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DemoclassMaxAggregateInputType
  }

  export type GetDemoclassAggregateType<T extends DemoclassAggregateArgs> = {
        [P in keyof T & keyof AggregateDemoclass]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDemoclass[P]>
      : GetScalarType<T[P], AggregateDemoclass[P]>
  }




  export type democlassGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: democlassWhereInput
    orderBy?: democlassOrderByWithAggregationInput | democlassOrderByWithAggregationInput[]
    by: DemoclassScalarFieldEnum[] | DemoclassScalarFieldEnum
    having?: democlassScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DemoclassCountAggregateInputType | true
    _avg?: DemoclassAvgAggregateInputType
    _sum?: DemoclassSumAggregateInputType
    _min?: DemoclassMinAggregateInputType
    _max?: DemoclassMaxAggregateInputType
  }

  export type DemoclassGroupByOutputType = {
    id: string
    title: string
    description: string
    videoUrl: string | null
    schedule: Date
    price: number
    isPaid: boolean
    status: $Enums.democlass_status
    manufacturerId: string
    category: string
    createdAt: Date
    updatedAt: Date
    _count: DemoclassCountAggregateOutputType | null
    _avg: DemoclassAvgAggregateOutputType | null
    _sum: DemoclassSumAggregateOutputType | null
    _min: DemoclassMinAggregateOutputType | null
    _max: DemoclassMaxAggregateOutputType | null
  }

  type GetDemoclassGroupByPayload<T extends democlassGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DemoclassGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DemoclassGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DemoclassGroupByOutputType[P]>
            : GetScalarType<T[P], DemoclassGroupByOutputType[P]>
        }
      >
    >


  export type democlassSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    videoUrl?: boolean
    schedule?: boolean
    price?: boolean
    isPaid?: boolean
    status?: boolean
    manufacturerId?: boolean
    category?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["democlass"]>



  export type democlassSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    videoUrl?: boolean
    schedule?: boolean
    price?: boolean
    isPaid?: boolean
    status?: boolean
    manufacturerId?: boolean
    category?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type democlassOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "videoUrl" | "schedule" | "price" | "isPaid" | "status" | "manufacturerId" | "category" | "createdAt" | "updatedAt", ExtArgs["result"]["democlass"]>
  export type democlassInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | userDefaultArgs<ExtArgs>
  }

  export type $democlassPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "democlass"
    objects: {
      user: Prisma.$userPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      videoUrl: string | null
      schedule: Date
      price: number
      isPaid: boolean
      status: $Enums.democlass_status
      manufacturerId: string
      category: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["democlass"]>
    composites: {}
  }

  type democlassGetPayload<S extends boolean | null | undefined | democlassDefaultArgs> = $Result.GetResult<Prisma.$democlassPayload, S>

  type democlassCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<democlassFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DemoclassCountAggregateInputType | true
    }

  export interface democlassDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['democlass'], meta: { name: 'democlass' } }
    /**
     * Find zero or one Democlass that matches the filter.
     * @param {democlassFindUniqueArgs} args - Arguments to find a Democlass
     * @example
     * // Get one Democlass
     * const democlass = await prisma.democlass.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends democlassFindUniqueArgs>(args: SelectSubset<T, democlassFindUniqueArgs<ExtArgs>>): Prisma__democlassClient<$Result.GetResult<Prisma.$democlassPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Democlass that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {democlassFindUniqueOrThrowArgs} args - Arguments to find a Democlass
     * @example
     * // Get one Democlass
     * const democlass = await prisma.democlass.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends democlassFindUniqueOrThrowArgs>(args: SelectSubset<T, democlassFindUniqueOrThrowArgs<ExtArgs>>): Prisma__democlassClient<$Result.GetResult<Prisma.$democlassPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Democlass that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {democlassFindFirstArgs} args - Arguments to find a Democlass
     * @example
     * // Get one Democlass
     * const democlass = await prisma.democlass.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends democlassFindFirstArgs>(args?: SelectSubset<T, democlassFindFirstArgs<ExtArgs>>): Prisma__democlassClient<$Result.GetResult<Prisma.$democlassPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Democlass that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {democlassFindFirstOrThrowArgs} args - Arguments to find a Democlass
     * @example
     * // Get one Democlass
     * const democlass = await prisma.democlass.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends democlassFindFirstOrThrowArgs>(args?: SelectSubset<T, democlassFindFirstOrThrowArgs<ExtArgs>>): Prisma__democlassClient<$Result.GetResult<Prisma.$democlassPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Democlasses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {democlassFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Democlasses
     * const democlasses = await prisma.democlass.findMany()
     * 
     * // Get first 10 Democlasses
     * const democlasses = await prisma.democlass.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const democlassWithIdOnly = await prisma.democlass.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends democlassFindManyArgs>(args?: SelectSubset<T, democlassFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$democlassPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Democlass.
     * @param {democlassCreateArgs} args - Arguments to create a Democlass.
     * @example
     * // Create one Democlass
     * const Democlass = await prisma.democlass.create({
     *   data: {
     *     // ... data to create a Democlass
     *   }
     * })
     * 
     */
    create<T extends democlassCreateArgs>(args: SelectSubset<T, democlassCreateArgs<ExtArgs>>): Prisma__democlassClient<$Result.GetResult<Prisma.$democlassPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Democlasses.
     * @param {democlassCreateManyArgs} args - Arguments to create many Democlasses.
     * @example
     * // Create many Democlasses
     * const democlass = await prisma.democlass.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends democlassCreateManyArgs>(args?: SelectSubset<T, democlassCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Democlass.
     * @param {democlassDeleteArgs} args - Arguments to delete one Democlass.
     * @example
     * // Delete one Democlass
     * const Democlass = await prisma.democlass.delete({
     *   where: {
     *     // ... filter to delete one Democlass
     *   }
     * })
     * 
     */
    delete<T extends democlassDeleteArgs>(args: SelectSubset<T, democlassDeleteArgs<ExtArgs>>): Prisma__democlassClient<$Result.GetResult<Prisma.$democlassPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Democlass.
     * @param {democlassUpdateArgs} args - Arguments to update one Democlass.
     * @example
     * // Update one Democlass
     * const democlass = await prisma.democlass.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends democlassUpdateArgs>(args: SelectSubset<T, democlassUpdateArgs<ExtArgs>>): Prisma__democlassClient<$Result.GetResult<Prisma.$democlassPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Democlasses.
     * @param {democlassDeleteManyArgs} args - Arguments to filter Democlasses to delete.
     * @example
     * // Delete a few Democlasses
     * const { count } = await prisma.democlass.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends democlassDeleteManyArgs>(args?: SelectSubset<T, democlassDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Democlasses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {democlassUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Democlasses
     * const democlass = await prisma.democlass.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends democlassUpdateManyArgs>(args: SelectSubset<T, democlassUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Democlass.
     * @param {democlassUpsertArgs} args - Arguments to update or create a Democlass.
     * @example
     * // Update or create a Democlass
     * const democlass = await prisma.democlass.upsert({
     *   create: {
     *     // ... data to create a Democlass
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Democlass we want to update
     *   }
     * })
     */
    upsert<T extends democlassUpsertArgs>(args: SelectSubset<T, democlassUpsertArgs<ExtArgs>>): Prisma__democlassClient<$Result.GetResult<Prisma.$democlassPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Democlasses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {democlassCountArgs} args - Arguments to filter Democlasses to count.
     * @example
     * // Count the number of Democlasses
     * const count = await prisma.democlass.count({
     *   where: {
     *     // ... the filter for the Democlasses we want to count
     *   }
     * })
    **/
    count<T extends democlassCountArgs>(
      args?: Subset<T, democlassCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DemoclassCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Democlass.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DemoclassAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DemoclassAggregateArgs>(args: Subset<T, DemoclassAggregateArgs>): Prisma.PrismaPromise<GetDemoclassAggregateType<T>>

    /**
     * Group by Democlass.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {democlassGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends democlassGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: democlassGroupByArgs['orderBy'] }
        : { orderBy?: democlassGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, democlassGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDemoclassGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the democlass model
   */
  readonly fields: democlassFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for democlass.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__democlassClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, userDefaultArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the democlass model
   */
  interface democlassFieldRefs {
    readonly id: FieldRef<"democlass", 'String'>
    readonly title: FieldRef<"democlass", 'String'>
    readonly description: FieldRef<"democlass", 'String'>
    readonly videoUrl: FieldRef<"democlass", 'String'>
    readonly schedule: FieldRef<"democlass", 'DateTime'>
    readonly price: FieldRef<"democlass", 'Float'>
    readonly isPaid: FieldRef<"democlass", 'Boolean'>
    readonly status: FieldRef<"democlass", 'democlass_status'>
    readonly manufacturerId: FieldRef<"democlass", 'String'>
    readonly category: FieldRef<"democlass", 'String'>
    readonly createdAt: FieldRef<"democlass", 'DateTime'>
    readonly updatedAt: FieldRef<"democlass", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * democlass findUnique
   */
  export type democlassFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the democlass
     */
    select?: democlassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the democlass
     */
    omit?: democlassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: democlassInclude<ExtArgs> | null
    /**
     * Filter, which democlass to fetch.
     */
    where: democlassWhereUniqueInput
  }

  /**
   * democlass findUniqueOrThrow
   */
  export type democlassFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the democlass
     */
    select?: democlassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the democlass
     */
    omit?: democlassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: democlassInclude<ExtArgs> | null
    /**
     * Filter, which democlass to fetch.
     */
    where: democlassWhereUniqueInput
  }

  /**
   * democlass findFirst
   */
  export type democlassFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the democlass
     */
    select?: democlassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the democlass
     */
    omit?: democlassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: democlassInclude<ExtArgs> | null
    /**
     * Filter, which democlass to fetch.
     */
    where?: democlassWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of democlasses to fetch.
     */
    orderBy?: democlassOrderByWithRelationInput | democlassOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for democlasses.
     */
    cursor?: democlassWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` democlasses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` democlasses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of democlasses.
     */
    distinct?: DemoclassScalarFieldEnum | DemoclassScalarFieldEnum[]
  }

  /**
   * democlass findFirstOrThrow
   */
  export type democlassFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the democlass
     */
    select?: democlassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the democlass
     */
    omit?: democlassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: democlassInclude<ExtArgs> | null
    /**
     * Filter, which democlass to fetch.
     */
    where?: democlassWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of democlasses to fetch.
     */
    orderBy?: democlassOrderByWithRelationInput | democlassOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for democlasses.
     */
    cursor?: democlassWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` democlasses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` democlasses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of democlasses.
     */
    distinct?: DemoclassScalarFieldEnum | DemoclassScalarFieldEnum[]
  }

  /**
   * democlass findMany
   */
  export type democlassFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the democlass
     */
    select?: democlassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the democlass
     */
    omit?: democlassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: democlassInclude<ExtArgs> | null
    /**
     * Filter, which democlasses to fetch.
     */
    where?: democlassWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of democlasses to fetch.
     */
    orderBy?: democlassOrderByWithRelationInput | democlassOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing democlasses.
     */
    cursor?: democlassWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` democlasses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` democlasses.
     */
    skip?: number
    distinct?: DemoclassScalarFieldEnum | DemoclassScalarFieldEnum[]
  }

  /**
   * democlass create
   */
  export type democlassCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the democlass
     */
    select?: democlassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the democlass
     */
    omit?: democlassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: democlassInclude<ExtArgs> | null
    /**
     * The data needed to create a democlass.
     */
    data: XOR<democlassCreateInput, democlassUncheckedCreateInput>
  }

  /**
   * democlass createMany
   */
  export type democlassCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many democlasses.
     */
    data: democlassCreateManyInput | democlassCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * democlass update
   */
  export type democlassUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the democlass
     */
    select?: democlassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the democlass
     */
    omit?: democlassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: democlassInclude<ExtArgs> | null
    /**
     * The data needed to update a democlass.
     */
    data: XOR<democlassUpdateInput, democlassUncheckedUpdateInput>
    /**
     * Choose, which democlass to update.
     */
    where: democlassWhereUniqueInput
  }

  /**
   * democlass updateMany
   */
  export type democlassUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update democlasses.
     */
    data: XOR<democlassUpdateManyMutationInput, democlassUncheckedUpdateManyInput>
    /**
     * Filter which democlasses to update
     */
    where?: democlassWhereInput
    /**
     * Limit how many democlasses to update.
     */
    limit?: number
  }

  /**
   * democlass upsert
   */
  export type democlassUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the democlass
     */
    select?: democlassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the democlass
     */
    omit?: democlassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: democlassInclude<ExtArgs> | null
    /**
     * The filter to search for the democlass to update in case it exists.
     */
    where: democlassWhereUniqueInput
    /**
     * In case the democlass found by the `where` argument doesn't exist, create a new democlass with this data.
     */
    create: XOR<democlassCreateInput, democlassUncheckedCreateInput>
    /**
     * In case the democlass was found with the provided `where` argument, update it with this data.
     */
    update: XOR<democlassUpdateInput, democlassUncheckedUpdateInput>
  }

  /**
   * democlass delete
   */
  export type democlassDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the democlass
     */
    select?: democlassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the democlass
     */
    omit?: democlassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: democlassInclude<ExtArgs> | null
    /**
     * Filter which democlass to delete.
     */
    where: democlassWhereUniqueInput
  }

  /**
   * democlass deleteMany
   */
  export type democlassDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which democlasses to delete
     */
    where?: democlassWhereInput
    /**
     * Limit how many democlasses to delete.
     */
    limit?: number
  }

  /**
   * democlass without action
   */
  export type democlassDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the democlass
     */
    select?: democlassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the democlass
     */
    omit?: democlassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: democlassInclude<ExtArgs> | null
  }


  /**
   * Model forumcategory
   */

  export type AggregateForumcategory = {
    _count: ForumcategoryCountAggregateOutputType | null
    _min: ForumcategoryMinAggregateOutputType | null
    _max: ForumcategoryMaxAggregateOutputType | null
  }

  export type ForumcategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ForumcategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ForumcategoryCountAggregateOutputType = {
    id: number
    name: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ForumcategoryMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ForumcategoryMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ForumcategoryCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ForumcategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which forumcategory to aggregate.
     */
    where?: forumcategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of forumcategories to fetch.
     */
    orderBy?: forumcategoryOrderByWithRelationInput | forumcategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: forumcategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` forumcategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` forumcategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned forumcategories
    **/
    _count?: true | ForumcategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ForumcategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ForumcategoryMaxAggregateInputType
  }

  export type GetForumcategoryAggregateType<T extends ForumcategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateForumcategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateForumcategory[P]>
      : GetScalarType<T[P], AggregateForumcategory[P]>
  }




  export type forumcategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: forumcategoryWhereInput
    orderBy?: forumcategoryOrderByWithAggregationInput | forumcategoryOrderByWithAggregationInput[]
    by: ForumcategoryScalarFieldEnum[] | ForumcategoryScalarFieldEnum
    having?: forumcategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ForumcategoryCountAggregateInputType | true
    _min?: ForumcategoryMinAggregateInputType
    _max?: ForumcategoryMaxAggregateInputType
  }

  export type ForumcategoryGroupByOutputType = {
    id: string
    name: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: ForumcategoryCountAggregateOutputType | null
    _min: ForumcategoryMinAggregateOutputType | null
    _max: ForumcategoryMaxAggregateOutputType | null
  }

  type GetForumcategoryGroupByPayload<T extends forumcategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ForumcategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ForumcategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ForumcategoryGroupByOutputType[P]>
            : GetScalarType<T[P], ForumcategoryGroupByOutputType[P]>
        }
      >
    >


  export type forumcategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    forumthread?: boolean | forumcategory$forumthreadArgs<ExtArgs>
    _count?: boolean | ForumcategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["forumcategory"]>



  export type forumcategorySelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type forumcategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["forumcategory"]>
  export type forumcategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    forumthread?: boolean | forumcategory$forumthreadArgs<ExtArgs>
    _count?: boolean | ForumcategoryCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $forumcategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "forumcategory"
    objects: {
      forumthread: Prisma.$forumthreadPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["forumcategory"]>
    composites: {}
  }

  type forumcategoryGetPayload<S extends boolean | null | undefined | forumcategoryDefaultArgs> = $Result.GetResult<Prisma.$forumcategoryPayload, S>

  type forumcategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<forumcategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ForumcategoryCountAggregateInputType | true
    }

  export interface forumcategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['forumcategory'], meta: { name: 'forumcategory' } }
    /**
     * Find zero or one Forumcategory that matches the filter.
     * @param {forumcategoryFindUniqueArgs} args - Arguments to find a Forumcategory
     * @example
     * // Get one Forumcategory
     * const forumcategory = await prisma.forumcategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends forumcategoryFindUniqueArgs>(args: SelectSubset<T, forumcategoryFindUniqueArgs<ExtArgs>>): Prisma__forumcategoryClient<$Result.GetResult<Prisma.$forumcategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Forumcategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {forumcategoryFindUniqueOrThrowArgs} args - Arguments to find a Forumcategory
     * @example
     * // Get one Forumcategory
     * const forumcategory = await prisma.forumcategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends forumcategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, forumcategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__forumcategoryClient<$Result.GetResult<Prisma.$forumcategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Forumcategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumcategoryFindFirstArgs} args - Arguments to find a Forumcategory
     * @example
     * // Get one Forumcategory
     * const forumcategory = await prisma.forumcategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends forumcategoryFindFirstArgs>(args?: SelectSubset<T, forumcategoryFindFirstArgs<ExtArgs>>): Prisma__forumcategoryClient<$Result.GetResult<Prisma.$forumcategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Forumcategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumcategoryFindFirstOrThrowArgs} args - Arguments to find a Forumcategory
     * @example
     * // Get one Forumcategory
     * const forumcategory = await prisma.forumcategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends forumcategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, forumcategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__forumcategoryClient<$Result.GetResult<Prisma.$forumcategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Forumcategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumcategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Forumcategories
     * const forumcategories = await prisma.forumcategory.findMany()
     * 
     * // Get first 10 Forumcategories
     * const forumcategories = await prisma.forumcategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const forumcategoryWithIdOnly = await prisma.forumcategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends forumcategoryFindManyArgs>(args?: SelectSubset<T, forumcategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$forumcategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Forumcategory.
     * @param {forumcategoryCreateArgs} args - Arguments to create a Forumcategory.
     * @example
     * // Create one Forumcategory
     * const Forumcategory = await prisma.forumcategory.create({
     *   data: {
     *     // ... data to create a Forumcategory
     *   }
     * })
     * 
     */
    create<T extends forumcategoryCreateArgs>(args: SelectSubset<T, forumcategoryCreateArgs<ExtArgs>>): Prisma__forumcategoryClient<$Result.GetResult<Prisma.$forumcategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Forumcategories.
     * @param {forumcategoryCreateManyArgs} args - Arguments to create many Forumcategories.
     * @example
     * // Create many Forumcategories
     * const forumcategory = await prisma.forumcategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends forumcategoryCreateManyArgs>(args?: SelectSubset<T, forumcategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Forumcategory.
     * @param {forumcategoryDeleteArgs} args - Arguments to delete one Forumcategory.
     * @example
     * // Delete one Forumcategory
     * const Forumcategory = await prisma.forumcategory.delete({
     *   where: {
     *     // ... filter to delete one Forumcategory
     *   }
     * })
     * 
     */
    delete<T extends forumcategoryDeleteArgs>(args: SelectSubset<T, forumcategoryDeleteArgs<ExtArgs>>): Prisma__forumcategoryClient<$Result.GetResult<Prisma.$forumcategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Forumcategory.
     * @param {forumcategoryUpdateArgs} args - Arguments to update one Forumcategory.
     * @example
     * // Update one Forumcategory
     * const forumcategory = await prisma.forumcategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends forumcategoryUpdateArgs>(args: SelectSubset<T, forumcategoryUpdateArgs<ExtArgs>>): Prisma__forumcategoryClient<$Result.GetResult<Prisma.$forumcategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Forumcategories.
     * @param {forumcategoryDeleteManyArgs} args - Arguments to filter Forumcategories to delete.
     * @example
     * // Delete a few Forumcategories
     * const { count } = await prisma.forumcategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends forumcategoryDeleteManyArgs>(args?: SelectSubset<T, forumcategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Forumcategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumcategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Forumcategories
     * const forumcategory = await prisma.forumcategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends forumcategoryUpdateManyArgs>(args: SelectSubset<T, forumcategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Forumcategory.
     * @param {forumcategoryUpsertArgs} args - Arguments to update or create a Forumcategory.
     * @example
     * // Update or create a Forumcategory
     * const forumcategory = await prisma.forumcategory.upsert({
     *   create: {
     *     // ... data to create a Forumcategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Forumcategory we want to update
     *   }
     * })
     */
    upsert<T extends forumcategoryUpsertArgs>(args: SelectSubset<T, forumcategoryUpsertArgs<ExtArgs>>): Prisma__forumcategoryClient<$Result.GetResult<Prisma.$forumcategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Forumcategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumcategoryCountArgs} args - Arguments to filter Forumcategories to count.
     * @example
     * // Count the number of Forumcategories
     * const count = await prisma.forumcategory.count({
     *   where: {
     *     // ... the filter for the Forumcategories we want to count
     *   }
     * })
    **/
    count<T extends forumcategoryCountArgs>(
      args?: Subset<T, forumcategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ForumcategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Forumcategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ForumcategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ForumcategoryAggregateArgs>(args: Subset<T, ForumcategoryAggregateArgs>): Prisma.PrismaPromise<GetForumcategoryAggregateType<T>>

    /**
     * Group by Forumcategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumcategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends forumcategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: forumcategoryGroupByArgs['orderBy'] }
        : { orderBy?: forumcategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, forumcategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetForumcategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the forumcategory model
   */
  readonly fields: forumcategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for forumcategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__forumcategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    forumthread<T extends forumcategory$forumthreadArgs<ExtArgs> = {}>(args?: Subset<T, forumcategory$forumthreadArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$forumthreadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the forumcategory model
   */
  interface forumcategoryFieldRefs {
    readonly id: FieldRef<"forumcategory", 'String'>
    readonly name: FieldRef<"forumcategory", 'String'>
    readonly description: FieldRef<"forumcategory", 'String'>
    readonly createdAt: FieldRef<"forumcategory", 'DateTime'>
    readonly updatedAt: FieldRef<"forumcategory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * forumcategory findUnique
   */
  export type forumcategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumcategory
     */
    select?: forumcategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumcategory
     */
    omit?: forumcategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumcategoryInclude<ExtArgs> | null
    /**
     * Filter, which forumcategory to fetch.
     */
    where: forumcategoryWhereUniqueInput
  }

  /**
   * forumcategory findUniqueOrThrow
   */
  export type forumcategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumcategory
     */
    select?: forumcategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumcategory
     */
    omit?: forumcategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumcategoryInclude<ExtArgs> | null
    /**
     * Filter, which forumcategory to fetch.
     */
    where: forumcategoryWhereUniqueInput
  }

  /**
   * forumcategory findFirst
   */
  export type forumcategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumcategory
     */
    select?: forumcategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumcategory
     */
    omit?: forumcategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumcategoryInclude<ExtArgs> | null
    /**
     * Filter, which forumcategory to fetch.
     */
    where?: forumcategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of forumcategories to fetch.
     */
    orderBy?: forumcategoryOrderByWithRelationInput | forumcategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for forumcategories.
     */
    cursor?: forumcategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` forumcategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` forumcategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of forumcategories.
     */
    distinct?: ForumcategoryScalarFieldEnum | ForumcategoryScalarFieldEnum[]
  }

  /**
   * forumcategory findFirstOrThrow
   */
  export type forumcategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumcategory
     */
    select?: forumcategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumcategory
     */
    omit?: forumcategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumcategoryInclude<ExtArgs> | null
    /**
     * Filter, which forumcategory to fetch.
     */
    where?: forumcategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of forumcategories to fetch.
     */
    orderBy?: forumcategoryOrderByWithRelationInput | forumcategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for forumcategories.
     */
    cursor?: forumcategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` forumcategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` forumcategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of forumcategories.
     */
    distinct?: ForumcategoryScalarFieldEnum | ForumcategoryScalarFieldEnum[]
  }

  /**
   * forumcategory findMany
   */
  export type forumcategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumcategory
     */
    select?: forumcategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumcategory
     */
    omit?: forumcategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumcategoryInclude<ExtArgs> | null
    /**
     * Filter, which forumcategories to fetch.
     */
    where?: forumcategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of forumcategories to fetch.
     */
    orderBy?: forumcategoryOrderByWithRelationInput | forumcategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing forumcategories.
     */
    cursor?: forumcategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` forumcategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` forumcategories.
     */
    skip?: number
    distinct?: ForumcategoryScalarFieldEnum | ForumcategoryScalarFieldEnum[]
  }

  /**
   * forumcategory create
   */
  export type forumcategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumcategory
     */
    select?: forumcategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumcategory
     */
    omit?: forumcategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumcategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a forumcategory.
     */
    data: XOR<forumcategoryCreateInput, forumcategoryUncheckedCreateInput>
  }

  /**
   * forumcategory createMany
   */
  export type forumcategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many forumcategories.
     */
    data: forumcategoryCreateManyInput | forumcategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * forumcategory update
   */
  export type forumcategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumcategory
     */
    select?: forumcategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumcategory
     */
    omit?: forumcategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumcategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a forumcategory.
     */
    data: XOR<forumcategoryUpdateInput, forumcategoryUncheckedUpdateInput>
    /**
     * Choose, which forumcategory to update.
     */
    where: forumcategoryWhereUniqueInput
  }

  /**
   * forumcategory updateMany
   */
  export type forumcategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update forumcategories.
     */
    data: XOR<forumcategoryUpdateManyMutationInput, forumcategoryUncheckedUpdateManyInput>
    /**
     * Filter which forumcategories to update
     */
    where?: forumcategoryWhereInput
    /**
     * Limit how many forumcategories to update.
     */
    limit?: number
  }

  /**
   * forumcategory upsert
   */
  export type forumcategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumcategory
     */
    select?: forumcategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumcategory
     */
    omit?: forumcategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumcategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the forumcategory to update in case it exists.
     */
    where: forumcategoryWhereUniqueInput
    /**
     * In case the forumcategory found by the `where` argument doesn't exist, create a new forumcategory with this data.
     */
    create: XOR<forumcategoryCreateInput, forumcategoryUncheckedCreateInput>
    /**
     * In case the forumcategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<forumcategoryUpdateInput, forumcategoryUncheckedUpdateInput>
  }

  /**
   * forumcategory delete
   */
  export type forumcategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumcategory
     */
    select?: forumcategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumcategory
     */
    omit?: forumcategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumcategoryInclude<ExtArgs> | null
    /**
     * Filter which forumcategory to delete.
     */
    where: forumcategoryWhereUniqueInput
  }

  /**
   * forumcategory deleteMany
   */
  export type forumcategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which forumcategories to delete
     */
    where?: forumcategoryWhereInput
    /**
     * Limit how many forumcategories to delete.
     */
    limit?: number
  }

  /**
   * forumcategory.forumthread
   */
  export type forumcategory$forumthreadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumthread
     */
    select?: forumthreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumthread
     */
    omit?: forumthreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumthreadInclude<ExtArgs> | null
    where?: forumthreadWhereInput
    orderBy?: forumthreadOrderByWithRelationInput | forumthreadOrderByWithRelationInput[]
    cursor?: forumthreadWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ForumthreadScalarFieldEnum | ForumthreadScalarFieldEnum[]
  }

  /**
   * forumcategory without action
   */
  export type forumcategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumcategory
     */
    select?: forumcategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumcategory
     */
    omit?: forumcategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumcategoryInclude<ExtArgs> | null
  }


  /**
   * Model forumpost
   */

  export type AggregateForumpost = {
    _count: ForumpostCountAggregateOutputType | null
    _avg: ForumpostAvgAggregateOutputType | null
    _sum: ForumpostSumAggregateOutputType | null
    _min: ForumpostMinAggregateOutputType | null
    _max: ForumpostMaxAggregateOutputType | null
  }

  export type ForumpostAvgAggregateOutputType = {
    likes: number | null
  }

  export type ForumpostSumAggregateOutputType = {
    likes: number | null
  }

  export type ForumpostMinAggregateOutputType = {
    id: string | null
    content: string | null
    authorId: string | null
    threadId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    likes: number | null
  }

  export type ForumpostMaxAggregateOutputType = {
    id: string | null
    content: string | null
    authorId: string | null
    threadId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    likes: number | null
  }

  export type ForumpostCountAggregateOutputType = {
    id: number
    content: number
    authorId: number
    threadId: number
    createdAt: number
    updatedAt: number
    likes: number
    _all: number
  }


  export type ForumpostAvgAggregateInputType = {
    likes?: true
  }

  export type ForumpostSumAggregateInputType = {
    likes?: true
  }

  export type ForumpostMinAggregateInputType = {
    id?: true
    content?: true
    authorId?: true
    threadId?: true
    createdAt?: true
    updatedAt?: true
    likes?: true
  }

  export type ForumpostMaxAggregateInputType = {
    id?: true
    content?: true
    authorId?: true
    threadId?: true
    createdAt?: true
    updatedAt?: true
    likes?: true
  }

  export type ForumpostCountAggregateInputType = {
    id?: true
    content?: true
    authorId?: true
    threadId?: true
    createdAt?: true
    updatedAt?: true
    likes?: true
    _all?: true
  }

  export type ForumpostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which forumpost to aggregate.
     */
    where?: forumpostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of forumposts to fetch.
     */
    orderBy?: forumpostOrderByWithRelationInput | forumpostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: forumpostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` forumposts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` forumposts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned forumposts
    **/
    _count?: true | ForumpostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ForumpostAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ForumpostSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ForumpostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ForumpostMaxAggregateInputType
  }

  export type GetForumpostAggregateType<T extends ForumpostAggregateArgs> = {
        [P in keyof T & keyof AggregateForumpost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateForumpost[P]>
      : GetScalarType<T[P], AggregateForumpost[P]>
  }




  export type forumpostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: forumpostWhereInput
    orderBy?: forumpostOrderByWithAggregationInput | forumpostOrderByWithAggregationInput[]
    by: ForumpostScalarFieldEnum[] | ForumpostScalarFieldEnum
    having?: forumpostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ForumpostCountAggregateInputType | true
    _avg?: ForumpostAvgAggregateInputType
    _sum?: ForumpostSumAggregateInputType
    _min?: ForumpostMinAggregateInputType
    _max?: ForumpostMaxAggregateInputType
  }

  export type ForumpostGroupByOutputType = {
    id: string
    content: string
    authorId: string
    threadId: string
    createdAt: Date
    updatedAt: Date
    likes: number
    _count: ForumpostCountAggregateOutputType | null
    _avg: ForumpostAvgAggregateOutputType | null
    _sum: ForumpostSumAggregateOutputType | null
    _min: ForumpostMinAggregateOutputType | null
    _max: ForumpostMaxAggregateOutputType | null
  }

  type GetForumpostGroupByPayload<T extends forumpostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ForumpostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ForumpostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ForumpostGroupByOutputType[P]>
            : GetScalarType<T[P], ForumpostGroupByOutputType[P]>
        }
      >
    >


  export type forumpostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    authorId?: boolean
    threadId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    likes?: boolean
    user?: boolean | userDefaultArgs<ExtArgs>
    forumthread?: boolean | forumthreadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["forumpost"]>



  export type forumpostSelectScalar = {
    id?: boolean
    content?: boolean
    authorId?: boolean
    threadId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    likes?: boolean
  }

  export type forumpostOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "authorId" | "threadId" | "createdAt" | "updatedAt" | "likes", ExtArgs["result"]["forumpost"]>
  export type forumpostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | userDefaultArgs<ExtArgs>
    forumthread?: boolean | forumthreadDefaultArgs<ExtArgs>
  }

  export type $forumpostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "forumpost"
    objects: {
      user: Prisma.$userPayload<ExtArgs>
      forumthread: Prisma.$forumthreadPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      authorId: string
      threadId: string
      createdAt: Date
      updatedAt: Date
      likes: number
    }, ExtArgs["result"]["forumpost"]>
    composites: {}
  }

  type forumpostGetPayload<S extends boolean | null | undefined | forumpostDefaultArgs> = $Result.GetResult<Prisma.$forumpostPayload, S>

  type forumpostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<forumpostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ForumpostCountAggregateInputType | true
    }

  export interface forumpostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['forumpost'], meta: { name: 'forumpost' } }
    /**
     * Find zero or one Forumpost that matches the filter.
     * @param {forumpostFindUniqueArgs} args - Arguments to find a Forumpost
     * @example
     * // Get one Forumpost
     * const forumpost = await prisma.forumpost.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends forumpostFindUniqueArgs>(args: SelectSubset<T, forumpostFindUniqueArgs<ExtArgs>>): Prisma__forumpostClient<$Result.GetResult<Prisma.$forumpostPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Forumpost that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {forumpostFindUniqueOrThrowArgs} args - Arguments to find a Forumpost
     * @example
     * // Get one Forumpost
     * const forumpost = await prisma.forumpost.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends forumpostFindUniqueOrThrowArgs>(args: SelectSubset<T, forumpostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__forumpostClient<$Result.GetResult<Prisma.$forumpostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Forumpost that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumpostFindFirstArgs} args - Arguments to find a Forumpost
     * @example
     * // Get one Forumpost
     * const forumpost = await prisma.forumpost.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends forumpostFindFirstArgs>(args?: SelectSubset<T, forumpostFindFirstArgs<ExtArgs>>): Prisma__forumpostClient<$Result.GetResult<Prisma.$forumpostPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Forumpost that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumpostFindFirstOrThrowArgs} args - Arguments to find a Forumpost
     * @example
     * // Get one Forumpost
     * const forumpost = await prisma.forumpost.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends forumpostFindFirstOrThrowArgs>(args?: SelectSubset<T, forumpostFindFirstOrThrowArgs<ExtArgs>>): Prisma__forumpostClient<$Result.GetResult<Prisma.$forumpostPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Forumposts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumpostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Forumposts
     * const forumposts = await prisma.forumpost.findMany()
     * 
     * // Get first 10 Forumposts
     * const forumposts = await prisma.forumpost.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const forumpostWithIdOnly = await prisma.forumpost.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends forumpostFindManyArgs>(args?: SelectSubset<T, forumpostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$forumpostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Forumpost.
     * @param {forumpostCreateArgs} args - Arguments to create a Forumpost.
     * @example
     * // Create one Forumpost
     * const Forumpost = await prisma.forumpost.create({
     *   data: {
     *     // ... data to create a Forumpost
     *   }
     * })
     * 
     */
    create<T extends forumpostCreateArgs>(args: SelectSubset<T, forumpostCreateArgs<ExtArgs>>): Prisma__forumpostClient<$Result.GetResult<Prisma.$forumpostPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Forumposts.
     * @param {forumpostCreateManyArgs} args - Arguments to create many Forumposts.
     * @example
     * // Create many Forumposts
     * const forumpost = await prisma.forumpost.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends forumpostCreateManyArgs>(args?: SelectSubset<T, forumpostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Forumpost.
     * @param {forumpostDeleteArgs} args - Arguments to delete one Forumpost.
     * @example
     * // Delete one Forumpost
     * const Forumpost = await prisma.forumpost.delete({
     *   where: {
     *     // ... filter to delete one Forumpost
     *   }
     * })
     * 
     */
    delete<T extends forumpostDeleteArgs>(args: SelectSubset<T, forumpostDeleteArgs<ExtArgs>>): Prisma__forumpostClient<$Result.GetResult<Prisma.$forumpostPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Forumpost.
     * @param {forumpostUpdateArgs} args - Arguments to update one Forumpost.
     * @example
     * // Update one Forumpost
     * const forumpost = await prisma.forumpost.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends forumpostUpdateArgs>(args: SelectSubset<T, forumpostUpdateArgs<ExtArgs>>): Prisma__forumpostClient<$Result.GetResult<Prisma.$forumpostPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Forumposts.
     * @param {forumpostDeleteManyArgs} args - Arguments to filter Forumposts to delete.
     * @example
     * // Delete a few Forumposts
     * const { count } = await prisma.forumpost.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends forumpostDeleteManyArgs>(args?: SelectSubset<T, forumpostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Forumposts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumpostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Forumposts
     * const forumpost = await prisma.forumpost.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends forumpostUpdateManyArgs>(args: SelectSubset<T, forumpostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Forumpost.
     * @param {forumpostUpsertArgs} args - Arguments to update or create a Forumpost.
     * @example
     * // Update or create a Forumpost
     * const forumpost = await prisma.forumpost.upsert({
     *   create: {
     *     // ... data to create a Forumpost
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Forumpost we want to update
     *   }
     * })
     */
    upsert<T extends forumpostUpsertArgs>(args: SelectSubset<T, forumpostUpsertArgs<ExtArgs>>): Prisma__forumpostClient<$Result.GetResult<Prisma.$forumpostPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Forumposts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumpostCountArgs} args - Arguments to filter Forumposts to count.
     * @example
     * // Count the number of Forumposts
     * const count = await prisma.forumpost.count({
     *   where: {
     *     // ... the filter for the Forumposts we want to count
     *   }
     * })
    **/
    count<T extends forumpostCountArgs>(
      args?: Subset<T, forumpostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ForumpostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Forumpost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ForumpostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ForumpostAggregateArgs>(args: Subset<T, ForumpostAggregateArgs>): Prisma.PrismaPromise<GetForumpostAggregateType<T>>

    /**
     * Group by Forumpost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumpostGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends forumpostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: forumpostGroupByArgs['orderBy'] }
        : { orderBy?: forumpostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, forumpostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetForumpostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the forumpost model
   */
  readonly fields: forumpostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for forumpost.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__forumpostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, userDefaultArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    forumthread<T extends forumthreadDefaultArgs<ExtArgs> = {}>(args?: Subset<T, forumthreadDefaultArgs<ExtArgs>>): Prisma__forumthreadClient<$Result.GetResult<Prisma.$forumthreadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the forumpost model
   */
  interface forumpostFieldRefs {
    readonly id: FieldRef<"forumpost", 'String'>
    readonly content: FieldRef<"forumpost", 'String'>
    readonly authorId: FieldRef<"forumpost", 'String'>
    readonly threadId: FieldRef<"forumpost", 'String'>
    readonly createdAt: FieldRef<"forumpost", 'DateTime'>
    readonly updatedAt: FieldRef<"forumpost", 'DateTime'>
    readonly likes: FieldRef<"forumpost", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * forumpost findUnique
   */
  export type forumpostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumpost
     */
    select?: forumpostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumpost
     */
    omit?: forumpostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumpostInclude<ExtArgs> | null
    /**
     * Filter, which forumpost to fetch.
     */
    where: forumpostWhereUniqueInput
  }

  /**
   * forumpost findUniqueOrThrow
   */
  export type forumpostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumpost
     */
    select?: forumpostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumpost
     */
    omit?: forumpostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumpostInclude<ExtArgs> | null
    /**
     * Filter, which forumpost to fetch.
     */
    where: forumpostWhereUniqueInput
  }

  /**
   * forumpost findFirst
   */
  export type forumpostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumpost
     */
    select?: forumpostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumpost
     */
    omit?: forumpostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumpostInclude<ExtArgs> | null
    /**
     * Filter, which forumpost to fetch.
     */
    where?: forumpostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of forumposts to fetch.
     */
    orderBy?: forumpostOrderByWithRelationInput | forumpostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for forumposts.
     */
    cursor?: forumpostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` forumposts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` forumposts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of forumposts.
     */
    distinct?: ForumpostScalarFieldEnum | ForumpostScalarFieldEnum[]
  }

  /**
   * forumpost findFirstOrThrow
   */
  export type forumpostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumpost
     */
    select?: forumpostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumpost
     */
    omit?: forumpostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumpostInclude<ExtArgs> | null
    /**
     * Filter, which forumpost to fetch.
     */
    where?: forumpostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of forumposts to fetch.
     */
    orderBy?: forumpostOrderByWithRelationInput | forumpostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for forumposts.
     */
    cursor?: forumpostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` forumposts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` forumposts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of forumposts.
     */
    distinct?: ForumpostScalarFieldEnum | ForumpostScalarFieldEnum[]
  }

  /**
   * forumpost findMany
   */
  export type forumpostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumpost
     */
    select?: forumpostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumpost
     */
    omit?: forumpostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumpostInclude<ExtArgs> | null
    /**
     * Filter, which forumposts to fetch.
     */
    where?: forumpostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of forumposts to fetch.
     */
    orderBy?: forumpostOrderByWithRelationInput | forumpostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing forumposts.
     */
    cursor?: forumpostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` forumposts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` forumposts.
     */
    skip?: number
    distinct?: ForumpostScalarFieldEnum | ForumpostScalarFieldEnum[]
  }

  /**
   * forumpost create
   */
  export type forumpostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumpost
     */
    select?: forumpostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumpost
     */
    omit?: forumpostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumpostInclude<ExtArgs> | null
    /**
     * The data needed to create a forumpost.
     */
    data: XOR<forumpostCreateInput, forumpostUncheckedCreateInput>
  }

  /**
   * forumpost createMany
   */
  export type forumpostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many forumposts.
     */
    data: forumpostCreateManyInput | forumpostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * forumpost update
   */
  export type forumpostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumpost
     */
    select?: forumpostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumpost
     */
    omit?: forumpostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumpostInclude<ExtArgs> | null
    /**
     * The data needed to update a forumpost.
     */
    data: XOR<forumpostUpdateInput, forumpostUncheckedUpdateInput>
    /**
     * Choose, which forumpost to update.
     */
    where: forumpostWhereUniqueInput
  }

  /**
   * forumpost updateMany
   */
  export type forumpostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update forumposts.
     */
    data: XOR<forumpostUpdateManyMutationInput, forumpostUncheckedUpdateManyInput>
    /**
     * Filter which forumposts to update
     */
    where?: forumpostWhereInput
    /**
     * Limit how many forumposts to update.
     */
    limit?: number
  }

  /**
   * forumpost upsert
   */
  export type forumpostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumpost
     */
    select?: forumpostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumpost
     */
    omit?: forumpostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumpostInclude<ExtArgs> | null
    /**
     * The filter to search for the forumpost to update in case it exists.
     */
    where: forumpostWhereUniqueInput
    /**
     * In case the forumpost found by the `where` argument doesn't exist, create a new forumpost with this data.
     */
    create: XOR<forumpostCreateInput, forumpostUncheckedCreateInput>
    /**
     * In case the forumpost was found with the provided `where` argument, update it with this data.
     */
    update: XOR<forumpostUpdateInput, forumpostUncheckedUpdateInput>
  }

  /**
   * forumpost delete
   */
  export type forumpostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumpost
     */
    select?: forumpostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumpost
     */
    omit?: forumpostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumpostInclude<ExtArgs> | null
    /**
     * Filter which forumpost to delete.
     */
    where: forumpostWhereUniqueInput
  }

  /**
   * forumpost deleteMany
   */
  export type forumpostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which forumposts to delete
     */
    where?: forumpostWhereInput
    /**
     * Limit how many forumposts to delete.
     */
    limit?: number
  }

  /**
   * forumpost without action
   */
  export type forumpostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumpost
     */
    select?: forumpostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumpost
     */
    omit?: forumpostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumpostInclude<ExtArgs> | null
  }


  /**
   * Model forumthread
   */

  export type AggregateForumthread = {
    _count: ForumthreadCountAggregateOutputType | null
    _avg: ForumthreadAvgAggregateOutputType | null
    _sum: ForumthreadSumAggregateOutputType | null
    _min: ForumthreadMinAggregateOutputType | null
    _max: ForumthreadMaxAggregateOutputType | null
  }

  export type ForumthreadAvgAggregateOutputType = {
    likes: number | null
  }

  export type ForumthreadSumAggregateOutputType = {
    likes: number | null
  }

  export type ForumthreadMinAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    authorId: string | null
    categoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    likes: number | null
  }

  export type ForumthreadMaxAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    authorId: string | null
    categoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    likes: number | null
  }

  export type ForumthreadCountAggregateOutputType = {
    id: number
    title: number
    content: number
    authorId: number
    categoryId: number
    createdAt: number
    updatedAt: number
    likes: number
    _all: number
  }


  export type ForumthreadAvgAggregateInputType = {
    likes?: true
  }

  export type ForumthreadSumAggregateInputType = {
    likes?: true
  }

  export type ForumthreadMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    authorId?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
    likes?: true
  }

  export type ForumthreadMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    authorId?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
    likes?: true
  }

  export type ForumthreadCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    authorId?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
    likes?: true
    _all?: true
  }

  export type ForumthreadAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which forumthread to aggregate.
     */
    where?: forumthreadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of forumthreads to fetch.
     */
    orderBy?: forumthreadOrderByWithRelationInput | forumthreadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: forumthreadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` forumthreads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` forumthreads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned forumthreads
    **/
    _count?: true | ForumthreadCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ForumthreadAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ForumthreadSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ForumthreadMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ForumthreadMaxAggregateInputType
  }

  export type GetForumthreadAggregateType<T extends ForumthreadAggregateArgs> = {
        [P in keyof T & keyof AggregateForumthread]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateForumthread[P]>
      : GetScalarType<T[P], AggregateForumthread[P]>
  }




  export type forumthreadGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: forumthreadWhereInput
    orderBy?: forumthreadOrderByWithAggregationInput | forumthreadOrderByWithAggregationInput[]
    by: ForumthreadScalarFieldEnum[] | ForumthreadScalarFieldEnum
    having?: forumthreadScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ForumthreadCountAggregateInputType | true
    _avg?: ForumthreadAvgAggregateInputType
    _sum?: ForumthreadSumAggregateInputType
    _min?: ForumthreadMinAggregateInputType
    _max?: ForumthreadMaxAggregateInputType
  }

  export type ForumthreadGroupByOutputType = {
    id: string
    title: string
    content: string
    authorId: string
    categoryId: string
    createdAt: Date
    updatedAt: Date
    likes: number
    _count: ForumthreadCountAggregateOutputType | null
    _avg: ForumthreadAvgAggregateOutputType | null
    _sum: ForumthreadSumAggregateOutputType | null
    _min: ForumthreadMinAggregateOutputType | null
    _max: ForumthreadMaxAggregateOutputType | null
  }

  type GetForumthreadGroupByPayload<T extends forumthreadGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ForumthreadGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ForumthreadGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ForumthreadGroupByOutputType[P]>
            : GetScalarType<T[P], ForumthreadGroupByOutputType[P]>
        }
      >
    >


  export type forumthreadSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    authorId?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    likes?: boolean
    forumpost?: boolean | forumthread$forumpostArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
    forumcategory?: boolean | forumcategoryDefaultArgs<ExtArgs>
    _count?: boolean | ForumthreadCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["forumthread"]>



  export type forumthreadSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    authorId?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    likes?: boolean
  }

  export type forumthreadOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "content" | "authorId" | "categoryId" | "createdAt" | "updatedAt" | "likes", ExtArgs["result"]["forumthread"]>
  export type forumthreadInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    forumpost?: boolean | forumthread$forumpostArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
    forumcategory?: boolean | forumcategoryDefaultArgs<ExtArgs>
    _count?: boolean | ForumthreadCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $forumthreadPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "forumthread"
    objects: {
      forumpost: Prisma.$forumpostPayload<ExtArgs>[]
      user: Prisma.$userPayload<ExtArgs>
      forumcategory: Prisma.$forumcategoryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      content: string
      authorId: string
      categoryId: string
      createdAt: Date
      updatedAt: Date
      likes: number
    }, ExtArgs["result"]["forumthread"]>
    composites: {}
  }

  type forumthreadGetPayload<S extends boolean | null | undefined | forumthreadDefaultArgs> = $Result.GetResult<Prisma.$forumthreadPayload, S>

  type forumthreadCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<forumthreadFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ForumthreadCountAggregateInputType | true
    }

  export interface forumthreadDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['forumthread'], meta: { name: 'forumthread' } }
    /**
     * Find zero or one Forumthread that matches the filter.
     * @param {forumthreadFindUniqueArgs} args - Arguments to find a Forumthread
     * @example
     * // Get one Forumthread
     * const forumthread = await prisma.forumthread.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends forumthreadFindUniqueArgs>(args: SelectSubset<T, forumthreadFindUniqueArgs<ExtArgs>>): Prisma__forumthreadClient<$Result.GetResult<Prisma.$forumthreadPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Forumthread that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {forumthreadFindUniqueOrThrowArgs} args - Arguments to find a Forumthread
     * @example
     * // Get one Forumthread
     * const forumthread = await prisma.forumthread.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends forumthreadFindUniqueOrThrowArgs>(args: SelectSubset<T, forumthreadFindUniqueOrThrowArgs<ExtArgs>>): Prisma__forumthreadClient<$Result.GetResult<Prisma.$forumthreadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Forumthread that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumthreadFindFirstArgs} args - Arguments to find a Forumthread
     * @example
     * // Get one Forumthread
     * const forumthread = await prisma.forumthread.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends forumthreadFindFirstArgs>(args?: SelectSubset<T, forumthreadFindFirstArgs<ExtArgs>>): Prisma__forumthreadClient<$Result.GetResult<Prisma.$forumthreadPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Forumthread that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumthreadFindFirstOrThrowArgs} args - Arguments to find a Forumthread
     * @example
     * // Get one Forumthread
     * const forumthread = await prisma.forumthread.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends forumthreadFindFirstOrThrowArgs>(args?: SelectSubset<T, forumthreadFindFirstOrThrowArgs<ExtArgs>>): Prisma__forumthreadClient<$Result.GetResult<Prisma.$forumthreadPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Forumthreads that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumthreadFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Forumthreads
     * const forumthreads = await prisma.forumthread.findMany()
     * 
     * // Get first 10 Forumthreads
     * const forumthreads = await prisma.forumthread.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const forumthreadWithIdOnly = await prisma.forumthread.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends forumthreadFindManyArgs>(args?: SelectSubset<T, forumthreadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$forumthreadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Forumthread.
     * @param {forumthreadCreateArgs} args - Arguments to create a Forumthread.
     * @example
     * // Create one Forumthread
     * const Forumthread = await prisma.forumthread.create({
     *   data: {
     *     // ... data to create a Forumthread
     *   }
     * })
     * 
     */
    create<T extends forumthreadCreateArgs>(args: SelectSubset<T, forumthreadCreateArgs<ExtArgs>>): Prisma__forumthreadClient<$Result.GetResult<Prisma.$forumthreadPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Forumthreads.
     * @param {forumthreadCreateManyArgs} args - Arguments to create many Forumthreads.
     * @example
     * // Create many Forumthreads
     * const forumthread = await prisma.forumthread.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends forumthreadCreateManyArgs>(args?: SelectSubset<T, forumthreadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Forumthread.
     * @param {forumthreadDeleteArgs} args - Arguments to delete one Forumthread.
     * @example
     * // Delete one Forumthread
     * const Forumthread = await prisma.forumthread.delete({
     *   where: {
     *     // ... filter to delete one Forumthread
     *   }
     * })
     * 
     */
    delete<T extends forumthreadDeleteArgs>(args: SelectSubset<T, forumthreadDeleteArgs<ExtArgs>>): Prisma__forumthreadClient<$Result.GetResult<Prisma.$forumthreadPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Forumthread.
     * @param {forumthreadUpdateArgs} args - Arguments to update one Forumthread.
     * @example
     * // Update one Forumthread
     * const forumthread = await prisma.forumthread.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends forumthreadUpdateArgs>(args: SelectSubset<T, forumthreadUpdateArgs<ExtArgs>>): Prisma__forumthreadClient<$Result.GetResult<Prisma.$forumthreadPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Forumthreads.
     * @param {forumthreadDeleteManyArgs} args - Arguments to filter Forumthreads to delete.
     * @example
     * // Delete a few Forumthreads
     * const { count } = await prisma.forumthread.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends forumthreadDeleteManyArgs>(args?: SelectSubset<T, forumthreadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Forumthreads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumthreadUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Forumthreads
     * const forumthread = await prisma.forumthread.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends forumthreadUpdateManyArgs>(args: SelectSubset<T, forumthreadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Forumthread.
     * @param {forumthreadUpsertArgs} args - Arguments to update or create a Forumthread.
     * @example
     * // Update or create a Forumthread
     * const forumthread = await prisma.forumthread.upsert({
     *   create: {
     *     // ... data to create a Forumthread
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Forumthread we want to update
     *   }
     * })
     */
    upsert<T extends forumthreadUpsertArgs>(args: SelectSubset<T, forumthreadUpsertArgs<ExtArgs>>): Prisma__forumthreadClient<$Result.GetResult<Prisma.$forumthreadPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Forumthreads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumthreadCountArgs} args - Arguments to filter Forumthreads to count.
     * @example
     * // Count the number of Forumthreads
     * const count = await prisma.forumthread.count({
     *   where: {
     *     // ... the filter for the Forumthreads we want to count
     *   }
     * })
    **/
    count<T extends forumthreadCountArgs>(
      args?: Subset<T, forumthreadCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ForumthreadCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Forumthread.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ForumthreadAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ForumthreadAggregateArgs>(args: Subset<T, ForumthreadAggregateArgs>): Prisma.PrismaPromise<GetForumthreadAggregateType<T>>

    /**
     * Group by Forumthread.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {forumthreadGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends forumthreadGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: forumthreadGroupByArgs['orderBy'] }
        : { orderBy?: forumthreadGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, forumthreadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetForumthreadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the forumthread model
   */
  readonly fields: forumthreadFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for forumthread.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__forumthreadClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    forumpost<T extends forumthread$forumpostArgs<ExtArgs> = {}>(args?: Subset<T, forumthread$forumpostArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$forumpostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user<T extends userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, userDefaultArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    forumcategory<T extends forumcategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, forumcategoryDefaultArgs<ExtArgs>>): Prisma__forumcategoryClient<$Result.GetResult<Prisma.$forumcategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the forumthread model
   */
  interface forumthreadFieldRefs {
    readonly id: FieldRef<"forumthread", 'String'>
    readonly title: FieldRef<"forumthread", 'String'>
    readonly content: FieldRef<"forumthread", 'String'>
    readonly authorId: FieldRef<"forumthread", 'String'>
    readonly categoryId: FieldRef<"forumthread", 'String'>
    readonly createdAt: FieldRef<"forumthread", 'DateTime'>
    readonly updatedAt: FieldRef<"forumthread", 'DateTime'>
    readonly likes: FieldRef<"forumthread", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * forumthread findUnique
   */
  export type forumthreadFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumthread
     */
    select?: forumthreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumthread
     */
    omit?: forumthreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumthreadInclude<ExtArgs> | null
    /**
     * Filter, which forumthread to fetch.
     */
    where: forumthreadWhereUniqueInput
  }

  /**
   * forumthread findUniqueOrThrow
   */
  export type forumthreadFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumthread
     */
    select?: forumthreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumthread
     */
    omit?: forumthreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumthreadInclude<ExtArgs> | null
    /**
     * Filter, which forumthread to fetch.
     */
    where: forumthreadWhereUniqueInput
  }

  /**
   * forumthread findFirst
   */
  export type forumthreadFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumthread
     */
    select?: forumthreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumthread
     */
    omit?: forumthreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumthreadInclude<ExtArgs> | null
    /**
     * Filter, which forumthread to fetch.
     */
    where?: forumthreadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of forumthreads to fetch.
     */
    orderBy?: forumthreadOrderByWithRelationInput | forumthreadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for forumthreads.
     */
    cursor?: forumthreadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` forumthreads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` forumthreads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of forumthreads.
     */
    distinct?: ForumthreadScalarFieldEnum | ForumthreadScalarFieldEnum[]
  }

  /**
   * forumthread findFirstOrThrow
   */
  export type forumthreadFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumthread
     */
    select?: forumthreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumthread
     */
    omit?: forumthreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumthreadInclude<ExtArgs> | null
    /**
     * Filter, which forumthread to fetch.
     */
    where?: forumthreadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of forumthreads to fetch.
     */
    orderBy?: forumthreadOrderByWithRelationInput | forumthreadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for forumthreads.
     */
    cursor?: forumthreadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` forumthreads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` forumthreads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of forumthreads.
     */
    distinct?: ForumthreadScalarFieldEnum | ForumthreadScalarFieldEnum[]
  }

  /**
   * forumthread findMany
   */
  export type forumthreadFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumthread
     */
    select?: forumthreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumthread
     */
    omit?: forumthreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumthreadInclude<ExtArgs> | null
    /**
     * Filter, which forumthreads to fetch.
     */
    where?: forumthreadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of forumthreads to fetch.
     */
    orderBy?: forumthreadOrderByWithRelationInput | forumthreadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing forumthreads.
     */
    cursor?: forumthreadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` forumthreads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` forumthreads.
     */
    skip?: number
    distinct?: ForumthreadScalarFieldEnum | ForumthreadScalarFieldEnum[]
  }

  /**
   * forumthread create
   */
  export type forumthreadCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumthread
     */
    select?: forumthreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumthread
     */
    omit?: forumthreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumthreadInclude<ExtArgs> | null
    /**
     * The data needed to create a forumthread.
     */
    data: XOR<forumthreadCreateInput, forumthreadUncheckedCreateInput>
  }

  /**
   * forumthread createMany
   */
  export type forumthreadCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many forumthreads.
     */
    data: forumthreadCreateManyInput | forumthreadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * forumthread update
   */
  export type forumthreadUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumthread
     */
    select?: forumthreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumthread
     */
    omit?: forumthreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumthreadInclude<ExtArgs> | null
    /**
     * The data needed to update a forumthread.
     */
    data: XOR<forumthreadUpdateInput, forumthreadUncheckedUpdateInput>
    /**
     * Choose, which forumthread to update.
     */
    where: forumthreadWhereUniqueInput
  }

  /**
   * forumthread updateMany
   */
  export type forumthreadUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update forumthreads.
     */
    data: XOR<forumthreadUpdateManyMutationInput, forumthreadUncheckedUpdateManyInput>
    /**
     * Filter which forumthreads to update
     */
    where?: forumthreadWhereInput
    /**
     * Limit how many forumthreads to update.
     */
    limit?: number
  }

  /**
   * forumthread upsert
   */
  export type forumthreadUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumthread
     */
    select?: forumthreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumthread
     */
    omit?: forumthreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumthreadInclude<ExtArgs> | null
    /**
     * The filter to search for the forumthread to update in case it exists.
     */
    where: forumthreadWhereUniqueInput
    /**
     * In case the forumthread found by the `where` argument doesn't exist, create a new forumthread with this data.
     */
    create: XOR<forumthreadCreateInput, forumthreadUncheckedCreateInput>
    /**
     * In case the forumthread was found with the provided `where` argument, update it with this data.
     */
    update: XOR<forumthreadUpdateInput, forumthreadUncheckedUpdateInput>
  }

  /**
   * forumthread delete
   */
  export type forumthreadDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumthread
     */
    select?: forumthreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumthread
     */
    omit?: forumthreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumthreadInclude<ExtArgs> | null
    /**
     * Filter which forumthread to delete.
     */
    where: forumthreadWhereUniqueInput
  }

  /**
   * forumthread deleteMany
   */
  export type forumthreadDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which forumthreads to delete
     */
    where?: forumthreadWhereInput
    /**
     * Limit how many forumthreads to delete.
     */
    limit?: number
  }

  /**
   * forumthread.forumpost
   */
  export type forumthread$forumpostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumpost
     */
    select?: forumpostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumpost
     */
    omit?: forumpostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumpostInclude<ExtArgs> | null
    where?: forumpostWhereInput
    orderBy?: forumpostOrderByWithRelationInput | forumpostOrderByWithRelationInput[]
    cursor?: forumpostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ForumpostScalarFieldEnum | ForumpostScalarFieldEnum[]
  }

  /**
   * forumthread without action
   */
  export type forumthreadDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumthread
     */
    select?: forumthreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumthread
     */
    omit?: forumthreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumthreadInclude<ExtArgs> | null
  }


  /**
   * Model product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    category: string | null
    images: string | null
    contactInfo: string | null
    ownerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    category: string | null
    images: string | null
    contactInfo: string | null
    ownerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    title: number
    description: number
    category: number
    images: number
    contactInfo: number
    ownerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    category?: true
    images?: true
    contactInfo?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    category?: true
    images?: true
    contactInfo?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    category?: true
    images?: true
    contactInfo?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which product to aggregate.
     */
    where?: productWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of products to fetch.
     */
    orderBy?: productOrderByWithRelationInput | productOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: productWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type productGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: productWhereInput
    orderBy?: productOrderByWithAggregationInput | productOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: productScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: string
    title: string
    description: string
    category: string
    images: string
    contactInfo: string | null
    ownerId: string
    createdAt: Date
    updatedAt: Date
    _count: ProductCountAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends productGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type productSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    images?: boolean
    contactInfo?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>



  export type productSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    images?: boolean
    contactInfo?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type productOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "category" | "images" | "contactInfo" | "ownerId" | "createdAt" | "updatedAt", ExtArgs["result"]["product"]>
  export type productInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | userDefaultArgs<ExtArgs>
  }

  export type $productPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "product"
    objects: {
      user: Prisma.$userPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      category: string
      images: string
      contactInfo: string | null
      ownerId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type productGetPayload<S extends boolean | null | undefined | productDefaultArgs> = $Result.GetResult<Prisma.$productPayload, S>

  type productCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<productFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface productDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['product'], meta: { name: 'product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {productFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends productFindUniqueArgs>(args: SelectSubset<T, productFindUniqueArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {productFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends productFindUniqueOrThrowArgs>(args: SelectSubset<T, productFindUniqueOrThrowArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends productFindFirstArgs>(args?: SelectSubset<T, productFindFirstArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends productFindFirstOrThrowArgs>(args?: SelectSubset<T, productFindFirstOrThrowArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends productFindManyArgs>(args?: SelectSubset<T, productFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product.
     * @param {productCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends productCreateArgs>(args: SelectSubset<T, productCreateArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {productCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends productCreateManyArgs>(args?: SelectSubset<T, productCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Product.
     * @param {productDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends productDeleteArgs>(args: SelectSubset<T, productDeleteArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product.
     * @param {productUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends productUpdateArgs>(args: SelectSubset<T, productUpdateArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {productDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends productDeleteManyArgs>(args?: SelectSubset<T, productDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends productUpdateManyArgs>(args: SelectSubset<T, productUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Product.
     * @param {productUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends productUpsertArgs>(args: SelectSubset<T, productUpsertArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends productCountArgs>(
      args?: Subset<T, productCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends productGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: productGroupByArgs['orderBy'] }
        : { orderBy?: productGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, productGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the product model
   */
  readonly fields: productFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__productClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, userDefaultArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the product model
   */
  interface productFieldRefs {
    readonly id: FieldRef<"product", 'String'>
    readonly title: FieldRef<"product", 'String'>
    readonly description: FieldRef<"product", 'String'>
    readonly category: FieldRef<"product", 'String'>
    readonly images: FieldRef<"product", 'String'>
    readonly contactInfo: FieldRef<"product", 'String'>
    readonly ownerId: FieldRef<"product", 'String'>
    readonly createdAt: FieldRef<"product", 'DateTime'>
    readonly updatedAt: FieldRef<"product", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * product findUnique
   */
  export type productFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter, which product to fetch.
     */
    where: productWhereUniqueInput
  }

  /**
   * product findUniqueOrThrow
   */
  export type productFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter, which product to fetch.
     */
    where: productWhereUniqueInput
  }

  /**
   * product findFirst
   */
  export type productFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter, which product to fetch.
     */
    where?: productWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of products to fetch.
     */
    orderBy?: productOrderByWithRelationInput | productOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for products.
     */
    cursor?: productWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * product findFirstOrThrow
   */
  export type productFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter, which product to fetch.
     */
    where?: productWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of products to fetch.
     */
    orderBy?: productOrderByWithRelationInput | productOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for products.
     */
    cursor?: productWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * product findMany
   */
  export type productFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter, which products to fetch.
     */
    where?: productWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of products to fetch.
     */
    orderBy?: productOrderByWithRelationInput | productOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing products.
     */
    cursor?: productWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * product create
   */
  export type productCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * The data needed to create a product.
     */
    data: XOR<productCreateInput, productUncheckedCreateInput>
  }

  /**
   * product createMany
   */
  export type productCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many products.
     */
    data: productCreateManyInput | productCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * product update
   */
  export type productUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * The data needed to update a product.
     */
    data: XOR<productUpdateInput, productUncheckedUpdateInput>
    /**
     * Choose, which product to update.
     */
    where: productWhereUniqueInput
  }

  /**
   * product updateMany
   */
  export type productUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update products.
     */
    data: XOR<productUpdateManyMutationInput, productUncheckedUpdateManyInput>
    /**
     * Filter which products to update
     */
    where?: productWhereInput
    /**
     * Limit how many products to update.
     */
    limit?: number
  }

  /**
   * product upsert
   */
  export type productUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * The filter to search for the product to update in case it exists.
     */
    where: productWhereUniqueInput
    /**
     * In case the product found by the `where` argument doesn't exist, create a new product with this data.
     */
    create: XOR<productCreateInput, productUncheckedCreateInput>
    /**
     * In case the product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<productUpdateInput, productUncheckedUpdateInput>
  }

  /**
   * product delete
   */
  export type productDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter which product to delete.
     */
    where: productWhereUniqueInput
  }

  /**
   * product deleteMany
   */
  export type productDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which products to delete
     */
    where?: productWhereInput
    /**
     * Limit how many products to delete.
     */
    limit?: number
  }

  /**
   * product without action
   */
  export type productDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
  }


  /**
   * Model session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionToken: number
    userId: number
    expires: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which session to aggregate.
     */
    where?: sessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sessions to fetch.
     */
    orderBy?: sessionOrderByWithRelationInput | sessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: sessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type sessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: sessionWhereInput
    orderBy?: sessionOrderByWithAggregationInput | sessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: sessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionToken: string
    userId: string
    expires: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends sessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type sessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>



  export type sessionSelectScalar = {
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
  }

  export type sessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionToken" | "userId" | "expires", ExtArgs["result"]["session"]>
  export type sessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | userDefaultArgs<ExtArgs>
  }

  export type $sessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "session"
    objects: {
      user: Prisma.$userPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionToken: string
      userId: string
      expires: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type sessionGetPayload<S extends boolean | null | undefined | sessionDefaultArgs> = $Result.GetResult<Prisma.$sessionPayload, S>

  type sessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<sessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface sessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['session'], meta: { name: 'session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {sessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends sessionFindUniqueArgs>(args: SelectSubset<T, sessionFindUniqueArgs<ExtArgs>>): Prisma__sessionClient<$Result.GetResult<Prisma.$sessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {sessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends sessionFindUniqueOrThrowArgs>(args: SelectSubset<T, sessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__sessionClient<$Result.GetResult<Prisma.$sessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends sessionFindFirstArgs>(args?: SelectSubset<T, sessionFindFirstArgs<ExtArgs>>): Prisma__sessionClient<$Result.GetResult<Prisma.$sessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends sessionFindFirstOrThrowArgs>(args?: SelectSubset<T, sessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__sessionClient<$Result.GetResult<Prisma.$sessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends sessionFindManyArgs>(args?: SelectSubset<T, sessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {sessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends sessionCreateArgs>(args: SelectSubset<T, sessionCreateArgs<ExtArgs>>): Prisma__sessionClient<$Result.GetResult<Prisma.$sessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {sessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends sessionCreateManyArgs>(args?: SelectSubset<T, sessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Session.
     * @param {sessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends sessionDeleteArgs>(args: SelectSubset<T, sessionDeleteArgs<ExtArgs>>): Prisma__sessionClient<$Result.GetResult<Prisma.$sessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {sessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends sessionUpdateArgs>(args: SelectSubset<T, sessionUpdateArgs<ExtArgs>>): Prisma__sessionClient<$Result.GetResult<Prisma.$sessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {sessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends sessionDeleteManyArgs>(args?: SelectSubset<T, sessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends sessionUpdateManyArgs>(args: SelectSubset<T, sessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Session.
     * @param {sessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends sessionUpsertArgs>(args: SelectSubset<T, sessionUpsertArgs<ExtArgs>>): Prisma__sessionClient<$Result.GetResult<Prisma.$sessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends sessionCountArgs>(
      args?: Subset<T, sessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends sessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: sessionGroupByArgs['orderBy'] }
        : { orderBy?: sessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, sessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the session model
   */
  readonly fields: sessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__sessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, userDefaultArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the session model
   */
  interface sessionFieldRefs {
    readonly id: FieldRef<"session", 'String'>
    readonly sessionToken: FieldRef<"session", 'String'>
    readonly userId: FieldRef<"session", 'String'>
    readonly expires: FieldRef<"session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * session findUnique
   */
  export type sessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the session
     */
    select?: sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the session
     */
    omit?: sessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionInclude<ExtArgs> | null
    /**
     * Filter, which session to fetch.
     */
    where: sessionWhereUniqueInput
  }

  /**
   * session findUniqueOrThrow
   */
  export type sessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the session
     */
    select?: sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the session
     */
    omit?: sessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionInclude<ExtArgs> | null
    /**
     * Filter, which session to fetch.
     */
    where: sessionWhereUniqueInput
  }

  /**
   * session findFirst
   */
  export type sessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the session
     */
    select?: sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the session
     */
    omit?: sessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionInclude<ExtArgs> | null
    /**
     * Filter, which session to fetch.
     */
    where?: sessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sessions to fetch.
     */
    orderBy?: sessionOrderByWithRelationInput | sessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sessions.
     */
    cursor?: sessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * session findFirstOrThrow
   */
  export type sessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the session
     */
    select?: sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the session
     */
    omit?: sessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionInclude<ExtArgs> | null
    /**
     * Filter, which session to fetch.
     */
    where?: sessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sessions to fetch.
     */
    orderBy?: sessionOrderByWithRelationInput | sessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sessions.
     */
    cursor?: sessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * session findMany
   */
  export type sessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the session
     */
    select?: sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the session
     */
    omit?: sessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionInclude<ExtArgs> | null
    /**
     * Filter, which sessions to fetch.
     */
    where?: sessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sessions to fetch.
     */
    orderBy?: sessionOrderByWithRelationInput | sessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing sessions.
     */
    cursor?: sessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * session create
   */
  export type sessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the session
     */
    select?: sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the session
     */
    omit?: sessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionInclude<ExtArgs> | null
    /**
     * The data needed to create a session.
     */
    data: XOR<sessionCreateInput, sessionUncheckedCreateInput>
  }

  /**
   * session createMany
   */
  export type sessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many sessions.
     */
    data: sessionCreateManyInput | sessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * session update
   */
  export type sessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the session
     */
    select?: sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the session
     */
    omit?: sessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionInclude<ExtArgs> | null
    /**
     * The data needed to update a session.
     */
    data: XOR<sessionUpdateInput, sessionUncheckedUpdateInput>
    /**
     * Choose, which session to update.
     */
    where: sessionWhereUniqueInput
  }

  /**
   * session updateMany
   */
  export type sessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update sessions.
     */
    data: XOR<sessionUpdateManyMutationInput, sessionUncheckedUpdateManyInput>
    /**
     * Filter which sessions to update
     */
    where?: sessionWhereInput
    /**
     * Limit how many sessions to update.
     */
    limit?: number
  }

  /**
   * session upsert
   */
  export type sessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the session
     */
    select?: sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the session
     */
    omit?: sessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionInclude<ExtArgs> | null
    /**
     * The filter to search for the session to update in case it exists.
     */
    where: sessionWhereUniqueInput
    /**
     * In case the session found by the `where` argument doesn't exist, create a new session with this data.
     */
    create: XOR<sessionCreateInput, sessionUncheckedCreateInput>
    /**
     * In case the session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<sessionUpdateInput, sessionUncheckedUpdateInput>
  }

  /**
   * session delete
   */
  export type sessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the session
     */
    select?: sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the session
     */
    omit?: sessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionInclude<ExtArgs> | null
    /**
     * Filter which session to delete.
     */
    where: sessionWhereUniqueInput
  }

  /**
   * session deleteMany
   */
  export type sessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sessions to delete
     */
    where?: sessionWhereInput
    /**
     * Limit how many sessions to delete.
     */
    limit?: number
  }

  /**
   * session without action
   */
  export type sessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the session
     */
    select?: sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the session
     */
    omit?: sessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionInclude<ExtArgs> | null
  }


  /**
   * Model user
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    password: string | null
    image: string | null
    role: $Enums.user_role | null
    isVerified: boolean | null
    hasCipponMembership: boolean | null
    cipponMembershipType: $Enums.user_cipponMembershipType | null
    cipponId: string | null
    companyName: string | null
    phone: string | null
    location: string | null
    bio: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    password: string | null
    image: string | null
    role: $Enums.user_role | null
    isVerified: boolean | null
    hasCipponMembership: boolean | null
    cipponMembershipType: $Enums.user_cipponMembershipType | null
    cipponId: string | null
    companyName: string | null
    phone: string | null
    location: string | null
    bio: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    password: number
    image: number
    role: number
    isVerified: number
    hasCipponMembership: number
    cipponMembershipType: number
    cipponId: number
    companyName: number
    phone: number
    location: number
    bio: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    password?: true
    image?: true
    role?: true
    isVerified?: true
    hasCipponMembership?: true
    cipponMembershipType?: true
    cipponId?: true
    companyName?: true
    phone?: true
    location?: true
    bio?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    password?: true
    image?: true
    role?: true
    isVerified?: true
    hasCipponMembership?: true
    cipponMembershipType?: true
    cipponId?: true
    companyName?: true
    phone?: true
    location?: true
    bio?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    password?: true
    image?: true
    role?: true
    isVerified?: true
    hasCipponMembership?: true
    cipponMembershipType?: true
    cipponId?: true
    companyName?: true
    phone?: true
    location?: true
    bio?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user to aggregate.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type userGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: userWhereInput
    orderBy?: userOrderByWithAggregationInput | userOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: userScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string | null
    email: string | null
    emailVerified: Date | null
    password: string | null
    image: string | null
    role: $Enums.user_role
    isVerified: boolean
    hasCipponMembership: boolean
    cipponMembershipType: $Enums.user_cipponMembershipType
    cipponId: string | null
    companyName: string | null
    phone: string | null
    location: string | null
    bio: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends userGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type userSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    password?: boolean
    image?: boolean
    role?: boolean
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: boolean
    cipponId?: boolean
    companyName?: boolean
    phone?: boolean
    location?: boolean
    bio?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | user$accountArgs<ExtArgs>
    agreement_agreement_initiatorIdTouser?: boolean | user$agreement_agreement_initiatorIdTouserArgs<ExtArgs>
    agreement_agreement_receiverIdTouser?: boolean | user$agreement_agreement_receiverIdTouserArgs<ExtArgs>
    complaint?: boolean | user$complaintArgs<ExtArgs>
    democlass?: boolean | user$democlassArgs<ExtArgs>
    forumpost?: boolean | user$forumpostArgs<ExtArgs>
    forumthread?: boolean | user$forumthreadArgs<ExtArgs>
    product?: boolean | user$productArgs<ExtArgs>
    session?: boolean | user$sessionArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type userSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    password?: boolean
    image?: boolean
    role?: boolean
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: boolean
    cipponId?: boolean
    companyName?: boolean
    phone?: boolean
    location?: boolean
    bio?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type userOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "password" | "image" | "role" | "isVerified" | "hasCipponMembership" | "cipponMembershipType" | "cipponId" | "companyName" | "phone" | "location" | "bio" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type userInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | user$accountArgs<ExtArgs>
    agreement_agreement_initiatorIdTouser?: boolean | user$agreement_agreement_initiatorIdTouserArgs<ExtArgs>
    agreement_agreement_receiverIdTouser?: boolean | user$agreement_agreement_receiverIdTouserArgs<ExtArgs>
    complaint?: boolean | user$complaintArgs<ExtArgs>
    democlass?: boolean | user$democlassArgs<ExtArgs>
    forumpost?: boolean | user$forumpostArgs<ExtArgs>
    forumthread?: boolean | user$forumthreadArgs<ExtArgs>
    product?: boolean | user$productArgs<ExtArgs>
    session?: boolean | user$sessionArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $userPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user"
    objects: {
      account: Prisma.$accountPayload<ExtArgs>[]
      agreement_agreement_initiatorIdTouser: Prisma.$agreementPayload<ExtArgs>[]
      agreement_agreement_receiverIdTouser: Prisma.$agreementPayload<ExtArgs>[]
      complaint: Prisma.$complaintPayload<ExtArgs>[]
      democlass: Prisma.$democlassPayload<ExtArgs>[]
      forumpost: Prisma.$forumpostPayload<ExtArgs>[]
      forumthread: Prisma.$forumthreadPayload<ExtArgs>[]
      product: Prisma.$productPayload<ExtArgs>[]
      session: Prisma.$sessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string | null
      emailVerified: Date | null
      password: string | null
      image: string | null
      role: $Enums.user_role
      isVerified: boolean
      hasCipponMembership: boolean
      cipponMembershipType: $Enums.user_cipponMembershipType
      cipponId: string | null
      companyName: string | null
      phone: string | null
      location: string | null
      bio: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type userGetPayload<S extends boolean | null | undefined | userDefaultArgs> = $Result.GetResult<Prisma.$userPayload, S>

  type userCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<userFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface userDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user'], meta: { name: 'user' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {userFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends userFindUniqueArgs>(args: SelectSubset<T, userFindUniqueArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {userFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends userFindUniqueOrThrowArgs>(args: SelectSubset<T, userFindUniqueOrThrowArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends userFindFirstArgs>(args?: SelectSubset<T, userFindFirstArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends userFindFirstOrThrowArgs>(args?: SelectSubset<T, userFindFirstOrThrowArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends userFindManyArgs>(args?: SelectSubset<T, userFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {userCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends userCreateArgs>(args: SelectSubset<T, userCreateArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {userCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends userCreateManyArgs>(args?: SelectSubset<T, userCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {userDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends userDeleteArgs>(args: SelectSubset<T, userDeleteArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {userUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends userUpdateArgs>(args: SelectSubset<T, userUpdateArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {userDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends userDeleteManyArgs>(args?: SelectSubset<T, userDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends userUpdateManyArgs>(args: SelectSubset<T, userUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {userUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends userUpsertArgs>(args: SelectSubset<T, userUpsertArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends userCountArgs>(
      args?: Subset<T, userCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends userGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: userGroupByArgs['orderBy'] }
        : { orderBy?: userGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, userGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user model
   */
  readonly fields: userFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__userClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account<T extends user$accountArgs<ExtArgs> = {}>(args?: Subset<T, user$accountArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$accountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    agreement_agreement_initiatorIdTouser<T extends user$agreement_agreement_initiatorIdTouserArgs<ExtArgs> = {}>(args?: Subset<T, user$agreement_agreement_initiatorIdTouserArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$agreementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    agreement_agreement_receiverIdTouser<T extends user$agreement_agreement_receiverIdTouserArgs<ExtArgs> = {}>(args?: Subset<T, user$agreement_agreement_receiverIdTouserArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$agreementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    complaint<T extends user$complaintArgs<ExtArgs> = {}>(args?: Subset<T, user$complaintArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$complaintPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    democlass<T extends user$democlassArgs<ExtArgs> = {}>(args?: Subset<T, user$democlassArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$democlassPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    forumpost<T extends user$forumpostArgs<ExtArgs> = {}>(args?: Subset<T, user$forumpostArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$forumpostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    forumthread<T extends user$forumthreadArgs<ExtArgs> = {}>(args?: Subset<T, user$forumthreadArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$forumthreadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    product<T extends user$productArgs<ExtArgs> = {}>(args?: Subset<T, user$productArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    session<T extends user$sessionArgs<ExtArgs> = {}>(args?: Subset<T, user$sessionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the user model
   */
  interface userFieldRefs {
    readonly id: FieldRef<"user", 'String'>
    readonly name: FieldRef<"user", 'String'>
    readonly email: FieldRef<"user", 'String'>
    readonly emailVerified: FieldRef<"user", 'DateTime'>
    readonly password: FieldRef<"user", 'String'>
    readonly image: FieldRef<"user", 'String'>
    readonly role: FieldRef<"user", 'user_role'>
    readonly isVerified: FieldRef<"user", 'Boolean'>
    readonly hasCipponMembership: FieldRef<"user", 'Boolean'>
    readonly cipponMembershipType: FieldRef<"user", 'user_cipponMembershipType'>
    readonly cipponId: FieldRef<"user", 'String'>
    readonly companyName: FieldRef<"user", 'String'>
    readonly phone: FieldRef<"user", 'String'>
    readonly location: FieldRef<"user", 'String'>
    readonly bio: FieldRef<"user", 'String'>
    readonly createdAt: FieldRef<"user", 'DateTime'>
    readonly updatedAt: FieldRef<"user", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * user findUnique
   */
  export type userFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where: userWhereUniqueInput
  }

  /**
   * user findUniqueOrThrow
   */
  export type userFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where: userWhereUniqueInput
  }

  /**
   * user findFirst
   */
  export type userFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user findFirstOrThrow
   */
  export type userFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user findMany
   */
  export type userFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user create
   */
  export type userCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The data needed to create a user.
     */
    data: XOR<userCreateInput, userUncheckedCreateInput>
  }

  /**
   * user createMany
   */
  export type userCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: userCreateManyInput | userCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user update
   */
  export type userUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The data needed to update a user.
     */
    data: XOR<userUpdateInput, userUncheckedUpdateInput>
    /**
     * Choose, which user to update.
     */
    where: userWhereUniqueInput
  }

  /**
   * user updateMany
   */
  export type userUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<userUpdateManyMutationInput, userUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: userWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * user upsert
   */
  export type userUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The filter to search for the user to update in case it exists.
     */
    where: userWhereUniqueInput
    /**
     * In case the user found by the `where` argument doesn't exist, create a new user with this data.
     */
    create: XOR<userCreateInput, userUncheckedCreateInput>
    /**
     * In case the user was found with the provided `where` argument, update it with this data.
     */
    update: XOR<userUpdateInput, userUncheckedUpdateInput>
  }

  /**
   * user delete
   */
  export type userDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter which user to delete.
     */
    where: userWhereUniqueInput
  }

  /**
   * user deleteMany
   */
  export type userDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: userWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * user.account
   */
  export type user$accountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the account
     */
    select?: accountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the account
     */
    omit?: accountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountInclude<ExtArgs> | null
    where?: accountWhereInput
    orderBy?: accountOrderByWithRelationInput | accountOrderByWithRelationInput[]
    cursor?: accountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * user.agreement_agreement_initiatorIdTouser
   */
  export type user$agreement_agreement_initiatorIdTouserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agreement
     */
    select?: agreementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the agreement
     */
    omit?: agreementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: agreementInclude<ExtArgs> | null
    where?: agreementWhereInput
    orderBy?: agreementOrderByWithRelationInput | agreementOrderByWithRelationInput[]
    cursor?: agreementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgreementScalarFieldEnum | AgreementScalarFieldEnum[]
  }

  /**
   * user.agreement_agreement_receiverIdTouser
   */
  export type user$agreement_agreement_receiverIdTouserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the agreement
     */
    select?: agreementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the agreement
     */
    omit?: agreementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: agreementInclude<ExtArgs> | null
    where?: agreementWhereInput
    orderBy?: agreementOrderByWithRelationInput | agreementOrderByWithRelationInput[]
    cursor?: agreementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgreementScalarFieldEnum | AgreementScalarFieldEnum[]
  }

  /**
   * user.complaint
   */
  export type user$complaintArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the complaint
     */
    select?: complaintSelect<ExtArgs> | null
    /**
     * Omit specific fields from the complaint
     */
    omit?: complaintOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: complaintInclude<ExtArgs> | null
    where?: complaintWhereInput
    orderBy?: complaintOrderByWithRelationInput | complaintOrderByWithRelationInput[]
    cursor?: complaintWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ComplaintScalarFieldEnum | ComplaintScalarFieldEnum[]
  }

  /**
   * user.democlass
   */
  export type user$democlassArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the democlass
     */
    select?: democlassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the democlass
     */
    omit?: democlassOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: democlassInclude<ExtArgs> | null
    where?: democlassWhereInput
    orderBy?: democlassOrderByWithRelationInput | democlassOrderByWithRelationInput[]
    cursor?: democlassWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DemoclassScalarFieldEnum | DemoclassScalarFieldEnum[]
  }

  /**
   * user.forumpost
   */
  export type user$forumpostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumpost
     */
    select?: forumpostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumpost
     */
    omit?: forumpostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumpostInclude<ExtArgs> | null
    where?: forumpostWhereInput
    orderBy?: forumpostOrderByWithRelationInput | forumpostOrderByWithRelationInput[]
    cursor?: forumpostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ForumpostScalarFieldEnum | ForumpostScalarFieldEnum[]
  }

  /**
   * user.forumthread
   */
  export type user$forumthreadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the forumthread
     */
    select?: forumthreadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the forumthread
     */
    omit?: forumthreadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: forumthreadInclude<ExtArgs> | null
    where?: forumthreadWhereInput
    orderBy?: forumthreadOrderByWithRelationInput | forumthreadOrderByWithRelationInput[]
    cursor?: forumthreadWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ForumthreadScalarFieldEnum | ForumthreadScalarFieldEnum[]
  }

  /**
   * user.product
   */
  export type user$productArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    where?: productWhereInput
    orderBy?: productOrderByWithRelationInput | productOrderByWithRelationInput[]
    cursor?: productWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * user.session
   */
  export type user$sessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the session
     */
    select?: sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the session
     */
    omit?: sessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionInclude<ExtArgs> | null
    where?: sessionWhereInput
    orderBy?: sessionOrderByWithRelationInput | sessionOrderByWithRelationInput[]
    cursor?: sessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * user without action
   */
  export type userDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
  }


  /**
   * Model verificationtoken
   */

  export type AggregateVerificationtoken = {
    _count: VerificationtokenCountAggregateOutputType | null
    _min: VerificationtokenMinAggregateOutputType | null
    _max: VerificationtokenMaxAggregateOutputType | null
  }

  export type VerificationtokenMinAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationtokenMaxAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationtokenCountAggregateOutputType = {
    identifier: number
    token: number
    expires: number
    _all: number
  }


  export type VerificationtokenMinAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationtokenMaxAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationtokenCountAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
    _all?: true
  }

  export type VerificationtokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which verificationtoken to aggregate.
     */
    where?: verificationtokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of verificationtokens to fetch.
     */
    orderBy?: verificationtokenOrderByWithRelationInput | verificationtokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: verificationtokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` verificationtokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` verificationtokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned verificationtokens
    **/
    _count?: true | VerificationtokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationtokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationtokenMaxAggregateInputType
  }

  export type GetVerificationtokenAggregateType<T extends VerificationtokenAggregateArgs> = {
        [P in keyof T & keyof AggregateVerificationtoken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationtoken[P]>
      : GetScalarType<T[P], AggregateVerificationtoken[P]>
  }




  export type verificationtokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: verificationtokenWhereInput
    orderBy?: verificationtokenOrderByWithAggregationInput | verificationtokenOrderByWithAggregationInput[]
    by: VerificationtokenScalarFieldEnum[] | VerificationtokenScalarFieldEnum
    having?: verificationtokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationtokenCountAggregateInputType | true
    _min?: VerificationtokenMinAggregateInputType
    _max?: VerificationtokenMaxAggregateInputType
  }

  export type VerificationtokenGroupByOutputType = {
    identifier: string
    token: string
    expires: Date
    _count: VerificationtokenCountAggregateOutputType | null
    _min: VerificationtokenMinAggregateOutputType | null
    _max: VerificationtokenMaxAggregateOutputType | null
  }

  type GetVerificationtokenGroupByPayload<T extends verificationtokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationtokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationtokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationtokenGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationtokenGroupByOutputType[P]>
        }
      >
    >


  export type verificationtokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationtoken"]>



  export type verificationtokenSelectScalar = {
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }

  export type verificationtokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"identifier" | "token" | "expires", ExtArgs["result"]["verificationtoken"]>

  export type $verificationtokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "verificationtoken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      identifier: string
      token: string
      expires: Date
    }, ExtArgs["result"]["verificationtoken"]>
    composites: {}
  }

  type verificationtokenGetPayload<S extends boolean | null | undefined | verificationtokenDefaultArgs> = $Result.GetResult<Prisma.$verificationtokenPayload, S>

  type verificationtokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<verificationtokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationtokenCountAggregateInputType | true
    }

  export interface verificationtokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['verificationtoken'], meta: { name: 'verificationtoken' } }
    /**
     * Find zero or one Verificationtoken that matches the filter.
     * @param {verificationtokenFindUniqueArgs} args - Arguments to find a Verificationtoken
     * @example
     * // Get one Verificationtoken
     * const verificationtoken = await prisma.verificationtoken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends verificationtokenFindUniqueArgs>(args: SelectSubset<T, verificationtokenFindUniqueArgs<ExtArgs>>): Prisma__verificationtokenClient<$Result.GetResult<Prisma.$verificationtokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Verificationtoken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {verificationtokenFindUniqueOrThrowArgs} args - Arguments to find a Verificationtoken
     * @example
     * // Get one Verificationtoken
     * const verificationtoken = await prisma.verificationtoken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends verificationtokenFindUniqueOrThrowArgs>(args: SelectSubset<T, verificationtokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__verificationtokenClient<$Result.GetResult<Prisma.$verificationtokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verificationtoken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {verificationtokenFindFirstArgs} args - Arguments to find a Verificationtoken
     * @example
     * // Get one Verificationtoken
     * const verificationtoken = await prisma.verificationtoken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends verificationtokenFindFirstArgs>(args?: SelectSubset<T, verificationtokenFindFirstArgs<ExtArgs>>): Prisma__verificationtokenClient<$Result.GetResult<Prisma.$verificationtokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verificationtoken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {verificationtokenFindFirstOrThrowArgs} args - Arguments to find a Verificationtoken
     * @example
     * // Get one Verificationtoken
     * const verificationtoken = await prisma.verificationtoken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends verificationtokenFindFirstOrThrowArgs>(args?: SelectSubset<T, verificationtokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__verificationtokenClient<$Result.GetResult<Prisma.$verificationtokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Verificationtokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {verificationtokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Verificationtokens
     * const verificationtokens = await prisma.verificationtoken.findMany()
     * 
     * // Get first 10 Verificationtokens
     * const verificationtokens = await prisma.verificationtoken.findMany({ take: 10 })
     * 
     * // Only select the `identifier`
     * const verificationtokenWithIdentifierOnly = await prisma.verificationtoken.findMany({ select: { identifier: true } })
     * 
     */
    findMany<T extends verificationtokenFindManyArgs>(args?: SelectSubset<T, verificationtokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$verificationtokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Verificationtoken.
     * @param {verificationtokenCreateArgs} args - Arguments to create a Verificationtoken.
     * @example
     * // Create one Verificationtoken
     * const Verificationtoken = await prisma.verificationtoken.create({
     *   data: {
     *     // ... data to create a Verificationtoken
     *   }
     * })
     * 
     */
    create<T extends verificationtokenCreateArgs>(args: SelectSubset<T, verificationtokenCreateArgs<ExtArgs>>): Prisma__verificationtokenClient<$Result.GetResult<Prisma.$verificationtokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Verificationtokens.
     * @param {verificationtokenCreateManyArgs} args - Arguments to create many Verificationtokens.
     * @example
     * // Create many Verificationtokens
     * const verificationtoken = await prisma.verificationtoken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends verificationtokenCreateManyArgs>(args?: SelectSubset<T, verificationtokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Verificationtoken.
     * @param {verificationtokenDeleteArgs} args - Arguments to delete one Verificationtoken.
     * @example
     * // Delete one Verificationtoken
     * const Verificationtoken = await prisma.verificationtoken.delete({
     *   where: {
     *     // ... filter to delete one Verificationtoken
     *   }
     * })
     * 
     */
    delete<T extends verificationtokenDeleteArgs>(args: SelectSubset<T, verificationtokenDeleteArgs<ExtArgs>>): Prisma__verificationtokenClient<$Result.GetResult<Prisma.$verificationtokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Verificationtoken.
     * @param {verificationtokenUpdateArgs} args - Arguments to update one Verificationtoken.
     * @example
     * // Update one Verificationtoken
     * const verificationtoken = await prisma.verificationtoken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends verificationtokenUpdateArgs>(args: SelectSubset<T, verificationtokenUpdateArgs<ExtArgs>>): Prisma__verificationtokenClient<$Result.GetResult<Prisma.$verificationtokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Verificationtokens.
     * @param {verificationtokenDeleteManyArgs} args - Arguments to filter Verificationtokens to delete.
     * @example
     * // Delete a few Verificationtokens
     * const { count } = await prisma.verificationtoken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends verificationtokenDeleteManyArgs>(args?: SelectSubset<T, verificationtokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verificationtokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {verificationtokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Verificationtokens
     * const verificationtoken = await prisma.verificationtoken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends verificationtokenUpdateManyArgs>(args: SelectSubset<T, verificationtokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Verificationtoken.
     * @param {verificationtokenUpsertArgs} args - Arguments to update or create a Verificationtoken.
     * @example
     * // Update or create a Verificationtoken
     * const verificationtoken = await prisma.verificationtoken.upsert({
     *   create: {
     *     // ... data to create a Verificationtoken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Verificationtoken we want to update
     *   }
     * })
     */
    upsert<T extends verificationtokenUpsertArgs>(args: SelectSubset<T, verificationtokenUpsertArgs<ExtArgs>>): Prisma__verificationtokenClient<$Result.GetResult<Prisma.$verificationtokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Verificationtokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {verificationtokenCountArgs} args - Arguments to filter Verificationtokens to count.
     * @example
     * // Count the number of Verificationtokens
     * const count = await prisma.verificationtoken.count({
     *   where: {
     *     // ... the filter for the Verificationtokens we want to count
     *   }
     * })
    **/
    count<T extends verificationtokenCountArgs>(
      args?: Subset<T, verificationtokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationtokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Verificationtoken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationtokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationtokenAggregateArgs>(args: Subset<T, VerificationtokenAggregateArgs>): Prisma.PrismaPromise<GetVerificationtokenAggregateType<T>>

    /**
     * Group by Verificationtoken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {verificationtokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends verificationtokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: verificationtokenGroupByArgs['orderBy'] }
        : { orderBy?: verificationtokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, verificationtokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationtokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the verificationtoken model
   */
  readonly fields: verificationtokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for verificationtoken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__verificationtokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the verificationtoken model
   */
  interface verificationtokenFieldRefs {
    readonly identifier: FieldRef<"verificationtoken", 'String'>
    readonly token: FieldRef<"verificationtoken", 'String'>
    readonly expires: FieldRef<"verificationtoken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * verificationtoken findUnique
   */
  export type verificationtokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verificationtoken
     */
    select?: verificationtokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verificationtoken
     */
    omit?: verificationtokenOmit<ExtArgs> | null
    /**
     * Filter, which verificationtoken to fetch.
     */
    where: verificationtokenWhereUniqueInput
  }

  /**
   * verificationtoken findUniqueOrThrow
   */
  export type verificationtokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verificationtoken
     */
    select?: verificationtokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verificationtoken
     */
    omit?: verificationtokenOmit<ExtArgs> | null
    /**
     * Filter, which verificationtoken to fetch.
     */
    where: verificationtokenWhereUniqueInput
  }

  /**
   * verificationtoken findFirst
   */
  export type verificationtokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verificationtoken
     */
    select?: verificationtokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verificationtoken
     */
    omit?: verificationtokenOmit<ExtArgs> | null
    /**
     * Filter, which verificationtoken to fetch.
     */
    where?: verificationtokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of verificationtokens to fetch.
     */
    orderBy?: verificationtokenOrderByWithRelationInput | verificationtokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for verificationtokens.
     */
    cursor?: verificationtokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` verificationtokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` verificationtokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of verificationtokens.
     */
    distinct?: VerificationtokenScalarFieldEnum | VerificationtokenScalarFieldEnum[]
  }

  /**
   * verificationtoken findFirstOrThrow
   */
  export type verificationtokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verificationtoken
     */
    select?: verificationtokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verificationtoken
     */
    omit?: verificationtokenOmit<ExtArgs> | null
    /**
     * Filter, which verificationtoken to fetch.
     */
    where?: verificationtokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of verificationtokens to fetch.
     */
    orderBy?: verificationtokenOrderByWithRelationInput | verificationtokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for verificationtokens.
     */
    cursor?: verificationtokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` verificationtokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` verificationtokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of verificationtokens.
     */
    distinct?: VerificationtokenScalarFieldEnum | VerificationtokenScalarFieldEnum[]
  }

  /**
   * verificationtoken findMany
   */
  export type verificationtokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verificationtoken
     */
    select?: verificationtokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verificationtoken
     */
    omit?: verificationtokenOmit<ExtArgs> | null
    /**
     * Filter, which verificationtokens to fetch.
     */
    where?: verificationtokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of verificationtokens to fetch.
     */
    orderBy?: verificationtokenOrderByWithRelationInput | verificationtokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing verificationtokens.
     */
    cursor?: verificationtokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` verificationtokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` verificationtokens.
     */
    skip?: number
    distinct?: VerificationtokenScalarFieldEnum | VerificationtokenScalarFieldEnum[]
  }

  /**
   * verificationtoken create
   */
  export type verificationtokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verificationtoken
     */
    select?: verificationtokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verificationtoken
     */
    omit?: verificationtokenOmit<ExtArgs> | null
    /**
     * The data needed to create a verificationtoken.
     */
    data: XOR<verificationtokenCreateInput, verificationtokenUncheckedCreateInput>
  }

  /**
   * verificationtoken createMany
   */
  export type verificationtokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many verificationtokens.
     */
    data: verificationtokenCreateManyInput | verificationtokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * verificationtoken update
   */
  export type verificationtokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verificationtoken
     */
    select?: verificationtokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verificationtoken
     */
    omit?: verificationtokenOmit<ExtArgs> | null
    /**
     * The data needed to update a verificationtoken.
     */
    data: XOR<verificationtokenUpdateInput, verificationtokenUncheckedUpdateInput>
    /**
     * Choose, which verificationtoken to update.
     */
    where: verificationtokenWhereUniqueInput
  }

  /**
   * verificationtoken updateMany
   */
  export type verificationtokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update verificationtokens.
     */
    data: XOR<verificationtokenUpdateManyMutationInput, verificationtokenUncheckedUpdateManyInput>
    /**
     * Filter which verificationtokens to update
     */
    where?: verificationtokenWhereInput
    /**
     * Limit how many verificationtokens to update.
     */
    limit?: number
  }

  /**
   * verificationtoken upsert
   */
  export type verificationtokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verificationtoken
     */
    select?: verificationtokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verificationtoken
     */
    omit?: verificationtokenOmit<ExtArgs> | null
    /**
     * The filter to search for the verificationtoken to update in case it exists.
     */
    where: verificationtokenWhereUniqueInput
    /**
     * In case the verificationtoken found by the `where` argument doesn't exist, create a new verificationtoken with this data.
     */
    create: XOR<verificationtokenCreateInput, verificationtokenUncheckedCreateInput>
    /**
     * In case the verificationtoken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<verificationtokenUpdateInput, verificationtokenUncheckedUpdateInput>
  }

  /**
   * verificationtoken delete
   */
  export type verificationtokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verificationtoken
     */
    select?: verificationtokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verificationtoken
     */
    omit?: verificationtokenOmit<ExtArgs> | null
    /**
     * Filter which verificationtoken to delete.
     */
    where: verificationtokenWhereUniqueInput
  }

  /**
   * verificationtoken deleteMany
   */
  export type verificationtokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which verificationtokens to delete
     */
    where?: verificationtokenWhereInput
    /**
     * Limit how many verificationtokens to delete.
     */
    limit?: number
  }

  /**
   * verificationtoken without action
   */
  export type verificationtokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verificationtoken
     */
    select?: verificationtokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verificationtoken
     */
    omit?: verificationtokenOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const AgreementScalarFieldEnum: {
    id: 'id',
    initiatorId: 'initiatorId',
    receiverId: 'receiverId',
    status: 'status',
    terms: 'terms',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AgreementScalarFieldEnum = (typeof AgreementScalarFieldEnum)[keyof typeof AgreementScalarFieldEnum]


  export const ComplaintScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    status: 'status',
    userId: 'userId',
    agreementId: 'agreementId',
    evidence: 'evidence',
    resolution: 'resolution',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ComplaintScalarFieldEnum = (typeof ComplaintScalarFieldEnum)[keyof typeof ComplaintScalarFieldEnum]


  export const DemoclassScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    videoUrl: 'videoUrl',
    schedule: 'schedule',
    price: 'price',
    isPaid: 'isPaid',
    status: 'status',
    manufacturerId: 'manufacturerId',
    category: 'category',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DemoclassScalarFieldEnum = (typeof DemoclassScalarFieldEnum)[keyof typeof DemoclassScalarFieldEnum]


  export const ForumcategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ForumcategoryScalarFieldEnum = (typeof ForumcategoryScalarFieldEnum)[keyof typeof ForumcategoryScalarFieldEnum]


  export const ForumpostScalarFieldEnum: {
    id: 'id',
    content: 'content',
    authorId: 'authorId',
    threadId: 'threadId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    likes: 'likes'
  };

  export type ForumpostScalarFieldEnum = (typeof ForumpostScalarFieldEnum)[keyof typeof ForumpostScalarFieldEnum]


  export const ForumthreadScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    authorId: 'authorId',
    categoryId: 'categoryId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    likes: 'likes'
  };

  export type ForumthreadScalarFieldEnum = (typeof ForumthreadScalarFieldEnum)[keyof typeof ForumthreadScalarFieldEnum]


  export const ProductScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    category: 'category',
    images: 'images',
    contactInfo: 'contactInfo',
    ownerId: 'ownerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    password: 'password',
    image: 'image',
    role: 'role',
    isVerified: 'isVerified',
    hasCipponMembership: 'hasCipponMembership',
    cipponMembershipType: 'cipponMembershipType',
    cipponId: 'cipponId',
    companyName: 'companyName',
    phone: 'phone',
    location: 'location',
    bio: 'bio',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const VerificationtokenScalarFieldEnum: {
    identifier: 'identifier',
    token: 'token',
    expires: 'expires'
  };

  export type VerificationtokenScalarFieldEnum = (typeof VerificationtokenScalarFieldEnum)[keyof typeof VerificationtokenScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const accountOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state'
  };

  export type accountOrderByRelevanceFieldEnum = (typeof accountOrderByRelevanceFieldEnum)[keyof typeof accountOrderByRelevanceFieldEnum]


  export const agreementOrderByRelevanceFieldEnum: {
    id: 'id',
    initiatorId: 'initiatorId',
    receiverId: 'receiverId',
    terms: 'terms',
    notes: 'notes'
  };

  export type agreementOrderByRelevanceFieldEnum = (typeof agreementOrderByRelevanceFieldEnum)[keyof typeof agreementOrderByRelevanceFieldEnum]


  export const complaintOrderByRelevanceFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    status: 'status',
    userId: 'userId',
    agreementId: 'agreementId',
    evidence: 'evidence',
    resolution: 'resolution'
  };

  export type complaintOrderByRelevanceFieldEnum = (typeof complaintOrderByRelevanceFieldEnum)[keyof typeof complaintOrderByRelevanceFieldEnum]


  export const democlassOrderByRelevanceFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    videoUrl: 'videoUrl',
    manufacturerId: 'manufacturerId',
    category: 'category'
  };

  export type democlassOrderByRelevanceFieldEnum = (typeof democlassOrderByRelevanceFieldEnum)[keyof typeof democlassOrderByRelevanceFieldEnum]


  export const forumcategoryOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description'
  };

  export type forumcategoryOrderByRelevanceFieldEnum = (typeof forumcategoryOrderByRelevanceFieldEnum)[keyof typeof forumcategoryOrderByRelevanceFieldEnum]


  export const forumpostOrderByRelevanceFieldEnum: {
    id: 'id',
    content: 'content',
    authorId: 'authorId',
    threadId: 'threadId'
  };

  export type forumpostOrderByRelevanceFieldEnum = (typeof forumpostOrderByRelevanceFieldEnum)[keyof typeof forumpostOrderByRelevanceFieldEnum]


  export const forumthreadOrderByRelevanceFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    authorId: 'authorId',
    categoryId: 'categoryId'
  };

  export type forumthreadOrderByRelevanceFieldEnum = (typeof forumthreadOrderByRelevanceFieldEnum)[keyof typeof forumthreadOrderByRelevanceFieldEnum]


  export const productOrderByRelevanceFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    category: 'category',
    images: 'images',
    contactInfo: 'contactInfo',
    ownerId: 'ownerId'
  };

  export type productOrderByRelevanceFieldEnum = (typeof productOrderByRelevanceFieldEnum)[keyof typeof productOrderByRelevanceFieldEnum]


  export const sessionOrderByRelevanceFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId'
  };

  export type sessionOrderByRelevanceFieldEnum = (typeof sessionOrderByRelevanceFieldEnum)[keyof typeof sessionOrderByRelevanceFieldEnum]


  export const userOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    image: 'image',
    cipponId: 'cipponId',
    companyName: 'companyName',
    phone: 'phone',
    location: 'location',
    bio: 'bio'
  };

  export type userOrderByRelevanceFieldEnum = (typeof userOrderByRelevanceFieldEnum)[keyof typeof userOrderByRelevanceFieldEnum]


  export const verificationtokenOrderByRelevanceFieldEnum: {
    identifier: 'identifier',
    token: 'token'
  };

  export type verificationtokenOrderByRelevanceFieldEnum = (typeof verificationtokenOrderByRelevanceFieldEnum)[keyof typeof verificationtokenOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'agreement_status'
   */
  export type Enumagreement_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'agreement_status'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'democlass_status'
   */
  export type Enumdemoclass_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'democlass_status'>
    


  /**
   * Reference to a field of type 'user_role'
   */
  export type Enumuser_roleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'user_role'>
    


  /**
   * Reference to a field of type 'user_cipponMembershipType'
   */
  export type Enumuser_cipponMembershipTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'user_cipponMembershipType'>
    
  /**
   * Deep Input Types
   */


  export type accountWhereInput = {
    AND?: accountWhereInput | accountWhereInput[]
    OR?: accountWhereInput[]
    NOT?: accountWhereInput | accountWhereInput[]
    id?: StringFilter<"account"> | string
    userId?: StringFilter<"account"> | string
    type?: StringFilter<"account"> | string
    provider?: StringFilter<"account"> | string
    providerAccountId?: StringFilter<"account"> | string
    refresh_token?: StringNullableFilter<"account"> | string | null
    access_token?: StringNullableFilter<"account"> | string | null
    expires_at?: IntNullableFilter<"account"> | number | null
    token_type?: StringNullableFilter<"account"> | string | null
    scope?: StringNullableFilter<"account"> | string | null
    id_token?: StringNullableFilter<"account"> | string | null
    session_state?: StringNullableFilter<"account"> | string | null
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }

  export type accountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    user?: userOrderByWithRelationInput
    _relevance?: accountOrderByRelevanceInput
  }

  export type accountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerAccountId?: accountProviderProviderAccountIdCompoundUniqueInput
    AND?: accountWhereInput | accountWhereInput[]
    OR?: accountWhereInput[]
    NOT?: accountWhereInput | accountWhereInput[]
    userId?: StringFilter<"account"> | string
    type?: StringFilter<"account"> | string
    provider?: StringFilter<"account"> | string
    providerAccountId?: StringFilter<"account"> | string
    refresh_token?: StringNullableFilter<"account"> | string | null
    access_token?: StringNullableFilter<"account"> | string | null
    expires_at?: IntNullableFilter<"account"> | number | null
    token_type?: StringNullableFilter<"account"> | string | null
    scope?: StringNullableFilter<"account"> | string | null
    id_token?: StringNullableFilter<"account"> | string | null
    session_state?: StringNullableFilter<"account"> | string | null
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }, "id" | "provider_providerAccountId">

  export type accountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    _count?: accountCountOrderByAggregateInput
    _avg?: accountAvgOrderByAggregateInput
    _max?: accountMaxOrderByAggregateInput
    _min?: accountMinOrderByAggregateInput
    _sum?: accountSumOrderByAggregateInput
  }

  export type accountScalarWhereWithAggregatesInput = {
    AND?: accountScalarWhereWithAggregatesInput | accountScalarWhereWithAggregatesInput[]
    OR?: accountScalarWhereWithAggregatesInput[]
    NOT?: accountScalarWhereWithAggregatesInput | accountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"account"> | string
    userId?: StringWithAggregatesFilter<"account"> | string
    type?: StringWithAggregatesFilter<"account"> | string
    provider?: StringWithAggregatesFilter<"account"> | string
    providerAccountId?: StringWithAggregatesFilter<"account"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"account"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"account"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"account"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"account"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"account"> | string | null
    session_state?: StringNullableWithAggregatesFilter<"account"> | string | null
  }

  export type agreementWhereInput = {
    AND?: agreementWhereInput | agreementWhereInput[]
    OR?: agreementWhereInput[]
    NOT?: agreementWhereInput | agreementWhereInput[]
    id?: StringFilter<"agreement"> | string
    initiatorId?: StringFilter<"agreement"> | string
    receiverId?: StringFilter<"agreement"> | string
    status?: Enumagreement_statusFilter<"agreement"> | $Enums.agreement_status
    terms?: StringFilter<"agreement"> | string
    notes?: StringNullableFilter<"agreement"> | string | null
    createdAt?: DateTimeFilter<"agreement"> | Date | string
    updatedAt?: DateTimeFilter<"agreement"> | Date | string
    user_agreement_initiatorIdTouser?: XOR<UserScalarRelationFilter, userWhereInput>
    user_agreement_receiverIdTouser?: XOR<UserScalarRelationFilter, userWhereInput>
    complaint?: ComplaintListRelationFilter
  }

  export type agreementOrderByWithRelationInput = {
    id?: SortOrder
    initiatorId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    terms?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user_agreement_initiatorIdTouser?: userOrderByWithRelationInput
    user_agreement_receiverIdTouser?: userOrderByWithRelationInput
    complaint?: complaintOrderByRelationAggregateInput
    _relevance?: agreementOrderByRelevanceInput
  }

  export type agreementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: agreementWhereInput | agreementWhereInput[]
    OR?: agreementWhereInput[]
    NOT?: agreementWhereInput | agreementWhereInput[]
    initiatorId?: StringFilter<"agreement"> | string
    receiverId?: StringFilter<"agreement"> | string
    status?: Enumagreement_statusFilter<"agreement"> | $Enums.agreement_status
    terms?: StringFilter<"agreement"> | string
    notes?: StringNullableFilter<"agreement"> | string | null
    createdAt?: DateTimeFilter<"agreement"> | Date | string
    updatedAt?: DateTimeFilter<"agreement"> | Date | string
    user_agreement_initiatorIdTouser?: XOR<UserScalarRelationFilter, userWhereInput>
    user_agreement_receiverIdTouser?: XOR<UserScalarRelationFilter, userWhereInput>
    complaint?: ComplaintListRelationFilter
  }, "id">

  export type agreementOrderByWithAggregationInput = {
    id?: SortOrder
    initiatorId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    terms?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: agreementCountOrderByAggregateInput
    _max?: agreementMaxOrderByAggregateInput
    _min?: agreementMinOrderByAggregateInput
  }

  export type agreementScalarWhereWithAggregatesInput = {
    AND?: agreementScalarWhereWithAggregatesInput | agreementScalarWhereWithAggregatesInput[]
    OR?: agreementScalarWhereWithAggregatesInput[]
    NOT?: agreementScalarWhereWithAggregatesInput | agreementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"agreement"> | string
    initiatorId?: StringWithAggregatesFilter<"agreement"> | string
    receiverId?: StringWithAggregatesFilter<"agreement"> | string
    status?: Enumagreement_statusWithAggregatesFilter<"agreement"> | $Enums.agreement_status
    terms?: StringWithAggregatesFilter<"agreement"> | string
    notes?: StringNullableWithAggregatesFilter<"agreement"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"agreement"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"agreement"> | Date | string
  }

  export type complaintWhereInput = {
    AND?: complaintWhereInput | complaintWhereInput[]
    OR?: complaintWhereInput[]
    NOT?: complaintWhereInput | complaintWhereInput[]
    id?: StringFilter<"complaint"> | string
    title?: StringFilter<"complaint"> | string
    description?: StringFilter<"complaint"> | string
    status?: StringFilter<"complaint"> | string
    userId?: StringFilter<"complaint"> | string
    agreementId?: StringNullableFilter<"complaint"> | string | null
    evidence?: StringNullableFilter<"complaint"> | string | null
    resolution?: StringNullableFilter<"complaint"> | string | null
    createdAt?: DateTimeFilter<"complaint"> | Date | string
    updatedAt?: DateTimeFilter<"complaint"> | Date | string
    agreement?: XOR<AgreementNullableScalarRelationFilter, agreementWhereInput> | null
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }

  export type complaintOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    userId?: SortOrder
    agreementId?: SortOrderInput | SortOrder
    evidence?: SortOrderInput | SortOrder
    resolution?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    agreement?: agreementOrderByWithRelationInput
    user?: userOrderByWithRelationInput
    _relevance?: complaintOrderByRelevanceInput
  }

  export type complaintWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: complaintWhereInput | complaintWhereInput[]
    OR?: complaintWhereInput[]
    NOT?: complaintWhereInput | complaintWhereInput[]
    title?: StringFilter<"complaint"> | string
    description?: StringFilter<"complaint"> | string
    status?: StringFilter<"complaint"> | string
    userId?: StringFilter<"complaint"> | string
    agreementId?: StringNullableFilter<"complaint"> | string | null
    evidence?: StringNullableFilter<"complaint"> | string | null
    resolution?: StringNullableFilter<"complaint"> | string | null
    createdAt?: DateTimeFilter<"complaint"> | Date | string
    updatedAt?: DateTimeFilter<"complaint"> | Date | string
    agreement?: XOR<AgreementNullableScalarRelationFilter, agreementWhereInput> | null
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }, "id">

  export type complaintOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    userId?: SortOrder
    agreementId?: SortOrderInput | SortOrder
    evidence?: SortOrderInput | SortOrder
    resolution?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: complaintCountOrderByAggregateInput
    _max?: complaintMaxOrderByAggregateInput
    _min?: complaintMinOrderByAggregateInput
  }

  export type complaintScalarWhereWithAggregatesInput = {
    AND?: complaintScalarWhereWithAggregatesInput | complaintScalarWhereWithAggregatesInput[]
    OR?: complaintScalarWhereWithAggregatesInput[]
    NOT?: complaintScalarWhereWithAggregatesInput | complaintScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"complaint"> | string
    title?: StringWithAggregatesFilter<"complaint"> | string
    description?: StringWithAggregatesFilter<"complaint"> | string
    status?: StringWithAggregatesFilter<"complaint"> | string
    userId?: StringWithAggregatesFilter<"complaint"> | string
    agreementId?: StringNullableWithAggregatesFilter<"complaint"> | string | null
    evidence?: StringNullableWithAggregatesFilter<"complaint"> | string | null
    resolution?: StringNullableWithAggregatesFilter<"complaint"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"complaint"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"complaint"> | Date | string
  }

  export type democlassWhereInput = {
    AND?: democlassWhereInput | democlassWhereInput[]
    OR?: democlassWhereInput[]
    NOT?: democlassWhereInput | democlassWhereInput[]
    id?: StringFilter<"democlass"> | string
    title?: StringFilter<"democlass"> | string
    description?: StringFilter<"democlass"> | string
    videoUrl?: StringNullableFilter<"democlass"> | string | null
    schedule?: DateTimeFilter<"democlass"> | Date | string
    price?: FloatFilter<"democlass"> | number
    isPaid?: BoolFilter<"democlass"> | boolean
    status?: Enumdemoclass_statusFilter<"democlass"> | $Enums.democlass_status
    manufacturerId?: StringFilter<"democlass"> | string
    category?: StringFilter<"democlass"> | string
    createdAt?: DateTimeFilter<"democlass"> | Date | string
    updatedAt?: DateTimeFilter<"democlass"> | Date | string
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }

  export type democlassOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    videoUrl?: SortOrderInput | SortOrder
    schedule?: SortOrder
    price?: SortOrder
    isPaid?: SortOrder
    status?: SortOrder
    manufacturerId?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: userOrderByWithRelationInput
    _relevance?: democlassOrderByRelevanceInput
  }

  export type democlassWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: democlassWhereInput | democlassWhereInput[]
    OR?: democlassWhereInput[]
    NOT?: democlassWhereInput | democlassWhereInput[]
    title?: StringFilter<"democlass"> | string
    description?: StringFilter<"democlass"> | string
    videoUrl?: StringNullableFilter<"democlass"> | string | null
    schedule?: DateTimeFilter<"democlass"> | Date | string
    price?: FloatFilter<"democlass"> | number
    isPaid?: BoolFilter<"democlass"> | boolean
    status?: Enumdemoclass_statusFilter<"democlass"> | $Enums.democlass_status
    manufacturerId?: StringFilter<"democlass"> | string
    category?: StringFilter<"democlass"> | string
    createdAt?: DateTimeFilter<"democlass"> | Date | string
    updatedAt?: DateTimeFilter<"democlass"> | Date | string
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }, "id">

  export type democlassOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    videoUrl?: SortOrderInput | SortOrder
    schedule?: SortOrder
    price?: SortOrder
    isPaid?: SortOrder
    status?: SortOrder
    manufacturerId?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: democlassCountOrderByAggregateInput
    _avg?: democlassAvgOrderByAggregateInput
    _max?: democlassMaxOrderByAggregateInput
    _min?: democlassMinOrderByAggregateInput
    _sum?: democlassSumOrderByAggregateInput
  }

  export type democlassScalarWhereWithAggregatesInput = {
    AND?: democlassScalarWhereWithAggregatesInput | democlassScalarWhereWithAggregatesInput[]
    OR?: democlassScalarWhereWithAggregatesInput[]
    NOT?: democlassScalarWhereWithAggregatesInput | democlassScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"democlass"> | string
    title?: StringWithAggregatesFilter<"democlass"> | string
    description?: StringWithAggregatesFilter<"democlass"> | string
    videoUrl?: StringNullableWithAggregatesFilter<"democlass"> | string | null
    schedule?: DateTimeWithAggregatesFilter<"democlass"> | Date | string
    price?: FloatWithAggregatesFilter<"democlass"> | number
    isPaid?: BoolWithAggregatesFilter<"democlass"> | boolean
    status?: Enumdemoclass_statusWithAggregatesFilter<"democlass"> | $Enums.democlass_status
    manufacturerId?: StringWithAggregatesFilter<"democlass"> | string
    category?: StringWithAggregatesFilter<"democlass"> | string
    createdAt?: DateTimeWithAggregatesFilter<"democlass"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"democlass"> | Date | string
  }

  export type forumcategoryWhereInput = {
    AND?: forumcategoryWhereInput | forumcategoryWhereInput[]
    OR?: forumcategoryWhereInput[]
    NOT?: forumcategoryWhereInput | forumcategoryWhereInput[]
    id?: StringFilter<"forumcategory"> | string
    name?: StringFilter<"forumcategory"> | string
    description?: StringNullableFilter<"forumcategory"> | string | null
    createdAt?: DateTimeFilter<"forumcategory"> | Date | string
    updatedAt?: DateTimeFilter<"forumcategory"> | Date | string
    forumthread?: ForumthreadListRelationFilter
  }

  export type forumcategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    forumthread?: forumthreadOrderByRelationAggregateInput
    _relevance?: forumcategoryOrderByRelevanceInput
  }

  export type forumcategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: forumcategoryWhereInput | forumcategoryWhereInput[]
    OR?: forumcategoryWhereInput[]
    NOT?: forumcategoryWhereInput | forumcategoryWhereInput[]
    name?: StringFilter<"forumcategory"> | string
    description?: StringNullableFilter<"forumcategory"> | string | null
    createdAt?: DateTimeFilter<"forumcategory"> | Date | string
    updatedAt?: DateTimeFilter<"forumcategory"> | Date | string
    forumthread?: ForumthreadListRelationFilter
  }, "id">

  export type forumcategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: forumcategoryCountOrderByAggregateInput
    _max?: forumcategoryMaxOrderByAggregateInput
    _min?: forumcategoryMinOrderByAggregateInput
  }

  export type forumcategoryScalarWhereWithAggregatesInput = {
    AND?: forumcategoryScalarWhereWithAggregatesInput | forumcategoryScalarWhereWithAggregatesInput[]
    OR?: forumcategoryScalarWhereWithAggregatesInput[]
    NOT?: forumcategoryScalarWhereWithAggregatesInput | forumcategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"forumcategory"> | string
    name?: StringWithAggregatesFilter<"forumcategory"> | string
    description?: StringNullableWithAggregatesFilter<"forumcategory"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"forumcategory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"forumcategory"> | Date | string
  }

  export type forumpostWhereInput = {
    AND?: forumpostWhereInput | forumpostWhereInput[]
    OR?: forumpostWhereInput[]
    NOT?: forumpostWhereInput | forumpostWhereInput[]
    id?: StringFilter<"forumpost"> | string
    content?: StringFilter<"forumpost"> | string
    authorId?: StringFilter<"forumpost"> | string
    threadId?: StringFilter<"forumpost"> | string
    createdAt?: DateTimeFilter<"forumpost"> | Date | string
    updatedAt?: DateTimeFilter<"forumpost"> | Date | string
    likes?: IntFilter<"forumpost"> | number
    user?: XOR<UserScalarRelationFilter, userWhereInput>
    forumthread?: XOR<ForumthreadScalarRelationFilter, forumthreadWhereInput>
  }

  export type forumpostOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    authorId?: SortOrder
    threadId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    likes?: SortOrder
    user?: userOrderByWithRelationInput
    forumthread?: forumthreadOrderByWithRelationInput
    _relevance?: forumpostOrderByRelevanceInput
  }

  export type forumpostWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: forumpostWhereInput | forumpostWhereInput[]
    OR?: forumpostWhereInput[]
    NOT?: forumpostWhereInput | forumpostWhereInput[]
    content?: StringFilter<"forumpost"> | string
    authorId?: StringFilter<"forumpost"> | string
    threadId?: StringFilter<"forumpost"> | string
    createdAt?: DateTimeFilter<"forumpost"> | Date | string
    updatedAt?: DateTimeFilter<"forumpost"> | Date | string
    likes?: IntFilter<"forumpost"> | number
    user?: XOR<UserScalarRelationFilter, userWhereInput>
    forumthread?: XOR<ForumthreadScalarRelationFilter, forumthreadWhereInput>
  }, "id">

  export type forumpostOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    authorId?: SortOrder
    threadId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    likes?: SortOrder
    _count?: forumpostCountOrderByAggregateInput
    _avg?: forumpostAvgOrderByAggregateInput
    _max?: forumpostMaxOrderByAggregateInput
    _min?: forumpostMinOrderByAggregateInput
    _sum?: forumpostSumOrderByAggregateInput
  }

  export type forumpostScalarWhereWithAggregatesInput = {
    AND?: forumpostScalarWhereWithAggregatesInput | forumpostScalarWhereWithAggregatesInput[]
    OR?: forumpostScalarWhereWithAggregatesInput[]
    NOT?: forumpostScalarWhereWithAggregatesInput | forumpostScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"forumpost"> | string
    content?: StringWithAggregatesFilter<"forumpost"> | string
    authorId?: StringWithAggregatesFilter<"forumpost"> | string
    threadId?: StringWithAggregatesFilter<"forumpost"> | string
    createdAt?: DateTimeWithAggregatesFilter<"forumpost"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"forumpost"> | Date | string
    likes?: IntWithAggregatesFilter<"forumpost"> | number
  }

  export type forumthreadWhereInput = {
    AND?: forumthreadWhereInput | forumthreadWhereInput[]
    OR?: forumthreadWhereInput[]
    NOT?: forumthreadWhereInput | forumthreadWhereInput[]
    id?: StringFilter<"forumthread"> | string
    title?: StringFilter<"forumthread"> | string
    content?: StringFilter<"forumthread"> | string
    authorId?: StringFilter<"forumthread"> | string
    categoryId?: StringFilter<"forumthread"> | string
    createdAt?: DateTimeFilter<"forumthread"> | Date | string
    updatedAt?: DateTimeFilter<"forumthread"> | Date | string
    likes?: IntFilter<"forumthread"> | number
    forumpost?: ForumpostListRelationFilter
    user?: XOR<UserScalarRelationFilter, userWhereInput>
    forumcategory?: XOR<ForumcategoryScalarRelationFilter, forumcategoryWhereInput>
  }

  export type forumthreadOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    authorId?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    likes?: SortOrder
    forumpost?: forumpostOrderByRelationAggregateInput
    user?: userOrderByWithRelationInput
    forumcategory?: forumcategoryOrderByWithRelationInput
    _relevance?: forumthreadOrderByRelevanceInput
  }

  export type forumthreadWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: forumthreadWhereInput | forumthreadWhereInput[]
    OR?: forumthreadWhereInput[]
    NOT?: forumthreadWhereInput | forumthreadWhereInput[]
    title?: StringFilter<"forumthread"> | string
    content?: StringFilter<"forumthread"> | string
    authorId?: StringFilter<"forumthread"> | string
    categoryId?: StringFilter<"forumthread"> | string
    createdAt?: DateTimeFilter<"forumthread"> | Date | string
    updatedAt?: DateTimeFilter<"forumthread"> | Date | string
    likes?: IntFilter<"forumthread"> | number
    forumpost?: ForumpostListRelationFilter
    user?: XOR<UserScalarRelationFilter, userWhereInput>
    forumcategory?: XOR<ForumcategoryScalarRelationFilter, forumcategoryWhereInput>
  }, "id">

  export type forumthreadOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    authorId?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    likes?: SortOrder
    _count?: forumthreadCountOrderByAggregateInput
    _avg?: forumthreadAvgOrderByAggregateInput
    _max?: forumthreadMaxOrderByAggregateInput
    _min?: forumthreadMinOrderByAggregateInput
    _sum?: forumthreadSumOrderByAggregateInput
  }

  export type forumthreadScalarWhereWithAggregatesInput = {
    AND?: forumthreadScalarWhereWithAggregatesInput | forumthreadScalarWhereWithAggregatesInput[]
    OR?: forumthreadScalarWhereWithAggregatesInput[]
    NOT?: forumthreadScalarWhereWithAggregatesInput | forumthreadScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"forumthread"> | string
    title?: StringWithAggregatesFilter<"forumthread"> | string
    content?: StringWithAggregatesFilter<"forumthread"> | string
    authorId?: StringWithAggregatesFilter<"forumthread"> | string
    categoryId?: StringWithAggregatesFilter<"forumthread"> | string
    createdAt?: DateTimeWithAggregatesFilter<"forumthread"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"forumthread"> | Date | string
    likes?: IntWithAggregatesFilter<"forumthread"> | number
  }

  export type productWhereInput = {
    AND?: productWhereInput | productWhereInput[]
    OR?: productWhereInput[]
    NOT?: productWhereInput | productWhereInput[]
    id?: StringFilter<"product"> | string
    title?: StringFilter<"product"> | string
    description?: StringFilter<"product"> | string
    category?: StringFilter<"product"> | string
    images?: StringFilter<"product"> | string
    contactInfo?: StringNullableFilter<"product"> | string | null
    ownerId?: StringFilter<"product"> | string
    createdAt?: DateTimeFilter<"product"> | Date | string
    updatedAt?: DateTimeFilter<"product"> | Date | string
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }

  export type productOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    images?: SortOrder
    contactInfo?: SortOrderInput | SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: userOrderByWithRelationInput
    _relevance?: productOrderByRelevanceInput
  }

  export type productWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: productWhereInput | productWhereInput[]
    OR?: productWhereInput[]
    NOT?: productWhereInput | productWhereInput[]
    title?: StringFilter<"product"> | string
    description?: StringFilter<"product"> | string
    category?: StringFilter<"product"> | string
    images?: StringFilter<"product"> | string
    contactInfo?: StringNullableFilter<"product"> | string | null
    ownerId?: StringFilter<"product"> | string
    createdAt?: DateTimeFilter<"product"> | Date | string
    updatedAt?: DateTimeFilter<"product"> | Date | string
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }, "id">

  export type productOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    images?: SortOrder
    contactInfo?: SortOrderInput | SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: productCountOrderByAggregateInput
    _max?: productMaxOrderByAggregateInput
    _min?: productMinOrderByAggregateInput
  }

  export type productScalarWhereWithAggregatesInput = {
    AND?: productScalarWhereWithAggregatesInput | productScalarWhereWithAggregatesInput[]
    OR?: productScalarWhereWithAggregatesInput[]
    NOT?: productScalarWhereWithAggregatesInput | productScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"product"> | string
    title?: StringWithAggregatesFilter<"product"> | string
    description?: StringWithAggregatesFilter<"product"> | string
    category?: StringWithAggregatesFilter<"product"> | string
    images?: StringWithAggregatesFilter<"product"> | string
    contactInfo?: StringNullableWithAggregatesFilter<"product"> | string | null
    ownerId?: StringWithAggregatesFilter<"product"> | string
    createdAt?: DateTimeWithAggregatesFilter<"product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"product"> | Date | string
  }

  export type sessionWhereInput = {
    AND?: sessionWhereInput | sessionWhereInput[]
    OR?: sessionWhereInput[]
    NOT?: sessionWhereInput | sessionWhereInput[]
    id?: StringFilter<"session"> | string
    sessionToken?: StringFilter<"session"> | string
    userId?: StringFilter<"session"> | string
    expires?: DateTimeFilter<"session"> | Date | string
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }

  export type sessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    user?: userOrderByWithRelationInput
    _relevance?: sessionOrderByRelevanceInput
  }

  export type sessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: sessionWhereInput | sessionWhereInput[]
    OR?: sessionWhereInput[]
    NOT?: sessionWhereInput | sessionWhereInput[]
    userId?: StringFilter<"session"> | string
    expires?: DateTimeFilter<"session"> | Date | string
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }, "id" | "sessionToken">

  export type sessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    _count?: sessionCountOrderByAggregateInput
    _max?: sessionMaxOrderByAggregateInput
    _min?: sessionMinOrderByAggregateInput
  }

  export type sessionScalarWhereWithAggregatesInput = {
    AND?: sessionScalarWhereWithAggregatesInput | sessionScalarWhereWithAggregatesInput[]
    OR?: sessionScalarWhereWithAggregatesInput[]
    NOT?: sessionScalarWhereWithAggregatesInput | sessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"session"> | string
    sessionToken?: StringWithAggregatesFilter<"session"> | string
    userId?: StringWithAggregatesFilter<"session"> | string
    expires?: DateTimeWithAggregatesFilter<"session"> | Date | string
  }

  export type userWhereInput = {
    AND?: userWhereInput | userWhereInput[]
    OR?: userWhereInput[]
    NOT?: userWhereInput | userWhereInput[]
    id?: StringFilter<"user"> | string
    name?: StringNullableFilter<"user"> | string | null
    email?: StringNullableFilter<"user"> | string | null
    emailVerified?: DateTimeNullableFilter<"user"> | Date | string | null
    password?: StringNullableFilter<"user"> | string | null
    image?: StringNullableFilter<"user"> | string | null
    role?: Enumuser_roleFilter<"user"> | $Enums.user_role
    isVerified?: BoolFilter<"user"> | boolean
    hasCipponMembership?: BoolFilter<"user"> | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFilter<"user"> | $Enums.user_cipponMembershipType
    cipponId?: StringNullableFilter<"user"> | string | null
    companyName?: StringNullableFilter<"user"> | string | null
    phone?: StringNullableFilter<"user"> | string | null
    location?: StringNullableFilter<"user"> | string | null
    bio?: StringNullableFilter<"user"> | string | null
    createdAt?: DateTimeFilter<"user"> | Date | string
    updatedAt?: DateTimeFilter<"user"> | Date | string
    account?: AccountListRelationFilter
    agreement_agreement_initiatorIdTouser?: AgreementListRelationFilter
    agreement_agreement_receiverIdTouser?: AgreementListRelationFilter
    complaint?: ComplaintListRelationFilter
    democlass?: DemoclassListRelationFilter
    forumpost?: ForumpostListRelationFilter
    forumthread?: ForumthreadListRelationFilter
    product?: ProductListRelationFilter
    session?: SessionListRelationFilter
  }

  export type userOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrder
    isVerified?: SortOrder
    hasCipponMembership?: SortOrder
    cipponMembershipType?: SortOrder
    cipponId?: SortOrderInput | SortOrder
    companyName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    account?: accountOrderByRelationAggregateInput
    agreement_agreement_initiatorIdTouser?: agreementOrderByRelationAggregateInput
    agreement_agreement_receiverIdTouser?: agreementOrderByRelationAggregateInput
    complaint?: complaintOrderByRelationAggregateInput
    democlass?: democlassOrderByRelationAggregateInput
    forumpost?: forumpostOrderByRelationAggregateInput
    forumthread?: forumthreadOrderByRelationAggregateInput
    product?: productOrderByRelationAggregateInput
    session?: sessionOrderByRelationAggregateInput
    _relevance?: userOrderByRelevanceInput
  }

  export type userWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: userWhereInput | userWhereInput[]
    OR?: userWhereInput[]
    NOT?: userWhereInput | userWhereInput[]
    name?: StringNullableFilter<"user"> | string | null
    emailVerified?: DateTimeNullableFilter<"user"> | Date | string | null
    password?: StringNullableFilter<"user"> | string | null
    image?: StringNullableFilter<"user"> | string | null
    role?: Enumuser_roleFilter<"user"> | $Enums.user_role
    isVerified?: BoolFilter<"user"> | boolean
    hasCipponMembership?: BoolFilter<"user"> | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFilter<"user"> | $Enums.user_cipponMembershipType
    cipponId?: StringNullableFilter<"user"> | string | null
    companyName?: StringNullableFilter<"user"> | string | null
    phone?: StringNullableFilter<"user"> | string | null
    location?: StringNullableFilter<"user"> | string | null
    bio?: StringNullableFilter<"user"> | string | null
    createdAt?: DateTimeFilter<"user"> | Date | string
    updatedAt?: DateTimeFilter<"user"> | Date | string
    account?: AccountListRelationFilter
    agreement_agreement_initiatorIdTouser?: AgreementListRelationFilter
    agreement_agreement_receiverIdTouser?: AgreementListRelationFilter
    complaint?: ComplaintListRelationFilter
    democlass?: DemoclassListRelationFilter
    forumpost?: ForumpostListRelationFilter
    forumthread?: ForumthreadListRelationFilter
    product?: ProductListRelationFilter
    session?: SessionListRelationFilter
  }, "id" | "email">

  export type userOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrder
    isVerified?: SortOrder
    hasCipponMembership?: SortOrder
    cipponMembershipType?: SortOrder
    cipponId?: SortOrderInput | SortOrder
    companyName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: userCountOrderByAggregateInput
    _max?: userMaxOrderByAggregateInput
    _min?: userMinOrderByAggregateInput
  }

  export type userScalarWhereWithAggregatesInput = {
    AND?: userScalarWhereWithAggregatesInput | userScalarWhereWithAggregatesInput[]
    OR?: userScalarWhereWithAggregatesInput[]
    NOT?: userScalarWhereWithAggregatesInput | userScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"user"> | string
    name?: StringNullableWithAggregatesFilter<"user"> | string | null
    email?: StringNullableWithAggregatesFilter<"user"> | string | null
    emailVerified?: DateTimeNullableWithAggregatesFilter<"user"> | Date | string | null
    password?: StringNullableWithAggregatesFilter<"user"> | string | null
    image?: StringNullableWithAggregatesFilter<"user"> | string | null
    role?: Enumuser_roleWithAggregatesFilter<"user"> | $Enums.user_role
    isVerified?: BoolWithAggregatesFilter<"user"> | boolean
    hasCipponMembership?: BoolWithAggregatesFilter<"user"> | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeWithAggregatesFilter<"user"> | $Enums.user_cipponMembershipType
    cipponId?: StringNullableWithAggregatesFilter<"user"> | string | null
    companyName?: StringNullableWithAggregatesFilter<"user"> | string | null
    phone?: StringNullableWithAggregatesFilter<"user"> | string | null
    location?: StringNullableWithAggregatesFilter<"user"> | string | null
    bio?: StringNullableWithAggregatesFilter<"user"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"user"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"user"> | Date | string
  }

  export type verificationtokenWhereInput = {
    AND?: verificationtokenWhereInput | verificationtokenWhereInput[]
    OR?: verificationtokenWhereInput[]
    NOT?: verificationtokenWhereInput | verificationtokenWhereInput[]
    identifier?: StringFilter<"verificationtoken"> | string
    token?: StringFilter<"verificationtoken"> | string
    expires?: DateTimeFilter<"verificationtoken"> | Date | string
  }

  export type verificationtokenOrderByWithRelationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
    _relevance?: verificationtokenOrderByRelevanceInput
  }

  export type verificationtokenWhereUniqueInput = Prisma.AtLeast<{
    token?: string
    identifier_token?: verificationtokenIdentifierTokenCompoundUniqueInput
    AND?: verificationtokenWhereInput | verificationtokenWhereInput[]
    OR?: verificationtokenWhereInput[]
    NOT?: verificationtokenWhereInput | verificationtokenWhereInput[]
    identifier?: StringFilter<"verificationtoken"> | string
    expires?: DateTimeFilter<"verificationtoken"> | Date | string
  }, "token" | "identifier_token">

  export type verificationtokenOrderByWithAggregationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
    _count?: verificationtokenCountOrderByAggregateInput
    _max?: verificationtokenMaxOrderByAggregateInput
    _min?: verificationtokenMinOrderByAggregateInput
  }

  export type verificationtokenScalarWhereWithAggregatesInput = {
    AND?: verificationtokenScalarWhereWithAggregatesInput | verificationtokenScalarWhereWithAggregatesInput[]
    OR?: verificationtokenScalarWhereWithAggregatesInput[]
    NOT?: verificationtokenScalarWhereWithAggregatesInput | verificationtokenScalarWhereWithAggregatesInput[]
    identifier?: StringWithAggregatesFilter<"verificationtoken"> | string
    token?: StringWithAggregatesFilter<"verificationtoken"> | string
    expires?: DateTimeWithAggregatesFilter<"verificationtoken"> | Date | string
  }

  export type accountCreateInput = {
    id: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    user: userCreateNestedOneWithoutAccountInput
  }

  export type accountUncheckedCreateInput = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type accountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    user?: userUpdateOneRequiredWithoutAccountNestedInput
  }

  export type accountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type accountCreateManyInput = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type accountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type accountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type agreementCreateInput = {
    id: string
    status?: $Enums.agreement_status
    terms: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    user_agreement_initiatorIdTouser: userCreateNestedOneWithoutAgreement_agreement_initiatorIdTouserInput
    user_agreement_receiverIdTouser: userCreateNestedOneWithoutAgreement_agreement_receiverIdTouserInput
    complaint?: complaintCreateNestedManyWithoutAgreementInput
  }

  export type agreementUncheckedCreateInput = {
    id: string
    initiatorId: string
    receiverId: string
    status?: $Enums.agreement_status
    terms: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    complaint?: complaintUncheckedCreateNestedManyWithoutAgreementInput
  }

  export type agreementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: Enumagreement_statusFieldUpdateOperationsInput | $Enums.agreement_status
    terms?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user_agreement_initiatorIdTouser?: userUpdateOneRequiredWithoutAgreement_agreement_initiatorIdTouserNestedInput
    user_agreement_receiverIdTouser?: userUpdateOneRequiredWithoutAgreement_agreement_receiverIdTouserNestedInput
    complaint?: complaintUpdateManyWithoutAgreementNestedInput
  }

  export type agreementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    initiatorId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: Enumagreement_statusFieldUpdateOperationsInput | $Enums.agreement_status
    terms?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    complaint?: complaintUncheckedUpdateManyWithoutAgreementNestedInput
  }

  export type agreementCreateManyInput = {
    id: string
    initiatorId: string
    receiverId: string
    status?: $Enums.agreement_status
    terms: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type agreementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: Enumagreement_statusFieldUpdateOperationsInput | $Enums.agreement_status
    terms?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type agreementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    initiatorId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: Enumagreement_statusFieldUpdateOperationsInput | $Enums.agreement_status
    terms?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type complaintCreateInput = {
    id: string
    title: string
    description: string
    status?: string
    evidence?: string | null
    resolution?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    agreement?: agreementCreateNestedOneWithoutComplaintInput
    user: userCreateNestedOneWithoutComplaintInput
  }

  export type complaintUncheckedCreateInput = {
    id: string
    title: string
    description: string
    status?: string
    userId: string
    agreementId?: string | null
    evidence?: string | null
    resolution?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type complaintUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    evidence?: NullableStringFieldUpdateOperationsInput | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agreement?: agreementUpdateOneWithoutComplaintNestedInput
    user?: userUpdateOneRequiredWithoutComplaintNestedInput
  }

  export type complaintUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    agreementId?: NullableStringFieldUpdateOperationsInput | string | null
    evidence?: NullableStringFieldUpdateOperationsInput | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type complaintCreateManyInput = {
    id: string
    title: string
    description: string
    status?: string
    userId: string
    agreementId?: string | null
    evidence?: string | null
    resolution?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type complaintUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    evidence?: NullableStringFieldUpdateOperationsInput | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type complaintUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    agreementId?: NullableStringFieldUpdateOperationsInput | string | null
    evidence?: NullableStringFieldUpdateOperationsInput | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type democlassCreateInput = {
    id: string
    title: string
    description: string
    videoUrl?: string | null
    schedule: Date | string
    price: number
    isPaid?: boolean
    status?: $Enums.democlass_status
    category: string
    createdAt?: Date | string
    updatedAt: Date | string
    user: userCreateNestedOneWithoutDemoclassInput
  }

  export type democlassUncheckedCreateInput = {
    id: string
    title: string
    description: string
    videoUrl?: string | null
    schedule: Date | string
    price: number
    isPaid?: boolean
    status?: $Enums.democlass_status
    manufacturerId: string
    category: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type democlassUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: DateTimeFieldUpdateOperationsInput | Date | string
    price?: FloatFieldUpdateOperationsInput | number
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    status?: Enumdemoclass_statusFieldUpdateOperationsInput | $Enums.democlass_status
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: userUpdateOneRequiredWithoutDemoclassNestedInput
  }

  export type democlassUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: DateTimeFieldUpdateOperationsInput | Date | string
    price?: FloatFieldUpdateOperationsInput | number
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    status?: Enumdemoclass_statusFieldUpdateOperationsInput | $Enums.democlass_status
    manufacturerId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type democlassCreateManyInput = {
    id: string
    title: string
    description: string
    videoUrl?: string | null
    schedule: Date | string
    price: number
    isPaid?: boolean
    status?: $Enums.democlass_status
    manufacturerId: string
    category: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type democlassUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: DateTimeFieldUpdateOperationsInput | Date | string
    price?: FloatFieldUpdateOperationsInput | number
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    status?: Enumdemoclass_statusFieldUpdateOperationsInput | $Enums.democlass_status
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type democlassUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: DateTimeFieldUpdateOperationsInput | Date | string
    price?: FloatFieldUpdateOperationsInput | number
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    status?: Enumdemoclass_statusFieldUpdateOperationsInput | $Enums.democlass_status
    manufacturerId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type forumcategoryCreateInput = {
    id: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    forumthread?: forumthreadCreateNestedManyWithoutForumcategoryInput
  }

  export type forumcategoryUncheckedCreateInput = {
    id: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    forumthread?: forumthreadUncheckedCreateNestedManyWithoutForumcategoryInput
  }

  export type forumcategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    forumthread?: forumthreadUpdateManyWithoutForumcategoryNestedInput
  }

  export type forumcategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    forumthread?: forumthreadUncheckedUpdateManyWithoutForumcategoryNestedInput
  }

  export type forumcategoryCreateManyInput = {
    id: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type forumcategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type forumcategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type forumpostCreateInput = {
    id: string
    content: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
    user: userCreateNestedOneWithoutForumpostInput
    forumthread: forumthreadCreateNestedOneWithoutForumpostInput
  }

  export type forumpostUncheckedCreateInput = {
    id: string
    content: string
    authorId: string
    threadId: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
  }

  export type forumpostUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
    user?: userUpdateOneRequiredWithoutForumpostNestedInput
    forumthread?: forumthreadUpdateOneRequiredWithoutForumpostNestedInput
  }

  export type forumpostUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
  }

  export type forumpostCreateManyInput = {
    id: string
    content: string
    authorId: string
    threadId: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
  }

  export type forumpostUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
  }

  export type forumpostUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
  }

  export type forumthreadCreateInput = {
    id: string
    title: string
    content: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
    forumpost?: forumpostCreateNestedManyWithoutForumthreadInput
    user: userCreateNestedOneWithoutForumthreadInput
    forumcategory: forumcategoryCreateNestedOneWithoutForumthreadInput
  }

  export type forumthreadUncheckedCreateInput = {
    id: string
    title: string
    content: string
    authorId: string
    categoryId: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
    forumpost?: forumpostUncheckedCreateNestedManyWithoutForumthreadInput
  }

  export type forumthreadUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
    forumpost?: forumpostUpdateManyWithoutForumthreadNestedInput
    user?: userUpdateOneRequiredWithoutForumthreadNestedInput
    forumcategory?: forumcategoryUpdateOneRequiredWithoutForumthreadNestedInput
  }

  export type forumthreadUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
    forumpost?: forumpostUncheckedUpdateManyWithoutForumthreadNestedInput
  }

  export type forumthreadCreateManyInput = {
    id: string
    title: string
    content: string
    authorId: string
    categoryId: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
  }

  export type forumthreadUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
  }

  export type forumthreadUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
  }

  export type productCreateInput = {
    id: string
    title: string
    description: string
    category: string
    images: string
    contactInfo?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    user: userCreateNestedOneWithoutProductInput
  }

  export type productUncheckedCreateInput = {
    id: string
    title: string
    description: string
    category: string
    images: string
    contactInfo?: string | null
    ownerId: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type productUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    images?: StringFieldUpdateOperationsInput | string
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: userUpdateOneRequiredWithoutProductNestedInput
  }

  export type productUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    images?: StringFieldUpdateOperationsInput | string
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type productCreateManyInput = {
    id: string
    title: string
    description: string
    category: string
    images: string
    contactInfo?: string | null
    ownerId: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type productUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    images?: StringFieldUpdateOperationsInput | string
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type productUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    images?: StringFieldUpdateOperationsInput | string
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sessionCreateInput = {
    id: string
    sessionToken: string
    expires: Date | string
    user: userCreateNestedOneWithoutSessionInput
  }

  export type sessionUncheckedCreateInput = {
    id: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type sessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: userUpdateOneRequiredWithoutSessionNestedInput
  }

  export type sessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sessionCreateManyInput = {
    id: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type sessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type userCreateInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountCreateNestedManyWithoutUserInput
    agreement_agreement_initiatorIdTouser?: agreementCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    agreement_agreement_receiverIdTouser?: agreementCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    complaint?: complaintCreateNestedManyWithoutUserInput
    democlass?: democlassCreateNestedManyWithoutUserInput
    forumpost?: forumpostCreateNestedManyWithoutUserInput
    forumthread?: forumthreadCreateNestedManyWithoutUserInput
    product?: productCreateNestedManyWithoutUserInput
    session?: sessionCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountUncheckedCreateNestedManyWithoutUserInput
    agreement_agreement_initiatorIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    complaint?: complaintUncheckedCreateNestedManyWithoutUserInput
    democlass?: democlassUncheckedCreateNestedManyWithoutUserInput
    forumpost?: forumpostUncheckedCreateNestedManyWithoutUserInput
    forumthread?: forumthreadUncheckedCreateNestedManyWithoutUserInput
    product?: productUncheckedCreateNestedManyWithoutUserInput
    session?: sessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type userUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUpdateManyWithoutUserNestedInput
    agreement_agreement_initiatorIdTouser?: agreementUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    complaint?: complaintUpdateManyWithoutUserNestedInput
    democlass?: democlassUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUpdateManyWithoutUserNestedInput
    product?: productUpdateManyWithoutUserNestedInput
    session?: sessionUpdateManyWithoutUserNestedInput
  }

  export type userUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUncheckedUpdateManyWithoutUserNestedInput
    agreement_agreement_initiatorIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    complaint?: complaintUncheckedUpdateManyWithoutUserNestedInput
    democlass?: democlassUncheckedUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUncheckedUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUncheckedUpdateManyWithoutUserNestedInput
    product?: productUncheckedUpdateManyWithoutUserNestedInput
    session?: sessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type userCreateManyInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type userUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type userUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type verificationtokenCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type verificationtokenUncheckedCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type verificationtokenUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type verificationtokenUncheckedUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type verificationtokenCreateManyInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type verificationtokenUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type verificationtokenUncheckedUpdateManyInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserScalarRelationFilter = {
    is?: userWhereInput
    isNot?: userWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type accountOrderByRelevanceInput = {
    fields: accountOrderByRelevanceFieldEnum | accountOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type accountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type accountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type accountAvgOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type accountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type accountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type accountSumOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type Enumagreement_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.agreement_status | Enumagreement_statusFieldRefInput<$PrismaModel>
    in?: $Enums.agreement_status[]
    notIn?: $Enums.agreement_status[]
    not?: NestedEnumagreement_statusFilter<$PrismaModel> | $Enums.agreement_status
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ComplaintListRelationFilter = {
    every?: complaintWhereInput
    some?: complaintWhereInput
    none?: complaintWhereInput
  }

  export type complaintOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type agreementOrderByRelevanceInput = {
    fields: agreementOrderByRelevanceFieldEnum | agreementOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type agreementCountOrderByAggregateInput = {
    id?: SortOrder
    initiatorId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    terms?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type agreementMaxOrderByAggregateInput = {
    id?: SortOrder
    initiatorId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    terms?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type agreementMinOrderByAggregateInput = {
    id?: SortOrder
    initiatorId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    terms?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type Enumagreement_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.agreement_status | Enumagreement_statusFieldRefInput<$PrismaModel>
    in?: $Enums.agreement_status[]
    notIn?: $Enums.agreement_status[]
    not?: NestedEnumagreement_statusWithAggregatesFilter<$PrismaModel> | $Enums.agreement_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumagreement_statusFilter<$PrismaModel>
    _max?: NestedEnumagreement_statusFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type AgreementNullableScalarRelationFilter = {
    is?: agreementWhereInput | null
    isNot?: agreementWhereInput | null
  }

  export type complaintOrderByRelevanceInput = {
    fields: complaintOrderByRelevanceFieldEnum | complaintOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type complaintCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    userId?: SortOrder
    agreementId?: SortOrder
    evidence?: SortOrder
    resolution?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type complaintMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    userId?: SortOrder
    agreementId?: SortOrder
    evidence?: SortOrder
    resolution?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type complaintMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    userId?: SortOrder
    agreementId?: SortOrder
    evidence?: SortOrder
    resolution?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type Enumdemoclass_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.democlass_status | Enumdemoclass_statusFieldRefInput<$PrismaModel>
    in?: $Enums.democlass_status[]
    notIn?: $Enums.democlass_status[]
    not?: NestedEnumdemoclass_statusFilter<$PrismaModel> | $Enums.democlass_status
  }

  export type democlassOrderByRelevanceInput = {
    fields: democlassOrderByRelevanceFieldEnum | democlassOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type democlassCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    videoUrl?: SortOrder
    schedule?: SortOrder
    price?: SortOrder
    isPaid?: SortOrder
    status?: SortOrder
    manufacturerId?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type democlassAvgOrderByAggregateInput = {
    price?: SortOrder
  }

  export type democlassMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    videoUrl?: SortOrder
    schedule?: SortOrder
    price?: SortOrder
    isPaid?: SortOrder
    status?: SortOrder
    manufacturerId?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type democlassMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    videoUrl?: SortOrder
    schedule?: SortOrder
    price?: SortOrder
    isPaid?: SortOrder
    status?: SortOrder
    manufacturerId?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type democlassSumOrderByAggregateInput = {
    price?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type Enumdemoclass_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.democlass_status | Enumdemoclass_statusFieldRefInput<$PrismaModel>
    in?: $Enums.democlass_status[]
    notIn?: $Enums.democlass_status[]
    not?: NestedEnumdemoclass_statusWithAggregatesFilter<$PrismaModel> | $Enums.democlass_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumdemoclass_statusFilter<$PrismaModel>
    _max?: NestedEnumdemoclass_statusFilter<$PrismaModel>
  }

  export type ForumthreadListRelationFilter = {
    every?: forumthreadWhereInput
    some?: forumthreadWhereInput
    none?: forumthreadWhereInput
  }

  export type forumthreadOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type forumcategoryOrderByRelevanceInput = {
    fields: forumcategoryOrderByRelevanceFieldEnum | forumcategoryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type forumcategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type forumcategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type forumcategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ForumthreadScalarRelationFilter = {
    is?: forumthreadWhereInput
    isNot?: forumthreadWhereInput
  }

  export type forumpostOrderByRelevanceInput = {
    fields: forumpostOrderByRelevanceFieldEnum | forumpostOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type forumpostCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    authorId?: SortOrder
    threadId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    likes?: SortOrder
  }

  export type forumpostAvgOrderByAggregateInput = {
    likes?: SortOrder
  }

  export type forumpostMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    authorId?: SortOrder
    threadId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    likes?: SortOrder
  }

  export type forumpostMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    authorId?: SortOrder
    threadId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    likes?: SortOrder
  }

  export type forumpostSumOrderByAggregateInput = {
    likes?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type ForumpostListRelationFilter = {
    every?: forumpostWhereInput
    some?: forumpostWhereInput
    none?: forumpostWhereInput
  }

  export type ForumcategoryScalarRelationFilter = {
    is?: forumcategoryWhereInput
    isNot?: forumcategoryWhereInput
  }

  export type forumpostOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type forumthreadOrderByRelevanceInput = {
    fields: forumthreadOrderByRelevanceFieldEnum | forumthreadOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type forumthreadCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    authorId?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    likes?: SortOrder
  }

  export type forumthreadAvgOrderByAggregateInput = {
    likes?: SortOrder
  }

  export type forumthreadMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    authorId?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    likes?: SortOrder
  }

  export type forumthreadMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    authorId?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    likes?: SortOrder
  }

  export type forumthreadSumOrderByAggregateInput = {
    likes?: SortOrder
  }

  export type productOrderByRelevanceInput = {
    fields: productOrderByRelevanceFieldEnum | productOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type productCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    images?: SortOrder
    contactInfo?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type productMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    images?: SortOrder
    contactInfo?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type productMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    images?: SortOrder
    contactInfo?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type sessionOrderByRelevanceInput = {
    fields: sessionOrderByRelevanceFieldEnum | sessionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type sessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type sessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type sessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type Enumuser_roleFilter<$PrismaModel = never> = {
    equals?: $Enums.user_role | Enumuser_roleFieldRefInput<$PrismaModel>
    in?: $Enums.user_role[]
    notIn?: $Enums.user_role[]
    not?: NestedEnumuser_roleFilter<$PrismaModel> | $Enums.user_role
  }

  export type Enumuser_cipponMembershipTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.user_cipponMembershipType | Enumuser_cipponMembershipTypeFieldRefInput<$PrismaModel>
    in?: $Enums.user_cipponMembershipType[]
    notIn?: $Enums.user_cipponMembershipType[]
    not?: NestedEnumuser_cipponMembershipTypeFilter<$PrismaModel> | $Enums.user_cipponMembershipType
  }

  export type AccountListRelationFilter = {
    every?: accountWhereInput
    some?: accountWhereInput
    none?: accountWhereInput
  }

  export type AgreementListRelationFilter = {
    every?: agreementWhereInput
    some?: agreementWhereInput
    none?: agreementWhereInput
  }

  export type DemoclassListRelationFilter = {
    every?: democlassWhereInput
    some?: democlassWhereInput
    none?: democlassWhereInput
  }

  export type ProductListRelationFilter = {
    every?: productWhereInput
    some?: productWhereInput
    none?: productWhereInput
  }

  export type SessionListRelationFilter = {
    every?: sessionWhereInput
    some?: sessionWhereInput
    none?: sessionWhereInput
  }

  export type accountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type agreementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type democlassOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type productOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type sessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type userOrderByRelevanceInput = {
    fields: userOrderByRelevanceFieldEnum | userOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type userCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    password?: SortOrder
    image?: SortOrder
    role?: SortOrder
    isVerified?: SortOrder
    hasCipponMembership?: SortOrder
    cipponMembershipType?: SortOrder
    cipponId?: SortOrder
    companyName?: SortOrder
    phone?: SortOrder
    location?: SortOrder
    bio?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type userMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    password?: SortOrder
    image?: SortOrder
    role?: SortOrder
    isVerified?: SortOrder
    hasCipponMembership?: SortOrder
    cipponMembershipType?: SortOrder
    cipponId?: SortOrder
    companyName?: SortOrder
    phone?: SortOrder
    location?: SortOrder
    bio?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type userMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    password?: SortOrder
    image?: SortOrder
    role?: SortOrder
    isVerified?: SortOrder
    hasCipponMembership?: SortOrder
    cipponMembershipType?: SortOrder
    cipponId?: SortOrder
    companyName?: SortOrder
    phone?: SortOrder
    location?: SortOrder
    bio?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type Enumuser_roleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.user_role | Enumuser_roleFieldRefInput<$PrismaModel>
    in?: $Enums.user_role[]
    notIn?: $Enums.user_role[]
    not?: NestedEnumuser_roleWithAggregatesFilter<$PrismaModel> | $Enums.user_role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumuser_roleFilter<$PrismaModel>
    _max?: NestedEnumuser_roleFilter<$PrismaModel>
  }

  export type Enumuser_cipponMembershipTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.user_cipponMembershipType | Enumuser_cipponMembershipTypeFieldRefInput<$PrismaModel>
    in?: $Enums.user_cipponMembershipType[]
    notIn?: $Enums.user_cipponMembershipType[]
    not?: NestedEnumuser_cipponMembershipTypeWithAggregatesFilter<$PrismaModel> | $Enums.user_cipponMembershipType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumuser_cipponMembershipTypeFilter<$PrismaModel>
    _max?: NestedEnumuser_cipponMembershipTypeFilter<$PrismaModel>
  }

  export type verificationtokenOrderByRelevanceInput = {
    fields: verificationtokenOrderByRelevanceFieldEnum | verificationtokenOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type verificationtokenIdentifierTokenCompoundUniqueInput = {
    identifier: string
    token: string
  }

  export type verificationtokenCountOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type verificationtokenMaxOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type verificationtokenMinOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type userCreateNestedOneWithoutAccountInput = {
    create?: XOR<userCreateWithoutAccountInput, userUncheckedCreateWithoutAccountInput>
    connectOrCreate?: userCreateOrConnectWithoutAccountInput
    connect?: userWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type userUpdateOneRequiredWithoutAccountNestedInput = {
    create?: XOR<userCreateWithoutAccountInput, userUncheckedCreateWithoutAccountInput>
    connectOrCreate?: userCreateOrConnectWithoutAccountInput
    upsert?: userUpsertWithoutAccountInput
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutAccountInput, userUpdateWithoutAccountInput>, userUncheckedUpdateWithoutAccountInput>
  }

  export type userCreateNestedOneWithoutAgreement_agreement_initiatorIdTouserInput = {
    create?: XOR<userCreateWithoutAgreement_agreement_initiatorIdTouserInput, userUncheckedCreateWithoutAgreement_agreement_initiatorIdTouserInput>
    connectOrCreate?: userCreateOrConnectWithoutAgreement_agreement_initiatorIdTouserInput
    connect?: userWhereUniqueInput
  }

  export type userCreateNestedOneWithoutAgreement_agreement_receiverIdTouserInput = {
    create?: XOR<userCreateWithoutAgreement_agreement_receiverIdTouserInput, userUncheckedCreateWithoutAgreement_agreement_receiverIdTouserInput>
    connectOrCreate?: userCreateOrConnectWithoutAgreement_agreement_receiverIdTouserInput
    connect?: userWhereUniqueInput
  }

  export type complaintCreateNestedManyWithoutAgreementInput = {
    create?: XOR<complaintCreateWithoutAgreementInput, complaintUncheckedCreateWithoutAgreementInput> | complaintCreateWithoutAgreementInput[] | complaintUncheckedCreateWithoutAgreementInput[]
    connectOrCreate?: complaintCreateOrConnectWithoutAgreementInput | complaintCreateOrConnectWithoutAgreementInput[]
    createMany?: complaintCreateManyAgreementInputEnvelope
    connect?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
  }

  export type complaintUncheckedCreateNestedManyWithoutAgreementInput = {
    create?: XOR<complaintCreateWithoutAgreementInput, complaintUncheckedCreateWithoutAgreementInput> | complaintCreateWithoutAgreementInput[] | complaintUncheckedCreateWithoutAgreementInput[]
    connectOrCreate?: complaintCreateOrConnectWithoutAgreementInput | complaintCreateOrConnectWithoutAgreementInput[]
    createMany?: complaintCreateManyAgreementInputEnvelope
    connect?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
  }

  export type Enumagreement_statusFieldUpdateOperationsInput = {
    set?: $Enums.agreement_status
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type userUpdateOneRequiredWithoutAgreement_agreement_initiatorIdTouserNestedInput = {
    create?: XOR<userCreateWithoutAgreement_agreement_initiatorIdTouserInput, userUncheckedCreateWithoutAgreement_agreement_initiatorIdTouserInput>
    connectOrCreate?: userCreateOrConnectWithoutAgreement_agreement_initiatorIdTouserInput
    upsert?: userUpsertWithoutAgreement_agreement_initiatorIdTouserInput
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutAgreement_agreement_initiatorIdTouserInput, userUpdateWithoutAgreement_agreement_initiatorIdTouserInput>, userUncheckedUpdateWithoutAgreement_agreement_initiatorIdTouserInput>
  }

  export type userUpdateOneRequiredWithoutAgreement_agreement_receiverIdTouserNestedInput = {
    create?: XOR<userCreateWithoutAgreement_agreement_receiverIdTouserInput, userUncheckedCreateWithoutAgreement_agreement_receiverIdTouserInput>
    connectOrCreate?: userCreateOrConnectWithoutAgreement_agreement_receiverIdTouserInput
    upsert?: userUpsertWithoutAgreement_agreement_receiverIdTouserInput
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutAgreement_agreement_receiverIdTouserInput, userUpdateWithoutAgreement_agreement_receiverIdTouserInput>, userUncheckedUpdateWithoutAgreement_agreement_receiverIdTouserInput>
  }

  export type complaintUpdateManyWithoutAgreementNestedInput = {
    create?: XOR<complaintCreateWithoutAgreementInput, complaintUncheckedCreateWithoutAgreementInput> | complaintCreateWithoutAgreementInput[] | complaintUncheckedCreateWithoutAgreementInput[]
    connectOrCreate?: complaintCreateOrConnectWithoutAgreementInput | complaintCreateOrConnectWithoutAgreementInput[]
    upsert?: complaintUpsertWithWhereUniqueWithoutAgreementInput | complaintUpsertWithWhereUniqueWithoutAgreementInput[]
    createMany?: complaintCreateManyAgreementInputEnvelope
    set?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
    disconnect?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
    delete?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
    connect?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
    update?: complaintUpdateWithWhereUniqueWithoutAgreementInput | complaintUpdateWithWhereUniqueWithoutAgreementInput[]
    updateMany?: complaintUpdateManyWithWhereWithoutAgreementInput | complaintUpdateManyWithWhereWithoutAgreementInput[]
    deleteMany?: complaintScalarWhereInput | complaintScalarWhereInput[]
  }

  export type complaintUncheckedUpdateManyWithoutAgreementNestedInput = {
    create?: XOR<complaintCreateWithoutAgreementInput, complaintUncheckedCreateWithoutAgreementInput> | complaintCreateWithoutAgreementInput[] | complaintUncheckedCreateWithoutAgreementInput[]
    connectOrCreate?: complaintCreateOrConnectWithoutAgreementInput | complaintCreateOrConnectWithoutAgreementInput[]
    upsert?: complaintUpsertWithWhereUniqueWithoutAgreementInput | complaintUpsertWithWhereUniqueWithoutAgreementInput[]
    createMany?: complaintCreateManyAgreementInputEnvelope
    set?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
    disconnect?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
    delete?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
    connect?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
    update?: complaintUpdateWithWhereUniqueWithoutAgreementInput | complaintUpdateWithWhereUniqueWithoutAgreementInput[]
    updateMany?: complaintUpdateManyWithWhereWithoutAgreementInput | complaintUpdateManyWithWhereWithoutAgreementInput[]
    deleteMany?: complaintScalarWhereInput | complaintScalarWhereInput[]
  }

  export type agreementCreateNestedOneWithoutComplaintInput = {
    create?: XOR<agreementCreateWithoutComplaintInput, agreementUncheckedCreateWithoutComplaintInput>
    connectOrCreate?: agreementCreateOrConnectWithoutComplaintInput
    connect?: agreementWhereUniqueInput
  }

  export type userCreateNestedOneWithoutComplaintInput = {
    create?: XOR<userCreateWithoutComplaintInput, userUncheckedCreateWithoutComplaintInput>
    connectOrCreate?: userCreateOrConnectWithoutComplaintInput
    connect?: userWhereUniqueInput
  }

  export type agreementUpdateOneWithoutComplaintNestedInput = {
    create?: XOR<agreementCreateWithoutComplaintInput, agreementUncheckedCreateWithoutComplaintInput>
    connectOrCreate?: agreementCreateOrConnectWithoutComplaintInput
    upsert?: agreementUpsertWithoutComplaintInput
    disconnect?: agreementWhereInput | boolean
    delete?: agreementWhereInput | boolean
    connect?: agreementWhereUniqueInput
    update?: XOR<XOR<agreementUpdateToOneWithWhereWithoutComplaintInput, agreementUpdateWithoutComplaintInput>, agreementUncheckedUpdateWithoutComplaintInput>
  }

  export type userUpdateOneRequiredWithoutComplaintNestedInput = {
    create?: XOR<userCreateWithoutComplaintInput, userUncheckedCreateWithoutComplaintInput>
    connectOrCreate?: userCreateOrConnectWithoutComplaintInput
    upsert?: userUpsertWithoutComplaintInput
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutComplaintInput, userUpdateWithoutComplaintInput>, userUncheckedUpdateWithoutComplaintInput>
  }

  export type userCreateNestedOneWithoutDemoclassInput = {
    create?: XOR<userCreateWithoutDemoclassInput, userUncheckedCreateWithoutDemoclassInput>
    connectOrCreate?: userCreateOrConnectWithoutDemoclassInput
    connect?: userWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type Enumdemoclass_statusFieldUpdateOperationsInput = {
    set?: $Enums.democlass_status
  }

  export type userUpdateOneRequiredWithoutDemoclassNestedInput = {
    create?: XOR<userCreateWithoutDemoclassInput, userUncheckedCreateWithoutDemoclassInput>
    connectOrCreate?: userCreateOrConnectWithoutDemoclassInput
    upsert?: userUpsertWithoutDemoclassInput
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutDemoclassInput, userUpdateWithoutDemoclassInput>, userUncheckedUpdateWithoutDemoclassInput>
  }

  export type forumthreadCreateNestedManyWithoutForumcategoryInput = {
    create?: XOR<forumthreadCreateWithoutForumcategoryInput, forumthreadUncheckedCreateWithoutForumcategoryInput> | forumthreadCreateWithoutForumcategoryInput[] | forumthreadUncheckedCreateWithoutForumcategoryInput[]
    connectOrCreate?: forumthreadCreateOrConnectWithoutForumcategoryInput | forumthreadCreateOrConnectWithoutForumcategoryInput[]
    createMany?: forumthreadCreateManyForumcategoryInputEnvelope
    connect?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
  }

  export type forumthreadUncheckedCreateNestedManyWithoutForumcategoryInput = {
    create?: XOR<forumthreadCreateWithoutForumcategoryInput, forumthreadUncheckedCreateWithoutForumcategoryInput> | forumthreadCreateWithoutForumcategoryInput[] | forumthreadUncheckedCreateWithoutForumcategoryInput[]
    connectOrCreate?: forumthreadCreateOrConnectWithoutForumcategoryInput | forumthreadCreateOrConnectWithoutForumcategoryInput[]
    createMany?: forumthreadCreateManyForumcategoryInputEnvelope
    connect?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
  }

  export type forumthreadUpdateManyWithoutForumcategoryNestedInput = {
    create?: XOR<forumthreadCreateWithoutForumcategoryInput, forumthreadUncheckedCreateWithoutForumcategoryInput> | forumthreadCreateWithoutForumcategoryInput[] | forumthreadUncheckedCreateWithoutForumcategoryInput[]
    connectOrCreate?: forumthreadCreateOrConnectWithoutForumcategoryInput | forumthreadCreateOrConnectWithoutForumcategoryInput[]
    upsert?: forumthreadUpsertWithWhereUniqueWithoutForumcategoryInput | forumthreadUpsertWithWhereUniqueWithoutForumcategoryInput[]
    createMany?: forumthreadCreateManyForumcategoryInputEnvelope
    set?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
    disconnect?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
    delete?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
    connect?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
    update?: forumthreadUpdateWithWhereUniqueWithoutForumcategoryInput | forumthreadUpdateWithWhereUniqueWithoutForumcategoryInput[]
    updateMany?: forumthreadUpdateManyWithWhereWithoutForumcategoryInput | forumthreadUpdateManyWithWhereWithoutForumcategoryInput[]
    deleteMany?: forumthreadScalarWhereInput | forumthreadScalarWhereInput[]
  }

  export type forumthreadUncheckedUpdateManyWithoutForumcategoryNestedInput = {
    create?: XOR<forumthreadCreateWithoutForumcategoryInput, forumthreadUncheckedCreateWithoutForumcategoryInput> | forumthreadCreateWithoutForumcategoryInput[] | forumthreadUncheckedCreateWithoutForumcategoryInput[]
    connectOrCreate?: forumthreadCreateOrConnectWithoutForumcategoryInput | forumthreadCreateOrConnectWithoutForumcategoryInput[]
    upsert?: forumthreadUpsertWithWhereUniqueWithoutForumcategoryInput | forumthreadUpsertWithWhereUniqueWithoutForumcategoryInput[]
    createMany?: forumthreadCreateManyForumcategoryInputEnvelope
    set?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
    disconnect?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
    delete?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
    connect?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
    update?: forumthreadUpdateWithWhereUniqueWithoutForumcategoryInput | forumthreadUpdateWithWhereUniqueWithoutForumcategoryInput[]
    updateMany?: forumthreadUpdateManyWithWhereWithoutForumcategoryInput | forumthreadUpdateManyWithWhereWithoutForumcategoryInput[]
    deleteMany?: forumthreadScalarWhereInput | forumthreadScalarWhereInput[]
  }

  export type userCreateNestedOneWithoutForumpostInput = {
    create?: XOR<userCreateWithoutForumpostInput, userUncheckedCreateWithoutForumpostInput>
    connectOrCreate?: userCreateOrConnectWithoutForumpostInput
    connect?: userWhereUniqueInput
  }

  export type forumthreadCreateNestedOneWithoutForumpostInput = {
    create?: XOR<forumthreadCreateWithoutForumpostInput, forumthreadUncheckedCreateWithoutForumpostInput>
    connectOrCreate?: forumthreadCreateOrConnectWithoutForumpostInput
    connect?: forumthreadWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type userUpdateOneRequiredWithoutForumpostNestedInput = {
    create?: XOR<userCreateWithoutForumpostInput, userUncheckedCreateWithoutForumpostInput>
    connectOrCreate?: userCreateOrConnectWithoutForumpostInput
    upsert?: userUpsertWithoutForumpostInput
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutForumpostInput, userUpdateWithoutForumpostInput>, userUncheckedUpdateWithoutForumpostInput>
  }

  export type forumthreadUpdateOneRequiredWithoutForumpostNestedInput = {
    create?: XOR<forumthreadCreateWithoutForumpostInput, forumthreadUncheckedCreateWithoutForumpostInput>
    connectOrCreate?: forumthreadCreateOrConnectWithoutForumpostInput
    upsert?: forumthreadUpsertWithoutForumpostInput
    connect?: forumthreadWhereUniqueInput
    update?: XOR<XOR<forumthreadUpdateToOneWithWhereWithoutForumpostInput, forumthreadUpdateWithoutForumpostInput>, forumthreadUncheckedUpdateWithoutForumpostInput>
  }

  export type forumpostCreateNestedManyWithoutForumthreadInput = {
    create?: XOR<forumpostCreateWithoutForumthreadInput, forumpostUncheckedCreateWithoutForumthreadInput> | forumpostCreateWithoutForumthreadInput[] | forumpostUncheckedCreateWithoutForumthreadInput[]
    connectOrCreate?: forumpostCreateOrConnectWithoutForumthreadInput | forumpostCreateOrConnectWithoutForumthreadInput[]
    createMany?: forumpostCreateManyForumthreadInputEnvelope
    connect?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
  }

  export type userCreateNestedOneWithoutForumthreadInput = {
    create?: XOR<userCreateWithoutForumthreadInput, userUncheckedCreateWithoutForumthreadInput>
    connectOrCreate?: userCreateOrConnectWithoutForumthreadInput
    connect?: userWhereUniqueInput
  }

  export type forumcategoryCreateNestedOneWithoutForumthreadInput = {
    create?: XOR<forumcategoryCreateWithoutForumthreadInput, forumcategoryUncheckedCreateWithoutForumthreadInput>
    connectOrCreate?: forumcategoryCreateOrConnectWithoutForumthreadInput
    connect?: forumcategoryWhereUniqueInput
  }

  export type forumpostUncheckedCreateNestedManyWithoutForumthreadInput = {
    create?: XOR<forumpostCreateWithoutForumthreadInput, forumpostUncheckedCreateWithoutForumthreadInput> | forumpostCreateWithoutForumthreadInput[] | forumpostUncheckedCreateWithoutForumthreadInput[]
    connectOrCreate?: forumpostCreateOrConnectWithoutForumthreadInput | forumpostCreateOrConnectWithoutForumthreadInput[]
    createMany?: forumpostCreateManyForumthreadInputEnvelope
    connect?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
  }

  export type forumpostUpdateManyWithoutForumthreadNestedInput = {
    create?: XOR<forumpostCreateWithoutForumthreadInput, forumpostUncheckedCreateWithoutForumthreadInput> | forumpostCreateWithoutForumthreadInput[] | forumpostUncheckedCreateWithoutForumthreadInput[]
    connectOrCreate?: forumpostCreateOrConnectWithoutForumthreadInput | forumpostCreateOrConnectWithoutForumthreadInput[]
    upsert?: forumpostUpsertWithWhereUniqueWithoutForumthreadInput | forumpostUpsertWithWhereUniqueWithoutForumthreadInput[]
    createMany?: forumpostCreateManyForumthreadInputEnvelope
    set?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
    disconnect?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
    delete?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
    connect?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
    update?: forumpostUpdateWithWhereUniqueWithoutForumthreadInput | forumpostUpdateWithWhereUniqueWithoutForumthreadInput[]
    updateMany?: forumpostUpdateManyWithWhereWithoutForumthreadInput | forumpostUpdateManyWithWhereWithoutForumthreadInput[]
    deleteMany?: forumpostScalarWhereInput | forumpostScalarWhereInput[]
  }

  export type userUpdateOneRequiredWithoutForumthreadNestedInput = {
    create?: XOR<userCreateWithoutForumthreadInput, userUncheckedCreateWithoutForumthreadInput>
    connectOrCreate?: userCreateOrConnectWithoutForumthreadInput
    upsert?: userUpsertWithoutForumthreadInput
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutForumthreadInput, userUpdateWithoutForumthreadInput>, userUncheckedUpdateWithoutForumthreadInput>
  }

  export type forumcategoryUpdateOneRequiredWithoutForumthreadNestedInput = {
    create?: XOR<forumcategoryCreateWithoutForumthreadInput, forumcategoryUncheckedCreateWithoutForumthreadInput>
    connectOrCreate?: forumcategoryCreateOrConnectWithoutForumthreadInput
    upsert?: forumcategoryUpsertWithoutForumthreadInput
    connect?: forumcategoryWhereUniqueInput
    update?: XOR<XOR<forumcategoryUpdateToOneWithWhereWithoutForumthreadInput, forumcategoryUpdateWithoutForumthreadInput>, forumcategoryUncheckedUpdateWithoutForumthreadInput>
  }

  export type forumpostUncheckedUpdateManyWithoutForumthreadNestedInput = {
    create?: XOR<forumpostCreateWithoutForumthreadInput, forumpostUncheckedCreateWithoutForumthreadInput> | forumpostCreateWithoutForumthreadInput[] | forumpostUncheckedCreateWithoutForumthreadInput[]
    connectOrCreate?: forumpostCreateOrConnectWithoutForumthreadInput | forumpostCreateOrConnectWithoutForumthreadInput[]
    upsert?: forumpostUpsertWithWhereUniqueWithoutForumthreadInput | forumpostUpsertWithWhereUniqueWithoutForumthreadInput[]
    createMany?: forumpostCreateManyForumthreadInputEnvelope
    set?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
    disconnect?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
    delete?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
    connect?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
    update?: forumpostUpdateWithWhereUniqueWithoutForumthreadInput | forumpostUpdateWithWhereUniqueWithoutForumthreadInput[]
    updateMany?: forumpostUpdateManyWithWhereWithoutForumthreadInput | forumpostUpdateManyWithWhereWithoutForumthreadInput[]
    deleteMany?: forumpostScalarWhereInput | forumpostScalarWhereInput[]
  }

  export type userCreateNestedOneWithoutProductInput = {
    create?: XOR<userCreateWithoutProductInput, userUncheckedCreateWithoutProductInput>
    connectOrCreate?: userCreateOrConnectWithoutProductInput
    connect?: userWhereUniqueInput
  }

  export type userUpdateOneRequiredWithoutProductNestedInput = {
    create?: XOR<userCreateWithoutProductInput, userUncheckedCreateWithoutProductInput>
    connectOrCreate?: userCreateOrConnectWithoutProductInput
    upsert?: userUpsertWithoutProductInput
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutProductInput, userUpdateWithoutProductInput>, userUncheckedUpdateWithoutProductInput>
  }

  export type userCreateNestedOneWithoutSessionInput = {
    create?: XOR<userCreateWithoutSessionInput, userUncheckedCreateWithoutSessionInput>
    connectOrCreate?: userCreateOrConnectWithoutSessionInput
    connect?: userWhereUniqueInput
  }

  export type userUpdateOneRequiredWithoutSessionNestedInput = {
    create?: XOR<userCreateWithoutSessionInput, userUncheckedCreateWithoutSessionInput>
    connectOrCreate?: userCreateOrConnectWithoutSessionInput
    upsert?: userUpsertWithoutSessionInput
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutSessionInput, userUpdateWithoutSessionInput>, userUncheckedUpdateWithoutSessionInput>
  }

  export type accountCreateNestedManyWithoutUserInput = {
    create?: XOR<accountCreateWithoutUserInput, accountUncheckedCreateWithoutUserInput> | accountCreateWithoutUserInput[] | accountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: accountCreateOrConnectWithoutUserInput | accountCreateOrConnectWithoutUserInput[]
    createMany?: accountCreateManyUserInputEnvelope
    connect?: accountWhereUniqueInput | accountWhereUniqueInput[]
  }

  export type agreementCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput = {
    create?: XOR<agreementCreateWithoutUser_agreement_initiatorIdTouserInput, agreementUncheckedCreateWithoutUser_agreement_initiatorIdTouserInput> | agreementCreateWithoutUser_agreement_initiatorIdTouserInput[] | agreementUncheckedCreateWithoutUser_agreement_initiatorIdTouserInput[]
    connectOrCreate?: agreementCreateOrConnectWithoutUser_agreement_initiatorIdTouserInput | agreementCreateOrConnectWithoutUser_agreement_initiatorIdTouserInput[]
    createMany?: agreementCreateManyUser_agreement_initiatorIdTouserInputEnvelope
    connect?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
  }

  export type agreementCreateNestedManyWithoutUser_agreement_receiverIdTouserInput = {
    create?: XOR<agreementCreateWithoutUser_agreement_receiverIdTouserInput, agreementUncheckedCreateWithoutUser_agreement_receiverIdTouserInput> | agreementCreateWithoutUser_agreement_receiverIdTouserInput[] | agreementUncheckedCreateWithoutUser_agreement_receiverIdTouserInput[]
    connectOrCreate?: agreementCreateOrConnectWithoutUser_agreement_receiverIdTouserInput | agreementCreateOrConnectWithoutUser_agreement_receiverIdTouserInput[]
    createMany?: agreementCreateManyUser_agreement_receiverIdTouserInputEnvelope
    connect?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
  }

  export type complaintCreateNestedManyWithoutUserInput = {
    create?: XOR<complaintCreateWithoutUserInput, complaintUncheckedCreateWithoutUserInput> | complaintCreateWithoutUserInput[] | complaintUncheckedCreateWithoutUserInput[]
    connectOrCreate?: complaintCreateOrConnectWithoutUserInput | complaintCreateOrConnectWithoutUserInput[]
    createMany?: complaintCreateManyUserInputEnvelope
    connect?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
  }

  export type democlassCreateNestedManyWithoutUserInput = {
    create?: XOR<democlassCreateWithoutUserInput, democlassUncheckedCreateWithoutUserInput> | democlassCreateWithoutUserInput[] | democlassUncheckedCreateWithoutUserInput[]
    connectOrCreate?: democlassCreateOrConnectWithoutUserInput | democlassCreateOrConnectWithoutUserInput[]
    createMany?: democlassCreateManyUserInputEnvelope
    connect?: democlassWhereUniqueInput | democlassWhereUniqueInput[]
  }

  export type forumpostCreateNestedManyWithoutUserInput = {
    create?: XOR<forumpostCreateWithoutUserInput, forumpostUncheckedCreateWithoutUserInput> | forumpostCreateWithoutUserInput[] | forumpostUncheckedCreateWithoutUserInput[]
    connectOrCreate?: forumpostCreateOrConnectWithoutUserInput | forumpostCreateOrConnectWithoutUserInput[]
    createMany?: forumpostCreateManyUserInputEnvelope
    connect?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
  }

  export type forumthreadCreateNestedManyWithoutUserInput = {
    create?: XOR<forumthreadCreateWithoutUserInput, forumthreadUncheckedCreateWithoutUserInput> | forumthreadCreateWithoutUserInput[] | forumthreadUncheckedCreateWithoutUserInput[]
    connectOrCreate?: forumthreadCreateOrConnectWithoutUserInput | forumthreadCreateOrConnectWithoutUserInput[]
    createMany?: forumthreadCreateManyUserInputEnvelope
    connect?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
  }

  export type productCreateNestedManyWithoutUserInput = {
    create?: XOR<productCreateWithoutUserInput, productUncheckedCreateWithoutUserInput> | productCreateWithoutUserInput[] | productUncheckedCreateWithoutUserInput[]
    connectOrCreate?: productCreateOrConnectWithoutUserInput | productCreateOrConnectWithoutUserInput[]
    createMany?: productCreateManyUserInputEnvelope
    connect?: productWhereUniqueInput | productWhereUniqueInput[]
  }

  export type sessionCreateNestedManyWithoutUserInput = {
    create?: XOR<sessionCreateWithoutUserInput, sessionUncheckedCreateWithoutUserInput> | sessionCreateWithoutUserInput[] | sessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: sessionCreateOrConnectWithoutUserInput | sessionCreateOrConnectWithoutUserInput[]
    createMany?: sessionCreateManyUserInputEnvelope
    connect?: sessionWhereUniqueInput | sessionWhereUniqueInput[]
  }

  export type accountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<accountCreateWithoutUserInput, accountUncheckedCreateWithoutUserInput> | accountCreateWithoutUserInput[] | accountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: accountCreateOrConnectWithoutUserInput | accountCreateOrConnectWithoutUserInput[]
    createMany?: accountCreateManyUserInputEnvelope
    connect?: accountWhereUniqueInput | accountWhereUniqueInput[]
  }

  export type agreementUncheckedCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput = {
    create?: XOR<agreementCreateWithoutUser_agreement_initiatorIdTouserInput, agreementUncheckedCreateWithoutUser_agreement_initiatorIdTouserInput> | agreementCreateWithoutUser_agreement_initiatorIdTouserInput[] | agreementUncheckedCreateWithoutUser_agreement_initiatorIdTouserInput[]
    connectOrCreate?: agreementCreateOrConnectWithoutUser_agreement_initiatorIdTouserInput | agreementCreateOrConnectWithoutUser_agreement_initiatorIdTouserInput[]
    createMany?: agreementCreateManyUser_agreement_initiatorIdTouserInputEnvelope
    connect?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
  }

  export type agreementUncheckedCreateNestedManyWithoutUser_agreement_receiverIdTouserInput = {
    create?: XOR<agreementCreateWithoutUser_agreement_receiverIdTouserInput, agreementUncheckedCreateWithoutUser_agreement_receiverIdTouserInput> | agreementCreateWithoutUser_agreement_receiverIdTouserInput[] | agreementUncheckedCreateWithoutUser_agreement_receiverIdTouserInput[]
    connectOrCreate?: agreementCreateOrConnectWithoutUser_agreement_receiverIdTouserInput | agreementCreateOrConnectWithoutUser_agreement_receiverIdTouserInput[]
    createMany?: agreementCreateManyUser_agreement_receiverIdTouserInputEnvelope
    connect?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
  }

  export type complaintUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<complaintCreateWithoutUserInput, complaintUncheckedCreateWithoutUserInput> | complaintCreateWithoutUserInput[] | complaintUncheckedCreateWithoutUserInput[]
    connectOrCreate?: complaintCreateOrConnectWithoutUserInput | complaintCreateOrConnectWithoutUserInput[]
    createMany?: complaintCreateManyUserInputEnvelope
    connect?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
  }

  export type democlassUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<democlassCreateWithoutUserInput, democlassUncheckedCreateWithoutUserInput> | democlassCreateWithoutUserInput[] | democlassUncheckedCreateWithoutUserInput[]
    connectOrCreate?: democlassCreateOrConnectWithoutUserInput | democlassCreateOrConnectWithoutUserInput[]
    createMany?: democlassCreateManyUserInputEnvelope
    connect?: democlassWhereUniqueInput | democlassWhereUniqueInput[]
  }

  export type forumpostUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<forumpostCreateWithoutUserInput, forumpostUncheckedCreateWithoutUserInput> | forumpostCreateWithoutUserInput[] | forumpostUncheckedCreateWithoutUserInput[]
    connectOrCreate?: forumpostCreateOrConnectWithoutUserInput | forumpostCreateOrConnectWithoutUserInput[]
    createMany?: forumpostCreateManyUserInputEnvelope
    connect?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
  }

  export type forumthreadUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<forumthreadCreateWithoutUserInput, forumthreadUncheckedCreateWithoutUserInput> | forumthreadCreateWithoutUserInput[] | forumthreadUncheckedCreateWithoutUserInput[]
    connectOrCreate?: forumthreadCreateOrConnectWithoutUserInput | forumthreadCreateOrConnectWithoutUserInput[]
    createMany?: forumthreadCreateManyUserInputEnvelope
    connect?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
  }

  export type productUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<productCreateWithoutUserInput, productUncheckedCreateWithoutUserInput> | productCreateWithoutUserInput[] | productUncheckedCreateWithoutUserInput[]
    connectOrCreate?: productCreateOrConnectWithoutUserInput | productCreateOrConnectWithoutUserInput[]
    createMany?: productCreateManyUserInputEnvelope
    connect?: productWhereUniqueInput | productWhereUniqueInput[]
  }

  export type sessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<sessionCreateWithoutUserInput, sessionUncheckedCreateWithoutUserInput> | sessionCreateWithoutUserInput[] | sessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: sessionCreateOrConnectWithoutUserInput | sessionCreateOrConnectWithoutUserInput[]
    createMany?: sessionCreateManyUserInputEnvelope
    connect?: sessionWhereUniqueInput | sessionWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type Enumuser_roleFieldUpdateOperationsInput = {
    set?: $Enums.user_role
  }

  export type Enumuser_cipponMembershipTypeFieldUpdateOperationsInput = {
    set?: $Enums.user_cipponMembershipType
  }

  export type accountUpdateManyWithoutUserNestedInput = {
    create?: XOR<accountCreateWithoutUserInput, accountUncheckedCreateWithoutUserInput> | accountCreateWithoutUserInput[] | accountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: accountCreateOrConnectWithoutUserInput | accountCreateOrConnectWithoutUserInput[]
    upsert?: accountUpsertWithWhereUniqueWithoutUserInput | accountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: accountCreateManyUserInputEnvelope
    set?: accountWhereUniqueInput | accountWhereUniqueInput[]
    disconnect?: accountWhereUniqueInput | accountWhereUniqueInput[]
    delete?: accountWhereUniqueInput | accountWhereUniqueInput[]
    connect?: accountWhereUniqueInput | accountWhereUniqueInput[]
    update?: accountUpdateWithWhereUniqueWithoutUserInput | accountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: accountUpdateManyWithWhereWithoutUserInput | accountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: accountScalarWhereInput | accountScalarWhereInput[]
  }

  export type agreementUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput = {
    create?: XOR<agreementCreateWithoutUser_agreement_initiatorIdTouserInput, agreementUncheckedCreateWithoutUser_agreement_initiatorIdTouserInput> | agreementCreateWithoutUser_agreement_initiatorIdTouserInput[] | agreementUncheckedCreateWithoutUser_agreement_initiatorIdTouserInput[]
    connectOrCreate?: agreementCreateOrConnectWithoutUser_agreement_initiatorIdTouserInput | agreementCreateOrConnectWithoutUser_agreement_initiatorIdTouserInput[]
    upsert?: agreementUpsertWithWhereUniqueWithoutUser_agreement_initiatorIdTouserInput | agreementUpsertWithWhereUniqueWithoutUser_agreement_initiatorIdTouserInput[]
    createMany?: agreementCreateManyUser_agreement_initiatorIdTouserInputEnvelope
    set?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
    disconnect?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
    delete?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
    connect?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
    update?: agreementUpdateWithWhereUniqueWithoutUser_agreement_initiatorIdTouserInput | agreementUpdateWithWhereUniqueWithoutUser_agreement_initiatorIdTouserInput[]
    updateMany?: agreementUpdateManyWithWhereWithoutUser_agreement_initiatorIdTouserInput | agreementUpdateManyWithWhereWithoutUser_agreement_initiatorIdTouserInput[]
    deleteMany?: agreementScalarWhereInput | agreementScalarWhereInput[]
  }

  export type agreementUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput = {
    create?: XOR<agreementCreateWithoutUser_agreement_receiverIdTouserInput, agreementUncheckedCreateWithoutUser_agreement_receiverIdTouserInput> | agreementCreateWithoutUser_agreement_receiverIdTouserInput[] | agreementUncheckedCreateWithoutUser_agreement_receiverIdTouserInput[]
    connectOrCreate?: agreementCreateOrConnectWithoutUser_agreement_receiverIdTouserInput | agreementCreateOrConnectWithoutUser_agreement_receiverIdTouserInput[]
    upsert?: agreementUpsertWithWhereUniqueWithoutUser_agreement_receiverIdTouserInput | agreementUpsertWithWhereUniqueWithoutUser_agreement_receiverIdTouserInput[]
    createMany?: agreementCreateManyUser_agreement_receiverIdTouserInputEnvelope
    set?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
    disconnect?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
    delete?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
    connect?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
    update?: agreementUpdateWithWhereUniqueWithoutUser_agreement_receiverIdTouserInput | agreementUpdateWithWhereUniqueWithoutUser_agreement_receiverIdTouserInput[]
    updateMany?: agreementUpdateManyWithWhereWithoutUser_agreement_receiverIdTouserInput | agreementUpdateManyWithWhereWithoutUser_agreement_receiverIdTouserInput[]
    deleteMany?: agreementScalarWhereInput | agreementScalarWhereInput[]
  }

  export type complaintUpdateManyWithoutUserNestedInput = {
    create?: XOR<complaintCreateWithoutUserInput, complaintUncheckedCreateWithoutUserInput> | complaintCreateWithoutUserInput[] | complaintUncheckedCreateWithoutUserInput[]
    connectOrCreate?: complaintCreateOrConnectWithoutUserInput | complaintCreateOrConnectWithoutUserInput[]
    upsert?: complaintUpsertWithWhereUniqueWithoutUserInput | complaintUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: complaintCreateManyUserInputEnvelope
    set?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
    disconnect?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
    delete?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
    connect?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
    update?: complaintUpdateWithWhereUniqueWithoutUserInput | complaintUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: complaintUpdateManyWithWhereWithoutUserInput | complaintUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: complaintScalarWhereInput | complaintScalarWhereInput[]
  }

  export type democlassUpdateManyWithoutUserNestedInput = {
    create?: XOR<democlassCreateWithoutUserInput, democlassUncheckedCreateWithoutUserInput> | democlassCreateWithoutUserInput[] | democlassUncheckedCreateWithoutUserInput[]
    connectOrCreate?: democlassCreateOrConnectWithoutUserInput | democlassCreateOrConnectWithoutUserInput[]
    upsert?: democlassUpsertWithWhereUniqueWithoutUserInput | democlassUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: democlassCreateManyUserInputEnvelope
    set?: democlassWhereUniqueInput | democlassWhereUniqueInput[]
    disconnect?: democlassWhereUniqueInput | democlassWhereUniqueInput[]
    delete?: democlassWhereUniqueInput | democlassWhereUniqueInput[]
    connect?: democlassWhereUniqueInput | democlassWhereUniqueInput[]
    update?: democlassUpdateWithWhereUniqueWithoutUserInput | democlassUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: democlassUpdateManyWithWhereWithoutUserInput | democlassUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: democlassScalarWhereInput | democlassScalarWhereInput[]
  }

  export type forumpostUpdateManyWithoutUserNestedInput = {
    create?: XOR<forumpostCreateWithoutUserInput, forumpostUncheckedCreateWithoutUserInput> | forumpostCreateWithoutUserInput[] | forumpostUncheckedCreateWithoutUserInput[]
    connectOrCreate?: forumpostCreateOrConnectWithoutUserInput | forumpostCreateOrConnectWithoutUserInput[]
    upsert?: forumpostUpsertWithWhereUniqueWithoutUserInput | forumpostUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: forumpostCreateManyUserInputEnvelope
    set?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
    disconnect?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
    delete?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
    connect?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
    update?: forumpostUpdateWithWhereUniqueWithoutUserInput | forumpostUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: forumpostUpdateManyWithWhereWithoutUserInput | forumpostUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: forumpostScalarWhereInput | forumpostScalarWhereInput[]
  }

  export type forumthreadUpdateManyWithoutUserNestedInput = {
    create?: XOR<forumthreadCreateWithoutUserInput, forumthreadUncheckedCreateWithoutUserInput> | forumthreadCreateWithoutUserInput[] | forumthreadUncheckedCreateWithoutUserInput[]
    connectOrCreate?: forumthreadCreateOrConnectWithoutUserInput | forumthreadCreateOrConnectWithoutUserInput[]
    upsert?: forumthreadUpsertWithWhereUniqueWithoutUserInput | forumthreadUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: forumthreadCreateManyUserInputEnvelope
    set?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
    disconnect?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
    delete?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
    connect?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
    update?: forumthreadUpdateWithWhereUniqueWithoutUserInput | forumthreadUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: forumthreadUpdateManyWithWhereWithoutUserInput | forumthreadUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: forumthreadScalarWhereInput | forumthreadScalarWhereInput[]
  }

  export type productUpdateManyWithoutUserNestedInput = {
    create?: XOR<productCreateWithoutUserInput, productUncheckedCreateWithoutUserInput> | productCreateWithoutUserInput[] | productUncheckedCreateWithoutUserInput[]
    connectOrCreate?: productCreateOrConnectWithoutUserInput | productCreateOrConnectWithoutUserInput[]
    upsert?: productUpsertWithWhereUniqueWithoutUserInput | productUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: productCreateManyUserInputEnvelope
    set?: productWhereUniqueInput | productWhereUniqueInput[]
    disconnect?: productWhereUniqueInput | productWhereUniqueInput[]
    delete?: productWhereUniqueInput | productWhereUniqueInput[]
    connect?: productWhereUniqueInput | productWhereUniqueInput[]
    update?: productUpdateWithWhereUniqueWithoutUserInput | productUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: productUpdateManyWithWhereWithoutUserInput | productUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: productScalarWhereInput | productScalarWhereInput[]
  }

  export type sessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<sessionCreateWithoutUserInput, sessionUncheckedCreateWithoutUserInput> | sessionCreateWithoutUserInput[] | sessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: sessionCreateOrConnectWithoutUserInput | sessionCreateOrConnectWithoutUserInput[]
    upsert?: sessionUpsertWithWhereUniqueWithoutUserInput | sessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: sessionCreateManyUserInputEnvelope
    set?: sessionWhereUniqueInput | sessionWhereUniqueInput[]
    disconnect?: sessionWhereUniqueInput | sessionWhereUniqueInput[]
    delete?: sessionWhereUniqueInput | sessionWhereUniqueInput[]
    connect?: sessionWhereUniqueInput | sessionWhereUniqueInput[]
    update?: sessionUpdateWithWhereUniqueWithoutUserInput | sessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: sessionUpdateManyWithWhereWithoutUserInput | sessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: sessionScalarWhereInput | sessionScalarWhereInput[]
  }

  export type accountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<accountCreateWithoutUserInput, accountUncheckedCreateWithoutUserInput> | accountCreateWithoutUserInput[] | accountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: accountCreateOrConnectWithoutUserInput | accountCreateOrConnectWithoutUserInput[]
    upsert?: accountUpsertWithWhereUniqueWithoutUserInput | accountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: accountCreateManyUserInputEnvelope
    set?: accountWhereUniqueInput | accountWhereUniqueInput[]
    disconnect?: accountWhereUniqueInput | accountWhereUniqueInput[]
    delete?: accountWhereUniqueInput | accountWhereUniqueInput[]
    connect?: accountWhereUniqueInput | accountWhereUniqueInput[]
    update?: accountUpdateWithWhereUniqueWithoutUserInput | accountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: accountUpdateManyWithWhereWithoutUserInput | accountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: accountScalarWhereInput | accountScalarWhereInput[]
  }

  export type agreementUncheckedUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput = {
    create?: XOR<agreementCreateWithoutUser_agreement_initiatorIdTouserInput, agreementUncheckedCreateWithoutUser_agreement_initiatorIdTouserInput> | agreementCreateWithoutUser_agreement_initiatorIdTouserInput[] | agreementUncheckedCreateWithoutUser_agreement_initiatorIdTouserInput[]
    connectOrCreate?: agreementCreateOrConnectWithoutUser_agreement_initiatorIdTouserInput | agreementCreateOrConnectWithoutUser_agreement_initiatorIdTouserInput[]
    upsert?: agreementUpsertWithWhereUniqueWithoutUser_agreement_initiatorIdTouserInput | agreementUpsertWithWhereUniqueWithoutUser_agreement_initiatorIdTouserInput[]
    createMany?: agreementCreateManyUser_agreement_initiatorIdTouserInputEnvelope
    set?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
    disconnect?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
    delete?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
    connect?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
    update?: agreementUpdateWithWhereUniqueWithoutUser_agreement_initiatorIdTouserInput | agreementUpdateWithWhereUniqueWithoutUser_agreement_initiatorIdTouserInput[]
    updateMany?: agreementUpdateManyWithWhereWithoutUser_agreement_initiatorIdTouserInput | agreementUpdateManyWithWhereWithoutUser_agreement_initiatorIdTouserInput[]
    deleteMany?: agreementScalarWhereInput | agreementScalarWhereInput[]
  }

  export type agreementUncheckedUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput = {
    create?: XOR<agreementCreateWithoutUser_agreement_receiverIdTouserInput, agreementUncheckedCreateWithoutUser_agreement_receiverIdTouserInput> | agreementCreateWithoutUser_agreement_receiverIdTouserInput[] | agreementUncheckedCreateWithoutUser_agreement_receiverIdTouserInput[]
    connectOrCreate?: agreementCreateOrConnectWithoutUser_agreement_receiverIdTouserInput | agreementCreateOrConnectWithoutUser_agreement_receiverIdTouserInput[]
    upsert?: agreementUpsertWithWhereUniqueWithoutUser_agreement_receiverIdTouserInput | agreementUpsertWithWhereUniqueWithoutUser_agreement_receiverIdTouserInput[]
    createMany?: agreementCreateManyUser_agreement_receiverIdTouserInputEnvelope
    set?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
    disconnect?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
    delete?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
    connect?: agreementWhereUniqueInput | agreementWhereUniqueInput[]
    update?: agreementUpdateWithWhereUniqueWithoutUser_agreement_receiverIdTouserInput | agreementUpdateWithWhereUniqueWithoutUser_agreement_receiverIdTouserInput[]
    updateMany?: agreementUpdateManyWithWhereWithoutUser_agreement_receiverIdTouserInput | agreementUpdateManyWithWhereWithoutUser_agreement_receiverIdTouserInput[]
    deleteMany?: agreementScalarWhereInput | agreementScalarWhereInput[]
  }

  export type complaintUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<complaintCreateWithoutUserInput, complaintUncheckedCreateWithoutUserInput> | complaintCreateWithoutUserInput[] | complaintUncheckedCreateWithoutUserInput[]
    connectOrCreate?: complaintCreateOrConnectWithoutUserInput | complaintCreateOrConnectWithoutUserInput[]
    upsert?: complaintUpsertWithWhereUniqueWithoutUserInput | complaintUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: complaintCreateManyUserInputEnvelope
    set?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
    disconnect?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
    delete?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
    connect?: complaintWhereUniqueInput | complaintWhereUniqueInput[]
    update?: complaintUpdateWithWhereUniqueWithoutUserInput | complaintUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: complaintUpdateManyWithWhereWithoutUserInput | complaintUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: complaintScalarWhereInput | complaintScalarWhereInput[]
  }

  export type democlassUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<democlassCreateWithoutUserInput, democlassUncheckedCreateWithoutUserInput> | democlassCreateWithoutUserInput[] | democlassUncheckedCreateWithoutUserInput[]
    connectOrCreate?: democlassCreateOrConnectWithoutUserInput | democlassCreateOrConnectWithoutUserInput[]
    upsert?: democlassUpsertWithWhereUniqueWithoutUserInput | democlassUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: democlassCreateManyUserInputEnvelope
    set?: democlassWhereUniqueInput | democlassWhereUniqueInput[]
    disconnect?: democlassWhereUniqueInput | democlassWhereUniqueInput[]
    delete?: democlassWhereUniqueInput | democlassWhereUniqueInput[]
    connect?: democlassWhereUniqueInput | democlassWhereUniqueInput[]
    update?: democlassUpdateWithWhereUniqueWithoutUserInput | democlassUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: democlassUpdateManyWithWhereWithoutUserInput | democlassUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: democlassScalarWhereInput | democlassScalarWhereInput[]
  }

  export type forumpostUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<forumpostCreateWithoutUserInput, forumpostUncheckedCreateWithoutUserInput> | forumpostCreateWithoutUserInput[] | forumpostUncheckedCreateWithoutUserInput[]
    connectOrCreate?: forumpostCreateOrConnectWithoutUserInput | forumpostCreateOrConnectWithoutUserInput[]
    upsert?: forumpostUpsertWithWhereUniqueWithoutUserInput | forumpostUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: forumpostCreateManyUserInputEnvelope
    set?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
    disconnect?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
    delete?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
    connect?: forumpostWhereUniqueInput | forumpostWhereUniqueInput[]
    update?: forumpostUpdateWithWhereUniqueWithoutUserInput | forumpostUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: forumpostUpdateManyWithWhereWithoutUserInput | forumpostUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: forumpostScalarWhereInput | forumpostScalarWhereInput[]
  }

  export type forumthreadUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<forumthreadCreateWithoutUserInput, forumthreadUncheckedCreateWithoutUserInput> | forumthreadCreateWithoutUserInput[] | forumthreadUncheckedCreateWithoutUserInput[]
    connectOrCreate?: forumthreadCreateOrConnectWithoutUserInput | forumthreadCreateOrConnectWithoutUserInput[]
    upsert?: forumthreadUpsertWithWhereUniqueWithoutUserInput | forumthreadUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: forumthreadCreateManyUserInputEnvelope
    set?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
    disconnect?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
    delete?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
    connect?: forumthreadWhereUniqueInput | forumthreadWhereUniqueInput[]
    update?: forumthreadUpdateWithWhereUniqueWithoutUserInput | forumthreadUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: forumthreadUpdateManyWithWhereWithoutUserInput | forumthreadUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: forumthreadScalarWhereInput | forumthreadScalarWhereInput[]
  }

  export type productUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<productCreateWithoutUserInput, productUncheckedCreateWithoutUserInput> | productCreateWithoutUserInput[] | productUncheckedCreateWithoutUserInput[]
    connectOrCreate?: productCreateOrConnectWithoutUserInput | productCreateOrConnectWithoutUserInput[]
    upsert?: productUpsertWithWhereUniqueWithoutUserInput | productUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: productCreateManyUserInputEnvelope
    set?: productWhereUniqueInput | productWhereUniqueInput[]
    disconnect?: productWhereUniqueInput | productWhereUniqueInput[]
    delete?: productWhereUniqueInput | productWhereUniqueInput[]
    connect?: productWhereUniqueInput | productWhereUniqueInput[]
    update?: productUpdateWithWhereUniqueWithoutUserInput | productUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: productUpdateManyWithWhereWithoutUserInput | productUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: productScalarWhereInput | productScalarWhereInput[]
  }

  export type sessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<sessionCreateWithoutUserInput, sessionUncheckedCreateWithoutUserInput> | sessionCreateWithoutUserInput[] | sessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: sessionCreateOrConnectWithoutUserInput | sessionCreateOrConnectWithoutUserInput[]
    upsert?: sessionUpsertWithWhereUniqueWithoutUserInput | sessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: sessionCreateManyUserInputEnvelope
    set?: sessionWhereUniqueInput | sessionWhereUniqueInput[]
    disconnect?: sessionWhereUniqueInput | sessionWhereUniqueInput[]
    delete?: sessionWhereUniqueInput | sessionWhereUniqueInput[]
    connect?: sessionWhereUniqueInput | sessionWhereUniqueInput[]
    update?: sessionUpdateWithWhereUniqueWithoutUserInput | sessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: sessionUpdateManyWithWhereWithoutUserInput | sessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: sessionScalarWhereInput | sessionScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumagreement_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.agreement_status | Enumagreement_statusFieldRefInput<$PrismaModel>
    in?: $Enums.agreement_status[]
    notIn?: $Enums.agreement_status[]
    not?: NestedEnumagreement_statusFilter<$PrismaModel> | $Enums.agreement_status
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedEnumagreement_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.agreement_status | Enumagreement_statusFieldRefInput<$PrismaModel>
    in?: $Enums.agreement_status[]
    notIn?: $Enums.agreement_status[]
    not?: NestedEnumagreement_statusWithAggregatesFilter<$PrismaModel> | $Enums.agreement_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumagreement_statusFilter<$PrismaModel>
    _max?: NestedEnumagreement_statusFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumdemoclass_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.democlass_status | Enumdemoclass_statusFieldRefInput<$PrismaModel>
    in?: $Enums.democlass_status[]
    notIn?: $Enums.democlass_status[]
    not?: NestedEnumdemoclass_statusFilter<$PrismaModel> | $Enums.democlass_status
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumdemoclass_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.democlass_status | Enumdemoclass_statusFieldRefInput<$PrismaModel>
    in?: $Enums.democlass_status[]
    notIn?: $Enums.democlass_status[]
    not?: NestedEnumdemoclass_statusWithAggregatesFilter<$PrismaModel> | $Enums.democlass_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumdemoclass_statusFilter<$PrismaModel>
    _max?: NestedEnumdemoclass_statusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumuser_roleFilter<$PrismaModel = never> = {
    equals?: $Enums.user_role | Enumuser_roleFieldRefInput<$PrismaModel>
    in?: $Enums.user_role[]
    notIn?: $Enums.user_role[]
    not?: NestedEnumuser_roleFilter<$PrismaModel> | $Enums.user_role
  }

  export type NestedEnumuser_cipponMembershipTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.user_cipponMembershipType | Enumuser_cipponMembershipTypeFieldRefInput<$PrismaModel>
    in?: $Enums.user_cipponMembershipType[]
    notIn?: $Enums.user_cipponMembershipType[]
    not?: NestedEnumuser_cipponMembershipTypeFilter<$PrismaModel> | $Enums.user_cipponMembershipType
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumuser_roleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.user_role | Enumuser_roleFieldRefInput<$PrismaModel>
    in?: $Enums.user_role[]
    notIn?: $Enums.user_role[]
    not?: NestedEnumuser_roleWithAggregatesFilter<$PrismaModel> | $Enums.user_role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumuser_roleFilter<$PrismaModel>
    _max?: NestedEnumuser_roleFilter<$PrismaModel>
  }

  export type NestedEnumuser_cipponMembershipTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.user_cipponMembershipType | Enumuser_cipponMembershipTypeFieldRefInput<$PrismaModel>
    in?: $Enums.user_cipponMembershipType[]
    notIn?: $Enums.user_cipponMembershipType[]
    not?: NestedEnumuser_cipponMembershipTypeWithAggregatesFilter<$PrismaModel> | $Enums.user_cipponMembershipType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumuser_cipponMembershipTypeFilter<$PrismaModel>
    _max?: NestedEnumuser_cipponMembershipTypeFilter<$PrismaModel>
  }

  export type userCreateWithoutAccountInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    agreement_agreement_initiatorIdTouser?: agreementCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    agreement_agreement_receiverIdTouser?: agreementCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    complaint?: complaintCreateNestedManyWithoutUserInput
    democlass?: democlassCreateNestedManyWithoutUserInput
    forumpost?: forumpostCreateNestedManyWithoutUserInput
    forumthread?: forumthreadCreateNestedManyWithoutUserInput
    product?: productCreateNestedManyWithoutUserInput
    session?: sessionCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateWithoutAccountInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    agreement_agreement_initiatorIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    complaint?: complaintUncheckedCreateNestedManyWithoutUserInput
    democlass?: democlassUncheckedCreateNestedManyWithoutUserInput
    forumpost?: forumpostUncheckedCreateNestedManyWithoutUserInput
    forumthread?: forumthreadUncheckedCreateNestedManyWithoutUserInput
    product?: productUncheckedCreateNestedManyWithoutUserInput
    session?: sessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type userCreateOrConnectWithoutAccountInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutAccountInput, userUncheckedCreateWithoutAccountInput>
  }

  export type userUpsertWithoutAccountInput = {
    update: XOR<userUpdateWithoutAccountInput, userUncheckedUpdateWithoutAccountInput>
    create: XOR<userCreateWithoutAccountInput, userUncheckedCreateWithoutAccountInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutAccountInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutAccountInput, userUncheckedUpdateWithoutAccountInput>
  }

  export type userUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agreement_agreement_initiatorIdTouser?: agreementUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    complaint?: complaintUpdateManyWithoutUserNestedInput
    democlass?: democlassUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUpdateManyWithoutUserNestedInput
    product?: productUpdateManyWithoutUserNestedInput
    session?: sessionUpdateManyWithoutUserNestedInput
  }

  export type userUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agreement_agreement_initiatorIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    complaint?: complaintUncheckedUpdateManyWithoutUserNestedInput
    democlass?: democlassUncheckedUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUncheckedUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUncheckedUpdateManyWithoutUserNestedInput
    product?: productUncheckedUpdateManyWithoutUserNestedInput
    session?: sessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type userCreateWithoutAgreement_agreement_initiatorIdTouserInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountCreateNestedManyWithoutUserInput
    agreement_agreement_receiverIdTouser?: agreementCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    complaint?: complaintCreateNestedManyWithoutUserInput
    democlass?: democlassCreateNestedManyWithoutUserInput
    forumpost?: forumpostCreateNestedManyWithoutUserInput
    forumthread?: forumthreadCreateNestedManyWithoutUserInput
    product?: productCreateNestedManyWithoutUserInput
    session?: sessionCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateWithoutAgreement_agreement_initiatorIdTouserInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountUncheckedCreateNestedManyWithoutUserInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    complaint?: complaintUncheckedCreateNestedManyWithoutUserInput
    democlass?: democlassUncheckedCreateNestedManyWithoutUserInput
    forumpost?: forumpostUncheckedCreateNestedManyWithoutUserInput
    forumthread?: forumthreadUncheckedCreateNestedManyWithoutUserInput
    product?: productUncheckedCreateNestedManyWithoutUserInput
    session?: sessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type userCreateOrConnectWithoutAgreement_agreement_initiatorIdTouserInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutAgreement_agreement_initiatorIdTouserInput, userUncheckedCreateWithoutAgreement_agreement_initiatorIdTouserInput>
  }

  export type userCreateWithoutAgreement_agreement_receiverIdTouserInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountCreateNestedManyWithoutUserInput
    agreement_agreement_initiatorIdTouser?: agreementCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    complaint?: complaintCreateNestedManyWithoutUserInput
    democlass?: democlassCreateNestedManyWithoutUserInput
    forumpost?: forumpostCreateNestedManyWithoutUserInput
    forumthread?: forumthreadCreateNestedManyWithoutUserInput
    product?: productCreateNestedManyWithoutUserInput
    session?: sessionCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateWithoutAgreement_agreement_receiverIdTouserInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountUncheckedCreateNestedManyWithoutUserInput
    agreement_agreement_initiatorIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    complaint?: complaintUncheckedCreateNestedManyWithoutUserInput
    democlass?: democlassUncheckedCreateNestedManyWithoutUserInput
    forumpost?: forumpostUncheckedCreateNestedManyWithoutUserInput
    forumthread?: forumthreadUncheckedCreateNestedManyWithoutUserInput
    product?: productUncheckedCreateNestedManyWithoutUserInput
    session?: sessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type userCreateOrConnectWithoutAgreement_agreement_receiverIdTouserInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutAgreement_agreement_receiverIdTouserInput, userUncheckedCreateWithoutAgreement_agreement_receiverIdTouserInput>
  }

  export type complaintCreateWithoutAgreementInput = {
    id: string
    title: string
    description: string
    status?: string
    evidence?: string | null
    resolution?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    user: userCreateNestedOneWithoutComplaintInput
  }

  export type complaintUncheckedCreateWithoutAgreementInput = {
    id: string
    title: string
    description: string
    status?: string
    userId: string
    evidence?: string | null
    resolution?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type complaintCreateOrConnectWithoutAgreementInput = {
    where: complaintWhereUniqueInput
    create: XOR<complaintCreateWithoutAgreementInput, complaintUncheckedCreateWithoutAgreementInput>
  }

  export type complaintCreateManyAgreementInputEnvelope = {
    data: complaintCreateManyAgreementInput | complaintCreateManyAgreementInput[]
    skipDuplicates?: boolean
  }

  export type userUpsertWithoutAgreement_agreement_initiatorIdTouserInput = {
    update: XOR<userUpdateWithoutAgreement_agreement_initiatorIdTouserInput, userUncheckedUpdateWithoutAgreement_agreement_initiatorIdTouserInput>
    create: XOR<userCreateWithoutAgreement_agreement_initiatorIdTouserInput, userUncheckedCreateWithoutAgreement_agreement_initiatorIdTouserInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutAgreement_agreement_initiatorIdTouserInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutAgreement_agreement_initiatorIdTouserInput, userUncheckedUpdateWithoutAgreement_agreement_initiatorIdTouserInput>
  }

  export type userUpdateWithoutAgreement_agreement_initiatorIdTouserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUpdateManyWithoutUserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    complaint?: complaintUpdateManyWithoutUserNestedInput
    democlass?: democlassUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUpdateManyWithoutUserNestedInput
    product?: productUpdateManyWithoutUserNestedInput
    session?: sessionUpdateManyWithoutUserNestedInput
  }

  export type userUncheckedUpdateWithoutAgreement_agreement_initiatorIdTouserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUncheckedUpdateManyWithoutUserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    complaint?: complaintUncheckedUpdateManyWithoutUserNestedInput
    democlass?: democlassUncheckedUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUncheckedUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUncheckedUpdateManyWithoutUserNestedInput
    product?: productUncheckedUpdateManyWithoutUserNestedInput
    session?: sessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type userUpsertWithoutAgreement_agreement_receiverIdTouserInput = {
    update: XOR<userUpdateWithoutAgreement_agreement_receiverIdTouserInput, userUncheckedUpdateWithoutAgreement_agreement_receiverIdTouserInput>
    create: XOR<userCreateWithoutAgreement_agreement_receiverIdTouserInput, userUncheckedCreateWithoutAgreement_agreement_receiverIdTouserInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutAgreement_agreement_receiverIdTouserInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutAgreement_agreement_receiverIdTouserInput, userUncheckedUpdateWithoutAgreement_agreement_receiverIdTouserInput>
  }

  export type userUpdateWithoutAgreement_agreement_receiverIdTouserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUpdateManyWithoutUserNestedInput
    agreement_agreement_initiatorIdTouser?: agreementUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    complaint?: complaintUpdateManyWithoutUserNestedInput
    democlass?: democlassUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUpdateManyWithoutUserNestedInput
    product?: productUpdateManyWithoutUserNestedInput
    session?: sessionUpdateManyWithoutUserNestedInput
  }

  export type userUncheckedUpdateWithoutAgreement_agreement_receiverIdTouserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUncheckedUpdateManyWithoutUserNestedInput
    agreement_agreement_initiatorIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    complaint?: complaintUncheckedUpdateManyWithoutUserNestedInput
    democlass?: democlassUncheckedUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUncheckedUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUncheckedUpdateManyWithoutUserNestedInput
    product?: productUncheckedUpdateManyWithoutUserNestedInput
    session?: sessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type complaintUpsertWithWhereUniqueWithoutAgreementInput = {
    where: complaintWhereUniqueInput
    update: XOR<complaintUpdateWithoutAgreementInput, complaintUncheckedUpdateWithoutAgreementInput>
    create: XOR<complaintCreateWithoutAgreementInput, complaintUncheckedCreateWithoutAgreementInput>
  }

  export type complaintUpdateWithWhereUniqueWithoutAgreementInput = {
    where: complaintWhereUniqueInput
    data: XOR<complaintUpdateWithoutAgreementInput, complaintUncheckedUpdateWithoutAgreementInput>
  }

  export type complaintUpdateManyWithWhereWithoutAgreementInput = {
    where: complaintScalarWhereInput
    data: XOR<complaintUpdateManyMutationInput, complaintUncheckedUpdateManyWithoutAgreementInput>
  }

  export type complaintScalarWhereInput = {
    AND?: complaintScalarWhereInput | complaintScalarWhereInput[]
    OR?: complaintScalarWhereInput[]
    NOT?: complaintScalarWhereInput | complaintScalarWhereInput[]
    id?: StringFilter<"complaint"> | string
    title?: StringFilter<"complaint"> | string
    description?: StringFilter<"complaint"> | string
    status?: StringFilter<"complaint"> | string
    userId?: StringFilter<"complaint"> | string
    agreementId?: StringNullableFilter<"complaint"> | string | null
    evidence?: StringNullableFilter<"complaint"> | string | null
    resolution?: StringNullableFilter<"complaint"> | string | null
    createdAt?: DateTimeFilter<"complaint"> | Date | string
    updatedAt?: DateTimeFilter<"complaint"> | Date | string
  }

  export type agreementCreateWithoutComplaintInput = {
    id: string
    status?: $Enums.agreement_status
    terms: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    user_agreement_initiatorIdTouser: userCreateNestedOneWithoutAgreement_agreement_initiatorIdTouserInput
    user_agreement_receiverIdTouser: userCreateNestedOneWithoutAgreement_agreement_receiverIdTouserInput
  }

  export type agreementUncheckedCreateWithoutComplaintInput = {
    id: string
    initiatorId: string
    receiverId: string
    status?: $Enums.agreement_status
    terms: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type agreementCreateOrConnectWithoutComplaintInput = {
    where: agreementWhereUniqueInput
    create: XOR<agreementCreateWithoutComplaintInput, agreementUncheckedCreateWithoutComplaintInput>
  }

  export type userCreateWithoutComplaintInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountCreateNestedManyWithoutUserInput
    agreement_agreement_initiatorIdTouser?: agreementCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    agreement_agreement_receiverIdTouser?: agreementCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    democlass?: democlassCreateNestedManyWithoutUserInput
    forumpost?: forumpostCreateNestedManyWithoutUserInput
    forumthread?: forumthreadCreateNestedManyWithoutUserInput
    product?: productCreateNestedManyWithoutUserInput
    session?: sessionCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateWithoutComplaintInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountUncheckedCreateNestedManyWithoutUserInput
    agreement_agreement_initiatorIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    democlass?: democlassUncheckedCreateNestedManyWithoutUserInput
    forumpost?: forumpostUncheckedCreateNestedManyWithoutUserInput
    forumthread?: forumthreadUncheckedCreateNestedManyWithoutUserInput
    product?: productUncheckedCreateNestedManyWithoutUserInput
    session?: sessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type userCreateOrConnectWithoutComplaintInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutComplaintInput, userUncheckedCreateWithoutComplaintInput>
  }

  export type agreementUpsertWithoutComplaintInput = {
    update: XOR<agreementUpdateWithoutComplaintInput, agreementUncheckedUpdateWithoutComplaintInput>
    create: XOR<agreementCreateWithoutComplaintInput, agreementUncheckedCreateWithoutComplaintInput>
    where?: agreementWhereInput
  }

  export type agreementUpdateToOneWithWhereWithoutComplaintInput = {
    where?: agreementWhereInput
    data: XOR<agreementUpdateWithoutComplaintInput, agreementUncheckedUpdateWithoutComplaintInput>
  }

  export type agreementUpdateWithoutComplaintInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: Enumagreement_statusFieldUpdateOperationsInput | $Enums.agreement_status
    terms?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user_agreement_initiatorIdTouser?: userUpdateOneRequiredWithoutAgreement_agreement_initiatorIdTouserNestedInput
    user_agreement_receiverIdTouser?: userUpdateOneRequiredWithoutAgreement_agreement_receiverIdTouserNestedInput
  }

  export type agreementUncheckedUpdateWithoutComplaintInput = {
    id?: StringFieldUpdateOperationsInput | string
    initiatorId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: Enumagreement_statusFieldUpdateOperationsInput | $Enums.agreement_status
    terms?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type userUpsertWithoutComplaintInput = {
    update: XOR<userUpdateWithoutComplaintInput, userUncheckedUpdateWithoutComplaintInput>
    create: XOR<userCreateWithoutComplaintInput, userUncheckedCreateWithoutComplaintInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutComplaintInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutComplaintInput, userUncheckedUpdateWithoutComplaintInput>
  }

  export type userUpdateWithoutComplaintInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUpdateManyWithoutUserNestedInput
    agreement_agreement_initiatorIdTouser?: agreementUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    democlass?: democlassUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUpdateManyWithoutUserNestedInput
    product?: productUpdateManyWithoutUserNestedInput
    session?: sessionUpdateManyWithoutUserNestedInput
  }

  export type userUncheckedUpdateWithoutComplaintInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUncheckedUpdateManyWithoutUserNestedInput
    agreement_agreement_initiatorIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    democlass?: democlassUncheckedUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUncheckedUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUncheckedUpdateManyWithoutUserNestedInput
    product?: productUncheckedUpdateManyWithoutUserNestedInput
    session?: sessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type userCreateWithoutDemoclassInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountCreateNestedManyWithoutUserInput
    agreement_agreement_initiatorIdTouser?: agreementCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    agreement_agreement_receiverIdTouser?: agreementCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    complaint?: complaintCreateNestedManyWithoutUserInput
    forumpost?: forumpostCreateNestedManyWithoutUserInput
    forumthread?: forumthreadCreateNestedManyWithoutUserInput
    product?: productCreateNestedManyWithoutUserInput
    session?: sessionCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateWithoutDemoclassInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountUncheckedCreateNestedManyWithoutUserInput
    agreement_agreement_initiatorIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    complaint?: complaintUncheckedCreateNestedManyWithoutUserInput
    forumpost?: forumpostUncheckedCreateNestedManyWithoutUserInput
    forumthread?: forumthreadUncheckedCreateNestedManyWithoutUserInput
    product?: productUncheckedCreateNestedManyWithoutUserInput
    session?: sessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type userCreateOrConnectWithoutDemoclassInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutDemoclassInput, userUncheckedCreateWithoutDemoclassInput>
  }

  export type userUpsertWithoutDemoclassInput = {
    update: XOR<userUpdateWithoutDemoclassInput, userUncheckedUpdateWithoutDemoclassInput>
    create: XOR<userCreateWithoutDemoclassInput, userUncheckedCreateWithoutDemoclassInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutDemoclassInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutDemoclassInput, userUncheckedUpdateWithoutDemoclassInput>
  }

  export type userUpdateWithoutDemoclassInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUpdateManyWithoutUserNestedInput
    agreement_agreement_initiatorIdTouser?: agreementUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    complaint?: complaintUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUpdateManyWithoutUserNestedInput
    product?: productUpdateManyWithoutUserNestedInput
    session?: sessionUpdateManyWithoutUserNestedInput
  }

  export type userUncheckedUpdateWithoutDemoclassInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUncheckedUpdateManyWithoutUserNestedInput
    agreement_agreement_initiatorIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    complaint?: complaintUncheckedUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUncheckedUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUncheckedUpdateManyWithoutUserNestedInput
    product?: productUncheckedUpdateManyWithoutUserNestedInput
    session?: sessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type forumthreadCreateWithoutForumcategoryInput = {
    id: string
    title: string
    content: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
    forumpost?: forumpostCreateNestedManyWithoutForumthreadInput
    user: userCreateNestedOneWithoutForumthreadInput
  }

  export type forumthreadUncheckedCreateWithoutForumcategoryInput = {
    id: string
    title: string
    content: string
    authorId: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
    forumpost?: forumpostUncheckedCreateNestedManyWithoutForumthreadInput
  }

  export type forumthreadCreateOrConnectWithoutForumcategoryInput = {
    where: forumthreadWhereUniqueInput
    create: XOR<forumthreadCreateWithoutForumcategoryInput, forumthreadUncheckedCreateWithoutForumcategoryInput>
  }

  export type forumthreadCreateManyForumcategoryInputEnvelope = {
    data: forumthreadCreateManyForumcategoryInput | forumthreadCreateManyForumcategoryInput[]
    skipDuplicates?: boolean
  }

  export type forumthreadUpsertWithWhereUniqueWithoutForumcategoryInput = {
    where: forumthreadWhereUniqueInput
    update: XOR<forumthreadUpdateWithoutForumcategoryInput, forumthreadUncheckedUpdateWithoutForumcategoryInput>
    create: XOR<forumthreadCreateWithoutForumcategoryInput, forumthreadUncheckedCreateWithoutForumcategoryInput>
  }

  export type forumthreadUpdateWithWhereUniqueWithoutForumcategoryInput = {
    where: forumthreadWhereUniqueInput
    data: XOR<forumthreadUpdateWithoutForumcategoryInput, forumthreadUncheckedUpdateWithoutForumcategoryInput>
  }

  export type forumthreadUpdateManyWithWhereWithoutForumcategoryInput = {
    where: forumthreadScalarWhereInput
    data: XOR<forumthreadUpdateManyMutationInput, forumthreadUncheckedUpdateManyWithoutForumcategoryInput>
  }

  export type forumthreadScalarWhereInput = {
    AND?: forumthreadScalarWhereInput | forumthreadScalarWhereInput[]
    OR?: forumthreadScalarWhereInput[]
    NOT?: forumthreadScalarWhereInput | forumthreadScalarWhereInput[]
    id?: StringFilter<"forumthread"> | string
    title?: StringFilter<"forumthread"> | string
    content?: StringFilter<"forumthread"> | string
    authorId?: StringFilter<"forumthread"> | string
    categoryId?: StringFilter<"forumthread"> | string
    createdAt?: DateTimeFilter<"forumthread"> | Date | string
    updatedAt?: DateTimeFilter<"forumthread"> | Date | string
    likes?: IntFilter<"forumthread"> | number
  }

  export type userCreateWithoutForumpostInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountCreateNestedManyWithoutUserInput
    agreement_agreement_initiatorIdTouser?: agreementCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    agreement_agreement_receiverIdTouser?: agreementCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    complaint?: complaintCreateNestedManyWithoutUserInput
    democlass?: democlassCreateNestedManyWithoutUserInput
    forumthread?: forumthreadCreateNestedManyWithoutUserInput
    product?: productCreateNestedManyWithoutUserInput
    session?: sessionCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateWithoutForumpostInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountUncheckedCreateNestedManyWithoutUserInput
    agreement_agreement_initiatorIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    complaint?: complaintUncheckedCreateNestedManyWithoutUserInput
    democlass?: democlassUncheckedCreateNestedManyWithoutUserInput
    forumthread?: forumthreadUncheckedCreateNestedManyWithoutUserInput
    product?: productUncheckedCreateNestedManyWithoutUserInput
    session?: sessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type userCreateOrConnectWithoutForumpostInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutForumpostInput, userUncheckedCreateWithoutForumpostInput>
  }

  export type forumthreadCreateWithoutForumpostInput = {
    id: string
    title: string
    content: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
    user: userCreateNestedOneWithoutForumthreadInput
    forumcategory: forumcategoryCreateNestedOneWithoutForumthreadInput
  }

  export type forumthreadUncheckedCreateWithoutForumpostInput = {
    id: string
    title: string
    content: string
    authorId: string
    categoryId: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
  }

  export type forumthreadCreateOrConnectWithoutForumpostInput = {
    where: forumthreadWhereUniqueInput
    create: XOR<forumthreadCreateWithoutForumpostInput, forumthreadUncheckedCreateWithoutForumpostInput>
  }

  export type userUpsertWithoutForumpostInput = {
    update: XOR<userUpdateWithoutForumpostInput, userUncheckedUpdateWithoutForumpostInput>
    create: XOR<userCreateWithoutForumpostInput, userUncheckedCreateWithoutForumpostInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutForumpostInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutForumpostInput, userUncheckedUpdateWithoutForumpostInput>
  }

  export type userUpdateWithoutForumpostInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUpdateManyWithoutUserNestedInput
    agreement_agreement_initiatorIdTouser?: agreementUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    complaint?: complaintUpdateManyWithoutUserNestedInput
    democlass?: democlassUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUpdateManyWithoutUserNestedInput
    product?: productUpdateManyWithoutUserNestedInput
    session?: sessionUpdateManyWithoutUserNestedInput
  }

  export type userUncheckedUpdateWithoutForumpostInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUncheckedUpdateManyWithoutUserNestedInput
    agreement_agreement_initiatorIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    complaint?: complaintUncheckedUpdateManyWithoutUserNestedInput
    democlass?: democlassUncheckedUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUncheckedUpdateManyWithoutUserNestedInput
    product?: productUncheckedUpdateManyWithoutUserNestedInput
    session?: sessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type forumthreadUpsertWithoutForumpostInput = {
    update: XOR<forumthreadUpdateWithoutForumpostInput, forumthreadUncheckedUpdateWithoutForumpostInput>
    create: XOR<forumthreadCreateWithoutForumpostInput, forumthreadUncheckedCreateWithoutForumpostInput>
    where?: forumthreadWhereInput
  }

  export type forumthreadUpdateToOneWithWhereWithoutForumpostInput = {
    where?: forumthreadWhereInput
    data: XOR<forumthreadUpdateWithoutForumpostInput, forumthreadUncheckedUpdateWithoutForumpostInput>
  }

  export type forumthreadUpdateWithoutForumpostInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
    user?: userUpdateOneRequiredWithoutForumthreadNestedInput
    forumcategory?: forumcategoryUpdateOneRequiredWithoutForumthreadNestedInput
  }

  export type forumthreadUncheckedUpdateWithoutForumpostInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
  }

  export type forumpostCreateWithoutForumthreadInput = {
    id: string
    content: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
    user: userCreateNestedOneWithoutForumpostInput
  }

  export type forumpostUncheckedCreateWithoutForumthreadInput = {
    id: string
    content: string
    authorId: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
  }

  export type forumpostCreateOrConnectWithoutForumthreadInput = {
    where: forumpostWhereUniqueInput
    create: XOR<forumpostCreateWithoutForumthreadInput, forumpostUncheckedCreateWithoutForumthreadInput>
  }

  export type forumpostCreateManyForumthreadInputEnvelope = {
    data: forumpostCreateManyForumthreadInput | forumpostCreateManyForumthreadInput[]
    skipDuplicates?: boolean
  }

  export type userCreateWithoutForumthreadInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountCreateNestedManyWithoutUserInput
    agreement_agreement_initiatorIdTouser?: agreementCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    agreement_agreement_receiverIdTouser?: agreementCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    complaint?: complaintCreateNestedManyWithoutUserInput
    democlass?: democlassCreateNestedManyWithoutUserInput
    forumpost?: forumpostCreateNestedManyWithoutUserInput
    product?: productCreateNestedManyWithoutUserInput
    session?: sessionCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateWithoutForumthreadInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountUncheckedCreateNestedManyWithoutUserInput
    agreement_agreement_initiatorIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    complaint?: complaintUncheckedCreateNestedManyWithoutUserInput
    democlass?: democlassUncheckedCreateNestedManyWithoutUserInput
    forumpost?: forumpostUncheckedCreateNestedManyWithoutUserInput
    product?: productUncheckedCreateNestedManyWithoutUserInput
    session?: sessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type userCreateOrConnectWithoutForumthreadInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutForumthreadInput, userUncheckedCreateWithoutForumthreadInput>
  }

  export type forumcategoryCreateWithoutForumthreadInput = {
    id: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type forumcategoryUncheckedCreateWithoutForumthreadInput = {
    id: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type forumcategoryCreateOrConnectWithoutForumthreadInput = {
    where: forumcategoryWhereUniqueInput
    create: XOR<forumcategoryCreateWithoutForumthreadInput, forumcategoryUncheckedCreateWithoutForumthreadInput>
  }

  export type forumpostUpsertWithWhereUniqueWithoutForumthreadInput = {
    where: forumpostWhereUniqueInput
    update: XOR<forumpostUpdateWithoutForumthreadInput, forumpostUncheckedUpdateWithoutForumthreadInput>
    create: XOR<forumpostCreateWithoutForumthreadInput, forumpostUncheckedCreateWithoutForumthreadInput>
  }

  export type forumpostUpdateWithWhereUniqueWithoutForumthreadInput = {
    where: forumpostWhereUniqueInput
    data: XOR<forumpostUpdateWithoutForumthreadInput, forumpostUncheckedUpdateWithoutForumthreadInput>
  }

  export type forumpostUpdateManyWithWhereWithoutForumthreadInput = {
    where: forumpostScalarWhereInput
    data: XOR<forumpostUpdateManyMutationInput, forumpostUncheckedUpdateManyWithoutForumthreadInput>
  }

  export type forumpostScalarWhereInput = {
    AND?: forumpostScalarWhereInput | forumpostScalarWhereInput[]
    OR?: forumpostScalarWhereInput[]
    NOT?: forumpostScalarWhereInput | forumpostScalarWhereInput[]
    id?: StringFilter<"forumpost"> | string
    content?: StringFilter<"forumpost"> | string
    authorId?: StringFilter<"forumpost"> | string
    threadId?: StringFilter<"forumpost"> | string
    createdAt?: DateTimeFilter<"forumpost"> | Date | string
    updatedAt?: DateTimeFilter<"forumpost"> | Date | string
    likes?: IntFilter<"forumpost"> | number
  }

  export type userUpsertWithoutForumthreadInput = {
    update: XOR<userUpdateWithoutForumthreadInput, userUncheckedUpdateWithoutForumthreadInput>
    create: XOR<userCreateWithoutForumthreadInput, userUncheckedCreateWithoutForumthreadInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutForumthreadInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutForumthreadInput, userUncheckedUpdateWithoutForumthreadInput>
  }

  export type userUpdateWithoutForumthreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUpdateManyWithoutUserNestedInput
    agreement_agreement_initiatorIdTouser?: agreementUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    complaint?: complaintUpdateManyWithoutUserNestedInput
    democlass?: democlassUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUpdateManyWithoutUserNestedInput
    product?: productUpdateManyWithoutUserNestedInput
    session?: sessionUpdateManyWithoutUserNestedInput
  }

  export type userUncheckedUpdateWithoutForumthreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUncheckedUpdateManyWithoutUserNestedInput
    agreement_agreement_initiatorIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    complaint?: complaintUncheckedUpdateManyWithoutUserNestedInput
    democlass?: democlassUncheckedUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUncheckedUpdateManyWithoutUserNestedInput
    product?: productUncheckedUpdateManyWithoutUserNestedInput
    session?: sessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type forumcategoryUpsertWithoutForumthreadInput = {
    update: XOR<forumcategoryUpdateWithoutForumthreadInput, forumcategoryUncheckedUpdateWithoutForumthreadInput>
    create: XOR<forumcategoryCreateWithoutForumthreadInput, forumcategoryUncheckedCreateWithoutForumthreadInput>
    where?: forumcategoryWhereInput
  }

  export type forumcategoryUpdateToOneWithWhereWithoutForumthreadInput = {
    where?: forumcategoryWhereInput
    data: XOR<forumcategoryUpdateWithoutForumthreadInput, forumcategoryUncheckedUpdateWithoutForumthreadInput>
  }

  export type forumcategoryUpdateWithoutForumthreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type forumcategoryUncheckedUpdateWithoutForumthreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type userCreateWithoutProductInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountCreateNestedManyWithoutUserInput
    agreement_agreement_initiatorIdTouser?: agreementCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    agreement_agreement_receiverIdTouser?: agreementCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    complaint?: complaintCreateNestedManyWithoutUserInput
    democlass?: democlassCreateNestedManyWithoutUserInput
    forumpost?: forumpostCreateNestedManyWithoutUserInput
    forumthread?: forumthreadCreateNestedManyWithoutUserInput
    session?: sessionCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateWithoutProductInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountUncheckedCreateNestedManyWithoutUserInput
    agreement_agreement_initiatorIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    complaint?: complaintUncheckedCreateNestedManyWithoutUserInput
    democlass?: democlassUncheckedCreateNestedManyWithoutUserInput
    forumpost?: forumpostUncheckedCreateNestedManyWithoutUserInput
    forumthread?: forumthreadUncheckedCreateNestedManyWithoutUserInput
    session?: sessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type userCreateOrConnectWithoutProductInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutProductInput, userUncheckedCreateWithoutProductInput>
  }

  export type userUpsertWithoutProductInput = {
    update: XOR<userUpdateWithoutProductInput, userUncheckedUpdateWithoutProductInput>
    create: XOR<userCreateWithoutProductInput, userUncheckedCreateWithoutProductInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutProductInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutProductInput, userUncheckedUpdateWithoutProductInput>
  }

  export type userUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUpdateManyWithoutUserNestedInput
    agreement_agreement_initiatorIdTouser?: agreementUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    complaint?: complaintUpdateManyWithoutUserNestedInput
    democlass?: democlassUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUpdateManyWithoutUserNestedInput
    session?: sessionUpdateManyWithoutUserNestedInput
  }

  export type userUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUncheckedUpdateManyWithoutUserNestedInput
    agreement_agreement_initiatorIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    complaint?: complaintUncheckedUpdateManyWithoutUserNestedInput
    democlass?: democlassUncheckedUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUncheckedUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUncheckedUpdateManyWithoutUserNestedInput
    session?: sessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type userCreateWithoutSessionInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountCreateNestedManyWithoutUserInput
    agreement_agreement_initiatorIdTouser?: agreementCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    agreement_agreement_receiverIdTouser?: agreementCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    complaint?: complaintCreateNestedManyWithoutUserInput
    democlass?: democlassCreateNestedManyWithoutUserInput
    forumpost?: forumpostCreateNestedManyWithoutUserInput
    forumthread?: forumthreadCreateNestedManyWithoutUserInput
    product?: productCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateWithoutSessionInput = {
    id: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    password?: string | null
    image?: string | null
    role?: $Enums.user_role
    isVerified?: boolean
    hasCipponMembership?: boolean
    cipponMembershipType?: $Enums.user_cipponMembershipType
    cipponId?: string | null
    companyName?: string | null
    phone?: string | null
    location?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    account?: accountUncheckedCreateNestedManyWithoutUserInput
    agreement_agreement_initiatorIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_initiatorIdTouserInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedCreateNestedManyWithoutUser_agreement_receiverIdTouserInput
    complaint?: complaintUncheckedCreateNestedManyWithoutUserInput
    democlass?: democlassUncheckedCreateNestedManyWithoutUserInput
    forumpost?: forumpostUncheckedCreateNestedManyWithoutUserInput
    forumthread?: forumthreadUncheckedCreateNestedManyWithoutUserInput
    product?: productUncheckedCreateNestedManyWithoutUserInput
  }

  export type userCreateOrConnectWithoutSessionInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutSessionInput, userUncheckedCreateWithoutSessionInput>
  }

  export type userUpsertWithoutSessionInput = {
    update: XOR<userUpdateWithoutSessionInput, userUncheckedUpdateWithoutSessionInput>
    create: XOR<userCreateWithoutSessionInput, userUncheckedCreateWithoutSessionInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutSessionInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutSessionInput, userUncheckedUpdateWithoutSessionInput>
  }

  export type userUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUpdateManyWithoutUserNestedInput
    agreement_agreement_initiatorIdTouser?: agreementUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    complaint?: complaintUpdateManyWithoutUserNestedInput
    democlass?: democlassUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUpdateManyWithoutUserNestedInput
    product?: productUpdateManyWithoutUserNestedInput
  }

  export type userUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    hasCipponMembership?: BoolFieldUpdateOperationsInput | boolean
    cipponMembershipType?: Enumuser_cipponMembershipTypeFieldUpdateOperationsInput | $Enums.user_cipponMembershipType
    cipponId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUncheckedUpdateManyWithoutUserNestedInput
    agreement_agreement_initiatorIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_initiatorIdTouserNestedInput
    agreement_agreement_receiverIdTouser?: agreementUncheckedUpdateManyWithoutUser_agreement_receiverIdTouserNestedInput
    complaint?: complaintUncheckedUpdateManyWithoutUserNestedInput
    democlass?: democlassUncheckedUpdateManyWithoutUserNestedInput
    forumpost?: forumpostUncheckedUpdateManyWithoutUserNestedInput
    forumthread?: forumthreadUncheckedUpdateManyWithoutUserNestedInput
    product?: productUncheckedUpdateManyWithoutUserNestedInput
  }

  export type accountCreateWithoutUserInput = {
    id: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type accountUncheckedCreateWithoutUserInput = {
    id: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type accountCreateOrConnectWithoutUserInput = {
    where: accountWhereUniqueInput
    create: XOR<accountCreateWithoutUserInput, accountUncheckedCreateWithoutUserInput>
  }

  export type accountCreateManyUserInputEnvelope = {
    data: accountCreateManyUserInput | accountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type agreementCreateWithoutUser_agreement_initiatorIdTouserInput = {
    id: string
    status?: $Enums.agreement_status
    terms: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    user_agreement_receiverIdTouser: userCreateNestedOneWithoutAgreement_agreement_receiverIdTouserInput
    complaint?: complaintCreateNestedManyWithoutAgreementInput
  }

  export type agreementUncheckedCreateWithoutUser_agreement_initiatorIdTouserInput = {
    id: string
    receiverId: string
    status?: $Enums.agreement_status
    terms: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    complaint?: complaintUncheckedCreateNestedManyWithoutAgreementInput
  }

  export type agreementCreateOrConnectWithoutUser_agreement_initiatorIdTouserInput = {
    where: agreementWhereUniqueInput
    create: XOR<agreementCreateWithoutUser_agreement_initiatorIdTouserInput, agreementUncheckedCreateWithoutUser_agreement_initiatorIdTouserInput>
  }

  export type agreementCreateManyUser_agreement_initiatorIdTouserInputEnvelope = {
    data: agreementCreateManyUser_agreement_initiatorIdTouserInput | agreementCreateManyUser_agreement_initiatorIdTouserInput[]
    skipDuplicates?: boolean
  }

  export type agreementCreateWithoutUser_agreement_receiverIdTouserInput = {
    id: string
    status?: $Enums.agreement_status
    terms: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    user_agreement_initiatorIdTouser: userCreateNestedOneWithoutAgreement_agreement_initiatorIdTouserInput
    complaint?: complaintCreateNestedManyWithoutAgreementInput
  }

  export type agreementUncheckedCreateWithoutUser_agreement_receiverIdTouserInput = {
    id: string
    initiatorId: string
    status?: $Enums.agreement_status
    terms: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    complaint?: complaintUncheckedCreateNestedManyWithoutAgreementInput
  }

  export type agreementCreateOrConnectWithoutUser_agreement_receiverIdTouserInput = {
    where: agreementWhereUniqueInput
    create: XOR<agreementCreateWithoutUser_agreement_receiverIdTouserInput, agreementUncheckedCreateWithoutUser_agreement_receiverIdTouserInput>
  }

  export type agreementCreateManyUser_agreement_receiverIdTouserInputEnvelope = {
    data: agreementCreateManyUser_agreement_receiverIdTouserInput | agreementCreateManyUser_agreement_receiverIdTouserInput[]
    skipDuplicates?: boolean
  }

  export type complaintCreateWithoutUserInput = {
    id: string
    title: string
    description: string
    status?: string
    evidence?: string | null
    resolution?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    agreement?: agreementCreateNestedOneWithoutComplaintInput
  }

  export type complaintUncheckedCreateWithoutUserInput = {
    id: string
    title: string
    description: string
    status?: string
    agreementId?: string | null
    evidence?: string | null
    resolution?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type complaintCreateOrConnectWithoutUserInput = {
    where: complaintWhereUniqueInput
    create: XOR<complaintCreateWithoutUserInput, complaintUncheckedCreateWithoutUserInput>
  }

  export type complaintCreateManyUserInputEnvelope = {
    data: complaintCreateManyUserInput | complaintCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type democlassCreateWithoutUserInput = {
    id: string
    title: string
    description: string
    videoUrl?: string | null
    schedule: Date | string
    price: number
    isPaid?: boolean
    status?: $Enums.democlass_status
    category: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type democlassUncheckedCreateWithoutUserInput = {
    id: string
    title: string
    description: string
    videoUrl?: string | null
    schedule: Date | string
    price: number
    isPaid?: boolean
    status?: $Enums.democlass_status
    category: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type democlassCreateOrConnectWithoutUserInput = {
    where: democlassWhereUniqueInput
    create: XOR<democlassCreateWithoutUserInput, democlassUncheckedCreateWithoutUserInput>
  }

  export type democlassCreateManyUserInputEnvelope = {
    data: democlassCreateManyUserInput | democlassCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type forumpostCreateWithoutUserInput = {
    id: string
    content: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
    forumthread: forumthreadCreateNestedOneWithoutForumpostInput
  }

  export type forumpostUncheckedCreateWithoutUserInput = {
    id: string
    content: string
    threadId: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
  }

  export type forumpostCreateOrConnectWithoutUserInput = {
    where: forumpostWhereUniqueInput
    create: XOR<forumpostCreateWithoutUserInput, forumpostUncheckedCreateWithoutUserInput>
  }

  export type forumpostCreateManyUserInputEnvelope = {
    data: forumpostCreateManyUserInput | forumpostCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type forumthreadCreateWithoutUserInput = {
    id: string
    title: string
    content: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
    forumpost?: forumpostCreateNestedManyWithoutForumthreadInput
    forumcategory: forumcategoryCreateNestedOneWithoutForumthreadInput
  }

  export type forumthreadUncheckedCreateWithoutUserInput = {
    id: string
    title: string
    content: string
    categoryId: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
    forumpost?: forumpostUncheckedCreateNestedManyWithoutForumthreadInput
  }

  export type forumthreadCreateOrConnectWithoutUserInput = {
    where: forumthreadWhereUniqueInput
    create: XOR<forumthreadCreateWithoutUserInput, forumthreadUncheckedCreateWithoutUserInput>
  }

  export type forumthreadCreateManyUserInputEnvelope = {
    data: forumthreadCreateManyUserInput | forumthreadCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type productCreateWithoutUserInput = {
    id: string
    title: string
    description: string
    category: string
    images: string
    contactInfo?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type productUncheckedCreateWithoutUserInput = {
    id: string
    title: string
    description: string
    category: string
    images: string
    contactInfo?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type productCreateOrConnectWithoutUserInput = {
    where: productWhereUniqueInput
    create: XOR<productCreateWithoutUserInput, productUncheckedCreateWithoutUserInput>
  }

  export type productCreateManyUserInputEnvelope = {
    data: productCreateManyUserInput | productCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type sessionCreateWithoutUserInput = {
    id: string
    sessionToken: string
    expires: Date | string
  }

  export type sessionUncheckedCreateWithoutUserInput = {
    id: string
    sessionToken: string
    expires: Date | string
  }

  export type sessionCreateOrConnectWithoutUserInput = {
    where: sessionWhereUniqueInput
    create: XOR<sessionCreateWithoutUserInput, sessionUncheckedCreateWithoutUserInput>
  }

  export type sessionCreateManyUserInputEnvelope = {
    data: sessionCreateManyUserInput | sessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type accountUpsertWithWhereUniqueWithoutUserInput = {
    where: accountWhereUniqueInput
    update: XOR<accountUpdateWithoutUserInput, accountUncheckedUpdateWithoutUserInput>
    create: XOR<accountCreateWithoutUserInput, accountUncheckedCreateWithoutUserInput>
  }

  export type accountUpdateWithWhereUniqueWithoutUserInput = {
    where: accountWhereUniqueInput
    data: XOR<accountUpdateWithoutUserInput, accountUncheckedUpdateWithoutUserInput>
  }

  export type accountUpdateManyWithWhereWithoutUserInput = {
    where: accountScalarWhereInput
    data: XOR<accountUpdateManyMutationInput, accountUncheckedUpdateManyWithoutUserInput>
  }

  export type accountScalarWhereInput = {
    AND?: accountScalarWhereInput | accountScalarWhereInput[]
    OR?: accountScalarWhereInput[]
    NOT?: accountScalarWhereInput | accountScalarWhereInput[]
    id?: StringFilter<"account"> | string
    userId?: StringFilter<"account"> | string
    type?: StringFilter<"account"> | string
    provider?: StringFilter<"account"> | string
    providerAccountId?: StringFilter<"account"> | string
    refresh_token?: StringNullableFilter<"account"> | string | null
    access_token?: StringNullableFilter<"account"> | string | null
    expires_at?: IntNullableFilter<"account"> | number | null
    token_type?: StringNullableFilter<"account"> | string | null
    scope?: StringNullableFilter<"account"> | string | null
    id_token?: StringNullableFilter<"account"> | string | null
    session_state?: StringNullableFilter<"account"> | string | null
  }

  export type agreementUpsertWithWhereUniqueWithoutUser_agreement_initiatorIdTouserInput = {
    where: agreementWhereUniqueInput
    update: XOR<agreementUpdateWithoutUser_agreement_initiatorIdTouserInput, agreementUncheckedUpdateWithoutUser_agreement_initiatorIdTouserInput>
    create: XOR<agreementCreateWithoutUser_agreement_initiatorIdTouserInput, agreementUncheckedCreateWithoutUser_agreement_initiatorIdTouserInput>
  }

  export type agreementUpdateWithWhereUniqueWithoutUser_agreement_initiatorIdTouserInput = {
    where: agreementWhereUniqueInput
    data: XOR<agreementUpdateWithoutUser_agreement_initiatorIdTouserInput, agreementUncheckedUpdateWithoutUser_agreement_initiatorIdTouserInput>
  }

  export type agreementUpdateManyWithWhereWithoutUser_agreement_initiatorIdTouserInput = {
    where: agreementScalarWhereInput
    data: XOR<agreementUpdateManyMutationInput, agreementUncheckedUpdateManyWithoutUser_agreement_initiatorIdTouserInput>
  }

  export type agreementScalarWhereInput = {
    AND?: agreementScalarWhereInput | agreementScalarWhereInput[]
    OR?: agreementScalarWhereInput[]
    NOT?: agreementScalarWhereInput | agreementScalarWhereInput[]
    id?: StringFilter<"agreement"> | string
    initiatorId?: StringFilter<"agreement"> | string
    receiverId?: StringFilter<"agreement"> | string
    status?: Enumagreement_statusFilter<"agreement"> | $Enums.agreement_status
    terms?: StringFilter<"agreement"> | string
    notes?: StringNullableFilter<"agreement"> | string | null
    createdAt?: DateTimeFilter<"agreement"> | Date | string
    updatedAt?: DateTimeFilter<"agreement"> | Date | string
  }

  export type agreementUpsertWithWhereUniqueWithoutUser_agreement_receiverIdTouserInput = {
    where: agreementWhereUniqueInput
    update: XOR<agreementUpdateWithoutUser_agreement_receiverIdTouserInput, agreementUncheckedUpdateWithoutUser_agreement_receiverIdTouserInput>
    create: XOR<agreementCreateWithoutUser_agreement_receiverIdTouserInput, agreementUncheckedCreateWithoutUser_agreement_receiverIdTouserInput>
  }

  export type agreementUpdateWithWhereUniqueWithoutUser_agreement_receiverIdTouserInput = {
    where: agreementWhereUniqueInput
    data: XOR<agreementUpdateWithoutUser_agreement_receiverIdTouserInput, agreementUncheckedUpdateWithoutUser_agreement_receiverIdTouserInput>
  }

  export type agreementUpdateManyWithWhereWithoutUser_agreement_receiverIdTouserInput = {
    where: agreementScalarWhereInput
    data: XOR<agreementUpdateManyMutationInput, agreementUncheckedUpdateManyWithoutUser_agreement_receiverIdTouserInput>
  }

  export type complaintUpsertWithWhereUniqueWithoutUserInput = {
    where: complaintWhereUniqueInput
    update: XOR<complaintUpdateWithoutUserInput, complaintUncheckedUpdateWithoutUserInput>
    create: XOR<complaintCreateWithoutUserInput, complaintUncheckedCreateWithoutUserInput>
  }

  export type complaintUpdateWithWhereUniqueWithoutUserInput = {
    where: complaintWhereUniqueInput
    data: XOR<complaintUpdateWithoutUserInput, complaintUncheckedUpdateWithoutUserInput>
  }

  export type complaintUpdateManyWithWhereWithoutUserInput = {
    where: complaintScalarWhereInput
    data: XOR<complaintUpdateManyMutationInput, complaintUncheckedUpdateManyWithoutUserInput>
  }

  export type democlassUpsertWithWhereUniqueWithoutUserInput = {
    where: democlassWhereUniqueInput
    update: XOR<democlassUpdateWithoutUserInput, democlassUncheckedUpdateWithoutUserInput>
    create: XOR<democlassCreateWithoutUserInput, democlassUncheckedCreateWithoutUserInput>
  }

  export type democlassUpdateWithWhereUniqueWithoutUserInput = {
    where: democlassWhereUniqueInput
    data: XOR<democlassUpdateWithoutUserInput, democlassUncheckedUpdateWithoutUserInput>
  }

  export type democlassUpdateManyWithWhereWithoutUserInput = {
    where: democlassScalarWhereInput
    data: XOR<democlassUpdateManyMutationInput, democlassUncheckedUpdateManyWithoutUserInput>
  }

  export type democlassScalarWhereInput = {
    AND?: democlassScalarWhereInput | democlassScalarWhereInput[]
    OR?: democlassScalarWhereInput[]
    NOT?: democlassScalarWhereInput | democlassScalarWhereInput[]
    id?: StringFilter<"democlass"> | string
    title?: StringFilter<"democlass"> | string
    description?: StringFilter<"democlass"> | string
    videoUrl?: StringNullableFilter<"democlass"> | string | null
    schedule?: DateTimeFilter<"democlass"> | Date | string
    price?: FloatFilter<"democlass"> | number
    isPaid?: BoolFilter<"democlass"> | boolean
    status?: Enumdemoclass_statusFilter<"democlass"> | $Enums.democlass_status
    manufacturerId?: StringFilter<"democlass"> | string
    category?: StringFilter<"democlass"> | string
    createdAt?: DateTimeFilter<"democlass"> | Date | string
    updatedAt?: DateTimeFilter<"democlass"> | Date | string
  }

  export type forumpostUpsertWithWhereUniqueWithoutUserInput = {
    where: forumpostWhereUniqueInput
    update: XOR<forumpostUpdateWithoutUserInput, forumpostUncheckedUpdateWithoutUserInput>
    create: XOR<forumpostCreateWithoutUserInput, forumpostUncheckedCreateWithoutUserInput>
  }

  export type forumpostUpdateWithWhereUniqueWithoutUserInput = {
    where: forumpostWhereUniqueInput
    data: XOR<forumpostUpdateWithoutUserInput, forumpostUncheckedUpdateWithoutUserInput>
  }

  export type forumpostUpdateManyWithWhereWithoutUserInput = {
    where: forumpostScalarWhereInput
    data: XOR<forumpostUpdateManyMutationInput, forumpostUncheckedUpdateManyWithoutUserInput>
  }

  export type forumthreadUpsertWithWhereUniqueWithoutUserInput = {
    where: forumthreadWhereUniqueInput
    update: XOR<forumthreadUpdateWithoutUserInput, forumthreadUncheckedUpdateWithoutUserInput>
    create: XOR<forumthreadCreateWithoutUserInput, forumthreadUncheckedCreateWithoutUserInput>
  }

  export type forumthreadUpdateWithWhereUniqueWithoutUserInput = {
    where: forumthreadWhereUniqueInput
    data: XOR<forumthreadUpdateWithoutUserInput, forumthreadUncheckedUpdateWithoutUserInput>
  }

  export type forumthreadUpdateManyWithWhereWithoutUserInput = {
    where: forumthreadScalarWhereInput
    data: XOR<forumthreadUpdateManyMutationInput, forumthreadUncheckedUpdateManyWithoutUserInput>
  }

  export type productUpsertWithWhereUniqueWithoutUserInput = {
    where: productWhereUniqueInput
    update: XOR<productUpdateWithoutUserInput, productUncheckedUpdateWithoutUserInput>
    create: XOR<productCreateWithoutUserInput, productUncheckedCreateWithoutUserInput>
  }

  export type productUpdateWithWhereUniqueWithoutUserInput = {
    where: productWhereUniqueInput
    data: XOR<productUpdateWithoutUserInput, productUncheckedUpdateWithoutUserInput>
  }

  export type productUpdateManyWithWhereWithoutUserInput = {
    where: productScalarWhereInput
    data: XOR<productUpdateManyMutationInput, productUncheckedUpdateManyWithoutUserInput>
  }

  export type productScalarWhereInput = {
    AND?: productScalarWhereInput | productScalarWhereInput[]
    OR?: productScalarWhereInput[]
    NOT?: productScalarWhereInput | productScalarWhereInput[]
    id?: StringFilter<"product"> | string
    title?: StringFilter<"product"> | string
    description?: StringFilter<"product"> | string
    category?: StringFilter<"product"> | string
    images?: StringFilter<"product"> | string
    contactInfo?: StringNullableFilter<"product"> | string | null
    ownerId?: StringFilter<"product"> | string
    createdAt?: DateTimeFilter<"product"> | Date | string
    updatedAt?: DateTimeFilter<"product"> | Date | string
  }

  export type sessionUpsertWithWhereUniqueWithoutUserInput = {
    where: sessionWhereUniqueInput
    update: XOR<sessionUpdateWithoutUserInput, sessionUncheckedUpdateWithoutUserInput>
    create: XOR<sessionCreateWithoutUserInput, sessionUncheckedCreateWithoutUserInput>
  }

  export type sessionUpdateWithWhereUniqueWithoutUserInput = {
    where: sessionWhereUniqueInput
    data: XOR<sessionUpdateWithoutUserInput, sessionUncheckedUpdateWithoutUserInput>
  }

  export type sessionUpdateManyWithWhereWithoutUserInput = {
    where: sessionScalarWhereInput
    data: XOR<sessionUpdateManyMutationInput, sessionUncheckedUpdateManyWithoutUserInput>
  }

  export type sessionScalarWhereInput = {
    AND?: sessionScalarWhereInput | sessionScalarWhereInput[]
    OR?: sessionScalarWhereInput[]
    NOT?: sessionScalarWhereInput | sessionScalarWhereInput[]
    id?: StringFilter<"session"> | string
    sessionToken?: StringFilter<"session"> | string
    userId?: StringFilter<"session"> | string
    expires?: DateTimeFilter<"session"> | Date | string
  }

  export type complaintCreateManyAgreementInput = {
    id: string
    title: string
    description: string
    status?: string
    userId: string
    evidence?: string | null
    resolution?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type complaintUpdateWithoutAgreementInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    evidence?: NullableStringFieldUpdateOperationsInput | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: userUpdateOneRequiredWithoutComplaintNestedInput
  }

  export type complaintUncheckedUpdateWithoutAgreementInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    evidence?: NullableStringFieldUpdateOperationsInput | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type complaintUncheckedUpdateManyWithoutAgreementInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    evidence?: NullableStringFieldUpdateOperationsInput | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type forumthreadCreateManyForumcategoryInput = {
    id: string
    title: string
    content: string
    authorId: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
  }

  export type forumthreadUpdateWithoutForumcategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
    forumpost?: forumpostUpdateManyWithoutForumthreadNestedInput
    user?: userUpdateOneRequiredWithoutForumthreadNestedInput
  }

  export type forumthreadUncheckedUpdateWithoutForumcategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
    forumpost?: forumpostUncheckedUpdateManyWithoutForumthreadNestedInput
  }

  export type forumthreadUncheckedUpdateManyWithoutForumcategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
  }

  export type forumpostCreateManyForumthreadInput = {
    id: string
    content: string
    authorId: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
  }

  export type forumpostUpdateWithoutForumthreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
    user?: userUpdateOneRequiredWithoutForumpostNestedInput
  }

  export type forumpostUncheckedUpdateWithoutForumthreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
  }

  export type forumpostUncheckedUpdateManyWithoutForumthreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
  }

  export type accountCreateManyUserInput = {
    id: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type agreementCreateManyUser_agreement_initiatorIdTouserInput = {
    id: string
    receiverId: string
    status?: $Enums.agreement_status
    terms: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type agreementCreateManyUser_agreement_receiverIdTouserInput = {
    id: string
    initiatorId: string
    status?: $Enums.agreement_status
    terms: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type complaintCreateManyUserInput = {
    id: string
    title: string
    description: string
    status?: string
    agreementId?: string | null
    evidence?: string | null
    resolution?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type democlassCreateManyUserInput = {
    id: string
    title: string
    description: string
    videoUrl?: string | null
    schedule: Date | string
    price: number
    isPaid?: boolean
    status?: $Enums.democlass_status
    category: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type forumpostCreateManyUserInput = {
    id: string
    content: string
    threadId: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
  }

  export type forumthreadCreateManyUserInput = {
    id: string
    title: string
    content: string
    categoryId: string
    createdAt?: Date | string
    updatedAt: Date | string
    likes?: number
  }

  export type productCreateManyUserInput = {
    id: string
    title: string
    description: string
    category: string
    images: string
    contactInfo?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type sessionCreateManyUserInput = {
    id: string
    sessionToken: string
    expires: Date | string
  }

  export type accountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type accountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type accountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type agreementUpdateWithoutUser_agreement_initiatorIdTouserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: Enumagreement_statusFieldUpdateOperationsInput | $Enums.agreement_status
    terms?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user_agreement_receiverIdTouser?: userUpdateOneRequiredWithoutAgreement_agreement_receiverIdTouserNestedInput
    complaint?: complaintUpdateManyWithoutAgreementNestedInput
  }

  export type agreementUncheckedUpdateWithoutUser_agreement_initiatorIdTouserInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: Enumagreement_statusFieldUpdateOperationsInput | $Enums.agreement_status
    terms?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    complaint?: complaintUncheckedUpdateManyWithoutAgreementNestedInput
  }

  export type agreementUncheckedUpdateManyWithoutUser_agreement_initiatorIdTouserInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: Enumagreement_statusFieldUpdateOperationsInput | $Enums.agreement_status
    terms?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type agreementUpdateWithoutUser_agreement_receiverIdTouserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: Enumagreement_statusFieldUpdateOperationsInput | $Enums.agreement_status
    terms?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user_agreement_initiatorIdTouser?: userUpdateOneRequiredWithoutAgreement_agreement_initiatorIdTouserNestedInput
    complaint?: complaintUpdateManyWithoutAgreementNestedInput
  }

  export type agreementUncheckedUpdateWithoutUser_agreement_receiverIdTouserInput = {
    id?: StringFieldUpdateOperationsInput | string
    initiatorId?: StringFieldUpdateOperationsInput | string
    status?: Enumagreement_statusFieldUpdateOperationsInput | $Enums.agreement_status
    terms?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    complaint?: complaintUncheckedUpdateManyWithoutAgreementNestedInput
  }

  export type agreementUncheckedUpdateManyWithoutUser_agreement_receiverIdTouserInput = {
    id?: StringFieldUpdateOperationsInput | string
    initiatorId?: StringFieldUpdateOperationsInput | string
    status?: Enumagreement_statusFieldUpdateOperationsInput | $Enums.agreement_status
    terms?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type complaintUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    evidence?: NullableStringFieldUpdateOperationsInput | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agreement?: agreementUpdateOneWithoutComplaintNestedInput
  }

  export type complaintUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    agreementId?: NullableStringFieldUpdateOperationsInput | string | null
    evidence?: NullableStringFieldUpdateOperationsInput | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type complaintUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    agreementId?: NullableStringFieldUpdateOperationsInput | string | null
    evidence?: NullableStringFieldUpdateOperationsInput | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type democlassUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: DateTimeFieldUpdateOperationsInput | Date | string
    price?: FloatFieldUpdateOperationsInput | number
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    status?: Enumdemoclass_statusFieldUpdateOperationsInput | $Enums.democlass_status
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type democlassUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: DateTimeFieldUpdateOperationsInput | Date | string
    price?: FloatFieldUpdateOperationsInput | number
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    status?: Enumdemoclass_statusFieldUpdateOperationsInput | $Enums.democlass_status
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type democlassUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    schedule?: DateTimeFieldUpdateOperationsInput | Date | string
    price?: FloatFieldUpdateOperationsInput | number
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    status?: Enumdemoclass_statusFieldUpdateOperationsInput | $Enums.democlass_status
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type forumpostUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
    forumthread?: forumthreadUpdateOneRequiredWithoutForumpostNestedInput
  }

  export type forumpostUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
  }

  export type forumpostUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
  }

  export type forumthreadUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
    forumpost?: forumpostUpdateManyWithoutForumthreadNestedInput
    forumcategory?: forumcategoryUpdateOneRequiredWithoutForumthreadNestedInput
  }

  export type forumthreadUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
    forumpost?: forumpostUncheckedUpdateManyWithoutForumthreadNestedInput
  }

  export type forumthreadUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: IntFieldUpdateOperationsInput | number
  }

  export type productUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    images?: StringFieldUpdateOperationsInput | string
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type productUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    images?: StringFieldUpdateOperationsInput | string
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type productUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    images?: StringFieldUpdateOperationsInput | string
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}