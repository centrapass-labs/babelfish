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
  definition(t) {
    t.string("name");
    t.string("venue");
    t.string("description");
    t.date("dateTime");
    t.field("ticketTypes", {
      type: list("TicketType"),
    });
    t.connectionField("tickets", {
      type: "Ticket",
      totalCount() {
        return 10;
      },
      nodes() {
        return [{}];
      },
    });
    t.connectionField("ticketStubs", {
      type: "TicketStub",
      totalCount() {
        return 10;
      },
      nodes() {
        return [{}];
      },
    });
    t.field("createNewTicketType", {
      type: "Transcation",
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
      type: "Transcation",
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
