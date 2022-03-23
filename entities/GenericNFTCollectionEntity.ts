import { createGlobalId, defineEntity } from "./entityHelpers";
import NetworkComponent from "./NetworkComponent";
import CollectionComponent, { pinata } from "./CollectionComponent";
import { getIPFSMeta, getNFTs } from "./getNFTsHelper";
import { hexToString } from "@polkadot/util";
import { Text } from "@polkadot/types";

const GenericNFTCollection = defineEntity(
  NetworkComponent,
  CollectionComponent,
  {
    __type: "GenericNFTCollection",
    capability: {
      async nfts(args: {
        after?: string | null | undefined;
        before?: string | null | undefined;
        first?: number | null | undefined;
        last?: number | null | undefined;
        address?: string;
      }) {
        return getNFTs({
          ...args,
          api: await this.apiConnector(),
          network: this.__network,
          collection: parseInt(this.__localId, 10),
        });
      },
    },
  }
);

export default GenericNFTCollection;
