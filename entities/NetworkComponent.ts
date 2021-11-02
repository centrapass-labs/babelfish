import { Api } from "@cennznet/api";
import { defineComponent } from "./entityHelpers";

const NetworkComponent = defineComponent<
  {},
  {
    apiConnector: () => Promise<Api>;
  }
>({
  __component: "Network",
  cacheKey() {
    return this.__network;
  },
  capability: {
    async apiConnector() {
      if (this.__network !== "CENNZnet_Nikau") {
        throw new Error("Only nikau setup");
      }
      return Api.create({
        provider: "wss://nikau.centrality.me/public/ws", // ENV for url.
      });
    },
  },
});

export default NetworkComponent;
