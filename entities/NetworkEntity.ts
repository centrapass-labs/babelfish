import { defineEntity } from "./entityHelpers";
import NetworkComponent from "./NetworkComponent";

const NetworkEntity = defineEntity(NetworkComponent, {
  __type: "Network",
  capability: {
    async name() {
      return this.__network;
    },
  },
});

export default NetworkEntity;
