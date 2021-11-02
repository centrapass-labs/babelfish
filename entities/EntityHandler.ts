import { createWorldInstance } from "./entityHelpers";
import NetworkEntity from "./NetworkEntity";
import TicketEntity from "./TicketEntity";

export function createInstance() {
  return createWorldInstance({}, [TicketEntity, NetworkEntity]);
}
