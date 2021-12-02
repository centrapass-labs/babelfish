import { objectType, stringArg, nonNull, interfaceType, intArg } from "nexus";
import { getGlobalIdInfo, GlobalId } from "../entities/entityHelpers";
import "../nexus-typegen";

export const NFT = interfaceType({
  name: "NFT",
  resolveType({ id }) {
    const { __network, __type, __localId } = getGlobalIdInfo(
      id as GlobalId<any, any>
    );
    return __type;
  },
  definition(t) {
    t.implements("Node");
    t.string("name", {
      description: "The name of NFT",
    });
    t.string("description", {
      description: "The name of NFT",
    });
    t.string("image", {
      description: "The name of NFT",
    });
    t.json("metadata");
  },
});

export const TicketType = objectType({
  name: "TicketType",
  description: "The type of a ticket IE General Admission, VIP, etc",
  definition(t) {
    t.implements("Node");
    t.string("name", {
      description: "The name of this ticket type: IE 'General Admission'",
    });
    t.field("ticketedEvent", {
      description: "The event this type is associated with",
      type: "TicketedEvent",
    });
    t.field("createAdditionalTickets", {
      description: "Create additional tickets of an existing ticket type",
      type: "Transaction",
      args: {
        quantity: intArg(),
      },
      resolve(source, args, context) {
        return context.instance.load
          .TicketType(source.id as GlobalId<any, "TicketType">)
          .createAdditionalTickets({
            quantity: args.quantity,
          });
      },
    });
    t.connectionField("tickets", {
      type: "Ticket",
      description: "The tickets associated with this ticket type.",
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
          .TicketType(source.id as GlobalId<any, "TicketType">)
          .tickets(args);
      },
    });
  },
});

export const Ticket = objectType({
  name: "Ticket",
  description: "A ticket for an Ticketed Event",
  definition(t) {
    t.implements("NFT");
    t.field("event", {
      type: "TicketedEvent",
      resolve(source, args, context) {
        return context.instance.load
          .Ticket(source.id as GlobalId<any, "Ticket">)
          .event();
      },
    });
    t.field("owner", {
      type: "Address",
      resolve(source, args, context) {
        return context.instance.load
          .Ticket(source.id as GlobalId<any, "Ticket">)
          .tokenOwner();
      },
    });
    t.field("ticketType", {
      type: "TicketType",
      description: "The type of a ticket IE General Admission, VIP, etc",
    });
    t.field("createTransferTransaction", {
      type: "Transaction",
      description:
        "Creates a Transaction for transferring a Ticket to another address",
      args: {
        toAddress: nonNull(stringArg()),
      },
      resolve(source, args, context) {
        return context.instance.load
          .Ticket(source.id as GlobalId<any, "TickedEvent">)
          .createTransferTransaction(args);
      },
    });
    t.field("createRedeemTransaction", {
      type: "Transaction",
      description:
        "Creates a Transaction for redeeming the ticket for an entry pass, this manifests as a burn event onchain",
      resolve(source, args, context) {
        return context.instance.load
          .Ticket(source.id as GlobalId<any, "TickedEvent">)
          .burn();
      },
    });
  },
});
