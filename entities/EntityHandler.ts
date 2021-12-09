import { createWorldInstance } from "./entityHelpers";
import NetworkEntity from "./NetworkEntity";
import TicketEntity from "./TicketEntity";
import AddressEntity from "./AddressEntity";
import TicketedEventEntity from "./TicketedEventEntity";
import TransactionEntity from "./TransactionEntity";
import TicketTypeEntity from "./TicketTypeEntity";
import GenericNFTCollectionEntity from "./GenericNFTCollectionEntity";
import GenericNFTEntity from "./GenericNFTEntity";

export function createInstance() {
  return createWorldInstance({}, [
    TicketEntity as any,
    NetworkEntity,
    AddressEntity,
    TicketedEventEntity,
    TransactionEntity,
    TicketTypeEntity,
    GenericNFTCollectionEntity,
    GenericNFTEntity,
  ]);
}
