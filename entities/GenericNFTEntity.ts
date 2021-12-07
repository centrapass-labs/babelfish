import { NexusGenObjects } from "../nexus-typegen";
import { createGlobalId, defineEntity, getGlobalIdInfo } from "./entityHelpers";
import NetworkComponent from "./NetworkComponent";
import NFTComponent from "./NFTComponent";

const GenericNFTEntity = defineEntity(NetworkComponent, NFTComponent, {
  __type: "GenericNFT",
  capability: {},
});

export default GenericNFTEntity;
