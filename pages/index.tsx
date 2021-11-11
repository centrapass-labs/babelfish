import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";

import babelfishDiagram from "../public/babelfishDiagram.png";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>BabelFish</title>
        <meta name="description" content="Your gateway to crypto" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>BabelFish</h1>
        <h2>GraphQL interface to the decentralized world</h2>
        <Image src={babelfishDiagram} />
        <p className={styles.description}>
          Babelfish aims to simplify crypto and decentralized systems by
          sticking a single gateway that trys to do as much of the heavy lifting
          for you. On top of querying, Babelfish can build transcations for you
          so that all you need to do is simple sign a payload and submit it back
          via babelfish. Meaning with babelfish you can implement complex dApps
          where the consumer only needs to know how to sign payloads, and do
          graphQL requests (which are POST http calls). Babelfish follows all of
          the Relay Specification
          https://relay.dev/docs/guides/graphql-server-specification/ to this
          end our IDs are global and can be used to refetch that node.
        </p>
        <div className={styles.grid}>
          <Link href="/api/graphql">
            <a className={styles.card}>
              <h2>GraphQL Endpoint</h2>
              <p>Where the magic happens</p>
            </a>
          </Link>
          <Link href="/docs">
            <a className={styles.card}>
              <h2>Documentation</h2>
              <p>Where you can read about how to use Babelfish</p>
            </a>
          </Link>
          <Link href="/wallet">
            <a className={styles.card}>
              <h2>In browser wallet</h2>
              <p>Very simple inbrowser wallet to use for testing.</p>
            </a>
          </Link>
          <Link href="/docs">
            <a className={styles.card}>
              <h2>Create Event - Promotor</h2>
              <p>In this Demo you will create Event</p>
            </a>
          </Link>
          <Link href="/docs">
            <a className={styles.card}>
              <h2>Receive and Use Ticket - Customer</h2>
              <p>In this Recieive you ticket create Event</p>
            </a>
          </Link>
          <Link href="/docs">
            <a className={styles.card}>
              <h2>Create Generic NFT</h2>
              <p>Just need an NFT for something</p>
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
