import { createGlobalId, defineEntity } from "./entityHelpers";
import NetworkComponent from "./NetworkComponent";
import CollectionComponent from "./CollectionComponent";
import { getIPFSMeta, getNFTs } from "./getNFTsHelper";
import { hexToString } from "@polkadot/util";

const TicketedEvent = defineEntity(NetworkComponent, CollectionComponent, {
  __type: "TicketedEvent",
  capability: {
    async createNewTicketType({
      name,
      quantity,
      description,
      dateTime,
      fineprint,
      venue,
      image,
    }: {
      name: string;
      description?: string;
      quantity: number;
      dateTime?: string;
      fineprint?: string;
      image?: string;
      venue?: string;
    }) {
      return this.mintSeries({
        outputType: "TicketType",
        attributes: [
          {
            Text: name,
          },
        ],
        metadata: {
          type: "Ticket",
          name,
          description,
          dateTime,
          fineprint,
          venue,
          image,
        },
        quantity,
      });
    },

    async tickets(args: {
      after?: string | null | undefined;
      before?: string | null | undefined;
      first?: number | null | undefined;
      last?: number | null | undefined;
      address?: string;
    }) {
      return getNFTs({
        ...args,
        filterType: "Ticket",
        api: await this.apiConnector(),
        network: this.__network,
        collection: parseInt(this.__localId, 10),
      });
    },
    async ticketTypes() {
      const api = await this.apiConnector();
      const nextSeriesId = parseInt(
        await (await api.query.nft.nextSeriesId(this.__localId)).toString(),
        10
      );
      const ticketTypes = [];
      for (let i = 0; i < nextSeriesId; i++) {
        const b = hexToString(
          (await api.query.nft.seriesMetadataURI(this.__localId, i)).toHex()
        );
        const ipfsHash =
          /Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/.exec(
            b
          );
        if (ipfsHash && ipfsHash.length) {
          const metadata = await getIPFSMeta(ipfsHash[0]);
          if (metadata.type === "Ticket") {
            ticketTypes.push(
              this.load.TicketType(
                createGlobalId({
                  __localId: `${this.__localId}/${i}`,
                  __type: "TicketType",
                  __network: this.__network,
                })
              )
            );
          }
        }
      }
      return ticketTypes;
    },
  },
});

export default TicketedEvent;
