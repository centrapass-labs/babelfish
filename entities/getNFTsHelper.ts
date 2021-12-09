import { Text } from "@polkadot/types";
import { createGlobalId, defineEntity } from "./entityHelpers";
import NetworkComponent from "./NetworkComponent";
import { hexToString } from "@polkadot/util";
import fetch from "node-fetch";
import { NexusGenEnums } from "../nexus-typegen";

const ipfsCache: { [key: string]: Promise<any> } = {};

export async function getIPFSMeta(ipfsHash: string) {
  if (!ipfsCache[ipfsHash]) {
    ipfsCache[ipfsHash] = fetch(
      "https://gateway.pinata.cloud/ipfs/" + ipfsHash
    ).then((res) => res.json());
  }

  return ipfsCache[ipfsHash];
}

export async function getNFTs(args: {
  after?: string | null | undefined;
  before?: string | null | undefined;
  first?: number | null | undefined;
  last?: number | null | undefined;
  filterType?: string | null | undefined;
  api: any;
  address?: string;
  network: NexusGenEnums["NetworkEnum"];
  collection?: number;
  series?: number;
}) {
  let after = { collectionId: 0, seriesId: 0, serialNumber: 0 };

  if (args.before || args.last) {
    throw new Error("Pagination backwards not support yet.");
  }
  if (args.after) {
    after = JSON.parse(args.after);
  }
  const api = args.api;
  const nextId = (await api.query.nft.nextCollectionId()).toJSON() || 0;
  const output: any[] = [];
  for (
    let i = args.collection || after.collectionId;
    i < (args.collection ? args.collection + 1 : nextId);
    i += 1
  ) {
    console.log("WOOOW", i);
    const tokens = JSON.parse(
      // @ts-ignore
      JSON.stringify(await api.derive.nft.tokenInfoForCollection(i))
    );
    const c: any = [];

    for (let j = 0; j < tokens.length; j += 1) {
      const element = tokens[j];
      if (args.series && element.tokenId.seriesId != args.series) {
        continue;
      }
      if (i === after.collectionId) {
        if (element.tokenId.seriesId < after.seriesId) {
          continue;
        }
        if (
          element.tokenId.seriesId === after.seriesId &&
          element.tokenId.serialNumber <= after.serialNumber
        ) {
          continue;
        }
      }
      if (!args.address || element.owner === args.address) {
        console.log(element);

        if (!c[element.tokenId.seriesId]) {
          c[element.tokenId.seriesId] = api.query.nft.seriesMetadataURI(
            i,
            element.tokenId.seriesId
          );
        }
        const metadataURL = hexToString(
          (await c[element.tokenId.seriesId]).toHex()
        );
        const ipfsHash =
          /Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/.exec(
            metadataURL
          );
        if (ipfsHash && ipfsHash.length) {
          const metadata = await getIPFSMeta(ipfsHash[0]);
          console.log(metadata);
          if (args.filterType && metadata.type !== args.filterType) {
            continue;
          }
          output.push({
            tokenId: element.tokenId,
            metadata: metadata,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            id: createGlobalId({
              __network: args.network,
              __type: metadata.type || "GenericNFT",
              __localId: `${element.tokenId.collectionId}/${element.tokenId.seriesId}/${element.tokenId.serialNumber}`,
            }),
          });
          if (args.first && output.length >= args.first) {
            return output;
          }
        }
      }
    }
  }
  return output;
}
