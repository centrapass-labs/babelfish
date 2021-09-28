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

import { GraphQLDate } from "graphql-iso-date";

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

const Assest = objectType({
  name: "Assest",
  definition(t) {
    t.string("name");
    t.id("assestId");
  },
});

const Amount = objectType({
  name: "Amount",
  definition(t) {
    t.int("number");
    t.field("assest", {
      type: Assest,
    });
  },
});

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

const TicketStub = objectType({
  name: "TicketStub",
  definition(t) {
    t.string("name");
  },
});

const TicketType = objectType({
  name: "TicketType",
  definition(t) {
    t.string("name");
    t.field("event", {
      type: TicketedEvent,
    });
    t.connectionField("tickets", {
      type: Ticket,
      totalCount() {
        return 10;
      },
      nodes() {
        return [{}];
      },
    });
  },
});

const Ticket = objectType({
  name: "Ticket",
  definition(t) {
    t.field("event", {
      type: TicketedEvent,
    });
    t.field("ticketType", {
      type: TicketType,
    });
    t.field("createTransferTranscation", {
      type: Transcation,
      args: {
        toAddress: nonNull(stringArg()),
      },
      resolve(parent) {
        return {
          expectedSigningAddress: "DFDSFSDFDSFSD",
          transcationData: "AF2368954E456BC343AEF323237674432BFACEF",
        };
      },
    });
    t.field("createRedeemTranscation", {
      type: Transcation,

      resolve(parent) {
        return {
          expectedSigningAddress: "DFDSFSDFDSFSD",
          transcationData: "AF2368954E456BC343AEF323237674432BFACEF",
        };
      },
    });
  },
});

const EventDetailsInput = inputObjectType({
  name: "EventDetailsInput",
  definition(t) {
    t.nonNull.string("name");
    t.string("venue");
    t.string("description");
    t.date("dateTime");
  },
});

const Address = objectType({
  name: "Address",
  definition(t) {
    t.implements(Node);
    t.id("address");
    t.connectionField("tickets", {
      type: Ticket,
      totalCount() {
        return 10;
      },
      nodes() {
        return [{}];
      },
    });
    t.connectionField("ticketStubs", {
      type: TicketStub,
      totalCount() {
        return 10;
      },
      nodes() {
        return [{}];
      },
    });
    t.field("createEvent", {
      type: Transcation,
      args: {
        eventDetails: nonNull(arg({ type: EventDetailsInput })),
      },
      resolve(parent) {
        return {
          expectedSigningAddress: parent.address,
          transcationData: "AF2368954E456BC343AEF323237674432BFACEF",
        };
      },
    });

    t.field("sentTo", {
      type: Amount,
      args: {
        to: idArg(),
        assestId: idArg(),
      },
      resolve(_parent, args) {
        // DEMO DATA
        return {
          number: 100,
          assest: {
            name: "Some Assest",
            assestId: args.assestId,
          },
        };
      },
    });
  },
});

const CENNZNode = objectType({
  name: "CENNZNode",
  definition(t) {
    t.nullable.string("name");
  },
});

const NetworkEnum = enumType({
  name: "NetworkEnum",
  members: ["Nikau"],
});

const Transcation = objectType({
  name: "Transcation",
  definition(t) {
    t.string("transcationData");
    t.string("expectedSigningAddress");
  },
});

const TicketTypeInput = inputObjectType({
  name: "TicketTypeInput",
  definition(t) {
    t.nonNull.string("name");
    t.string("fineprint");
    t.string("description");
  },
});

const TicketedEvent = objectType({
  name: "Event",
  definition(t) {
    t.string("name");
    t.string("venue");
    t.string("description");
    t.date("dateTime");
    t.field("ticketTypes", {
      type: list(TicketType),
    });
    t.connectionField("tickets", {
      type: Ticket,
      totalCount() {
        return 10;
      },
      nodes() {
        return [{}];
      },
    });
    t.connectionField("ticketStubs", {
      type: TicketStub,
      totalCount() {
        return 10;
      },
      nodes() {
        return [{}];
      },
    });
    t.field("createNewTicketType", {
      type: Transcation,
      args: {
        quantity: intArg(),
        ticketType: arg({
          type: TicketTypeInput,
        }),
      },
      resolve(parent) {
        return {
          expectedSigningAddress:
            "5ENzTzH49uZKgYAD1Aa8zCpSfpcub2NkpBewoQgpDa6xkrif",
          transcationData: "AF2368954E456BC343AEF323237674432BFACEF",
        };
      },
    });

    t.field("createAdditionalTickets", {
      type: Transcation,
      args: {
        quantity: intArg(),
        ticketTypeId: stringArg(),
      },
      resolve(parent) {
        return {
          expectedSigningAddress:
            "5ENzTzH49uZKgYAD1Aa8zCpSfpcub2NkpBewoQgpDa6xkrif",
          transcationData: "AF2368954E456BC343AEF323237674432BFACEF",
        };
      },
    });
  },
});

const Network = objectType({
  name: "Network",
  definition(t) {
    t.string("name");
    t.field("address", {
      type: Address,
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
      type: TicketedEvent,
      resolve() {
        return {
          name: "My Awesome Festival",
        };
      },
    });
    t.connectionField("nodes", {
      type: CENNZNode,

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
  types: [Node, Query, GQLDate, Mutation],
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