import {
  arg,
  objectType,
  inputObjectType,
  nonNull,
  stringArg,
  intArg,
} from "nexus";
import { GlobalId } from "../entities/entityHelpers";
import "../nexus-typegen";

export const Balance = objectType({
  name: "Balance",
  definition(t) {
    t.implements("Node");
    t.field("asset", {
      type: GenericAsset,
    });
    t.int("amount");
    t.field("createTransferTransaction", {
      type: "Transaction",
      description:
        "Creates a Transaction for transferring a Ticket to another address",
      args: {
        toAddress: nonNull(stringArg()),
        amount: nonNull(intArg()),
      },
      resolve(source, args, context) {
        return context.instance.load
          .Balance(source.id as GlobalId<any, "Balances">)
          .createTransferTransaction(args);
      },
    });
  },
});

export const GenericAsset = objectType({
  name: "GenericAsset",
  definition(t) {
    t.implements("Node");
    t.int("assetId");
    t.string("symbol");
    t.int("decimalPlaces");
    t.field("balance", {
      description: "Query information about a particular address.",
      args: {
        address: nonNull(stringArg()),
      },
      type: "Balance",
      resolve(source, args, context) {
        return context.instance.load
          .GenericAsset(source.id as GlobalId<any, "GenericAsset">)
          .balance(args);
      },
    });
    t.field("createMintTransaction", {
      type: "Transaction",
      description: "Creates a Transaction for minting more of the token",
      args: {
        toAddress: nonNull(stringArg()),
        amount: nonNull(intArg()),
      },
      resolve(source, args, context) {
        return context.instance.load
          .GenericAsset(source.id as GlobalId<any, "GenericAsset">)
          .createMintTransaction(args);
      },
    });
    t.field("createBurnTransaction", {
      type: "Transaction",
      description: "Creates a Transaction for minting more of the token",
      args: {
        targetAddress: nonNull(stringArg()),
        amount: nonNull(intArg()),
      },
      resolve(source, args, context) {
        return context.instance.load
          .GenericAsset(source.id as GlobalId<any, "GenericAsset">)
          .createBurnTransaction(args);
      },
    });
  },
});
