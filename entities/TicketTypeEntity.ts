import { hexToString } from "@polkadot/util";
import { NexusGenObjects } from "../nexus-typegen";
import { createGlobalId, defineEntity } from "./entityHelpers";
import { getIPFSMeta, getNFTs } from "./getNFTsHelper";
import NetworkComponent from "./NetworkComponent";
import NFTComponent from "./NFTComponent";

const TicketTypeEntity = defineEntity(NetworkComponent, {
  __type: "TicketType",
  capability: {
    async ticketedEvent() {
      const [collectionId, seriesId] = this.__localId.split("/");
      return this.load.TicketedEvent(
        createGlobalId({
          __type: "TicketedEvent",
          __network: this.__network,
          __localId: collectionId,
        })
      );
    },
    async tickets(args) {
      const [collectionId, seriesId] = this.__localId.split("/");
      return getNFTs({
        ...args,
        api: await this.apiConnector(),
        network: this.__network,
        collection: collectionId,
        series: seriesId,
      });
    },
    async createAdditionalTickets({ quantity }: { quantity: number }) {
      const api = await this.apiConnector();
      const [collectionId, seriesId] = this.__localId.split("/");
      const collectionOwner = await api.query.nft.collectionOwner();
      return this.createTransaction({
        address: collectionOwner.toString(),
        extrinsic: api.tx.nft.mintAdditional(collectionId, seriesId, quantity),
        outputType: "AdditionalTickets",
      });
    },
    async name() {
      const [collectionId, seriesId] = this.__localId.split("/");
      const api = await this.apiConnector();
      const metadataURL = hexToString(
        (await api.query.nft.seriesMetadataURI(collectionId, seriesId)).toHex()
      );
      const ipfsHash =
        /Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/.exec(
          metadataURL
        );
      if (ipfsHash && ipfsHash.length) {
        const metadata = await getIPFSMeta(ipfsHash[0]);
        return metadata.name;
      }
    },
  },
});

export default TicketTypeEntity;
