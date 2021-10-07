import { objectType } from "nexus";
import "../nexus-typegen";

export const TicketStub = objectType({
  name: "TicketStub",
  description: "A momento for attending the event",
  definition(t) {
    t.string("name");
    t.field("event", {
      description: "The event",
      type: "TicketedEvent",
    });
    t.field("orginalTicket", {
      type: "Ticket",
      description: "The orignal ticket infomation",
    });
  },
});
