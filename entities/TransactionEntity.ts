import { u8aToHex } from "@polkadot/util";
import { createGlobalId, defineEntity } from "./entityHelpers";
import NetworkComponent from "./NetworkComponent";

const TransactionEntity = defineEntity(NetworkComponent, {
  __type: "Transaction",
  capability: {
    async getResult() {
      const api = await this.apiConnector();

      const signerPayload = api.registry.createType(
        "SignerPayload",
        Buffer.from(
          this.__globalId.replace(
            Buffer.from(
              `${this.__network}:Transaction:${this.__localId}:`
            ).toString("base64url"),

            ""
          ),
          "base64url"
        ),
        { version: api.extrinsicVersion }
      );

      const UnCoverEndpoint =
        this.__network == "CENNZnet_Nikau"
          ? "https://service.eks.centrality.me/"
          : "https://service.eks.centralityapp.com/";

      let intrinsicWithNonce;
      for (let i = 0; !intrinsicWithNonce; i++) {
        const uncoverResponse = await fetch(
          UnCoverEndpoint + "cennznet-explorer-api/api/scan/extrinsics",
          {
            headers: {
              accept: "application/json, text/plain, */*",
              "content-type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
              row: 10,
              page: i,
              address: signerPayload.address,
              signed: "all",
            }),
            method: "POST",
          }
        );
        const res: {
          data: {
            extrinsics: {
              nonce: number;
              params: string;
            }[];
          };
        } = await uncoverResponse.json();
        console.log(res);

        intrinsicWithNonce = res.data.extrinsics.find(
          ({ nonce }: any) => nonce == signerPayload.nonce
        );
        if (
          (signerPayload.nonce as unknown as number) >
          res.data.extrinsics[0].nonce
        ) {
          throw "Unsubmitted";
        }
        if (
          (signerPayload.nonce as unknown as number) <
          (res.data.extrinsics.at(-1)?.nonce ?? 0)
        ) {
          break;
        }
      }

      if (!intrinsicWithNonce) {
        throw "Nonce Used";
      }

      const params = JSON.parse(intrinsicWithNonce.params);

      for (var i = 0; i < params.length; i++) {
        if (params[i].value != signerPayload.method.args[i].toJSON()) {
          throw "Nonce Used";
        }
      }
      return intrinsicWithNonce;
    },
    async result() {
      let resObj;
      try {
        // @ts-ignore
        resObj = await this.getResult();
      } catch {
        return null;
      }

      const UnCoverEndpoint =
        this.__network == "CENNZnet_Nikau"
          ? "https://service.eks.centrality.me/"
          : "https://service.eks.centralityapp.com/";

      const uncoverResponse = await fetch(
        UnCoverEndpoint + "cennznet-explorer-api/api/scan/extrinsic",
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "content-type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            hash: resObj.extrinsic_hash,
          }),
          method: "POST",
        }
      );
      const fnd = await uncoverResponse.json();

      if (
        this.__localId === "TicketedEvent" ||
        this.__localId === "GenericNFTCollection"
      ) {
        const [
          { value: collectionId },
          { value: collectionName },
          { value: collectionOwner },
        ] = JSON.parse(
          fnd.data.event.find(
            ({ event_id }: any) => event_id === "CreateCollection"
          ).params
        );

        return this.load[this.__localId](
          createGlobalId({
            __network: this.__network,
            __type: this.__localId,
            __localId: collectionId,
          })
        );
      }

      if (this.__localId === "TicketType") {
        const [{ value: collectionId }, { value: seriesId }] = JSON.parse(
          fnd.data.event.find(
            ({ event_id }: any) => event_id === "CreateSeries"
          ).params
        );

        return this.load[this.__localId](
          createGlobalId({
            __network: this.__network,
            __type: this.__localId,
            __localId: `${collectionId}/${seriesId}`,
          })
        );
      }
      if (this.__localId === "GenericNFT") {
        const [{ value: fromAddress }, { value: tokenId }] = JSON.parse(
          fnd.data.event.find(({ event_id }: any) => event_id === "CreateToken")
            .params
        );

        return this.load[this.__localId](
          createGlobalId({
            __network: this.__network,
            __type: this.__localId,
            __localId: tokenId.join("/"),
          })
        );
      }
      if (this.__localId === "Transfer") {
        const [
          { value: fromAddress },
          {
            value: [tokenId],
          },
        ] = JSON.parse(
          fnd.data.event.find(({ event_id }: any) => event_id === "Transfer")
            .params
        );

        return this.load.Ticket(
          createGlobalId({
            __network: this.__network,
            __type: "Ticket",
            __localId: tokenId.join("/"),
          })
        );
      }
    },
    async status() {
      try {
        // @ts-ignore
        return (await this.getResult()).success ? "Success" : "Fail";
      } catch (e) {
        return e;
      }
    },
    async expectedSigningAddress() {
      const api = await this.apiConnector();

      const signerPayload = api.registry.createType(
        "SignerPayload",
        Buffer.from(
          this.__globalId.replace(
            Buffer.from(
              `${this.__network}:Transaction:${this.__localId}:`
            ).toString("base64url"),

            ""
          ),
          "base64url"
        ),
        { version: api.extrinsicVersion }
      );

      return this.load.Address(
        createGlobalId({
          __network: this.__network,
          __type: "Address",
          __localId: signerPayload.address.toString(),
        })
      );
    },
    async signerPayload() {
      const api = await this.apiConnector();

      const signerPayload = api.registry.createType(
        "SignerPayload",
        Buffer.from(
          this.__globalId.replace(
            Buffer.from(
              `${this.__network}:Transaction:${this.__localId}:`
            ).toString("base64url"),

            ""
          ),
          "base64url"
        ),
        { version: api.extrinsicVersion }
      );

      const signerPayloadData = u8aToHex(
        api.registry
          .createType("ExtrinsicPayload", signerPayload.toPayload(), {
            version: api.extrinsicVersion,
          })
          // NOTE Explicitly pass the bare flag so the method is encoded un-prefixed (non-decodable, for signing only)
          .toU8a({ method: true })
      );

      return signerPayloadData;
    },
  },
});

export default TransactionEntity;
