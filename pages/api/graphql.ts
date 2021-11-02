import { ApolloServer } from "apollo-server-micro";
import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import schema from "../../schema";
import { mockAPI } from "./mocks";

import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

// TODO: proper Error Handling.

function initMiddleware(middleware: any) {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
  })
);

const apolloServer = new ApolloServer({
  schema,
  introspection: true,
  mocks: mockAPI,
  plugins: [ApolloServerPluginLandingPageLocalDefault],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const startServer = apolloServer.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await startServer;
  await cors(req, res);

  apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}
