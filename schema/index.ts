import {
  arg,
  enumType,
  intArg,
  interfaceType,
  makeSchema,
  objectType,
  queryType,
  stringArg,
  list,
  inputObjectType,
  idArg,
  nonNull,
  connectionPlugin,
  asNexusMethod,
  extendType,
} from "nexus";
import { join } from "path";
import "../nexus-typegen";

import * as TicketStub from "./TicketStub";
import * as TicketedEvent from "./TicketedEvent";
import * as Ticket from "./Ticket";
import * as Address from "./Address";

import { GraphQLDate } from "graphql-iso-date";

/*
TODO: 
Add more fields on everything to bring it up to par with google/apple/general industry specs
Add more fields
remove some abgeuitity from the names
fix some spelling
touch up the mock data to make it more realisitic.
*/

const GQLDate = asNexusMethod(GraphQLDate, "date");

const Node = interfaceType({
  name: "Node",
  resolveType() {
    return "Address";
  },
  definition(t) {
    t.id("id", { description: "Unique identifier for the resource" });
  },
});

// const Assest = objectType({
//   name: "Assest",
//   definition(t) {
//     t.string("name");
//     t.id("assestId");
//   },
// });

// const Amount = objectType({
//   name: "Amount",
//   definition(t) {
//     t.int("number");
//     t.field("assest", {
//       type: Assest,
//     });
//   },
// });

const TranscationResult = objectType({
  name: "TranscationResult",
  definition(t) {
    t.string("status", {
      resolve: () => "Success",
    });
    t.field("result", { type: Node });
  },
});

const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("submitTranscation", {
      description: "Used to submit a transcation to the blockchain",
      type: TranscationResult,
      args: {
        transcationData: stringArg(),
        signature: stringArg(),
      },
      resolve(_root, args, ctx) {
        return {};
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
  members: ["CENNZnet:Nikau"],
});

const Transcation = objectType({
  name: "Transcation",
  definition(t) {
    t.string("transcationData", {
      description: "The transcation data hex encoded.",
    });
    t.field("expectedSigningAddress", {
      type: "Address",
      description:
        "The address we except the transcation to be signed with to get the desired results.",
    });
  },
});

const Network = objectType({
  name: "Network",
  description: "A Network/Ledger",
  definition(t) {
    t.string("name");
    t.field("address", {
      type: "Address",
      description: "Query infomation about a particular address.",
      args: {
        address: nonNull(stringArg()),
      },
      resolve(parent, args) {
        return {
          address: args.address,
        };
      },
    });
    t.field("event", {
      args: {
        id: nonNull(stringArg()),
      },
      description: "Get an event via its id.",
      type: "TicketedEvent",
      resolve() {
        return {
          name: "My Awesome Festival",
        };
      },
    });
    t.connectionField("nodes", {
      type: CENNZNode,
      description: "Get the nodes in the network.",
      totalCount() {
        // DEMO DATA
        return 42;
      },
      nodes() {
        return [{}];
      },
    });
  },
});

const Query = queryType({
  definition(t) {
    t.field("network", {
      type: Network,
      args: {
        network: arg({
          type: nonNull(NetworkEnum),
        }),
      },
      resolve() {
        return {
          name: "Nikau",
        };
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
    Mutation,
    TicketStub,
    TicketedEvent,
    Ticket,
    Transcation,
    Address,
  ],
  plugins: [
    connectionPlugin({
      extendConnection: {
        totalCount: { type: "Int" },
      },
    }),
  ],
  outputs: __dirname
    ? {
        typegen: join(__dirname, "..", "nexus-typegen.ts"),
        schema: join(__dirname, "..", "schema.graphql"),
      }
    : {},
  // or types: { Account, Node, Query }
  // or types: [Account, [Node], { Query }]
});
