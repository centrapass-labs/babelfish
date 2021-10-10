import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";

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

        <div className={styles.grid}>
          <Link href="/api/graphql">
            <a className={styles.card}>
              <h2>GraphQL Endpoint &rarr;</h2>
              <p>Where the magic happens</p>
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
