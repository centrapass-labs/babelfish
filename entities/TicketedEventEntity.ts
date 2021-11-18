import { Text } from "@polkadot/types";
import { defineEntity } from "./entityHelpers";
import NetworkComponent from "./NetworkComponent";

const pinataSDK = require("@pinata/sdk");

// TODO: these are my personal, ultimately it doesnt matter IPFS is IPFS.
// We should really host our own node, instead of Pinata, but works for now.
const pinata = pinataSDK(
  "fca63a789236cd6c9255",
  "f5e44f84fc2fcd66af7568146f951ffd3fe0bba8c629653cddce996c0edb2342"
);

const TicketedEvent = defineEntity(NetworkComponent, {
  __type: "TicketedEvent",
  capability: {
    async createNewTicketType({
      name,
      quantity,
      description,
      dateTime,
      fineprint,
      venue,
    }: {
      name: string;
      description?: string;
      quantity: number;
      dateTime?: string;
      fineprint?: string;
      venue?: string;
    }) {
      const api = await this.apiConnector();

      const pinned = await pinata.pinJSONToIPFS({
        name,
        description,
        dateTime,
        fineprint,
        venue,
      });
      const unsigned = api.tx.nft.mintSeries(
        this.__localId,
        quantity,
        null,
        [
          {
            Text: name,
          },
        ],
        new Text(api.registry, `ipfs://${pinned.IpfsHash}`).toHex(),
        null
      );

      const owner = await api.query.nft.collectionOwner(this.__localId);
      return this.createTransaction({
        address: owner.toString(),
        extrinsic: unsigned,
        outputType: "TicketedEvent",
      });
    },
  },
});

export default TicketedEvent;
