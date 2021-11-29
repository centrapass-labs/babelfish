import { createWorldInstance } from "./entityHelpers";
import NetworkEntity from "./NetworkEntity";
import TicketEntity from "./TicketEntity";
import AddressEntity from "./AddressEntity";
import TicketedEventEntity from "./TicketedEventEntity";
import TransactionEntity from "./TransactionEntity";
import TicketTypeEntity from "./TicketTypeEntity";

export function createInstance() {
  return createWorldInstance({}, [
    TicketEntity as any,
    NetworkEntity,
    AddressEntity,
    TicketedEventEntity,
    TransactionEntity,
    TicketTypeEntity,
  ]);
}
