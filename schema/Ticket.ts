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
import "../nexus-typegen";

export const TicketType = objectType({
  name: "TicketType",
  description: "The type of a ticket IE General Admission, VIP, etc",
  definition(t) {
    t.string("name", {
      description: "The name of this ticket type: IE 'General Admission'",
    });
    t.field("ticketedEvent", {
      description: "The event this type is asscociated with",
      type: "TicketedEvent",
    });
    t.connectionField("tickets", {
      type: "Ticket",
      description: "The tickets associated with this type.",

      totalCount() {
        return 10;
      },
      nodes() {
        return [{}];
      },
    });
  },
});

export const Ticket = objectType({
  name: "Ticket",
  description: "A ticket for an Ticketed Event",
  definition(t) {
    t.field("event", {
      type: "TicketedEvent",
    });
    t.field("ticketType", {
      type: "TicketType",
      description: "The type of a ticket IE General Admission, VIP, etc",
    });
    t.field("createTransferTranscation", {
      type: "Transcation",
      description:
        "Creates a Transcation for transfering a Ticket to another address",
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
      type: "Transcation",
      description:
        "Creates a Transcation for redeeming the ticket for an entry pass, this manifests as a burn event onchain",
      resolve(parent) {
        return {
          expectedSigningAddress: "DFDSFSDFDSFSD",
          transcationData: "AF2368954E456BC343AEF323237674432BFACEF",
        };
      },
    });
  },
});
