import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import { NexusGenObjects } from "../nexus-typegen";
import { defineComponent } from "./entityHelpers";

const NFTComponent = defineComponent<
  {
    apiConnector(): Promise<Api>;
    createTransaction: (input: {
      address: string;
      extrinsic: SubmittableExtrinsic<any, any>;
    }) => Promise<{
      expectedSigningAddress: { address: string };
      signerPayload: any;
      id: string;
    }>;
  },
  {
    tokenOwner(): Promise<{ address: string }>;
    createTransferTransaction(inn: {
      toAddress: string;
    }): Promise<NexusGenObjects["Transaction"]>;
  }
>({
  __component: "NFT",
  cacheKey() {
    return this.__localId + this.__network;
  },
  capability: {
    async tokenOwner() {
      const api = await this.apiConnector();
      const owner = await api.query.nft.tokenOwner(this.__localId);
      return {
        address: owner.toString(),
      };
    },
    async createTransferTransaction({ toAddress }) {
      const api = await this.apiConnector();
      const tokenOwner = await this.tokenOwner();
      return this.createTransaction({
        address: tokenOwner.address,
        extrinsic: api.tx.nft.transfer(this.__localId, toAddress),
      });
    },
  },
});

export default NFTComponent;
