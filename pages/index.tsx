import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { Keyring } from "@polkadot/api";
import { useEffect, useMemo, useState } from "react";
import cryptoUtil from "@polkadot/util-crypto";
import { hexToU8a, u8aToHex } from "@polkadot/util";

const keyring = new Keyring({ type: "sr25519" });

// Some mnemonic phrase
const PHRASE =
  "copper veteran indoor satoshi enroll girl reveal leisure normal battle equal wise";

// Add an account, straight mnemonic
const Home: NextPage = () => {
  const [sig, setSig] = useState<string>();
  const [toSign, setToSign] = useState<string>();
  const [address, setAddress] = useState<string>();
  useEffect(() => {
    const run = async () => {
      // await cryptoUtil.cryptoWaitReady();
      const newPair = keyring.addFromUri(PHRASE);
      setAddress(newPair.address);
      setSig(u8aToHex(newPair.sign(hexToU8a(toSign), { withType: true })));
    };
    run();
  }, [toSign]);
  return (
    <div className={styles.container}>
      <Head>
        <title>BabelFish</title>
        <meta name="description" content="Your gateway to crypto" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>BabelFish</h1>

        <div className={styles.grid}>
          <div>
            <label>
              signerPayload
              <input
                value={toSign}
                onChange={({ target }) => setToSign(target.value)}
              />
            </label>
            <label>
              Signature
              <input value={sig} readOnly />
            </label>
            <label>
              Address
              <input value={address} readOnly />
            </label>
          </div>
          <Link href="/api/graphql">
            <a className={styles.card}>
              <h2>GraphQL Endpoint</h2>
              <p>Where the magic happens</p>
            </a>
          </Link>
          <Link href="/api/graphql">
            <a className={styles.card}>
              <h2>Create Event - Promotor</h2>
            </a>
          </Link>
          <Link href="/api/graphql">
            <a className={styles.card}>
              <h2>Receive and Use Ticket - Customer</h2>
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
