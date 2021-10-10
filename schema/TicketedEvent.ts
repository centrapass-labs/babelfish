import {
  arg,
  intArg,
  objectType,
  stringArg,
  list,
  inputObjectType,
} from "nexus";
import "../nexus-typegen";

export const TicketTypeInput = inputObjectType({
  name: "TicketTypeInput",
  definition(t) {
    t.nonNull.string("name");
    t.string("fineprint");
    t.string("description");
  },
});

export const TicketedEvent = objectType({
  name: "TicketedEvent",
  description: "An Event with Ticketed access.",
  definition(t) {
    t.string("name", { description: "The name of the the ticketed event." });
    t.string("venue", { description: "The Venue of the ticket event." });
    t.string("description", {
      description: "The description of the ticketed event.",
    });
    t.date("dateTime", { description: "When the event is." });
    t.field("ticketTypes", {
      description: "The different types of tickets",
      type: list("TicketType"),
    });
    t.connectionField("tickets", {
      type: "Ticket",
      description: "All the tickets",
      totalCount() {
        return 10;
      },
      nodes() {
        return [{}];
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
        quantity: intArg(),
        ticketType: arg({
          type: TicketTypeInput,
        }),
      },
      resolve(parent) {
        return {
          expectedSigningAddress: {
            address: "5ENzTzH49uZKgYAD1Aa8zCpSfpcub2NkpBewoQgpDa6xkrif",
          },
          transactionData:
            "AF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEF",
        };
      },
    });

    t.field("createAdditionalTickets", {
      description: "Create additional tickets of an existing ticket type",
      type: "Transaction",
      args: {
        quantity: intArg(),
        ticketTypeId: stringArg(),
      },
      resolve(parent) {
        return {
          expectedSigningAddress: {
            address: "5ENzTzH49uZKgYAD1Aa8zCpSfpcub2NkpBewoQgpDa6xkrif",
          },
          transactionData:
            "AF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEF",
        };
      },
    });
  },
});
