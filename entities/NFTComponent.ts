import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import { hexToString } from "@polkadot/util";
import { NexusGenObjects } from "../nexus-typegen";
import {
  createGlobalId,
  defineComponent,
  getGlobalIdInfo,
  GlobalId,
} from "./entityHelpers";
import { getIPFSMeta } from "./getNFTsHelper";

const NFTComponent = defineComponent<
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
    name(): Promise<null | string>;
    metadata(): Promise<any>;
    tokenOwner(): Promise<{ id: GlobalId<any, "Address"> }>;
    createTransferTransaction(inn: {
      toAddress: string;
    }): Promise<NexusGenObjects["Transaction"]>;
    burn(): Promise<NexusGenObjects["Transaction"]>;
  }
>({
  __component: "NFT",
  cacheKey() {
    return this.__localId + this.__network;
  },
  capability: {
    async metadata() {
      const [collectionId, seriesId, serialNumber] = this.__localId.split("/");

      const api = await this.apiConnector();
      const metadataURL = hexToString(
        (await api.query.nft.seriesMetadataURI(collectionId, seriesId)).toHex()
      );
      const ipfsHash =
        /Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/.exec(
          metadataURL
        );
      if (ipfsHash && ipfsHash.length) {
        return await getIPFSMeta(ipfsHash[0]);
      }
      return null;
    },
    async name() {
      return (await this.metadata())?.name;
    },
    async tokenOwner() {
      const api = await this.apiConnector();
      console.log(this.__localId);
      const [collectionId, seriesId, serialNumber] = this.__localId.split("/");

      const owner = await api.query.nft.tokenOwner(
        [collectionId, seriesId],
        serialNumber
      );
      return this.load.Address(
        createGlobalId({
          __type: "Address",
          __network: this.__network,
          __localId: owner.toString(),
        })
      );
    },
    async createTransferTransaction({ toAddress }) {
      const api = await this.apiConnector();
      const tokenOwner = await this.tokenOwner();
      return this.createTransaction({
        address: getGlobalIdInfo(tokenOwner.id).__localId,
        extrinsic: api.tx.nft.transfer(this.__localId.split("/"), toAddress),
        outputType: "Transfer",
      });
    },
    async burn() {
      const api = await this.apiConnector();
      const tokenOwner = await this.tokenOwner();
      return this.createTransaction({
        address: getGlobalIdInfo(tokenOwner.id).__localId,
        extrinsic: api.tx.nft.burn(this.__localId.split("/")),
        outputType: "Burn",
      });
    },
  },
});

export default NFTComponent;
