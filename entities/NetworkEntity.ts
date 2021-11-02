import { defineEntity } from "./entityHelpers";
import NetworkComponent from "./NetworkComponent";

const NetworkEntity = defineEntity(NetworkComponent, {
  __type: "Network",
  capability: {},
});

export default NetworkEntity;
