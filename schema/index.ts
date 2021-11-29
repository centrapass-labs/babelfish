import {
  arg,
  enumType,
  interfaceType,
  makeSchema,
  objectType,
  queryType,
  stringArg,
  nonNull,
  connectionPlugin,
  asNexusMethod,
  extendType,
  idArg,
} from "nexus";
import { join } from "path";
import "../nexus-typegen";

import * as TicketStub from "./TicketStub";
import * as TicketedEvent from "./TicketedEvent";
import * as Ticket from "./Ticket";
import * as Address from "./Address";

import { GraphQLDate, GraphQLDateTime } from "graphql-iso-date";
import {
  createGlobalId,
  getGlobalIdInfo,
  GlobalId,
} from "../entities/entityHelpers";
import { Text } from "@polkadot/types";
import { GraphQLScalarType } from "graphql";

/*
TODO: 
Add more fields on everything to bring it up to par with google/apple/general industry specs
Add more fields
remove some abgeuitity from the names
fix some spelling
touch up the mock data to make it more realisitic.
*/

const JSONScalar = new GraphQLScalarType({
  name: "JSON",

  serialize: (data: any) => data,
  parseValue: (data: any) => data,
});

const GQLDate = asNexusMethod(GraphQLDate, "date");
const GQLJSON = asNexusMethod(JSONScalar, "json");
const GQLDateTime = asNexusMethod(GraphQLDateTime, "dateTime");

const Node = interfaceType({
  name: "Node",
  resolveType({ id }) {
    const { __network, __type, __localId } = getGlobalIdInfo(
      id as GlobalId<any, any>
    );
    return __type;
  },
  definition(t) {
    t.id("id", { description: "Unique identifier for the resource" });
  },
});

const TransactionResult = objectType({
  name: "TransactionResult",
  definition(t) {
    t.string("status");
    t.field("result", { type: Node });
  },
});

async function getTranscation(__network: string, hash: string, loop: boolean) {
  const UnCoverEndpoint =
    __network == "CENNZnet_Nikau"
      ? "https://service.eks.centrality.me/"
      : "https://service.eks.centralityapp.com/";

  while (loop) {
    // TODO: this may never end, yikes.
    const Hey = await fetch(
      UnCoverEndpoint + "cennznet-explorer-api/api/scan/extrinsic",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          hash,
        }),
        method: "POST",
      }
    );
    const res = await Hey.json();
    if (res.message !== "Not Found") {
      return res;
    }
  }
  return null;
}

const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("submitTransaction", {
      description: "Used to submit a transaction to the blockchain",
      type: TransactionResult,
      args: {
        transactionId: nonNull(idArg()),
        signature: stringArg(),
      },
      async resolve(_root, args, { instance }) {
        const { __network, __type, __localId } = getGlobalIdInfo(
          args.transactionId as GlobalId<any, any>
        );

        if (__type !== "Transaction") {
          throw new Error("Transaction ID isn't a Transaction ID");
        }

        const api = await instance.load
          .Network(
            createGlobalId({
              __localId: "",
              __network,
              __type: "Network",
            })
          )
          .apiConnector();

        if (!args.transactionId) {
          throw new Error("");
        }

        const signerPayload = api.registry.createType(
          "SignerPayload",
          Buffer.from(
            args.transactionId.replace(
              Buffer.from(`${__network}:Transaction:${__localId}:`).toString(
                "base64url"
              ),

              ""
            ),
            "base64url"
          ),
          { version: api.extrinsicVersion }
        );

        const extrinsic = api.registry.createType(
          "Extrinsic",
          { method: signerPayload.method },
          { version: api.extrinsicVersion }
        );

        extrinsic.addSignature(
          signerPayload.address,
          args.signature,
          signerPayload.toPayload()
        );

        function handleSomething(fnd: any) {
          return new Promise((resolve, reject) => {
            if (!fnd.data.success) {
              reject(
                new Error(
                  JSON.stringify(
                    JSON.parse(
                      fnd.data.event.find(
                        ({ event_id }: any) => event_id === "ExtrinsicFailed"
                      ).params
                    )
                  )
                )
              );
            }

            if (__localId === "TicketedEvent") {
              const [
                { value: collectionId },
                { value: collectionName },
                { value: collectionOwner },
              ] = JSON.parse(
                fnd.data.event.find(
                  ({ event_id }: any) => event_id === "CreateCollection"
                ).params
              );

              resolve({
                status: `${JSON.stringify({
                  collectionId,
                  collectionName: new Text(api.registry, collectionName),
                  collectionOwner,
                })}`,
                result: {
                  id: createGlobalId({
                    __network,
                    __type: __localId,
                    __localId: collectionId,
                  }),
                },
              });
            } else {
              resolve({
                status: `${JSON.stringify(fnd.data.event)}`,
              });
            }
          });
        }
        const found = await getTranscation(
          __network,
          extrinsic.hash.toHex(),
          false
        );

        if (found) {
          return handleSomething(found);
        }

        return Promise.race([
          new Promise((resolve, reject) => {
            api.rpc.author.submitAndWatchExtrinsic(
              extrinsic,
              async (result: any) => {
                const done =
                  result.toHuman().InBlock || result.toHuman().Finalized;
                if (done) {
                  if (
                    __network !== "CENNZnet_Azalea" &&
                    __network !== "CENNZnet_Nikau"
                  ) {
                    return reject(`${__network} not supported for this`);
                  }

                  const found = await getTranscation(
                    __network,
                    extrinsic.hash.toHex(),
                    true
                  );
                  handleSomething(found).then(resolve).catch(reject);
                }
              }
            );
          }),
          new Promise((cb) =>
            setTimeout(() => cb({ status: "pending", result: null }), 15000)
          ),
        ]) as any;
      },
    });
  },
});

