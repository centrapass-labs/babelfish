import { defineEntity } from "./entityHelpers";
import NetworkComponent from "./NetworkComponent";

const NetworkEntity = defineEntity(NetworkComponent, {
  __type: "Network",
  capability: {
    async name() {
      const api = await this.apiConnector();
      return api.rpc.system.chain();

    },
  },
});

export default NetworkEntity;
