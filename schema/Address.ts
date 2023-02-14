import {
  arg,
  objectType,
  inputObjectType,
  nonNull,
  stringArg,
  intArg,
  idArg,
} from "nexus";
import { GlobalId } from "../entities/entityHelpers";
import "../nexus-typegen";

export const TicketedEventDetailsInput = inputObjectType({
  name: "TicketedEventDetailsInput",
  description: "The details of your event.",
  definition(t) {
    t.nonNull.string("name", {
      description: "The name of the event. IE My Festival",
    });
  },
});

export const BatchedTransactionOptionInput = inputObjectType({
  name: "BatchedTransactionOptionInput",
  description:
    "The options of your batched transaction. This will return Ok in all circumstances, unless you turn on batchAll.",
  definition(t) {
    t.nonNull.list.string("ids", {
      description: "The IDs of the transactions you want to batch",
    });
    t.boolean("batchAll", {
      description:
        "The whole transaction will rollback and fail if any of the calls failed.",
    });
  },
});

export const GenericAssetsOptionInput = inputObjectType({
  name: "GenericAssetsOptionInput",
  description: "The options of your generic asset.",
  definition(t) {
    t.nonNull.int("initialIssuance", {
      description:
        "The amount to be initially issued this is in integer value, that is without the decimal place.",
    });
    t.nonNull.string("allowBurn", {
      description:
        "The address allowed to burn this token: None, Self, or the address.",
    });
    t.nonNull.string("allowMint", {
      description:
        "The address allowed to mint this token: None, Self, or the address.",
    });
    t.nonNull.string("allowUpdate", {
      description:
        "The address allowed to update this token: None, Self, or the address.",
    });
  },
});

export const GenericAssetsMetadataInput = inputObjectType({
  name: "GenericAssetsMetadataInput",
  description: "The metadata of your generic asset.",
  definition(t) {
    t.nonNull.string("symbol", {
      description: "The symbol of the assest. I.E. TEST or CENNZ or CPAY",
    });

    t.nonNull.int("decimalPlaces", {
      description:
        "Balance on chain is stored as a int, and so should all your maths on it. This is why decimal place is only ever used in the display of the token.",
    });
    t.int("existentialDeposit", {
      description: "Minimum amount to keep a balance.",
    });
  },
});

export const Address = objectType({
  name: "Address",
  description: "An address on this ledger.",
  definition(t) {
    t.implements("Node");
    t.id("address");
    t.field("balance", {
      description: "Query information about a particular address.",
      args: {
        assetId: nonNull(intArg()),
      },
      type: "Balance",
      resolve(source, args, context) {
        return context.instance.load
          .Address(source.id as GlobalId<any, "Address">)
          .balance(args);
      },
    });
    t.field("createNewGenericAsset", {
      description:
        "Creates a Transaction for signing that will create a new Generic Asset.",
      type: "Transaction",
      args: {
        options: nonNull(arg({ type: GenericAssetsOptionInput })),
        metadata: nonNull(arg({ type: GenericAssetsMetadataInput })),
      },
      resolve(source, args, context) {
        return context.instance.load
          .Address(source.id as GlobalId<any, "Address">)
          .createNewGenericAsset({
            options: args.options,
            metadata: args.metadata,
          });
      },
    });
    t.connectionField("nfts", {
      type: "NFT",
      description: "List all the Tickets held by this address.",
      additionalArgs: {
        ticketTypeId: stringArg({
          description: "If supplied, filters by the specific ticket type",
        }),
        event: stringArg({
          description: "If supplied, filters by the specific event",
        }),
      },
      totalCount() {
        throw new Error("Total count currently not supported");
        return 10;
      },
      cursorFromNode(node, args, ctx, info, { index, nodes }) {
        // @ts-ignore
        return JSON.stringify(node.tokenId);
      },
      nodes(source, args, context) {
        return context.instance.load
          .Address(source.id as GlobalId<any, "Address">)
          .nfts(args);
      },
    });
    t.connectionField("tickets", {
      type: "Ticket",
      description: "List all the Tickets held by this address.",
      additionalArgs: {
        ticketTypeId: stringArg({
          description: "If supplied, filters by the specific ticket type",
        }),
        eventId: stringArg({
          description: "If supplied, filters by the specific event",
        }),
      },
      totalCount() {
        throw new Error("Total count currently not supported");
        return 10;
      },
      cursorFromNode(node, args, ctx, info, { index, nodes }) {
        // @ts-ignore
        return JSON.stringify(node.tokenId);
      },
      nodes(source, args, context) {
        return context.instance.load
          .Address(source.id as GlobalId<any, "Address">)
          .nfts({ ...args, filterType: "Ticket" });
      },
    });
    t.connectionField("ticketStubs", {
      type: "TicketStub",
      description: "List all the Ticket Stubs held by this address.",
      totalCount() {
        throw new Error("Total count currently not supported");
        return 10;
      },
      cursorFromNode(node, args, ctx, info, { index, nodes }) {
        // @ts-ignore
        return JSON.stringify(node.tokenId);
      },
      nodes(source, args, context) {
        return context.instance.load
          .Address(source.id as GlobalId<any, "Address">)
          .nfts({ ...args, filterType: "TicketStub" });
      },
    });
    t.field("createTicketedEvent", {
      description:
        "Creates a Transaction for signing that will create a new Event that can have tickets.",
      type: "Transaction",
      args: {
        eventDetails: nonNull(arg({ type: TicketedEventDetailsInput })),
      },
      resolve(source, args, context) {
        return context.instance.load
          .Address(source.id as GlobalId<any, "Address">)
          .createTicketedEvent({ name: args.eventDetails.name });
      },
    });
    t.field("createBatchedTransaction", {
      description:
        "Creates a Transaction for signing that will create a new Event that can have tickets.",
      type: "Transaction",
      args: {
        transactionDetails: nonNull(BatchedTransactionOptionInput),
      },
      resolve(source, args, context) {
        return context.instance.load
          .Address(source.id as GlobalId<any, "Address">)
          .createBatchedTransaction(args.transactionDetails);
      },
    });
    t.field("createGenericNFTCollection", {
      description:
        "Creates a Transaction for signing that will create a new collection that has NFTs",
      type: "Transaction",
      args: {
        name: nonNull(stringArg()),
      },
      resolve(source, args, context) {
        return context.instance.load
          .Address(source.id as GlobalId<any, "Address">)
          .createGenericNFTCollection({ name: args.name });
      },
    });
  },
});