const CENNZNode = objectType({
  name: "CENNZnetNode",
  description: "A CENNZnet Node",
  definition(t) {
    t.nullable.string("name");
  },
});

const NetworkEnum = enumType({
  name: "NetworkEnum",
  description: "The different Ledgers BabelFish can connect to",
  members: ["CENNZnet_Azalea", "CENNZnet_Nikau", "Mock", "CENNZnet_Rata"],
});

const Transaction = objectType({
  name: "Transaction",
  definition(t) {
    t.implements("Node");
    t.string("signerPayload", {
      description: "The transaction data hex encoded.",
    });
    t.field("result", { type: Node });
    t.string("status");
    t.field("expectedSigningAddress", {
      type: "Address",
      description:
        "The address we except the transaction to be signed with to get the desired results.",
    });
  },
});

const Health = objectType({
  name: "Health",
  description: "Check the health status of Babelfish",
  definition(t) {
    t.string("status");
  },
});

const Network = objectType({
  name: "Network",
  description: "A Network/Ledger",
  definition(t) {
    t.implements(Node);
    t.string("name");
    t.field("address", {
      type: "Address",
      description: "Query information about a particular address.",
      args: {
        address: nonNull(stringArg()),
      },
      resolve(parent, args, { instance }) {
        const { __network } = getGlobalIdInfo(
          parent.id as GlobalId<any, "Network">
        );
        return instance.load.Address(
          createGlobalId({
            __localId: args.address,
            __network: __network,
            __type: "Address",
          })
        ) as any;
      },
    });
    // t.field("ticketedEvent", {
    //   args: {
    //     id: nonNull(stringArg()),
    //   },
    //   description: "Get a ticketed event via its id.",
    //   type: "TicketedEvent",
    //   resolve() {
    //     return {
    //       name: "My Awesome Festival",
    //     };
    //   },
    // });
    // t.connectionField("nodes", {
    //   type: CENNZNode,
    //   description: "Get the nodes in the network.",
    //   totalCount() {
    //     throw new
    //     return 42;
    //   },
    //   nodes() {
    //     return [{}];
    //   },
    // });
  },
});

const Query = queryType({
  definition(t) {
    t.field("health", {
      type: Health,
      resolve() {
        return {
          status: "OK",
        };
      },
    });
    t.field("node", {
      type: Node,
      args: {
        id: idArg(),
      },
      resolve(_, args, { instance }) {
        return instance.loadEntity(args.id as GlobalId<any, any>) as any;
      },
    });
    t.field("network", {
      type: Network,
      args: {
        network: arg({
          type: nonNull(NetworkEnum),
        }),
      },
      resolve(_, args, { instance }) {
        return instance.load.Network(
          createGlobalId({
            __localId: "",
            __network: args.network,
            __type: "Network",
          })
        ) as any;
      },
    });
  },
});

// Recursively traverses the value passed to types looking for
// any valid Nexus or graphql-js objects to add to the schema,
// so you can be pretty flexible with how you import types here.
export default makeSchema({
  types: [
    Node,
    Query,
    GQLDate,
    GQLJSON,
    GQLDateTime,
    Mutation,
    TicketStub,
    TicketedEvent,
    Ticket,
    Transaction,
    Address,
  ],
  plugins: [
    connectionPlugin({
      extendConnection: {
        totalCount: { type: "Int" },
      },
    }),
  ],
  contextType: __dirname
    ? {
        module: require.resolve("./context"),
        export: "Context",
      }
    : undefined,
  outputs: __dirname
    ? {
        typegen: join(__dirname, "..", "nexus-typegen.ts"),
        schema: join(__dirname, "..", "schema.graphql"),
      }
    : {},
  // or types: { Account, Node, Query }
  // or types: [Account, [Node], { Query }]
});
