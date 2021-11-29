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

export const TicketTypeInput = inputObjectType({
  name: "TicketTypeInput",
  definition(t) {
    t.nonNull.string("name");
    t.string("fineprint");
    t.string("image");
    t.string("description");
    t.string("venue", {
      description: "The venue for the event. IE On an Island",
    });
    t.dateTime("dateTime", {
      description: "The date and time of the event in ISO date format.",
    });
  },
});

export const TicketedEvent = objectType({
  name: "TicketedEvent",
  description: "An Event with Ticketed access.",
  definition(t) {
    t.implements("Node");
    t.string("name", { description: "The name of the the ticketed event." });

    t.field("ticketTypes", {
      description: "The different types of tickets",
      type: list("TicketType"),
      resolve(source, args, context) {
        return context.instance.load
          .TicketedEvent(source.id as GlobalId<any, "TickedEvent">)
          .ticketTypes();
      },
    });
    t.connectionField("tickets", {
      type: "Ticket",
      description: "All the tickets",
      additionalArgs: {
        ticketTypeId: stringArg({
          description: "If supplied, filters by the specific ticket type",
        }),
        address: stringArg({
          description: "If supplied, filters by the specified address",
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
      nodes(source, { ticketTypeId, address }, context) {
        return context.instance.load
          .TicketedEvent(source.id as GlobalId<any, "TickedEvent">)
          .tickets({
            ticketTypeId,
            address,
          });
      },
    });
    t.connectionField("ticketStubs", {
      description: "All the stubs generated from redeeming tickets",
      type: "TicketStub",
      totalCount() {
        return 10;
      },
      nodes() {
        return [{}];
      },
    });
    t.field("createNewTicketType", {
      description: "Create a new Ticket Type IE VIP",
      type: "Transaction",
      args: {
        quantity: nonNull(intArg()),
        ticketType: nonNull(
          arg({
            type: TicketTypeInput,
          })
        ),
      },
      resolve(source, args, context) {
        return context.instance.load
          .TicketedEvent(source.id as GlobalId<any, "TickedEvent">)
          .createNewTicketType({
            name: args.ticketType.name,
            description: args.ticketType.description,
            quantity: args.quantity,
            venue: args.ticketType.venue,
            fineprint: args.ticketType.fineprint,
            dateTime: args.ticketType.dateTime,
            image: args.ticketType.image,
          });
      },
    });

    t.field("createAdditionalTickets", {
      description: "Create additional tickets of an existing ticket type",
      type: "Transaction",
      args: {
        quantity: intArg(),
        ticketTypeId: stringArg(),
      },
      resolve(source, args, context) {
        return context.instance.load
          .TicketedEvent(source.id as GlobalId<any, "TickedEvent">)
          .createAdditionalTickets({
            ticketTypeId: args.ticketTypeId,
            quantity: args.quantity,
          });
      },
    });
  },
});
