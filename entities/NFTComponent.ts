import { Api } from "@cennznet/api";
import { NexusGenObjects } from "../nexus-typegen";
import { defineComponent } from "./entityHelpers";

const NFTComponent = defineComponent<
  {
    apiConnector(): Promise<Api>;
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
      // tokenOwner((CollectionId,SeriesId), SerialNumber)
      const owner = await api.query.nft.tokenOwner(this.__localId);
      return {
        address: owner.toString(),
      };
    },
    async createTransferTransaction({ toAddress }) {
      const api = await this.apiConnector();
      const tokenOwner = await this.tokenOwner();
      return {
        transcationData: api.tx.nft.transfer(this.__localId, toAddress).toHex(),
        expectedSigningAddress: tokenOwner,
      };
    },
  },
});

export default NFTComponent;
