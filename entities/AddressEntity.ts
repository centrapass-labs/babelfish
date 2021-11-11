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
      const unsigned = api.tx.nft.createCollection(name, null, null);
      return this.createTransaction({
        address: this.__localId,
        extrinsic: unsigned,
      });
    },
  },
});

export default AddresssEntity;
