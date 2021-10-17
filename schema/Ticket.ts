import { objectType, stringArg, nonNull } from "nexus";
import "../nexus-typegen";

export const TicketType = objectType({
  name: "TicketType",
  description: "The type of a ticket IE General Admission, VIP, etc",
  definition(t) {
    t.id("ticketTypeId");
    t.string("name", {
      description: "The name of this ticket type: IE 'General Admission'",
    });
    t.field("ticketedEvent", {
      description: "The event this type is associated with",
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
    t.field("createTransferTransaction", {
      type: "Transaction",
      description:
        "Creates a Transaction for transferring a Ticket to another address",
      args: {
        toAddress: nonNull(stringArg()),
      },
      resolve(parent) {
        return {
          expectedSigningAddress: { address: "DFDSFSDFDSFSD" },
          transactionData:
            "AF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEF",
        };
      },
    });
    t.field("createRedeemTransaction", {
      type: "Transaction",
      description:
        "Creates a Transaction for redeeming the ticket for an entry pass, this manifests as a burn event onchain",
      resolve(parent) {
        return {
          expectedSigningAddress: { address: "DFDSFSDFDSFSD" },
          transactionData:
            "AF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEF",
        };
      },
    });
  },
});
