import { Text } from "@polkadot/types";
import { createGlobalId, defineEntity } from "./entityHelpers";
import NetworkComponent from "./NetworkComponent";
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
    async balance(args: { assetId: number }) {
      return this.load.Balance(
        createGlobalId({
          __network: this.__network,
          __localId: this.__localId + "/" + args.assetId,
          __type: "Balance",
        })
      );
    },
    async createNewGenericAsset(params: {
      options: {
        initialIssuance: number;
        allowMint: String;
        allowUpdate: String;
        allowBurn: String;
      };
      metadata: {
        symbol: string;
        decimalPlaces: number;
        existentialDeposit?: number;
      };
    }) {
      const api = await this.apiConnector();
      const unsigned = api.tx.genericAsset.create(
        this.__localId,
        {
          initialIssuance: params.options.initialIssuance,
          permissions: {
            mint:
              params.options.allowMint === "None"
                ? { None: null }
                : {
                    Address:
                      params.options.allowMint === "Self"
                        ? this.__localId
                        : params.options.allowMint,
                  },
            update:
              params.options.allowUpdate === "None"
                ? { None: null }
                : {
                    Address:
                      params.options.allowUpdate === "Self"
                        ? this.__localId
                        : params.options.allowUpdate,
                  },
            burn:
              params.options.allowBurn === "None"
                ? { None: null }
                : {
                    Address:
                      params.options.allowBurn === "Self"
                        ? this.__localId
                        : params.options.allowBurn,
                  },
          },
        },
        {
          symbol: params.metadata.symbol.startsWith("0x")
            ? params.metadata.symbol
            : new Text(api.registry, params.metadata.symbol).toHex(),
          decimalPlaces: params.metadata.decimalPlaces,
          existentialDeposit: params.metadata.existentialDeposit || 1,
        }
      );
      return this.createTransaction({
        address: this.__localId,
        extrinsic: unsigned,
        outputType: "GenericAsset",
      });
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
    async createGenericNFTCollection({ name }: { name: string }) {
      const api = await this.apiConnector();
      const unsigned = api.tx.nft.createCollection(name, null, null);
      return this.createTransaction({
        address: this.__localId,
        extrinsic: unsigned,
        outputType: "GenericNFTCollection",
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
