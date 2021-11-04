import { Api } from "@cennznet/api";
import { defineComponent } from "./entityHelpers";

const networkStore = {} as any;

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
      if (!networkStore[this.__network]) {
        networkStore[this.__network] = Api.create({
          provider: "wss://nikau.centrality.me/public/ws", // ENV for url.
        });
      }
      return networkStore[this.__network];
    },
  },
});

export default NetworkComponent;
