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
import { join } from "path";
import "../nexus-typegen";

export const TicketedEventDetailsInput = inputObjectType({
  name: "TicketedEventDetailsInput",
  definition(t) {
    t.nonNull.string("name");
    t.string("venue", { description: "The venue for the event" });
    t.string("description", { description: "The description of the event" });
    t.date("dateTime");
  },
});

export const Address = objectType({
  name: "Address",
  definition(t) {
    t.implements("Node");
    t.id("address");
    t.connectionField("tickets", {
      type: "Ticket",
      description: "List all the Tickets held by this address.",
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
        "Creates a Transcation for signing that will create a new Event that can have tickets.",
      type: "Transcation",
      args: {
        eventDetails: nonNull(arg({ type: TicketedEventDetailsInput })),
      },
      resolve(parent) {
        return {
          expectedSigningAddress: parent.address,
          transcationData:
            "AF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEFAF2368954E456BC343AEF323237674432BFACEF",
        };
      },
    });

    // TODO: sent to
    // t.field("sentTo", {
    //   type: Amount,
    //   args: {
    //     to: idArg(),
    //     assestId: idArg(),
    //   },
    //   resolve(_parent, args) {
    //     // DEMO DATA
    //     return {
    //       number: 100,
    //       assest: {
    //         name: "Some Assest",
    //         assestId: args.assestId,
    //       },
    //     };
    //   },
    // });
  },
});
