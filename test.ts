import { Api } from "@cennznet/api";

async function doo() {
  const api = await Api.create({
    provider: "wss://cennznet.unfrastructure.io/public/wss",
  });

  await new Promise((cb) => setTimeout(cb, 10000));
  console.log("He");
  api.tx.nft.createCollection('name');
}

doo();
