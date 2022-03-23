import {
  arg,
  intArg,
  objectType,
  stringArg,
  list,
  inputObjectType,
  nonNull,
} from "nexus";
import { GlobalId } from "../entities/entityHelpers";
import "../nexus-typegen";

export const GenericNFTCollection = objectType({
  name: "GenericNFTCollection",
  description: "A collection of Generic NFTs",
  definition(t) {
    t.implements("Node");
    t.string("name", { description: "The name of the collection." });

    t.field("ticketTypes", {
      description: "The different types of tickets",
      type: list("TicketType"),
      resolve(source, args, context) {
        return context.instance.load
          .TicketedEvent(source.id as GlobalId<any, "TickedEvent">)
          .ticketTypes();
      },
    });

    t.field("createUniqueNFT", {
      description: "Create a new Unique NFT",
      type: "Transaction",
      args: {
        attributes: arg({
          type: "JSON",
        }),
        metadata: nonNull(
          arg({
            type: "JSON",
          })
        ),
      },
      resolve(source, args, context) {
        return context.instance.load
          .GenericNFTCollection(
            source.id as GlobalId<any, "GenericNFTCollection">
          )
          .mintSeries({
            metadata: args.metadata,
            attributes: args.attributes,
            quantity: 1,
          });
      },
    });
  },
});

export const GenericNFT = objectType({
  name: "GenericNFT",
  description: "A Generic NFT",
  definition(t) {
    t.implements("NFT");
    t.field("owner", {
      type: "Address",
      resolve(source, args, context) {
        return context.instance.load
          .GenericNFT(source.id as GlobalId<any, "GenericNFT">)
          .tokenOwner();
      },
    });

    t.field("createTransferTransaction", {
      type: "Transaction",
      description:
        "Creates a Transaction for transferring a NFT to another address",
      args: {
        toAddress: nonNull(stringArg()),
      },
      resolve(source, args, context) {
        return context.instance.load
          .GenericNFT(source.id as GlobalId<any, "GenericNFT">)
          .createTransferTransaction(args);
      },
    });
  },
});
