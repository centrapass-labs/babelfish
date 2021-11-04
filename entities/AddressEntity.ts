import { defineEntity } from "./entityHelpers";
import NetworkComponent from "./NetworkComponent";

const AddresssEntity = defineEntity(NetworkComponent, {
  __type: "Address",
  capability: {
    async address() {
      return this.__localId;
    },
    async createTicketedEvent({ name }: { name: string }) {
      const api = await this.apiConnector();
      return {
        expectedSigningAddress: { address: this.__localId },
        transactionData: api.tx.nft.createCollection(name).toHex(),
      };
    },
  },
});

export default AddresssEntity;
