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

/*
{
  "data": {
    "submitTransaction": {
      "status": "[{\"event_index\":\"1481808-1\",\"block_num\":1481808,\"module_id\":\"system\",\"event_id\":\"NewAccount\",\"params\":\"[{\\\"type\\\":\\\"AccountId\\\",\\\"value\\\":\\\"5CniLEDp3csvYuYCkKjsPiZ9cf4e5MVEckkf1SB4sB4QG8YJ\\\"}]\",\"event_idx\":1,\"finalized\":false,\"extrinsic_hash\":\"0xde29700fa054642b07636302dd2918716719fc286425cafd1f0fa1fef2e9add6\",\"extrinsic_idx\":1},{\"event_index\":\"1481808-2\",\"block_num\":1481808,\"module_id\":\"genericAsset\",\"event_id\":\"Transferred\",\"params\":\"[{\\\"type\\\":\\\"AssetId\\\",\\\"value\\\":16000},{\\\"type\\\":\\\"AccountId\\\",\\\"value\\\":\\\"5G6L4FqzKtpe9T48eUK5fTrfM9znsmPGKNrxcynaw2hCfRoL\\\"},{\\\"type\\\":\\\"AccountId\\\",\\\"value\\\":\\\"5CniLEDp3csvYuYCkKjsPiZ9cf4e5MVEckkf1SB4sB4QG8YJ\\\"},{\\\"type\\\":\\\"Balance\\\",\\\"value\\\":10}]\",\"event_idx\":2,\"finalized\":false,\"extrinsic_hash\":\"0xde29700fa054642b07636302dd2918716719fc286425cafd1f0fa1fef2e9add6\",\"extrinsic_idx\":1},{\"event_index\":\"1481808-3\",\"block_num\":1481808,\"module_id\":\"system\",\"event_id\":\"ExtrinsicSuccess\",\"params\":\"[{\\\"type\\\":\\\"DispatchInfo\\\",\\\"value\\\":{\\\"weight\\\":903000000,\\\"class\\\":\\\"Normal\\\",\\\"paysFee\\\":\\\"Yes\\\"}}]\",\"event_idx\":3,\"finalized\":false,\"extrinsic_hash\":\"0xde29700fa054642b07636302dd2918716719fc286425cafd1f0fa1fef2e9add6\",\"extrinsic_idx\":1}]"
    }
  }
}
*/

export default BalanceEntity;
