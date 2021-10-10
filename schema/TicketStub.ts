import { objectType } from "nexus";
import "../nexus-typegen";

export const TicketStub = objectType({
  name: "TicketStub",
  description: "A momento for attending the event",
  definition(t) {
    t.string("name");
    t.field("event", {
      description: "The event this ticket was redeemed for.",
      type: "TicketedEvent",
    });
    t.field("originalTicket", {
      type: "Ticket",
      description: "The original ticket information.",
    });
  },
});
