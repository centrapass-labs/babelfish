import { createWorldInstance } from "./entityHelpers";
import NetworkEntity from "./NetworkEntity";
import TicketEntity from "./TicketEntity";
import AddressEntity from "./AddressEntity";

export function createInstance() {
  return createWorldInstance({}, [
    TicketEntity as any,
    NetworkEntity,
    AddressEntity,
  ]);
}
