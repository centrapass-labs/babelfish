const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cryptoUtil = require("@polkadot/util-crypto");
const { hexToU8a, u8aToHex } = require("@polkadot/util");
const { Keyring } = require("@polkadot/api");

const keyring = new Keyring({ type: "sr25519" });

// Some mnemonic phrase
const PHRASE =
  "copper veteran indoor satoshi enroll girl reveal leisure normal battle equal wise";

run(PHRASE, "My Event");

async function run(phrase, eventName) {
  await cryptoUtil.cryptoWaitReady();
  const newPair = keyring.addFromUri(phrase);
  const address = newPair.address;
  console.log("ADDRESS:", address, "\n");

  /**
   * Get Signing Payload and Transaction ID for the transaction to create an Ticket Event.
   */
  var getSigningPayload = JSON.stringify({
    query:
      "query($address: String!, $eventDetails: TicketedEventDetailsInput!) {\n  network(network: CENNZnet_Nikau) {\n    address(address: $address) {\n      address\n      createTicketedEvent(eventDetails: $eventDetails) {\n        id\n        signerPayload\n      }\n    }\n  }\n}",
    variables: {
      address,
      eventDetails: { name: eventName },
    },
  });

  const {
    data: {
      network: {
        address: {
          createTicketedEvent: { id, signerPayload },
        },
      },
    },
  } = await doGraphQL(getSigningPayload);

  console.log("Transaction Information");
  console.log("ID:", id, "\n");

  console.log("SIGNER PAYLOAD:", signerPayload, "\n");

  /***
   * Creating a signature is easy, but make sure it has the type, this is done through an
   * enum byte at the start of the signature 0x00 is Ed25519 0x01 is sr25519 so in our case
   * it would automatically prepend the signature.
   */
  const signature = u8aToHex(
    newPair.sign(hexToU8a(signerPayload), { withType: true })
  );

  console.log("SIGNATURE:", signature, "\n");

  console.log("SUBMITTING");
  var submitTransaction = JSON.stringify({
    query: `mutation($transactionId: ID!, $signature: String) {
        submitTransaction(transactionId: $transactionId, signature: $signature) {
             status
             result {
               ... on TicketedEvent {
                 id
                 createNewTicketType(quantity: 10, ticketType: {
                  name: "General Admission",
                  description: "Some basic ticket"

                }) {
                  id
                  signerPayload
                }
               }
             }
             }
            }`,
    variables: {
      transactionId: id,
      signature,
    },
  });

  const createEventTranscationRes = await doGraphQL(submitTransaction);

  const {
    data: { submitTransaction: res },
  } = createEventTranscationRes;

  console.log("IN BLOCK:", res);

  const signature2 = u8aToHex(
    newPair.sign(hexToU8a(res.result.createNewTicketType.signerPayload), {
      withType: true,
    })
  );

  var submitTransaction2 = JSON.stringify({
    query: `mutation($transactionId: ID!, $signature: String) {
        submitTransaction(transactionId: $transactionId, signature: $signature) {
             status
             result {
               id
             }
             }
            }`,
    variables: {
      transactionId: res.result.createNewTicketType.id,
      signature: signature2,
    },
  });

  const lol2 = await doGraphQL(submitTransaction2);

  console.log(lol2);
}

function doGraphQL(graphql) {
  var requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: graphql,
    redirect: "follow",
  };

  return fetch("http://localhost:3000/api/graphql", requestOptions).then(
    (response) => response.json()
  );
}
