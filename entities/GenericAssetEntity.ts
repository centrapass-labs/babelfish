import { Text } from "@polkadot/types";
import { createGlobalId, defineEntity } from "./entityHelpers";
import NetworkComponent from "./NetworkComponent";
import { hexToString } from "@polkadot/util";
import fetch from "node-fetch";
import { getNFTs } from "./getNFTsHelper";

async function permissions(_this: any) {
  const api = await _this.apiConnector();

  return (
    await api.query.genericAsset.permissions(_this.__localId)
  ).toJSON() as {
    V1: {
      mint: {
        Address: string;
      };
      burn: {
        Address: string;
      };
      update: {
        Address: string;
      };
    };
  };
}

const GenericAssetEntity = defineEntity(NetworkComponent, {
  __type: "GenericAsset",
  capability: {
    async assetId() {
      return this.__localId;
    },
    async metadata() {
      const api = await this.apiConnector();
      return api.query.genericAsset.assetMeta(this.__localId);
    },
    async symbol() {
      // @ts-ignore
      const metadata = await this.metadata();
      return hexToString(metadata.symbol.toString());
    },
    async decimalPlaces() {
      // @ts-ignore
      const metadata = await this.metadata();
      return metadata.decimalPlaces;
    },
    async balance(args: { address: string }) {
      return this.load.Balance(
        createGlobalId({
          __network: this.__network,
          __localId: args.address + "/" + this.__localId,
          __type: "Balance",
        })
      );
    },

    async createMintTransaction(args: { toAddress: string; amount: number }) {
      const api = await this.apiConnector();

      const permission = await permissions(this);
      const mintAddress = permission.V1.mint.Address;
      return this.createTransaction({
        address: mintAddress,
        extrinsic: api.tx.genericAsset.mint(
          this.__localId,
          args.toAddress,
          args.amount
        ),
        outputType: "Balance",
      });
    },
    async createBurnTransaction(args: {
      targetAddress: string;
      amount: number;
    }) {
      const api = await this.apiConnector();

      const permission = await permissions(this);
      const burnAddress = permission.V1.burn.Address;
      return this.createTransaction({
        address: burnAddress,
        extrinsic: api.tx.genericAsset.mint(
          this.__localId,
          args.targetAddress,
          args.amount
        ),
        outputType: "Balance",
      });
    },
  },
});

export default GenericAssetEntity;
