import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
const cryptoUtil = require("@polkadot/util-crypto");
import { hexToU8a, u8aToHex } from "@polkadot/util";
import { Keyring } from "@polkadot/api";
import Button from "./Button";
import Input from "./Input";

const keyring = new Keyring({ type: "sr25519" });

// Some mnemonic phrase
const PHRASE =
  "copper veteran indoor satoshi enroll girl reveal leisure normal battle equal wise";

function doGraphQL(query: string, variables: any) {
  var graphql = JSON.stringify({
    query,
    variables,
  });

  var requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: graphql,
  };

  return fetch("/api/graphql", requestOptions).then((response) =>
    response.json()
  );
}

var get = function (obj: any, pathString: string) {
  // Cache the current object
  if (!obj) {
    return null;
  }
  var current = obj;

  const path = pathString.split(".");

  // For each item in the path, dig into the object
  for (var i = 0; i < path.length; i++) {
    // If the item isn't found, return the default (or null)
    if (!current[path[i]]) return null;

    // Otherwise, update the current  value
    current = current[path[i]];
  }

  return current;
};

export default ({
  query,
  exampleOutput,
  variables,
  path,
  onRes,
  mutation,
}: {
  path: string;
  mutation: string;
  query: string;
  exampleOutput: any;
  variables: any;
  onRes: (res: any) => {};
}) => {
  const [res, setRes] = useState(null);
  const [vars, setVars] = useState(variables);
  const [loading, setLoading] = useState(false);
  const [res2, setRes2] = useState(null);
  const [loading2, setLoading2] = useState(false);
  const [sig, setSig] = useState("");
  return (
    <div>
      <div
        style={{
          display: "flex",
        }}
      >
        <div style={{ flex: 1 }}>
          <h2>Query</h2>

          <Editor
            defaultValue={query}
            height="250px"
            language="graphql"
            theme="vs-dark"
            // scrollBeyondLastLine={false}
            options={{
              scrollBeyondLastLine: false,
              scrollbar: {
                alwaysConsumeMouseWheel: false,
              },
              minimap: {
                enabled: false,
              },
            }}
          />
          <h3>Variables</h3>
          <Editor
            theme="vs-dark"
            defaultValue={JSON.stringify(variables, null, 2)}
            onChange={(value) => setVars(value)}
            height="200px"
            options={{
              scrollBeyondLastLine: false,
              scrollbar: {
                alwaysConsumeMouseWheel: false,
              },
              minimap: {
                enabled: false,
              },
            }}
            language="json"
          />
        </div>
        <div style={{ flex: 1 }}>
          <h2>
            Result{" "}
            <Button
              disabled={loading}
              onClick={() => {
                setLoading(true);
                doGraphQL(query, vars)
                  .then((res) => {
                    setRes(res);
                  })
                  .finally(() => setLoading(false));
              }}
            >
              Run Query
            </Button>
          </h2>

          {loading && "Loading"}
          {!loading && res && (
            <Editor
              theme="vs-dark"
              options={{
                readOnly: true,
                scrollBeyondLastLine: false,
                scrollbar: {
                  alwaysConsumeMouseWheel: false,
                },
                minimap: {
                  enabled: false,
                },
              }}
              value={JSON.stringify(res, null, 2)}
              height="450px"
              language="json"
            />
          )}
        </div>
      </div>
      <div
        style={{
          margin: 16,
          padding: 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        After creating the transaction you need to sign the signers payload and
        resubmit it.
        <h3>Signing Payload</h3>
        <Input
          style={{
            borderRadius: 4,
            padding: 8,
            border: "none",
          }}
          value={get(res, path)?.signerPayload}
        ></Input>
        <Button
          onClick={async () => {
            await cryptoUtil.cryptoWaitReady();
            const newPair = keyring.addFromUri(PHRASE);
            setSig(
              u8aToHex(
                newPair.sign(hexToU8a(get(res, path)?.signerPayload), {
                  withType: true,
                })
              )
            );
          }}
        >
          Sign with 5G6L4FqzKtpe9T48eUK5fTrfM9znsmPGKNrxcynaw2hCfRoL
        </Button>
        <h3>Signature</h3>
        <Input value={sig}></Input>
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        <div style={{ flex: 1 }}>
          <h2>Mutation</h2>
          <Editor
            defaultValue={mutation}
            height="250px"
            language="graphql"
            theme="vs-dark"
            options={{
              scrollBeyondLastLine: false,
              scrollbar: {
                alwaysConsumeMouseWheel: false,
              },
              minimap: {
                enabled: false,
              },
            }}
          />
          <h3>Variables</h3>
          <Editor
            theme="vs-dark"
            options={{
              readOnly: true,
              scrollBeyondLastLine: false,
              scrollbar: {
                alwaysConsumeMouseWheel: false,
              },
              minimap: {
                enabled: false,
              },
            }}
            value={JSON.stringify(
              {
                transactionId: get(res, path)?.id,
                signature: sig,
              },
              null,
              2
            )}
            height="200px"
            language="json"
          />
        </div>
        <div style={{ flex: 1 }}>
          <h2>
            Result{" "}
            <Button
              disabled={loading}
              onClick={() => {
                setLoading2(true);
                doGraphQL(mutation, {
                  transactionId: get(res, path)?.id,
                  signature: sig,
                })
                  .then((res) => {
                    setRes2(res);
                  })
                  .finally(() => setLoading2(false));
              }}
            >
              Run Query
            </Button>
          </h2>
          {loading2 && "Loading"}
          {!loading2 && res2 && (
            <Editor
              theme="vs-dark"
              options={{
                readOnly: true,
                scrollBeyondLastLine: false,
                scrollbar: {
                  alwaysConsumeMouseWheel: false,
                },
                minimap: {
                  enabled: false,
                },
              }}
              value={JSON.stringify(res2, null, 2)}
              height="450px"
              language="json"
            />
          )}
        </div>
      </div>
    </div>
  );
};
