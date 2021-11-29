import { enumType } from "nexus";
import { NexusGenEnums } from "../nexus-typegen";

declare const globalIdSymbol: unique symbol;
declare const globalIdNetworkSymbol: unique symbol;

export type GlobalId<
  N extends NexusGenEnums["NetworkEnum"],
  T extends string
> = string & { [globalIdSymbol]: T; [globalIdNetworkSymbol]: N };

type GlobalIdInfo<N extends NexusGenEnums["NetworkEnum"], T extends string> = {
  __network: N;
  __type: T;
  __localId: string;
};

export function createGlobalId<
  N extends NexusGenEnums["NetworkEnum"],
  T extends string
>(i: GlobalIdInfo<N, T>): GlobalId<N, T> {
  return Buffer.from(`${i.__network}:${i.__type}:${i.__localId}`).toString(
    "base64"
  ) as any;
}

export function getGlobalIdInfo<
  N extends NexusGenEnums["NetworkEnum"],
  T extends string
>(
  i: GlobalId<N, T>
): {
  __network: N;
  __type: T;
  __localId: string;
} {
  const [__network, __type, __localId] = Buffer.from(i, "base64url")
    .toString("utf8")
    .split(":");
  return {
    __network,
    __type,
    __localId,
  } as any;
}

type ThisContext<
  N extends NexusGenEnums["NetworkEnum"],
  T extends string
> = GlobalIdInfo<N, T> & {
  __globalId: string;
  load: { [key: string]: (id: string) => any };
};

type Cap<
  N extends NexusGenEnums["NetworkEnum"],
  T extends string,
  TC extends {}
> = {
  [key: string]: (this: ThisContext<N, T> & TC, ...args: any) => Promise<any>;
};

type Capability = {
  [key: string]: (...args: any) => Promise<any>;
};

type DefinedComponent<REQ extends Capability, CAP extends Capability> = {
  __component: string;
  cacheKey?: (this: ThisContext<NexusGenEnums["NetworkEnum"], any>) => string;
  capability: {
    [C in keyof CAP]: (
      this: CAP & ThisContext<NexusGenEnums["NetworkEnum"], any> & REQ,
      ...args: Parameters<CAP[C]>
    ) => ReturnType<CAP[C]>;
  };
};

type AnonymousComponent<N extends string, TC extends {}> = {
  __type: N;
  capability: Cap<NexusGenEnums["NetworkEnum"], N, TC>;
};

type Component<N extends string, TC extends {}> =
  | DefinedComponent<TC, any>
  | AnonymousComponent<N, TC>;

type Entity<N extends string, TC extends {}> = DefinedComponent<TC, any> &
  AnonymousComponent<N, TC>;

export function defineEntity<N extends string, A extends Component<N, {}>>(
  a: A
): A;
export function defineEntity<
  N extends string,
  A extends Component<N, {}>,
  B extends AnonymousComponent<N, A["capability"]>
>(a: A, b: B): A & B;
export function defineEntity<
  N extends string,
  A extends Component<N, {}>,
  B extends Component<N, A["capability"]>,
  C extends AnonymousComponent<N, A["capability"] & B["capability"]>
>(a: A, b: B, c: C): A & B & C;
export function defineEntity<C extends any[]>(...cap: C): any {
  return cap.reduce(
    (ent, comp) => ({
      ...ent,
      ...comp,
      capability: {
        ...ent.capability,
        ...comp.capability,
      },
      cacheKey: null,
      __component: null,
    }),
    {}
  );
}

export function defineComponent<
  REQ extends { [key: string]: (...args: any) => any },
  CAP extends {
    [key: string]: (...args: any) => any;
  }
>(def: DefinedComponent<REQ, CAP>): DefinedComponent<REQ, CAP> {
  return def;
}

// type OnlyEntityName<T> = T extends EntityName ? T : never;
// type EntityAllName<T> = T extends EntityName ? T : EntityName;

type Exp<T extends string, C extends Cap<any, any, any>> = {
  [K in keyof C]: (...args: Parameters<C[K]>) => ReturnType<C[K]>;
};

type ExposedEntity<T extends string, C extends Cap<any, any, any>> = Exp<
  T,
  C
> & {
  __type: T;
};

type FindType<
  L extends Component<any, any>[],
  T extends string
> = L[number] extends { __type: T } ? L[number]["capability"] : never;

type FindAllTypes<L extends Component<any, any>[]> = L[number] extends {
  __type: string;
}
  ? L[number]["__type"]
  : never;

export function createWorldInstance<E extends Entity<any, any>[]>(
  persistentCache: Object,
  entities: E
): {
  loadEntity: <Y extends FindAllTypes<E>>(
    id: GlobalId<any, Y>
  ) => ExposedEntity<Y, FindType<E, Y>>;
  load: {
    [K in FindAllTypes<E>]: (
      id: GlobalId<any, K>
    ) => ExposedEntity<K, FindType<E, K>>;
  };
} {
  const load: {
    [key: string]: (id: GlobalId<any, any>) => ExposedEntity<any, any>;
  } = {};
  entities.forEach((entity) => {
    load[entity.__type] = (id: GlobalId<any, any>) => {
      const { __type, __localId, __network } = getGlobalIdInfo(id);

      if (__type !== entity.__type) {
        throw Error(
          "This global ID is of the wrong type -- " +
            __type +
            " -- " +
            entity.__type +
            " -- " +
            id
        );
      }
      const entityInstance = {
        id,
        __type,
        __localId,
        __network,
        __globalId: id,
        load,
      } as any;
      Object.entries(entity.capability).forEach(([key, value]) => {
        entityInstance[key] = (...args: any[]) =>
          value.bind(entityInstance)(...args);
      });

      return entityInstance;
    };
  });

  return {
    load,
    loadEntity: (id: GlobalId<any, any>) => {
      const { __type } = getGlobalIdInfo(id);
      return load[__type](id);
    },
  } as any;
}
