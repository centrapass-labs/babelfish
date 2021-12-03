import { Text } from "@polkadot/types";
import { createGlobalId, defineEntity } from "./entityHelpers";
import NetworkComponent from "./NetworkComponent";
import { hexToString } from "@polkadot/util";
import fetch from "node-fetch";
import { getNFTs } from "./getNFTsHelper";

const ipfsCache: { [key: string]: Promise<any> } = {};

async function getIPFSMeta(ipfsHash: string) {
  if (!ipfsCache[ipfsHash]) {
    ipfsCache[ipfsHash] = fetch(
      "https://gateway.pinata.cloud/ipfs/" + ipfsHash
    ).then((res) => res.json());
  }

  return ipfsCache[ipfsHash];
}

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
        outputType: "TicketedEvent",
      });
    },
    async nfts(args: {
      after?: string | null | undefined;
      before?: string | null | undefined;
      first?: number | null | undefined;
      last?: number | null | undefined;
      filterType?: string | null | undefined;
    }) {
      return getNFTs({
        ...args,
        api: await this.apiConnector(),
        network: this.__network,
        address: this.__localId,
      });
    },
  },
});

export default AddresssEntity;
