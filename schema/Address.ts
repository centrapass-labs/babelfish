import {arg, objectType, inputObjectType, nonNull, stringArg } from "nexus";
import "../nexus-typegen";

export const TicketedEventDetailsInput = inputObjectType({
  name: "TicketedEventDetailsInput",
  description: "The details of your event.",
  definition(t) {
    t.nonNull.string("name", {
      description: "The name of the event. IE My Festival",
    });
    t.string("venue", {
      description: "The venue for the event. IE On an Island",
    });
    t.string("description", {
      description: "The description of the event. IE Fun on an Island",
    });
    t.date("dateTime", {
      description: "The date and time of the event in ISO date format.",
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
        ticketTypeId: stringArg({ description: "If supplied, filters by the specific ticket type"}),
        event: stringArg({ description: "If supplied, filters by the specific event"})
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
      resolve(parent) {
        return {
          expectedSigningAddress: { address: parent.address },
          transactionData:
            "AF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEF",
        };
      },
    });
  },
});
