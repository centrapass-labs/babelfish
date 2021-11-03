import { defineEntity } from "./entityHelpers";
import NetworkComponent from "./NetworkComponent";

const AddresssEntity = defineEntity(NetworkComponent, {
  __type: "Address",
  capability: {
    async address() {
      return this.__localId;
    },
  },
});

export default AddresssEntity;
