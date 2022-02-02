import { Text } from "@polkadot/types";
import { createGlobalId, defineEntity } from "./entityHelpers";
import NetworkComponent from "./NetworkComponent";
import { hexToString } from "@polkadot/util";
import fetch from "node-fetch";
import { getNFTs } from "./getNFTsHelper";

const BalanceEntity = defineEntity(NetworkComponent, {
  __type: "Balance",
  capability: {
    async asset() {
      return this.load.GenericAsset(
        createGlobalId({
          __localId: this.__localId.split("/")[1],
          __network: this.__network,
          __type: "GenericAsset",
        })
      );
    },
    async amount() {
      const api = await this.apiConnector();
      return await api.query.genericAsset.freeBalance(
        this.__localId.split("/")[1],
        this.__localId.split("/")[0]
      );
    },
    async createTransferTransaction(args: {
      toAddress: string;
      amount: number;
    }) {
      const api = await this.apiConnector();
      return this.createTransaction({
        address: this.__localId.split("/")[0],
        extrinsic: api.tx.genericAsset.transfer(
          this.__localId.split("/")[1],
          args.toAddress,
          args.amount
        ),
        outputType: "Balance",
      });
    },
  },
});

export default BalanceEntity;
