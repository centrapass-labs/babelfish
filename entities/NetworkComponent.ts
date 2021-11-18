import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import { defineComponent } from "./entityHelpers";
import { u8aToHex } from "@polkadot/util";

const networkStore = {} as any;

const CENNZnetWSS = {
  CENNZnet_Azalea: "wss://cennznet.unfrastructure.io/public/wss",
  CENNZnet_Nikau: "wss://nikau.centrality.me/public/ws",
  CENNZnet_Rata: "wss://kong2.centrality.me/public/rata/ws",
  Mock: "",
};

const NetworkComponent = defineComponent<
  {},
  {
    apiConnector: () => Promise<Api>;
    createTransaction: (input: {
      address: string;
      extrinsic: SubmittableExtrinsic<any, any>;
      outputType?: string;
    }) => Promise<{
      expectedSigningAddress: { address: string };
      signerPayload: any;
      id: string;
    }>;
  }
>({
  __component: "Network",
  cacheKey() {
    return this.__network;
  },
  capability: {
    async apiConnector() {
      if (!networkStore[this.__network] && CENNZnetWSS[this.__network]) {
        networkStore[this.__network] = Api.create({
          provider: CENNZnetWSS[this.__network],
        });
      }
      if (!networkStore[this.__network]) {
        throw new Error(`${this.__network} is currently unsupported`);
      }
      return networkStore[this.__network];
    },
    async createTransaction({ address, extrinsic, outputType }) {
      const api = await this.apiConnector();
      const nonce = await api.rpc.system.accountNextIndex(address);

      const signerPayload = api.registry.createType("SignerPayload", {
        address,
        blockNumber: 0,
        method: extrinsic.method,
        blockHash: api.genesisHash,
        genesisHash: api.genesisHash,
        era: 0,
        nonce,
        version: api.extrinsicVersion,
        runtimeVersion: api.runtimeVersion,
        signedExtensions: api.registry.signedExtensions,
      });

      const signerPayloadData = u8aToHex(
        api.registry
          .createType("ExtrinsicPayload", signerPayload.toPayload(), {
            version: api.extrinsicVersion,
          })
          // NOTE Explicitly pass the bare flag so the method is encoded un-prefixed (non-decodable, for signing only)
          .toU8a({ method: true })
      );

      const id =
        Buffer.from(`${this.__network}:Transaction:${outputType}:`).toString(
          "base64url"
        ) + Buffer.from(signerPayload.toU8a()).toString("base64url");

      return {
        expectedSigningAddress: { address },
        signerPayload: signerPayloadData,
        id,
      };
    },
  },
});

export default NetworkComponent;
