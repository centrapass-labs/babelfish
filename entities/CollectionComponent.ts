import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import { Text } from "@polkadot/types";

import { NexusGenObjects } from "../nexus-typegen";
import { defineComponent } from "./entityHelpers";
const pinataSDK = require("@pinata/sdk");

// TODO: these are my personal, ultimately it doesnt matter IPFS is IPFS.
// We should really host our own node, instead of Pinata, but works for now.
const pinata = pinataSDK(
  "fca63a789236cd6c9255",
  "f5e44f84fc2fcd66af7568146f951ffd3fe0bba8c629653cddce996c0edb2342"
);

const CollectionComponent = defineComponent<
  {
    apiConnector(): Promise<Api>;
    createTransaction: (input: {
      address: string;
      extrinsic: SubmittableExtrinsic<any, any>;
      outputType: string;
    }) => Promise<{
      id: string;
    }>;
  },
  {
    name(): Promise<string>;
    mintSeries(inn: {
      outputType: string;
      metadata: object;
      attributes: ({ Text: string } | { Url: string })[];
      quantity: number;
    }): Promise<NexusGenObjects["Transaction"]>;
  }
>({
  __component: "Collection",
  cacheKey() {
    return this.__localId + this.__network;
  },
  capability: {
    async name() {
      const api = await this.apiConnector();
      return new Text(
        api.registry,
        await api.query.nft.collectionName(this.__localId)
      ).toString();
    },
    async mintSeries({ outputType, metadata, attributes, quantity }) {
      const api = await this.apiConnector();

      const pinned = await pinata.pinJSONToIPFS(metadata);
      const unsigned = api.tx.nft.mintSeries(
        this.__localId,
        quantity,
        null,
        attributes,
        new Text(api.registry, `ipfs://${pinned.IpfsHash}`).toHex(),
        null
      );

      const owner = await api.query.nft.collectionOwner(this.__localId);
      return this.createTransaction({
        address: owner.toString(),
        extrinsic: unsigned,
        outputType,
      });
    },
  },
});

export default CollectionComponent;
