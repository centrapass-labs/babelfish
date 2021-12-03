import { NexusGenObjects } from "../nexus-typegen";
import { createGlobalId, defineEntity } from "./entityHelpers";
import NetworkComponent from "./NetworkComponent";
import NFTComponent from "./NFTComponent";

const TicketEntity = defineEntity(NetworkComponent, NFTComponent, {
  __type: "Ticket",
  capability: {
    async event(): Promise<NexusGenObjects["TicketedEvent"]> {
      const [collectionId, seriesId, serialNumber] = this.__localId.split("/");
      return this.load.TicketedEvent(
        createGlobalId({
          __type: "TicketedEvent",
          __network: this.__network,
          __localId: collectionId,
        })
      );
    },

    async ticketType(): Promise<NexusGenObjects["TicketType"]> {
      const [collectionId, seriesId, serialNumber] = this.__localId.split("/");
      return this.load.TicketType(
        createGlobalId({
          __type: "TicketType",
          __network: this.__network,
          __localId: `${collectionId}/${seriesId}`,
        })
      );
    },
    async createRedeemTransaction() {
      const api = await this.apiConnector();
      const tokenOwner = await this.tokenOwner();
      return this.createTransaction({
        address: tokenOwner.address,
        extrinsic: api.tx.nft.burn(this.__localId),
      });
    },
  },
});

export default TicketEntity;
