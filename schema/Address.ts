import { arg, objectType, inputObjectType, nonNull, stringArg } from "nexus";
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

export const Address = objectType({
  name: "Address",
  description: "An address on this ledger.",
  definition(t) {
    t.implements("Node");
    t.id("address");
    t.connectionField("tickets", {
      type: "Ticket",
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
        return 10;
      },
      nodes() {
        return [{}];
      },
    });
    t.connectionField("ticketStubs", {
      type: "TicketStub",
      description: "List all the Ticket Stubs held by this address.",
      totalCount() {
        return 10;
      },
      nodes() {
        return [{}];
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
  },
});
