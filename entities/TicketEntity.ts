import { NexusGenObjects } from "../nexus-typegen";
import { defineEntity } from "./entityHelpers";
import NetworkComponent from "./NetworkComponent";
import NFTComponent from "./NFTComponent";

const TicketEntity = defineEntity(NetworkComponent, NFTComponent, {
  __type: "Ticket",
  capability: {
    async event(): Promise<NexusGenObjects["TicketedEvent"]> {
      throw Error("No impl");
    },

    async ticketType(): Promise<NexusGenObjects["TicketType"]> {
      throw Error("No impl");
    },

    async createRedeemTransaction() {
      const api = await this.apiConnector();
      const tokenOwner = await this.tokenOwner();
      return {
        transcationData: api.tx.nft.burn(this.__localId).toHex(),
        expectedSigningAddress: tokenOwner,
      };
    },
  },
});

export default TicketEntity;
