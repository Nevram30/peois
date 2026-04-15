
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
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model UserSession
 * 
 */
export type UserSession = $Result.DefaultSelection<Prisma.$UserSessionPayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model ProjectActivity
 * 
 */
export type ProjectActivity = $Result.DefaultSelection<Prisma.$ProjectActivityPayload>
/**
 * Model Disbursement
 * 
 */
export type Disbursement = $Result.DefaultSelection<Prisma.$DisbursementPayload>
/**
 * Model TaskNotification
 * 
 */
export type TaskNotification = $Result.DefaultSelection<Prisma.$TaskNotificationPayload>
/**
 * Model TaskReply
 * 
 */
export type TaskReply = $Result.DefaultSelection<Prisma.$TaskReplyPayload>
/**
 * Model TaskReplyDocument
 * 
 */
export type TaskReplyDocument = $Result.DefaultSelection<Prisma.$TaskReplyDocumentPayload>
/**
 * Model Document
 * 
 */
export type Document = $Result.DefaultSelection<Prisma.$DocumentPayload>
/**
 * Model ProjectFile
 * 
 */
export type ProjectFile = $Result.DefaultSelection<Prisma.$ProjectFilePayload>
/**
 * Model Post
 * 
 */
export type Post = $Result.DefaultSelection<Prisma.$PostPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const UserStatus: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING'
};

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]


export const Sex: {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
};

export type Sex = (typeof Sex)[keyof typeof Sex]


export const ModeOfImplementation: {
  BY_ADMINISTRATION: 'BY_ADMINISTRATION',
  BY_CONTRACT: 'BY_CONTRACT'
};

export type ModeOfImplementation = (typeof ModeOfImplementation)[keyof typeof ModeOfImplementation]


export const SourceOfFund: {
  GENERAL_FUND: 'GENERAL_FUND',
  SEF: 'SEF',
  TRUST_FUND: 'TRUST_FUND',
  TWENTY_PERCENT_DEV_FUND: 'TWENTY_PERCENT_DEV_FUND',
  AID: 'AID',
  LOAN: 'LOAN',
  OTHERS: 'OTHERS'
};

export type SourceOfFund = (typeof SourceOfFund)[keyof typeof SourceOfFund]


export const District: {
  DISTRICT_I: 'DISTRICT_I',
  DISTRICT_II: 'DISTRICT_II'
};

export type District = (typeof District)[keyof typeof District]


export const ProjectSubType: {
  WATER_SYSTEMS: 'WATER_SYSTEMS',
  GOVERNMENT_BUILDINGS: 'GOVERNMENT_BUILDINGS',
  ELECTRIFICATION: 'ELECTRIFICATION',
  RESPONSE_CAMP_MGMT: 'RESPONSE_CAMP_MGMT',
  SUPPLEMENTAL_BUDGET_2: 'SUPPLEMENTAL_BUDGET_2',
  PARK_AND_DEVELOPMENT: 'PARK_AND_DEVELOPMENT',
  DOH: 'DOH',
  PROVINCIAL_GOVT_OFFICE: 'PROVINCIAL_GOVT_OFFICE'
};

export type ProjectSubType = (typeof ProjectSubType)[keyof typeof ProjectSubType]


export const NotificationPriority: {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

export type NotificationPriority = (typeof NotificationPriority)[keyof typeof NotificationPriority]


export const ProjectStatus: {
  NOT_YET_STARTED: 'NOT_YET_STARTED',
  ON_GOING: 'ON_GOING',
  COMPLETED: 'COMPLETED',
  SUSPENDED: 'SUSPENDED'
};

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus]


export const DocumentType: {
  POW: 'POW',
  PURCHASE_REQUEST: 'PURCHASE_REQUEST'
};

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType]


export const ProjectFileType: {
  IMAGE: 'IMAGE',
  BLUEPRINT: 'BLUEPRINT',
  REPORT: 'REPORT',
  CONTRACT: 'CONTRACT',
  PERMIT: 'PERMIT',
  OTHER: 'OTHER'
};

export type ProjectFileType = (typeof ProjectFileType)[keyof typeof ProjectFileType]


export const DocumentStatus: {
  DRAFT: 'DRAFT',
  FOR_REVIEW: 'FOR_REVIEW',
  REVISION: 'REVISION',
  RELEASED: 'RELEASED'
};

export type DocumentStatus = (typeof DocumentStatus)[keyof typeof DocumentStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type UserStatus = $Enums.UserStatus

export const UserStatus: typeof $Enums.UserStatus

export type Sex = $Enums.Sex

export const Sex: typeof $Enums.Sex

export type ModeOfImplementation = $Enums.ModeOfImplementation

export const ModeOfImplementation: typeof $Enums.ModeOfImplementation

export type SourceOfFund = $Enums.SourceOfFund

export const SourceOfFund: typeof $Enums.SourceOfFund

export type District = $Enums.District

export const District: typeof $Enums.District

export type ProjectSubType = $Enums.ProjectSubType

export const ProjectSubType: typeof $Enums.ProjectSubType

export type NotificationPriority = $Enums.NotificationPriority

export const NotificationPriority: typeof $Enums.NotificationPriority

export type ProjectStatus = $Enums.ProjectStatus

export const ProjectStatus: typeof $Enums.ProjectStatus

export type DocumentType = $Enums.DocumentType

export const DocumentType: typeof $Enums.DocumentType

export type ProjectFileType = $Enums.ProjectFileType

export const ProjectFileType: typeof $Enums.ProjectFileType

export type DocumentStatus = $Enums.DocumentStatus

export const DocumentStatus: typeof $Enums.DocumentStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
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
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userSession`: Exposes CRUD operations for the **UserSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserSessions
    * const userSessions = await prisma.userSession.findMany()
    * ```
    */
  get userSession(): Prisma.UserSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projectActivity`: Exposes CRUD operations for the **ProjectActivity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectActivities
    * const projectActivities = await prisma.projectActivity.findMany()
    * ```
    */
  get projectActivity(): Prisma.ProjectActivityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.disbursement`: Exposes CRUD operations for the **Disbursement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Disbursements
    * const disbursements = await prisma.disbursement.findMany()
    * ```
    */
  get disbursement(): Prisma.DisbursementDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.taskNotification`: Exposes CRUD operations for the **TaskNotification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TaskNotifications
    * const taskNotifications = await prisma.taskNotification.findMany()
    * ```
    */
  get taskNotification(): Prisma.TaskNotificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.taskReply`: Exposes CRUD operations for the **TaskReply** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TaskReplies
    * const taskReplies = await prisma.taskReply.findMany()
    * ```
    */
  get taskReply(): Prisma.TaskReplyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.taskReplyDocument`: Exposes CRUD operations for the **TaskReplyDocument** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TaskReplyDocuments
    * const taskReplyDocuments = await prisma.taskReplyDocument.findMany()
    * ```
    */
  get taskReplyDocument(): Prisma.TaskReplyDocumentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.document`: Exposes CRUD operations for the **Document** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Documents
    * const documents = await prisma.document.findMany()
    * ```
    */
  get document(): Prisma.DocumentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projectFile`: Exposes CRUD operations for the **ProjectFile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectFiles
    * const projectFiles = await prisma.projectFile.findMany()
    * ```
    */
  get projectFile(): Prisma.ProjectFileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.post`: Exposes CRUD operations for the **Post** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Posts
    * const posts = await prisma.post.findMany()
    * ```
    */
  get post(): Prisma.PostDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
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
    User: 'User',
    UserSession: 'UserSession',
    Project: 'Project',
    ProjectActivity: 'ProjectActivity',
    Disbursement: 'Disbursement',
    TaskNotification: 'TaskNotification',
    TaskReply: 'TaskReply',
    TaskReplyDocument: 'TaskReplyDocument',
    Document: 'Document',
    ProjectFile: 'ProjectFile',
    Post: 'Post'
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
      modelProps: "user" | "userSession" | "project" | "projectActivity" | "disbursement" | "taskNotification" | "taskReply" | "taskReplyDocument" | "document" | "projectFile" | "post"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      UserSession: {
        payload: Prisma.$UserSessionPayload<ExtArgs>
        fields: Prisma.UserSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          findFirst: {
            args: Prisma.UserSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          findMany: {
            args: Prisma.UserSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          create: {
            args: Prisma.UserSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          createMany: {
            args: Prisma.UserSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          delete: {
            args: Prisma.UserSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          update: {
            args: Prisma.UserSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          deleteMany: {
            args: Prisma.UserSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          upsert: {
            args: Prisma.UserSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          aggregate: {
            args: Prisma.UserSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserSession>
          }
          groupBy: {
            args: Prisma.UserSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserSessionCountArgs<ExtArgs>
            result: $Utils.Optional<UserSessionCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      ProjectActivity: {
        payload: Prisma.$ProjectActivityPayload<ExtArgs>
        fields: Prisma.ProjectActivityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectActivityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectActivityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectActivityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectActivityPayload>
          }
          findFirst: {
            args: Prisma.ProjectActivityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectActivityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectActivityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectActivityPayload>
          }
          findMany: {
            args: Prisma.ProjectActivityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectActivityPayload>[]
          }
          create: {
            args: Prisma.ProjectActivityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectActivityPayload>
          }
          createMany: {
            args: Prisma.ProjectActivityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectActivityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectActivityPayload>[]
          }
          delete: {
            args: Prisma.ProjectActivityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectActivityPayload>
          }
          update: {
            args: Prisma.ProjectActivityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectActivityPayload>
          }
          deleteMany: {
            args: Prisma.ProjectActivityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectActivityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectActivityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectActivityPayload>[]
          }
          upsert: {
            args: Prisma.ProjectActivityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectActivityPayload>
          }
          aggregate: {
            args: Prisma.ProjectActivityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectActivity>
          }
          groupBy: {
            args: Prisma.ProjectActivityGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectActivityGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectActivityCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectActivityCountAggregateOutputType> | number
          }
        }
      }
      Disbursement: {
        payload: Prisma.$DisbursementPayload<ExtArgs>
        fields: Prisma.DisbursementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DisbursementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisbursementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DisbursementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisbursementPayload>
          }
          findFirst: {
            args: Prisma.DisbursementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisbursementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DisbursementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisbursementPayload>
          }
          findMany: {
            args: Prisma.DisbursementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisbursementPayload>[]
          }
          create: {
            args: Prisma.DisbursementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisbursementPayload>
          }
          createMany: {
            args: Prisma.DisbursementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DisbursementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisbursementPayload>[]
          }
          delete: {
            args: Prisma.DisbursementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisbursementPayload>
          }
          update: {
            args: Prisma.DisbursementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisbursementPayload>
          }
          deleteMany: {
            args: Prisma.DisbursementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DisbursementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DisbursementUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisbursementPayload>[]
          }
          upsert: {
            args: Prisma.DisbursementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisbursementPayload>
          }
          aggregate: {
            args: Prisma.DisbursementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDisbursement>
          }
          groupBy: {
            args: Prisma.DisbursementGroupByArgs<ExtArgs>
            result: $Utils.Optional<DisbursementGroupByOutputType>[]
          }
          count: {
            args: Prisma.DisbursementCountArgs<ExtArgs>
            result: $Utils.Optional<DisbursementCountAggregateOutputType> | number
          }
        }
      }
      TaskNotification: {
        payload: Prisma.$TaskNotificationPayload<ExtArgs>
        fields: Prisma.TaskNotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskNotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskNotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskNotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskNotificationPayload>
          }
          findFirst: {
            args: Prisma.TaskNotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskNotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskNotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskNotificationPayload>
          }
          findMany: {
            args: Prisma.TaskNotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskNotificationPayload>[]
          }
          create: {
            args: Prisma.TaskNotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskNotificationPayload>
          }
          createMany: {
            args: Prisma.TaskNotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskNotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskNotificationPayload>[]
          }
          delete: {
            args: Prisma.TaskNotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskNotificationPayload>
          }
          update: {
            args: Prisma.TaskNotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskNotificationPayload>
          }
          deleteMany: {
            args: Prisma.TaskNotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskNotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TaskNotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskNotificationPayload>[]
          }
          upsert: {
            args: Prisma.TaskNotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskNotificationPayload>
          }
          aggregate: {
            args: Prisma.TaskNotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTaskNotification>
          }
          groupBy: {
            args: Prisma.TaskNotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskNotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskNotificationCountArgs<ExtArgs>
            result: $Utils.Optional<TaskNotificationCountAggregateOutputType> | number
          }
        }
      }
      TaskReply: {
        payload: Prisma.$TaskReplyPayload<ExtArgs>
        fields: Prisma.TaskReplyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskReplyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskReplyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyPayload>
          }
          findFirst: {
            args: Prisma.TaskReplyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskReplyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyPayload>
          }
          findMany: {
            args: Prisma.TaskReplyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyPayload>[]
          }
          create: {
            args: Prisma.TaskReplyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyPayload>
          }
          createMany: {
            args: Prisma.TaskReplyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskReplyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyPayload>[]
          }
          delete: {
            args: Prisma.TaskReplyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyPayload>
          }
          update: {
            args: Prisma.TaskReplyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyPayload>
          }
          deleteMany: {
            args: Prisma.TaskReplyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskReplyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TaskReplyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyPayload>[]
          }
          upsert: {
            args: Prisma.TaskReplyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyPayload>
          }
          aggregate: {
            args: Prisma.TaskReplyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTaskReply>
          }
          groupBy: {
            args: Prisma.TaskReplyGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskReplyGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskReplyCountArgs<ExtArgs>
            result: $Utils.Optional<TaskReplyCountAggregateOutputType> | number
          }
        }
      }
      TaskReplyDocument: {
        payload: Prisma.$TaskReplyDocumentPayload<ExtArgs>
        fields: Prisma.TaskReplyDocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskReplyDocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyDocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskReplyDocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyDocumentPayload>
          }
          findFirst: {
            args: Prisma.TaskReplyDocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyDocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskReplyDocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyDocumentPayload>
          }
          findMany: {
            args: Prisma.TaskReplyDocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyDocumentPayload>[]
          }
          create: {
            args: Prisma.TaskReplyDocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyDocumentPayload>
          }
          createMany: {
            args: Prisma.TaskReplyDocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskReplyDocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyDocumentPayload>[]
          }
          delete: {
            args: Prisma.TaskReplyDocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyDocumentPayload>
          }
          update: {
            args: Prisma.TaskReplyDocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyDocumentPayload>
          }
          deleteMany: {
            args: Prisma.TaskReplyDocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskReplyDocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TaskReplyDocumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyDocumentPayload>[]
          }
          upsert: {
            args: Prisma.TaskReplyDocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskReplyDocumentPayload>
          }
          aggregate: {
            args: Prisma.TaskReplyDocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTaskReplyDocument>
          }
          groupBy: {
            args: Prisma.TaskReplyDocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskReplyDocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskReplyDocumentCountArgs<ExtArgs>
            result: $Utils.Optional<TaskReplyDocumentCountAggregateOutputType> | number
          }
        }
      }
      Document: {
        payload: Prisma.$DocumentPayload<ExtArgs>
        fields: Prisma.DocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findFirst: {
            args: Prisma.DocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findMany: {
            args: Prisma.DocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          create: {
            args: Prisma.DocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          createMany: {
            args: Prisma.DocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          delete: {
            args: Prisma.DocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          update: {
            args: Prisma.DocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          deleteMany: {
            args: Prisma.DocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DocumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          upsert: {
            args: Prisma.DocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          aggregate: {
            args: Prisma.DocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocument>
          }
          groupBy: {
            args: Prisma.DocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentCountAggregateOutputType> | number
          }
        }
      }
      ProjectFile: {
        payload: Prisma.$ProjectFilePayload<ExtArgs>
        fields: Prisma.ProjectFileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          findFirst: {
            args: Prisma.ProjectFileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          findMany: {
            args: Prisma.ProjectFileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[]
          }
          create: {
            args: Prisma.ProjectFileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          createMany: {
            args: Prisma.ProjectFileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectFileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[]
          }
          delete: {
            args: Prisma.ProjectFileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          update: {
            args: Prisma.ProjectFileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          deleteMany: {
            args: Prisma.ProjectFileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectFileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectFileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[]
          }
          upsert: {
            args: Prisma.ProjectFileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          aggregate: {
            args: Prisma.ProjectFileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectFile>
          }
          groupBy: {
            args: Prisma.ProjectFileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectFileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectFileCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectFileCountAggregateOutputType> | number
          }
        }
      }
      Post: {
        payload: Prisma.$PostPayload<ExtArgs>
        fields: Prisma.PostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findFirst: {
            args: Prisma.PostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findMany: {
            args: Prisma.PostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          create: {
            args: Prisma.PostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          createMany: {
            args: Prisma.PostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          delete: {
            args: Prisma.PostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          update: {
            args: Prisma.PostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          deleteMany: {
            args: Prisma.PostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PostUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          upsert: {
            args: Prisma.PostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          aggregate: {
            args: Prisma.PostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePost>
          }
          groupBy: {
            args: Prisma.PostGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostGroupByOutputType>[]
          }
          count: {
            args: Prisma.PostCountArgs<ExtArgs>
            result: $Utils.Optional<PostCountAggregateOutputType> | number
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
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
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
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
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
    user?: UserOmit
    userSession?: UserSessionOmit
    project?: ProjectOmit
    projectActivity?: ProjectActivityOmit
    disbursement?: DisbursementOmit
    taskNotification?: TaskNotificationOmit
    taskReply?: TaskReplyOmit
    taskReplyDocument?: TaskReplyDocumentOmit
    document?: DocumentOmit
    projectFile?: ProjectFileOmit
    post?: PostOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    posts: number
    projects: number
    sessions: number
    documents: number
    projectActivities: number
    disbursements: number
    taskNotificationsReceived: number
    taskNotificationsCreated: number
    taskReplies: number
    projectFiles: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    posts?: boolean | UserCountOutputTypeCountPostsArgs
    projects?: boolean | UserCountOutputTypeCountProjectsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    documents?: boolean | UserCountOutputTypeCountDocumentsArgs
    projectActivities?: boolean | UserCountOutputTypeCountProjectActivitiesArgs
    disbursements?: boolean | UserCountOutputTypeCountDisbursementsArgs
    taskNotificationsReceived?: boolean | UserCountOutputTypeCountTaskNotificationsReceivedArgs
    taskNotificationsCreated?: boolean | UserCountOutputTypeCountTaskNotificationsCreatedArgs
    taskReplies?: boolean | UserCountOutputTypeCountTaskRepliesArgs
    projectFiles?: boolean | UserCountOutputTypeCountProjectFilesArgs
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
  export type UserCountOutputTypeCountPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProjectActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectActivityWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDisbursementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DisbursementWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTaskNotificationsReceivedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskNotificationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTaskNotificationsCreatedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskNotificationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTaskRepliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskReplyWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProjectFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectFileWhereInput
  }


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    activities: number
    disbursements: number
    taskNotifications: number
    files: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    activities?: boolean | ProjectCountOutputTypeCountActivitiesArgs
    disbursements?: boolean | ProjectCountOutputTypeCountDisbursementsArgs
    taskNotifications?: boolean | ProjectCountOutputTypeCountTaskNotificationsArgs
    files?: boolean | ProjectCountOutputTypeCountFilesArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectActivityWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountDisbursementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DisbursementWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountTaskNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskNotificationWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectFileWhereInput
  }


  /**
   * Count Type TaskNotificationCountOutputType
   */

  export type TaskNotificationCountOutputType = {
    replies: number
  }

  export type TaskNotificationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    replies?: boolean | TaskNotificationCountOutputTypeCountRepliesArgs
  }

  // Custom InputTypes
  /**
   * TaskNotificationCountOutputType without action
   */
  export type TaskNotificationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskNotificationCountOutputType
     */
    select?: TaskNotificationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TaskNotificationCountOutputType without action
   */
  export type TaskNotificationCountOutputTypeCountRepliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskReplyWhereInput
  }


  /**
   * Count Type TaskReplyCountOutputType
   */

  export type TaskReplyCountOutputType = {
    documents: number
  }

  export type TaskReplyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    documents?: boolean | TaskReplyCountOutputTypeCountDocumentsArgs
  }

  // Custom InputTypes
  /**
   * TaskReplyCountOutputType without action
   */
  export type TaskReplyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReplyCountOutputType
     */
    select?: TaskReplyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TaskReplyCountOutputType without action
   */
  export type TaskReplyCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskReplyDocumentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
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
    password: string | null
    role: $Enums.UserRole | null
    employeeId: string | null
    designation: string | null
    division: string | null
    sex: $Enums.Sex | null
    status: $Enums.UserStatus | null
    emailVerified: Date | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.UserRole | null
    employeeId: string | null
    designation: string | null
    division: string | null
    sex: $Enums.Sex | null
    status: $Enums.UserStatus | null
    emailVerified: Date | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    employeeId: number
    designation: number
    division: number
    sex: number
    status: number
    emailVerified: number
    image: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    employeeId?: true
    designation?: true
    division?: true
    sex?: true
    status?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    employeeId?: true
    designation?: true
    division?: true
    sex?: true
    status?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    employeeId?: true
    designation?: true
    division?: true
    sex?: true
    status?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
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




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string | null
    email: string
    password: string
    role: $Enums.UserRole
    employeeId: string | null
    designation: string | null
    division: string | null
    sex: $Enums.Sex | null
    status: $Enums.UserStatus
    emailVerified: Date | null
    image: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
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


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    employeeId?: boolean
    designation?: boolean
    division?: boolean
    sex?: boolean
    status?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    posts?: boolean | User$postsArgs<ExtArgs>
    projects?: boolean | User$projectsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    documents?: boolean | User$documentsArgs<ExtArgs>
    projectActivities?: boolean | User$projectActivitiesArgs<ExtArgs>
    disbursements?: boolean | User$disbursementsArgs<ExtArgs>
    taskNotificationsReceived?: boolean | User$taskNotificationsReceivedArgs<ExtArgs>
    taskNotificationsCreated?: boolean | User$taskNotificationsCreatedArgs<ExtArgs>
    taskReplies?: boolean | User$taskRepliesArgs<ExtArgs>
    projectFiles?: boolean | User$projectFilesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    employeeId?: boolean
    designation?: boolean
    division?: boolean
    sex?: boolean
    status?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    employeeId?: boolean
    designation?: boolean
    division?: boolean
    sex?: boolean
    status?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    employeeId?: boolean
    designation?: boolean
    division?: boolean
    sex?: boolean
    status?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "role" | "employeeId" | "designation" | "division" | "sex" | "status" | "emailVerified" | "image" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    posts?: boolean | User$postsArgs<ExtArgs>
    projects?: boolean | User$projectsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    documents?: boolean | User$documentsArgs<ExtArgs>
    projectActivities?: boolean | User$projectActivitiesArgs<ExtArgs>
    disbursements?: boolean | User$disbursementsArgs<ExtArgs>
    taskNotificationsReceived?: boolean | User$taskNotificationsReceivedArgs<ExtArgs>
    taskNotificationsCreated?: boolean | User$taskNotificationsCreatedArgs<ExtArgs>
    taskReplies?: boolean | User$taskRepliesArgs<ExtArgs>
    projectFiles?: boolean | User$projectFilesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      posts: Prisma.$PostPayload<ExtArgs>[]
      projects: Prisma.$ProjectPayload<ExtArgs>[]
      sessions: Prisma.$UserSessionPayload<ExtArgs>[]
      documents: Prisma.$DocumentPayload<ExtArgs>[]
      projectActivities: Prisma.$ProjectActivityPayload<ExtArgs>[]
      disbursements: Prisma.$DisbursementPayload<ExtArgs>[]
      taskNotificationsReceived: Prisma.$TaskNotificationPayload<ExtArgs>[]
      taskNotificationsCreated: Prisma.$TaskNotificationPayload<ExtArgs>[]
      taskReplies: Prisma.$TaskReplyPayload<ExtArgs>[]
      projectFiles: Prisma.$ProjectFilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string
      password: string
      role: $Enums.UserRole
      employeeId: string | null
      designation: string | null
      division: string | null
      sex: $Enums.Sex | null
      status: $Enums.UserStatus
      emailVerified: Date | null
      image: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
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
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
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
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
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
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
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
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
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
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    posts<T extends User$postsArgs<ExtArgs> = {}>(args?: Subset<T, User$postsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    projects<T extends User$projectsArgs<ExtArgs> = {}>(args?: Subset<T, User$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    documents<T extends User$documentsArgs<ExtArgs> = {}>(args?: Subset<T, User$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    projectActivities<T extends User$projectActivitiesArgs<ExtArgs> = {}>(args?: Subset<T, User$projectActivitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    disbursements<T extends User$disbursementsArgs<ExtArgs> = {}>(args?: Subset<T, User$disbursementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DisbursementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    taskNotificationsReceived<T extends User$taskNotificationsReceivedArgs<ExtArgs> = {}>(args?: Subset<T, User$taskNotificationsReceivedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskNotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    taskNotificationsCreated<T extends User$taskNotificationsCreatedArgs<ExtArgs> = {}>(args?: Subset<T, User$taskNotificationsCreatedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskNotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    taskReplies<T extends User$taskRepliesArgs<ExtArgs> = {}>(args?: Subset<T, User$taskRepliesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskReplyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    projectFiles<T extends User$projectFilesArgs<ExtArgs> = {}>(args?: Subset<T, User$projectFilesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly employeeId: FieldRef<"User", 'String'>
    readonly designation: FieldRef<"User", 'String'>
    readonly division: FieldRef<"User", 'String'>
    readonly sex: FieldRef<"User", 'Sex'>
    readonly status: FieldRef<"User", 'UserStatus'>
    readonly emailVerified: FieldRef<"User", 'DateTime'>
    readonly image: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.posts
   */
  export type User$postsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * User.projects
   */
  export type User$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    where?: UserSessionWhereInput
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    cursor?: UserSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * User.documents
   */
  export type User$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    cursor?: DocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * User.projectActivities
   */
  export type User$projectActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectActivity
     */
    select?: ProjectActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectActivity
     */
    omit?: ProjectActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectActivityInclude<ExtArgs> | null
    where?: ProjectActivityWhereInput
    orderBy?: ProjectActivityOrderByWithRelationInput | ProjectActivityOrderByWithRelationInput[]
    cursor?: ProjectActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectActivityScalarFieldEnum | ProjectActivityScalarFieldEnum[]
  }

  /**
   * User.disbursements
   */
  export type User$disbursementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disbursement
     */
    select?: DisbursementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disbursement
     */
    omit?: DisbursementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisbursementInclude<ExtArgs> | null
    where?: DisbursementWhereInput
    orderBy?: DisbursementOrderByWithRelationInput | DisbursementOrderByWithRelationInput[]
    cursor?: DisbursementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DisbursementScalarFieldEnum | DisbursementScalarFieldEnum[]
  }

  /**
   * User.taskNotificationsReceived
   */
  export type User$taskNotificationsReceivedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskNotification
     */
    select?: TaskNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskNotification
     */
    omit?: TaskNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskNotificationInclude<ExtArgs> | null
    where?: TaskNotificationWhereInput
    orderBy?: TaskNotificationOrderByWithRelationInput | TaskNotificationOrderByWithRelationInput[]
    cursor?: TaskNotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskNotificationScalarFieldEnum | TaskNotificationScalarFieldEnum[]
  }

  /**
   * User.taskNotificationsCreated
   */
  export type User$taskNotificationsCreatedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskNotification
     */
    select?: TaskNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskNotification
     */
    omit?: TaskNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskNotificationInclude<ExtArgs> | null
    where?: TaskNotificationWhereInput
    orderBy?: TaskNotificationOrderByWithRelationInput | TaskNotificationOrderByWithRelationInput[]
    cursor?: TaskNotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskNotificationScalarFieldEnum | TaskNotificationScalarFieldEnum[]
  }

  /**
   * User.taskReplies
   */
  export type User$taskRepliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReply
     */
    select?: TaskReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReply
     */
    omit?: TaskReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyInclude<ExtArgs> | null
    where?: TaskReplyWhereInput
    orderBy?: TaskReplyOrderByWithRelationInput | TaskReplyOrderByWithRelationInput[]
    cursor?: TaskReplyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskReplyScalarFieldEnum | TaskReplyScalarFieldEnum[]
  }

  /**
   * User.projectFiles
   */
  export type User$projectFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    where?: ProjectFileWhereInput
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    cursor?: ProjectFileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model UserSession
   */

  export type AggregateUserSession = {
    _count: UserSessionCountAggregateOutputType | null
    _min: UserSessionMinAggregateOutputType | null
    _max: UserSessionMaxAggregateOutputType | null
  }

  export type UserSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
    expiresAt: Date | null
    lastActive: Date | null
  }

  export type UserSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
    expiresAt: Date | null
    lastActive: Date | null
  }

  export type UserSessionCountAggregateOutputType = {
    id: number
    userId: number
    ipAddress: number
    userAgent: number
    createdAt: number
    expiresAt: number
    lastActive: number
    _all: number
  }


  export type UserSessionMinAggregateInputType = {
    id?: true
    userId?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    expiresAt?: true
    lastActive?: true
  }

  export type UserSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    expiresAt?: true
    lastActive?: true
  }

  export type UserSessionCountAggregateInputType = {
    id?: true
    userId?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    expiresAt?: true
    lastActive?: true
    _all?: true
  }

  export type UserSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSession to aggregate.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserSessions
    **/
    _count?: true | UserSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserSessionMaxAggregateInputType
  }

  export type GetUserSessionAggregateType<T extends UserSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateUserSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserSession[P]>
      : GetScalarType<T[P], AggregateUserSession[P]>
  }




  export type UserSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSessionWhereInput
    orderBy?: UserSessionOrderByWithAggregationInput | UserSessionOrderByWithAggregationInput[]
    by: UserSessionScalarFieldEnum[] | UserSessionScalarFieldEnum
    having?: UserSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserSessionCountAggregateInputType | true
    _min?: UserSessionMinAggregateInputType
    _max?: UserSessionMaxAggregateInputType
  }

  export type UserSessionGroupByOutputType = {
    id: string
    userId: string
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date
    expiresAt: Date
    lastActive: Date
    _count: UserSessionCountAggregateOutputType | null
    _min: UserSessionMinAggregateOutputType | null
    _max: UserSessionMaxAggregateOutputType | null
  }

  type GetUserSessionGroupByPayload<T extends UserSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserSessionGroupByOutputType[P]>
            : GetScalarType<T[P], UserSessionGroupByOutputType[P]>
        }
      >
    >


  export type UserSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    lastActive?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    lastActive?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    lastActive?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    lastActive?: boolean
  }

  export type UserSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "ipAddress" | "userAgent" | "createdAt" | "expiresAt" | "lastActive", ExtArgs["result"]["userSession"]>
  export type UserSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      ipAddress: string | null
      userAgent: string | null
      createdAt: Date
      expiresAt: Date
      lastActive: Date
    }, ExtArgs["result"]["userSession"]>
    composites: {}
  }

  type UserSessionGetPayload<S extends boolean | null | undefined | UserSessionDefaultArgs> = $Result.GetResult<Prisma.$UserSessionPayload, S>

  type UserSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserSessionCountAggregateInputType | true
    }

  export interface UserSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserSession'], meta: { name: 'UserSession' } }
    /**
     * Find zero or one UserSession that matches the filter.
     * @param {UserSessionFindUniqueArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserSessionFindUniqueArgs>(args: SelectSubset<T, UserSessionFindUniqueArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserSessionFindUniqueOrThrowArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, UserSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindFirstArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserSessionFindFirstArgs>(args?: SelectSubset<T, UserSessionFindFirstArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindFirstOrThrowArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, UserSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserSessions
     * const userSessions = await prisma.userSession.findMany()
     * 
     * // Get first 10 UserSessions
     * const userSessions = await prisma.userSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userSessionWithIdOnly = await prisma.userSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserSessionFindManyArgs>(args?: SelectSubset<T, UserSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserSession.
     * @param {UserSessionCreateArgs} args - Arguments to create a UserSession.
     * @example
     * // Create one UserSession
     * const UserSession = await prisma.userSession.create({
     *   data: {
     *     // ... data to create a UserSession
     *   }
     * })
     * 
     */
    create<T extends UserSessionCreateArgs>(args: SelectSubset<T, UserSessionCreateArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserSessions.
     * @param {UserSessionCreateManyArgs} args - Arguments to create many UserSessions.
     * @example
     * // Create many UserSessions
     * const userSession = await prisma.userSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserSessionCreateManyArgs>(args?: SelectSubset<T, UserSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserSessions and returns the data saved in the database.
     * @param {UserSessionCreateManyAndReturnArgs} args - Arguments to create many UserSessions.
     * @example
     * // Create many UserSessions
     * const userSession = await prisma.userSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserSessions and only return the `id`
     * const userSessionWithIdOnly = await prisma.userSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, UserSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserSession.
     * @param {UserSessionDeleteArgs} args - Arguments to delete one UserSession.
     * @example
     * // Delete one UserSession
     * const UserSession = await prisma.userSession.delete({
     *   where: {
     *     // ... filter to delete one UserSession
     *   }
     * })
     * 
     */
    delete<T extends UserSessionDeleteArgs>(args: SelectSubset<T, UserSessionDeleteArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserSession.
     * @param {UserSessionUpdateArgs} args - Arguments to update one UserSession.
     * @example
     * // Update one UserSession
     * const userSession = await prisma.userSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserSessionUpdateArgs>(args: SelectSubset<T, UserSessionUpdateArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserSessions.
     * @param {UserSessionDeleteManyArgs} args - Arguments to filter UserSessions to delete.
     * @example
     * // Delete a few UserSessions
     * const { count } = await prisma.userSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserSessionDeleteManyArgs>(args?: SelectSubset<T, UserSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserSessions
     * const userSession = await prisma.userSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserSessionUpdateManyArgs>(args: SelectSubset<T, UserSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSessions and returns the data updated in the database.
     * @param {UserSessionUpdateManyAndReturnArgs} args - Arguments to update many UserSessions.
     * @example
     * // Update many UserSessions
     * const userSession = await prisma.userSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserSessions and only return the `id`
     * const userSessionWithIdOnly = await prisma.userSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, UserSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserSession.
     * @param {UserSessionUpsertArgs} args - Arguments to update or create a UserSession.
     * @example
     * // Update or create a UserSession
     * const userSession = await prisma.userSession.upsert({
     *   create: {
     *     // ... data to create a UserSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserSession we want to update
     *   }
     * })
     */
    upsert<T extends UserSessionUpsertArgs>(args: SelectSubset<T, UserSessionUpsertArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionCountArgs} args - Arguments to filter UserSessions to count.
     * @example
     * // Count the number of UserSessions
     * const count = await prisma.userSession.count({
     *   where: {
     *     // ... the filter for the UserSessions we want to count
     *   }
     * })
    **/
    count<T extends UserSessionCountArgs>(
      args?: Subset<T, UserSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserSessionAggregateArgs>(args: Subset<T, UserSessionAggregateArgs>): Prisma.PrismaPromise<GetUserSessionAggregateType<T>>

    /**
     * Group by UserSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionGroupByArgs} args - Group by arguments.
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
      T extends UserSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserSessionGroupByArgs['orderBy'] }
        : { orderBy?: UserSessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserSession model
   */
  readonly fields: UserSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the UserSession model
   */
  interface UserSessionFieldRefs {
    readonly id: FieldRef<"UserSession", 'String'>
    readonly userId: FieldRef<"UserSession", 'String'>
    readonly ipAddress: FieldRef<"UserSession", 'String'>
    readonly userAgent: FieldRef<"UserSession", 'String'>
    readonly createdAt: FieldRef<"UserSession", 'DateTime'>
    readonly expiresAt: FieldRef<"UserSession", 'DateTime'>
    readonly lastActive: FieldRef<"UserSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserSession findUnique
   */
  export type UserSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession findUniqueOrThrow
   */
  export type UserSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession findFirst
   */
  export type UserSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSessions.
     */
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession findFirstOrThrow
   */
  export type UserSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSessions.
     */
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession findMany
   */
  export type UserSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSessions to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession create
   */
  export type UserSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a UserSession.
     */
    data: XOR<UserSessionCreateInput, UserSessionUncheckedCreateInput>
  }

  /**
   * UserSession createMany
   */
  export type UserSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserSessions.
     */
    data: UserSessionCreateManyInput | UserSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserSession createManyAndReturn
   */
  export type UserSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * The data used to create many UserSessions.
     */
    data: UserSessionCreateManyInput | UserSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserSession update
   */
  export type UserSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a UserSession.
     */
    data: XOR<UserSessionUpdateInput, UserSessionUncheckedUpdateInput>
    /**
     * Choose, which UserSession to update.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession updateMany
   */
  export type UserSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserSessions.
     */
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyInput>
    /**
     * Filter which UserSessions to update
     */
    where?: UserSessionWhereInput
    /**
     * Limit how many UserSessions to update.
     */
    limit?: number
  }

  /**
   * UserSession updateManyAndReturn
   */
  export type UserSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * The data used to update UserSessions.
     */
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyInput>
    /**
     * Filter which UserSessions to update
     */
    where?: UserSessionWhereInput
    /**
     * Limit how many UserSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserSession upsert
   */
  export type UserSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the UserSession to update in case it exists.
     */
    where: UserSessionWhereUniqueInput
    /**
     * In case the UserSession found by the `where` argument doesn't exist, create a new UserSession with this data.
     */
    create: XOR<UserSessionCreateInput, UserSessionUncheckedCreateInput>
    /**
     * In case the UserSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserSessionUpdateInput, UserSessionUncheckedUpdateInput>
  }

  /**
   * UserSession delete
   */
  export type UserSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter which UserSession to delete.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession deleteMany
   */
  export type UserSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSessions to delete
     */
    where?: UserSessionWhereInput
    /**
     * Limit how many UserSessions to delete.
     */
    limit?: number
  }

  /**
   * UserSession without action
   */
  export type UserSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectAvgAggregateOutputType = {
    projectCost: number | null
    contractCost: number | null
    duration: number | null
    daysSuspended: number | null
    daysExtended: number | null
    numFemale: number | null
    numMale: number | null
    numPersons: number | null
    numManDays: number | null
    completionPercentage: number | null
  }

  export type ProjectSumAggregateOutputType = {
    projectCost: number | null
    contractCost: number | null
    duration: number | null
    daysSuspended: number | null
    daysExtended: number | null
    numFemale: number | null
    numMale: number | null
    numPersons: number | null
    numManDays: number | null
    completionPercentage: number | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    projectCode: string | null
    title: string | null
    subType: $Enums.ProjectSubType | null
    modeOfImplementation: $Enums.ModeOfImplementation | null
    locationImplementation: $Enums.District | null
    sourceOfFund: $Enums.SourceOfFund | null
    projectCost: number | null
    contractCost: number | null
    contractorName: string | null
    projectEngineer: string | null
    budgetYear: string | null
    dateStarted: Date | null
    targetCompletionDate: Date | null
    duration: number | null
    revisedCompletionDate: Date | null
    dateCompleted: Date | null
    daysSuspended: number | null
    daysExtended: number | null
    numFemale: number | null
    numMale: number | null
    numPersons: number | null
    numManDays: number | null
    district: $Enums.District | null
    cityMunicipality: string | null
    barangay: string | null
    purok: string | null
    sitio: string | null
    description: string | null
    status: $Enums.ProjectStatus | null
    completionPercentage: number | null
    imageUrl: string | null
    documentUrl: string | null
    documentName: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    projectCode: string | null
    title: string | null
    subType: $Enums.ProjectSubType | null
    modeOfImplementation: $Enums.ModeOfImplementation | null
    locationImplementation: $Enums.District | null
    sourceOfFund: $Enums.SourceOfFund | null
    projectCost: number | null
    contractCost: number | null
    contractorName: string | null
    projectEngineer: string | null
    budgetYear: string | null
    dateStarted: Date | null
    targetCompletionDate: Date | null
    duration: number | null
    revisedCompletionDate: Date | null
    dateCompleted: Date | null
    daysSuspended: number | null
    daysExtended: number | null
    numFemale: number | null
    numMale: number | null
    numPersons: number | null
    numManDays: number | null
    district: $Enums.District | null
    cityMunicipality: string | null
    barangay: string | null
    purok: string | null
    sitio: string | null
    description: string | null
    status: $Enums.ProjectStatus | null
    completionPercentage: number | null
    imageUrl: string | null
    documentUrl: string | null
    documentName: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    projectCode: number
    title: number
    subType: number
    modeOfImplementation: number
    locationImplementation: number
    sourceOfFund: number
    projectCost: number
    contractCost: number
    contractorName: number
    projectEngineer: number
    budgetYear: number
    dateStarted: number
    targetCompletionDate: number
    duration: number
    revisedCompletionDate: number
    dateCompleted: number
    daysSuspended: number
    daysExtended: number
    numFemale: number
    numMale: number
    numPersons: number
    numManDays: number
    district: number
    cityMunicipality: number
    barangay: number
    purok: number
    sitio: number
    description: number
    status: number
    completionPercentage: number
    imageUrl: number
    documentUrl: number
    documentName: number
    createdById: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProjectAvgAggregateInputType = {
    projectCost?: true
    contractCost?: true
    duration?: true
    daysSuspended?: true
    daysExtended?: true
    numFemale?: true
    numMale?: true
    numPersons?: true
    numManDays?: true
    completionPercentage?: true
  }

  export type ProjectSumAggregateInputType = {
    projectCost?: true
    contractCost?: true
    duration?: true
    daysSuspended?: true
    daysExtended?: true
    numFemale?: true
    numMale?: true
    numPersons?: true
    numManDays?: true
    completionPercentage?: true
  }

  export type ProjectMinAggregateInputType = {
    id?: true
    projectCode?: true
    title?: true
    subType?: true
    modeOfImplementation?: true
    locationImplementation?: true
    sourceOfFund?: true
    projectCost?: true
    contractCost?: true
    contractorName?: true
    projectEngineer?: true
    budgetYear?: true
    dateStarted?: true
    targetCompletionDate?: true
    duration?: true
    revisedCompletionDate?: true
    dateCompleted?: true
    daysSuspended?: true
    daysExtended?: true
    numFemale?: true
    numMale?: true
    numPersons?: true
    numManDays?: true
    district?: true
    cityMunicipality?: true
    barangay?: true
    purok?: true
    sitio?: true
    description?: true
    status?: true
    completionPercentage?: true
    imageUrl?: true
    documentUrl?: true
    documentName?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    projectCode?: true
    title?: true
    subType?: true
    modeOfImplementation?: true
    locationImplementation?: true
    sourceOfFund?: true
    projectCost?: true
    contractCost?: true
    contractorName?: true
    projectEngineer?: true
    budgetYear?: true
    dateStarted?: true
    targetCompletionDate?: true
    duration?: true
    revisedCompletionDate?: true
    dateCompleted?: true
    daysSuspended?: true
    daysExtended?: true
    numFemale?: true
    numMale?: true
    numPersons?: true
    numManDays?: true
    district?: true
    cityMunicipality?: true
    barangay?: true
    purok?: true
    sitio?: true
    description?: true
    status?: true
    completionPercentage?: true
    imageUrl?: true
    documentUrl?: true
    documentName?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    projectCode?: true
    title?: true
    subType?: true
    modeOfImplementation?: true
    locationImplementation?: true
    sourceOfFund?: true
    projectCost?: true
    contractCost?: true
    contractorName?: true
    projectEngineer?: true
    budgetYear?: true
    dateStarted?: true
    targetCompletionDate?: true
    duration?: true
    revisedCompletionDate?: true
    dateCompleted?: true
    daysSuspended?: true
    daysExtended?: true
    numFemale?: true
    numMale?: true
    numPersons?: true
    numManDays?: true
    district?: true
    cityMunicipality?: true
    barangay?: true
    purok?: true
    sitio?: true
    description?: true
    status?: true
    completionPercentage?: true
    imageUrl?: true
    documentUrl?: true
    documentName?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _avg?: ProjectAvgAggregateInputType
    _sum?: ProjectSumAggregateInputType
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    projectCode: string
    title: string
    subType: $Enums.ProjectSubType | null
    modeOfImplementation: $Enums.ModeOfImplementation
    locationImplementation: $Enums.District
    sourceOfFund: $Enums.SourceOfFund
    projectCost: number
    contractCost: number
    contractorName: string | null
    projectEngineer: string | null
    budgetYear: string | null
    dateStarted: Date | null
    targetCompletionDate: Date | null
    duration: number
    revisedCompletionDate: Date | null
    dateCompleted: Date | null
    daysSuspended: number
    daysExtended: number
    numFemale: number
    numMale: number
    numPersons: number
    numManDays: number
    district: $Enums.District | null
    cityMunicipality: string | null
    barangay: string | null
    purok: string | null
    sitio: string | null
    description: string | null
    status: $Enums.ProjectStatus
    completionPercentage: number
    imageUrl: string | null
    documentUrl: string | null
    documentName: string | null
    createdById: string
    createdAt: Date
    updatedAt: Date
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectCode?: boolean
    title?: boolean
    subType?: boolean
    modeOfImplementation?: boolean
    locationImplementation?: boolean
    sourceOfFund?: boolean
    projectCost?: boolean
    contractCost?: boolean
    contractorName?: boolean
    projectEngineer?: boolean
    budgetYear?: boolean
    dateStarted?: boolean
    targetCompletionDate?: boolean
    duration?: boolean
    revisedCompletionDate?: boolean
    dateCompleted?: boolean
    daysSuspended?: boolean
    daysExtended?: boolean
    numFemale?: boolean
    numMale?: boolean
    numPersons?: boolean
    numManDays?: boolean
    district?: boolean
    cityMunicipality?: boolean
    barangay?: boolean
    purok?: boolean
    sitio?: boolean
    description?: boolean
    status?: boolean
    completionPercentage?: boolean
    imageUrl?: boolean
    documentUrl?: boolean
    documentName?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    activities?: boolean | Project$activitiesArgs<ExtArgs>
    disbursements?: boolean | Project$disbursementsArgs<ExtArgs>
    taskNotifications?: boolean | Project$taskNotificationsArgs<ExtArgs>
    files?: boolean | Project$filesArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectCode?: boolean
    title?: boolean
    subType?: boolean
    modeOfImplementation?: boolean
    locationImplementation?: boolean
    sourceOfFund?: boolean
    projectCost?: boolean
    contractCost?: boolean
    contractorName?: boolean
    projectEngineer?: boolean
    budgetYear?: boolean
    dateStarted?: boolean
    targetCompletionDate?: boolean
    duration?: boolean
    revisedCompletionDate?: boolean
    dateCompleted?: boolean
    daysSuspended?: boolean
    daysExtended?: boolean
    numFemale?: boolean
    numMale?: boolean
    numPersons?: boolean
    numManDays?: boolean
    district?: boolean
    cityMunicipality?: boolean
    barangay?: boolean
    purok?: boolean
    sitio?: boolean
    description?: boolean
    status?: boolean
    completionPercentage?: boolean
    imageUrl?: boolean
    documentUrl?: boolean
    documentName?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectCode?: boolean
    title?: boolean
    subType?: boolean
    modeOfImplementation?: boolean
    locationImplementation?: boolean
    sourceOfFund?: boolean
    projectCost?: boolean
    contractCost?: boolean
    contractorName?: boolean
    projectEngineer?: boolean
    budgetYear?: boolean
    dateStarted?: boolean
    targetCompletionDate?: boolean
    duration?: boolean
    revisedCompletionDate?: boolean
    dateCompleted?: boolean
    daysSuspended?: boolean
    daysExtended?: boolean
    numFemale?: boolean
    numMale?: boolean
    numPersons?: boolean
    numManDays?: boolean
    district?: boolean
    cityMunicipality?: boolean
    barangay?: boolean
    purok?: boolean
    sitio?: boolean
    description?: boolean
    status?: boolean
    completionPercentage?: boolean
    imageUrl?: boolean
    documentUrl?: boolean
    documentName?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    projectCode?: boolean
    title?: boolean
    subType?: boolean
    modeOfImplementation?: boolean
    locationImplementation?: boolean
    sourceOfFund?: boolean
    projectCost?: boolean
    contractCost?: boolean
    contractorName?: boolean
    projectEngineer?: boolean
    budgetYear?: boolean
    dateStarted?: boolean
    targetCompletionDate?: boolean
    duration?: boolean
    revisedCompletionDate?: boolean
    dateCompleted?: boolean
    daysSuspended?: boolean
    daysExtended?: boolean
    numFemale?: boolean
    numMale?: boolean
    numPersons?: boolean
    numManDays?: boolean
    district?: boolean
    cityMunicipality?: boolean
    barangay?: boolean
    purok?: boolean
    sitio?: boolean
    description?: boolean
    status?: boolean
    completionPercentage?: boolean
    imageUrl?: boolean
    documentUrl?: boolean
    documentName?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectCode" | "title" | "subType" | "modeOfImplementation" | "locationImplementation" | "sourceOfFund" | "projectCost" | "contractCost" | "contractorName" | "projectEngineer" | "budgetYear" | "dateStarted" | "targetCompletionDate" | "duration" | "revisedCompletionDate" | "dateCompleted" | "daysSuspended" | "daysExtended" | "numFemale" | "numMale" | "numPersons" | "numManDays" | "district" | "cityMunicipality" | "barangay" | "purok" | "sitio" | "description" | "status" | "completionPercentage" | "imageUrl" | "documentUrl" | "documentName" | "createdById" | "createdAt" | "updatedAt", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    activities?: boolean | Project$activitiesArgs<ExtArgs>
    disbursements?: boolean | Project$disbursementsArgs<ExtArgs>
    taskNotifications?: boolean | Project$taskNotificationsArgs<ExtArgs>
    files?: boolean | Project$filesArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      createdBy: Prisma.$UserPayload<ExtArgs>
      activities: Prisma.$ProjectActivityPayload<ExtArgs>[]
      disbursements: Prisma.$DisbursementPayload<ExtArgs>[]
      taskNotifications: Prisma.$TaskNotificationPayload<ExtArgs>[]
      files: Prisma.$ProjectFilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectCode: string
      title: string
      subType: $Enums.ProjectSubType | null
      modeOfImplementation: $Enums.ModeOfImplementation
      locationImplementation: $Enums.District
      sourceOfFund: $Enums.SourceOfFund
      projectCost: number
      contractCost: number
      contractorName: string | null
      projectEngineer: string | null
      budgetYear: string | null
      dateStarted: Date | null
      targetCompletionDate: Date | null
      duration: number
      revisedCompletionDate: Date | null
      dateCompleted: Date | null
      daysSuspended: number
      daysExtended: number
      numFemale: number
      numMale: number
      numPersons: number
      numManDays: number
      district: $Enums.District | null
      cityMunicipality: string | null
      barangay: string | null
      purok: string | null
      sitio: string | null
      description: string | null
      status: $Enums.ProjectStatus
      completionPercentage: number
      imageUrl: string | null
      documentUrl: string | null
      documentName: string | null
      createdById: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
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
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    activities<T extends Project$activitiesArgs<ExtArgs> = {}>(args?: Subset<T, Project$activitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    disbursements<T extends Project$disbursementsArgs<ExtArgs> = {}>(args?: Subset<T, Project$disbursementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DisbursementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    taskNotifications<T extends Project$taskNotificationsArgs<ExtArgs> = {}>(args?: Subset<T, Project$taskNotificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskNotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    files<T extends Project$filesArgs<ExtArgs> = {}>(args?: Subset<T, Project$filesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly projectCode: FieldRef<"Project", 'String'>
    readonly title: FieldRef<"Project", 'String'>
    readonly subType: FieldRef<"Project", 'ProjectSubType'>
    readonly modeOfImplementation: FieldRef<"Project", 'ModeOfImplementation'>
    readonly locationImplementation: FieldRef<"Project", 'District'>
    readonly sourceOfFund: FieldRef<"Project", 'SourceOfFund'>
    readonly projectCost: FieldRef<"Project", 'Float'>
    readonly contractCost: FieldRef<"Project", 'Float'>
    readonly contractorName: FieldRef<"Project", 'String'>
    readonly projectEngineer: FieldRef<"Project", 'String'>
    readonly budgetYear: FieldRef<"Project", 'String'>
    readonly dateStarted: FieldRef<"Project", 'DateTime'>
    readonly targetCompletionDate: FieldRef<"Project", 'DateTime'>
    readonly duration: FieldRef<"Project", 'Int'>
    readonly revisedCompletionDate: FieldRef<"Project", 'DateTime'>
    readonly dateCompleted: FieldRef<"Project", 'DateTime'>
    readonly daysSuspended: FieldRef<"Project", 'Int'>
    readonly daysExtended: FieldRef<"Project", 'Int'>
    readonly numFemale: FieldRef<"Project", 'Int'>
    readonly numMale: FieldRef<"Project", 'Int'>
    readonly numPersons: FieldRef<"Project", 'Int'>
    readonly numManDays: FieldRef<"Project", 'Int'>
    readonly district: FieldRef<"Project", 'District'>
    readonly cityMunicipality: FieldRef<"Project", 'String'>
    readonly barangay: FieldRef<"Project", 'String'>
    readonly purok: FieldRef<"Project", 'String'>
    readonly sitio: FieldRef<"Project", 'String'>
    readonly description: FieldRef<"Project", 'String'>
    readonly status: FieldRef<"Project", 'ProjectStatus'>
    readonly completionPercentage: FieldRef<"Project", 'Int'>
    readonly imageUrl: FieldRef<"Project", 'String'>
    readonly documentUrl: FieldRef<"Project", 'String'>
    readonly documentName: FieldRef<"Project", 'String'>
    readonly createdById: FieldRef<"Project", 'String'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.activities
   */
  export type Project$activitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectActivity
     */
    select?: ProjectActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectActivity
     */
    omit?: ProjectActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectActivityInclude<ExtArgs> | null
    where?: ProjectActivityWhereInput
    orderBy?: ProjectActivityOrderByWithRelationInput | ProjectActivityOrderByWithRelationInput[]
    cursor?: ProjectActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectActivityScalarFieldEnum | ProjectActivityScalarFieldEnum[]
  }

  /**
   * Project.disbursements
   */
  export type Project$disbursementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disbursement
     */
    select?: DisbursementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disbursement
     */
    omit?: DisbursementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisbursementInclude<ExtArgs> | null
    where?: DisbursementWhereInput
    orderBy?: DisbursementOrderByWithRelationInput | DisbursementOrderByWithRelationInput[]
    cursor?: DisbursementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DisbursementScalarFieldEnum | DisbursementScalarFieldEnum[]
  }

  /**
   * Project.taskNotifications
   */
  export type Project$taskNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskNotification
     */
    select?: TaskNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskNotification
     */
    omit?: TaskNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskNotificationInclude<ExtArgs> | null
    where?: TaskNotificationWhereInput
    orderBy?: TaskNotificationOrderByWithRelationInput | TaskNotificationOrderByWithRelationInput[]
    cursor?: TaskNotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskNotificationScalarFieldEnum | TaskNotificationScalarFieldEnum[]
  }

  /**
   * Project.files
   */
  export type Project$filesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    where?: ProjectFileWhereInput
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    cursor?: ProjectFileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model ProjectActivity
   */

  export type AggregateProjectActivity = {
    _count: ProjectActivityCountAggregateOutputType | null
    _min: ProjectActivityMinAggregateOutputType | null
    _max: ProjectActivityMaxAggregateOutputType | null
  }

  export type ProjectActivityMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    description: string | null
    createdById: string | null
    createdAt: Date | null
  }

  export type ProjectActivityMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    description: string | null
    createdById: string | null
    createdAt: Date | null
  }

  export type ProjectActivityCountAggregateOutputType = {
    id: number
    projectId: number
    description: number
    createdById: number
    createdAt: number
    _all: number
  }


  export type ProjectActivityMinAggregateInputType = {
    id?: true
    projectId?: true
    description?: true
    createdById?: true
    createdAt?: true
  }

  export type ProjectActivityMaxAggregateInputType = {
    id?: true
    projectId?: true
    description?: true
    createdById?: true
    createdAt?: true
  }

  export type ProjectActivityCountAggregateInputType = {
    id?: true
    projectId?: true
    description?: true
    createdById?: true
    createdAt?: true
    _all?: true
  }

  export type ProjectActivityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectActivity to aggregate.
     */
    where?: ProjectActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectActivities to fetch.
     */
    orderBy?: ProjectActivityOrderByWithRelationInput | ProjectActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectActivities
    **/
    _count?: true | ProjectActivityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectActivityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectActivityMaxAggregateInputType
  }

  export type GetProjectActivityAggregateType<T extends ProjectActivityAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectActivity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectActivity[P]>
      : GetScalarType<T[P], AggregateProjectActivity[P]>
  }




  export type ProjectActivityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectActivityWhereInput
    orderBy?: ProjectActivityOrderByWithAggregationInput | ProjectActivityOrderByWithAggregationInput[]
    by: ProjectActivityScalarFieldEnum[] | ProjectActivityScalarFieldEnum
    having?: ProjectActivityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectActivityCountAggregateInputType | true
    _min?: ProjectActivityMinAggregateInputType
    _max?: ProjectActivityMaxAggregateInputType
  }

  export type ProjectActivityGroupByOutputType = {
    id: string
    projectId: string
    description: string
    createdById: string
    createdAt: Date
    _count: ProjectActivityCountAggregateOutputType | null
    _min: ProjectActivityMinAggregateOutputType | null
    _max: ProjectActivityMaxAggregateOutputType | null
  }

  type GetProjectActivityGroupByPayload<T extends ProjectActivityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectActivityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectActivityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectActivityGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectActivityGroupByOutputType[P]>
        }
      >
    >


  export type ProjectActivitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    description?: boolean
    createdById?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectActivity"]>

  export type ProjectActivitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    description?: boolean
    createdById?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectActivity"]>

  export type ProjectActivitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    description?: boolean
    createdById?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectActivity"]>

  export type ProjectActivitySelectScalar = {
    id?: boolean
    projectId?: boolean
    description?: boolean
    createdById?: boolean
    createdAt?: boolean
  }

  export type ProjectActivityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "description" | "createdById" | "createdAt", ExtArgs["result"]["projectActivity"]>
  export type ProjectActivityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProjectActivityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProjectActivityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProjectActivityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectActivity"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      createdBy: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      description: string
      createdById: string
      createdAt: Date
    }, ExtArgs["result"]["projectActivity"]>
    composites: {}
  }

  type ProjectActivityGetPayload<S extends boolean | null | undefined | ProjectActivityDefaultArgs> = $Result.GetResult<Prisma.$ProjectActivityPayload, S>

  type ProjectActivityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectActivityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectActivityCountAggregateInputType | true
    }

  export interface ProjectActivityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectActivity'], meta: { name: 'ProjectActivity' } }
    /**
     * Find zero or one ProjectActivity that matches the filter.
     * @param {ProjectActivityFindUniqueArgs} args - Arguments to find a ProjectActivity
     * @example
     * // Get one ProjectActivity
     * const projectActivity = await prisma.projectActivity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectActivityFindUniqueArgs>(args: SelectSubset<T, ProjectActivityFindUniqueArgs<ExtArgs>>): Prisma__ProjectActivityClient<$Result.GetResult<Prisma.$ProjectActivityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProjectActivity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectActivityFindUniqueOrThrowArgs} args - Arguments to find a ProjectActivity
     * @example
     * // Get one ProjectActivity
     * const projectActivity = await prisma.projectActivity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectActivityFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectActivityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectActivityClient<$Result.GetResult<Prisma.$ProjectActivityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectActivity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectActivityFindFirstArgs} args - Arguments to find a ProjectActivity
     * @example
     * // Get one ProjectActivity
     * const projectActivity = await prisma.projectActivity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectActivityFindFirstArgs>(args?: SelectSubset<T, ProjectActivityFindFirstArgs<ExtArgs>>): Prisma__ProjectActivityClient<$Result.GetResult<Prisma.$ProjectActivityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectActivity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectActivityFindFirstOrThrowArgs} args - Arguments to find a ProjectActivity
     * @example
     * // Get one ProjectActivity
     * const projectActivity = await prisma.projectActivity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectActivityFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectActivityFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectActivityClient<$Result.GetResult<Prisma.$ProjectActivityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProjectActivities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectActivityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectActivities
     * const projectActivities = await prisma.projectActivity.findMany()
     * 
     * // Get first 10 ProjectActivities
     * const projectActivities = await prisma.projectActivity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectActivityWithIdOnly = await prisma.projectActivity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectActivityFindManyArgs>(args?: SelectSubset<T, ProjectActivityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProjectActivity.
     * @param {ProjectActivityCreateArgs} args - Arguments to create a ProjectActivity.
     * @example
     * // Create one ProjectActivity
     * const ProjectActivity = await prisma.projectActivity.create({
     *   data: {
     *     // ... data to create a ProjectActivity
     *   }
     * })
     * 
     */
    create<T extends ProjectActivityCreateArgs>(args: SelectSubset<T, ProjectActivityCreateArgs<ExtArgs>>): Prisma__ProjectActivityClient<$Result.GetResult<Prisma.$ProjectActivityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProjectActivities.
     * @param {ProjectActivityCreateManyArgs} args - Arguments to create many ProjectActivities.
     * @example
     * // Create many ProjectActivities
     * const projectActivity = await prisma.projectActivity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectActivityCreateManyArgs>(args?: SelectSubset<T, ProjectActivityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectActivities and returns the data saved in the database.
     * @param {ProjectActivityCreateManyAndReturnArgs} args - Arguments to create many ProjectActivities.
     * @example
     * // Create many ProjectActivities
     * const projectActivity = await prisma.projectActivity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProjectActivities and only return the `id`
     * const projectActivityWithIdOnly = await prisma.projectActivity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectActivityCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectActivityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectActivityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProjectActivity.
     * @param {ProjectActivityDeleteArgs} args - Arguments to delete one ProjectActivity.
     * @example
     * // Delete one ProjectActivity
     * const ProjectActivity = await prisma.projectActivity.delete({
     *   where: {
     *     // ... filter to delete one ProjectActivity
     *   }
     * })
     * 
     */
    delete<T extends ProjectActivityDeleteArgs>(args: SelectSubset<T, ProjectActivityDeleteArgs<ExtArgs>>): Prisma__ProjectActivityClient<$Result.GetResult<Prisma.$ProjectActivityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProjectActivity.
     * @param {ProjectActivityUpdateArgs} args - Arguments to update one ProjectActivity.
     * @example
     * // Update one ProjectActivity
     * const projectActivity = await prisma.projectActivity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectActivityUpdateArgs>(args: SelectSubset<T, ProjectActivityUpdateArgs<ExtArgs>>): Prisma__ProjectActivityClient<$Result.GetResult<Prisma.$ProjectActivityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProjectActivities.
     * @param {ProjectActivityDeleteManyArgs} args - Arguments to filter ProjectActivities to delete.
     * @example
     * // Delete a few ProjectActivities
     * const { count } = await prisma.projectActivity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectActivityDeleteManyArgs>(args?: SelectSubset<T, ProjectActivityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectActivityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectActivities
     * const projectActivity = await prisma.projectActivity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectActivityUpdateManyArgs>(args: SelectSubset<T, ProjectActivityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectActivities and returns the data updated in the database.
     * @param {ProjectActivityUpdateManyAndReturnArgs} args - Arguments to update many ProjectActivities.
     * @example
     * // Update many ProjectActivities
     * const projectActivity = await prisma.projectActivity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProjectActivities and only return the `id`
     * const projectActivityWithIdOnly = await prisma.projectActivity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectActivityUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectActivityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectActivityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProjectActivity.
     * @param {ProjectActivityUpsertArgs} args - Arguments to update or create a ProjectActivity.
     * @example
     * // Update or create a ProjectActivity
     * const projectActivity = await prisma.projectActivity.upsert({
     *   create: {
     *     // ... data to create a ProjectActivity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectActivity we want to update
     *   }
     * })
     */
    upsert<T extends ProjectActivityUpsertArgs>(args: SelectSubset<T, ProjectActivityUpsertArgs<ExtArgs>>): Prisma__ProjectActivityClient<$Result.GetResult<Prisma.$ProjectActivityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProjectActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectActivityCountArgs} args - Arguments to filter ProjectActivities to count.
     * @example
     * // Count the number of ProjectActivities
     * const count = await prisma.projectActivity.count({
     *   where: {
     *     // ... the filter for the ProjectActivities we want to count
     *   }
     * })
    **/
    count<T extends ProjectActivityCountArgs>(
      args?: Subset<T, ProjectActivityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectActivityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectActivityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProjectActivityAggregateArgs>(args: Subset<T, ProjectActivityAggregateArgs>): Prisma.PrismaPromise<GetProjectActivityAggregateType<T>>

    /**
     * Group by ProjectActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectActivityGroupByArgs} args - Group by arguments.
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
      T extends ProjectActivityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectActivityGroupByArgs['orderBy'] }
        : { orderBy?: ProjectActivityGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProjectActivityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectActivityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectActivity model
   */
  readonly fields: ProjectActivityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectActivity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectActivityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ProjectActivity model
   */
  interface ProjectActivityFieldRefs {
    readonly id: FieldRef<"ProjectActivity", 'String'>
    readonly projectId: FieldRef<"ProjectActivity", 'String'>
    readonly description: FieldRef<"ProjectActivity", 'String'>
    readonly createdById: FieldRef<"ProjectActivity", 'String'>
    readonly createdAt: FieldRef<"ProjectActivity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProjectActivity findUnique
   */
  export type ProjectActivityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectActivity
     */
    select?: ProjectActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectActivity
     */
    omit?: ProjectActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectActivityInclude<ExtArgs> | null
    /**
     * Filter, which ProjectActivity to fetch.
     */
    where: ProjectActivityWhereUniqueInput
  }

  /**
   * ProjectActivity findUniqueOrThrow
   */
  export type ProjectActivityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectActivity
     */
    select?: ProjectActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectActivity
     */
    omit?: ProjectActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectActivityInclude<ExtArgs> | null
    /**
     * Filter, which ProjectActivity to fetch.
     */
    where: ProjectActivityWhereUniqueInput
  }

  /**
   * ProjectActivity findFirst
   */
  export type ProjectActivityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectActivity
     */
    select?: ProjectActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectActivity
     */
    omit?: ProjectActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectActivityInclude<ExtArgs> | null
    /**
     * Filter, which ProjectActivity to fetch.
     */
    where?: ProjectActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectActivities to fetch.
     */
    orderBy?: ProjectActivityOrderByWithRelationInput | ProjectActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectActivities.
     */
    cursor?: ProjectActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectActivities.
     */
    distinct?: ProjectActivityScalarFieldEnum | ProjectActivityScalarFieldEnum[]
  }

  /**
   * ProjectActivity findFirstOrThrow
   */
  export type ProjectActivityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectActivity
     */
    select?: ProjectActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectActivity
     */
    omit?: ProjectActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectActivityInclude<ExtArgs> | null
    /**
     * Filter, which ProjectActivity to fetch.
     */
    where?: ProjectActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectActivities to fetch.
     */
    orderBy?: ProjectActivityOrderByWithRelationInput | ProjectActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectActivities.
     */
    cursor?: ProjectActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectActivities.
     */
    distinct?: ProjectActivityScalarFieldEnum | ProjectActivityScalarFieldEnum[]
  }

  /**
   * ProjectActivity findMany
   */
  export type ProjectActivityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectActivity
     */
    select?: ProjectActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectActivity
     */
    omit?: ProjectActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectActivityInclude<ExtArgs> | null
    /**
     * Filter, which ProjectActivities to fetch.
     */
    where?: ProjectActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectActivities to fetch.
     */
    orderBy?: ProjectActivityOrderByWithRelationInput | ProjectActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectActivities.
     */
    cursor?: ProjectActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectActivities.
     */
    skip?: number
    distinct?: ProjectActivityScalarFieldEnum | ProjectActivityScalarFieldEnum[]
  }

  /**
   * ProjectActivity create
   */
  export type ProjectActivityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectActivity
     */
    select?: ProjectActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectActivity
     */
    omit?: ProjectActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectActivityInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectActivity.
     */
    data: XOR<ProjectActivityCreateInput, ProjectActivityUncheckedCreateInput>
  }

  /**
   * ProjectActivity createMany
   */
  export type ProjectActivityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectActivities.
     */
    data: ProjectActivityCreateManyInput | ProjectActivityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProjectActivity createManyAndReturn
   */
  export type ProjectActivityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectActivity
     */
    select?: ProjectActivitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectActivity
     */
    omit?: ProjectActivityOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectActivities.
     */
    data: ProjectActivityCreateManyInput | ProjectActivityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectActivityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectActivity update
   */
  export type ProjectActivityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectActivity
     */
    select?: ProjectActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectActivity
     */
    omit?: ProjectActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectActivityInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectActivity.
     */
    data: XOR<ProjectActivityUpdateInput, ProjectActivityUncheckedUpdateInput>
    /**
     * Choose, which ProjectActivity to update.
     */
    where: ProjectActivityWhereUniqueInput
  }

  /**
   * ProjectActivity updateMany
   */
  export type ProjectActivityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectActivities.
     */
    data: XOR<ProjectActivityUpdateManyMutationInput, ProjectActivityUncheckedUpdateManyInput>
    /**
     * Filter which ProjectActivities to update
     */
    where?: ProjectActivityWhereInput
    /**
     * Limit how many ProjectActivities to update.
     */
    limit?: number
  }

  /**
   * ProjectActivity updateManyAndReturn
   */
  export type ProjectActivityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectActivity
     */
    select?: ProjectActivitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectActivity
     */
    omit?: ProjectActivityOmit<ExtArgs> | null
    /**
     * The data used to update ProjectActivities.
     */
    data: XOR<ProjectActivityUpdateManyMutationInput, ProjectActivityUncheckedUpdateManyInput>
    /**
     * Filter which ProjectActivities to update
     */
    where?: ProjectActivityWhereInput
    /**
     * Limit how many ProjectActivities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectActivityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectActivity upsert
   */
  export type ProjectActivityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectActivity
     */
    select?: ProjectActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectActivity
     */
    omit?: ProjectActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectActivityInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectActivity to update in case it exists.
     */
    where: ProjectActivityWhereUniqueInput
    /**
     * In case the ProjectActivity found by the `where` argument doesn't exist, create a new ProjectActivity with this data.
     */
    create: XOR<ProjectActivityCreateInput, ProjectActivityUncheckedCreateInput>
    /**
     * In case the ProjectActivity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectActivityUpdateInput, ProjectActivityUncheckedUpdateInput>
  }

  /**
   * ProjectActivity delete
   */
  export type ProjectActivityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectActivity
     */
    select?: ProjectActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectActivity
     */
    omit?: ProjectActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectActivityInclude<ExtArgs> | null
    /**
     * Filter which ProjectActivity to delete.
     */
    where: ProjectActivityWhereUniqueInput
  }

  /**
   * ProjectActivity deleteMany
   */
  export type ProjectActivityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectActivities to delete
     */
    where?: ProjectActivityWhereInput
    /**
     * Limit how many ProjectActivities to delete.
     */
    limit?: number
  }

  /**
   * ProjectActivity without action
   */
  export type ProjectActivityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectActivity
     */
    select?: ProjectActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectActivity
     */
    omit?: ProjectActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectActivityInclude<ExtArgs> | null
  }


  /**
   * Model Disbursement
   */

  export type AggregateDisbursement = {
    _count: DisbursementCountAggregateOutputType | null
    _avg: DisbursementAvgAggregateOutputType | null
    _sum: DisbursementSumAggregateOutputType | null
    _min: DisbursementMinAggregateOutputType | null
    _max: DisbursementMaxAggregateOutputType | null
  }

  export type DisbursementAvgAggregateOutputType = {
    amount: number | null
  }

  export type DisbursementSumAggregateOutputType = {
    amount: number | null
  }

  export type DisbursementMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    date: Date | null
    referenceNumber: string | null
    amount: number | null
    createdById: string | null
    createdAt: Date | null
  }

  export type DisbursementMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    date: Date | null
    referenceNumber: string | null
    amount: number | null
    createdById: string | null
    createdAt: Date | null
  }

  export type DisbursementCountAggregateOutputType = {
    id: number
    projectId: number
    date: number
    referenceNumber: number
    amount: number
    createdById: number
    createdAt: number
    _all: number
  }


  export type DisbursementAvgAggregateInputType = {
    amount?: true
  }

  export type DisbursementSumAggregateInputType = {
    amount?: true
  }

  export type DisbursementMinAggregateInputType = {
    id?: true
    projectId?: true
    date?: true
    referenceNumber?: true
    amount?: true
    createdById?: true
    createdAt?: true
  }

  export type DisbursementMaxAggregateInputType = {
    id?: true
    projectId?: true
    date?: true
    referenceNumber?: true
    amount?: true
    createdById?: true
    createdAt?: true
  }

  export type DisbursementCountAggregateInputType = {
    id?: true
    projectId?: true
    date?: true
    referenceNumber?: true
    amount?: true
    createdById?: true
    createdAt?: true
    _all?: true
  }

  export type DisbursementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Disbursement to aggregate.
     */
    where?: DisbursementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Disbursements to fetch.
     */
    orderBy?: DisbursementOrderByWithRelationInput | DisbursementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DisbursementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Disbursements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Disbursements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Disbursements
    **/
    _count?: true | DisbursementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DisbursementAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DisbursementSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DisbursementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DisbursementMaxAggregateInputType
  }

  export type GetDisbursementAggregateType<T extends DisbursementAggregateArgs> = {
        [P in keyof T & keyof AggregateDisbursement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDisbursement[P]>
      : GetScalarType<T[P], AggregateDisbursement[P]>
  }




  export type DisbursementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DisbursementWhereInput
    orderBy?: DisbursementOrderByWithAggregationInput | DisbursementOrderByWithAggregationInput[]
    by: DisbursementScalarFieldEnum[] | DisbursementScalarFieldEnum
    having?: DisbursementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DisbursementCountAggregateInputType | true
    _avg?: DisbursementAvgAggregateInputType
    _sum?: DisbursementSumAggregateInputType
    _min?: DisbursementMinAggregateInputType
    _max?: DisbursementMaxAggregateInputType
  }

  export type DisbursementGroupByOutputType = {
    id: string
    projectId: string
    date: Date
    referenceNumber: string | null
    amount: number
    createdById: string
    createdAt: Date
    _count: DisbursementCountAggregateOutputType | null
    _avg: DisbursementAvgAggregateOutputType | null
    _sum: DisbursementSumAggregateOutputType | null
    _min: DisbursementMinAggregateOutputType | null
    _max: DisbursementMaxAggregateOutputType | null
  }

  type GetDisbursementGroupByPayload<T extends DisbursementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DisbursementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DisbursementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DisbursementGroupByOutputType[P]>
            : GetScalarType<T[P], DisbursementGroupByOutputType[P]>
        }
      >
    >


  export type DisbursementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    date?: boolean
    referenceNumber?: boolean
    amount?: boolean
    createdById?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["disbursement"]>

  export type DisbursementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    date?: boolean
    referenceNumber?: boolean
    amount?: boolean
    createdById?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["disbursement"]>

  export type DisbursementSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    date?: boolean
    referenceNumber?: boolean
    amount?: boolean
    createdById?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["disbursement"]>

  export type DisbursementSelectScalar = {
    id?: boolean
    projectId?: boolean
    date?: boolean
    referenceNumber?: boolean
    amount?: boolean
    createdById?: boolean
    createdAt?: boolean
  }

  export type DisbursementOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "date" | "referenceNumber" | "amount" | "createdById" | "createdAt", ExtArgs["result"]["disbursement"]>
  export type DisbursementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DisbursementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DisbursementIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DisbursementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Disbursement"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      createdBy: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      date: Date
      referenceNumber: string | null
      amount: number
      createdById: string
      createdAt: Date
    }, ExtArgs["result"]["disbursement"]>
    composites: {}
  }

  type DisbursementGetPayload<S extends boolean | null | undefined | DisbursementDefaultArgs> = $Result.GetResult<Prisma.$DisbursementPayload, S>

  type DisbursementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DisbursementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DisbursementCountAggregateInputType | true
    }

  export interface DisbursementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Disbursement'], meta: { name: 'Disbursement' } }
    /**
     * Find zero or one Disbursement that matches the filter.
     * @param {DisbursementFindUniqueArgs} args - Arguments to find a Disbursement
     * @example
     * // Get one Disbursement
     * const disbursement = await prisma.disbursement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DisbursementFindUniqueArgs>(args: SelectSubset<T, DisbursementFindUniqueArgs<ExtArgs>>): Prisma__DisbursementClient<$Result.GetResult<Prisma.$DisbursementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Disbursement that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DisbursementFindUniqueOrThrowArgs} args - Arguments to find a Disbursement
     * @example
     * // Get one Disbursement
     * const disbursement = await prisma.disbursement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DisbursementFindUniqueOrThrowArgs>(args: SelectSubset<T, DisbursementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DisbursementClient<$Result.GetResult<Prisma.$DisbursementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Disbursement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisbursementFindFirstArgs} args - Arguments to find a Disbursement
     * @example
     * // Get one Disbursement
     * const disbursement = await prisma.disbursement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DisbursementFindFirstArgs>(args?: SelectSubset<T, DisbursementFindFirstArgs<ExtArgs>>): Prisma__DisbursementClient<$Result.GetResult<Prisma.$DisbursementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Disbursement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisbursementFindFirstOrThrowArgs} args - Arguments to find a Disbursement
     * @example
     * // Get one Disbursement
     * const disbursement = await prisma.disbursement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DisbursementFindFirstOrThrowArgs>(args?: SelectSubset<T, DisbursementFindFirstOrThrowArgs<ExtArgs>>): Prisma__DisbursementClient<$Result.GetResult<Prisma.$DisbursementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Disbursements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisbursementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Disbursements
     * const disbursements = await prisma.disbursement.findMany()
     * 
     * // Get first 10 Disbursements
     * const disbursements = await prisma.disbursement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const disbursementWithIdOnly = await prisma.disbursement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DisbursementFindManyArgs>(args?: SelectSubset<T, DisbursementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DisbursementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Disbursement.
     * @param {DisbursementCreateArgs} args - Arguments to create a Disbursement.
     * @example
     * // Create one Disbursement
     * const Disbursement = await prisma.disbursement.create({
     *   data: {
     *     // ... data to create a Disbursement
     *   }
     * })
     * 
     */
    create<T extends DisbursementCreateArgs>(args: SelectSubset<T, DisbursementCreateArgs<ExtArgs>>): Prisma__DisbursementClient<$Result.GetResult<Prisma.$DisbursementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Disbursements.
     * @param {DisbursementCreateManyArgs} args - Arguments to create many Disbursements.
     * @example
     * // Create many Disbursements
     * const disbursement = await prisma.disbursement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DisbursementCreateManyArgs>(args?: SelectSubset<T, DisbursementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Disbursements and returns the data saved in the database.
     * @param {DisbursementCreateManyAndReturnArgs} args - Arguments to create many Disbursements.
     * @example
     * // Create many Disbursements
     * const disbursement = await prisma.disbursement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Disbursements and only return the `id`
     * const disbursementWithIdOnly = await prisma.disbursement.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DisbursementCreateManyAndReturnArgs>(args?: SelectSubset<T, DisbursementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DisbursementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Disbursement.
     * @param {DisbursementDeleteArgs} args - Arguments to delete one Disbursement.
     * @example
     * // Delete one Disbursement
     * const Disbursement = await prisma.disbursement.delete({
     *   where: {
     *     // ... filter to delete one Disbursement
     *   }
     * })
     * 
     */
    delete<T extends DisbursementDeleteArgs>(args: SelectSubset<T, DisbursementDeleteArgs<ExtArgs>>): Prisma__DisbursementClient<$Result.GetResult<Prisma.$DisbursementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Disbursement.
     * @param {DisbursementUpdateArgs} args - Arguments to update one Disbursement.
     * @example
     * // Update one Disbursement
     * const disbursement = await prisma.disbursement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DisbursementUpdateArgs>(args: SelectSubset<T, DisbursementUpdateArgs<ExtArgs>>): Prisma__DisbursementClient<$Result.GetResult<Prisma.$DisbursementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Disbursements.
     * @param {DisbursementDeleteManyArgs} args - Arguments to filter Disbursements to delete.
     * @example
     * // Delete a few Disbursements
     * const { count } = await prisma.disbursement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DisbursementDeleteManyArgs>(args?: SelectSubset<T, DisbursementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Disbursements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisbursementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Disbursements
     * const disbursement = await prisma.disbursement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DisbursementUpdateManyArgs>(args: SelectSubset<T, DisbursementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Disbursements and returns the data updated in the database.
     * @param {DisbursementUpdateManyAndReturnArgs} args - Arguments to update many Disbursements.
     * @example
     * // Update many Disbursements
     * const disbursement = await prisma.disbursement.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Disbursements and only return the `id`
     * const disbursementWithIdOnly = await prisma.disbursement.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DisbursementUpdateManyAndReturnArgs>(args: SelectSubset<T, DisbursementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DisbursementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Disbursement.
     * @param {DisbursementUpsertArgs} args - Arguments to update or create a Disbursement.
     * @example
     * // Update or create a Disbursement
     * const disbursement = await prisma.disbursement.upsert({
     *   create: {
     *     // ... data to create a Disbursement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Disbursement we want to update
     *   }
     * })
     */
    upsert<T extends DisbursementUpsertArgs>(args: SelectSubset<T, DisbursementUpsertArgs<ExtArgs>>): Prisma__DisbursementClient<$Result.GetResult<Prisma.$DisbursementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Disbursements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisbursementCountArgs} args - Arguments to filter Disbursements to count.
     * @example
     * // Count the number of Disbursements
     * const count = await prisma.disbursement.count({
     *   where: {
     *     // ... the filter for the Disbursements we want to count
     *   }
     * })
    **/
    count<T extends DisbursementCountArgs>(
      args?: Subset<T, DisbursementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DisbursementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Disbursement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisbursementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DisbursementAggregateArgs>(args: Subset<T, DisbursementAggregateArgs>): Prisma.PrismaPromise<GetDisbursementAggregateType<T>>

    /**
     * Group by Disbursement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisbursementGroupByArgs} args - Group by arguments.
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
      T extends DisbursementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DisbursementGroupByArgs['orderBy'] }
        : { orderBy?: DisbursementGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DisbursementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDisbursementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Disbursement model
   */
  readonly fields: DisbursementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Disbursement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DisbursementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Disbursement model
   */
  interface DisbursementFieldRefs {
    readonly id: FieldRef<"Disbursement", 'String'>
    readonly projectId: FieldRef<"Disbursement", 'String'>
    readonly date: FieldRef<"Disbursement", 'DateTime'>
    readonly referenceNumber: FieldRef<"Disbursement", 'String'>
    readonly amount: FieldRef<"Disbursement", 'Float'>
    readonly createdById: FieldRef<"Disbursement", 'String'>
    readonly createdAt: FieldRef<"Disbursement", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Disbursement findUnique
   */
  export type DisbursementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disbursement
     */
    select?: DisbursementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disbursement
     */
    omit?: DisbursementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisbursementInclude<ExtArgs> | null
    /**
     * Filter, which Disbursement to fetch.
     */
    where: DisbursementWhereUniqueInput
  }

  /**
   * Disbursement findUniqueOrThrow
   */
  export type DisbursementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disbursement
     */
    select?: DisbursementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disbursement
     */
    omit?: DisbursementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisbursementInclude<ExtArgs> | null
    /**
     * Filter, which Disbursement to fetch.
     */
    where: DisbursementWhereUniqueInput
  }

  /**
   * Disbursement findFirst
   */
  export type DisbursementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disbursement
     */
    select?: DisbursementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disbursement
     */
    omit?: DisbursementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisbursementInclude<ExtArgs> | null
    /**
     * Filter, which Disbursement to fetch.
     */
    where?: DisbursementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Disbursements to fetch.
     */
    orderBy?: DisbursementOrderByWithRelationInput | DisbursementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Disbursements.
     */
    cursor?: DisbursementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Disbursements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Disbursements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Disbursements.
     */
    distinct?: DisbursementScalarFieldEnum | DisbursementScalarFieldEnum[]
  }

  /**
   * Disbursement findFirstOrThrow
   */
  export type DisbursementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disbursement
     */
    select?: DisbursementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disbursement
     */
    omit?: DisbursementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisbursementInclude<ExtArgs> | null
    /**
     * Filter, which Disbursement to fetch.
     */
    where?: DisbursementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Disbursements to fetch.
     */
    orderBy?: DisbursementOrderByWithRelationInput | DisbursementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Disbursements.
     */
    cursor?: DisbursementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Disbursements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Disbursements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Disbursements.
     */
    distinct?: DisbursementScalarFieldEnum | DisbursementScalarFieldEnum[]
  }

  /**
   * Disbursement findMany
   */
  export type DisbursementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disbursement
     */
    select?: DisbursementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disbursement
     */
    omit?: DisbursementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisbursementInclude<ExtArgs> | null
    /**
     * Filter, which Disbursements to fetch.
     */
    where?: DisbursementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Disbursements to fetch.
     */
    orderBy?: DisbursementOrderByWithRelationInput | DisbursementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Disbursements.
     */
    cursor?: DisbursementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Disbursements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Disbursements.
     */
    skip?: number
    distinct?: DisbursementScalarFieldEnum | DisbursementScalarFieldEnum[]
  }

  /**
   * Disbursement create
   */
  export type DisbursementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disbursement
     */
    select?: DisbursementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disbursement
     */
    omit?: DisbursementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisbursementInclude<ExtArgs> | null
    /**
     * The data needed to create a Disbursement.
     */
    data: XOR<DisbursementCreateInput, DisbursementUncheckedCreateInput>
  }

  /**
   * Disbursement createMany
   */
  export type DisbursementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Disbursements.
     */
    data: DisbursementCreateManyInput | DisbursementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Disbursement createManyAndReturn
   */
  export type DisbursementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disbursement
     */
    select?: DisbursementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Disbursement
     */
    omit?: DisbursementOmit<ExtArgs> | null
    /**
     * The data used to create many Disbursements.
     */
    data: DisbursementCreateManyInput | DisbursementCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisbursementIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Disbursement update
   */
  export type DisbursementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disbursement
     */
    select?: DisbursementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disbursement
     */
    omit?: DisbursementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisbursementInclude<ExtArgs> | null
    /**
     * The data needed to update a Disbursement.
     */
    data: XOR<DisbursementUpdateInput, DisbursementUncheckedUpdateInput>
    /**
     * Choose, which Disbursement to update.
     */
    where: DisbursementWhereUniqueInput
  }

  /**
   * Disbursement updateMany
   */
  export type DisbursementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Disbursements.
     */
    data: XOR<DisbursementUpdateManyMutationInput, DisbursementUncheckedUpdateManyInput>
    /**
     * Filter which Disbursements to update
     */
    where?: DisbursementWhereInput
    /**
     * Limit how many Disbursements to update.
     */
    limit?: number
  }

  /**
   * Disbursement updateManyAndReturn
   */
  export type DisbursementUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disbursement
     */
    select?: DisbursementSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Disbursement
     */
    omit?: DisbursementOmit<ExtArgs> | null
    /**
     * The data used to update Disbursements.
     */
    data: XOR<DisbursementUpdateManyMutationInput, DisbursementUncheckedUpdateManyInput>
    /**
     * Filter which Disbursements to update
     */
    where?: DisbursementWhereInput
    /**
     * Limit how many Disbursements to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisbursementIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Disbursement upsert
   */
  export type DisbursementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disbursement
     */
    select?: DisbursementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disbursement
     */
    omit?: DisbursementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisbursementInclude<ExtArgs> | null
    /**
     * The filter to search for the Disbursement to update in case it exists.
     */
    where: DisbursementWhereUniqueInput
    /**
     * In case the Disbursement found by the `where` argument doesn't exist, create a new Disbursement with this data.
     */
    create: XOR<DisbursementCreateInput, DisbursementUncheckedCreateInput>
    /**
     * In case the Disbursement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DisbursementUpdateInput, DisbursementUncheckedUpdateInput>
  }

  /**
   * Disbursement delete
   */
  export type DisbursementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disbursement
     */
    select?: DisbursementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disbursement
     */
    omit?: DisbursementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisbursementInclude<ExtArgs> | null
    /**
     * Filter which Disbursement to delete.
     */
    where: DisbursementWhereUniqueInput
  }

  /**
   * Disbursement deleteMany
   */
  export type DisbursementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Disbursements to delete
     */
    where?: DisbursementWhereInput
    /**
     * Limit how many Disbursements to delete.
     */
    limit?: number
  }

  /**
   * Disbursement without action
   */
  export type DisbursementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disbursement
     */
    select?: DisbursementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disbursement
     */
    omit?: DisbursementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisbursementInclude<ExtArgs> | null
  }


  /**
   * Model TaskNotification
   */

  export type AggregateTaskNotification = {
    _count: TaskNotificationCountAggregateOutputType | null
    _min: TaskNotificationMinAggregateOutputType | null
    _max: TaskNotificationMaxAggregateOutputType | null
  }

  export type TaskNotificationMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    notifyUserId: string | null
    priority: $Enums.NotificationPriority | null
    description: string | null
    acknowledged: boolean | null
    acknowledgedAt: Date | null
    createdById: string | null
    createdAt: Date | null
  }

  export type TaskNotificationMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    notifyUserId: string | null
    priority: $Enums.NotificationPriority | null
    description: string | null
    acknowledged: boolean | null
    acknowledgedAt: Date | null
    createdById: string | null
    createdAt: Date | null
  }

  export type TaskNotificationCountAggregateOutputType = {
    id: number
    projectId: number
    notifyUserId: number
    priority: number
    description: number
    acknowledged: number
    acknowledgedAt: number
    createdById: number
    createdAt: number
    _all: number
  }


  export type TaskNotificationMinAggregateInputType = {
    id?: true
    projectId?: true
    notifyUserId?: true
    priority?: true
    description?: true
    acknowledged?: true
    acknowledgedAt?: true
    createdById?: true
    createdAt?: true
  }

  export type TaskNotificationMaxAggregateInputType = {
    id?: true
    projectId?: true
    notifyUserId?: true
    priority?: true
    description?: true
    acknowledged?: true
    acknowledgedAt?: true
    createdById?: true
    createdAt?: true
  }

  export type TaskNotificationCountAggregateInputType = {
    id?: true
    projectId?: true
    notifyUserId?: true
    priority?: true
    description?: true
    acknowledged?: true
    acknowledgedAt?: true
    createdById?: true
    createdAt?: true
    _all?: true
  }

  export type TaskNotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskNotification to aggregate.
     */
    where?: TaskNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskNotifications to fetch.
     */
    orderBy?: TaskNotificationOrderByWithRelationInput | TaskNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TaskNotifications
    **/
    _count?: true | TaskNotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskNotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskNotificationMaxAggregateInputType
  }

  export type GetTaskNotificationAggregateType<T extends TaskNotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateTaskNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTaskNotification[P]>
      : GetScalarType<T[P], AggregateTaskNotification[P]>
  }




  export type TaskNotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskNotificationWhereInput
    orderBy?: TaskNotificationOrderByWithAggregationInput | TaskNotificationOrderByWithAggregationInput[]
    by: TaskNotificationScalarFieldEnum[] | TaskNotificationScalarFieldEnum
    having?: TaskNotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskNotificationCountAggregateInputType | true
    _min?: TaskNotificationMinAggregateInputType
    _max?: TaskNotificationMaxAggregateInputType
  }

  export type TaskNotificationGroupByOutputType = {
    id: string
    projectId: string
    notifyUserId: string
    priority: $Enums.NotificationPriority
    description: string
    acknowledged: boolean
    acknowledgedAt: Date | null
    createdById: string
    createdAt: Date
    _count: TaskNotificationCountAggregateOutputType | null
    _min: TaskNotificationMinAggregateOutputType | null
    _max: TaskNotificationMaxAggregateOutputType | null
  }

  type GetTaskNotificationGroupByPayload<T extends TaskNotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskNotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskNotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskNotificationGroupByOutputType[P]>
            : GetScalarType<T[P], TaskNotificationGroupByOutputType[P]>
        }
      >
    >


  export type TaskNotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    notifyUserId?: boolean
    priority?: boolean
    description?: boolean
    acknowledged?: boolean
    acknowledgedAt?: boolean
    createdById?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    notifyUser?: boolean | UserDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    replies?: boolean | TaskNotification$repliesArgs<ExtArgs>
    _count?: boolean | TaskNotificationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskNotification"]>

  export type TaskNotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    notifyUserId?: boolean
    priority?: boolean
    description?: boolean
    acknowledged?: boolean
    acknowledgedAt?: boolean
    createdById?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    notifyUser?: boolean | UserDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskNotification"]>

  export type TaskNotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    notifyUserId?: boolean
    priority?: boolean
    description?: boolean
    acknowledged?: boolean
    acknowledgedAt?: boolean
    createdById?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    notifyUser?: boolean | UserDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskNotification"]>

  export type TaskNotificationSelectScalar = {
    id?: boolean
    projectId?: boolean
    notifyUserId?: boolean
    priority?: boolean
    description?: boolean
    acknowledged?: boolean
    acknowledgedAt?: boolean
    createdById?: boolean
    createdAt?: boolean
  }

  export type TaskNotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "notifyUserId" | "priority" | "description" | "acknowledged" | "acknowledgedAt" | "createdById" | "createdAt", ExtArgs["result"]["taskNotification"]>
  export type TaskNotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    notifyUser?: boolean | UserDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    replies?: boolean | TaskNotification$repliesArgs<ExtArgs>
    _count?: boolean | TaskNotificationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TaskNotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    notifyUser?: boolean | UserDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TaskNotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    notifyUser?: boolean | UserDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TaskNotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TaskNotification"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      notifyUser: Prisma.$UserPayload<ExtArgs>
      createdBy: Prisma.$UserPayload<ExtArgs>
      replies: Prisma.$TaskReplyPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      notifyUserId: string
      priority: $Enums.NotificationPriority
      description: string
      acknowledged: boolean
      acknowledgedAt: Date | null
      createdById: string
      createdAt: Date
    }, ExtArgs["result"]["taskNotification"]>
    composites: {}
  }

  type TaskNotificationGetPayload<S extends boolean | null | undefined | TaskNotificationDefaultArgs> = $Result.GetResult<Prisma.$TaskNotificationPayload, S>

  type TaskNotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TaskNotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TaskNotificationCountAggregateInputType | true
    }

  export interface TaskNotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TaskNotification'], meta: { name: 'TaskNotification' } }
    /**
     * Find zero or one TaskNotification that matches the filter.
     * @param {TaskNotificationFindUniqueArgs} args - Arguments to find a TaskNotification
     * @example
     * // Get one TaskNotification
     * const taskNotification = await prisma.taskNotification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskNotificationFindUniqueArgs>(args: SelectSubset<T, TaskNotificationFindUniqueArgs<ExtArgs>>): Prisma__TaskNotificationClient<$Result.GetResult<Prisma.$TaskNotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TaskNotification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TaskNotificationFindUniqueOrThrowArgs} args - Arguments to find a TaskNotification
     * @example
     * // Get one TaskNotification
     * const taskNotification = await prisma.taskNotification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskNotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskNotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskNotificationClient<$Result.GetResult<Prisma.$TaskNotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TaskNotification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskNotificationFindFirstArgs} args - Arguments to find a TaskNotification
     * @example
     * // Get one TaskNotification
     * const taskNotification = await prisma.taskNotification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskNotificationFindFirstArgs>(args?: SelectSubset<T, TaskNotificationFindFirstArgs<ExtArgs>>): Prisma__TaskNotificationClient<$Result.GetResult<Prisma.$TaskNotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TaskNotification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskNotificationFindFirstOrThrowArgs} args - Arguments to find a TaskNotification
     * @example
     * // Get one TaskNotification
     * const taskNotification = await prisma.taskNotification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskNotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskNotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskNotificationClient<$Result.GetResult<Prisma.$TaskNotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TaskNotifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskNotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TaskNotifications
     * const taskNotifications = await prisma.taskNotification.findMany()
     * 
     * // Get first 10 TaskNotifications
     * const taskNotifications = await prisma.taskNotification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskNotificationWithIdOnly = await prisma.taskNotification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskNotificationFindManyArgs>(args?: SelectSubset<T, TaskNotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskNotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TaskNotification.
     * @param {TaskNotificationCreateArgs} args - Arguments to create a TaskNotification.
     * @example
     * // Create one TaskNotification
     * const TaskNotification = await prisma.taskNotification.create({
     *   data: {
     *     // ... data to create a TaskNotification
     *   }
     * })
     * 
     */
    create<T extends TaskNotificationCreateArgs>(args: SelectSubset<T, TaskNotificationCreateArgs<ExtArgs>>): Prisma__TaskNotificationClient<$Result.GetResult<Prisma.$TaskNotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TaskNotifications.
     * @param {TaskNotificationCreateManyArgs} args - Arguments to create many TaskNotifications.
     * @example
     * // Create many TaskNotifications
     * const taskNotification = await prisma.taskNotification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskNotificationCreateManyArgs>(args?: SelectSubset<T, TaskNotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TaskNotifications and returns the data saved in the database.
     * @param {TaskNotificationCreateManyAndReturnArgs} args - Arguments to create many TaskNotifications.
     * @example
     * // Create many TaskNotifications
     * const taskNotification = await prisma.taskNotification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TaskNotifications and only return the `id`
     * const taskNotificationWithIdOnly = await prisma.taskNotification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskNotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskNotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskNotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TaskNotification.
     * @param {TaskNotificationDeleteArgs} args - Arguments to delete one TaskNotification.
     * @example
     * // Delete one TaskNotification
     * const TaskNotification = await prisma.taskNotification.delete({
     *   where: {
     *     // ... filter to delete one TaskNotification
     *   }
     * })
     * 
     */
    delete<T extends TaskNotificationDeleteArgs>(args: SelectSubset<T, TaskNotificationDeleteArgs<ExtArgs>>): Prisma__TaskNotificationClient<$Result.GetResult<Prisma.$TaskNotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TaskNotification.
     * @param {TaskNotificationUpdateArgs} args - Arguments to update one TaskNotification.
     * @example
     * // Update one TaskNotification
     * const taskNotification = await prisma.taskNotification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskNotificationUpdateArgs>(args: SelectSubset<T, TaskNotificationUpdateArgs<ExtArgs>>): Prisma__TaskNotificationClient<$Result.GetResult<Prisma.$TaskNotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TaskNotifications.
     * @param {TaskNotificationDeleteManyArgs} args - Arguments to filter TaskNotifications to delete.
     * @example
     * // Delete a few TaskNotifications
     * const { count } = await prisma.taskNotification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskNotificationDeleteManyArgs>(args?: SelectSubset<T, TaskNotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskNotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TaskNotifications
     * const taskNotification = await prisma.taskNotification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskNotificationUpdateManyArgs>(args: SelectSubset<T, TaskNotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskNotifications and returns the data updated in the database.
     * @param {TaskNotificationUpdateManyAndReturnArgs} args - Arguments to update many TaskNotifications.
     * @example
     * // Update many TaskNotifications
     * const taskNotification = await prisma.taskNotification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TaskNotifications and only return the `id`
     * const taskNotificationWithIdOnly = await prisma.taskNotification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TaskNotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, TaskNotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskNotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TaskNotification.
     * @param {TaskNotificationUpsertArgs} args - Arguments to update or create a TaskNotification.
     * @example
     * // Update or create a TaskNotification
     * const taskNotification = await prisma.taskNotification.upsert({
     *   create: {
     *     // ... data to create a TaskNotification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TaskNotification we want to update
     *   }
     * })
     */
    upsert<T extends TaskNotificationUpsertArgs>(args: SelectSubset<T, TaskNotificationUpsertArgs<ExtArgs>>): Prisma__TaskNotificationClient<$Result.GetResult<Prisma.$TaskNotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TaskNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskNotificationCountArgs} args - Arguments to filter TaskNotifications to count.
     * @example
     * // Count the number of TaskNotifications
     * const count = await prisma.taskNotification.count({
     *   where: {
     *     // ... the filter for the TaskNotifications we want to count
     *   }
     * })
    **/
    count<T extends TaskNotificationCountArgs>(
      args?: Subset<T, TaskNotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskNotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TaskNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskNotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TaskNotificationAggregateArgs>(args: Subset<T, TaskNotificationAggregateArgs>): Prisma.PrismaPromise<GetTaskNotificationAggregateType<T>>

    /**
     * Group by TaskNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskNotificationGroupByArgs} args - Group by arguments.
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
      T extends TaskNotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskNotificationGroupByArgs['orderBy'] }
        : { orderBy?: TaskNotificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TaskNotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TaskNotification model
   */
  readonly fields: TaskNotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TaskNotification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskNotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    notifyUser<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    replies<T extends TaskNotification$repliesArgs<ExtArgs> = {}>(args?: Subset<T, TaskNotification$repliesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskReplyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the TaskNotification model
   */
  interface TaskNotificationFieldRefs {
    readonly id: FieldRef<"TaskNotification", 'String'>
    readonly projectId: FieldRef<"TaskNotification", 'String'>
    readonly notifyUserId: FieldRef<"TaskNotification", 'String'>
    readonly priority: FieldRef<"TaskNotification", 'NotificationPriority'>
    readonly description: FieldRef<"TaskNotification", 'String'>
    readonly acknowledged: FieldRef<"TaskNotification", 'Boolean'>
    readonly acknowledgedAt: FieldRef<"TaskNotification", 'DateTime'>
    readonly createdById: FieldRef<"TaskNotification", 'String'>
    readonly createdAt: FieldRef<"TaskNotification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TaskNotification findUnique
   */
  export type TaskNotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskNotification
     */
    select?: TaskNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskNotification
     */
    omit?: TaskNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskNotificationInclude<ExtArgs> | null
    /**
     * Filter, which TaskNotification to fetch.
     */
    where: TaskNotificationWhereUniqueInput
  }

  /**
   * TaskNotification findUniqueOrThrow
   */
  export type TaskNotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskNotification
     */
    select?: TaskNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskNotification
     */
    omit?: TaskNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskNotificationInclude<ExtArgs> | null
    /**
     * Filter, which TaskNotification to fetch.
     */
    where: TaskNotificationWhereUniqueInput
  }

  /**
   * TaskNotification findFirst
   */
  export type TaskNotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskNotification
     */
    select?: TaskNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskNotification
     */
    omit?: TaskNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskNotificationInclude<ExtArgs> | null
    /**
     * Filter, which TaskNotification to fetch.
     */
    where?: TaskNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskNotifications to fetch.
     */
    orderBy?: TaskNotificationOrderByWithRelationInput | TaskNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskNotifications.
     */
    cursor?: TaskNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskNotifications.
     */
    distinct?: TaskNotificationScalarFieldEnum | TaskNotificationScalarFieldEnum[]
  }

  /**
   * TaskNotification findFirstOrThrow
   */
  export type TaskNotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskNotification
     */
    select?: TaskNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskNotification
     */
    omit?: TaskNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskNotificationInclude<ExtArgs> | null
    /**
     * Filter, which TaskNotification to fetch.
     */
    where?: TaskNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskNotifications to fetch.
     */
    orderBy?: TaskNotificationOrderByWithRelationInput | TaskNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskNotifications.
     */
    cursor?: TaskNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskNotifications.
     */
    distinct?: TaskNotificationScalarFieldEnum | TaskNotificationScalarFieldEnum[]
  }

  /**
   * TaskNotification findMany
   */
  export type TaskNotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskNotification
     */
    select?: TaskNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskNotification
     */
    omit?: TaskNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskNotificationInclude<ExtArgs> | null
    /**
     * Filter, which TaskNotifications to fetch.
     */
    where?: TaskNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskNotifications to fetch.
     */
    orderBy?: TaskNotificationOrderByWithRelationInput | TaskNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TaskNotifications.
     */
    cursor?: TaskNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskNotifications.
     */
    skip?: number
    distinct?: TaskNotificationScalarFieldEnum | TaskNotificationScalarFieldEnum[]
  }

  /**
   * TaskNotification create
   */
  export type TaskNotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskNotification
     */
    select?: TaskNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskNotification
     */
    omit?: TaskNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskNotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a TaskNotification.
     */
    data: XOR<TaskNotificationCreateInput, TaskNotificationUncheckedCreateInput>
  }

  /**
   * TaskNotification createMany
   */
  export type TaskNotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TaskNotifications.
     */
    data: TaskNotificationCreateManyInput | TaskNotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TaskNotification createManyAndReturn
   */
  export type TaskNotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskNotification
     */
    select?: TaskNotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaskNotification
     */
    omit?: TaskNotificationOmit<ExtArgs> | null
    /**
     * The data used to create many TaskNotifications.
     */
    data: TaskNotificationCreateManyInput | TaskNotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskNotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaskNotification update
   */
  export type TaskNotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskNotification
     */
    select?: TaskNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskNotification
     */
    omit?: TaskNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskNotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a TaskNotification.
     */
    data: XOR<TaskNotificationUpdateInput, TaskNotificationUncheckedUpdateInput>
    /**
     * Choose, which TaskNotification to update.
     */
    where: TaskNotificationWhereUniqueInput
  }

  /**
   * TaskNotification updateMany
   */
  export type TaskNotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TaskNotifications.
     */
    data: XOR<TaskNotificationUpdateManyMutationInput, TaskNotificationUncheckedUpdateManyInput>
    /**
     * Filter which TaskNotifications to update
     */
    where?: TaskNotificationWhereInput
    /**
     * Limit how many TaskNotifications to update.
     */
    limit?: number
  }

  /**
   * TaskNotification updateManyAndReturn
   */
  export type TaskNotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskNotification
     */
    select?: TaskNotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaskNotification
     */
    omit?: TaskNotificationOmit<ExtArgs> | null
    /**
     * The data used to update TaskNotifications.
     */
    data: XOR<TaskNotificationUpdateManyMutationInput, TaskNotificationUncheckedUpdateManyInput>
    /**
     * Filter which TaskNotifications to update
     */
    where?: TaskNotificationWhereInput
    /**
     * Limit how many TaskNotifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskNotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaskNotification upsert
   */
  export type TaskNotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskNotification
     */
    select?: TaskNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskNotification
     */
    omit?: TaskNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskNotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the TaskNotification to update in case it exists.
     */
    where: TaskNotificationWhereUniqueInput
    /**
     * In case the TaskNotification found by the `where` argument doesn't exist, create a new TaskNotification with this data.
     */
    create: XOR<TaskNotificationCreateInput, TaskNotificationUncheckedCreateInput>
    /**
     * In case the TaskNotification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskNotificationUpdateInput, TaskNotificationUncheckedUpdateInput>
  }

  /**
   * TaskNotification delete
   */
  export type TaskNotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskNotification
     */
    select?: TaskNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskNotification
     */
    omit?: TaskNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskNotificationInclude<ExtArgs> | null
    /**
     * Filter which TaskNotification to delete.
     */
    where: TaskNotificationWhereUniqueInput
  }

  /**
   * TaskNotification deleteMany
   */
  export type TaskNotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskNotifications to delete
     */
    where?: TaskNotificationWhereInput
    /**
     * Limit how many TaskNotifications to delete.
     */
    limit?: number
  }

  /**
   * TaskNotification.replies
   */
  export type TaskNotification$repliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReply
     */
    select?: TaskReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReply
     */
    omit?: TaskReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyInclude<ExtArgs> | null
    where?: TaskReplyWhereInput
    orderBy?: TaskReplyOrderByWithRelationInput | TaskReplyOrderByWithRelationInput[]
    cursor?: TaskReplyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskReplyScalarFieldEnum | TaskReplyScalarFieldEnum[]
  }

  /**
   * TaskNotification without action
   */
  export type TaskNotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskNotification
     */
    select?: TaskNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskNotification
     */
    omit?: TaskNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskNotificationInclude<ExtArgs> | null
  }


  /**
   * Model TaskReply
   */

  export type AggregateTaskReply = {
    _count: TaskReplyCountAggregateOutputType | null
    _min: TaskReplyMinAggregateOutputType | null
    _max: TaskReplyMaxAggregateOutputType | null
  }

  export type TaskReplyMinAggregateOutputType = {
    id: string | null
    taskNotificationId: string | null
    message: string | null
    taskStatus: string | null
    createdById: string | null
    createdAt: Date | null
  }

  export type TaskReplyMaxAggregateOutputType = {
    id: string | null
    taskNotificationId: string | null
    message: string | null
    taskStatus: string | null
    createdById: string | null
    createdAt: Date | null
  }

  export type TaskReplyCountAggregateOutputType = {
    id: number
    taskNotificationId: number
    message: number
    taskStatus: number
    createdById: number
    createdAt: number
    _all: number
  }


  export type TaskReplyMinAggregateInputType = {
    id?: true
    taskNotificationId?: true
    message?: true
    taskStatus?: true
    createdById?: true
    createdAt?: true
  }

  export type TaskReplyMaxAggregateInputType = {
    id?: true
    taskNotificationId?: true
    message?: true
    taskStatus?: true
    createdById?: true
    createdAt?: true
  }

  export type TaskReplyCountAggregateInputType = {
    id?: true
    taskNotificationId?: true
    message?: true
    taskStatus?: true
    createdById?: true
    createdAt?: true
    _all?: true
  }

  export type TaskReplyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskReply to aggregate.
     */
    where?: TaskReplyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskReplies to fetch.
     */
    orderBy?: TaskReplyOrderByWithRelationInput | TaskReplyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskReplyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskReplies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskReplies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TaskReplies
    **/
    _count?: true | TaskReplyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskReplyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskReplyMaxAggregateInputType
  }

  export type GetTaskReplyAggregateType<T extends TaskReplyAggregateArgs> = {
        [P in keyof T & keyof AggregateTaskReply]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTaskReply[P]>
      : GetScalarType<T[P], AggregateTaskReply[P]>
  }




  export type TaskReplyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskReplyWhereInput
    orderBy?: TaskReplyOrderByWithAggregationInput | TaskReplyOrderByWithAggregationInput[]
    by: TaskReplyScalarFieldEnum[] | TaskReplyScalarFieldEnum
    having?: TaskReplyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskReplyCountAggregateInputType | true
    _min?: TaskReplyMinAggregateInputType
    _max?: TaskReplyMaxAggregateInputType
  }

  export type TaskReplyGroupByOutputType = {
    id: string
    taskNotificationId: string
    message: string
    taskStatus: string | null
    createdById: string
    createdAt: Date
    _count: TaskReplyCountAggregateOutputType | null
    _min: TaskReplyMinAggregateOutputType | null
    _max: TaskReplyMaxAggregateOutputType | null
  }

  type GetTaskReplyGroupByPayload<T extends TaskReplyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskReplyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskReplyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskReplyGroupByOutputType[P]>
            : GetScalarType<T[P], TaskReplyGroupByOutputType[P]>
        }
      >
    >


  export type TaskReplySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskNotificationId?: boolean
    message?: boolean
    taskStatus?: boolean
    createdById?: boolean
    createdAt?: boolean
    taskNotification?: boolean | TaskNotificationDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    documents?: boolean | TaskReply$documentsArgs<ExtArgs>
    _count?: boolean | TaskReplyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskReply"]>

  export type TaskReplySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskNotificationId?: boolean
    message?: boolean
    taskStatus?: boolean
    createdById?: boolean
    createdAt?: boolean
    taskNotification?: boolean | TaskNotificationDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskReply"]>

  export type TaskReplySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskNotificationId?: boolean
    message?: boolean
    taskStatus?: boolean
    createdById?: boolean
    createdAt?: boolean
    taskNotification?: boolean | TaskNotificationDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskReply"]>

  export type TaskReplySelectScalar = {
    id?: boolean
    taskNotificationId?: boolean
    message?: boolean
    taskStatus?: boolean
    createdById?: boolean
    createdAt?: boolean
  }

  export type TaskReplyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "taskNotificationId" | "message" | "taskStatus" | "createdById" | "createdAt", ExtArgs["result"]["taskReply"]>
  export type TaskReplyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    taskNotification?: boolean | TaskNotificationDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    documents?: boolean | TaskReply$documentsArgs<ExtArgs>
    _count?: boolean | TaskReplyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TaskReplyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    taskNotification?: boolean | TaskNotificationDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TaskReplyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    taskNotification?: boolean | TaskNotificationDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TaskReplyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TaskReply"
    objects: {
      taskNotification: Prisma.$TaskNotificationPayload<ExtArgs>
      createdBy: Prisma.$UserPayload<ExtArgs>
      documents: Prisma.$TaskReplyDocumentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      taskNotificationId: string
      message: string
      taskStatus: string | null
      createdById: string
      createdAt: Date
    }, ExtArgs["result"]["taskReply"]>
    composites: {}
  }

  type TaskReplyGetPayload<S extends boolean | null | undefined | TaskReplyDefaultArgs> = $Result.GetResult<Prisma.$TaskReplyPayload, S>

  type TaskReplyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TaskReplyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TaskReplyCountAggregateInputType | true
    }

  export interface TaskReplyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TaskReply'], meta: { name: 'TaskReply' } }
    /**
     * Find zero or one TaskReply that matches the filter.
     * @param {TaskReplyFindUniqueArgs} args - Arguments to find a TaskReply
     * @example
     * // Get one TaskReply
     * const taskReply = await prisma.taskReply.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskReplyFindUniqueArgs>(args: SelectSubset<T, TaskReplyFindUniqueArgs<ExtArgs>>): Prisma__TaskReplyClient<$Result.GetResult<Prisma.$TaskReplyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TaskReply that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TaskReplyFindUniqueOrThrowArgs} args - Arguments to find a TaskReply
     * @example
     * // Get one TaskReply
     * const taskReply = await prisma.taskReply.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskReplyFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskReplyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskReplyClient<$Result.GetResult<Prisma.$TaskReplyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TaskReply that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskReplyFindFirstArgs} args - Arguments to find a TaskReply
     * @example
     * // Get one TaskReply
     * const taskReply = await prisma.taskReply.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskReplyFindFirstArgs>(args?: SelectSubset<T, TaskReplyFindFirstArgs<ExtArgs>>): Prisma__TaskReplyClient<$Result.GetResult<Prisma.$TaskReplyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TaskReply that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskReplyFindFirstOrThrowArgs} args - Arguments to find a TaskReply
     * @example
     * // Get one TaskReply
     * const taskReply = await prisma.taskReply.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskReplyFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskReplyFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskReplyClient<$Result.GetResult<Prisma.$TaskReplyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TaskReplies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskReplyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TaskReplies
     * const taskReplies = await prisma.taskReply.findMany()
     * 
     * // Get first 10 TaskReplies
     * const taskReplies = await prisma.taskReply.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskReplyWithIdOnly = await prisma.taskReply.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskReplyFindManyArgs>(args?: SelectSubset<T, TaskReplyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskReplyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TaskReply.
     * @param {TaskReplyCreateArgs} args - Arguments to create a TaskReply.
     * @example
     * // Create one TaskReply
     * const TaskReply = await prisma.taskReply.create({
     *   data: {
     *     // ... data to create a TaskReply
     *   }
     * })
     * 
     */
    create<T extends TaskReplyCreateArgs>(args: SelectSubset<T, TaskReplyCreateArgs<ExtArgs>>): Prisma__TaskReplyClient<$Result.GetResult<Prisma.$TaskReplyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TaskReplies.
     * @param {TaskReplyCreateManyArgs} args - Arguments to create many TaskReplies.
     * @example
     * // Create many TaskReplies
     * const taskReply = await prisma.taskReply.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskReplyCreateManyArgs>(args?: SelectSubset<T, TaskReplyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TaskReplies and returns the data saved in the database.
     * @param {TaskReplyCreateManyAndReturnArgs} args - Arguments to create many TaskReplies.
     * @example
     * // Create many TaskReplies
     * const taskReply = await prisma.taskReply.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TaskReplies and only return the `id`
     * const taskReplyWithIdOnly = await prisma.taskReply.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskReplyCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskReplyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskReplyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TaskReply.
     * @param {TaskReplyDeleteArgs} args - Arguments to delete one TaskReply.
     * @example
     * // Delete one TaskReply
     * const TaskReply = await prisma.taskReply.delete({
     *   where: {
     *     // ... filter to delete one TaskReply
     *   }
     * })
     * 
     */
    delete<T extends TaskReplyDeleteArgs>(args: SelectSubset<T, TaskReplyDeleteArgs<ExtArgs>>): Prisma__TaskReplyClient<$Result.GetResult<Prisma.$TaskReplyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TaskReply.
     * @param {TaskReplyUpdateArgs} args - Arguments to update one TaskReply.
     * @example
     * // Update one TaskReply
     * const taskReply = await prisma.taskReply.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskReplyUpdateArgs>(args: SelectSubset<T, TaskReplyUpdateArgs<ExtArgs>>): Prisma__TaskReplyClient<$Result.GetResult<Prisma.$TaskReplyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TaskReplies.
     * @param {TaskReplyDeleteManyArgs} args - Arguments to filter TaskReplies to delete.
     * @example
     * // Delete a few TaskReplies
     * const { count } = await prisma.taskReply.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskReplyDeleteManyArgs>(args?: SelectSubset<T, TaskReplyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskReplies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskReplyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TaskReplies
     * const taskReply = await prisma.taskReply.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskReplyUpdateManyArgs>(args: SelectSubset<T, TaskReplyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskReplies and returns the data updated in the database.
     * @param {TaskReplyUpdateManyAndReturnArgs} args - Arguments to update many TaskReplies.
     * @example
     * // Update many TaskReplies
     * const taskReply = await prisma.taskReply.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TaskReplies and only return the `id`
     * const taskReplyWithIdOnly = await prisma.taskReply.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TaskReplyUpdateManyAndReturnArgs>(args: SelectSubset<T, TaskReplyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskReplyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TaskReply.
     * @param {TaskReplyUpsertArgs} args - Arguments to update or create a TaskReply.
     * @example
     * // Update or create a TaskReply
     * const taskReply = await prisma.taskReply.upsert({
     *   create: {
     *     // ... data to create a TaskReply
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TaskReply we want to update
     *   }
     * })
     */
    upsert<T extends TaskReplyUpsertArgs>(args: SelectSubset<T, TaskReplyUpsertArgs<ExtArgs>>): Prisma__TaskReplyClient<$Result.GetResult<Prisma.$TaskReplyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TaskReplies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskReplyCountArgs} args - Arguments to filter TaskReplies to count.
     * @example
     * // Count the number of TaskReplies
     * const count = await prisma.taskReply.count({
     *   where: {
     *     // ... the filter for the TaskReplies we want to count
     *   }
     * })
    **/
    count<T extends TaskReplyCountArgs>(
      args?: Subset<T, TaskReplyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskReplyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TaskReply.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskReplyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TaskReplyAggregateArgs>(args: Subset<T, TaskReplyAggregateArgs>): Prisma.PrismaPromise<GetTaskReplyAggregateType<T>>

    /**
     * Group by TaskReply.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskReplyGroupByArgs} args - Group by arguments.
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
      T extends TaskReplyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskReplyGroupByArgs['orderBy'] }
        : { orderBy?: TaskReplyGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TaskReplyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskReplyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TaskReply model
   */
  readonly fields: TaskReplyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TaskReply.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskReplyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    taskNotification<T extends TaskNotificationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TaskNotificationDefaultArgs<ExtArgs>>): Prisma__TaskNotificationClient<$Result.GetResult<Prisma.$TaskNotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    documents<T extends TaskReply$documentsArgs<ExtArgs> = {}>(args?: Subset<T, TaskReply$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskReplyDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the TaskReply model
   */
  interface TaskReplyFieldRefs {
    readonly id: FieldRef<"TaskReply", 'String'>
    readonly taskNotificationId: FieldRef<"TaskReply", 'String'>
    readonly message: FieldRef<"TaskReply", 'String'>
    readonly taskStatus: FieldRef<"TaskReply", 'String'>
    readonly createdById: FieldRef<"TaskReply", 'String'>
    readonly createdAt: FieldRef<"TaskReply", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TaskReply findUnique
   */
  export type TaskReplyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReply
     */
    select?: TaskReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReply
     */
    omit?: TaskReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyInclude<ExtArgs> | null
    /**
     * Filter, which TaskReply to fetch.
     */
    where: TaskReplyWhereUniqueInput
  }

  /**
   * TaskReply findUniqueOrThrow
   */
  export type TaskReplyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReply
     */
    select?: TaskReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReply
     */
    omit?: TaskReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyInclude<ExtArgs> | null
    /**
     * Filter, which TaskReply to fetch.
     */
    where: TaskReplyWhereUniqueInput
  }

  /**
   * TaskReply findFirst
   */
  export type TaskReplyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReply
     */
    select?: TaskReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReply
     */
    omit?: TaskReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyInclude<ExtArgs> | null
    /**
     * Filter, which TaskReply to fetch.
     */
    where?: TaskReplyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskReplies to fetch.
     */
    orderBy?: TaskReplyOrderByWithRelationInput | TaskReplyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskReplies.
     */
    cursor?: TaskReplyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskReplies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskReplies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskReplies.
     */
    distinct?: TaskReplyScalarFieldEnum | TaskReplyScalarFieldEnum[]
  }

  /**
   * TaskReply findFirstOrThrow
   */
  export type TaskReplyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReply
     */
    select?: TaskReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReply
     */
    omit?: TaskReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyInclude<ExtArgs> | null
    /**
     * Filter, which TaskReply to fetch.
     */
    where?: TaskReplyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskReplies to fetch.
     */
    orderBy?: TaskReplyOrderByWithRelationInput | TaskReplyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskReplies.
     */
    cursor?: TaskReplyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskReplies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskReplies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskReplies.
     */
    distinct?: TaskReplyScalarFieldEnum | TaskReplyScalarFieldEnum[]
  }

  /**
   * TaskReply findMany
   */
  export type TaskReplyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReply
     */
    select?: TaskReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReply
     */
    omit?: TaskReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyInclude<ExtArgs> | null
    /**
     * Filter, which TaskReplies to fetch.
     */
    where?: TaskReplyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskReplies to fetch.
     */
    orderBy?: TaskReplyOrderByWithRelationInput | TaskReplyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TaskReplies.
     */
    cursor?: TaskReplyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskReplies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskReplies.
     */
    skip?: number
    distinct?: TaskReplyScalarFieldEnum | TaskReplyScalarFieldEnum[]
  }

  /**
   * TaskReply create
   */
  export type TaskReplyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReply
     */
    select?: TaskReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReply
     */
    omit?: TaskReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyInclude<ExtArgs> | null
    /**
     * The data needed to create a TaskReply.
     */
    data: XOR<TaskReplyCreateInput, TaskReplyUncheckedCreateInput>
  }

  /**
   * TaskReply createMany
   */
  export type TaskReplyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TaskReplies.
     */
    data: TaskReplyCreateManyInput | TaskReplyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TaskReply createManyAndReturn
   */
  export type TaskReplyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReply
     */
    select?: TaskReplySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReply
     */
    omit?: TaskReplyOmit<ExtArgs> | null
    /**
     * The data used to create many TaskReplies.
     */
    data: TaskReplyCreateManyInput | TaskReplyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaskReply update
   */
  export type TaskReplyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReply
     */
    select?: TaskReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReply
     */
    omit?: TaskReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyInclude<ExtArgs> | null
    /**
     * The data needed to update a TaskReply.
     */
    data: XOR<TaskReplyUpdateInput, TaskReplyUncheckedUpdateInput>
    /**
     * Choose, which TaskReply to update.
     */
    where: TaskReplyWhereUniqueInput
  }

  /**
   * TaskReply updateMany
   */
  export type TaskReplyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TaskReplies.
     */
    data: XOR<TaskReplyUpdateManyMutationInput, TaskReplyUncheckedUpdateManyInput>
    /**
     * Filter which TaskReplies to update
     */
    where?: TaskReplyWhereInput
    /**
     * Limit how many TaskReplies to update.
     */
    limit?: number
  }

  /**
   * TaskReply updateManyAndReturn
   */
  export type TaskReplyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReply
     */
    select?: TaskReplySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReply
     */
    omit?: TaskReplyOmit<ExtArgs> | null
    /**
     * The data used to update TaskReplies.
     */
    data: XOR<TaskReplyUpdateManyMutationInput, TaskReplyUncheckedUpdateManyInput>
    /**
     * Filter which TaskReplies to update
     */
    where?: TaskReplyWhereInput
    /**
     * Limit how many TaskReplies to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaskReply upsert
   */
  export type TaskReplyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReply
     */
    select?: TaskReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReply
     */
    omit?: TaskReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyInclude<ExtArgs> | null
    /**
     * The filter to search for the TaskReply to update in case it exists.
     */
    where: TaskReplyWhereUniqueInput
    /**
     * In case the TaskReply found by the `where` argument doesn't exist, create a new TaskReply with this data.
     */
    create: XOR<TaskReplyCreateInput, TaskReplyUncheckedCreateInput>
    /**
     * In case the TaskReply was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskReplyUpdateInput, TaskReplyUncheckedUpdateInput>
  }

  /**
   * TaskReply delete
   */
  export type TaskReplyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReply
     */
    select?: TaskReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReply
     */
    omit?: TaskReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyInclude<ExtArgs> | null
    /**
     * Filter which TaskReply to delete.
     */
    where: TaskReplyWhereUniqueInput
  }

  /**
   * TaskReply deleteMany
   */
  export type TaskReplyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskReplies to delete
     */
    where?: TaskReplyWhereInput
    /**
     * Limit how many TaskReplies to delete.
     */
    limit?: number
  }

  /**
   * TaskReply.documents
   */
  export type TaskReply$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReplyDocument
     */
    select?: TaskReplyDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReplyDocument
     */
    omit?: TaskReplyDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyDocumentInclude<ExtArgs> | null
    where?: TaskReplyDocumentWhereInput
    orderBy?: TaskReplyDocumentOrderByWithRelationInput | TaskReplyDocumentOrderByWithRelationInput[]
    cursor?: TaskReplyDocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskReplyDocumentScalarFieldEnum | TaskReplyDocumentScalarFieldEnum[]
  }

  /**
   * TaskReply without action
   */
  export type TaskReplyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReply
     */
    select?: TaskReplySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReply
     */
    omit?: TaskReplyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyInclude<ExtArgs> | null
  }


  /**
   * Model TaskReplyDocument
   */

  export type AggregateTaskReplyDocument = {
    _count: TaskReplyDocumentCountAggregateOutputType | null
    _avg: TaskReplyDocumentAvgAggregateOutputType | null
    _sum: TaskReplyDocumentSumAggregateOutputType | null
    _min: TaskReplyDocumentMinAggregateOutputType | null
    _max: TaskReplyDocumentMaxAggregateOutputType | null
  }

  export type TaskReplyDocumentAvgAggregateOutputType = {
    fileSize: number | null
  }

  export type TaskReplyDocumentSumAggregateOutputType = {
    fileSize: number | null
  }

  export type TaskReplyDocumentMinAggregateOutputType = {
    id: string | null
    replyId: string | null
    fileName: string | null
    fileUrl: string | null
    fileSize: number | null
    fileType: string | null
    createdAt: Date | null
  }

  export type TaskReplyDocumentMaxAggregateOutputType = {
    id: string | null
    replyId: string | null
    fileName: string | null
    fileUrl: string | null
    fileSize: number | null
    fileType: string | null
    createdAt: Date | null
  }

  export type TaskReplyDocumentCountAggregateOutputType = {
    id: number
    replyId: number
    fileName: number
    fileUrl: number
    fileSize: number
    fileType: number
    createdAt: number
    _all: number
  }


  export type TaskReplyDocumentAvgAggregateInputType = {
    fileSize?: true
  }

  export type TaskReplyDocumentSumAggregateInputType = {
    fileSize?: true
  }

  export type TaskReplyDocumentMinAggregateInputType = {
    id?: true
    replyId?: true
    fileName?: true
    fileUrl?: true
    fileSize?: true
    fileType?: true
    createdAt?: true
  }

  export type TaskReplyDocumentMaxAggregateInputType = {
    id?: true
    replyId?: true
    fileName?: true
    fileUrl?: true
    fileSize?: true
    fileType?: true
    createdAt?: true
  }

  export type TaskReplyDocumentCountAggregateInputType = {
    id?: true
    replyId?: true
    fileName?: true
    fileUrl?: true
    fileSize?: true
    fileType?: true
    createdAt?: true
    _all?: true
  }

  export type TaskReplyDocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskReplyDocument to aggregate.
     */
    where?: TaskReplyDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskReplyDocuments to fetch.
     */
    orderBy?: TaskReplyDocumentOrderByWithRelationInput | TaskReplyDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskReplyDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskReplyDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskReplyDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TaskReplyDocuments
    **/
    _count?: true | TaskReplyDocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TaskReplyDocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TaskReplyDocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskReplyDocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskReplyDocumentMaxAggregateInputType
  }

  export type GetTaskReplyDocumentAggregateType<T extends TaskReplyDocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateTaskReplyDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTaskReplyDocument[P]>
      : GetScalarType<T[P], AggregateTaskReplyDocument[P]>
  }




  export type TaskReplyDocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskReplyDocumentWhereInput
    orderBy?: TaskReplyDocumentOrderByWithAggregationInput | TaskReplyDocumentOrderByWithAggregationInput[]
    by: TaskReplyDocumentScalarFieldEnum[] | TaskReplyDocumentScalarFieldEnum
    having?: TaskReplyDocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskReplyDocumentCountAggregateInputType | true
    _avg?: TaskReplyDocumentAvgAggregateInputType
    _sum?: TaskReplyDocumentSumAggregateInputType
    _min?: TaskReplyDocumentMinAggregateInputType
    _max?: TaskReplyDocumentMaxAggregateInputType
  }

  export type TaskReplyDocumentGroupByOutputType = {
    id: string
    replyId: string
    fileName: string
    fileUrl: string
    fileSize: number | null
    fileType: string | null
    createdAt: Date
    _count: TaskReplyDocumentCountAggregateOutputType | null
    _avg: TaskReplyDocumentAvgAggregateOutputType | null
    _sum: TaskReplyDocumentSumAggregateOutputType | null
    _min: TaskReplyDocumentMinAggregateOutputType | null
    _max: TaskReplyDocumentMaxAggregateOutputType | null
  }

  type GetTaskReplyDocumentGroupByPayload<T extends TaskReplyDocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskReplyDocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskReplyDocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskReplyDocumentGroupByOutputType[P]>
            : GetScalarType<T[P], TaskReplyDocumentGroupByOutputType[P]>
        }
      >
    >


  export type TaskReplyDocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    replyId?: boolean
    fileName?: boolean
    fileUrl?: boolean
    fileSize?: boolean
    fileType?: boolean
    createdAt?: boolean
    reply?: boolean | TaskReplyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskReplyDocument"]>

  export type TaskReplyDocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    replyId?: boolean
    fileName?: boolean
    fileUrl?: boolean
    fileSize?: boolean
    fileType?: boolean
    createdAt?: boolean
    reply?: boolean | TaskReplyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskReplyDocument"]>

  export type TaskReplyDocumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    replyId?: boolean
    fileName?: boolean
    fileUrl?: boolean
    fileSize?: boolean
    fileType?: boolean
    createdAt?: boolean
    reply?: boolean | TaskReplyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskReplyDocument"]>

  export type TaskReplyDocumentSelectScalar = {
    id?: boolean
    replyId?: boolean
    fileName?: boolean
    fileUrl?: boolean
    fileSize?: boolean
    fileType?: boolean
    createdAt?: boolean
  }

  export type TaskReplyDocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "replyId" | "fileName" | "fileUrl" | "fileSize" | "fileType" | "createdAt", ExtArgs["result"]["taskReplyDocument"]>
  export type TaskReplyDocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reply?: boolean | TaskReplyDefaultArgs<ExtArgs>
  }
  export type TaskReplyDocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reply?: boolean | TaskReplyDefaultArgs<ExtArgs>
  }
  export type TaskReplyDocumentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reply?: boolean | TaskReplyDefaultArgs<ExtArgs>
  }

  export type $TaskReplyDocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TaskReplyDocument"
    objects: {
      reply: Prisma.$TaskReplyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      replyId: string
      fileName: string
      fileUrl: string
      fileSize: number | null
      fileType: string | null
      createdAt: Date
    }, ExtArgs["result"]["taskReplyDocument"]>
    composites: {}
  }

  type TaskReplyDocumentGetPayload<S extends boolean | null | undefined | TaskReplyDocumentDefaultArgs> = $Result.GetResult<Prisma.$TaskReplyDocumentPayload, S>

  type TaskReplyDocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TaskReplyDocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TaskReplyDocumentCountAggregateInputType | true
    }

  export interface TaskReplyDocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TaskReplyDocument'], meta: { name: 'TaskReplyDocument' } }
    /**
     * Find zero or one TaskReplyDocument that matches the filter.
     * @param {TaskReplyDocumentFindUniqueArgs} args - Arguments to find a TaskReplyDocument
     * @example
     * // Get one TaskReplyDocument
     * const taskReplyDocument = await prisma.taskReplyDocument.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskReplyDocumentFindUniqueArgs>(args: SelectSubset<T, TaskReplyDocumentFindUniqueArgs<ExtArgs>>): Prisma__TaskReplyDocumentClient<$Result.GetResult<Prisma.$TaskReplyDocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TaskReplyDocument that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TaskReplyDocumentFindUniqueOrThrowArgs} args - Arguments to find a TaskReplyDocument
     * @example
     * // Get one TaskReplyDocument
     * const taskReplyDocument = await prisma.taskReplyDocument.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskReplyDocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskReplyDocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskReplyDocumentClient<$Result.GetResult<Prisma.$TaskReplyDocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TaskReplyDocument that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskReplyDocumentFindFirstArgs} args - Arguments to find a TaskReplyDocument
     * @example
     * // Get one TaskReplyDocument
     * const taskReplyDocument = await prisma.taskReplyDocument.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskReplyDocumentFindFirstArgs>(args?: SelectSubset<T, TaskReplyDocumentFindFirstArgs<ExtArgs>>): Prisma__TaskReplyDocumentClient<$Result.GetResult<Prisma.$TaskReplyDocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TaskReplyDocument that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskReplyDocumentFindFirstOrThrowArgs} args - Arguments to find a TaskReplyDocument
     * @example
     * // Get one TaskReplyDocument
     * const taskReplyDocument = await prisma.taskReplyDocument.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskReplyDocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskReplyDocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskReplyDocumentClient<$Result.GetResult<Prisma.$TaskReplyDocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TaskReplyDocuments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskReplyDocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TaskReplyDocuments
     * const taskReplyDocuments = await prisma.taskReplyDocument.findMany()
     * 
     * // Get first 10 TaskReplyDocuments
     * const taskReplyDocuments = await prisma.taskReplyDocument.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskReplyDocumentWithIdOnly = await prisma.taskReplyDocument.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskReplyDocumentFindManyArgs>(args?: SelectSubset<T, TaskReplyDocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskReplyDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TaskReplyDocument.
     * @param {TaskReplyDocumentCreateArgs} args - Arguments to create a TaskReplyDocument.
     * @example
     * // Create one TaskReplyDocument
     * const TaskReplyDocument = await prisma.taskReplyDocument.create({
     *   data: {
     *     // ... data to create a TaskReplyDocument
     *   }
     * })
     * 
     */
    create<T extends TaskReplyDocumentCreateArgs>(args: SelectSubset<T, TaskReplyDocumentCreateArgs<ExtArgs>>): Prisma__TaskReplyDocumentClient<$Result.GetResult<Prisma.$TaskReplyDocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TaskReplyDocuments.
     * @param {TaskReplyDocumentCreateManyArgs} args - Arguments to create many TaskReplyDocuments.
     * @example
     * // Create many TaskReplyDocuments
     * const taskReplyDocument = await prisma.taskReplyDocument.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskReplyDocumentCreateManyArgs>(args?: SelectSubset<T, TaskReplyDocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TaskReplyDocuments and returns the data saved in the database.
     * @param {TaskReplyDocumentCreateManyAndReturnArgs} args - Arguments to create many TaskReplyDocuments.
     * @example
     * // Create many TaskReplyDocuments
     * const taskReplyDocument = await prisma.taskReplyDocument.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TaskReplyDocuments and only return the `id`
     * const taskReplyDocumentWithIdOnly = await prisma.taskReplyDocument.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskReplyDocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskReplyDocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskReplyDocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TaskReplyDocument.
     * @param {TaskReplyDocumentDeleteArgs} args - Arguments to delete one TaskReplyDocument.
     * @example
     * // Delete one TaskReplyDocument
     * const TaskReplyDocument = await prisma.taskReplyDocument.delete({
     *   where: {
     *     // ... filter to delete one TaskReplyDocument
     *   }
     * })
     * 
     */
    delete<T extends TaskReplyDocumentDeleteArgs>(args: SelectSubset<T, TaskReplyDocumentDeleteArgs<ExtArgs>>): Prisma__TaskReplyDocumentClient<$Result.GetResult<Prisma.$TaskReplyDocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TaskReplyDocument.
     * @param {TaskReplyDocumentUpdateArgs} args - Arguments to update one TaskReplyDocument.
     * @example
     * // Update one TaskReplyDocument
     * const taskReplyDocument = await prisma.taskReplyDocument.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskReplyDocumentUpdateArgs>(args: SelectSubset<T, TaskReplyDocumentUpdateArgs<ExtArgs>>): Prisma__TaskReplyDocumentClient<$Result.GetResult<Prisma.$TaskReplyDocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TaskReplyDocuments.
     * @param {TaskReplyDocumentDeleteManyArgs} args - Arguments to filter TaskReplyDocuments to delete.
     * @example
     * // Delete a few TaskReplyDocuments
     * const { count } = await prisma.taskReplyDocument.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskReplyDocumentDeleteManyArgs>(args?: SelectSubset<T, TaskReplyDocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskReplyDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskReplyDocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TaskReplyDocuments
     * const taskReplyDocument = await prisma.taskReplyDocument.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskReplyDocumentUpdateManyArgs>(args: SelectSubset<T, TaskReplyDocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskReplyDocuments and returns the data updated in the database.
     * @param {TaskReplyDocumentUpdateManyAndReturnArgs} args - Arguments to update many TaskReplyDocuments.
     * @example
     * // Update many TaskReplyDocuments
     * const taskReplyDocument = await prisma.taskReplyDocument.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TaskReplyDocuments and only return the `id`
     * const taskReplyDocumentWithIdOnly = await prisma.taskReplyDocument.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TaskReplyDocumentUpdateManyAndReturnArgs>(args: SelectSubset<T, TaskReplyDocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskReplyDocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TaskReplyDocument.
     * @param {TaskReplyDocumentUpsertArgs} args - Arguments to update or create a TaskReplyDocument.
     * @example
     * // Update or create a TaskReplyDocument
     * const taskReplyDocument = await prisma.taskReplyDocument.upsert({
     *   create: {
     *     // ... data to create a TaskReplyDocument
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TaskReplyDocument we want to update
     *   }
     * })
     */
    upsert<T extends TaskReplyDocumentUpsertArgs>(args: SelectSubset<T, TaskReplyDocumentUpsertArgs<ExtArgs>>): Prisma__TaskReplyDocumentClient<$Result.GetResult<Prisma.$TaskReplyDocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TaskReplyDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskReplyDocumentCountArgs} args - Arguments to filter TaskReplyDocuments to count.
     * @example
     * // Count the number of TaskReplyDocuments
     * const count = await prisma.taskReplyDocument.count({
     *   where: {
     *     // ... the filter for the TaskReplyDocuments we want to count
     *   }
     * })
    **/
    count<T extends TaskReplyDocumentCountArgs>(
      args?: Subset<T, TaskReplyDocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskReplyDocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TaskReplyDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskReplyDocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TaskReplyDocumentAggregateArgs>(args: Subset<T, TaskReplyDocumentAggregateArgs>): Prisma.PrismaPromise<GetTaskReplyDocumentAggregateType<T>>

    /**
     * Group by TaskReplyDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskReplyDocumentGroupByArgs} args - Group by arguments.
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
      T extends TaskReplyDocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskReplyDocumentGroupByArgs['orderBy'] }
        : { orderBy?: TaskReplyDocumentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TaskReplyDocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskReplyDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TaskReplyDocument model
   */
  readonly fields: TaskReplyDocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TaskReplyDocument.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskReplyDocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reply<T extends TaskReplyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TaskReplyDefaultArgs<ExtArgs>>): Prisma__TaskReplyClient<$Result.GetResult<Prisma.$TaskReplyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the TaskReplyDocument model
   */
  interface TaskReplyDocumentFieldRefs {
    readonly id: FieldRef<"TaskReplyDocument", 'String'>
    readonly replyId: FieldRef<"TaskReplyDocument", 'String'>
    readonly fileName: FieldRef<"TaskReplyDocument", 'String'>
    readonly fileUrl: FieldRef<"TaskReplyDocument", 'String'>
    readonly fileSize: FieldRef<"TaskReplyDocument", 'Int'>
    readonly fileType: FieldRef<"TaskReplyDocument", 'String'>
    readonly createdAt: FieldRef<"TaskReplyDocument", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TaskReplyDocument findUnique
   */
  export type TaskReplyDocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReplyDocument
     */
    select?: TaskReplyDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReplyDocument
     */
    omit?: TaskReplyDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyDocumentInclude<ExtArgs> | null
    /**
     * Filter, which TaskReplyDocument to fetch.
     */
    where: TaskReplyDocumentWhereUniqueInput
  }

  /**
   * TaskReplyDocument findUniqueOrThrow
   */
  export type TaskReplyDocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReplyDocument
     */
    select?: TaskReplyDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReplyDocument
     */
    omit?: TaskReplyDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyDocumentInclude<ExtArgs> | null
    /**
     * Filter, which TaskReplyDocument to fetch.
     */
    where: TaskReplyDocumentWhereUniqueInput
  }

  /**
   * TaskReplyDocument findFirst
   */
  export type TaskReplyDocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReplyDocument
     */
    select?: TaskReplyDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReplyDocument
     */
    omit?: TaskReplyDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyDocumentInclude<ExtArgs> | null
    /**
     * Filter, which TaskReplyDocument to fetch.
     */
    where?: TaskReplyDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskReplyDocuments to fetch.
     */
    orderBy?: TaskReplyDocumentOrderByWithRelationInput | TaskReplyDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskReplyDocuments.
     */
    cursor?: TaskReplyDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskReplyDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskReplyDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskReplyDocuments.
     */
    distinct?: TaskReplyDocumentScalarFieldEnum | TaskReplyDocumentScalarFieldEnum[]
  }

  /**
   * TaskReplyDocument findFirstOrThrow
   */
  export type TaskReplyDocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReplyDocument
     */
    select?: TaskReplyDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReplyDocument
     */
    omit?: TaskReplyDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyDocumentInclude<ExtArgs> | null
    /**
     * Filter, which TaskReplyDocument to fetch.
     */
    where?: TaskReplyDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskReplyDocuments to fetch.
     */
    orderBy?: TaskReplyDocumentOrderByWithRelationInput | TaskReplyDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskReplyDocuments.
     */
    cursor?: TaskReplyDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskReplyDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskReplyDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskReplyDocuments.
     */
    distinct?: TaskReplyDocumentScalarFieldEnum | TaskReplyDocumentScalarFieldEnum[]
  }

  /**
   * TaskReplyDocument findMany
   */
  export type TaskReplyDocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReplyDocument
     */
    select?: TaskReplyDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReplyDocument
     */
    omit?: TaskReplyDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyDocumentInclude<ExtArgs> | null
    /**
     * Filter, which TaskReplyDocuments to fetch.
     */
    where?: TaskReplyDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskReplyDocuments to fetch.
     */
    orderBy?: TaskReplyDocumentOrderByWithRelationInput | TaskReplyDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TaskReplyDocuments.
     */
    cursor?: TaskReplyDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskReplyDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskReplyDocuments.
     */
    skip?: number
    distinct?: TaskReplyDocumentScalarFieldEnum | TaskReplyDocumentScalarFieldEnum[]
  }

  /**
   * TaskReplyDocument create
   */
  export type TaskReplyDocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReplyDocument
     */
    select?: TaskReplyDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReplyDocument
     */
    omit?: TaskReplyDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyDocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a TaskReplyDocument.
     */
    data: XOR<TaskReplyDocumentCreateInput, TaskReplyDocumentUncheckedCreateInput>
  }

  /**
   * TaskReplyDocument createMany
   */
  export type TaskReplyDocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TaskReplyDocuments.
     */
    data: TaskReplyDocumentCreateManyInput | TaskReplyDocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TaskReplyDocument createManyAndReturn
   */
  export type TaskReplyDocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReplyDocument
     */
    select?: TaskReplyDocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReplyDocument
     */
    omit?: TaskReplyDocumentOmit<ExtArgs> | null
    /**
     * The data used to create many TaskReplyDocuments.
     */
    data: TaskReplyDocumentCreateManyInput | TaskReplyDocumentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyDocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaskReplyDocument update
   */
  export type TaskReplyDocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReplyDocument
     */
    select?: TaskReplyDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReplyDocument
     */
    omit?: TaskReplyDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyDocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a TaskReplyDocument.
     */
    data: XOR<TaskReplyDocumentUpdateInput, TaskReplyDocumentUncheckedUpdateInput>
    /**
     * Choose, which TaskReplyDocument to update.
     */
    where: TaskReplyDocumentWhereUniqueInput
  }

  /**
   * TaskReplyDocument updateMany
   */
  export type TaskReplyDocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TaskReplyDocuments.
     */
    data: XOR<TaskReplyDocumentUpdateManyMutationInput, TaskReplyDocumentUncheckedUpdateManyInput>
    /**
     * Filter which TaskReplyDocuments to update
     */
    where?: TaskReplyDocumentWhereInput
    /**
     * Limit how many TaskReplyDocuments to update.
     */
    limit?: number
  }

  /**
   * TaskReplyDocument updateManyAndReturn
   */
  export type TaskReplyDocumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReplyDocument
     */
    select?: TaskReplyDocumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReplyDocument
     */
    omit?: TaskReplyDocumentOmit<ExtArgs> | null
    /**
     * The data used to update TaskReplyDocuments.
     */
    data: XOR<TaskReplyDocumentUpdateManyMutationInput, TaskReplyDocumentUncheckedUpdateManyInput>
    /**
     * Filter which TaskReplyDocuments to update
     */
    where?: TaskReplyDocumentWhereInput
    /**
     * Limit how many TaskReplyDocuments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyDocumentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaskReplyDocument upsert
   */
  export type TaskReplyDocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReplyDocument
     */
    select?: TaskReplyDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReplyDocument
     */
    omit?: TaskReplyDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyDocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the TaskReplyDocument to update in case it exists.
     */
    where: TaskReplyDocumentWhereUniqueInput
    /**
     * In case the TaskReplyDocument found by the `where` argument doesn't exist, create a new TaskReplyDocument with this data.
     */
    create: XOR<TaskReplyDocumentCreateInput, TaskReplyDocumentUncheckedCreateInput>
    /**
     * In case the TaskReplyDocument was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskReplyDocumentUpdateInput, TaskReplyDocumentUncheckedUpdateInput>
  }

  /**
   * TaskReplyDocument delete
   */
  export type TaskReplyDocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReplyDocument
     */
    select?: TaskReplyDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReplyDocument
     */
    omit?: TaskReplyDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyDocumentInclude<ExtArgs> | null
    /**
     * Filter which TaskReplyDocument to delete.
     */
    where: TaskReplyDocumentWhereUniqueInput
  }

  /**
   * TaskReplyDocument deleteMany
   */
  export type TaskReplyDocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskReplyDocuments to delete
     */
    where?: TaskReplyDocumentWhereInput
    /**
     * Limit how many TaskReplyDocuments to delete.
     */
    limit?: number
  }

  /**
   * TaskReplyDocument without action
   */
  export type TaskReplyDocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskReplyDocument
     */
    select?: TaskReplyDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskReplyDocument
     */
    omit?: TaskReplyDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskReplyDocumentInclude<ExtArgs> | null
  }


  /**
   * Model Document
   */

  export type AggregateDocument = {
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  export type DocumentAvgAggregateOutputType = {
    fileSize: number | null
    amount: number | null
  }

  export type DocumentSumAggregateOutputType = {
    fileSize: number | null
    amount: number | null
  }

  export type DocumentMinAggregateOutputType = {
    id: string | null
    documentCode: string | null
    type: $Enums.DocumentType | null
    title: string | null
    description: string | null
    status: $Enums.DocumentStatus | null
    filePath: string | null
    fileName: string | null
    fileSize: number | null
    amount: number | null
    purpose: string | null
    district: $Enums.District | null
    projectRef: string | null
    releasedAt: Date | null
    releasedTo: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentMaxAggregateOutputType = {
    id: string | null
    documentCode: string | null
    type: $Enums.DocumentType | null
    title: string | null
    description: string | null
    status: $Enums.DocumentStatus | null
    filePath: string | null
    fileName: string | null
    fileSize: number | null
    amount: number | null
    purpose: string | null
    district: $Enums.District | null
    projectRef: string | null
    releasedAt: Date | null
    releasedTo: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentCountAggregateOutputType = {
    id: number
    documentCode: number
    type: number
    title: number
    description: number
    status: number
    filePath: number
    fileName: number
    fileSize: number
    amount: number
    purpose: number
    district: number
    projectRef: number
    releasedAt: number
    releasedTo: number
    createdById: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DocumentAvgAggregateInputType = {
    fileSize?: true
    amount?: true
  }

  export type DocumentSumAggregateInputType = {
    fileSize?: true
    amount?: true
  }

  export type DocumentMinAggregateInputType = {
    id?: true
    documentCode?: true
    type?: true
    title?: true
    description?: true
    status?: true
    filePath?: true
    fileName?: true
    fileSize?: true
    amount?: true
    purpose?: true
    district?: true
    projectRef?: true
    releasedAt?: true
    releasedTo?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentMaxAggregateInputType = {
    id?: true
    documentCode?: true
    type?: true
    title?: true
    description?: true
    status?: true
    filePath?: true
    fileName?: true
    fileSize?: true
    amount?: true
    purpose?: true
    district?: true
    projectRef?: true
    releasedAt?: true
    releasedTo?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentCountAggregateInputType = {
    id?: true
    documentCode?: true
    type?: true
    title?: true
    description?: true
    status?: true
    filePath?: true
    fileName?: true
    fileSize?: true
    amount?: true
    purpose?: true
    district?: true
    projectRef?: true
    releasedAt?: true
    releasedTo?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Document to aggregate.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Documents
    **/
    _count?: true | DocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentMaxAggregateInputType
  }

  export type GetDocumentAggregateType<T extends DocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocument[P]>
      : GetScalarType<T[P], AggregateDocument[P]>
  }




  export type DocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithAggregationInput | DocumentOrderByWithAggregationInput[]
    by: DocumentScalarFieldEnum[] | DocumentScalarFieldEnum
    having?: DocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentCountAggregateInputType | true
    _avg?: DocumentAvgAggregateInputType
    _sum?: DocumentSumAggregateInputType
    _min?: DocumentMinAggregateInputType
    _max?: DocumentMaxAggregateInputType
  }

  export type DocumentGroupByOutputType = {
    id: string
    documentCode: string
    type: $Enums.DocumentType
    title: string
    description: string | null
    status: $Enums.DocumentStatus
    filePath: string | null
    fileName: string | null
    fileSize: number | null
    amount: number | null
    purpose: string | null
    district: $Enums.District
    projectRef: string | null
    releasedAt: Date | null
    releasedTo: string | null
    createdById: string
    createdAt: Date
    updatedAt: Date
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  type GetDocumentGroupByPayload<T extends DocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentGroupByOutputType[P]>
        }
      >
    >


  export type DocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentCode?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    filePath?: boolean
    fileName?: boolean
    fileSize?: boolean
    amount?: boolean
    purpose?: boolean
    district?: boolean
    projectRef?: boolean
    releasedAt?: boolean
    releasedTo?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentCode?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    filePath?: boolean
    fileName?: boolean
    fileSize?: boolean
    amount?: boolean
    purpose?: boolean
    district?: boolean
    projectRef?: boolean
    releasedAt?: boolean
    releasedTo?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentCode?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    filePath?: boolean
    fileName?: boolean
    fileSize?: boolean
    amount?: boolean
    purpose?: boolean
    district?: boolean
    projectRef?: boolean
    releasedAt?: boolean
    releasedTo?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectScalar = {
    id?: boolean
    documentCode?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    filePath?: boolean
    fileName?: boolean
    fileSize?: boolean
    amount?: boolean
    purpose?: boolean
    district?: boolean
    projectRef?: boolean
    releasedAt?: boolean
    releasedTo?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "documentCode" | "type" | "title" | "description" | "status" | "filePath" | "fileName" | "fileSize" | "amount" | "purpose" | "district" | "projectRef" | "releasedAt" | "releasedTo" | "createdById" | "createdAt" | "updatedAt", ExtArgs["result"]["document"]>
  export type DocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Document"
    objects: {
      createdBy: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      documentCode: string
      type: $Enums.DocumentType
      title: string
      description: string | null
      status: $Enums.DocumentStatus
      filePath: string | null
      fileName: string | null
      fileSize: number | null
      amount: number | null
      purpose: string | null
      district: $Enums.District
      projectRef: string | null
      releasedAt: Date | null
      releasedTo: string | null
      createdById: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["document"]>
    composites: {}
  }

  type DocumentGetPayload<S extends boolean | null | undefined | DocumentDefaultArgs> = $Result.GetResult<Prisma.$DocumentPayload, S>

  type DocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DocumentCountAggregateInputType | true
    }

  export interface DocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Document'], meta: { name: 'Document' } }
    /**
     * Find zero or one Document that matches the filter.
     * @param {DocumentFindUniqueArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentFindUniqueArgs>(args: SelectSubset<T, DocumentFindUniqueArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Document that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DocumentFindUniqueOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentFindFirstArgs>(args?: SelectSubset<T, DocumentFindFirstArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Documents
     * const documents = await prisma.document.findMany()
     * 
     * // Get first 10 Documents
     * const documents = await prisma.document.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentWithIdOnly = await prisma.document.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentFindManyArgs>(args?: SelectSubset<T, DocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Document.
     * @param {DocumentCreateArgs} args - Arguments to create a Document.
     * @example
     * // Create one Document
     * const Document = await prisma.document.create({
     *   data: {
     *     // ... data to create a Document
     *   }
     * })
     * 
     */
    create<T extends DocumentCreateArgs>(args: SelectSubset<T, DocumentCreateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Documents.
     * @param {DocumentCreateManyArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentCreateManyArgs>(args?: SelectSubset<T, DocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Documents and returns the data saved in the database.
     * @param {DocumentCreateManyAndReturnArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Document.
     * @param {DocumentDeleteArgs} args - Arguments to delete one Document.
     * @example
     * // Delete one Document
     * const Document = await prisma.document.delete({
     *   where: {
     *     // ... filter to delete one Document
     *   }
     * })
     * 
     */
    delete<T extends DocumentDeleteArgs>(args: SelectSubset<T, DocumentDeleteArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Document.
     * @param {DocumentUpdateArgs} args - Arguments to update one Document.
     * @example
     * // Update one Document
     * const document = await prisma.document.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentUpdateArgs>(args: SelectSubset<T, DocumentUpdateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Documents.
     * @param {DocumentDeleteManyArgs} args - Arguments to filter Documents to delete.
     * @example
     * // Delete a few Documents
     * const { count } = await prisma.document.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentDeleteManyArgs>(args?: SelectSubset<T, DocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentUpdateManyArgs>(args: SelectSubset<T, DocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents and returns the data updated in the database.
     * @param {DocumentUpdateManyAndReturnArgs} args - Arguments to update many Documents.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DocumentUpdateManyAndReturnArgs>(args: SelectSubset<T, DocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Document.
     * @param {DocumentUpsertArgs} args - Arguments to update or create a Document.
     * @example
     * // Update or create a Document
     * const document = await prisma.document.upsert({
     *   create: {
     *     // ... data to create a Document
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Document we want to update
     *   }
     * })
     */
    upsert<T extends DocumentUpsertArgs>(args: SelectSubset<T, DocumentUpsertArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentCountArgs} args - Arguments to filter Documents to count.
     * @example
     * // Count the number of Documents
     * const count = await prisma.document.count({
     *   where: {
     *     // ... the filter for the Documents we want to count
     *   }
     * })
    **/
    count<T extends DocumentCountArgs>(
      args?: Subset<T, DocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DocumentAggregateArgs>(args: Subset<T, DocumentAggregateArgs>): Prisma.PrismaPromise<GetDocumentAggregateType<T>>

    /**
     * Group by Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentGroupByArgs} args - Group by arguments.
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
      T extends DocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentGroupByArgs['orderBy'] }
        : { orderBy?: DocumentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Document model
   */
  readonly fields: DocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Document.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Document model
   */
  interface DocumentFieldRefs {
    readonly id: FieldRef<"Document", 'String'>
    readonly documentCode: FieldRef<"Document", 'String'>
    readonly type: FieldRef<"Document", 'DocumentType'>
    readonly title: FieldRef<"Document", 'String'>
    readonly description: FieldRef<"Document", 'String'>
    readonly status: FieldRef<"Document", 'DocumentStatus'>
    readonly filePath: FieldRef<"Document", 'String'>
    readonly fileName: FieldRef<"Document", 'String'>
    readonly fileSize: FieldRef<"Document", 'Int'>
    readonly amount: FieldRef<"Document", 'Float'>
    readonly purpose: FieldRef<"Document", 'String'>
    readonly district: FieldRef<"Document", 'District'>
    readonly projectRef: FieldRef<"Document", 'String'>
    readonly releasedAt: FieldRef<"Document", 'DateTime'>
    readonly releasedTo: FieldRef<"Document", 'String'>
    readonly createdById: FieldRef<"Document", 'String'>
    readonly createdAt: FieldRef<"Document", 'DateTime'>
    readonly updatedAt: FieldRef<"Document", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Document findUnique
   */
  export type DocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findUniqueOrThrow
   */
  export type DocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findFirst
   */
  export type DocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findFirstOrThrow
   */
  export type DocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findMany
   */
  export type DocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Documents to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document create
   */
  export type DocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a Document.
     */
    data: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
  }

  /**
   * Document createMany
   */
  export type DocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Document createManyAndReturn
   */
  export type DocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document update
   */
  export type DocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a Document.
     */
    data: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
    /**
     * Choose, which Document to update.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document updateMany
   */
  export type DocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
  }

  /**
   * Document updateManyAndReturn
   */
  export type DocumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document upsert
   */
  export type DocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the Document to update in case it exists.
     */
    where: DocumentWhereUniqueInput
    /**
     * In case the Document found by the `where` argument doesn't exist, create a new Document with this data.
     */
    create: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
    /**
     * In case the Document was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
  }

  /**
   * Document delete
   */
  export type DocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter which Document to delete.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document deleteMany
   */
  export type DocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Documents to delete
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to delete.
     */
    limit?: number
  }

  /**
   * Document without action
   */
  export type DocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
  }


  /**
   * Model ProjectFile
   */

  export type AggregateProjectFile = {
    _count: ProjectFileCountAggregateOutputType | null
    _avg: ProjectFileAvgAggregateOutputType | null
    _sum: ProjectFileSumAggregateOutputType | null
    _min: ProjectFileMinAggregateOutputType | null
    _max: ProjectFileMaxAggregateOutputType | null
  }

  export type ProjectFileAvgAggregateOutputType = {
    fileSize: number | null
  }

  export type ProjectFileSumAggregateOutputType = {
    fileSize: number | null
  }

  export type ProjectFileMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    fileName: string | null
    fileUrl: string | null
    fileType: $Enums.ProjectFileType | null
    fileSize: number | null
    createdById: string | null
    createdAt: Date | null
  }

  export type ProjectFileMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    fileName: string | null
    fileUrl: string | null
    fileType: $Enums.ProjectFileType | null
    fileSize: number | null
    createdById: string | null
    createdAt: Date | null
  }

  export type ProjectFileCountAggregateOutputType = {
    id: number
    projectId: number
    fileName: number
    fileUrl: number
    fileType: number
    fileSize: number
    createdById: number
    createdAt: number
    _all: number
  }


  export type ProjectFileAvgAggregateInputType = {
    fileSize?: true
  }

  export type ProjectFileSumAggregateInputType = {
    fileSize?: true
  }

  export type ProjectFileMinAggregateInputType = {
    id?: true
    projectId?: true
    fileName?: true
    fileUrl?: true
    fileType?: true
    fileSize?: true
    createdById?: true
    createdAt?: true
  }

  export type ProjectFileMaxAggregateInputType = {
    id?: true
    projectId?: true
    fileName?: true
    fileUrl?: true
    fileType?: true
    fileSize?: true
    createdById?: true
    createdAt?: true
  }

  export type ProjectFileCountAggregateInputType = {
    id?: true
    projectId?: true
    fileName?: true
    fileUrl?: true
    fileType?: true
    fileSize?: true
    createdById?: true
    createdAt?: true
    _all?: true
  }

  export type ProjectFileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectFile to aggregate.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectFiles
    **/
    _count?: true | ProjectFileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectFileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectFileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectFileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectFileMaxAggregateInputType
  }

  export type GetProjectFileAggregateType<T extends ProjectFileAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectFile[P]>
      : GetScalarType<T[P], AggregateProjectFile[P]>
  }




  export type ProjectFileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectFileWhereInput
    orderBy?: ProjectFileOrderByWithAggregationInput | ProjectFileOrderByWithAggregationInput[]
    by: ProjectFileScalarFieldEnum[] | ProjectFileScalarFieldEnum
    having?: ProjectFileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectFileCountAggregateInputType | true
    _avg?: ProjectFileAvgAggregateInputType
    _sum?: ProjectFileSumAggregateInputType
    _min?: ProjectFileMinAggregateInputType
    _max?: ProjectFileMaxAggregateInputType
  }

  export type ProjectFileGroupByOutputType = {
    id: string
    projectId: string
    fileName: string
    fileUrl: string
    fileType: $Enums.ProjectFileType
    fileSize: number | null
    createdById: string
    createdAt: Date
    _count: ProjectFileCountAggregateOutputType | null
    _avg: ProjectFileAvgAggregateOutputType | null
    _sum: ProjectFileSumAggregateOutputType | null
    _min: ProjectFileMinAggregateOutputType | null
    _max: ProjectFileMaxAggregateOutputType | null
  }

  type GetProjectFileGroupByPayload<T extends ProjectFileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectFileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectFileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectFileGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectFileGroupByOutputType[P]>
        }
      >
    >


  export type ProjectFileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    fileName?: boolean
    fileUrl?: boolean
    fileType?: boolean
    fileSize?: boolean
    createdById?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectFile"]>

  export type ProjectFileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    fileName?: boolean
    fileUrl?: boolean
    fileType?: boolean
    fileSize?: boolean
    createdById?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectFile"]>

  export type ProjectFileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    fileName?: boolean
    fileUrl?: boolean
    fileType?: boolean
    fileSize?: boolean
    createdById?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectFile"]>

  export type ProjectFileSelectScalar = {
    id?: boolean
    projectId?: boolean
    fileName?: boolean
    fileUrl?: boolean
    fileType?: boolean
    fileSize?: boolean
    createdById?: boolean
    createdAt?: boolean
  }

  export type ProjectFileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "fileName" | "fileUrl" | "fileType" | "fileSize" | "createdById" | "createdAt", ExtArgs["result"]["projectFile"]>
  export type ProjectFileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProjectFileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProjectFileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProjectFilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectFile"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      createdBy: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      fileName: string
      fileUrl: string
      fileType: $Enums.ProjectFileType
      fileSize: number | null
      createdById: string
      createdAt: Date
    }, ExtArgs["result"]["projectFile"]>
    composites: {}
  }

  type ProjectFileGetPayload<S extends boolean | null | undefined | ProjectFileDefaultArgs> = $Result.GetResult<Prisma.$ProjectFilePayload, S>

  type ProjectFileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectFileCountAggregateInputType | true
    }

  export interface ProjectFileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectFile'], meta: { name: 'ProjectFile' } }
    /**
     * Find zero or one ProjectFile that matches the filter.
     * @param {ProjectFileFindUniqueArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFileFindUniqueArgs>(args: SelectSubset<T, ProjectFileFindUniqueArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProjectFile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFileFindUniqueOrThrowArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFileFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectFile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindFirstArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFileFindFirstArgs>(args?: SelectSubset<T, ProjectFileFindFirstArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectFile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindFirstOrThrowArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFileFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProjectFiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectFiles
     * const projectFiles = await prisma.projectFile.findMany()
     * 
     * // Get first 10 ProjectFiles
     * const projectFiles = await prisma.projectFile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectFileWithIdOnly = await prisma.projectFile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFileFindManyArgs>(args?: SelectSubset<T, ProjectFileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProjectFile.
     * @param {ProjectFileCreateArgs} args - Arguments to create a ProjectFile.
     * @example
     * // Create one ProjectFile
     * const ProjectFile = await prisma.projectFile.create({
     *   data: {
     *     // ... data to create a ProjectFile
     *   }
     * })
     * 
     */
    create<T extends ProjectFileCreateArgs>(args: SelectSubset<T, ProjectFileCreateArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProjectFiles.
     * @param {ProjectFileCreateManyArgs} args - Arguments to create many ProjectFiles.
     * @example
     * // Create many ProjectFiles
     * const projectFile = await prisma.projectFile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectFileCreateManyArgs>(args?: SelectSubset<T, ProjectFileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectFiles and returns the data saved in the database.
     * @param {ProjectFileCreateManyAndReturnArgs} args - Arguments to create many ProjectFiles.
     * @example
     * // Create many ProjectFiles
     * const projectFile = await prisma.projectFile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProjectFiles and only return the `id`
     * const projectFileWithIdOnly = await prisma.projectFile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectFileCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectFileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProjectFile.
     * @param {ProjectFileDeleteArgs} args - Arguments to delete one ProjectFile.
     * @example
     * // Delete one ProjectFile
     * const ProjectFile = await prisma.projectFile.delete({
     *   where: {
     *     // ... filter to delete one ProjectFile
     *   }
     * })
     * 
     */
    delete<T extends ProjectFileDeleteArgs>(args: SelectSubset<T, ProjectFileDeleteArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProjectFile.
     * @param {ProjectFileUpdateArgs} args - Arguments to update one ProjectFile.
     * @example
     * // Update one ProjectFile
     * const projectFile = await prisma.projectFile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectFileUpdateArgs>(args: SelectSubset<T, ProjectFileUpdateArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProjectFiles.
     * @param {ProjectFileDeleteManyArgs} args - Arguments to filter ProjectFiles to delete.
     * @example
     * // Delete a few ProjectFiles
     * const { count } = await prisma.projectFile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectFileDeleteManyArgs>(args?: SelectSubset<T, ProjectFileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectFiles
     * const projectFile = await prisma.projectFile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectFileUpdateManyArgs>(args: SelectSubset<T, ProjectFileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectFiles and returns the data updated in the database.
     * @param {ProjectFileUpdateManyAndReturnArgs} args - Arguments to update many ProjectFiles.
     * @example
     * // Update many ProjectFiles
     * const projectFile = await prisma.projectFile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProjectFiles and only return the `id`
     * const projectFileWithIdOnly = await prisma.projectFile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectFileUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectFileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProjectFile.
     * @param {ProjectFileUpsertArgs} args - Arguments to update or create a ProjectFile.
     * @example
     * // Update or create a ProjectFile
     * const projectFile = await prisma.projectFile.upsert({
     *   create: {
     *     // ... data to create a ProjectFile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectFile we want to update
     *   }
     * })
     */
    upsert<T extends ProjectFileUpsertArgs>(args: SelectSubset<T, ProjectFileUpsertArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProjectFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileCountArgs} args - Arguments to filter ProjectFiles to count.
     * @example
     * // Count the number of ProjectFiles
     * const count = await prisma.projectFile.count({
     *   where: {
     *     // ... the filter for the ProjectFiles we want to count
     *   }
     * })
    **/
    count<T extends ProjectFileCountArgs>(
      args?: Subset<T, ProjectFileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectFileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProjectFileAggregateArgs>(args: Subset<T, ProjectFileAggregateArgs>): Prisma.PrismaPromise<GetProjectFileAggregateType<T>>

    /**
     * Group by ProjectFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileGroupByArgs} args - Group by arguments.
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
      T extends ProjectFileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectFileGroupByArgs['orderBy'] }
        : { orderBy?: ProjectFileGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProjectFileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectFile model
   */
  readonly fields: ProjectFileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectFile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectFileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ProjectFile model
   */
  interface ProjectFileFieldRefs {
    readonly id: FieldRef<"ProjectFile", 'String'>
    readonly projectId: FieldRef<"ProjectFile", 'String'>
    readonly fileName: FieldRef<"ProjectFile", 'String'>
    readonly fileUrl: FieldRef<"ProjectFile", 'String'>
    readonly fileType: FieldRef<"ProjectFile", 'ProjectFileType'>
    readonly fileSize: FieldRef<"ProjectFile", 'Int'>
    readonly createdById: FieldRef<"ProjectFile", 'String'>
    readonly createdAt: FieldRef<"ProjectFile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProjectFile findUnique
   */
  export type ProjectFileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile findUniqueOrThrow
   */
  export type ProjectFileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile findFirst
   */
  export type ProjectFileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectFiles.
     */
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile findFirstOrThrow
   */
  export type ProjectFileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectFiles.
     */
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile findMany
   */
  export type ProjectFileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFiles to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile create
   */
  export type ProjectFileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectFile.
     */
    data: XOR<ProjectFileCreateInput, ProjectFileUncheckedCreateInput>
  }

  /**
   * ProjectFile createMany
   */
  export type ProjectFileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectFiles.
     */
    data: ProjectFileCreateManyInput | ProjectFileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProjectFile createManyAndReturn
   */
  export type ProjectFileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectFiles.
     */
    data: ProjectFileCreateManyInput | ProjectFileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectFile update
   */
  export type ProjectFileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectFile.
     */
    data: XOR<ProjectFileUpdateInput, ProjectFileUncheckedUpdateInput>
    /**
     * Choose, which ProjectFile to update.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile updateMany
   */
  export type ProjectFileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectFiles.
     */
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyInput>
    /**
     * Filter which ProjectFiles to update
     */
    where?: ProjectFileWhereInput
    /**
     * Limit how many ProjectFiles to update.
     */
    limit?: number
  }

  /**
   * ProjectFile updateManyAndReturn
   */
  export type ProjectFileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * The data used to update ProjectFiles.
     */
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyInput>
    /**
     * Filter which ProjectFiles to update
     */
    where?: ProjectFileWhereInput
    /**
     * Limit how many ProjectFiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectFile upsert
   */
  export type ProjectFileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectFile to update in case it exists.
     */
    where: ProjectFileWhereUniqueInput
    /**
     * In case the ProjectFile found by the `where` argument doesn't exist, create a new ProjectFile with this data.
     */
    create: XOR<ProjectFileCreateInput, ProjectFileUncheckedCreateInput>
    /**
     * In case the ProjectFile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectFileUpdateInput, ProjectFileUncheckedUpdateInput>
  }

  /**
   * ProjectFile delete
   */
  export type ProjectFileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter which ProjectFile to delete.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile deleteMany
   */
  export type ProjectFileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectFiles to delete
     */
    where?: ProjectFileWhereInput
    /**
     * Limit how many ProjectFiles to delete.
     */
    limit?: number
  }

  /**
   * ProjectFile without action
   */
  export type ProjectFileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
  }


  /**
   * Model Post
   */

  export type AggregatePost = {
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  export type PostAvgAggregateOutputType = {
    id: number | null
  }

  export type PostSumAggregateOutputType = {
    id: number | null
  }

  export type PostMinAggregateOutputType = {
    id: number | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    createdById: string | null
  }

  export type PostMaxAggregateOutputType = {
    id: number | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    createdById: string | null
  }

  export type PostCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    updatedAt: number
    createdById: number
    _all: number
  }


  export type PostAvgAggregateInputType = {
    id?: true
  }

  export type PostSumAggregateInputType = {
    id?: true
  }

  export type PostMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    createdById?: true
  }

  export type PostMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    createdById?: true
  }

  export type PostCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    createdById?: true
    _all?: true
  }

  export type PostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Post to aggregate.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Posts
    **/
    _count?: true | PostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PostAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PostSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostMaxAggregateInputType
  }

  export type GetPostAggregateType<T extends PostAggregateArgs> = {
        [P in keyof T & keyof AggregatePost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePost[P]>
      : GetScalarType<T[P], AggregatePost[P]>
  }




  export type PostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
    orderBy?: PostOrderByWithAggregationInput | PostOrderByWithAggregationInput[]
    by: PostScalarFieldEnum[] | PostScalarFieldEnum
    having?: PostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostCountAggregateInputType | true
    _avg?: PostAvgAggregateInputType
    _sum?: PostSumAggregateInputType
    _min?: PostMinAggregateInputType
    _max?: PostMaxAggregateInputType
  }

  export type PostGroupByOutputType = {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
    createdById: string
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  type GetPostGroupByPayload<T extends PostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostGroupByOutputType[P]>
            : GetScalarType<T[P], PostGroupByOutputType[P]>
        }
      >
    >


  export type PostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdById?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>

  export type PostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdById?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>

  export type PostSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdById?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>

  export type PostSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdById?: boolean
  }

  export type PostOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt" | "createdById", ExtArgs["result"]["post"]>
  export type PostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PostIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PostIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Post"
    objects: {
      createdBy: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      createdAt: Date
      updatedAt: Date
      createdById: string
    }, ExtArgs["result"]["post"]>
    composites: {}
  }

  type PostGetPayload<S extends boolean | null | undefined | PostDefaultArgs> = $Result.GetResult<Prisma.$PostPayload, S>

  type PostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PostCountAggregateInputType | true
    }

  export interface PostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Post'], meta: { name: 'Post' } }
    /**
     * Find zero or one Post that matches the filter.
     * @param {PostFindUniqueArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostFindUniqueArgs>(args: SelectSubset<T, PostFindUniqueArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Post that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PostFindUniqueOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostFindUniqueOrThrowArgs>(args: SelectSubset<T, PostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostFindFirstArgs>(args?: SelectSubset<T, PostFindFirstArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostFindFirstOrThrowArgs>(args?: SelectSubset<T, PostFindFirstOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Posts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Posts
     * const posts = await prisma.post.findMany()
     * 
     * // Get first 10 Posts
     * const posts = await prisma.post.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postWithIdOnly = await prisma.post.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PostFindManyArgs>(args?: SelectSubset<T, PostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Post.
     * @param {PostCreateArgs} args - Arguments to create a Post.
     * @example
     * // Create one Post
     * const Post = await prisma.post.create({
     *   data: {
     *     // ... data to create a Post
     *   }
     * })
     * 
     */
    create<T extends PostCreateArgs>(args: SelectSubset<T, PostCreateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Posts.
     * @param {PostCreateManyArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PostCreateManyArgs>(args?: SelectSubset<T, PostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Posts and returns the data saved in the database.
     * @param {PostCreateManyAndReturnArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PostCreateManyAndReturnArgs>(args?: SelectSubset<T, PostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Post.
     * @param {PostDeleteArgs} args - Arguments to delete one Post.
     * @example
     * // Delete one Post
     * const Post = await prisma.post.delete({
     *   where: {
     *     // ... filter to delete one Post
     *   }
     * })
     * 
     */
    delete<T extends PostDeleteArgs>(args: SelectSubset<T, PostDeleteArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Post.
     * @param {PostUpdateArgs} args - Arguments to update one Post.
     * @example
     * // Update one Post
     * const post = await prisma.post.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PostUpdateArgs>(args: SelectSubset<T, PostUpdateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Posts.
     * @param {PostDeleteManyArgs} args - Arguments to filter Posts to delete.
     * @example
     * // Delete a few Posts
     * const { count } = await prisma.post.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PostDeleteManyArgs>(args?: SelectSubset<T, PostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PostUpdateManyArgs>(args: SelectSubset<T, PostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts and returns the data updated in the database.
     * @param {PostUpdateManyAndReturnArgs} args - Arguments to update many Posts.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PostUpdateManyAndReturnArgs>(args: SelectSubset<T, PostUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Post.
     * @param {PostUpsertArgs} args - Arguments to update or create a Post.
     * @example
     * // Update or create a Post
     * const post = await prisma.post.upsert({
     *   create: {
     *     // ... data to create a Post
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Post we want to update
     *   }
     * })
     */
    upsert<T extends PostUpsertArgs>(args: SelectSubset<T, PostUpsertArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostCountArgs} args - Arguments to filter Posts to count.
     * @example
     * // Count the number of Posts
     * const count = await prisma.post.count({
     *   where: {
     *     // ... the filter for the Posts we want to count
     *   }
     * })
    **/
    count<T extends PostCountArgs>(
      args?: Subset<T, PostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PostAggregateArgs>(args: Subset<T, PostAggregateArgs>): Prisma.PrismaPromise<GetPostAggregateType<T>>

    /**
     * Group by Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostGroupByArgs} args - Group by arguments.
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
      T extends PostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostGroupByArgs['orderBy'] }
        : { orderBy?: PostGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Post model
   */
  readonly fields: PostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Post.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Post model
   */
  interface PostFieldRefs {
    readonly id: FieldRef<"Post", 'Int'>
    readonly name: FieldRef<"Post", 'String'>
    readonly createdAt: FieldRef<"Post", 'DateTime'>
    readonly updatedAt: FieldRef<"Post", 'DateTime'>
    readonly createdById: FieldRef<"Post", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Post findUnique
   */
  export type PostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findUniqueOrThrow
   */
  export type PostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findFirst
   */
  export type PostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findFirstOrThrow
   */
  export type PostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findMany
   */
  export type PostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Posts to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post create
   */
  export type PostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to create a Post.
     */
    data: XOR<PostCreateInput, PostUncheckedCreateInput>
  }

  /**
   * Post createMany
   */
  export type PostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Post createManyAndReturn
   */
  export type PostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Post update
   */
  export type PostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to update a Post.
     */
    data: XOR<PostUpdateInput, PostUncheckedUpdateInput>
    /**
     * Choose, which Post to update.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post updateMany
   */
  export type PostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to update.
     */
    limit?: number
  }

  /**
   * Post updateManyAndReturn
   */
  export type PostUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Post upsert
   */
  export type PostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The filter to search for the Post to update in case it exists.
     */
    where: PostWhereUniqueInput
    /**
     * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
     */
    create: XOR<PostCreateInput, PostUncheckedCreateInput>
    /**
     * In case the Post was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostUpdateInput, PostUncheckedUpdateInput>
  }

  /**
   * Post delete
   */
  export type PostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter which Post to delete.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post deleteMany
   */
  export type PostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Posts to delete
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to delete.
     */
    limit?: number
  }

  /**
   * Post without action
   */
  export type PostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
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


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    employeeId: 'employeeId',
    designation: 'designation',
    division: 'division',
    sex: 'sex',
    status: 'status',
    emailVerified: 'emailVerified',
    image: 'image',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const UserSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt',
    lastActive: 'lastActive'
  };

  export type UserSessionScalarFieldEnum = (typeof UserSessionScalarFieldEnum)[keyof typeof UserSessionScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    projectCode: 'projectCode',
    title: 'title',
    subType: 'subType',
    modeOfImplementation: 'modeOfImplementation',
    locationImplementation: 'locationImplementation',
    sourceOfFund: 'sourceOfFund',
    projectCost: 'projectCost',
    contractCost: 'contractCost',
    contractorName: 'contractorName',
    projectEngineer: 'projectEngineer',
    budgetYear: 'budgetYear',
    dateStarted: 'dateStarted',
    targetCompletionDate: 'targetCompletionDate',
    duration: 'duration',
    revisedCompletionDate: 'revisedCompletionDate',
    dateCompleted: 'dateCompleted',
    daysSuspended: 'daysSuspended',
    daysExtended: 'daysExtended',
    numFemale: 'numFemale',
    numMale: 'numMale',
    numPersons: 'numPersons',
    numManDays: 'numManDays',
    district: 'district',
    cityMunicipality: 'cityMunicipality',
    barangay: 'barangay',
    purok: 'purok',
    sitio: 'sitio',
    description: 'description',
    status: 'status',
    completionPercentage: 'completionPercentage',
    imageUrl: 'imageUrl',
    documentUrl: 'documentUrl',
    documentName: 'documentName',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const ProjectActivityScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    description: 'description',
    createdById: 'createdById',
    createdAt: 'createdAt'
  };

  export type ProjectActivityScalarFieldEnum = (typeof ProjectActivityScalarFieldEnum)[keyof typeof ProjectActivityScalarFieldEnum]


  export const DisbursementScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    date: 'date',
    referenceNumber: 'referenceNumber',
    amount: 'amount',
    createdById: 'createdById',
    createdAt: 'createdAt'
  };

  export type DisbursementScalarFieldEnum = (typeof DisbursementScalarFieldEnum)[keyof typeof DisbursementScalarFieldEnum]


  export const TaskNotificationScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    notifyUserId: 'notifyUserId',
    priority: 'priority',
    description: 'description',
    acknowledged: 'acknowledged',
    acknowledgedAt: 'acknowledgedAt',
    createdById: 'createdById',
    createdAt: 'createdAt'
  };

  export type TaskNotificationScalarFieldEnum = (typeof TaskNotificationScalarFieldEnum)[keyof typeof TaskNotificationScalarFieldEnum]


  export const TaskReplyScalarFieldEnum: {
    id: 'id',
    taskNotificationId: 'taskNotificationId',
    message: 'message',
    taskStatus: 'taskStatus',
    createdById: 'createdById',
    createdAt: 'createdAt'
  };

  export type TaskReplyScalarFieldEnum = (typeof TaskReplyScalarFieldEnum)[keyof typeof TaskReplyScalarFieldEnum]


  export const TaskReplyDocumentScalarFieldEnum: {
    id: 'id',
    replyId: 'replyId',
    fileName: 'fileName',
    fileUrl: 'fileUrl',
    fileSize: 'fileSize',
    fileType: 'fileType',
    createdAt: 'createdAt'
  };

  export type TaskReplyDocumentScalarFieldEnum = (typeof TaskReplyDocumentScalarFieldEnum)[keyof typeof TaskReplyDocumentScalarFieldEnum]


  export const DocumentScalarFieldEnum: {
    id: 'id',
    documentCode: 'documentCode',
    type: 'type',
    title: 'title',
    description: 'description',
    status: 'status',
    filePath: 'filePath',
    fileName: 'fileName',
    fileSize: 'fileSize',
    amount: 'amount',
    purpose: 'purpose',
    district: 'district',
    projectRef: 'projectRef',
    releasedAt: 'releasedAt',
    releasedTo: 'releasedTo',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DocumentScalarFieldEnum = (typeof DocumentScalarFieldEnum)[keyof typeof DocumentScalarFieldEnum]


  export const ProjectFileScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    fileName: 'fileName',
    fileUrl: 'fileUrl',
    fileType: 'fileType',
    fileSize: 'fileSize',
    createdById: 'createdById',
    createdAt: 'createdAt'
  };

  export type ProjectFileScalarFieldEnum = (typeof ProjectFileScalarFieldEnum)[keyof typeof ProjectFileScalarFieldEnum]


  export const PostScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    createdById: 'createdById'
  };

  export type PostScalarFieldEnum = (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Sex'
   */
  export type EnumSexFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Sex'>
    


  /**
   * Reference to a field of type 'Sex[]'
   */
  export type ListEnumSexFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Sex[]'>
    


  /**
   * Reference to a field of type 'UserStatus'
   */
  export type EnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus'>
    


  /**
   * Reference to a field of type 'UserStatus[]'
   */
  export type ListEnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'ProjectSubType'
   */
  export type EnumProjectSubTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectSubType'>
    


  /**
   * Reference to a field of type 'ProjectSubType[]'
   */
  export type ListEnumProjectSubTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectSubType[]'>
    


  /**
   * Reference to a field of type 'ModeOfImplementation'
   */
  export type EnumModeOfImplementationFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ModeOfImplementation'>
    


  /**
   * Reference to a field of type 'ModeOfImplementation[]'
   */
  export type ListEnumModeOfImplementationFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ModeOfImplementation[]'>
    


  /**
   * Reference to a field of type 'District'
   */
  export type EnumDistrictFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'District'>
    


  /**
   * Reference to a field of type 'District[]'
   */
  export type ListEnumDistrictFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'District[]'>
    


  /**
   * Reference to a field of type 'SourceOfFund'
   */
  export type EnumSourceOfFundFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SourceOfFund'>
    


  /**
   * Reference to a field of type 'SourceOfFund[]'
   */
  export type ListEnumSourceOfFundFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SourceOfFund[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'ProjectStatus'
   */
  export type EnumProjectStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectStatus'>
    


  /**
   * Reference to a field of type 'ProjectStatus[]'
   */
  export type ListEnumProjectStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectStatus[]'>
    


  /**
   * Reference to a field of type 'NotificationPriority'
   */
  export type EnumNotificationPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationPriority'>
    


  /**
   * Reference to a field of type 'NotificationPriority[]'
   */
  export type ListEnumNotificationPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationPriority[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DocumentType'
   */
  export type EnumDocumentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentType'>
    


  /**
   * Reference to a field of type 'DocumentType[]'
   */
  export type ListEnumDocumentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentType[]'>
    


  /**
   * Reference to a field of type 'DocumentStatus'
   */
  export type EnumDocumentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentStatus'>
    


  /**
   * Reference to a field of type 'DocumentStatus[]'
   */
  export type ListEnumDocumentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentStatus[]'>
    


  /**
   * Reference to a field of type 'ProjectFileType'
   */
  export type EnumProjectFileTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectFileType'>
    


  /**
   * Reference to a field of type 'ProjectFileType[]'
   */
  export type ListEnumProjectFileTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectFileType[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    employeeId?: StringNullableFilter<"User"> | string | null
    designation?: StringNullableFilter<"User"> | string | null
    division?: StringNullableFilter<"User"> | string | null
    sex?: EnumSexNullableFilter<"User"> | $Enums.Sex | null
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    posts?: PostListRelationFilter
    projects?: ProjectListRelationFilter
    sessions?: UserSessionListRelationFilter
    documents?: DocumentListRelationFilter
    projectActivities?: ProjectActivityListRelationFilter
    disbursements?: DisbursementListRelationFilter
    taskNotificationsReceived?: TaskNotificationListRelationFilter
    taskNotificationsCreated?: TaskNotificationListRelationFilter
    taskReplies?: TaskReplyListRelationFilter
    projectFiles?: ProjectFileListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    employeeId?: SortOrderInput | SortOrder
    designation?: SortOrderInput | SortOrder
    division?: SortOrderInput | SortOrder
    sex?: SortOrderInput | SortOrder
    status?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    posts?: PostOrderByRelationAggregateInput
    projects?: ProjectOrderByRelationAggregateInput
    sessions?: UserSessionOrderByRelationAggregateInput
    documents?: DocumentOrderByRelationAggregateInput
    projectActivities?: ProjectActivityOrderByRelationAggregateInput
    disbursements?: DisbursementOrderByRelationAggregateInput
    taskNotificationsReceived?: TaskNotificationOrderByRelationAggregateInput
    taskNotificationsCreated?: TaskNotificationOrderByRelationAggregateInput
    taskReplies?: TaskReplyOrderByRelationAggregateInput
    projectFiles?: ProjectFileOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    employeeId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    designation?: StringNullableFilter<"User"> | string | null
    division?: StringNullableFilter<"User"> | string | null
    sex?: EnumSexNullableFilter<"User"> | $Enums.Sex | null
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    posts?: PostListRelationFilter
    projects?: ProjectListRelationFilter
    sessions?: UserSessionListRelationFilter
    documents?: DocumentListRelationFilter
    projectActivities?: ProjectActivityListRelationFilter
    disbursements?: DisbursementListRelationFilter
    taskNotificationsReceived?: TaskNotificationListRelationFilter
    taskNotificationsCreated?: TaskNotificationListRelationFilter
    taskReplies?: TaskReplyListRelationFilter
    projectFiles?: ProjectFileListRelationFilter
  }, "id" | "email" | "employeeId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    employeeId?: SortOrderInput | SortOrder
    designation?: SortOrderInput | SortOrder
    division?: SortOrderInput | SortOrder
    sex?: SortOrderInput | SortOrder
    status?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    employeeId?: StringNullableWithAggregatesFilter<"User"> | string | null
    designation?: StringNullableWithAggregatesFilter<"User"> | string | null
    division?: StringNullableWithAggregatesFilter<"User"> | string | null
    sex?: EnumSexNullableWithAggregatesFilter<"User"> | $Enums.Sex | null
    status?: EnumUserStatusWithAggregatesFilter<"User"> | $Enums.UserStatus
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type UserSessionWhereInput = {
    AND?: UserSessionWhereInput | UserSessionWhereInput[]
    OR?: UserSessionWhereInput[]
    NOT?: UserSessionWhereInput | UserSessionWhereInput[]
    id?: StringFilter<"UserSession"> | string
    userId?: StringFilter<"UserSession"> | string
    ipAddress?: StringNullableFilter<"UserSession"> | string | null
    userAgent?: StringNullableFilter<"UserSession"> | string | null
    createdAt?: DateTimeFilter<"UserSession"> | Date | string
    expiresAt?: DateTimeFilter<"UserSession"> | Date | string
    lastActive?: DateTimeFilter<"UserSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    lastActive?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UserSessionWhereInput | UserSessionWhereInput[]
    OR?: UserSessionWhereInput[]
    NOT?: UserSessionWhereInput | UserSessionWhereInput[]
    userId?: StringFilter<"UserSession"> | string
    ipAddress?: StringNullableFilter<"UserSession"> | string | null
    userAgent?: StringNullableFilter<"UserSession"> | string | null
    createdAt?: DateTimeFilter<"UserSession"> | Date | string
    expiresAt?: DateTimeFilter<"UserSession"> | Date | string
    lastActive?: DateTimeFilter<"UserSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type UserSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    lastActive?: SortOrder
    _count?: UserSessionCountOrderByAggregateInput
    _max?: UserSessionMaxOrderByAggregateInput
    _min?: UserSessionMinOrderByAggregateInput
  }

  export type UserSessionScalarWhereWithAggregatesInput = {
    AND?: UserSessionScalarWhereWithAggregatesInput | UserSessionScalarWhereWithAggregatesInput[]
    OR?: UserSessionScalarWhereWithAggregatesInput[]
    NOT?: UserSessionScalarWhereWithAggregatesInput | UserSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserSession"> | string
    userId?: StringWithAggregatesFilter<"UserSession"> | string
    ipAddress?: StringNullableWithAggregatesFilter<"UserSession"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"UserSession"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"UserSession"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"UserSession"> | Date | string
    lastActive?: DateTimeWithAggregatesFilter<"UserSession"> | Date | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    projectCode?: StringFilter<"Project"> | string
    title?: StringFilter<"Project"> | string
    subType?: EnumProjectSubTypeNullableFilter<"Project"> | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFilter<"Project"> | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFilter<"Project"> | $Enums.District
    sourceOfFund?: EnumSourceOfFundFilter<"Project"> | $Enums.SourceOfFund
    projectCost?: FloatFilter<"Project"> | number
    contractCost?: FloatFilter<"Project"> | number
    contractorName?: StringNullableFilter<"Project"> | string | null
    projectEngineer?: StringNullableFilter<"Project"> | string | null
    budgetYear?: StringNullableFilter<"Project"> | string | null
    dateStarted?: DateTimeNullableFilter<"Project"> | Date | string | null
    targetCompletionDate?: DateTimeNullableFilter<"Project"> | Date | string | null
    duration?: IntFilter<"Project"> | number
    revisedCompletionDate?: DateTimeNullableFilter<"Project"> | Date | string | null
    dateCompleted?: DateTimeNullableFilter<"Project"> | Date | string | null
    daysSuspended?: IntFilter<"Project"> | number
    daysExtended?: IntFilter<"Project"> | number
    numFemale?: IntFilter<"Project"> | number
    numMale?: IntFilter<"Project"> | number
    numPersons?: IntFilter<"Project"> | number
    numManDays?: IntFilter<"Project"> | number
    district?: EnumDistrictNullableFilter<"Project"> | $Enums.District | null
    cityMunicipality?: StringNullableFilter<"Project"> | string | null
    barangay?: StringNullableFilter<"Project"> | string | null
    purok?: StringNullableFilter<"Project"> | string | null
    sitio?: StringNullableFilter<"Project"> | string | null
    description?: StringNullableFilter<"Project"> | string | null
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    completionPercentage?: IntFilter<"Project"> | number
    imageUrl?: StringNullableFilter<"Project"> | string | null
    documentUrl?: StringNullableFilter<"Project"> | string | null
    documentName?: StringNullableFilter<"Project"> | string | null
    createdById?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    activities?: ProjectActivityListRelationFilter
    disbursements?: DisbursementListRelationFilter
    taskNotifications?: TaskNotificationListRelationFilter
    files?: ProjectFileListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    projectCode?: SortOrder
    title?: SortOrder
    subType?: SortOrderInput | SortOrder
    modeOfImplementation?: SortOrder
    locationImplementation?: SortOrder
    sourceOfFund?: SortOrder
    projectCost?: SortOrder
    contractCost?: SortOrder
    contractorName?: SortOrderInput | SortOrder
    projectEngineer?: SortOrderInput | SortOrder
    budgetYear?: SortOrderInput | SortOrder
    dateStarted?: SortOrderInput | SortOrder
    targetCompletionDate?: SortOrderInput | SortOrder
    duration?: SortOrder
    revisedCompletionDate?: SortOrderInput | SortOrder
    dateCompleted?: SortOrderInput | SortOrder
    daysSuspended?: SortOrder
    daysExtended?: SortOrder
    numFemale?: SortOrder
    numMale?: SortOrder
    numPersons?: SortOrder
    numManDays?: SortOrder
    district?: SortOrderInput | SortOrder
    cityMunicipality?: SortOrderInput | SortOrder
    barangay?: SortOrderInput | SortOrder
    purok?: SortOrderInput | SortOrder
    sitio?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    completionPercentage?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    documentUrl?: SortOrderInput | SortOrder
    documentName?: SortOrderInput | SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: UserOrderByWithRelationInput
    activities?: ProjectActivityOrderByRelationAggregateInput
    disbursements?: DisbursementOrderByRelationAggregateInput
    taskNotifications?: TaskNotificationOrderByRelationAggregateInput
    files?: ProjectFileOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    projectCode?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    title?: StringFilter<"Project"> | string
    subType?: EnumProjectSubTypeNullableFilter<"Project"> | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFilter<"Project"> | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFilter<"Project"> | $Enums.District
    sourceOfFund?: EnumSourceOfFundFilter<"Project"> | $Enums.SourceOfFund
    projectCost?: FloatFilter<"Project"> | number
    contractCost?: FloatFilter<"Project"> | number
    contractorName?: StringNullableFilter<"Project"> | string | null
    projectEngineer?: StringNullableFilter<"Project"> | string | null
    budgetYear?: StringNullableFilter<"Project"> | string | null
    dateStarted?: DateTimeNullableFilter<"Project"> | Date | string | null
    targetCompletionDate?: DateTimeNullableFilter<"Project"> | Date | string | null
    duration?: IntFilter<"Project"> | number
    revisedCompletionDate?: DateTimeNullableFilter<"Project"> | Date | string | null
    dateCompleted?: DateTimeNullableFilter<"Project"> | Date | string | null
    daysSuspended?: IntFilter<"Project"> | number
    daysExtended?: IntFilter<"Project"> | number
    numFemale?: IntFilter<"Project"> | number
    numMale?: IntFilter<"Project"> | number
    numPersons?: IntFilter<"Project"> | number
    numManDays?: IntFilter<"Project"> | number
    district?: EnumDistrictNullableFilter<"Project"> | $Enums.District | null
    cityMunicipality?: StringNullableFilter<"Project"> | string | null
    barangay?: StringNullableFilter<"Project"> | string | null
    purok?: StringNullableFilter<"Project"> | string | null
    sitio?: StringNullableFilter<"Project"> | string | null
    description?: StringNullableFilter<"Project"> | string | null
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    completionPercentage?: IntFilter<"Project"> | number
    imageUrl?: StringNullableFilter<"Project"> | string | null
    documentUrl?: StringNullableFilter<"Project"> | string | null
    documentName?: StringNullableFilter<"Project"> | string | null
    createdById?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    activities?: ProjectActivityListRelationFilter
    disbursements?: DisbursementListRelationFilter
    taskNotifications?: TaskNotificationListRelationFilter
    files?: ProjectFileListRelationFilter
  }, "id" | "projectCode">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    projectCode?: SortOrder
    title?: SortOrder
    subType?: SortOrderInput | SortOrder
    modeOfImplementation?: SortOrder
    locationImplementation?: SortOrder
    sourceOfFund?: SortOrder
    projectCost?: SortOrder
    contractCost?: SortOrder
    contractorName?: SortOrderInput | SortOrder
    projectEngineer?: SortOrderInput | SortOrder
    budgetYear?: SortOrderInput | SortOrder
    dateStarted?: SortOrderInput | SortOrder
    targetCompletionDate?: SortOrderInput | SortOrder
    duration?: SortOrder
    revisedCompletionDate?: SortOrderInput | SortOrder
    dateCompleted?: SortOrderInput | SortOrder
    daysSuspended?: SortOrder
    daysExtended?: SortOrder
    numFemale?: SortOrder
    numMale?: SortOrder
    numPersons?: SortOrder
    numManDays?: SortOrder
    district?: SortOrderInput | SortOrder
    cityMunicipality?: SortOrderInput | SortOrder
    barangay?: SortOrderInput | SortOrder
    purok?: SortOrderInput | SortOrder
    sitio?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    completionPercentage?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    documentUrl?: SortOrderInput | SortOrder
    documentName?: SortOrderInput | SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _avg?: ProjectAvgOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
    _sum?: ProjectSumOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    projectCode?: StringWithAggregatesFilter<"Project"> | string
    title?: StringWithAggregatesFilter<"Project"> | string
    subType?: EnumProjectSubTypeNullableWithAggregatesFilter<"Project"> | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationWithAggregatesFilter<"Project"> | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictWithAggregatesFilter<"Project"> | $Enums.District
    sourceOfFund?: EnumSourceOfFundWithAggregatesFilter<"Project"> | $Enums.SourceOfFund
    projectCost?: FloatWithAggregatesFilter<"Project"> | number
    contractCost?: FloatWithAggregatesFilter<"Project"> | number
    contractorName?: StringNullableWithAggregatesFilter<"Project"> | string | null
    projectEngineer?: StringNullableWithAggregatesFilter<"Project"> | string | null
    budgetYear?: StringNullableWithAggregatesFilter<"Project"> | string | null
    dateStarted?: DateTimeNullableWithAggregatesFilter<"Project"> | Date | string | null
    targetCompletionDate?: DateTimeNullableWithAggregatesFilter<"Project"> | Date | string | null
    duration?: IntWithAggregatesFilter<"Project"> | number
    revisedCompletionDate?: DateTimeNullableWithAggregatesFilter<"Project"> | Date | string | null
    dateCompleted?: DateTimeNullableWithAggregatesFilter<"Project"> | Date | string | null
    daysSuspended?: IntWithAggregatesFilter<"Project"> | number
    daysExtended?: IntWithAggregatesFilter<"Project"> | number
    numFemale?: IntWithAggregatesFilter<"Project"> | number
    numMale?: IntWithAggregatesFilter<"Project"> | number
    numPersons?: IntWithAggregatesFilter<"Project"> | number
    numManDays?: IntWithAggregatesFilter<"Project"> | number
    district?: EnumDistrictNullableWithAggregatesFilter<"Project"> | $Enums.District | null
    cityMunicipality?: StringNullableWithAggregatesFilter<"Project"> | string | null
    barangay?: StringNullableWithAggregatesFilter<"Project"> | string | null
    purok?: StringNullableWithAggregatesFilter<"Project"> | string | null
    sitio?: StringNullableWithAggregatesFilter<"Project"> | string | null
    description?: StringNullableWithAggregatesFilter<"Project"> | string | null
    status?: EnumProjectStatusWithAggregatesFilter<"Project"> | $Enums.ProjectStatus
    completionPercentage?: IntWithAggregatesFilter<"Project"> | number
    imageUrl?: StringNullableWithAggregatesFilter<"Project"> | string | null
    documentUrl?: StringNullableWithAggregatesFilter<"Project"> | string | null
    documentName?: StringNullableWithAggregatesFilter<"Project"> | string | null
    createdById?: StringWithAggregatesFilter<"Project"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
  }

  export type ProjectActivityWhereInput = {
    AND?: ProjectActivityWhereInput | ProjectActivityWhereInput[]
    OR?: ProjectActivityWhereInput[]
    NOT?: ProjectActivityWhereInput | ProjectActivityWhereInput[]
    id?: StringFilter<"ProjectActivity"> | string
    projectId?: StringFilter<"ProjectActivity"> | string
    description?: StringFilter<"ProjectActivity"> | string
    createdById?: StringFilter<"ProjectActivity"> | string
    createdAt?: DateTimeFilter<"ProjectActivity"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ProjectActivityOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    description?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    createdBy?: UserOrderByWithRelationInput
  }

  export type ProjectActivityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectActivityWhereInput | ProjectActivityWhereInput[]
    OR?: ProjectActivityWhereInput[]
    NOT?: ProjectActivityWhereInput | ProjectActivityWhereInput[]
    projectId?: StringFilter<"ProjectActivity"> | string
    description?: StringFilter<"ProjectActivity"> | string
    createdById?: StringFilter<"ProjectActivity"> | string
    createdAt?: DateTimeFilter<"ProjectActivity"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type ProjectActivityOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    description?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    _count?: ProjectActivityCountOrderByAggregateInput
    _max?: ProjectActivityMaxOrderByAggregateInput
    _min?: ProjectActivityMinOrderByAggregateInput
  }

  export type ProjectActivityScalarWhereWithAggregatesInput = {
    AND?: ProjectActivityScalarWhereWithAggregatesInput | ProjectActivityScalarWhereWithAggregatesInput[]
    OR?: ProjectActivityScalarWhereWithAggregatesInput[]
    NOT?: ProjectActivityScalarWhereWithAggregatesInput | ProjectActivityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectActivity"> | string
    projectId?: StringWithAggregatesFilter<"ProjectActivity"> | string
    description?: StringWithAggregatesFilter<"ProjectActivity"> | string
    createdById?: StringWithAggregatesFilter<"ProjectActivity"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ProjectActivity"> | Date | string
  }

  export type DisbursementWhereInput = {
    AND?: DisbursementWhereInput | DisbursementWhereInput[]
    OR?: DisbursementWhereInput[]
    NOT?: DisbursementWhereInput | DisbursementWhereInput[]
    id?: StringFilter<"Disbursement"> | string
    projectId?: StringFilter<"Disbursement"> | string
    date?: DateTimeFilter<"Disbursement"> | Date | string
    referenceNumber?: StringNullableFilter<"Disbursement"> | string | null
    amount?: FloatFilter<"Disbursement"> | number
    createdById?: StringFilter<"Disbursement"> | string
    createdAt?: DateTimeFilter<"Disbursement"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type DisbursementOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    date?: SortOrder
    referenceNumber?: SortOrderInput | SortOrder
    amount?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    createdBy?: UserOrderByWithRelationInput
  }

  export type DisbursementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DisbursementWhereInput | DisbursementWhereInput[]
    OR?: DisbursementWhereInput[]
    NOT?: DisbursementWhereInput | DisbursementWhereInput[]
    projectId?: StringFilter<"Disbursement"> | string
    date?: DateTimeFilter<"Disbursement"> | Date | string
    referenceNumber?: StringNullableFilter<"Disbursement"> | string | null
    amount?: FloatFilter<"Disbursement"> | number
    createdById?: StringFilter<"Disbursement"> | string
    createdAt?: DateTimeFilter<"Disbursement"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type DisbursementOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    date?: SortOrder
    referenceNumber?: SortOrderInput | SortOrder
    amount?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    _count?: DisbursementCountOrderByAggregateInput
    _avg?: DisbursementAvgOrderByAggregateInput
    _max?: DisbursementMaxOrderByAggregateInput
    _min?: DisbursementMinOrderByAggregateInput
    _sum?: DisbursementSumOrderByAggregateInput
  }

  export type DisbursementScalarWhereWithAggregatesInput = {
    AND?: DisbursementScalarWhereWithAggregatesInput | DisbursementScalarWhereWithAggregatesInput[]
    OR?: DisbursementScalarWhereWithAggregatesInput[]
    NOT?: DisbursementScalarWhereWithAggregatesInput | DisbursementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Disbursement"> | string
    projectId?: StringWithAggregatesFilter<"Disbursement"> | string
    date?: DateTimeWithAggregatesFilter<"Disbursement"> | Date | string
    referenceNumber?: StringNullableWithAggregatesFilter<"Disbursement"> | string | null
    amount?: FloatWithAggregatesFilter<"Disbursement"> | number
    createdById?: StringWithAggregatesFilter<"Disbursement"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Disbursement"> | Date | string
  }

  export type TaskNotificationWhereInput = {
    AND?: TaskNotificationWhereInput | TaskNotificationWhereInput[]
    OR?: TaskNotificationWhereInput[]
    NOT?: TaskNotificationWhereInput | TaskNotificationWhereInput[]
    id?: StringFilter<"TaskNotification"> | string
    projectId?: StringFilter<"TaskNotification"> | string
    notifyUserId?: StringFilter<"TaskNotification"> | string
    priority?: EnumNotificationPriorityFilter<"TaskNotification"> | $Enums.NotificationPriority
    description?: StringFilter<"TaskNotification"> | string
    acknowledged?: BoolFilter<"TaskNotification"> | boolean
    acknowledgedAt?: DateTimeNullableFilter<"TaskNotification"> | Date | string | null
    createdById?: StringFilter<"TaskNotification"> | string
    createdAt?: DateTimeFilter<"TaskNotification"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    notifyUser?: XOR<UserScalarRelationFilter, UserWhereInput>
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    replies?: TaskReplyListRelationFilter
  }

  export type TaskNotificationOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    notifyUserId?: SortOrder
    priority?: SortOrder
    description?: SortOrder
    acknowledged?: SortOrder
    acknowledgedAt?: SortOrderInput | SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    notifyUser?: UserOrderByWithRelationInput
    createdBy?: UserOrderByWithRelationInput
    replies?: TaskReplyOrderByRelationAggregateInput
  }

  export type TaskNotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskNotificationWhereInput | TaskNotificationWhereInput[]
    OR?: TaskNotificationWhereInput[]
    NOT?: TaskNotificationWhereInput | TaskNotificationWhereInput[]
    projectId?: StringFilter<"TaskNotification"> | string
    notifyUserId?: StringFilter<"TaskNotification"> | string
    priority?: EnumNotificationPriorityFilter<"TaskNotification"> | $Enums.NotificationPriority
    description?: StringFilter<"TaskNotification"> | string
    acknowledged?: BoolFilter<"TaskNotification"> | boolean
    acknowledgedAt?: DateTimeNullableFilter<"TaskNotification"> | Date | string | null
    createdById?: StringFilter<"TaskNotification"> | string
    createdAt?: DateTimeFilter<"TaskNotification"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    notifyUser?: XOR<UserScalarRelationFilter, UserWhereInput>
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    replies?: TaskReplyListRelationFilter
  }, "id">

  export type TaskNotificationOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    notifyUserId?: SortOrder
    priority?: SortOrder
    description?: SortOrder
    acknowledged?: SortOrder
    acknowledgedAt?: SortOrderInput | SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    _count?: TaskNotificationCountOrderByAggregateInput
    _max?: TaskNotificationMaxOrderByAggregateInput
    _min?: TaskNotificationMinOrderByAggregateInput
  }

  export type TaskNotificationScalarWhereWithAggregatesInput = {
    AND?: TaskNotificationScalarWhereWithAggregatesInput | TaskNotificationScalarWhereWithAggregatesInput[]
    OR?: TaskNotificationScalarWhereWithAggregatesInput[]
    NOT?: TaskNotificationScalarWhereWithAggregatesInput | TaskNotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TaskNotification"> | string
    projectId?: StringWithAggregatesFilter<"TaskNotification"> | string
    notifyUserId?: StringWithAggregatesFilter<"TaskNotification"> | string
    priority?: EnumNotificationPriorityWithAggregatesFilter<"TaskNotification"> | $Enums.NotificationPriority
    description?: StringWithAggregatesFilter<"TaskNotification"> | string
    acknowledged?: BoolWithAggregatesFilter<"TaskNotification"> | boolean
    acknowledgedAt?: DateTimeNullableWithAggregatesFilter<"TaskNotification"> | Date | string | null
    createdById?: StringWithAggregatesFilter<"TaskNotification"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TaskNotification"> | Date | string
  }

  export type TaskReplyWhereInput = {
    AND?: TaskReplyWhereInput | TaskReplyWhereInput[]
    OR?: TaskReplyWhereInput[]
    NOT?: TaskReplyWhereInput | TaskReplyWhereInput[]
    id?: StringFilter<"TaskReply"> | string
    taskNotificationId?: StringFilter<"TaskReply"> | string
    message?: StringFilter<"TaskReply"> | string
    taskStatus?: StringNullableFilter<"TaskReply"> | string | null
    createdById?: StringFilter<"TaskReply"> | string
    createdAt?: DateTimeFilter<"TaskReply"> | Date | string
    taskNotification?: XOR<TaskNotificationScalarRelationFilter, TaskNotificationWhereInput>
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    documents?: TaskReplyDocumentListRelationFilter
  }

  export type TaskReplyOrderByWithRelationInput = {
    id?: SortOrder
    taskNotificationId?: SortOrder
    message?: SortOrder
    taskStatus?: SortOrderInput | SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    taskNotification?: TaskNotificationOrderByWithRelationInput
    createdBy?: UserOrderByWithRelationInput
    documents?: TaskReplyDocumentOrderByRelationAggregateInput
  }

  export type TaskReplyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskReplyWhereInput | TaskReplyWhereInput[]
    OR?: TaskReplyWhereInput[]
    NOT?: TaskReplyWhereInput | TaskReplyWhereInput[]
    taskNotificationId?: StringFilter<"TaskReply"> | string
    message?: StringFilter<"TaskReply"> | string
    taskStatus?: StringNullableFilter<"TaskReply"> | string | null
    createdById?: StringFilter<"TaskReply"> | string
    createdAt?: DateTimeFilter<"TaskReply"> | Date | string
    taskNotification?: XOR<TaskNotificationScalarRelationFilter, TaskNotificationWhereInput>
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    documents?: TaskReplyDocumentListRelationFilter
  }, "id">

  export type TaskReplyOrderByWithAggregationInput = {
    id?: SortOrder
    taskNotificationId?: SortOrder
    message?: SortOrder
    taskStatus?: SortOrderInput | SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    _count?: TaskReplyCountOrderByAggregateInput
    _max?: TaskReplyMaxOrderByAggregateInput
    _min?: TaskReplyMinOrderByAggregateInput
  }

  export type TaskReplyScalarWhereWithAggregatesInput = {
    AND?: TaskReplyScalarWhereWithAggregatesInput | TaskReplyScalarWhereWithAggregatesInput[]
    OR?: TaskReplyScalarWhereWithAggregatesInput[]
    NOT?: TaskReplyScalarWhereWithAggregatesInput | TaskReplyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TaskReply"> | string
    taskNotificationId?: StringWithAggregatesFilter<"TaskReply"> | string
    message?: StringWithAggregatesFilter<"TaskReply"> | string
    taskStatus?: StringNullableWithAggregatesFilter<"TaskReply"> | string | null
    createdById?: StringWithAggregatesFilter<"TaskReply"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TaskReply"> | Date | string
  }

  export type TaskReplyDocumentWhereInput = {
    AND?: TaskReplyDocumentWhereInput | TaskReplyDocumentWhereInput[]
    OR?: TaskReplyDocumentWhereInput[]
    NOT?: TaskReplyDocumentWhereInput | TaskReplyDocumentWhereInput[]
    id?: StringFilter<"TaskReplyDocument"> | string
    replyId?: StringFilter<"TaskReplyDocument"> | string
    fileName?: StringFilter<"TaskReplyDocument"> | string
    fileUrl?: StringFilter<"TaskReplyDocument"> | string
    fileSize?: IntNullableFilter<"TaskReplyDocument"> | number | null
    fileType?: StringNullableFilter<"TaskReplyDocument"> | string | null
    createdAt?: DateTimeFilter<"TaskReplyDocument"> | Date | string
    reply?: XOR<TaskReplyScalarRelationFilter, TaskReplyWhereInput>
  }

  export type TaskReplyDocumentOrderByWithRelationInput = {
    id?: SortOrder
    replyId?: SortOrder
    fileName?: SortOrder
    fileUrl?: SortOrder
    fileSize?: SortOrderInput | SortOrder
    fileType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    reply?: TaskReplyOrderByWithRelationInput
  }

  export type TaskReplyDocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskReplyDocumentWhereInput | TaskReplyDocumentWhereInput[]
    OR?: TaskReplyDocumentWhereInput[]
    NOT?: TaskReplyDocumentWhereInput | TaskReplyDocumentWhereInput[]
    replyId?: StringFilter<"TaskReplyDocument"> | string
    fileName?: StringFilter<"TaskReplyDocument"> | string
    fileUrl?: StringFilter<"TaskReplyDocument"> | string
    fileSize?: IntNullableFilter<"TaskReplyDocument"> | number | null
    fileType?: StringNullableFilter<"TaskReplyDocument"> | string | null
    createdAt?: DateTimeFilter<"TaskReplyDocument"> | Date | string
    reply?: XOR<TaskReplyScalarRelationFilter, TaskReplyWhereInput>
  }, "id">

  export type TaskReplyDocumentOrderByWithAggregationInput = {
    id?: SortOrder
    replyId?: SortOrder
    fileName?: SortOrder
    fileUrl?: SortOrder
    fileSize?: SortOrderInput | SortOrder
    fileType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: TaskReplyDocumentCountOrderByAggregateInput
    _avg?: TaskReplyDocumentAvgOrderByAggregateInput
    _max?: TaskReplyDocumentMaxOrderByAggregateInput
    _min?: TaskReplyDocumentMinOrderByAggregateInput
    _sum?: TaskReplyDocumentSumOrderByAggregateInput
  }

  export type TaskReplyDocumentScalarWhereWithAggregatesInput = {
    AND?: TaskReplyDocumentScalarWhereWithAggregatesInput | TaskReplyDocumentScalarWhereWithAggregatesInput[]
    OR?: TaskReplyDocumentScalarWhereWithAggregatesInput[]
    NOT?: TaskReplyDocumentScalarWhereWithAggregatesInput | TaskReplyDocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TaskReplyDocument"> | string
    replyId?: StringWithAggregatesFilter<"TaskReplyDocument"> | string
    fileName?: StringWithAggregatesFilter<"TaskReplyDocument"> | string
    fileUrl?: StringWithAggregatesFilter<"TaskReplyDocument"> | string
    fileSize?: IntNullableWithAggregatesFilter<"TaskReplyDocument"> | number | null
    fileType?: StringNullableWithAggregatesFilter<"TaskReplyDocument"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TaskReplyDocument"> | Date | string
  }

  export type DocumentWhereInput = {
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    id?: StringFilter<"Document"> | string
    documentCode?: StringFilter<"Document"> | string
    type?: EnumDocumentTypeFilter<"Document"> | $Enums.DocumentType
    title?: StringFilter<"Document"> | string
    description?: StringNullableFilter<"Document"> | string | null
    status?: EnumDocumentStatusFilter<"Document"> | $Enums.DocumentStatus
    filePath?: StringNullableFilter<"Document"> | string | null
    fileName?: StringNullableFilter<"Document"> | string | null
    fileSize?: IntNullableFilter<"Document"> | number | null
    amount?: FloatNullableFilter<"Document"> | number | null
    purpose?: StringNullableFilter<"Document"> | string | null
    district?: EnumDistrictFilter<"Document"> | $Enums.District
    projectRef?: StringNullableFilter<"Document"> | string | null
    releasedAt?: DateTimeNullableFilter<"Document"> | Date | string | null
    releasedTo?: StringNullableFilter<"Document"> | string | null
    createdById?: StringFilter<"Document"> | string
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type DocumentOrderByWithRelationInput = {
    id?: SortOrder
    documentCode?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    filePath?: SortOrderInput | SortOrder
    fileName?: SortOrderInput | SortOrder
    fileSize?: SortOrderInput | SortOrder
    amount?: SortOrderInput | SortOrder
    purpose?: SortOrderInput | SortOrder
    district?: SortOrder
    projectRef?: SortOrderInput | SortOrder
    releasedAt?: SortOrderInput | SortOrder
    releasedTo?: SortOrderInput | SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: UserOrderByWithRelationInput
  }

  export type DocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    documentCode?: string
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    type?: EnumDocumentTypeFilter<"Document"> | $Enums.DocumentType
    title?: StringFilter<"Document"> | string
    description?: StringNullableFilter<"Document"> | string | null
    status?: EnumDocumentStatusFilter<"Document"> | $Enums.DocumentStatus
    filePath?: StringNullableFilter<"Document"> | string | null
    fileName?: StringNullableFilter<"Document"> | string | null
    fileSize?: IntNullableFilter<"Document"> | number | null
    amount?: FloatNullableFilter<"Document"> | number | null
    purpose?: StringNullableFilter<"Document"> | string | null
    district?: EnumDistrictFilter<"Document"> | $Enums.District
    projectRef?: StringNullableFilter<"Document"> | string | null
    releasedAt?: DateTimeNullableFilter<"Document"> | Date | string | null
    releasedTo?: StringNullableFilter<"Document"> | string | null
    createdById?: StringFilter<"Document"> | string
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "documentCode">

  export type DocumentOrderByWithAggregationInput = {
    id?: SortOrder
    documentCode?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    filePath?: SortOrderInput | SortOrder
    fileName?: SortOrderInput | SortOrder
    fileSize?: SortOrderInput | SortOrder
    amount?: SortOrderInput | SortOrder
    purpose?: SortOrderInput | SortOrder
    district?: SortOrder
    projectRef?: SortOrderInput | SortOrder
    releasedAt?: SortOrderInput | SortOrder
    releasedTo?: SortOrderInput | SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DocumentCountOrderByAggregateInput
    _avg?: DocumentAvgOrderByAggregateInput
    _max?: DocumentMaxOrderByAggregateInput
    _min?: DocumentMinOrderByAggregateInput
    _sum?: DocumentSumOrderByAggregateInput
  }

  export type DocumentScalarWhereWithAggregatesInput = {
    AND?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    OR?: DocumentScalarWhereWithAggregatesInput[]
    NOT?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Document"> | string
    documentCode?: StringWithAggregatesFilter<"Document"> | string
    type?: EnumDocumentTypeWithAggregatesFilter<"Document"> | $Enums.DocumentType
    title?: StringWithAggregatesFilter<"Document"> | string
    description?: StringNullableWithAggregatesFilter<"Document"> | string | null
    status?: EnumDocumentStatusWithAggregatesFilter<"Document"> | $Enums.DocumentStatus
    filePath?: StringNullableWithAggregatesFilter<"Document"> | string | null
    fileName?: StringNullableWithAggregatesFilter<"Document"> | string | null
    fileSize?: IntNullableWithAggregatesFilter<"Document"> | number | null
    amount?: FloatNullableWithAggregatesFilter<"Document"> | number | null
    purpose?: StringNullableWithAggregatesFilter<"Document"> | string | null
    district?: EnumDistrictWithAggregatesFilter<"Document"> | $Enums.District
    projectRef?: StringNullableWithAggregatesFilter<"Document"> | string | null
    releasedAt?: DateTimeNullableWithAggregatesFilter<"Document"> | Date | string | null
    releasedTo?: StringNullableWithAggregatesFilter<"Document"> | string | null
    createdById?: StringWithAggregatesFilter<"Document"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
  }

  export type ProjectFileWhereInput = {
    AND?: ProjectFileWhereInput | ProjectFileWhereInput[]
    OR?: ProjectFileWhereInput[]
    NOT?: ProjectFileWhereInput | ProjectFileWhereInput[]
    id?: StringFilter<"ProjectFile"> | string
    projectId?: StringFilter<"ProjectFile"> | string
    fileName?: StringFilter<"ProjectFile"> | string
    fileUrl?: StringFilter<"ProjectFile"> | string
    fileType?: EnumProjectFileTypeFilter<"ProjectFile"> | $Enums.ProjectFileType
    fileSize?: IntNullableFilter<"ProjectFile"> | number | null
    createdById?: StringFilter<"ProjectFile"> | string
    createdAt?: DateTimeFilter<"ProjectFile"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ProjectFileOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    fileName?: SortOrder
    fileUrl?: SortOrder
    fileType?: SortOrder
    fileSize?: SortOrderInput | SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    createdBy?: UserOrderByWithRelationInput
  }

  export type ProjectFileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectFileWhereInput | ProjectFileWhereInput[]
    OR?: ProjectFileWhereInput[]
    NOT?: ProjectFileWhereInput | ProjectFileWhereInput[]
    projectId?: StringFilter<"ProjectFile"> | string
    fileName?: StringFilter<"ProjectFile"> | string
    fileUrl?: StringFilter<"ProjectFile"> | string
    fileType?: EnumProjectFileTypeFilter<"ProjectFile"> | $Enums.ProjectFileType
    fileSize?: IntNullableFilter<"ProjectFile"> | number | null
    createdById?: StringFilter<"ProjectFile"> | string
    createdAt?: DateTimeFilter<"ProjectFile"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type ProjectFileOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    fileName?: SortOrder
    fileUrl?: SortOrder
    fileType?: SortOrder
    fileSize?: SortOrderInput | SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    _count?: ProjectFileCountOrderByAggregateInput
    _avg?: ProjectFileAvgOrderByAggregateInput
    _max?: ProjectFileMaxOrderByAggregateInput
    _min?: ProjectFileMinOrderByAggregateInput
    _sum?: ProjectFileSumOrderByAggregateInput
  }

  export type ProjectFileScalarWhereWithAggregatesInput = {
    AND?: ProjectFileScalarWhereWithAggregatesInput | ProjectFileScalarWhereWithAggregatesInput[]
    OR?: ProjectFileScalarWhereWithAggregatesInput[]
    NOT?: ProjectFileScalarWhereWithAggregatesInput | ProjectFileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectFile"> | string
    projectId?: StringWithAggregatesFilter<"ProjectFile"> | string
    fileName?: StringWithAggregatesFilter<"ProjectFile"> | string
    fileUrl?: StringWithAggregatesFilter<"ProjectFile"> | string
    fileType?: EnumProjectFileTypeWithAggregatesFilter<"ProjectFile"> | $Enums.ProjectFileType
    fileSize?: IntNullableWithAggregatesFilter<"ProjectFile"> | number | null
    createdById?: StringWithAggregatesFilter<"ProjectFile"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ProjectFile"> | Date | string
  }

  export type PostWhereInput = {
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    id?: IntFilter<"Post"> | number
    name?: StringFilter<"Post"> | string
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
    createdById?: StringFilter<"Post"> | string
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PostOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdById?: SortOrder
    createdBy?: UserOrderByWithRelationInput
  }

  export type PostWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    name?: StringFilter<"Post"> | string
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
    createdById?: StringFilter<"Post"> | string
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type PostOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdById?: SortOrder
    _count?: PostCountOrderByAggregateInput
    _avg?: PostAvgOrderByAggregateInput
    _max?: PostMaxOrderByAggregateInput
    _min?: PostMinOrderByAggregateInput
    _sum?: PostSumOrderByAggregateInput
  }

  export type PostScalarWhereWithAggregatesInput = {
    AND?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    OR?: PostScalarWhereWithAggregatesInput[]
    NOT?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Post"> | number
    name?: StringWithAggregatesFilter<"Post"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
    createdById?: StringWithAggregatesFilter<"Post"> | string
  }

  export type UserCreateInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostCreateNestedManyWithoutCreatedByInput
    projects?: ProjectCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostUncheckedCreateNestedManyWithoutCreatedByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityUncheckedCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementUncheckedCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationUncheckedCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationUncheckedCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyUncheckedCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUncheckedUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUncheckedUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUncheckedUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUncheckedUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUncheckedUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUncheckedUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionCreateInput = {
    id?: string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    expiresAt: Date | string
    lastActive?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type UserSessionUncheckedCreateInput = {
    id?: string
    userId: string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    expiresAt: Date | string
    lastActive?: Date | string
  }

  export type UserSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type UserSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionCreateManyInput = {
    id?: string
    userId: string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    expiresAt: Date | string
    lastActive?: Date | string
  }

  export type UserSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    projectCode: string
    title: string
    subType?: $Enums.ProjectSubType | null
    modeOfImplementation: $Enums.ModeOfImplementation
    locationImplementation: $Enums.District
    sourceOfFund: $Enums.SourceOfFund
    projectCost?: number
    contractCost?: number
    contractorName?: string | null
    projectEngineer?: string | null
    budgetYear?: string | null
    dateStarted?: Date | string | null
    targetCompletionDate?: Date | string | null
    duration?: number
    revisedCompletionDate?: Date | string | null
    dateCompleted?: Date | string | null
    daysSuspended?: number
    daysExtended?: number
    numFemale?: number
    numMale?: number
    numPersons?: number
    numManDays?: number
    district?: $Enums.District | null
    cityMunicipality?: string | null
    barangay?: string | null
    purok?: string | null
    sitio?: string | null
    description?: string | null
    status?: $Enums.ProjectStatus
    completionPercentage?: number
    imageUrl?: string | null
    documentUrl?: string | null
    documentName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutProjectsInput
    activities?: ProjectActivityCreateNestedManyWithoutProjectInput
    disbursements?: DisbursementCreateNestedManyWithoutProjectInput
    taskNotifications?: TaskNotificationCreateNestedManyWithoutProjectInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    projectCode: string
    title: string
    subType?: $Enums.ProjectSubType | null
    modeOfImplementation: $Enums.ModeOfImplementation
    locationImplementation: $Enums.District
    sourceOfFund: $Enums.SourceOfFund
    projectCost?: number
    contractCost?: number
    contractorName?: string | null
    projectEngineer?: string | null
    budgetYear?: string | null
    dateStarted?: Date | string | null
    targetCompletionDate?: Date | string | null
    duration?: number
    revisedCompletionDate?: Date | string | null
    dateCompleted?: Date | string | null
    daysSuspended?: number
    daysExtended?: number
    numFemale?: number
    numMale?: number
    numPersons?: number
    numManDays?: number
    district?: $Enums.District | null
    cityMunicipality?: string | null
    barangay?: string | null
    purok?: string | null
    sitio?: string | null
    description?: string | null
    status?: $Enums.ProjectStatus
    completionPercentage?: number
    imageUrl?: string | null
    documentUrl?: string | null
    documentName?: string | null
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    activities?: ProjectActivityUncheckedCreateNestedManyWithoutProjectInput
    disbursements?: DisbursementUncheckedCreateNestedManyWithoutProjectInput
    taskNotifications?: TaskNotificationUncheckedCreateNestedManyWithoutProjectInput
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subType?: NullableEnumProjectSubTypeFieldUpdateOperationsInput | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFieldUpdateOperationsInput | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    sourceOfFund?: EnumSourceOfFundFieldUpdateOperationsInput | $Enums.SourceOfFund
    projectCost?: FloatFieldUpdateOperationsInput | number
    contractCost?: FloatFieldUpdateOperationsInput | number
    contractorName?: NullableStringFieldUpdateOperationsInput | string | null
    projectEngineer?: NullableStringFieldUpdateOperationsInput | string | null
    budgetYear?: NullableStringFieldUpdateOperationsInput | string | null
    dateStarted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    targetCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    revisedCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateCompleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    daysSuspended?: IntFieldUpdateOperationsInput | number
    daysExtended?: IntFieldUpdateOperationsInput | number
    numFemale?: IntFieldUpdateOperationsInput | number
    numMale?: IntFieldUpdateOperationsInput | number
    numPersons?: IntFieldUpdateOperationsInput | number
    numManDays?: IntFieldUpdateOperationsInput | number
    district?: NullableEnumDistrictFieldUpdateOperationsInput | $Enums.District | null
    cityMunicipality?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    purok?: NullableStringFieldUpdateOperationsInput | string | null
    sitio?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    completionPercentage?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutProjectsNestedInput
    activities?: ProjectActivityUpdateManyWithoutProjectNestedInput
    disbursements?: DisbursementUpdateManyWithoutProjectNestedInput
    taskNotifications?: TaskNotificationUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subType?: NullableEnumProjectSubTypeFieldUpdateOperationsInput | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFieldUpdateOperationsInput | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    sourceOfFund?: EnumSourceOfFundFieldUpdateOperationsInput | $Enums.SourceOfFund
    projectCost?: FloatFieldUpdateOperationsInput | number
    contractCost?: FloatFieldUpdateOperationsInput | number
    contractorName?: NullableStringFieldUpdateOperationsInput | string | null
    projectEngineer?: NullableStringFieldUpdateOperationsInput | string | null
    budgetYear?: NullableStringFieldUpdateOperationsInput | string | null
    dateStarted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    targetCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    revisedCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateCompleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    daysSuspended?: IntFieldUpdateOperationsInput | number
    daysExtended?: IntFieldUpdateOperationsInput | number
    numFemale?: IntFieldUpdateOperationsInput | number
    numMale?: IntFieldUpdateOperationsInput | number
    numPersons?: IntFieldUpdateOperationsInput | number
    numManDays?: IntFieldUpdateOperationsInput | number
    district?: NullableEnumDistrictFieldUpdateOperationsInput | $Enums.District | null
    cityMunicipality?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    purok?: NullableStringFieldUpdateOperationsInput | string | null
    sitio?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    completionPercentage?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentName?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activities?: ProjectActivityUncheckedUpdateManyWithoutProjectNestedInput
    disbursements?: DisbursementUncheckedUpdateManyWithoutProjectNestedInput
    taskNotifications?: TaskNotificationUncheckedUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    projectCode: string
    title: string
    subType?: $Enums.ProjectSubType | null
    modeOfImplementation: $Enums.ModeOfImplementation
    locationImplementation: $Enums.District
    sourceOfFund: $Enums.SourceOfFund
    projectCost?: number
    contractCost?: number
    contractorName?: string | null
    projectEngineer?: string | null
    budgetYear?: string | null
    dateStarted?: Date | string | null
    targetCompletionDate?: Date | string | null
    duration?: number
    revisedCompletionDate?: Date | string | null
    dateCompleted?: Date | string | null
    daysSuspended?: number
    daysExtended?: number
    numFemale?: number
    numMale?: number
    numPersons?: number
    numManDays?: number
    district?: $Enums.District | null
    cityMunicipality?: string | null
    barangay?: string | null
    purok?: string | null
    sitio?: string | null
    description?: string | null
    status?: $Enums.ProjectStatus
    completionPercentage?: number
    imageUrl?: string | null
    documentUrl?: string | null
    documentName?: string | null
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subType?: NullableEnumProjectSubTypeFieldUpdateOperationsInput | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFieldUpdateOperationsInput | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    sourceOfFund?: EnumSourceOfFundFieldUpdateOperationsInput | $Enums.SourceOfFund
    projectCost?: FloatFieldUpdateOperationsInput | number
    contractCost?: FloatFieldUpdateOperationsInput | number
    contractorName?: NullableStringFieldUpdateOperationsInput | string | null
    projectEngineer?: NullableStringFieldUpdateOperationsInput | string | null
    budgetYear?: NullableStringFieldUpdateOperationsInput | string | null
    dateStarted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    targetCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    revisedCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateCompleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    daysSuspended?: IntFieldUpdateOperationsInput | number
    daysExtended?: IntFieldUpdateOperationsInput | number
    numFemale?: IntFieldUpdateOperationsInput | number
    numMale?: IntFieldUpdateOperationsInput | number
    numPersons?: IntFieldUpdateOperationsInput | number
    numManDays?: IntFieldUpdateOperationsInput | number
    district?: NullableEnumDistrictFieldUpdateOperationsInput | $Enums.District | null
    cityMunicipality?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    purok?: NullableStringFieldUpdateOperationsInput | string | null
    sitio?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    completionPercentage?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subType?: NullableEnumProjectSubTypeFieldUpdateOperationsInput | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFieldUpdateOperationsInput | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    sourceOfFund?: EnumSourceOfFundFieldUpdateOperationsInput | $Enums.SourceOfFund
    projectCost?: FloatFieldUpdateOperationsInput | number
    contractCost?: FloatFieldUpdateOperationsInput | number
    contractorName?: NullableStringFieldUpdateOperationsInput | string | null
    projectEngineer?: NullableStringFieldUpdateOperationsInput | string | null
    budgetYear?: NullableStringFieldUpdateOperationsInput | string | null
    dateStarted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    targetCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    revisedCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateCompleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    daysSuspended?: IntFieldUpdateOperationsInput | number
    daysExtended?: IntFieldUpdateOperationsInput | number
    numFemale?: IntFieldUpdateOperationsInput | number
    numMale?: IntFieldUpdateOperationsInput | number
    numPersons?: IntFieldUpdateOperationsInput | number
    numManDays?: IntFieldUpdateOperationsInput | number
    district?: NullableEnumDistrictFieldUpdateOperationsInput | $Enums.District | null
    cityMunicipality?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    purok?: NullableStringFieldUpdateOperationsInput | string | null
    sitio?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    completionPercentage?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentName?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectActivityCreateInput = {
    id?: string
    description: string
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutActivitiesInput
    createdBy: UserCreateNestedOneWithoutProjectActivitiesInput
  }

  export type ProjectActivityUncheckedCreateInput = {
    id?: string
    projectId: string
    description: string
    createdById: string
    createdAt?: Date | string
  }

  export type ProjectActivityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutActivitiesNestedInput
    createdBy?: UserUpdateOneRequiredWithoutProjectActivitiesNestedInput
  }

  export type ProjectActivityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectActivityCreateManyInput = {
    id?: string
    projectId: string
    description: string
    createdById: string
    createdAt?: Date | string
  }

  export type ProjectActivityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectActivityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DisbursementCreateInput = {
    id?: string
    date?: Date | string
    referenceNumber?: string | null
    amount: number
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutDisbursementsInput
    createdBy: UserCreateNestedOneWithoutDisbursementsInput
  }

  export type DisbursementUncheckedCreateInput = {
    id?: string
    projectId: string
    date?: Date | string
    referenceNumber?: string | null
    amount: number
    createdById: string
    createdAt?: Date | string
  }

  export type DisbursementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    referenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutDisbursementsNestedInput
    createdBy?: UserUpdateOneRequiredWithoutDisbursementsNestedInput
  }

  export type DisbursementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    referenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DisbursementCreateManyInput = {
    id?: string
    projectId: string
    date?: Date | string
    referenceNumber?: string | null
    amount: number
    createdById: string
    createdAt?: Date | string
  }

  export type DisbursementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    referenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DisbursementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    referenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskNotificationCreateInput = {
    id?: string
    priority?: $Enums.NotificationPriority
    description: string
    acknowledged?: boolean
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutTaskNotificationsInput
    notifyUser: UserCreateNestedOneWithoutTaskNotificationsReceivedInput
    createdBy: UserCreateNestedOneWithoutTaskNotificationsCreatedInput
    replies?: TaskReplyCreateNestedManyWithoutTaskNotificationInput
  }

  export type TaskNotificationUncheckedCreateInput = {
    id?: string
    projectId: string
    notifyUserId: string
    priority?: $Enums.NotificationPriority
    description: string
    acknowledged?: boolean
    acknowledgedAt?: Date | string | null
    createdById: string
    createdAt?: Date | string
    replies?: TaskReplyUncheckedCreateNestedManyWithoutTaskNotificationInput
  }

  export type TaskNotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    description?: StringFieldUpdateOperationsInput | string
    acknowledged?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutTaskNotificationsNestedInput
    notifyUser?: UserUpdateOneRequiredWithoutTaskNotificationsReceivedNestedInput
    createdBy?: UserUpdateOneRequiredWithoutTaskNotificationsCreatedNestedInput
    replies?: TaskReplyUpdateManyWithoutTaskNotificationNestedInput
  }

  export type TaskNotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    notifyUserId?: StringFieldUpdateOperationsInput | string
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    description?: StringFieldUpdateOperationsInput | string
    acknowledged?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: TaskReplyUncheckedUpdateManyWithoutTaskNotificationNestedInput
  }

  export type TaskNotificationCreateManyInput = {
    id?: string
    projectId: string
    notifyUserId: string
    priority?: $Enums.NotificationPriority
    description: string
    acknowledged?: boolean
    acknowledgedAt?: Date | string | null
    createdById: string
    createdAt?: Date | string
  }

  export type TaskNotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    description?: StringFieldUpdateOperationsInput | string
    acknowledged?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskNotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    notifyUserId?: StringFieldUpdateOperationsInput | string
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    description?: StringFieldUpdateOperationsInput | string
    acknowledged?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskReplyCreateInput = {
    id?: string
    message: string
    taskStatus?: string | null
    createdAt?: Date | string
    taskNotification: TaskNotificationCreateNestedOneWithoutRepliesInput
    createdBy: UserCreateNestedOneWithoutTaskRepliesInput
    documents?: TaskReplyDocumentCreateNestedManyWithoutReplyInput
  }

  export type TaskReplyUncheckedCreateInput = {
    id?: string
    taskNotificationId: string
    message: string
    taskStatus?: string | null
    createdById: string
    createdAt?: Date | string
    documents?: TaskReplyDocumentUncheckedCreateNestedManyWithoutReplyInput
  }

  export type TaskReplyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    taskStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    taskNotification?: TaskNotificationUpdateOneRequiredWithoutRepliesNestedInput
    createdBy?: UserUpdateOneRequiredWithoutTaskRepliesNestedInput
    documents?: TaskReplyDocumentUpdateManyWithoutReplyNestedInput
  }

  export type TaskReplyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskNotificationId?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    taskStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: TaskReplyDocumentUncheckedUpdateManyWithoutReplyNestedInput
  }

  export type TaskReplyCreateManyInput = {
    id?: string
    taskNotificationId: string
    message: string
    taskStatus?: string | null
    createdById: string
    createdAt?: Date | string
  }

  export type TaskReplyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    taskStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskReplyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskNotificationId?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    taskStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskReplyDocumentCreateInput = {
    id?: string
    fileName: string
    fileUrl: string
    fileSize?: number | null
    fileType?: string | null
    createdAt?: Date | string
    reply: TaskReplyCreateNestedOneWithoutDocumentsInput
  }

  export type TaskReplyDocumentUncheckedCreateInput = {
    id?: string
    replyId: string
    fileName: string
    fileUrl: string
    fileSize?: number | null
    fileType?: string | null
    createdAt?: Date | string
  }

  export type TaskReplyDocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    fileType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reply?: TaskReplyUpdateOneRequiredWithoutDocumentsNestedInput
  }

  export type TaskReplyDocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    replyId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    fileType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskReplyDocumentCreateManyInput = {
    id?: string
    replyId: string
    fileName: string
    fileUrl: string
    fileSize?: number | null
    fileType?: string | null
    createdAt?: Date | string
  }

  export type TaskReplyDocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    fileType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskReplyDocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    replyId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    fileType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateInput = {
    id?: string
    documentCode: string
    type: $Enums.DocumentType
    title: string
    description?: string | null
    status?: $Enums.DocumentStatus
    filePath?: string | null
    fileName?: string | null
    fileSize?: number | null
    amount?: number | null
    purpose?: string | null
    district: $Enums.District
    projectRef?: string | null
    releasedAt?: Date | string | null
    releasedTo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutDocumentsInput
  }

  export type DocumentUncheckedCreateInput = {
    id?: string
    documentCode: string
    type: $Enums.DocumentType
    title: string
    description?: string | null
    status?: $Enums.DocumentStatus
    filePath?: string | null
    fileName?: string | null
    fileSize?: number | null
    amount?: number | null
    purpose?: string | null
    district: $Enums.District
    projectRef?: string | null
    releasedAt?: Date | string | null
    releasedTo?: string | null
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentCode?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    filePath?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    district?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    projectRef?: NullableStringFieldUpdateOperationsInput | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedTo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutDocumentsNestedInput
  }

  export type DocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentCode?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    filePath?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    district?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    projectRef?: NullableStringFieldUpdateOperationsInput | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedTo?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateManyInput = {
    id?: string
    documentCode: string
    type: $Enums.DocumentType
    title: string
    description?: string | null
    status?: $Enums.DocumentStatus
    filePath?: string | null
    fileName?: string | null
    fileSize?: number | null
    amount?: number | null
    purpose?: string | null
    district: $Enums.District
    projectRef?: string | null
    releasedAt?: Date | string | null
    releasedTo?: string | null
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentCode?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    filePath?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    district?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    projectRef?: NullableStringFieldUpdateOperationsInput | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedTo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentCode?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    filePath?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    district?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    projectRef?: NullableStringFieldUpdateOperationsInput | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedTo?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileCreateInput = {
    id?: string
    fileName: string
    fileUrl: string
    fileType?: $Enums.ProjectFileType
    fileSize?: number | null
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutFilesInput
    createdBy: UserCreateNestedOneWithoutProjectFilesInput
  }

  export type ProjectFileUncheckedCreateInput = {
    id?: string
    projectId: string
    fileName: string
    fileUrl: string
    fileType?: $Enums.ProjectFileType
    fileSize?: number | null
    createdById: string
    createdAt?: Date | string
  }

  export type ProjectFileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileType?: EnumProjectFileTypeFieldUpdateOperationsInput | $Enums.ProjectFileType
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutFilesNestedInput
    createdBy?: UserUpdateOneRequiredWithoutProjectFilesNestedInput
  }

  export type ProjectFileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileType?: EnumProjectFileTypeFieldUpdateOperationsInput | $Enums.ProjectFileType
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileCreateManyInput = {
    id?: string
    projectId: string
    fileName: string
    fileUrl: string
    fileType?: $Enums.ProjectFileType
    fileSize?: number | null
    createdById: string
    createdAt?: Date | string
  }

  export type ProjectFileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileType?: EnumProjectFileTypeFieldUpdateOperationsInput | $Enums.ProjectFileType
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileType?: EnumProjectFileTypeFieldUpdateOperationsInput | $Enums.ProjectFileType
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostCreateInput = {
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutPostsInput
  }

  export type PostUncheckedCreateInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdById: string
  }

  export type PostUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutPostsNestedInput
  }

  export type PostUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: StringFieldUpdateOperationsInput | string
  }

  export type PostCreateManyInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdById: string
  }

  export type PostUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type EnumSexNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Sex | EnumSexFieldRefInput<$PrismaModel> | null
    in?: $Enums.Sex[] | ListEnumSexFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Sex[] | ListEnumSexFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSexNullableFilter<$PrismaModel> | $Enums.Sex | null
  }

  export type EnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PostListRelationFilter = {
    every?: PostWhereInput
    some?: PostWhereInput
    none?: PostWhereInput
  }

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type UserSessionListRelationFilter = {
    every?: UserSessionWhereInput
    some?: UserSessionWhereInput
    none?: UserSessionWhereInput
  }

  export type DocumentListRelationFilter = {
    every?: DocumentWhereInput
    some?: DocumentWhereInput
    none?: DocumentWhereInput
  }

  export type ProjectActivityListRelationFilter = {
    every?: ProjectActivityWhereInput
    some?: ProjectActivityWhereInput
    none?: ProjectActivityWhereInput
  }

  export type DisbursementListRelationFilter = {
    every?: DisbursementWhereInput
    some?: DisbursementWhereInput
    none?: DisbursementWhereInput
  }

  export type TaskNotificationListRelationFilter = {
    every?: TaskNotificationWhereInput
    some?: TaskNotificationWhereInput
    none?: TaskNotificationWhereInput
  }

  export type TaskReplyListRelationFilter = {
    every?: TaskReplyWhereInput
    some?: TaskReplyWhereInput
    none?: TaskReplyWhereInput
  }

  export type ProjectFileListRelationFilter = {
    every?: ProjectFileWhereInput
    some?: ProjectFileWhereInput
    none?: ProjectFileWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PostOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectActivityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DisbursementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskNotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskReplyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectFileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    employeeId?: SortOrder
    designation?: SortOrder
    division?: SortOrder
    sex?: SortOrder
    status?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    employeeId?: SortOrder
    designation?: SortOrder
    division?: SortOrder
    sex?: SortOrder
    status?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    employeeId?: SortOrder
    designation?: SortOrder
    division?: SortOrder
    sex?: SortOrder
    status?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type EnumSexNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Sex | EnumSexFieldRefInput<$PrismaModel> | null
    in?: $Enums.Sex[] | ListEnumSexFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Sex[] | ListEnumSexFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSexNullableWithAggregatesFilter<$PrismaModel> | $Enums.Sex | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumSexNullableFilter<$PrismaModel>
    _max?: NestedEnumSexNullableFilter<$PrismaModel>
  }

  export type EnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    lastActive?: SortOrder
  }

  export type UserSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    lastActive?: SortOrder
  }

  export type UserSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    lastActive?: SortOrder
  }

  export type EnumProjectSubTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectSubType | EnumProjectSubTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.ProjectSubType[] | ListEnumProjectSubTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ProjectSubType[] | ListEnumProjectSubTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumProjectSubTypeNullableFilter<$PrismaModel> | $Enums.ProjectSubType | null
  }

  export type EnumModeOfImplementationFilter<$PrismaModel = never> = {
    equals?: $Enums.ModeOfImplementation | EnumModeOfImplementationFieldRefInput<$PrismaModel>
    in?: $Enums.ModeOfImplementation[] | ListEnumModeOfImplementationFieldRefInput<$PrismaModel>
    notIn?: $Enums.ModeOfImplementation[] | ListEnumModeOfImplementationFieldRefInput<$PrismaModel>
    not?: NestedEnumModeOfImplementationFilter<$PrismaModel> | $Enums.ModeOfImplementation
  }

  export type EnumDistrictFilter<$PrismaModel = never> = {
    equals?: $Enums.District | EnumDistrictFieldRefInput<$PrismaModel>
    in?: $Enums.District[] | ListEnumDistrictFieldRefInput<$PrismaModel>
    notIn?: $Enums.District[] | ListEnumDistrictFieldRefInput<$PrismaModel>
    not?: NestedEnumDistrictFilter<$PrismaModel> | $Enums.District
  }

  export type EnumSourceOfFundFilter<$PrismaModel = never> = {
    equals?: $Enums.SourceOfFund | EnumSourceOfFundFieldRefInput<$PrismaModel>
    in?: $Enums.SourceOfFund[] | ListEnumSourceOfFundFieldRefInput<$PrismaModel>
    notIn?: $Enums.SourceOfFund[] | ListEnumSourceOfFundFieldRefInput<$PrismaModel>
    not?: NestedEnumSourceOfFundFilter<$PrismaModel> | $Enums.SourceOfFund
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumDistrictNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.District | EnumDistrictFieldRefInput<$PrismaModel> | null
    in?: $Enums.District[] | ListEnumDistrictFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.District[] | ListEnumDistrictFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDistrictNullableFilter<$PrismaModel> | $Enums.District | null
  }

  export type EnumProjectStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusFilter<$PrismaModel> | $Enums.ProjectStatus
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    projectCode?: SortOrder
    title?: SortOrder
    subType?: SortOrder
    modeOfImplementation?: SortOrder
    locationImplementation?: SortOrder
    sourceOfFund?: SortOrder
    projectCost?: SortOrder
    contractCost?: SortOrder
    contractorName?: SortOrder
    projectEngineer?: SortOrder
    budgetYear?: SortOrder
    dateStarted?: SortOrder
    targetCompletionDate?: SortOrder
    duration?: SortOrder
    revisedCompletionDate?: SortOrder
    dateCompleted?: SortOrder
    daysSuspended?: SortOrder
    daysExtended?: SortOrder
    numFemale?: SortOrder
    numMale?: SortOrder
    numPersons?: SortOrder
    numManDays?: SortOrder
    district?: SortOrder
    cityMunicipality?: SortOrder
    barangay?: SortOrder
    purok?: SortOrder
    sitio?: SortOrder
    description?: SortOrder
    status?: SortOrder
    completionPercentage?: SortOrder
    imageUrl?: SortOrder
    documentUrl?: SortOrder
    documentName?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectAvgOrderByAggregateInput = {
    projectCost?: SortOrder
    contractCost?: SortOrder
    duration?: SortOrder
    daysSuspended?: SortOrder
    daysExtended?: SortOrder
    numFemale?: SortOrder
    numMale?: SortOrder
    numPersons?: SortOrder
    numManDays?: SortOrder
    completionPercentage?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    projectCode?: SortOrder
    title?: SortOrder
    subType?: SortOrder
    modeOfImplementation?: SortOrder
    locationImplementation?: SortOrder
    sourceOfFund?: SortOrder
    projectCost?: SortOrder
    contractCost?: SortOrder
    contractorName?: SortOrder
    projectEngineer?: SortOrder
    budgetYear?: SortOrder
    dateStarted?: SortOrder
    targetCompletionDate?: SortOrder
    duration?: SortOrder
    revisedCompletionDate?: SortOrder
    dateCompleted?: SortOrder
    daysSuspended?: SortOrder
    daysExtended?: SortOrder
    numFemale?: SortOrder
    numMale?: SortOrder
    numPersons?: SortOrder
    numManDays?: SortOrder
    district?: SortOrder
    cityMunicipality?: SortOrder
    barangay?: SortOrder
    purok?: SortOrder
    sitio?: SortOrder
    description?: SortOrder
    status?: SortOrder
    completionPercentage?: SortOrder
    imageUrl?: SortOrder
    documentUrl?: SortOrder
    documentName?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    projectCode?: SortOrder
    title?: SortOrder
    subType?: SortOrder
    modeOfImplementation?: SortOrder
    locationImplementation?: SortOrder
    sourceOfFund?: SortOrder
    projectCost?: SortOrder
    contractCost?: SortOrder
    contractorName?: SortOrder
    projectEngineer?: SortOrder
    budgetYear?: SortOrder
    dateStarted?: SortOrder
    targetCompletionDate?: SortOrder
    duration?: SortOrder
    revisedCompletionDate?: SortOrder
    dateCompleted?: SortOrder
    daysSuspended?: SortOrder
    daysExtended?: SortOrder
    numFemale?: SortOrder
    numMale?: SortOrder
    numPersons?: SortOrder
    numManDays?: SortOrder
    district?: SortOrder
    cityMunicipality?: SortOrder
    barangay?: SortOrder
    purok?: SortOrder
    sitio?: SortOrder
    description?: SortOrder
    status?: SortOrder
    completionPercentage?: SortOrder
    imageUrl?: SortOrder
    documentUrl?: SortOrder
    documentName?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectSumOrderByAggregateInput = {
    projectCost?: SortOrder
    contractCost?: SortOrder
    duration?: SortOrder
    daysSuspended?: SortOrder
    daysExtended?: SortOrder
    numFemale?: SortOrder
    numMale?: SortOrder
    numPersons?: SortOrder
    numManDays?: SortOrder
    completionPercentage?: SortOrder
  }

  export type EnumProjectSubTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectSubType | EnumProjectSubTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.ProjectSubType[] | ListEnumProjectSubTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ProjectSubType[] | ListEnumProjectSubTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumProjectSubTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.ProjectSubType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumProjectSubTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumProjectSubTypeNullableFilter<$PrismaModel>
  }

  export type EnumModeOfImplementationWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ModeOfImplementation | EnumModeOfImplementationFieldRefInput<$PrismaModel>
    in?: $Enums.ModeOfImplementation[] | ListEnumModeOfImplementationFieldRefInput<$PrismaModel>
    notIn?: $Enums.ModeOfImplementation[] | ListEnumModeOfImplementationFieldRefInput<$PrismaModel>
    not?: NestedEnumModeOfImplementationWithAggregatesFilter<$PrismaModel> | $Enums.ModeOfImplementation
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumModeOfImplementationFilter<$PrismaModel>
    _max?: NestedEnumModeOfImplementationFilter<$PrismaModel>
  }

  export type EnumDistrictWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.District | EnumDistrictFieldRefInput<$PrismaModel>
    in?: $Enums.District[] | ListEnumDistrictFieldRefInput<$PrismaModel>
    notIn?: $Enums.District[] | ListEnumDistrictFieldRefInput<$PrismaModel>
    not?: NestedEnumDistrictWithAggregatesFilter<$PrismaModel> | $Enums.District
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDistrictFilter<$PrismaModel>
    _max?: NestedEnumDistrictFilter<$PrismaModel>
  }

  export type EnumSourceOfFundWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SourceOfFund | EnumSourceOfFundFieldRefInput<$PrismaModel>
    in?: $Enums.SourceOfFund[] | ListEnumSourceOfFundFieldRefInput<$PrismaModel>
    notIn?: $Enums.SourceOfFund[] | ListEnumSourceOfFundFieldRefInput<$PrismaModel>
    not?: NestedEnumSourceOfFundWithAggregatesFilter<$PrismaModel> | $Enums.SourceOfFund
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSourceOfFundFilter<$PrismaModel>
    _max?: NestedEnumSourceOfFundFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
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

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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

  export type EnumDistrictNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.District | EnumDistrictFieldRefInput<$PrismaModel> | null
    in?: $Enums.District[] | ListEnumDistrictFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.District[] | ListEnumDistrictFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDistrictNullableWithAggregatesFilter<$PrismaModel> | $Enums.District | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumDistrictNullableFilter<$PrismaModel>
    _max?: NestedEnumDistrictNullableFilter<$PrismaModel>
  }

  export type EnumProjectStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProjectStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectStatusFilter<$PrismaModel>
    _max?: NestedEnumProjectStatusFilter<$PrismaModel>
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type ProjectActivityCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    description?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectActivityMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    description?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectActivityMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    description?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type DisbursementCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    date?: SortOrder
    referenceNumber?: SortOrder
    amount?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type DisbursementAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type DisbursementMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    date?: SortOrder
    referenceNumber?: SortOrder
    amount?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type DisbursementMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    date?: SortOrder
    referenceNumber?: SortOrder
    amount?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type DisbursementSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EnumNotificationPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationPriority | EnumNotificationPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationPriorityFilter<$PrismaModel> | $Enums.NotificationPriority
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type TaskNotificationCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    notifyUserId?: SortOrder
    priority?: SortOrder
    description?: SortOrder
    acknowledged?: SortOrder
    acknowledgedAt?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type TaskNotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    notifyUserId?: SortOrder
    priority?: SortOrder
    description?: SortOrder
    acknowledged?: SortOrder
    acknowledgedAt?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type TaskNotificationMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    notifyUserId?: SortOrder
    priority?: SortOrder
    description?: SortOrder
    acknowledged?: SortOrder
    acknowledgedAt?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumNotificationPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationPriority | EnumNotificationPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationPriorityWithAggregatesFilter<$PrismaModel> | $Enums.NotificationPriority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationPriorityFilter<$PrismaModel>
    _max?: NestedEnumNotificationPriorityFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type TaskNotificationScalarRelationFilter = {
    is?: TaskNotificationWhereInput
    isNot?: TaskNotificationWhereInput
  }

  export type TaskReplyDocumentListRelationFilter = {
    every?: TaskReplyDocumentWhereInput
    some?: TaskReplyDocumentWhereInput
    none?: TaskReplyDocumentWhereInput
  }

  export type TaskReplyDocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskReplyCountOrderByAggregateInput = {
    id?: SortOrder
    taskNotificationId?: SortOrder
    message?: SortOrder
    taskStatus?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type TaskReplyMaxOrderByAggregateInput = {
    id?: SortOrder
    taskNotificationId?: SortOrder
    message?: SortOrder
    taskStatus?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type TaskReplyMinOrderByAggregateInput = {
    id?: SortOrder
    taskNotificationId?: SortOrder
    message?: SortOrder
    taskStatus?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type TaskReplyScalarRelationFilter = {
    is?: TaskReplyWhereInput
    isNot?: TaskReplyWhereInput
  }

  export type TaskReplyDocumentCountOrderByAggregateInput = {
    id?: SortOrder
    replyId?: SortOrder
    fileName?: SortOrder
    fileUrl?: SortOrder
    fileSize?: SortOrder
    fileType?: SortOrder
    createdAt?: SortOrder
  }

  export type TaskReplyDocumentAvgOrderByAggregateInput = {
    fileSize?: SortOrder
  }

  export type TaskReplyDocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    replyId?: SortOrder
    fileName?: SortOrder
    fileUrl?: SortOrder
    fileSize?: SortOrder
    fileType?: SortOrder
    createdAt?: SortOrder
  }

  export type TaskReplyDocumentMinOrderByAggregateInput = {
    id?: SortOrder
    replyId?: SortOrder
    fileName?: SortOrder
    fileUrl?: SortOrder
    fileSize?: SortOrder
    fileType?: SortOrder
    createdAt?: SortOrder
  }

  export type TaskReplyDocumentSumOrderByAggregateInput = {
    fileSize?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
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

  export type EnumDocumentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeFilter<$PrismaModel> | $Enums.DocumentType
  }

  export type EnumDocumentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusFilter<$PrismaModel> | $Enums.DocumentStatus
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type DocumentCountOrderByAggregateInput = {
    id?: SortOrder
    documentCode?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    filePath?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    amount?: SortOrder
    purpose?: SortOrder
    district?: SortOrder
    projectRef?: SortOrder
    releasedAt?: SortOrder
    releasedTo?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentAvgOrderByAggregateInput = {
    fileSize?: SortOrder
    amount?: SortOrder
  }

  export type DocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    documentCode?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    filePath?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    amount?: SortOrder
    purpose?: SortOrder
    district?: SortOrder
    projectRef?: SortOrder
    releasedAt?: SortOrder
    releasedTo?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentMinOrderByAggregateInput = {
    id?: SortOrder
    documentCode?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    filePath?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    amount?: SortOrder
    purpose?: SortOrder
    district?: SortOrder
    projectRef?: SortOrder
    releasedAt?: SortOrder
    releasedTo?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentSumOrderByAggregateInput = {
    fileSize?: SortOrder
    amount?: SortOrder
  }

  export type EnumDocumentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocumentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentTypeFilter<$PrismaModel>
    _max?: NestedEnumDocumentTypeFilter<$PrismaModel>
  }

  export type EnumDocumentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel> | $Enums.DocumentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentStatusFilter<$PrismaModel>
    _max?: NestedEnumDocumentStatusFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type EnumProjectFileTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectFileType | EnumProjectFileTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectFileType[] | ListEnumProjectFileTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectFileType[] | ListEnumProjectFileTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectFileTypeFilter<$PrismaModel> | $Enums.ProjectFileType
  }

  export type ProjectFileCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    fileName?: SortOrder
    fileUrl?: SortOrder
    fileType?: SortOrder
    fileSize?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectFileAvgOrderByAggregateInput = {
    fileSize?: SortOrder
  }

  export type ProjectFileMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    fileName?: SortOrder
    fileUrl?: SortOrder
    fileType?: SortOrder
    fileSize?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectFileMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    fileName?: SortOrder
    fileUrl?: SortOrder
    fileType?: SortOrder
    fileSize?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectFileSumOrderByAggregateInput = {
    fileSize?: SortOrder
  }

  export type EnumProjectFileTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectFileType | EnumProjectFileTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectFileType[] | ListEnumProjectFileTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectFileType[] | ListEnumProjectFileTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectFileTypeWithAggregatesFilter<$PrismaModel> | $Enums.ProjectFileType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectFileTypeFilter<$PrismaModel>
    _max?: NestedEnumProjectFileTypeFilter<$PrismaModel>
  }

  export type PostCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdById?: SortOrder
  }

  export type PostAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PostMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdById?: SortOrder
  }

  export type PostMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdById?: SortOrder
  }

  export type PostSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PostCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<PostCreateWithoutCreatedByInput, PostUncheckedCreateWithoutCreatedByInput> | PostCreateWithoutCreatedByInput[] | PostUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: PostCreateOrConnectWithoutCreatedByInput | PostCreateOrConnectWithoutCreatedByInput[]
    createMany?: PostCreateManyCreatedByInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type ProjectCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ProjectCreateWithoutCreatedByInput, ProjectUncheckedCreateWithoutCreatedByInput> | ProjectCreateWithoutCreatedByInput[] | ProjectUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutCreatedByInput | ProjectCreateOrConnectWithoutCreatedByInput[]
    createMany?: ProjectCreateManyCreatedByInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type UserSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
  }

  export type DocumentCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<DocumentCreateWithoutCreatedByInput, DocumentUncheckedCreateWithoutCreatedByInput> | DocumentCreateWithoutCreatedByInput[] | DocumentUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutCreatedByInput | DocumentCreateOrConnectWithoutCreatedByInput[]
    createMany?: DocumentCreateManyCreatedByInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type ProjectActivityCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ProjectActivityCreateWithoutCreatedByInput, ProjectActivityUncheckedCreateWithoutCreatedByInput> | ProjectActivityCreateWithoutCreatedByInput[] | ProjectActivityUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProjectActivityCreateOrConnectWithoutCreatedByInput | ProjectActivityCreateOrConnectWithoutCreatedByInput[]
    createMany?: ProjectActivityCreateManyCreatedByInputEnvelope
    connect?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
  }

  export type DisbursementCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<DisbursementCreateWithoutCreatedByInput, DisbursementUncheckedCreateWithoutCreatedByInput> | DisbursementCreateWithoutCreatedByInput[] | DisbursementUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: DisbursementCreateOrConnectWithoutCreatedByInput | DisbursementCreateOrConnectWithoutCreatedByInput[]
    createMany?: DisbursementCreateManyCreatedByInputEnvelope
    connect?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
  }

  export type TaskNotificationCreateNestedManyWithoutNotifyUserInput = {
    create?: XOR<TaskNotificationCreateWithoutNotifyUserInput, TaskNotificationUncheckedCreateWithoutNotifyUserInput> | TaskNotificationCreateWithoutNotifyUserInput[] | TaskNotificationUncheckedCreateWithoutNotifyUserInput[]
    connectOrCreate?: TaskNotificationCreateOrConnectWithoutNotifyUserInput | TaskNotificationCreateOrConnectWithoutNotifyUserInput[]
    createMany?: TaskNotificationCreateManyNotifyUserInputEnvelope
    connect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
  }

  export type TaskNotificationCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<TaskNotificationCreateWithoutCreatedByInput, TaskNotificationUncheckedCreateWithoutCreatedByInput> | TaskNotificationCreateWithoutCreatedByInput[] | TaskNotificationUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: TaskNotificationCreateOrConnectWithoutCreatedByInput | TaskNotificationCreateOrConnectWithoutCreatedByInput[]
    createMany?: TaskNotificationCreateManyCreatedByInputEnvelope
    connect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
  }

  export type TaskReplyCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<TaskReplyCreateWithoutCreatedByInput, TaskReplyUncheckedCreateWithoutCreatedByInput> | TaskReplyCreateWithoutCreatedByInput[] | TaskReplyUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: TaskReplyCreateOrConnectWithoutCreatedByInput | TaskReplyCreateOrConnectWithoutCreatedByInput[]
    createMany?: TaskReplyCreateManyCreatedByInputEnvelope
    connect?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
  }

  export type ProjectFileCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ProjectFileCreateWithoutCreatedByInput, ProjectFileUncheckedCreateWithoutCreatedByInput> | ProjectFileCreateWithoutCreatedByInput[] | ProjectFileUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutCreatedByInput | ProjectFileCreateOrConnectWithoutCreatedByInput[]
    createMany?: ProjectFileCreateManyCreatedByInputEnvelope
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
  }

  export type PostUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<PostCreateWithoutCreatedByInput, PostUncheckedCreateWithoutCreatedByInput> | PostCreateWithoutCreatedByInput[] | PostUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: PostCreateOrConnectWithoutCreatedByInput | PostCreateOrConnectWithoutCreatedByInput[]
    createMany?: PostCreateManyCreatedByInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ProjectCreateWithoutCreatedByInput, ProjectUncheckedCreateWithoutCreatedByInput> | ProjectCreateWithoutCreatedByInput[] | ProjectUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutCreatedByInput | ProjectCreateOrConnectWithoutCreatedByInput[]
    createMany?: ProjectCreateManyCreatedByInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type UserSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
  }

  export type DocumentUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<DocumentCreateWithoutCreatedByInput, DocumentUncheckedCreateWithoutCreatedByInput> | DocumentCreateWithoutCreatedByInput[] | DocumentUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutCreatedByInput | DocumentCreateOrConnectWithoutCreatedByInput[]
    createMany?: DocumentCreateManyCreatedByInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type ProjectActivityUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ProjectActivityCreateWithoutCreatedByInput, ProjectActivityUncheckedCreateWithoutCreatedByInput> | ProjectActivityCreateWithoutCreatedByInput[] | ProjectActivityUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProjectActivityCreateOrConnectWithoutCreatedByInput | ProjectActivityCreateOrConnectWithoutCreatedByInput[]
    createMany?: ProjectActivityCreateManyCreatedByInputEnvelope
    connect?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
  }

  export type DisbursementUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<DisbursementCreateWithoutCreatedByInput, DisbursementUncheckedCreateWithoutCreatedByInput> | DisbursementCreateWithoutCreatedByInput[] | DisbursementUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: DisbursementCreateOrConnectWithoutCreatedByInput | DisbursementCreateOrConnectWithoutCreatedByInput[]
    createMany?: DisbursementCreateManyCreatedByInputEnvelope
    connect?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
  }

  export type TaskNotificationUncheckedCreateNestedManyWithoutNotifyUserInput = {
    create?: XOR<TaskNotificationCreateWithoutNotifyUserInput, TaskNotificationUncheckedCreateWithoutNotifyUserInput> | TaskNotificationCreateWithoutNotifyUserInput[] | TaskNotificationUncheckedCreateWithoutNotifyUserInput[]
    connectOrCreate?: TaskNotificationCreateOrConnectWithoutNotifyUserInput | TaskNotificationCreateOrConnectWithoutNotifyUserInput[]
    createMany?: TaskNotificationCreateManyNotifyUserInputEnvelope
    connect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
  }

  export type TaskNotificationUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<TaskNotificationCreateWithoutCreatedByInput, TaskNotificationUncheckedCreateWithoutCreatedByInput> | TaskNotificationCreateWithoutCreatedByInput[] | TaskNotificationUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: TaskNotificationCreateOrConnectWithoutCreatedByInput | TaskNotificationCreateOrConnectWithoutCreatedByInput[]
    createMany?: TaskNotificationCreateManyCreatedByInputEnvelope
    connect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
  }

  export type TaskReplyUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<TaskReplyCreateWithoutCreatedByInput, TaskReplyUncheckedCreateWithoutCreatedByInput> | TaskReplyCreateWithoutCreatedByInput[] | TaskReplyUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: TaskReplyCreateOrConnectWithoutCreatedByInput | TaskReplyCreateOrConnectWithoutCreatedByInput[]
    createMany?: TaskReplyCreateManyCreatedByInputEnvelope
    connect?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
  }

  export type ProjectFileUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ProjectFileCreateWithoutCreatedByInput, ProjectFileUncheckedCreateWithoutCreatedByInput> | ProjectFileCreateWithoutCreatedByInput[] | ProjectFileUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutCreatedByInput | ProjectFileCreateOrConnectWithoutCreatedByInput[]
    createMany?: ProjectFileCreateManyCreatedByInputEnvelope
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type NullableEnumSexFieldUpdateOperationsInput = {
    set?: $Enums.Sex | null
  }

  export type EnumUserStatusFieldUpdateOperationsInput = {
    set?: $Enums.UserStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PostUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<PostCreateWithoutCreatedByInput, PostUncheckedCreateWithoutCreatedByInput> | PostCreateWithoutCreatedByInput[] | PostUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: PostCreateOrConnectWithoutCreatedByInput | PostCreateOrConnectWithoutCreatedByInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutCreatedByInput | PostUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: PostCreateManyCreatedByInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutCreatedByInput | PostUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: PostUpdateManyWithWhereWithoutCreatedByInput | PostUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type ProjectUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ProjectCreateWithoutCreatedByInput, ProjectUncheckedCreateWithoutCreatedByInput> | ProjectCreateWithoutCreatedByInput[] | ProjectUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutCreatedByInput | ProjectCreateOrConnectWithoutCreatedByInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutCreatedByInput | ProjectUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ProjectCreateManyCreatedByInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutCreatedByInput | ProjectUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutCreatedByInput | ProjectUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type UserSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    upsert?: UserSessionUpsertWithWhereUniqueWithoutUserInput | UserSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    set?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    disconnect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    delete?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    update?: UserSessionUpdateWithWhereUniqueWithoutUserInput | UserSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserSessionUpdateManyWithWhereWithoutUserInput | UserSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
  }

  export type DocumentUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<DocumentCreateWithoutCreatedByInput, DocumentUncheckedCreateWithoutCreatedByInput> | DocumentCreateWithoutCreatedByInput[] | DocumentUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutCreatedByInput | DocumentCreateOrConnectWithoutCreatedByInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutCreatedByInput | DocumentUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: DocumentCreateManyCreatedByInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutCreatedByInput | DocumentUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutCreatedByInput | DocumentUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type ProjectActivityUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ProjectActivityCreateWithoutCreatedByInput, ProjectActivityUncheckedCreateWithoutCreatedByInput> | ProjectActivityCreateWithoutCreatedByInput[] | ProjectActivityUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProjectActivityCreateOrConnectWithoutCreatedByInput | ProjectActivityCreateOrConnectWithoutCreatedByInput[]
    upsert?: ProjectActivityUpsertWithWhereUniqueWithoutCreatedByInput | ProjectActivityUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ProjectActivityCreateManyCreatedByInputEnvelope
    set?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
    disconnect?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
    delete?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
    connect?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
    update?: ProjectActivityUpdateWithWhereUniqueWithoutCreatedByInput | ProjectActivityUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ProjectActivityUpdateManyWithWhereWithoutCreatedByInput | ProjectActivityUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ProjectActivityScalarWhereInput | ProjectActivityScalarWhereInput[]
  }

  export type DisbursementUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<DisbursementCreateWithoutCreatedByInput, DisbursementUncheckedCreateWithoutCreatedByInput> | DisbursementCreateWithoutCreatedByInput[] | DisbursementUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: DisbursementCreateOrConnectWithoutCreatedByInput | DisbursementCreateOrConnectWithoutCreatedByInput[]
    upsert?: DisbursementUpsertWithWhereUniqueWithoutCreatedByInput | DisbursementUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: DisbursementCreateManyCreatedByInputEnvelope
    set?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
    disconnect?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
    delete?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
    connect?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
    update?: DisbursementUpdateWithWhereUniqueWithoutCreatedByInput | DisbursementUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: DisbursementUpdateManyWithWhereWithoutCreatedByInput | DisbursementUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: DisbursementScalarWhereInput | DisbursementScalarWhereInput[]
  }

  export type TaskNotificationUpdateManyWithoutNotifyUserNestedInput = {
    create?: XOR<TaskNotificationCreateWithoutNotifyUserInput, TaskNotificationUncheckedCreateWithoutNotifyUserInput> | TaskNotificationCreateWithoutNotifyUserInput[] | TaskNotificationUncheckedCreateWithoutNotifyUserInput[]
    connectOrCreate?: TaskNotificationCreateOrConnectWithoutNotifyUserInput | TaskNotificationCreateOrConnectWithoutNotifyUserInput[]
    upsert?: TaskNotificationUpsertWithWhereUniqueWithoutNotifyUserInput | TaskNotificationUpsertWithWhereUniqueWithoutNotifyUserInput[]
    createMany?: TaskNotificationCreateManyNotifyUserInputEnvelope
    set?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    disconnect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    delete?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    connect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    update?: TaskNotificationUpdateWithWhereUniqueWithoutNotifyUserInput | TaskNotificationUpdateWithWhereUniqueWithoutNotifyUserInput[]
    updateMany?: TaskNotificationUpdateManyWithWhereWithoutNotifyUserInput | TaskNotificationUpdateManyWithWhereWithoutNotifyUserInput[]
    deleteMany?: TaskNotificationScalarWhereInput | TaskNotificationScalarWhereInput[]
  }

  export type TaskNotificationUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<TaskNotificationCreateWithoutCreatedByInput, TaskNotificationUncheckedCreateWithoutCreatedByInput> | TaskNotificationCreateWithoutCreatedByInput[] | TaskNotificationUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: TaskNotificationCreateOrConnectWithoutCreatedByInput | TaskNotificationCreateOrConnectWithoutCreatedByInput[]
    upsert?: TaskNotificationUpsertWithWhereUniqueWithoutCreatedByInput | TaskNotificationUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: TaskNotificationCreateManyCreatedByInputEnvelope
    set?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    disconnect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    delete?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    connect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    update?: TaskNotificationUpdateWithWhereUniqueWithoutCreatedByInput | TaskNotificationUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: TaskNotificationUpdateManyWithWhereWithoutCreatedByInput | TaskNotificationUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: TaskNotificationScalarWhereInput | TaskNotificationScalarWhereInput[]
  }

  export type TaskReplyUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<TaskReplyCreateWithoutCreatedByInput, TaskReplyUncheckedCreateWithoutCreatedByInput> | TaskReplyCreateWithoutCreatedByInput[] | TaskReplyUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: TaskReplyCreateOrConnectWithoutCreatedByInput | TaskReplyCreateOrConnectWithoutCreatedByInput[]
    upsert?: TaskReplyUpsertWithWhereUniqueWithoutCreatedByInput | TaskReplyUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: TaskReplyCreateManyCreatedByInputEnvelope
    set?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
    disconnect?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
    delete?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
    connect?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
    update?: TaskReplyUpdateWithWhereUniqueWithoutCreatedByInput | TaskReplyUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: TaskReplyUpdateManyWithWhereWithoutCreatedByInput | TaskReplyUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: TaskReplyScalarWhereInput | TaskReplyScalarWhereInput[]
  }

  export type ProjectFileUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ProjectFileCreateWithoutCreatedByInput, ProjectFileUncheckedCreateWithoutCreatedByInput> | ProjectFileCreateWithoutCreatedByInput[] | ProjectFileUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutCreatedByInput | ProjectFileCreateOrConnectWithoutCreatedByInput[]
    upsert?: ProjectFileUpsertWithWhereUniqueWithoutCreatedByInput | ProjectFileUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ProjectFileCreateManyCreatedByInputEnvelope
    set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    update?: ProjectFileUpdateWithWhereUniqueWithoutCreatedByInput | ProjectFileUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ProjectFileUpdateManyWithWhereWithoutCreatedByInput | ProjectFileUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
  }

  export type PostUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<PostCreateWithoutCreatedByInput, PostUncheckedCreateWithoutCreatedByInput> | PostCreateWithoutCreatedByInput[] | PostUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: PostCreateOrConnectWithoutCreatedByInput | PostCreateOrConnectWithoutCreatedByInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutCreatedByInput | PostUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: PostCreateManyCreatedByInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutCreatedByInput | PostUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: PostUpdateManyWithWhereWithoutCreatedByInput | PostUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ProjectCreateWithoutCreatedByInput, ProjectUncheckedCreateWithoutCreatedByInput> | ProjectCreateWithoutCreatedByInput[] | ProjectUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutCreatedByInput | ProjectCreateOrConnectWithoutCreatedByInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutCreatedByInput | ProjectUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ProjectCreateManyCreatedByInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutCreatedByInput | ProjectUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutCreatedByInput | ProjectUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type UserSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    upsert?: UserSessionUpsertWithWhereUniqueWithoutUserInput | UserSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    set?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    disconnect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    delete?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    update?: UserSessionUpdateWithWhereUniqueWithoutUserInput | UserSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserSessionUpdateManyWithWhereWithoutUserInput | UserSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
  }

  export type DocumentUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<DocumentCreateWithoutCreatedByInput, DocumentUncheckedCreateWithoutCreatedByInput> | DocumentCreateWithoutCreatedByInput[] | DocumentUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutCreatedByInput | DocumentCreateOrConnectWithoutCreatedByInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutCreatedByInput | DocumentUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: DocumentCreateManyCreatedByInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutCreatedByInput | DocumentUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutCreatedByInput | DocumentUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type ProjectActivityUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ProjectActivityCreateWithoutCreatedByInput, ProjectActivityUncheckedCreateWithoutCreatedByInput> | ProjectActivityCreateWithoutCreatedByInput[] | ProjectActivityUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProjectActivityCreateOrConnectWithoutCreatedByInput | ProjectActivityCreateOrConnectWithoutCreatedByInput[]
    upsert?: ProjectActivityUpsertWithWhereUniqueWithoutCreatedByInput | ProjectActivityUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ProjectActivityCreateManyCreatedByInputEnvelope
    set?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
    disconnect?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
    delete?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
    connect?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
    update?: ProjectActivityUpdateWithWhereUniqueWithoutCreatedByInput | ProjectActivityUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ProjectActivityUpdateManyWithWhereWithoutCreatedByInput | ProjectActivityUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ProjectActivityScalarWhereInput | ProjectActivityScalarWhereInput[]
  }

  export type DisbursementUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<DisbursementCreateWithoutCreatedByInput, DisbursementUncheckedCreateWithoutCreatedByInput> | DisbursementCreateWithoutCreatedByInput[] | DisbursementUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: DisbursementCreateOrConnectWithoutCreatedByInput | DisbursementCreateOrConnectWithoutCreatedByInput[]
    upsert?: DisbursementUpsertWithWhereUniqueWithoutCreatedByInput | DisbursementUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: DisbursementCreateManyCreatedByInputEnvelope
    set?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
    disconnect?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
    delete?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
    connect?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
    update?: DisbursementUpdateWithWhereUniqueWithoutCreatedByInput | DisbursementUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: DisbursementUpdateManyWithWhereWithoutCreatedByInput | DisbursementUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: DisbursementScalarWhereInput | DisbursementScalarWhereInput[]
  }

  export type TaskNotificationUncheckedUpdateManyWithoutNotifyUserNestedInput = {
    create?: XOR<TaskNotificationCreateWithoutNotifyUserInput, TaskNotificationUncheckedCreateWithoutNotifyUserInput> | TaskNotificationCreateWithoutNotifyUserInput[] | TaskNotificationUncheckedCreateWithoutNotifyUserInput[]
    connectOrCreate?: TaskNotificationCreateOrConnectWithoutNotifyUserInput | TaskNotificationCreateOrConnectWithoutNotifyUserInput[]
    upsert?: TaskNotificationUpsertWithWhereUniqueWithoutNotifyUserInput | TaskNotificationUpsertWithWhereUniqueWithoutNotifyUserInput[]
    createMany?: TaskNotificationCreateManyNotifyUserInputEnvelope
    set?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    disconnect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    delete?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    connect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    update?: TaskNotificationUpdateWithWhereUniqueWithoutNotifyUserInput | TaskNotificationUpdateWithWhereUniqueWithoutNotifyUserInput[]
    updateMany?: TaskNotificationUpdateManyWithWhereWithoutNotifyUserInput | TaskNotificationUpdateManyWithWhereWithoutNotifyUserInput[]
    deleteMany?: TaskNotificationScalarWhereInput | TaskNotificationScalarWhereInput[]
  }

  export type TaskNotificationUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<TaskNotificationCreateWithoutCreatedByInput, TaskNotificationUncheckedCreateWithoutCreatedByInput> | TaskNotificationCreateWithoutCreatedByInput[] | TaskNotificationUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: TaskNotificationCreateOrConnectWithoutCreatedByInput | TaskNotificationCreateOrConnectWithoutCreatedByInput[]
    upsert?: TaskNotificationUpsertWithWhereUniqueWithoutCreatedByInput | TaskNotificationUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: TaskNotificationCreateManyCreatedByInputEnvelope
    set?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    disconnect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    delete?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    connect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    update?: TaskNotificationUpdateWithWhereUniqueWithoutCreatedByInput | TaskNotificationUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: TaskNotificationUpdateManyWithWhereWithoutCreatedByInput | TaskNotificationUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: TaskNotificationScalarWhereInput | TaskNotificationScalarWhereInput[]
  }

  export type TaskReplyUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<TaskReplyCreateWithoutCreatedByInput, TaskReplyUncheckedCreateWithoutCreatedByInput> | TaskReplyCreateWithoutCreatedByInput[] | TaskReplyUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: TaskReplyCreateOrConnectWithoutCreatedByInput | TaskReplyCreateOrConnectWithoutCreatedByInput[]
    upsert?: TaskReplyUpsertWithWhereUniqueWithoutCreatedByInput | TaskReplyUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: TaskReplyCreateManyCreatedByInputEnvelope
    set?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
    disconnect?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
    delete?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
    connect?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
    update?: TaskReplyUpdateWithWhereUniqueWithoutCreatedByInput | TaskReplyUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: TaskReplyUpdateManyWithWhereWithoutCreatedByInput | TaskReplyUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: TaskReplyScalarWhereInput | TaskReplyScalarWhereInput[]
  }

  export type ProjectFileUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ProjectFileCreateWithoutCreatedByInput, ProjectFileUncheckedCreateWithoutCreatedByInput> | ProjectFileCreateWithoutCreatedByInput[] | ProjectFileUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutCreatedByInput | ProjectFileCreateOrConnectWithoutCreatedByInput[]
    upsert?: ProjectFileUpsertWithWhereUniqueWithoutCreatedByInput | ProjectFileUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ProjectFileCreateManyCreatedByInputEnvelope
    set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    update?: ProjectFileUpdateWithWhereUniqueWithoutCreatedByInput | ProjectFileUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ProjectFileUpdateManyWithWhereWithoutCreatedByInput | ProjectFileUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutProjectsInput = {
    create?: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectsInput
    connect?: UserWhereUniqueInput
  }

  export type ProjectActivityCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectActivityCreateWithoutProjectInput, ProjectActivityUncheckedCreateWithoutProjectInput> | ProjectActivityCreateWithoutProjectInput[] | ProjectActivityUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectActivityCreateOrConnectWithoutProjectInput | ProjectActivityCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectActivityCreateManyProjectInputEnvelope
    connect?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
  }

  export type DisbursementCreateNestedManyWithoutProjectInput = {
    create?: XOR<DisbursementCreateWithoutProjectInput, DisbursementUncheckedCreateWithoutProjectInput> | DisbursementCreateWithoutProjectInput[] | DisbursementUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DisbursementCreateOrConnectWithoutProjectInput | DisbursementCreateOrConnectWithoutProjectInput[]
    createMany?: DisbursementCreateManyProjectInputEnvelope
    connect?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
  }

  export type TaskNotificationCreateNestedManyWithoutProjectInput = {
    create?: XOR<TaskNotificationCreateWithoutProjectInput, TaskNotificationUncheckedCreateWithoutProjectInput> | TaskNotificationCreateWithoutProjectInput[] | TaskNotificationUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TaskNotificationCreateOrConnectWithoutProjectInput | TaskNotificationCreateOrConnectWithoutProjectInput[]
    createMany?: TaskNotificationCreateManyProjectInputEnvelope
    connect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
  }

  export type ProjectFileCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
  }

  export type ProjectActivityUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectActivityCreateWithoutProjectInput, ProjectActivityUncheckedCreateWithoutProjectInput> | ProjectActivityCreateWithoutProjectInput[] | ProjectActivityUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectActivityCreateOrConnectWithoutProjectInput | ProjectActivityCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectActivityCreateManyProjectInputEnvelope
    connect?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
  }

  export type DisbursementUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<DisbursementCreateWithoutProjectInput, DisbursementUncheckedCreateWithoutProjectInput> | DisbursementCreateWithoutProjectInput[] | DisbursementUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DisbursementCreateOrConnectWithoutProjectInput | DisbursementCreateOrConnectWithoutProjectInput[]
    createMany?: DisbursementCreateManyProjectInputEnvelope
    connect?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
  }

  export type TaskNotificationUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<TaskNotificationCreateWithoutProjectInput, TaskNotificationUncheckedCreateWithoutProjectInput> | TaskNotificationCreateWithoutProjectInput[] | TaskNotificationUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TaskNotificationCreateOrConnectWithoutProjectInput | TaskNotificationCreateOrConnectWithoutProjectInput[]
    createMany?: TaskNotificationCreateManyProjectInputEnvelope
    connect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
  }

  export type ProjectFileUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
  }

  export type NullableEnumProjectSubTypeFieldUpdateOperationsInput = {
    set?: $Enums.ProjectSubType | null
  }

  export type EnumModeOfImplementationFieldUpdateOperationsInput = {
    set?: $Enums.ModeOfImplementation
  }

  export type EnumDistrictFieldUpdateOperationsInput = {
    set?: $Enums.District
  }

  export type EnumSourceOfFundFieldUpdateOperationsInput = {
    set?: $Enums.SourceOfFund
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableEnumDistrictFieldUpdateOperationsInput = {
    set?: $Enums.District | null
  }

  export type EnumProjectStatusFieldUpdateOperationsInput = {
    set?: $Enums.ProjectStatus
  }

  export type UserUpdateOneRequiredWithoutProjectsNestedInput = {
    create?: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectsInput
    upsert?: UserUpsertWithoutProjectsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProjectsInput, UserUpdateWithoutProjectsInput>, UserUncheckedUpdateWithoutProjectsInput>
  }

  export type ProjectActivityUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectActivityCreateWithoutProjectInput, ProjectActivityUncheckedCreateWithoutProjectInput> | ProjectActivityCreateWithoutProjectInput[] | ProjectActivityUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectActivityCreateOrConnectWithoutProjectInput | ProjectActivityCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectActivityUpsertWithWhereUniqueWithoutProjectInput | ProjectActivityUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectActivityCreateManyProjectInputEnvelope
    set?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
    disconnect?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
    delete?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
    connect?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
    update?: ProjectActivityUpdateWithWhereUniqueWithoutProjectInput | ProjectActivityUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectActivityUpdateManyWithWhereWithoutProjectInput | ProjectActivityUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectActivityScalarWhereInput | ProjectActivityScalarWhereInput[]
  }

  export type DisbursementUpdateManyWithoutProjectNestedInput = {
    create?: XOR<DisbursementCreateWithoutProjectInput, DisbursementUncheckedCreateWithoutProjectInput> | DisbursementCreateWithoutProjectInput[] | DisbursementUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DisbursementCreateOrConnectWithoutProjectInput | DisbursementCreateOrConnectWithoutProjectInput[]
    upsert?: DisbursementUpsertWithWhereUniqueWithoutProjectInput | DisbursementUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: DisbursementCreateManyProjectInputEnvelope
    set?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
    disconnect?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
    delete?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
    connect?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
    update?: DisbursementUpdateWithWhereUniqueWithoutProjectInput | DisbursementUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: DisbursementUpdateManyWithWhereWithoutProjectInput | DisbursementUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: DisbursementScalarWhereInput | DisbursementScalarWhereInput[]
  }

  export type TaskNotificationUpdateManyWithoutProjectNestedInput = {
    create?: XOR<TaskNotificationCreateWithoutProjectInput, TaskNotificationUncheckedCreateWithoutProjectInput> | TaskNotificationCreateWithoutProjectInput[] | TaskNotificationUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TaskNotificationCreateOrConnectWithoutProjectInput | TaskNotificationCreateOrConnectWithoutProjectInput[]
    upsert?: TaskNotificationUpsertWithWhereUniqueWithoutProjectInput | TaskNotificationUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: TaskNotificationCreateManyProjectInputEnvelope
    set?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    disconnect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    delete?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    connect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    update?: TaskNotificationUpdateWithWhereUniqueWithoutProjectInput | TaskNotificationUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: TaskNotificationUpdateManyWithWhereWithoutProjectInput | TaskNotificationUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: TaskNotificationScalarWhereInput | TaskNotificationScalarWhereInput[]
  }

  export type ProjectFileUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectFileUpsertWithWhereUniqueWithoutProjectInput | ProjectFileUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    update?: ProjectFileUpdateWithWhereUniqueWithoutProjectInput | ProjectFileUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectFileUpdateManyWithWhereWithoutProjectInput | ProjectFileUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
  }

  export type ProjectActivityUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectActivityCreateWithoutProjectInput, ProjectActivityUncheckedCreateWithoutProjectInput> | ProjectActivityCreateWithoutProjectInput[] | ProjectActivityUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectActivityCreateOrConnectWithoutProjectInput | ProjectActivityCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectActivityUpsertWithWhereUniqueWithoutProjectInput | ProjectActivityUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectActivityCreateManyProjectInputEnvelope
    set?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
    disconnect?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
    delete?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
    connect?: ProjectActivityWhereUniqueInput | ProjectActivityWhereUniqueInput[]
    update?: ProjectActivityUpdateWithWhereUniqueWithoutProjectInput | ProjectActivityUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectActivityUpdateManyWithWhereWithoutProjectInput | ProjectActivityUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectActivityScalarWhereInput | ProjectActivityScalarWhereInput[]
  }

  export type DisbursementUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<DisbursementCreateWithoutProjectInput, DisbursementUncheckedCreateWithoutProjectInput> | DisbursementCreateWithoutProjectInput[] | DisbursementUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DisbursementCreateOrConnectWithoutProjectInput | DisbursementCreateOrConnectWithoutProjectInput[]
    upsert?: DisbursementUpsertWithWhereUniqueWithoutProjectInput | DisbursementUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: DisbursementCreateManyProjectInputEnvelope
    set?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
    disconnect?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
    delete?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
    connect?: DisbursementWhereUniqueInput | DisbursementWhereUniqueInput[]
    update?: DisbursementUpdateWithWhereUniqueWithoutProjectInput | DisbursementUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: DisbursementUpdateManyWithWhereWithoutProjectInput | DisbursementUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: DisbursementScalarWhereInput | DisbursementScalarWhereInput[]
  }

  export type TaskNotificationUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<TaskNotificationCreateWithoutProjectInput, TaskNotificationUncheckedCreateWithoutProjectInput> | TaskNotificationCreateWithoutProjectInput[] | TaskNotificationUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TaskNotificationCreateOrConnectWithoutProjectInput | TaskNotificationCreateOrConnectWithoutProjectInput[]
    upsert?: TaskNotificationUpsertWithWhereUniqueWithoutProjectInput | TaskNotificationUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: TaskNotificationCreateManyProjectInputEnvelope
    set?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    disconnect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    delete?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    connect?: TaskNotificationWhereUniqueInput | TaskNotificationWhereUniqueInput[]
    update?: TaskNotificationUpdateWithWhereUniqueWithoutProjectInput | TaskNotificationUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: TaskNotificationUpdateManyWithWhereWithoutProjectInput | TaskNotificationUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: TaskNotificationScalarWhereInput | TaskNotificationScalarWhereInput[]
  }

  export type ProjectFileUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectFileUpsertWithWhereUniqueWithoutProjectInput | ProjectFileUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    update?: ProjectFileUpdateWithWhereUniqueWithoutProjectInput | ProjectFileUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectFileUpdateManyWithWhereWithoutProjectInput | ProjectFileUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutActivitiesInput = {
    create?: XOR<ProjectCreateWithoutActivitiesInput, ProjectUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutActivitiesInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutProjectActivitiesInput = {
    create?: XOR<UserCreateWithoutProjectActivitiesInput, UserUncheckedCreateWithoutProjectActivitiesInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectActivitiesInput
    connect?: UserWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutActivitiesNestedInput = {
    create?: XOR<ProjectCreateWithoutActivitiesInput, ProjectUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutActivitiesInput
    upsert?: ProjectUpsertWithoutActivitiesInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutActivitiesInput, ProjectUpdateWithoutActivitiesInput>, ProjectUncheckedUpdateWithoutActivitiesInput>
  }

  export type UserUpdateOneRequiredWithoutProjectActivitiesNestedInput = {
    create?: XOR<UserCreateWithoutProjectActivitiesInput, UserUncheckedCreateWithoutProjectActivitiesInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectActivitiesInput
    upsert?: UserUpsertWithoutProjectActivitiesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProjectActivitiesInput, UserUpdateWithoutProjectActivitiesInput>, UserUncheckedUpdateWithoutProjectActivitiesInput>
  }

  export type ProjectCreateNestedOneWithoutDisbursementsInput = {
    create?: XOR<ProjectCreateWithoutDisbursementsInput, ProjectUncheckedCreateWithoutDisbursementsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutDisbursementsInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutDisbursementsInput = {
    create?: XOR<UserCreateWithoutDisbursementsInput, UserUncheckedCreateWithoutDisbursementsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDisbursementsInput
    connect?: UserWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutDisbursementsNestedInput = {
    create?: XOR<ProjectCreateWithoutDisbursementsInput, ProjectUncheckedCreateWithoutDisbursementsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutDisbursementsInput
    upsert?: ProjectUpsertWithoutDisbursementsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutDisbursementsInput, ProjectUpdateWithoutDisbursementsInput>, ProjectUncheckedUpdateWithoutDisbursementsInput>
  }

  export type UserUpdateOneRequiredWithoutDisbursementsNestedInput = {
    create?: XOR<UserCreateWithoutDisbursementsInput, UserUncheckedCreateWithoutDisbursementsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDisbursementsInput
    upsert?: UserUpsertWithoutDisbursementsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDisbursementsInput, UserUpdateWithoutDisbursementsInput>, UserUncheckedUpdateWithoutDisbursementsInput>
  }

  export type ProjectCreateNestedOneWithoutTaskNotificationsInput = {
    create?: XOR<ProjectCreateWithoutTaskNotificationsInput, ProjectUncheckedCreateWithoutTaskNotificationsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutTaskNotificationsInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTaskNotificationsReceivedInput = {
    create?: XOR<UserCreateWithoutTaskNotificationsReceivedInput, UserUncheckedCreateWithoutTaskNotificationsReceivedInput>
    connectOrCreate?: UserCreateOrConnectWithoutTaskNotificationsReceivedInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTaskNotificationsCreatedInput = {
    create?: XOR<UserCreateWithoutTaskNotificationsCreatedInput, UserUncheckedCreateWithoutTaskNotificationsCreatedInput>
    connectOrCreate?: UserCreateOrConnectWithoutTaskNotificationsCreatedInput
    connect?: UserWhereUniqueInput
  }

  export type TaskReplyCreateNestedManyWithoutTaskNotificationInput = {
    create?: XOR<TaskReplyCreateWithoutTaskNotificationInput, TaskReplyUncheckedCreateWithoutTaskNotificationInput> | TaskReplyCreateWithoutTaskNotificationInput[] | TaskReplyUncheckedCreateWithoutTaskNotificationInput[]
    connectOrCreate?: TaskReplyCreateOrConnectWithoutTaskNotificationInput | TaskReplyCreateOrConnectWithoutTaskNotificationInput[]
    createMany?: TaskReplyCreateManyTaskNotificationInputEnvelope
    connect?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
  }

  export type TaskReplyUncheckedCreateNestedManyWithoutTaskNotificationInput = {
    create?: XOR<TaskReplyCreateWithoutTaskNotificationInput, TaskReplyUncheckedCreateWithoutTaskNotificationInput> | TaskReplyCreateWithoutTaskNotificationInput[] | TaskReplyUncheckedCreateWithoutTaskNotificationInput[]
    connectOrCreate?: TaskReplyCreateOrConnectWithoutTaskNotificationInput | TaskReplyCreateOrConnectWithoutTaskNotificationInput[]
    createMany?: TaskReplyCreateManyTaskNotificationInputEnvelope
    connect?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
  }

  export type EnumNotificationPriorityFieldUpdateOperationsInput = {
    set?: $Enums.NotificationPriority
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ProjectUpdateOneRequiredWithoutTaskNotificationsNestedInput = {
    create?: XOR<ProjectCreateWithoutTaskNotificationsInput, ProjectUncheckedCreateWithoutTaskNotificationsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutTaskNotificationsInput
    upsert?: ProjectUpsertWithoutTaskNotificationsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutTaskNotificationsInput, ProjectUpdateWithoutTaskNotificationsInput>, ProjectUncheckedUpdateWithoutTaskNotificationsInput>
  }

  export type UserUpdateOneRequiredWithoutTaskNotificationsReceivedNestedInput = {
    create?: XOR<UserCreateWithoutTaskNotificationsReceivedInput, UserUncheckedCreateWithoutTaskNotificationsReceivedInput>
    connectOrCreate?: UserCreateOrConnectWithoutTaskNotificationsReceivedInput
    upsert?: UserUpsertWithoutTaskNotificationsReceivedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTaskNotificationsReceivedInput, UserUpdateWithoutTaskNotificationsReceivedInput>, UserUncheckedUpdateWithoutTaskNotificationsReceivedInput>
  }

  export type UserUpdateOneRequiredWithoutTaskNotificationsCreatedNestedInput = {
    create?: XOR<UserCreateWithoutTaskNotificationsCreatedInput, UserUncheckedCreateWithoutTaskNotificationsCreatedInput>
    connectOrCreate?: UserCreateOrConnectWithoutTaskNotificationsCreatedInput
    upsert?: UserUpsertWithoutTaskNotificationsCreatedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTaskNotificationsCreatedInput, UserUpdateWithoutTaskNotificationsCreatedInput>, UserUncheckedUpdateWithoutTaskNotificationsCreatedInput>
  }

  export type TaskReplyUpdateManyWithoutTaskNotificationNestedInput = {
    create?: XOR<TaskReplyCreateWithoutTaskNotificationInput, TaskReplyUncheckedCreateWithoutTaskNotificationInput> | TaskReplyCreateWithoutTaskNotificationInput[] | TaskReplyUncheckedCreateWithoutTaskNotificationInput[]
    connectOrCreate?: TaskReplyCreateOrConnectWithoutTaskNotificationInput | TaskReplyCreateOrConnectWithoutTaskNotificationInput[]
    upsert?: TaskReplyUpsertWithWhereUniqueWithoutTaskNotificationInput | TaskReplyUpsertWithWhereUniqueWithoutTaskNotificationInput[]
    createMany?: TaskReplyCreateManyTaskNotificationInputEnvelope
    set?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
    disconnect?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
    delete?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
    connect?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
    update?: TaskReplyUpdateWithWhereUniqueWithoutTaskNotificationInput | TaskReplyUpdateWithWhereUniqueWithoutTaskNotificationInput[]
    updateMany?: TaskReplyUpdateManyWithWhereWithoutTaskNotificationInput | TaskReplyUpdateManyWithWhereWithoutTaskNotificationInput[]
    deleteMany?: TaskReplyScalarWhereInput | TaskReplyScalarWhereInput[]
  }

  export type TaskReplyUncheckedUpdateManyWithoutTaskNotificationNestedInput = {
    create?: XOR<TaskReplyCreateWithoutTaskNotificationInput, TaskReplyUncheckedCreateWithoutTaskNotificationInput> | TaskReplyCreateWithoutTaskNotificationInput[] | TaskReplyUncheckedCreateWithoutTaskNotificationInput[]
    connectOrCreate?: TaskReplyCreateOrConnectWithoutTaskNotificationInput | TaskReplyCreateOrConnectWithoutTaskNotificationInput[]
    upsert?: TaskReplyUpsertWithWhereUniqueWithoutTaskNotificationInput | TaskReplyUpsertWithWhereUniqueWithoutTaskNotificationInput[]
    createMany?: TaskReplyCreateManyTaskNotificationInputEnvelope
    set?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
    disconnect?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
    delete?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
    connect?: TaskReplyWhereUniqueInput | TaskReplyWhereUniqueInput[]
    update?: TaskReplyUpdateWithWhereUniqueWithoutTaskNotificationInput | TaskReplyUpdateWithWhereUniqueWithoutTaskNotificationInput[]
    updateMany?: TaskReplyUpdateManyWithWhereWithoutTaskNotificationInput | TaskReplyUpdateManyWithWhereWithoutTaskNotificationInput[]
    deleteMany?: TaskReplyScalarWhereInput | TaskReplyScalarWhereInput[]
  }

  export type TaskNotificationCreateNestedOneWithoutRepliesInput = {
    create?: XOR<TaskNotificationCreateWithoutRepliesInput, TaskNotificationUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: TaskNotificationCreateOrConnectWithoutRepliesInput
    connect?: TaskNotificationWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTaskRepliesInput = {
    create?: XOR<UserCreateWithoutTaskRepliesInput, UserUncheckedCreateWithoutTaskRepliesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTaskRepliesInput
    connect?: UserWhereUniqueInput
  }

  export type TaskReplyDocumentCreateNestedManyWithoutReplyInput = {
    create?: XOR<TaskReplyDocumentCreateWithoutReplyInput, TaskReplyDocumentUncheckedCreateWithoutReplyInput> | TaskReplyDocumentCreateWithoutReplyInput[] | TaskReplyDocumentUncheckedCreateWithoutReplyInput[]
    connectOrCreate?: TaskReplyDocumentCreateOrConnectWithoutReplyInput | TaskReplyDocumentCreateOrConnectWithoutReplyInput[]
    createMany?: TaskReplyDocumentCreateManyReplyInputEnvelope
    connect?: TaskReplyDocumentWhereUniqueInput | TaskReplyDocumentWhereUniqueInput[]
  }

  export type TaskReplyDocumentUncheckedCreateNestedManyWithoutReplyInput = {
    create?: XOR<TaskReplyDocumentCreateWithoutReplyInput, TaskReplyDocumentUncheckedCreateWithoutReplyInput> | TaskReplyDocumentCreateWithoutReplyInput[] | TaskReplyDocumentUncheckedCreateWithoutReplyInput[]
    connectOrCreate?: TaskReplyDocumentCreateOrConnectWithoutReplyInput | TaskReplyDocumentCreateOrConnectWithoutReplyInput[]
    createMany?: TaskReplyDocumentCreateManyReplyInputEnvelope
    connect?: TaskReplyDocumentWhereUniqueInput | TaskReplyDocumentWhereUniqueInput[]
  }

  export type TaskNotificationUpdateOneRequiredWithoutRepliesNestedInput = {
    create?: XOR<TaskNotificationCreateWithoutRepliesInput, TaskNotificationUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: TaskNotificationCreateOrConnectWithoutRepliesInput
    upsert?: TaskNotificationUpsertWithoutRepliesInput
    connect?: TaskNotificationWhereUniqueInput
    update?: XOR<XOR<TaskNotificationUpdateToOneWithWhereWithoutRepliesInput, TaskNotificationUpdateWithoutRepliesInput>, TaskNotificationUncheckedUpdateWithoutRepliesInput>
  }

  export type UserUpdateOneRequiredWithoutTaskRepliesNestedInput = {
    create?: XOR<UserCreateWithoutTaskRepliesInput, UserUncheckedCreateWithoutTaskRepliesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTaskRepliesInput
    upsert?: UserUpsertWithoutTaskRepliesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTaskRepliesInput, UserUpdateWithoutTaskRepliesInput>, UserUncheckedUpdateWithoutTaskRepliesInput>
  }

  export type TaskReplyDocumentUpdateManyWithoutReplyNestedInput = {
    create?: XOR<TaskReplyDocumentCreateWithoutReplyInput, TaskReplyDocumentUncheckedCreateWithoutReplyInput> | TaskReplyDocumentCreateWithoutReplyInput[] | TaskReplyDocumentUncheckedCreateWithoutReplyInput[]
    connectOrCreate?: TaskReplyDocumentCreateOrConnectWithoutReplyInput | TaskReplyDocumentCreateOrConnectWithoutReplyInput[]
    upsert?: TaskReplyDocumentUpsertWithWhereUniqueWithoutReplyInput | TaskReplyDocumentUpsertWithWhereUniqueWithoutReplyInput[]
    createMany?: TaskReplyDocumentCreateManyReplyInputEnvelope
    set?: TaskReplyDocumentWhereUniqueInput | TaskReplyDocumentWhereUniqueInput[]
    disconnect?: TaskReplyDocumentWhereUniqueInput | TaskReplyDocumentWhereUniqueInput[]
    delete?: TaskReplyDocumentWhereUniqueInput | TaskReplyDocumentWhereUniqueInput[]
    connect?: TaskReplyDocumentWhereUniqueInput | TaskReplyDocumentWhereUniqueInput[]
    update?: TaskReplyDocumentUpdateWithWhereUniqueWithoutReplyInput | TaskReplyDocumentUpdateWithWhereUniqueWithoutReplyInput[]
    updateMany?: TaskReplyDocumentUpdateManyWithWhereWithoutReplyInput | TaskReplyDocumentUpdateManyWithWhereWithoutReplyInput[]
    deleteMany?: TaskReplyDocumentScalarWhereInput | TaskReplyDocumentScalarWhereInput[]
  }

  export type TaskReplyDocumentUncheckedUpdateManyWithoutReplyNestedInput = {
    create?: XOR<TaskReplyDocumentCreateWithoutReplyInput, TaskReplyDocumentUncheckedCreateWithoutReplyInput> | TaskReplyDocumentCreateWithoutReplyInput[] | TaskReplyDocumentUncheckedCreateWithoutReplyInput[]
    connectOrCreate?: TaskReplyDocumentCreateOrConnectWithoutReplyInput | TaskReplyDocumentCreateOrConnectWithoutReplyInput[]
    upsert?: TaskReplyDocumentUpsertWithWhereUniqueWithoutReplyInput | TaskReplyDocumentUpsertWithWhereUniqueWithoutReplyInput[]
    createMany?: TaskReplyDocumentCreateManyReplyInputEnvelope
    set?: TaskReplyDocumentWhereUniqueInput | TaskReplyDocumentWhereUniqueInput[]
    disconnect?: TaskReplyDocumentWhereUniqueInput | TaskReplyDocumentWhereUniqueInput[]
    delete?: TaskReplyDocumentWhereUniqueInput | TaskReplyDocumentWhereUniqueInput[]
    connect?: TaskReplyDocumentWhereUniqueInput | TaskReplyDocumentWhereUniqueInput[]
    update?: TaskReplyDocumentUpdateWithWhereUniqueWithoutReplyInput | TaskReplyDocumentUpdateWithWhereUniqueWithoutReplyInput[]
    updateMany?: TaskReplyDocumentUpdateManyWithWhereWithoutReplyInput | TaskReplyDocumentUpdateManyWithWhereWithoutReplyInput[]
    deleteMany?: TaskReplyDocumentScalarWhereInput | TaskReplyDocumentScalarWhereInput[]
  }

  export type TaskReplyCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<TaskReplyCreateWithoutDocumentsInput, TaskReplyUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: TaskReplyCreateOrConnectWithoutDocumentsInput
    connect?: TaskReplyWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TaskReplyUpdateOneRequiredWithoutDocumentsNestedInput = {
    create?: XOR<TaskReplyCreateWithoutDocumentsInput, TaskReplyUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: TaskReplyCreateOrConnectWithoutDocumentsInput
    upsert?: TaskReplyUpsertWithoutDocumentsInput
    connect?: TaskReplyWhereUniqueInput
    update?: XOR<XOR<TaskReplyUpdateToOneWithWhereWithoutDocumentsInput, TaskReplyUpdateWithoutDocumentsInput>, TaskReplyUncheckedUpdateWithoutDocumentsInput>
  }

  export type UserCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<UserCreateWithoutDocumentsInput, UserUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDocumentsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumDocumentTypeFieldUpdateOperationsInput = {
    set?: $Enums.DocumentType
  }

  export type EnumDocumentStatusFieldUpdateOperationsInput = {
    set?: $Enums.DocumentStatus
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutDocumentsNestedInput = {
    create?: XOR<UserCreateWithoutDocumentsInput, UserUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDocumentsInput
    upsert?: UserUpsertWithoutDocumentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDocumentsInput, UserUpdateWithoutDocumentsInput>, UserUncheckedUpdateWithoutDocumentsInput>
  }

  export type ProjectCreateNestedOneWithoutFilesInput = {
    create?: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutFilesInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutProjectFilesInput = {
    create?: XOR<UserCreateWithoutProjectFilesInput, UserUncheckedCreateWithoutProjectFilesInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectFilesInput
    connect?: UserWhereUniqueInput
  }

  export type EnumProjectFileTypeFieldUpdateOperationsInput = {
    set?: $Enums.ProjectFileType
  }

  export type ProjectUpdateOneRequiredWithoutFilesNestedInput = {
    create?: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutFilesInput
    upsert?: ProjectUpsertWithoutFilesInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutFilesInput, ProjectUpdateWithoutFilesInput>, ProjectUncheckedUpdateWithoutFilesInput>
  }

  export type UserUpdateOneRequiredWithoutProjectFilesNestedInput = {
    create?: XOR<UserCreateWithoutProjectFilesInput, UserUncheckedCreateWithoutProjectFilesInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectFilesInput
    upsert?: UserUpsertWithoutProjectFilesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProjectFilesInput, UserUpdateWithoutProjectFilesInput>, UserUncheckedUpdateWithoutProjectFilesInput>
  }

  export type UserCreateNestedOneWithoutPostsInput = {
    create?: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPostsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPostsNestedInput = {
    create?: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPostsInput
    upsert?: UserUpsertWithoutPostsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPostsInput, UserUpdateWithoutPostsInput>, UserUncheckedUpdateWithoutPostsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedEnumSexNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Sex | EnumSexFieldRefInput<$PrismaModel> | null
    in?: $Enums.Sex[] | ListEnumSexFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Sex[] | ListEnumSexFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSexNullableFilter<$PrismaModel> | $Enums.Sex | null
  }

  export type NestedEnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedEnumSexNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Sex | EnumSexFieldRefInput<$PrismaModel> | null
    in?: $Enums.Sex[] | ListEnumSexFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Sex[] | ListEnumSexFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSexNullableWithAggregatesFilter<$PrismaModel> | $Enums.Sex | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumSexNullableFilter<$PrismaModel>
    _max?: NestedEnumSexNullableFilter<$PrismaModel>
  }

  export type NestedEnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumProjectSubTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectSubType | EnumProjectSubTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.ProjectSubType[] | ListEnumProjectSubTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ProjectSubType[] | ListEnumProjectSubTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumProjectSubTypeNullableFilter<$PrismaModel> | $Enums.ProjectSubType | null
  }

  export type NestedEnumModeOfImplementationFilter<$PrismaModel = never> = {
    equals?: $Enums.ModeOfImplementation | EnumModeOfImplementationFieldRefInput<$PrismaModel>
    in?: $Enums.ModeOfImplementation[] | ListEnumModeOfImplementationFieldRefInput<$PrismaModel>
    notIn?: $Enums.ModeOfImplementation[] | ListEnumModeOfImplementationFieldRefInput<$PrismaModel>
    not?: NestedEnumModeOfImplementationFilter<$PrismaModel> | $Enums.ModeOfImplementation
  }

  export type NestedEnumDistrictFilter<$PrismaModel = never> = {
    equals?: $Enums.District | EnumDistrictFieldRefInput<$PrismaModel>
    in?: $Enums.District[] | ListEnumDistrictFieldRefInput<$PrismaModel>
    notIn?: $Enums.District[] | ListEnumDistrictFieldRefInput<$PrismaModel>
    not?: NestedEnumDistrictFilter<$PrismaModel> | $Enums.District
  }

  export type NestedEnumSourceOfFundFilter<$PrismaModel = never> = {
    equals?: $Enums.SourceOfFund | EnumSourceOfFundFieldRefInput<$PrismaModel>
    in?: $Enums.SourceOfFund[] | ListEnumSourceOfFundFieldRefInput<$PrismaModel>
    notIn?: $Enums.SourceOfFund[] | ListEnumSourceOfFundFieldRefInput<$PrismaModel>
    not?: NestedEnumSourceOfFundFilter<$PrismaModel> | $Enums.SourceOfFund
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumDistrictNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.District | EnumDistrictFieldRefInput<$PrismaModel> | null
    in?: $Enums.District[] | ListEnumDistrictFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.District[] | ListEnumDistrictFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDistrictNullableFilter<$PrismaModel> | $Enums.District | null
  }

  export type NestedEnumProjectStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusFilter<$PrismaModel> | $Enums.ProjectStatus
  }

  export type NestedEnumProjectSubTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectSubType | EnumProjectSubTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.ProjectSubType[] | ListEnumProjectSubTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ProjectSubType[] | ListEnumProjectSubTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumProjectSubTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.ProjectSubType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumProjectSubTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumProjectSubTypeNullableFilter<$PrismaModel>
  }

  export type NestedEnumModeOfImplementationWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ModeOfImplementation | EnumModeOfImplementationFieldRefInput<$PrismaModel>
    in?: $Enums.ModeOfImplementation[] | ListEnumModeOfImplementationFieldRefInput<$PrismaModel>
    notIn?: $Enums.ModeOfImplementation[] | ListEnumModeOfImplementationFieldRefInput<$PrismaModel>
    not?: NestedEnumModeOfImplementationWithAggregatesFilter<$PrismaModel> | $Enums.ModeOfImplementation
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumModeOfImplementationFilter<$PrismaModel>
    _max?: NestedEnumModeOfImplementationFilter<$PrismaModel>
  }

  export type NestedEnumDistrictWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.District | EnumDistrictFieldRefInput<$PrismaModel>
    in?: $Enums.District[] | ListEnumDistrictFieldRefInput<$PrismaModel>
    notIn?: $Enums.District[] | ListEnumDistrictFieldRefInput<$PrismaModel>
    not?: NestedEnumDistrictWithAggregatesFilter<$PrismaModel> | $Enums.District
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDistrictFilter<$PrismaModel>
    _max?: NestedEnumDistrictFilter<$PrismaModel>
  }

  export type NestedEnumSourceOfFundWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SourceOfFund | EnumSourceOfFundFieldRefInput<$PrismaModel>
    in?: $Enums.SourceOfFund[] | ListEnumSourceOfFundFieldRefInput<$PrismaModel>
    notIn?: $Enums.SourceOfFund[] | ListEnumSourceOfFundFieldRefInput<$PrismaModel>
    not?: NestedEnumSourceOfFundWithAggregatesFilter<$PrismaModel> | $Enums.SourceOfFund
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSourceOfFundFilter<$PrismaModel>
    _max?: NestedEnumSourceOfFundFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
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

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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

  export type NestedEnumDistrictNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.District | EnumDistrictFieldRefInput<$PrismaModel> | null
    in?: $Enums.District[] | ListEnumDistrictFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.District[] | ListEnumDistrictFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDistrictNullableWithAggregatesFilter<$PrismaModel> | $Enums.District | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumDistrictNullableFilter<$PrismaModel>
    _max?: NestedEnumDistrictNullableFilter<$PrismaModel>
  }

  export type NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProjectStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectStatusFilter<$PrismaModel>
    _max?: NestedEnumProjectStatusFilter<$PrismaModel>
  }

  export type NestedEnumNotificationPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationPriority | EnumNotificationPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationPriorityFilter<$PrismaModel> | $Enums.NotificationPriority
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumNotificationPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationPriority | EnumNotificationPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationPriority[] | ListEnumNotificationPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationPriorityWithAggregatesFilter<$PrismaModel> | $Enums.NotificationPriority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationPriorityFilter<$PrismaModel>
    _max?: NestedEnumNotificationPriorityFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
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
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumDocumentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeFilter<$PrismaModel> | $Enums.DocumentType
  }

  export type NestedEnumDocumentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusFilter<$PrismaModel> | $Enums.DocumentStatus
  }

  export type NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocumentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentTypeFilter<$PrismaModel>
    _max?: NestedEnumDocumentTypeFilter<$PrismaModel>
  }

  export type NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel> | $Enums.DocumentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentStatusFilter<$PrismaModel>
    _max?: NestedEnumDocumentStatusFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedEnumProjectFileTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectFileType | EnumProjectFileTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectFileType[] | ListEnumProjectFileTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectFileType[] | ListEnumProjectFileTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectFileTypeFilter<$PrismaModel> | $Enums.ProjectFileType
  }

  export type NestedEnumProjectFileTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectFileType | EnumProjectFileTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectFileType[] | ListEnumProjectFileTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectFileType[] | ListEnumProjectFileTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectFileTypeWithAggregatesFilter<$PrismaModel> | $Enums.ProjectFileType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectFileTypeFilter<$PrismaModel>
    _max?: NestedEnumProjectFileTypeFilter<$PrismaModel>
  }

  export type PostCreateWithoutCreatedByInput = {
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostUncheckedCreateWithoutCreatedByInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostCreateOrConnectWithoutCreatedByInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutCreatedByInput, PostUncheckedCreateWithoutCreatedByInput>
  }

  export type PostCreateManyCreatedByInputEnvelope = {
    data: PostCreateManyCreatedByInput | PostCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type ProjectCreateWithoutCreatedByInput = {
    id?: string
    projectCode: string
    title: string
    subType?: $Enums.ProjectSubType | null
    modeOfImplementation: $Enums.ModeOfImplementation
    locationImplementation: $Enums.District
    sourceOfFund: $Enums.SourceOfFund
    projectCost?: number
    contractCost?: number
    contractorName?: string | null
    projectEngineer?: string | null
    budgetYear?: string | null
    dateStarted?: Date | string | null
    targetCompletionDate?: Date | string | null
    duration?: number
    revisedCompletionDate?: Date | string | null
    dateCompleted?: Date | string | null
    daysSuspended?: number
    daysExtended?: number
    numFemale?: number
    numMale?: number
    numPersons?: number
    numManDays?: number
    district?: $Enums.District | null
    cityMunicipality?: string | null
    barangay?: string | null
    purok?: string | null
    sitio?: string | null
    description?: string | null
    status?: $Enums.ProjectStatus
    completionPercentage?: number
    imageUrl?: string | null
    documentUrl?: string | null
    documentName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    activities?: ProjectActivityCreateNestedManyWithoutProjectInput
    disbursements?: DisbursementCreateNestedManyWithoutProjectInput
    taskNotifications?: TaskNotificationCreateNestedManyWithoutProjectInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutCreatedByInput = {
    id?: string
    projectCode: string
    title: string
    subType?: $Enums.ProjectSubType | null
    modeOfImplementation: $Enums.ModeOfImplementation
    locationImplementation: $Enums.District
    sourceOfFund: $Enums.SourceOfFund
    projectCost?: number
    contractCost?: number
    contractorName?: string | null
    projectEngineer?: string | null
    budgetYear?: string | null
    dateStarted?: Date | string | null
    targetCompletionDate?: Date | string | null
    duration?: number
    revisedCompletionDate?: Date | string | null
    dateCompleted?: Date | string | null
    daysSuspended?: number
    daysExtended?: number
    numFemale?: number
    numMale?: number
    numPersons?: number
    numManDays?: number
    district?: $Enums.District | null
    cityMunicipality?: string | null
    barangay?: string | null
    purok?: string | null
    sitio?: string | null
    description?: string | null
    status?: $Enums.ProjectStatus
    completionPercentage?: number
    imageUrl?: string | null
    documentUrl?: string | null
    documentName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    activities?: ProjectActivityUncheckedCreateNestedManyWithoutProjectInput
    disbursements?: DisbursementUncheckedCreateNestedManyWithoutProjectInput
    taskNotifications?: TaskNotificationUncheckedCreateNestedManyWithoutProjectInput
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutCreatedByInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutCreatedByInput, ProjectUncheckedCreateWithoutCreatedByInput>
  }

  export type ProjectCreateManyCreatedByInputEnvelope = {
    data: ProjectCreateManyCreatedByInput | ProjectCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type UserSessionCreateWithoutUserInput = {
    id?: string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    expiresAt: Date | string
    lastActive?: Date | string
  }

  export type UserSessionUncheckedCreateWithoutUserInput = {
    id?: string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    expiresAt: Date | string
    lastActive?: Date | string
  }

  export type UserSessionCreateOrConnectWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    create: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput>
  }

  export type UserSessionCreateManyUserInputEnvelope = {
    data: UserSessionCreateManyUserInput | UserSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DocumentCreateWithoutCreatedByInput = {
    id?: string
    documentCode: string
    type: $Enums.DocumentType
    title: string
    description?: string | null
    status?: $Enums.DocumentStatus
    filePath?: string | null
    fileName?: string | null
    fileSize?: number | null
    amount?: number | null
    purpose?: string | null
    district: $Enums.District
    projectRef?: string | null
    releasedAt?: Date | string | null
    releasedTo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUncheckedCreateWithoutCreatedByInput = {
    id?: string
    documentCode: string
    type: $Enums.DocumentType
    title: string
    description?: string | null
    status?: $Enums.DocumentStatus
    filePath?: string | null
    fileName?: string | null
    fileSize?: number | null
    amount?: number | null
    purpose?: string | null
    district: $Enums.District
    projectRef?: string | null
    releasedAt?: Date | string | null
    releasedTo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentCreateOrConnectWithoutCreatedByInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutCreatedByInput, DocumentUncheckedCreateWithoutCreatedByInput>
  }

  export type DocumentCreateManyCreatedByInputEnvelope = {
    data: DocumentCreateManyCreatedByInput | DocumentCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type ProjectActivityCreateWithoutCreatedByInput = {
    id?: string
    description: string
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutActivitiesInput
  }

  export type ProjectActivityUncheckedCreateWithoutCreatedByInput = {
    id?: string
    projectId: string
    description: string
    createdAt?: Date | string
  }

  export type ProjectActivityCreateOrConnectWithoutCreatedByInput = {
    where: ProjectActivityWhereUniqueInput
    create: XOR<ProjectActivityCreateWithoutCreatedByInput, ProjectActivityUncheckedCreateWithoutCreatedByInput>
  }

  export type ProjectActivityCreateManyCreatedByInputEnvelope = {
    data: ProjectActivityCreateManyCreatedByInput | ProjectActivityCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type DisbursementCreateWithoutCreatedByInput = {
    id?: string
    date?: Date | string
    referenceNumber?: string | null
    amount: number
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutDisbursementsInput
  }

  export type DisbursementUncheckedCreateWithoutCreatedByInput = {
    id?: string
    projectId: string
    date?: Date | string
    referenceNumber?: string | null
    amount: number
    createdAt?: Date | string
  }

  export type DisbursementCreateOrConnectWithoutCreatedByInput = {
    where: DisbursementWhereUniqueInput
    create: XOR<DisbursementCreateWithoutCreatedByInput, DisbursementUncheckedCreateWithoutCreatedByInput>
  }

  export type DisbursementCreateManyCreatedByInputEnvelope = {
    data: DisbursementCreateManyCreatedByInput | DisbursementCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type TaskNotificationCreateWithoutNotifyUserInput = {
    id?: string
    priority?: $Enums.NotificationPriority
    description: string
    acknowledged?: boolean
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutTaskNotificationsInput
    createdBy: UserCreateNestedOneWithoutTaskNotificationsCreatedInput
    replies?: TaskReplyCreateNestedManyWithoutTaskNotificationInput
  }

  export type TaskNotificationUncheckedCreateWithoutNotifyUserInput = {
    id?: string
    projectId: string
    priority?: $Enums.NotificationPriority
    description: string
    acknowledged?: boolean
    acknowledgedAt?: Date | string | null
    createdById: string
    createdAt?: Date | string
    replies?: TaskReplyUncheckedCreateNestedManyWithoutTaskNotificationInput
  }

  export type TaskNotificationCreateOrConnectWithoutNotifyUserInput = {
    where: TaskNotificationWhereUniqueInput
    create: XOR<TaskNotificationCreateWithoutNotifyUserInput, TaskNotificationUncheckedCreateWithoutNotifyUserInput>
  }

  export type TaskNotificationCreateManyNotifyUserInputEnvelope = {
    data: TaskNotificationCreateManyNotifyUserInput | TaskNotificationCreateManyNotifyUserInput[]
    skipDuplicates?: boolean
  }

  export type TaskNotificationCreateWithoutCreatedByInput = {
    id?: string
    priority?: $Enums.NotificationPriority
    description: string
    acknowledged?: boolean
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutTaskNotificationsInput
    notifyUser: UserCreateNestedOneWithoutTaskNotificationsReceivedInput
    replies?: TaskReplyCreateNestedManyWithoutTaskNotificationInput
  }

  export type TaskNotificationUncheckedCreateWithoutCreatedByInput = {
    id?: string
    projectId: string
    notifyUserId: string
    priority?: $Enums.NotificationPriority
    description: string
    acknowledged?: boolean
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
    replies?: TaskReplyUncheckedCreateNestedManyWithoutTaskNotificationInput
  }

  export type TaskNotificationCreateOrConnectWithoutCreatedByInput = {
    where: TaskNotificationWhereUniqueInput
    create: XOR<TaskNotificationCreateWithoutCreatedByInput, TaskNotificationUncheckedCreateWithoutCreatedByInput>
  }

  export type TaskNotificationCreateManyCreatedByInputEnvelope = {
    data: TaskNotificationCreateManyCreatedByInput | TaskNotificationCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type TaskReplyCreateWithoutCreatedByInput = {
    id?: string
    message: string
    taskStatus?: string | null
    createdAt?: Date | string
    taskNotification: TaskNotificationCreateNestedOneWithoutRepliesInput
    documents?: TaskReplyDocumentCreateNestedManyWithoutReplyInput
  }

  export type TaskReplyUncheckedCreateWithoutCreatedByInput = {
    id?: string
    taskNotificationId: string
    message: string
    taskStatus?: string | null
    createdAt?: Date | string
    documents?: TaskReplyDocumentUncheckedCreateNestedManyWithoutReplyInput
  }

  export type TaskReplyCreateOrConnectWithoutCreatedByInput = {
    where: TaskReplyWhereUniqueInput
    create: XOR<TaskReplyCreateWithoutCreatedByInput, TaskReplyUncheckedCreateWithoutCreatedByInput>
  }

  export type TaskReplyCreateManyCreatedByInputEnvelope = {
    data: TaskReplyCreateManyCreatedByInput | TaskReplyCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type ProjectFileCreateWithoutCreatedByInput = {
    id?: string
    fileName: string
    fileUrl: string
    fileType?: $Enums.ProjectFileType
    fileSize?: number | null
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutFilesInput
  }

  export type ProjectFileUncheckedCreateWithoutCreatedByInput = {
    id?: string
    projectId: string
    fileName: string
    fileUrl: string
    fileType?: $Enums.ProjectFileType
    fileSize?: number | null
    createdAt?: Date | string
  }

  export type ProjectFileCreateOrConnectWithoutCreatedByInput = {
    where: ProjectFileWhereUniqueInput
    create: XOR<ProjectFileCreateWithoutCreatedByInput, ProjectFileUncheckedCreateWithoutCreatedByInput>
  }

  export type ProjectFileCreateManyCreatedByInputEnvelope = {
    data: ProjectFileCreateManyCreatedByInput | ProjectFileCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type PostUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutCreatedByInput, PostUncheckedUpdateWithoutCreatedByInput>
    create: XOR<PostCreateWithoutCreatedByInput, PostUncheckedCreateWithoutCreatedByInput>
  }

  export type PostUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutCreatedByInput, PostUncheckedUpdateWithoutCreatedByInput>
  }

  export type PostUpdateManyWithWhereWithoutCreatedByInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type PostScalarWhereInput = {
    AND?: PostScalarWhereInput | PostScalarWhereInput[]
    OR?: PostScalarWhereInput[]
    NOT?: PostScalarWhereInput | PostScalarWhereInput[]
    id?: IntFilter<"Post"> | number
    name?: StringFilter<"Post"> | string
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
    createdById?: StringFilter<"Post"> | string
  }

  export type ProjectUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutCreatedByInput, ProjectUncheckedUpdateWithoutCreatedByInput>
    create: XOR<ProjectCreateWithoutCreatedByInput, ProjectUncheckedCreateWithoutCreatedByInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutCreatedByInput, ProjectUncheckedUpdateWithoutCreatedByInput>
  }

  export type ProjectUpdateManyWithWhereWithoutCreatedByInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    OR?: ProjectScalarWhereInput[]
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    id?: StringFilter<"Project"> | string
    projectCode?: StringFilter<"Project"> | string
    title?: StringFilter<"Project"> | string
    subType?: EnumProjectSubTypeNullableFilter<"Project"> | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFilter<"Project"> | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFilter<"Project"> | $Enums.District
    sourceOfFund?: EnumSourceOfFundFilter<"Project"> | $Enums.SourceOfFund
    projectCost?: FloatFilter<"Project"> | number
    contractCost?: FloatFilter<"Project"> | number
    contractorName?: StringNullableFilter<"Project"> | string | null
    projectEngineer?: StringNullableFilter<"Project"> | string | null
    budgetYear?: StringNullableFilter<"Project"> | string | null
    dateStarted?: DateTimeNullableFilter<"Project"> | Date | string | null
    targetCompletionDate?: DateTimeNullableFilter<"Project"> | Date | string | null
    duration?: IntFilter<"Project"> | number
    revisedCompletionDate?: DateTimeNullableFilter<"Project"> | Date | string | null
    dateCompleted?: DateTimeNullableFilter<"Project"> | Date | string | null
    daysSuspended?: IntFilter<"Project"> | number
    daysExtended?: IntFilter<"Project"> | number
    numFemale?: IntFilter<"Project"> | number
    numMale?: IntFilter<"Project"> | number
    numPersons?: IntFilter<"Project"> | number
    numManDays?: IntFilter<"Project"> | number
    district?: EnumDistrictNullableFilter<"Project"> | $Enums.District | null
    cityMunicipality?: StringNullableFilter<"Project"> | string | null
    barangay?: StringNullableFilter<"Project"> | string | null
    purok?: StringNullableFilter<"Project"> | string | null
    sitio?: StringNullableFilter<"Project"> | string | null
    description?: StringNullableFilter<"Project"> | string | null
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    completionPercentage?: IntFilter<"Project"> | number
    imageUrl?: StringNullableFilter<"Project"> | string | null
    documentUrl?: StringNullableFilter<"Project"> | string | null
    documentName?: StringNullableFilter<"Project"> | string | null
    createdById?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
  }

  export type UserSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    update: XOR<UserSessionUpdateWithoutUserInput, UserSessionUncheckedUpdateWithoutUserInput>
    create: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput>
  }

  export type UserSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    data: XOR<UserSessionUpdateWithoutUserInput, UserSessionUncheckedUpdateWithoutUserInput>
  }

  export type UserSessionUpdateManyWithWhereWithoutUserInput = {
    where: UserSessionScalarWhereInput
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type UserSessionScalarWhereInput = {
    AND?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
    OR?: UserSessionScalarWhereInput[]
    NOT?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
    id?: StringFilter<"UserSession"> | string
    userId?: StringFilter<"UserSession"> | string
    ipAddress?: StringNullableFilter<"UserSession"> | string | null
    userAgent?: StringNullableFilter<"UserSession"> | string | null
    createdAt?: DateTimeFilter<"UserSession"> | Date | string
    expiresAt?: DateTimeFilter<"UserSession"> | Date | string
    lastActive?: DateTimeFilter<"UserSession"> | Date | string
  }

  export type DocumentUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: DocumentWhereUniqueInput
    update: XOR<DocumentUpdateWithoutCreatedByInput, DocumentUncheckedUpdateWithoutCreatedByInput>
    create: XOR<DocumentCreateWithoutCreatedByInput, DocumentUncheckedCreateWithoutCreatedByInput>
  }

  export type DocumentUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: DocumentWhereUniqueInput
    data: XOR<DocumentUpdateWithoutCreatedByInput, DocumentUncheckedUpdateWithoutCreatedByInput>
  }

  export type DocumentUpdateManyWithWhereWithoutCreatedByInput = {
    where: DocumentScalarWhereInput
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type DocumentScalarWhereInput = {
    AND?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    OR?: DocumentScalarWhereInput[]
    NOT?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    id?: StringFilter<"Document"> | string
    documentCode?: StringFilter<"Document"> | string
    type?: EnumDocumentTypeFilter<"Document"> | $Enums.DocumentType
    title?: StringFilter<"Document"> | string
    description?: StringNullableFilter<"Document"> | string | null
    status?: EnumDocumentStatusFilter<"Document"> | $Enums.DocumentStatus
    filePath?: StringNullableFilter<"Document"> | string | null
    fileName?: StringNullableFilter<"Document"> | string | null
    fileSize?: IntNullableFilter<"Document"> | number | null
    amount?: FloatNullableFilter<"Document"> | number | null
    purpose?: StringNullableFilter<"Document"> | string | null
    district?: EnumDistrictFilter<"Document"> | $Enums.District
    projectRef?: StringNullableFilter<"Document"> | string | null
    releasedAt?: DateTimeNullableFilter<"Document"> | Date | string | null
    releasedTo?: StringNullableFilter<"Document"> | string | null
    createdById?: StringFilter<"Document"> | string
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
  }

  export type ProjectActivityUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: ProjectActivityWhereUniqueInput
    update: XOR<ProjectActivityUpdateWithoutCreatedByInput, ProjectActivityUncheckedUpdateWithoutCreatedByInput>
    create: XOR<ProjectActivityCreateWithoutCreatedByInput, ProjectActivityUncheckedCreateWithoutCreatedByInput>
  }

  export type ProjectActivityUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: ProjectActivityWhereUniqueInput
    data: XOR<ProjectActivityUpdateWithoutCreatedByInput, ProjectActivityUncheckedUpdateWithoutCreatedByInput>
  }

  export type ProjectActivityUpdateManyWithWhereWithoutCreatedByInput = {
    where: ProjectActivityScalarWhereInput
    data: XOR<ProjectActivityUpdateManyMutationInput, ProjectActivityUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type ProjectActivityScalarWhereInput = {
    AND?: ProjectActivityScalarWhereInput | ProjectActivityScalarWhereInput[]
    OR?: ProjectActivityScalarWhereInput[]
    NOT?: ProjectActivityScalarWhereInput | ProjectActivityScalarWhereInput[]
    id?: StringFilter<"ProjectActivity"> | string
    projectId?: StringFilter<"ProjectActivity"> | string
    description?: StringFilter<"ProjectActivity"> | string
    createdById?: StringFilter<"ProjectActivity"> | string
    createdAt?: DateTimeFilter<"ProjectActivity"> | Date | string
  }

  export type DisbursementUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: DisbursementWhereUniqueInput
    update: XOR<DisbursementUpdateWithoutCreatedByInput, DisbursementUncheckedUpdateWithoutCreatedByInput>
    create: XOR<DisbursementCreateWithoutCreatedByInput, DisbursementUncheckedCreateWithoutCreatedByInput>
  }

  export type DisbursementUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: DisbursementWhereUniqueInput
    data: XOR<DisbursementUpdateWithoutCreatedByInput, DisbursementUncheckedUpdateWithoutCreatedByInput>
  }

  export type DisbursementUpdateManyWithWhereWithoutCreatedByInput = {
    where: DisbursementScalarWhereInput
    data: XOR<DisbursementUpdateManyMutationInput, DisbursementUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type DisbursementScalarWhereInput = {
    AND?: DisbursementScalarWhereInput | DisbursementScalarWhereInput[]
    OR?: DisbursementScalarWhereInput[]
    NOT?: DisbursementScalarWhereInput | DisbursementScalarWhereInput[]
    id?: StringFilter<"Disbursement"> | string
    projectId?: StringFilter<"Disbursement"> | string
    date?: DateTimeFilter<"Disbursement"> | Date | string
    referenceNumber?: StringNullableFilter<"Disbursement"> | string | null
    amount?: FloatFilter<"Disbursement"> | number
    createdById?: StringFilter<"Disbursement"> | string
    createdAt?: DateTimeFilter<"Disbursement"> | Date | string
  }

  export type TaskNotificationUpsertWithWhereUniqueWithoutNotifyUserInput = {
    where: TaskNotificationWhereUniqueInput
    update: XOR<TaskNotificationUpdateWithoutNotifyUserInput, TaskNotificationUncheckedUpdateWithoutNotifyUserInput>
    create: XOR<TaskNotificationCreateWithoutNotifyUserInput, TaskNotificationUncheckedCreateWithoutNotifyUserInput>
  }

  export type TaskNotificationUpdateWithWhereUniqueWithoutNotifyUserInput = {
    where: TaskNotificationWhereUniqueInput
    data: XOR<TaskNotificationUpdateWithoutNotifyUserInput, TaskNotificationUncheckedUpdateWithoutNotifyUserInput>
  }

  export type TaskNotificationUpdateManyWithWhereWithoutNotifyUserInput = {
    where: TaskNotificationScalarWhereInput
    data: XOR<TaskNotificationUpdateManyMutationInput, TaskNotificationUncheckedUpdateManyWithoutNotifyUserInput>
  }

  export type TaskNotificationScalarWhereInput = {
    AND?: TaskNotificationScalarWhereInput | TaskNotificationScalarWhereInput[]
    OR?: TaskNotificationScalarWhereInput[]
    NOT?: TaskNotificationScalarWhereInput | TaskNotificationScalarWhereInput[]
    id?: StringFilter<"TaskNotification"> | string
    projectId?: StringFilter<"TaskNotification"> | string
    notifyUserId?: StringFilter<"TaskNotification"> | string
    priority?: EnumNotificationPriorityFilter<"TaskNotification"> | $Enums.NotificationPriority
    description?: StringFilter<"TaskNotification"> | string
    acknowledged?: BoolFilter<"TaskNotification"> | boolean
    acknowledgedAt?: DateTimeNullableFilter<"TaskNotification"> | Date | string | null
    createdById?: StringFilter<"TaskNotification"> | string
    createdAt?: DateTimeFilter<"TaskNotification"> | Date | string
  }

  export type TaskNotificationUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: TaskNotificationWhereUniqueInput
    update: XOR<TaskNotificationUpdateWithoutCreatedByInput, TaskNotificationUncheckedUpdateWithoutCreatedByInput>
    create: XOR<TaskNotificationCreateWithoutCreatedByInput, TaskNotificationUncheckedCreateWithoutCreatedByInput>
  }

  export type TaskNotificationUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: TaskNotificationWhereUniqueInput
    data: XOR<TaskNotificationUpdateWithoutCreatedByInput, TaskNotificationUncheckedUpdateWithoutCreatedByInput>
  }

  export type TaskNotificationUpdateManyWithWhereWithoutCreatedByInput = {
    where: TaskNotificationScalarWhereInput
    data: XOR<TaskNotificationUpdateManyMutationInput, TaskNotificationUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type TaskReplyUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: TaskReplyWhereUniqueInput
    update: XOR<TaskReplyUpdateWithoutCreatedByInput, TaskReplyUncheckedUpdateWithoutCreatedByInput>
    create: XOR<TaskReplyCreateWithoutCreatedByInput, TaskReplyUncheckedCreateWithoutCreatedByInput>
  }

  export type TaskReplyUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: TaskReplyWhereUniqueInput
    data: XOR<TaskReplyUpdateWithoutCreatedByInput, TaskReplyUncheckedUpdateWithoutCreatedByInput>
  }

  export type TaskReplyUpdateManyWithWhereWithoutCreatedByInput = {
    where: TaskReplyScalarWhereInput
    data: XOR<TaskReplyUpdateManyMutationInput, TaskReplyUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type TaskReplyScalarWhereInput = {
    AND?: TaskReplyScalarWhereInput | TaskReplyScalarWhereInput[]
    OR?: TaskReplyScalarWhereInput[]
    NOT?: TaskReplyScalarWhereInput | TaskReplyScalarWhereInput[]
    id?: StringFilter<"TaskReply"> | string
    taskNotificationId?: StringFilter<"TaskReply"> | string
    message?: StringFilter<"TaskReply"> | string
    taskStatus?: StringNullableFilter<"TaskReply"> | string | null
    createdById?: StringFilter<"TaskReply"> | string
    createdAt?: DateTimeFilter<"TaskReply"> | Date | string
  }

  export type ProjectFileUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: ProjectFileWhereUniqueInput
    update: XOR<ProjectFileUpdateWithoutCreatedByInput, ProjectFileUncheckedUpdateWithoutCreatedByInput>
    create: XOR<ProjectFileCreateWithoutCreatedByInput, ProjectFileUncheckedCreateWithoutCreatedByInput>
  }

  export type ProjectFileUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: ProjectFileWhereUniqueInput
    data: XOR<ProjectFileUpdateWithoutCreatedByInput, ProjectFileUncheckedUpdateWithoutCreatedByInput>
  }

  export type ProjectFileUpdateManyWithWhereWithoutCreatedByInput = {
    where: ProjectFileScalarWhereInput
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type ProjectFileScalarWhereInput = {
    AND?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
    OR?: ProjectFileScalarWhereInput[]
    NOT?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
    id?: StringFilter<"ProjectFile"> | string
    projectId?: StringFilter<"ProjectFile"> | string
    fileName?: StringFilter<"ProjectFile"> | string
    fileUrl?: StringFilter<"ProjectFile"> | string
    fileType?: EnumProjectFileTypeFilter<"ProjectFile"> | $Enums.ProjectFileType
    fileSize?: IntNullableFilter<"ProjectFile"> | number | null
    createdById?: StringFilter<"ProjectFile"> | string
    createdAt?: DateTimeFilter<"ProjectFile"> | Date | string
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostCreateNestedManyWithoutCreatedByInput
    projects?: ProjectCreateNestedManyWithoutCreatedByInput
    documents?: DocumentCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostUncheckedCreateNestedManyWithoutCreatedByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutCreatedByInput
    documents?: DocumentUncheckedCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityUncheckedCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementUncheckedCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationUncheckedCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationUncheckedCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyUncheckedCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUpdateManyWithoutCreatedByNestedInput
    documents?: DocumentUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUncheckedUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutCreatedByNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUncheckedUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUncheckedUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUncheckedUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUncheckedUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUncheckedUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type UserCreateWithoutProjectsInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutProjectsInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostUncheckedCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityUncheckedCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementUncheckedCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationUncheckedCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationUncheckedCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyUncheckedCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutProjectsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
  }

  export type ProjectActivityCreateWithoutProjectInput = {
    id?: string
    description: string
    createdAt?: Date | string
    createdBy: UserCreateNestedOneWithoutProjectActivitiesInput
  }

  export type ProjectActivityUncheckedCreateWithoutProjectInput = {
    id?: string
    description: string
    createdById: string
    createdAt?: Date | string
  }

  export type ProjectActivityCreateOrConnectWithoutProjectInput = {
    where: ProjectActivityWhereUniqueInput
    create: XOR<ProjectActivityCreateWithoutProjectInput, ProjectActivityUncheckedCreateWithoutProjectInput>
  }

  export type ProjectActivityCreateManyProjectInputEnvelope = {
    data: ProjectActivityCreateManyProjectInput | ProjectActivityCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type DisbursementCreateWithoutProjectInput = {
    id?: string
    date?: Date | string
    referenceNumber?: string | null
    amount: number
    createdAt?: Date | string
    createdBy: UserCreateNestedOneWithoutDisbursementsInput
  }

  export type DisbursementUncheckedCreateWithoutProjectInput = {
    id?: string
    date?: Date | string
    referenceNumber?: string | null
    amount: number
    createdById: string
    createdAt?: Date | string
  }

  export type DisbursementCreateOrConnectWithoutProjectInput = {
    where: DisbursementWhereUniqueInput
    create: XOR<DisbursementCreateWithoutProjectInput, DisbursementUncheckedCreateWithoutProjectInput>
  }

  export type DisbursementCreateManyProjectInputEnvelope = {
    data: DisbursementCreateManyProjectInput | DisbursementCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type TaskNotificationCreateWithoutProjectInput = {
    id?: string
    priority?: $Enums.NotificationPriority
    description: string
    acknowledged?: boolean
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
    notifyUser: UserCreateNestedOneWithoutTaskNotificationsReceivedInput
    createdBy: UserCreateNestedOneWithoutTaskNotificationsCreatedInput
    replies?: TaskReplyCreateNestedManyWithoutTaskNotificationInput
  }

  export type TaskNotificationUncheckedCreateWithoutProjectInput = {
    id?: string
    notifyUserId: string
    priority?: $Enums.NotificationPriority
    description: string
    acknowledged?: boolean
    acknowledgedAt?: Date | string | null
    createdById: string
    createdAt?: Date | string
    replies?: TaskReplyUncheckedCreateNestedManyWithoutTaskNotificationInput
  }

  export type TaskNotificationCreateOrConnectWithoutProjectInput = {
    where: TaskNotificationWhereUniqueInput
    create: XOR<TaskNotificationCreateWithoutProjectInput, TaskNotificationUncheckedCreateWithoutProjectInput>
  }

  export type TaskNotificationCreateManyProjectInputEnvelope = {
    data: TaskNotificationCreateManyProjectInput | TaskNotificationCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type ProjectFileCreateWithoutProjectInput = {
    id?: string
    fileName: string
    fileUrl: string
    fileType?: $Enums.ProjectFileType
    fileSize?: number | null
    createdAt?: Date | string
    createdBy: UserCreateNestedOneWithoutProjectFilesInput
  }

  export type ProjectFileUncheckedCreateWithoutProjectInput = {
    id?: string
    fileName: string
    fileUrl: string
    fileType?: $Enums.ProjectFileType
    fileSize?: number | null
    createdById: string
    createdAt?: Date | string
  }

  export type ProjectFileCreateOrConnectWithoutProjectInput = {
    where: ProjectFileWhereUniqueInput
    create: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput>
  }

  export type ProjectFileCreateManyProjectInputEnvelope = {
    data: ProjectFileCreateManyProjectInput | ProjectFileCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutProjectsInput = {
    update: XOR<UserUpdateWithoutProjectsInput, UserUncheckedUpdateWithoutProjectsInput>
    create: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProjectsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProjectsInput, UserUncheckedUpdateWithoutProjectsInput>
  }

  export type UserUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUncheckedUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUncheckedUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUncheckedUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUncheckedUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUncheckedUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUncheckedUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type ProjectActivityUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectActivityWhereUniqueInput
    update: XOR<ProjectActivityUpdateWithoutProjectInput, ProjectActivityUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectActivityCreateWithoutProjectInput, ProjectActivityUncheckedCreateWithoutProjectInput>
  }

  export type ProjectActivityUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectActivityWhereUniqueInput
    data: XOR<ProjectActivityUpdateWithoutProjectInput, ProjectActivityUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectActivityUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectActivityScalarWhereInput
    data: XOR<ProjectActivityUpdateManyMutationInput, ProjectActivityUncheckedUpdateManyWithoutProjectInput>
  }

  export type DisbursementUpsertWithWhereUniqueWithoutProjectInput = {
    where: DisbursementWhereUniqueInput
    update: XOR<DisbursementUpdateWithoutProjectInput, DisbursementUncheckedUpdateWithoutProjectInput>
    create: XOR<DisbursementCreateWithoutProjectInput, DisbursementUncheckedCreateWithoutProjectInput>
  }

  export type DisbursementUpdateWithWhereUniqueWithoutProjectInput = {
    where: DisbursementWhereUniqueInput
    data: XOR<DisbursementUpdateWithoutProjectInput, DisbursementUncheckedUpdateWithoutProjectInput>
  }

  export type DisbursementUpdateManyWithWhereWithoutProjectInput = {
    where: DisbursementScalarWhereInput
    data: XOR<DisbursementUpdateManyMutationInput, DisbursementUncheckedUpdateManyWithoutProjectInput>
  }

  export type TaskNotificationUpsertWithWhereUniqueWithoutProjectInput = {
    where: TaskNotificationWhereUniqueInput
    update: XOR<TaskNotificationUpdateWithoutProjectInput, TaskNotificationUncheckedUpdateWithoutProjectInput>
    create: XOR<TaskNotificationCreateWithoutProjectInput, TaskNotificationUncheckedCreateWithoutProjectInput>
  }

  export type TaskNotificationUpdateWithWhereUniqueWithoutProjectInput = {
    where: TaskNotificationWhereUniqueInput
    data: XOR<TaskNotificationUpdateWithoutProjectInput, TaskNotificationUncheckedUpdateWithoutProjectInput>
  }

  export type TaskNotificationUpdateManyWithWhereWithoutProjectInput = {
    where: TaskNotificationScalarWhereInput
    data: XOR<TaskNotificationUpdateManyMutationInput, TaskNotificationUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectFileUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectFileWhereUniqueInput
    update: XOR<ProjectFileUpdateWithoutProjectInput, ProjectFileUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput>
  }

  export type ProjectFileUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectFileWhereUniqueInput
    data: XOR<ProjectFileUpdateWithoutProjectInput, ProjectFileUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectFileUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectFileScalarWhereInput
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectCreateWithoutActivitiesInput = {
    id?: string
    projectCode: string
    title: string
    subType?: $Enums.ProjectSubType | null
    modeOfImplementation: $Enums.ModeOfImplementation
    locationImplementation: $Enums.District
    sourceOfFund: $Enums.SourceOfFund
    projectCost?: number
    contractCost?: number
    contractorName?: string | null
    projectEngineer?: string | null
    budgetYear?: string | null
    dateStarted?: Date | string | null
    targetCompletionDate?: Date | string | null
    duration?: number
    revisedCompletionDate?: Date | string | null
    dateCompleted?: Date | string | null
    daysSuspended?: number
    daysExtended?: number
    numFemale?: number
    numMale?: number
    numPersons?: number
    numManDays?: number
    district?: $Enums.District | null
    cityMunicipality?: string | null
    barangay?: string | null
    purok?: string | null
    sitio?: string | null
    description?: string | null
    status?: $Enums.ProjectStatus
    completionPercentage?: number
    imageUrl?: string | null
    documentUrl?: string | null
    documentName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutProjectsInput
    disbursements?: DisbursementCreateNestedManyWithoutProjectInput
    taskNotifications?: TaskNotificationCreateNestedManyWithoutProjectInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutActivitiesInput = {
    id?: string
    projectCode: string
    title: string
    subType?: $Enums.ProjectSubType | null
    modeOfImplementation: $Enums.ModeOfImplementation
    locationImplementation: $Enums.District
    sourceOfFund: $Enums.SourceOfFund
    projectCost?: number
    contractCost?: number
    contractorName?: string | null
    projectEngineer?: string | null
    budgetYear?: string | null
    dateStarted?: Date | string | null
    targetCompletionDate?: Date | string | null
    duration?: number
    revisedCompletionDate?: Date | string | null
    dateCompleted?: Date | string | null
    daysSuspended?: number
    daysExtended?: number
    numFemale?: number
    numMale?: number
    numPersons?: number
    numManDays?: number
    district?: $Enums.District | null
    cityMunicipality?: string | null
    barangay?: string | null
    purok?: string | null
    sitio?: string | null
    description?: string | null
    status?: $Enums.ProjectStatus
    completionPercentage?: number
    imageUrl?: string | null
    documentUrl?: string | null
    documentName?: string | null
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    disbursements?: DisbursementUncheckedCreateNestedManyWithoutProjectInput
    taskNotifications?: TaskNotificationUncheckedCreateNestedManyWithoutProjectInput
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutActivitiesInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutActivitiesInput, ProjectUncheckedCreateWithoutActivitiesInput>
  }

  export type UserCreateWithoutProjectActivitiesInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostCreateNestedManyWithoutCreatedByInput
    projects?: ProjectCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutProjectActivitiesInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostUncheckedCreateNestedManyWithoutCreatedByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementUncheckedCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationUncheckedCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationUncheckedCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyUncheckedCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutProjectActivitiesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProjectActivitiesInput, UserUncheckedCreateWithoutProjectActivitiesInput>
  }

  export type ProjectUpsertWithoutActivitiesInput = {
    update: XOR<ProjectUpdateWithoutActivitiesInput, ProjectUncheckedUpdateWithoutActivitiesInput>
    create: XOR<ProjectCreateWithoutActivitiesInput, ProjectUncheckedCreateWithoutActivitiesInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutActivitiesInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutActivitiesInput, ProjectUncheckedUpdateWithoutActivitiesInput>
  }

  export type ProjectUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subType?: NullableEnumProjectSubTypeFieldUpdateOperationsInput | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFieldUpdateOperationsInput | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    sourceOfFund?: EnumSourceOfFundFieldUpdateOperationsInput | $Enums.SourceOfFund
    projectCost?: FloatFieldUpdateOperationsInput | number
    contractCost?: FloatFieldUpdateOperationsInput | number
    contractorName?: NullableStringFieldUpdateOperationsInput | string | null
    projectEngineer?: NullableStringFieldUpdateOperationsInput | string | null
    budgetYear?: NullableStringFieldUpdateOperationsInput | string | null
    dateStarted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    targetCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    revisedCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateCompleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    daysSuspended?: IntFieldUpdateOperationsInput | number
    daysExtended?: IntFieldUpdateOperationsInput | number
    numFemale?: IntFieldUpdateOperationsInput | number
    numMale?: IntFieldUpdateOperationsInput | number
    numPersons?: IntFieldUpdateOperationsInput | number
    numManDays?: IntFieldUpdateOperationsInput | number
    district?: NullableEnumDistrictFieldUpdateOperationsInput | $Enums.District | null
    cityMunicipality?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    purok?: NullableStringFieldUpdateOperationsInput | string | null
    sitio?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    completionPercentage?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutProjectsNestedInput
    disbursements?: DisbursementUpdateManyWithoutProjectNestedInput
    taskNotifications?: TaskNotificationUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subType?: NullableEnumProjectSubTypeFieldUpdateOperationsInput | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFieldUpdateOperationsInput | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    sourceOfFund?: EnumSourceOfFundFieldUpdateOperationsInput | $Enums.SourceOfFund
    projectCost?: FloatFieldUpdateOperationsInput | number
    contractCost?: FloatFieldUpdateOperationsInput | number
    contractorName?: NullableStringFieldUpdateOperationsInput | string | null
    projectEngineer?: NullableStringFieldUpdateOperationsInput | string | null
    budgetYear?: NullableStringFieldUpdateOperationsInput | string | null
    dateStarted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    targetCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    revisedCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateCompleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    daysSuspended?: IntFieldUpdateOperationsInput | number
    daysExtended?: IntFieldUpdateOperationsInput | number
    numFemale?: IntFieldUpdateOperationsInput | number
    numMale?: IntFieldUpdateOperationsInput | number
    numPersons?: IntFieldUpdateOperationsInput | number
    numManDays?: IntFieldUpdateOperationsInput | number
    district?: NullableEnumDistrictFieldUpdateOperationsInput | $Enums.District | null
    cityMunicipality?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    purok?: NullableStringFieldUpdateOperationsInput | string | null
    sitio?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    completionPercentage?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentName?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disbursements?: DisbursementUncheckedUpdateManyWithoutProjectNestedInput
    taskNotifications?: TaskNotificationUncheckedUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserUpsertWithoutProjectActivitiesInput = {
    update: XOR<UserUpdateWithoutProjectActivitiesInput, UserUncheckedUpdateWithoutProjectActivitiesInput>
    create: XOR<UserCreateWithoutProjectActivitiesInput, UserUncheckedCreateWithoutProjectActivitiesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProjectActivitiesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProjectActivitiesInput, UserUncheckedUpdateWithoutProjectActivitiesInput>
  }

  export type UserUpdateWithoutProjectActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutProjectActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUncheckedUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUncheckedUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUncheckedUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUncheckedUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUncheckedUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type ProjectCreateWithoutDisbursementsInput = {
    id?: string
    projectCode: string
    title: string
    subType?: $Enums.ProjectSubType | null
    modeOfImplementation: $Enums.ModeOfImplementation
    locationImplementation: $Enums.District
    sourceOfFund: $Enums.SourceOfFund
    projectCost?: number
    contractCost?: number
    contractorName?: string | null
    projectEngineer?: string | null
    budgetYear?: string | null
    dateStarted?: Date | string | null
    targetCompletionDate?: Date | string | null
    duration?: number
    revisedCompletionDate?: Date | string | null
    dateCompleted?: Date | string | null
    daysSuspended?: number
    daysExtended?: number
    numFemale?: number
    numMale?: number
    numPersons?: number
    numManDays?: number
    district?: $Enums.District | null
    cityMunicipality?: string | null
    barangay?: string | null
    purok?: string | null
    sitio?: string | null
    description?: string | null
    status?: $Enums.ProjectStatus
    completionPercentage?: number
    imageUrl?: string | null
    documentUrl?: string | null
    documentName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutProjectsInput
    activities?: ProjectActivityCreateNestedManyWithoutProjectInput
    taskNotifications?: TaskNotificationCreateNestedManyWithoutProjectInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutDisbursementsInput = {
    id?: string
    projectCode: string
    title: string
    subType?: $Enums.ProjectSubType | null
    modeOfImplementation: $Enums.ModeOfImplementation
    locationImplementation: $Enums.District
    sourceOfFund: $Enums.SourceOfFund
    projectCost?: number
    contractCost?: number
    contractorName?: string | null
    projectEngineer?: string | null
    budgetYear?: string | null
    dateStarted?: Date | string | null
    targetCompletionDate?: Date | string | null
    duration?: number
    revisedCompletionDate?: Date | string | null
    dateCompleted?: Date | string | null
    daysSuspended?: number
    daysExtended?: number
    numFemale?: number
    numMale?: number
    numPersons?: number
    numManDays?: number
    district?: $Enums.District | null
    cityMunicipality?: string | null
    barangay?: string | null
    purok?: string | null
    sitio?: string | null
    description?: string | null
    status?: $Enums.ProjectStatus
    completionPercentage?: number
    imageUrl?: string | null
    documentUrl?: string | null
    documentName?: string | null
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    activities?: ProjectActivityUncheckedCreateNestedManyWithoutProjectInput
    taskNotifications?: TaskNotificationUncheckedCreateNestedManyWithoutProjectInput
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutDisbursementsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutDisbursementsInput, ProjectUncheckedCreateWithoutDisbursementsInput>
  }

  export type UserCreateWithoutDisbursementsInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostCreateNestedManyWithoutCreatedByInput
    projects?: ProjectCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutDisbursementsInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostUncheckedCreateNestedManyWithoutCreatedByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityUncheckedCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationUncheckedCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationUncheckedCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyUncheckedCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutDisbursementsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDisbursementsInput, UserUncheckedCreateWithoutDisbursementsInput>
  }

  export type ProjectUpsertWithoutDisbursementsInput = {
    update: XOR<ProjectUpdateWithoutDisbursementsInput, ProjectUncheckedUpdateWithoutDisbursementsInput>
    create: XOR<ProjectCreateWithoutDisbursementsInput, ProjectUncheckedCreateWithoutDisbursementsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutDisbursementsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutDisbursementsInput, ProjectUncheckedUpdateWithoutDisbursementsInput>
  }

  export type ProjectUpdateWithoutDisbursementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subType?: NullableEnumProjectSubTypeFieldUpdateOperationsInput | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFieldUpdateOperationsInput | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    sourceOfFund?: EnumSourceOfFundFieldUpdateOperationsInput | $Enums.SourceOfFund
    projectCost?: FloatFieldUpdateOperationsInput | number
    contractCost?: FloatFieldUpdateOperationsInput | number
    contractorName?: NullableStringFieldUpdateOperationsInput | string | null
    projectEngineer?: NullableStringFieldUpdateOperationsInput | string | null
    budgetYear?: NullableStringFieldUpdateOperationsInput | string | null
    dateStarted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    targetCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    revisedCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateCompleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    daysSuspended?: IntFieldUpdateOperationsInput | number
    daysExtended?: IntFieldUpdateOperationsInput | number
    numFemale?: IntFieldUpdateOperationsInput | number
    numMale?: IntFieldUpdateOperationsInput | number
    numPersons?: IntFieldUpdateOperationsInput | number
    numManDays?: IntFieldUpdateOperationsInput | number
    district?: NullableEnumDistrictFieldUpdateOperationsInput | $Enums.District | null
    cityMunicipality?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    purok?: NullableStringFieldUpdateOperationsInput | string | null
    sitio?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    completionPercentage?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutProjectsNestedInput
    activities?: ProjectActivityUpdateManyWithoutProjectNestedInput
    taskNotifications?: TaskNotificationUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutDisbursementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subType?: NullableEnumProjectSubTypeFieldUpdateOperationsInput | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFieldUpdateOperationsInput | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    sourceOfFund?: EnumSourceOfFundFieldUpdateOperationsInput | $Enums.SourceOfFund
    projectCost?: FloatFieldUpdateOperationsInput | number
    contractCost?: FloatFieldUpdateOperationsInput | number
    contractorName?: NullableStringFieldUpdateOperationsInput | string | null
    projectEngineer?: NullableStringFieldUpdateOperationsInput | string | null
    budgetYear?: NullableStringFieldUpdateOperationsInput | string | null
    dateStarted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    targetCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    revisedCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateCompleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    daysSuspended?: IntFieldUpdateOperationsInput | number
    daysExtended?: IntFieldUpdateOperationsInput | number
    numFemale?: IntFieldUpdateOperationsInput | number
    numMale?: IntFieldUpdateOperationsInput | number
    numPersons?: IntFieldUpdateOperationsInput | number
    numManDays?: IntFieldUpdateOperationsInput | number
    district?: NullableEnumDistrictFieldUpdateOperationsInput | $Enums.District | null
    cityMunicipality?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    purok?: NullableStringFieldUpdateOperationsInput | string | null
    sitio?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    completionPercentage?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentName?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activities?: ProjectActivityUncheckedUpdateManyWithoutProjectNestedInput
    taskNotifications?: TaskNotificationUncheckedUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserUpsertWithoutDisbursementsInput = {
    update: XOR<UserUpdateWithoutDisbursementsInput, UserUncheckedUpdateWithoutDisbursementsInput>
    create: XOR<UserCreateWithoutDisbursementsInput, UserUncheckedCreateWithoutDisbursementsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDisbursementsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDisbursementsInput, UserUncheckedUpdateWithoutDisbursementsInput>
  }

  export type UserUpdateWithoutDisbursementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutDisbursementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUncheckedUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUncheckedUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUncheckedUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUncheckedUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUncheckedUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type ProjectCreateWithoutTaskNotificationsInput = {
    id?: string
    projectCode: string
    title: string
    subType?: $Enums.ProjectSubType | null
    modeOfImplementation: $Enums.ModeOfImplementation
    locationImplementation: $Enums.District
    sourceOfFund: $Enums.SourceOfFund
    projectCost?: number
    contractCost?: number
    contractorName?: string | null
    projectEngineer?: string | null
    budgetYear?: string | null
    dateStarted?: Date | string | null
    targetCompletionDate?: Date | string | null
    duration?: number
    revisedCompletionDate?: Date | string | null
    dateCompleted?: Date | string | null
    daysSuspended?: number
    daysExtended?: number
    numFemale?: number
    numMale?: number
    numPersons?: number
    numManDays?: number
    district?: $Enums.District | null
    cityMunicipality?: string | null
    barangay?: string | null
    purok?: string | null
    sitio?: string | null
    description?: string | null
    status?: $Enums.ProjectStatus
    completionPercentage?: number
    imageUrl?: string | null
    documentUrl?: string | null
    documentName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutProjectsInput
    activities?: ProjectActivityCreateNestedManyWithoutProjectInput
    disbursements?: DisbursementCreateNestedManyWithoutProjectInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutTaskNotificationsInput = {
    id?: string
    projectCode: string
    title: string
    subType?: $Enums.ProjectSubType | null
    modeOfImplementation: $Enums.ModeOfImplementation
    locationImplementation: $Enums.District
    sourceOfFund: $Enums.SourceOfFund
    projectCost?: number
    contractCost?: number
    contractorName?: string | null
    projectEngineer?: string | null
    budgetYear?: string | null
    dateStarted?: Date | string | null
    targetCompletionDate?: Date | string | null
    duration?: number
    revisedCompletionDate?: Date | string | null
    dateCompleted?: Date | string | null
    daysSuspended?: number
    daysExtended?: number
    numFemale?: number
    numMale?: number
    numPersons?: number
    numManDays?: number
    district?: $Enums.District | null
    cityMunicipality?: string | null
    barangay?: string | null
    purok?: string | null
    sitio?: string | null
    description?: string | null
    status?: $Enums.ProjectStatus
    completionPercentage?: number
    imageUrl?: string | null
    documentUrl?: string | null
    documentName?: string | null
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    activities?: ProjectActivityUncheckedCreateNestedManyWithoutProjectInput
    disbursements?: DisbursementUncheckedCreateNestedManyWithoutProjectInput
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutTaskNotificationsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutTaskNotificationsInput, ProjectUncheckedCreateWithoutTaskNotificationsInput>
  }

  export type UserCreateWithoutTaskNotificationsReceivedInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostCreateNestedManyWithoutCreatedByInput
    projects?: ProjectCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementCreateNestedManyWithoutCreatedByInput
    taskNotificationsCreated?: TaskNotificationCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutTaskNotificationsReceivedInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostUncheckedCreateNestedManyWithoutCreatedByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityUncheckedCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementUncheckedCreateNestedManyWithoutCreatedByInput
    taskNotificationsCreated?: TaskNotificationUncheckedCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyUncheckedCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutTaskNotificationsReceivedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTaskNotificationsReceivedInput, UserUncheckedCreateWithoutTaskNotificationsReceivedInput>
  }

  export type UserCreateWithoutTaskNotificationsCreatedInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostCreateNestedManyWithoutCreatedByInput
    projects?: ProjectCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationCreateNestedManyWithoutNotifyUserInput
    taskReplies?: TaskReplyCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutTaskNotificationsCreatedInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostUncheckedCreateNestedManyWithoutCreatedByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityUncheckedCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementUncheckedCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationUncheckedCreateNestedManyWithoutNotifyUserInput
    taskReplies?: TaskReplyUncheckedCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutTaskNotificationsCreatedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTaskNotificationsCreatedInput, UserUncheckedCreateWithoutTaskNotificationsCreatedInput>
  }

  export type TaskReplyCreateWithoutTaskNotificationInput = {
    id?: string
    message: string
    taskStatus?: string | null
    createdAt?: Date | string
    createdBy: UserCreateNestedOneWithoutTaskRepliesInput
    documents?: TaskReplyDocumentCreateNestedManyWithoutReplyInput
  }

  export type TaskReplyUncheckedCreateWithoutTaskNotificationInput = {
    id?: string
    message: string
    taskStatus?: string | null
    createdById: string
    createdAt?: Date | string
    documents?: TaskReplyDocumentUncheckedCreateNestedManyWithoutReplyInput
  }

  export type TaskReplyCreateOrConnectWithoutTaskNotificationInput = {
    where: TaskReplyWhereUniqueInput
    create: XOR<TaskReplyCreateWithoutTaskNotificationInput, TaskReplyUncheckedCreateWithoutTaskNotificationInput>
  }

  export type TaskReplyCreateManyTaskNotificationInputEnvelope = {
    data: TaskReplyCreateManyTaskNotificationInput | TaskReplyCreateManyTaskNotificationInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutTaskNotificationsInput = {
    update: XOR<ProjectUpdateWithoutTaskNotificationsInput, ProjectUncheckedUpdateWithoutTaskNotificationsInput>
    create: XOR<ProjectCreateWithoutTaskNotificationsInput, ProjectUncheckedCreateWithoutTaskNotificationsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutTaskNotificationsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutTaskNotificationsInput, ProjectUncheckedUpdateWithoutTaskNotificationsInput>
  }

  export type ProjectUpdateWithoutTaskNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subType?: NullableEnumProjectSubTypeFieldUpdateOperationsInput | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFieldUpdateOperationsInput | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    sourceOfFund?: EnumSourceOfFundFieldUpdateOperationsInput | $Enums.SourceOfFund
    projectCost?: FloatFieldUpdateOperationsInput | number
    contractCost?: FloatFieldUpdateOperationsInput | number
    contractorName?: NullableStringFieldUpdateOperationsInput | string | null
    projectEngineer?: NullableStringFieldUpdateOperationsInput | string | null
    budgetYear?: NullableStringFieldUpdateOperationsInput | string | null
    dateStarted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    targetCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    revisedCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateCompleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    daysSuspended?: IntFieldUpdateOperationsInput | number
    daysExtended?: IntFieldUpdateOperationsInput | number
    numFemale?: IntFieldUpdateOperationsInput | number
    numMale?: IntFieldUpdateOperationsInput | number
    numPersons?: IntFieldUpdateOperationsInput | number
    numManDays?: IntFieldUpdateOperationsInput | number
    district?: NullableEnumDistrictFieldUpdateOperationsInput | $Enums.District | null
    cityMunicipality?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    purok?: NullableStringFieldUpdateOperationsInput | string | null
    sitio?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    completionPercentage?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutProjectsNestedInput
    activities?: ProjectActivityUpdateManyWithoutProjectNestedInput
    disbursements?: DisbursementUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutTaskNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subType?: NullableEnumProjectSubTypeFieldUpdateOperationsInput | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFieldUpdateOperationsInput | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    sourceOfFund?: EnumSourceOfFundFieldUpdateOperationsInput | $Enums.SourceOfFund
    projectCost?: FloatFieldUpdateOperationsInput | number
    contractCost?: FloatFieldUpdateOperationsInput | number
    contractorName?: NullableStringFieldUpdateOperationsInput | string | null
    projectEngineer?: NullableStringFieldUpdateOperationsInput | string | null
    budgetYear?: NullableStringFieldUpdateOperationsInput | string | null
    dateStarted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    targetCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    revisedCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateCompleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    daysSuspended?: IntFieldUpdateOperationsInput | number
    daysExtended?: IntFieldUpdateOperationsInput | number
    numFemale?: IntFieldUpdateOperationsInput | number
    numMale?: IntFieldUpdateOperationsInput | number
    numPersons?: IntFieldUpdateOperationsInput | number
    numManDays?: IntFieldUpdateOperationsInput | number
    district?: NullableEnumDistrictFieldUpdateOperationsInput | $Enums.District | null
    cityMunicipality?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    purok?: NullableStringFieldUpdateOperationsInput | string | null
    sitio?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    completionPercentage?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentName?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activities?: ProjectActivityUncheckedUpdateManyWithoutProjectNestedInput
    disbursements?: DisbursementUncheckedUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserUpsertWithoutTaskNotificationsReceivedInput = {
    update: XOR<UserUpdateWithoutTaskNotificationsReceivedInput, UserUncheckedUpdateWithoutTaskNotificationsReceivedInput>
    create: XOR<UserCreateWithoutTaskNotificationsReceivedInput, UserUncheckedCreateWithoutTaskNotificationsReceivedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTaskNotificationsReceivedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTaskNotificationsReceivedInput, UserUncheckedUpdateWithoutTaskNotificationsReceivedInput>
  }

  export type UserUpdateWithoutTaskNotificationsReceivedInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUpdateManyWithoutCreatedByNestedInput
    taskNotificationsCreated?: TaskNotificationUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutTaskNotificationsReceivedInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUncheckedUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUncheckedUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUncheckedUpdateManyWithoutCreatedByNestedInput
    taskNotificationsCreated?: TaskNotificationUncheckedUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUncheckedUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUpsertWithoutTaskNotificationsCreatedInput = {
    update: XOR<UserUpdateWithoutTaskNotificationsCreatedInput, UserUncheckedUpdateWithoutTaskNotificationsCreatedInput>
    create: XOR<UserCreateWithoutTaskNotificationsCreatedInput, UserUncheckedCreateWithoutTaskNotificationsCreatedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTaskNotificationsCreatedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTaskNotificationsCreatedInput, UserUncheckedUpdateWithoutTaskNotificationsCreatedInput>
  }

  export type UserUpdateWithoutTaskNotificationsCreatedInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUpdateManyWithoutNotifyUserNestedInput
    taskReplies?: TaskReplyUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutTaskNotificationsCreatedInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUncheckedUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUncheckedUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUncheckedUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUncheckedUpdateManyWithoutNotifyUserNestedInput
    taskReplies?: TaskReplyUncheckedUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type TaskReplyUpsertWithWhereUniqueWithoutTaskNotificationInput = {
    where: TaskReplyWhereUniqueInput
    update: XOR<TaskReplyUpdateWithoutTaskNotificationInput, TaskReplyUncheckedUpdateWithoutTaskNotificationInput>
    create: XOR<TaskReplyCreateWithoutTaskNotificationInput, TaskReplyUncheckedCreateWithoutTaskNotificationInput>
  }

  export type TaskReplyUpdateWithWhereUniqueWithoutTaskNotificationInput = {
    where: TaskReplyWhereUniqueInput
    data: XOR<TaskReplyUpdateWithoutTaskNotificationInput, TaskReplyUncheckedUpdateWithoutTaskNotificationInput>
  }

  export type TaskReplyUpdateManyWithWhereWithoutTaskNotificationInput = {
    where: TaskReplyScalarWhereInput
    data: XOR<TaskReplyUpdateManyMutationInput, TaskReplyUncheckedUpdateManyWithoutTaskNotificationInput>
  }

  export type TaskNotificationCreateWithoutRepliesInput = {
    id?: string
    priority?: $Enums.NotificationPriority
    description: string
    acknowledged?: boolean
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutTaskNotificationsInput
    notifyUser: UserCreateNestedOneWithoutTaskNotificationsReceivedInput
    createdBy: UserCreateNestedOneWithoutTaskNotificationsCreatedInput
  }

  export type TaskNotificationUncheckedCreateWithoutRepliesInput = {
    id?: string
    projectId: string
    notifyUserId: string
    priority?: $Enums.NotificationPriority
    description: string
    acknowledged?: boolean
    acknowledgedAt?: Date | string | null
    createdById: string
    createdAt?: Date | string
  }

  export type TaskNotificationCreateOrConnectWithoutRepliesInput = {
    where: TaskNotificationWhereUniqueInput
    create: XOR<TaskNotificationCreateWithoutRepliesInput, TaskNotificationUncheckedCreateWithoutRepliesInput>
  }

  export type UserCreateWithoutTaskRepliesInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostCreateNestedManyWithoutCreatedByInput
    projects?: ProjectCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutTaskRepliesInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostUncheckedCreateNestedManyWithoutCreatedByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityUncheckedCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementUncheckedCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationUncheckedCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationUncheckedCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutTaskRepliesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTaskRepliesInput, UserUncheckedCreateWithoutTaskRepliesInput>
  }

  export type TaskReplyDocumentCreateWithoutReplyInput = {
    id?: string
    fileName: string
    fileUrl: string
    fileSize?: number | null
    fileType?: string | null
    createdAt?: Date | string
  }

  export type TaskReplyDocumentUncheckedCreateWithoutReplyInput = {
    id?: string
    fileName: string
    fileUrl: string
    fileSize?: number | null
    fileType?: string | null
    createdAt?: Date | string
  }

  export type TaskReplyDocumentCreateOrConnectWithoutReplyInput = {
    where: TaskReplyDocumentWhereUniqueInput
    create: XOR<TaskReplyDocumentCreateWithoutReplyInput, TaskReplyDocumentUncheckedCreateWithoutReplyInput>
  }

  export type TaskReplyDocumentCreateManyReplyInputEnvelope = {
    data: TaskReplyDocumentCreateManyReplyInput | TaskReplyDocumentCreateManyReplyInput[]
    skipDuplicates?: boolean
  }

  export type TaskNotificationUpsertWithoutRepliesInput = {
    update: XOR<TaskNotificationUpdateWithoutRepliesInput, TaskNotificationUncheckedUpdateWithoutRepliesInput>
    create: XOR<TaskNotificationCreateWithoutRepliesInput, TaskNotificationUncheckedCreateWithoutRepliesInput>
    where?: TaskNotificationWhereInput
  }

  export type TaskNotificationUpdateToOneWithWhereWithoutRepliesInput = {
    where?: TaskNotificationWhereInput
    data: XOR<TaskNotificationUpdateWithoutRepliesInput, TaskNotificationUncheckedUpdateWithoutRepliesInput>
  }

  export type TaskNotificationUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    description?: StringFieldUpdateOperationsInput | string
    acknowledged?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutTaskNotificationsNestedInput
    notifyUser?: UserUpdateOneRequiredWithoutTaskNotificationsReceivedNestedInput
    createdBy?: UserUpdateOneRequiredWithoutTaskNotificationsCreatedNestedInput
  }

  export type TaskNotificationUncheckedUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    notifyUserId?: StringFieldUpdateOperationsInput | string
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    description?: StringFieldUpdateOperationsInput | string
    acknowledged?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutTaskRepliesInput = {
    update: XOR<UserUpdateWithoutTaskRepliesInput, UserUncheckedUpdateWithoutTaskRepliesInput>
    create: XOR<UserCreateWithoutTaskRepliesInput, UserUncheckedCreateWithoutTaskRepliesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTaskRepliesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTaskRepliesInput, UserUncheckedUpdateWithoutTaskRepliesInput>
  }

  export type UserUpdateWithoutTaskRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutTaskRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUncheckedUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUncheckedUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUncheckedUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUncheckedUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUncheckedUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type TaskReplyDocumentUpsertWithWhereUniqueWithoutReplyInput = {
    where: TaskReplyDocumentWhereUniqueInput
    update: XOR<TaskReplyDocumentUpdateWithoutReplyInput, TaskReplyDocumentUncheckedUpdateWithoutReplyInput>
    create: XOR<TaskReplyDocumentCreateWithoutReplyInput, TaskReplyDocumentUncheckedCreateWithoutReplyInput>
  }

  export type TaskReplyDocumentUpdateWithWhereUniqueWithoutReplyInput = {
    where: TaskReplyDocumentWhereUniqueInput
    data: XOR<TaskReplyDocumentUpdateWithoutReplyInput, TaskReplyDocumentUncheckedUpdateWithoutReplyInput>
  }

  export type TaskReplyDocumentUpdateManyWithWhereWithoutReplyInput = {
    where: TaskReplyDocumentScalarWhereInput
    data: XOR<TaskReplyDocumentUpdateManyMutationInput, TaskReplyDocumentUncheckedUpdateManyWithoutReplyInput>
  }

  export type TaskReplyDocumentScalarWhereInput = {
    AND?: TaskReplyDocumentScalarWhereInput | TaskReplyDocumentScalarWhereInput[]
    OR?: TaskReplyDocumentScalarWhereInput[]
    NOT?: TaskReplyDocumentScalarWhereInput | TaskReplyDocumentScalarWhereInput[]
    id?: StringFilter<"TaskReplyDocument"> | string
    replyId?: StringFilter<"TaskReplyDocument"> | string
    fileName?: StringFilter<"TaskReplyDocument"> | string
    fileUrl?: StringFilter<"TaskReplyDocument"> | string
    fileSize?: IntNullableFilter<"TaskReplyDocument"> | number | null
    fileType?: StringNullableFilter<"TaskReplyDocument"> | string | null
    createdAt?: DateTimeFilter<"TaskReplyDocument"> | Date | string
  }

  export type TaskReplyCreateWithoutDocumentsInput = {
    id?: string
    message: string
    taskStatus?: string | null
    createdAt?: Date | string
    taskNotification: TaskNotificationCreateNestedOneWithoutRepliesInput
    createdBy: UserCreateNestedOneWithoutTaskRepliesInput
  }

  export type TaskReplyUncheckedCreateWithoutDocumentsInput = {
    id?: string
    taskNotificationId: string
    message: string
    taskStatus?: string | null
    createdById: string
    createdAt?: Date | string
  }

  export type TaskReplyCreateOrConnectWithoutDocumentsInput = {
    where: TaskReplyWhereUniqueInput
    create: XOR<TaskReplyCreateWithoutDocumentsInput, TaskReplyUncheckedCreateWithoutDocumentsInput>
  }

  export type TaskReplyUpsertWithoutDocumentsInput = {
    update: XOR<TaskReplyUpdateWithoutDocumentsInput, TaskReplyUncheckedUpdateWithoutDocumentsInput>
    create: XOR<TaskReplyCreateWithoutDocumentsInput, TaskReplyUncheckedCreateWithoutDocumentsInput>
    where?: TaskReplyWhereInput
  }

  export type TaskReplyUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: TaskReplyWhereInput
    data: XOR<TaskReplyUpdateWithoutDocumentsInput, TaskReplyUncheckedUpdateWithoutDocumentsInput>
  }

  export type TaskReplyUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    taskStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    taskNotification?: TaskNotificationUpdateOneRequiredWithoutRepliesNestedInput
    createdBy?: UserUpdateOneRequiredWithoutTaskRepliesNestedInput
  }

  export type TaskReplyUncheckedUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskNotificationId?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    taskStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutDocumentsInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostCreateNestedManyWithoutCreatedByInput
    projects?: ProjectCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    projectActivities?: ProjectActivityCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutDocumentsInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostUncheckedCreateNestedManyWithoutCreatedByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    projectActivities?: ProjectActivityUncheckedCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementUncheckedCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationUncheckedCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationUncheckedCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyUncheckedCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutDocumentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDocumentsInput, UserUncheckedCreateWithoutDocumentsInput>
  }

  export type UserUpsertWithoutDocumentsInput = {
    update: XOR<UserUpdateWithoutDocumentsInput, UserUncheckedUpdateWithoutDocumentsInput>
    create: XOR<UserCreateWithoutDocumentsInput, UserUncheckedCreateWithoutDocumentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDocumentsInput, UserUncheckedUpdateWithoutDocumentsInput>
  }

  export type UserUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    projectActivities?: ProjectActivityUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUncheckedUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    projectActivities?: ProjectActivityUncheckedUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUncheckedUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUncheckedUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUncheckedUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUncheckedUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type ProjectCreateWithoutFilesInput = {
    id?: string
    projectCode: string
    title: string
    subType?: $Enums.ProjectSubType | null
    modeOfImplementation: $Enums.ModeOfImplementation
    locationImplementation: $Enums.District
    sourceOfFund: $Enums.SourceOfFund
    projectCost?: number
    contractCost?: number
    contractorName?: string | null
    projectEngineer?: string | null
    budgetYear?: string | null
    dateStarted?: Date | string | null
    targetCompletionDate?: Date | string | null
    duration?: number
    revisedCompletionDate?: Date | string | null
    dateCompleted?: Date | string | null
    daysSuspended?: number
    daysExtended?: number
    numFemale?: number
    numMale?: number
    numPersons?: number
    numManDays?: number
    district?: $Enums.District | null
    cityMunicipality?: string | null
    barangay?: string | null
    purok?: string | null
    sitio?: string | null
    description?: string | null
    status?: $Enums.ProjectStatus
    completionPercentage?: number
    imageUrl?: string | null
    documentUrl?: string | null
    documentName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutProjectsInput
    activities?: ProjectActivityCreateNestedManyWithoutProjectInput
    disbursements?: DisbursementCreateNestedManyWithoutProjectInput
    taskNotifications?: TaskNotificationCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutFilesInput = {
    id?: string
    projectCode: string
    title: string
    subType?: $Enums.ProjectSubType | null
    modeOfImplementation: $Enums.ModeOfImplementation
    locationImplementation: $Enums.District
    sourceOfFund: $Enums.SourceOfFund
    projectCost?: number
    contractCost?: number
    contractorName?: string | null
    projectEngineer?: string | null
    budgetYear?: string | null
    dateStarted?: Date | string | null
    targetCompletionDate?: Date | string | null
    duration?: number
    revisedCompletionDate?: Date | string | null
    dateCompleted?: Date | string | null
    daysSuspended?: number
    daysExtended?: number
    numFemale?: number
    numMale?: number
    numPersons?: number
    numManDays?: number
    district?: $Enums.District | null
    cityMunicipality?: string | null
    barangay?: string | null
    purok?: string | null
    sitio?: string | null
    description?: string | null
    status?: $Enums.ProjectStatus
    completionPercentage?: number
    imageUrl?: string | null
    documentUrl?: string | null
    documentName?: string | null
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    activities?: ProjectActivityUncheckedCreateNestedManyWithoutProjectInput
    disbursements?: DisbursementUncheckedCreateNestedManyWithoutProjectInput
    taskNotifications?: TaskNotificationUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutFilesInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
  }

  export type UserCreateWithoutProjectFilesInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostCreateNestedManyWithoutCreatedByInput
    projects?: ProjectCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutProjectFilesInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostUncheckedCreateNestedManyWithoutCreatedByInput
    projects?: ProjectUncheckedCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityUncheckedCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementUncheckedCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationUncheckedCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationUncheckedCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutProjectFilesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProjectFilesInput, UserUncheckedCreateWithoutProjectFilesInput>
  }

  export type ProjectUpsertWithoutFilesInput = {
    update: XOR<ProjectUpdateWithoutFilesInput, ProjectUncheckedUpdateWithoutFilesInput>
    create: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutFilesInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutFilesInput, ProjectUncheckedUpdateWithoutFilesInput>
  }

  export type ProjectUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subType?: NullableEnumProjectSubTypeFieldUpdateOperationsInput | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFieldUpdateOperationsInput | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    sourceOfFund?: EnumSourceOfFundFieldUpdateOperationsInput | $Enums.SourceOfFund
    projectCost?: FloatFieldUpdateOperationsInput | number
    contractCost?: FloatFieldUpdateOperationsInput | number
    contractorName?: NullableStringFieldUpdateOperationsInput | string | null
    projectEngineer?: NullableStringFieldUpdateOperationsInput | string | null
    budgetYear?: NullableStringFieldUpdateOperationsInput | string | null
    dateStarted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    targetCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    revisedCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateCompleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    daysSuspended?: IntFieldUpdateOperationsInput | number
    daysExtended?: IntFieldUpdateOperationsInput | number
    numFemale?: IntFieldUpdateOperationsInput | number
    numMale?: IntFieldUpdateOperationsInput | number
    numPersons?: IntFieldUpdateOperationsInput | number
    numManDays?: IntFieldUpdateOperationsInput | number
    district?: NullableEnumDistrictFieldUpdateOperationsInput | $Enums.District | null
    cityMunicipality?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    purok?: NullableStringFieldUpdateOperationsInput | string | null
    sitio?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    completionPercentage?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutProjectsNestedInput
    activities?: ProjectActivityUpdateManyWithoutProjectNestedInput
    disbursements?: DisbursementUpdateManyWithoutProjectNestedInput
    taskNotifications?: TaskNotificationUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subType?: NullableEnumProjectSubTypeFieldUpdateOperationsInput | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFieldUpdateOperationsInput | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    sourceOfFund?: EnumSourceOfFundFieldUpdateOperationsInput | $Enums.SourceOfFund
    projectCost?: FloatFieldUpdateOperationsInput | number
    contractCost?: FloatFieldUpdateOperationsInput | number
    contractorName?: NullableStringFieldUpdateOperationsInput | string | null
    projectEngineer?: NullableStringFieldUpdateOperationsInput | string | null
    budgetYear?: NullableStringFieldUpdateOperationsInput | string | null
    dateStarted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    targetCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    revisedCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateCompleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    daysSuspended?: IntFieldUpdateOperationsInput | number
    daysExtended?: IntFieldUpdateOperationsInput | number
    numFemale?: IntFieldUpdateOperationsInput | number
    numMale?: IntFieldUpdateOperationsInput | number
    numPersons?: IntFieldUpdateOperationsInput | number
    numManDays?: IntFieldUpdateOperationsInput | number
    district?: NullableEnumDistrictFieldUpdateOperationsInput | $Enums.District | null
    cityMunicipality?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    purok?: NullableStringFieldUpdateOperationsInput | string | null
    sitio?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    completionPercentage?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentName?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activities?: ProjectActivityUncheckedUpdateManyWithoutProjectNestedInput
    disbursements?: DisbursementUncheckedUpdateManyWithoutProjectNestedInput
    taskNotifications?: TaskNotificationUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserUpsertWithoutProjectFilesInput = {
    update: XOR<UserUpdateWithoutProjectFilesInput, UserUncheckedUpdateWithoutProjectFilesInput>
    create: XOR<UserCreateWithoutProjectFilesInput, UserUncheckedCreateWithoutProjectFilesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProjectFilesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProjectFilesInput, UserUncheckedUpdateWithoutProjectFilesInput>
  }

  export type UserUpdateWithoutProjectFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutProjectFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUncheckedUpdateManyWithoutCreatedByNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUncheckedUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUncheckedUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUncheckedUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUncheckedUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type UserCreateWithoutPostsInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutPostsInput = {
    id?: string
    name?: string | null
    email: string
    password: string
    role?: $Enums.UserRole
    employeeId?: string | null
    designation?: string | null
    division?: string | null
    sex?: $Enums.Sex | null
    status?: $Enums.UserStatus
    emailVerified?: Date | string | null
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutCreatedByInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutCreatedByInput
    projectActivities?: ProjectActivityUncheckedCreateNestedManyWithoutCreatedByInput
    disbursements?: DisbursementUncheckedCreateNestedManyWithoutCreatedByInput
    taskNotificationsReceived?: TaskNotificationUncheckedCreateNestedManyWithoutNotifyUserInput
    taskNotificationsCreated?: TaskNotificationUncheckedCreateNestedManyWithoutCreatedByInput
    taskReplies?: TaskReplyUncheckedCreateNestedManyWithoutCreatedByInput
    projectFiles?: ProjectFileUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutPostsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>
  }

  export type UserUpsertWithoutPostsInput = {
    update: XOR<UserUpdateWithoutPostsInput, UserUncheckedUpdateWithoutPostsInput>
    create: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPostsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPostsInput, UserUncheckedUpdateWithoutPostsInput>
  }

  export type UserUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: NullableEnumSexFieldUpdateOperationsInput | $Enums.Sex | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutCreatedByNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutCreatedByNestedInput
    projectActivities?: ProjectActivityUncheckedUpdateManyWithoutCreatedByNestedInput
    disbursements?: DisbursementUncheckedUpdateManyWithoutCreatedByNestedInput
    taskNotificationsReceived?: TaskNotificationUncheckedUpdateManyWithoutNotifyUserNestedInput
    taskNotificationsCreated?: TaskNotificationUncheckedUpdateManyWithoutCreatedByNestedInput
    taskReplies?: TaskReplyUncheckedUpdateManyWithoutCreatedByNestedInput
    projectFiles?: ProjectFileUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type PostCreateManyCreatedByInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectCreateManyCreatedByInput = {
    id?: string
    projectCode: string
    title: string
    subType?: $Enums.ProjectSubType | null
    modeOfImplementation: $Enums.ModeOfImplementation
    locationImplementation: $Enums.District
    sourceOfFund: $Enums.SourceOfFund
    projectCost?: number
    contractCost?: number
    contractorName?: string | null
    projectEngineer?: string | null
    budgetYear?: string | null
    dateStarted?: Date | string | null
    targetCompletionDate?: Date | string | null
    duration?: number
    revisedCompletionDate?: Date | string | null
    dateCompleted?: Date | string | null
    daysSuspended?: number
    daysExtended?: number
    numFemale?: number
    numMale?: number
    numPersons?: number
    numManDays?: number
    district?: $Enums.District | null
    cityMunicipality?: string | null
    barangay?: string | null
    purok?: string | null
    sitio?: string | null
    description?: string | null
    status?: $Enums.ProjectStatus
    completionPercentage?: number
    imageUrl?: string | null
    documentUrl?: string | null
    documentName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserSessionCreateManyUserInput = {
    id?: string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    expiresAt: Date | string
    lastActive?: Date | string
  }

  export type DocumentCreateManyCreatedByInput = {
    id?: string
    documentCode: string
    type: $Enums.DocumentType
    title: string
    description?: string | null
    status?: $Enums.DocumentStatus
    filePath?: string | null
    fileName?: string | null
    fileSize?: number | null
    amount?: number | null
    purpose?: string | null
    district: $Enums.District
    projectRef?: string | null
    releasedAt?: Date | string | null
    releasedTo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectActivityCreateManyCreatedByInput = {
    id?: string
    projectId: string
    description: string
    createdAt?: Date | string
  }

  export type DisbursementCreateManyCreatedByInput = {
    id?: string
    projectId: string
    date?: Date | string
    referenceNumber?: string | null
    amount: number
    createdAt?: Date | string
  }

  export type TaskNotificationCreateManyNotifyUserInput = {
    id?: string
    projectId: string
    priority?: $Enums.NotificationPriority
    description: string
    acknowledged?: boolean
    acknowledgedAt?: Date | string | null
    createdById: string
    createdAt?: Date | string
  }

  export type TaskNotificationCreateManyCreatedByInput = {
    id?: string
    projectId: string
    notifyUserId: string
    priority?: $Enums.NotificationPriority
    description: string
    acknowledged?: boolean
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type TaskReplyCreateManyCreatedByInput = {
    id?: string
    taskNotificationId: string
    message: string
    taskStatus?: string | null
    createdAt?: Date | string
  }

  export type ProjectFileCreateManyCreatedByInput = {
    id?: string
    projectId: string
    fileName: string
    fileUrl: string
    fileType?: $Enums.ProjectFileType
    fileSize?: number | null
    createdAt?: Date | string
  }

  export type PostUpdateWithoutCreatedByInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateWithoutCreatedByInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateManyWithoutCreatedByInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subType?: NullableEnumProjectSubTypeFieldUpdateOperationsInput | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFieldUpdateOperationsInput | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    sourceOfFund?: EnumSourceOfFundFieldUpdateOperationsInput | $Enums.SourceOfFund
    projectCost?: FloatFieldUpdateOperationsInput | number
    contractCost?: FloatFieldUpdateOperationsInput | number
    contractorName?: NullableStringFieldUpdateOperationsInput | string | null
    projectEngineer?: NullableStringFieldUpdateOperationsInput | string | null
    budgetYear?: NullableStringFieldUpdateOperationsInput | string | null
    dateStarted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    targetCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    revisedCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateCompleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    daysSuspended?: IntFieldUpdateOperationsInput | number
    daysExtended?: IntFieldUpdateOperationsInput | number
    numFemale?: IntFieldUpdateOperationsInput | number
    numMale?: IntFieldUpdateOperationsInput | number
    numPersons?: IntFieldUpdateOperationsInput | number
    numManDays?: IntFieldUpdateOperationsInput | number
    district?: NullableEnumDistrictFieldUpdateOperationsInput | $Enums.District | null
    cityMunicipality?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    purok?: NullableStringFieldUpdateOperationsInput | string | null
    sitio?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    completionPercentage?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activities?: ProjectActivityUpdateManyWithoutProjectNestedInput
    disbursements?: DisbursementUpdateManyWithoutProjectNestedInput
    taskNotifications?: TaskNotificationUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subType?: NullableEnumProjectSubTypeFieldUpdateOperationsInput | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFieldUpdateOperationsInput | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    sourceOfFund?: EnumSourceOfFundFieldUpdateOperationsInput | $Enums.SourceOfFund
    projectCost?: FloatFieldUpdateOperationsInput | number
    contractCost?: FloatFieldUpdateOperationsInput | number
    contractorName?: NullableStringFieldUpdateOperationsInput | string | null
    projectEngineer?: NullableStringFieldUpdateOperationsInput | string | null
    budgetYear?: NullableStringFieldUpdateOperationsInput | string | null
    dateStarted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    targetCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    revisedCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateCompleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    daysSuspended?: IntFieldUpdateOperationsInput | number
    daysExtended?: IntFieldUpdateOperationsInput | number
    numFemale?: IntFieldUpdateOperationsInput | number
    numMale?: IntFieldUpdateOperationsInput | number
    numPersons?: IntFieldUpdateOperationsInput | number
    numManDays?: IntFieldUpdateOperationsInput | number
    district?: NullableEnumDistrictFieldUpdateOperationsInput | $Enums.District | null
    cityMunicipality?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    purok?: NullableStringFieldUpdateOperationsInput | string | null
    sitio?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    completionPercentage?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activities?: ProjectActivityUncheckedUpdateManyWithoutProjectNestedInput
    disbursements?: DisbursementUncheckedUpdateManyWithoutProjectNestedInput
    taskNotifications?: TaskNotificationUncheckedUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subType?: NullableEnumProjectSubTypeFieldUpdateOperationsInput | $Enums.ProjectSubType | null
    modeOfImplementation?: EnumModeOfImplementationFieldUpdateOperationsInput | $Enums.ModeOfImplementation
    locationImplementation?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    sourceOfFund?: EnumSourceOfFundFieldUpdateOperationsInput | $Enums.SourceOfFund
    projectCost?: FloatFieldUpdateOperationsInput | number
    contractCost?: FloatFieldUpdateOperationsInput | number
    contractorName?: NullableStringFieldUpdateOperationsInput | string | null
    projectEngineer?: NullableStringFieldUpdateOperationsInput | string | null
    budgetYear?: NullableStringFieldUpdateOperationsInput | string | null
    dateStarted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    targetCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: IntFieldUpdateOperationsInput | number
    revisedCompletionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dateCompleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    daysSuspended?: IntFieldUpdateOperationsInput | number
    daysExtended?: IntFieldUpdateOperationsInput | number
    numFemale?: IntFieldUpdateOperationsInput | number
    numMale?: IntFieldUpdateOperationsInput | number
    numPersons?: IntFieldUpdateOperationsInput | number
    numManDays?: IntFieldUpdateOperationsInput | number
    district?: NullableEnumDistrictFieldUpdateOperationsInput | $Enums.District | null
    cityMunicipality?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    purok?: NullableStringFieldUpdateOperationsInput | string | null
    sitio?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    completionPercentage?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentCode?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    filePath?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    district?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    projectRef?: NullableStringFieldUpdateOperationsInput | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedTo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentCode?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    filePath?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    district?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    projectRef?: NullableStringFieldUpdateOperationsInput | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedTo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentCode?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    filePath?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: NullableFloatFieldUpdateOperationsInput | number | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    district?: EnumDistrictFieldUpdateOperationsInput | $Enums.District
    projectRef?: NullableStringFieldUpdateOperationsInput | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedTo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectActivityUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutActivitiesNestedInput
  }

  export type ProjectActivityUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectActivityUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DisbursementUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    referenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutDisbursementsNestedInput
  }

  export type DisbursementUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    referenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DisbursementUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    referenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskNotificationUpdateWithoutNotifyUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    description?: StringFieldUpdateOperationsInput | string
    acknowledged?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutTaskNotificationsNestedInput
    createdBy?: UserUpdateOneRequiredWithoutTaskNotificationsCreatedNestedInput
    replies?: TaskReplyUpdateManyWithoutTaskNotificationNestedInput
  }

  export type TaskNotificationUncheckedUpdateWithoutNotifyUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    description?: StringFieldUpdateOperationsInput | string
    acknowledged?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: TaskReplyUncheckedUpdateManyWithoutTaskNotificationNestedInput
  }

  export type TaskNotificationUncheckedUpdateManyWithoutNotifyUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    description?: StringFieldUpdateOperationsInput | string
    acknowledged?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskNotificationUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    description?: StringFieldUpdateOperationsInput | string
    acknowledged?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutTaskNotificationsNestedInput
    notifyUser?: UserUpdateOneRequiredWithoutTaskNotificationsReceivedNestedInput
    replies?: TaskReplyUpdateManyWithoutTaskNotificationNestedInput
  }

  export type TaskNotificationUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    notifyUserId?: StringFieldUpdateOperationsInput | string
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    description?: StringFieldUpdateOperationsInput | string
    acknowledged?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: TaskReplyUncheckedUpdateManyWithoutTaskNotificationNestedInput
  }

  export type TaskNotificationUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    notifyUserId?: StringFieldUpdateOperationsInput | string
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    description?: StringFieldUpdateOperationsInput | string
    acknowledged?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskReplyUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    taskStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    taskNotification?: TaskNotificationUpdateOneRequiredWithoutRepliesNestedInput
    documents?: TaskReplyDocumentUpdateManyWithoutReplyNestedInput
  }

  export type TaskReplyUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskNotificationId?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    taskStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: TaskReplyDocumentUncheckedUpdateManyWithoutReplyNestedInput
  }

  export type TaskReplyUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskNotificationId?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    taskStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileType?: EnumProjectFileTypeFieldUpdateOperationsInput | $Enums.ProjectFileType
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutFilesNestedInput
  }

  export type ProjectFileUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileType?: EnumProjectFileTypeFieldUpdateOperationsInput | $Enums.ProjectFileType
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileType?: EnumProjectFileTypeFieldUpdateOperationsInput | $Enums.ProjectFileType
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectActivityCreateManyProjectInput = {
    id?: string
    description: string
    createdById: string
    createdAt?: Date | string
  }

  export type DisbursementCreateManyProjectInput = {
    id?: string
    date?: Date | string
    referenceNumber?: string | null
    amount: number
    createdById: string
    createdAt?: Date | string
  }

  export type TaskNotificationCreateManyProjectInput = {
    id?: string
    notifyUserId: string
    priority?: $Enums.NotificationPriority
    description: string
    acknowledged?: boolean
    acknowledgedAt?: Date | string | null
    createdById: string
    createdAt?: Date | string
  }

  export type ProjectFileCreateManyProjectInput = {
    id?: string
    fileName: string
    fileUrl: string
    fileType?: $Enums.ProjectFileType
    fileSize?: number | null
    createdById: string
    createdAt?: Date | string
  }

  export type ProjectActivityUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutProjectActivitiesNestedInput
  }

  export type ProjectActivityUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectActivityUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DisbursementUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    referenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutDisbursementsNestedInput
  }

  export type DisbursementUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    referenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DisbursementUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    referenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskNotificationUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    description?: StringFieldUpdateOperationsInput | string
    acknowledged?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifyUser?: UserUpdateOneRequiredWithoutTaskNotificationsReceivedNestedInput
    createdBy?: UserUpdateOneRequiredWithoutTaskNotificationsCreatedNestedInput
    replies?: TaskReplyUpdateManyWithoutTaskNotificationNestedInput
  }

  export type TaskNotificationUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    notifyUserId?: StringFieldUpdateOperationsInput | string
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    description?: StringFieldUpdateOperationsInput | string
    acknowledged?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: TaskReplyUncheckedUpdateManyWithoutTaskNotificationNestedInput
  }

  export type TaskNotificationUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    notifyUserId?: StringFieldUpdateOperationsInput | string
    priority?: EnumNotificationPriorityFieldUpdateOperationsInput | $Enums.NotificationPriority
    description?: StringFieldUpdateOperationsInput | string
    acknowledged?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileType?: EnumProjectFileTypeFieldUpdateOperationsInput | $Enums.ProjectFileType
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutProjectFilesNestedInput
  }

  export type ProjectFileUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileType?: EnumProjectFileTypeFieldUpdateOperationsInput | $Enums.ProjectFileType
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileType?: EnumProjectFileTypeFieldUpdateOperationsInput | $Enums.ProjectFileType
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskReplyCreateManyTaskNotificationInput = {
    id?: string
    message: string
    taskStatus?: string | null
    createdById: string
    createdAt?: Date | string
  }

  export type TaskReplyUpdateWithoutTaskNotificationInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    taskStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutTaskRepliesNestedInput
    documents?: TaskReplyDocumentUpdateManyWithoutReplyNestedInput
  }

  export type TaskReplyUncheckedUpdateWithoutTaskNotificationInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    taskStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: TaskReplyDocumentUncheckedUpdateManyWithoutReplyNestedInput
  }

  export type TaskReplyUncheckedUpdateManyWithoutTaskNotificationInput = {
    id?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    taskStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskReplyDocumentCreateManyReplyInput = {
    id?: string
    fileName: string
    fileUrl: string
    fileSize?: number | null
    fileType?: string | null
    createdAt?: Date | string
  }

  export type TaskReplyDocumentUpdateWithoutReplyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    fileType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskReplyDocumentUncheckedUpdateWithoutReplyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    fileType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskReplyDocumentUncheckedUpdateManyWithoutReplyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    fileType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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