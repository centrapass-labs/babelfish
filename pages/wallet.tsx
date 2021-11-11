import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
const cryptoUtil = require("@polkadot/util-crypto");
import { hexToU8a, u8aToHex } from "@polkadot/util";
import { Keyring } from "@polkadot/api";

const keyring = new Keyring({ type: "sr25519" });

// Some mnemonic phrase
const PHRASE =
  "copper veteran indoor satoshi enroll girl reveal leisure normal battle equal wise";

// Add an account, straight mnemonic
const Home: NextPage = () => {
  const [phrase, setPrase] = useState<string>(PHRASE);
  const [sig, setSig] = useState<string>();
  const [toSign, setToSign] = useState<string>("");
  const [address, setAddress] = useState<string>();
  const [err, setErr] = useState<string>("");
  useEffect(() => {
    const run = async () => {
      try {
        await cryptoUtil.cryptoWaitReady();
        const newPair = keyring.addFromUri(phrase);
        setAddress(newPair.address);
        setSig(u8aToHex(newPair.sign(hexToU8a(toSign), { withType: true })));
        setErr("");
      } catch (e: any) {
        setErr(e.toString());
      }
    };
    run();
  }, [toSign, phrase]);
  return (
    <div className={styles.container}>
      {err}
      <label>
        Phrase:
        <input
          value={phrase}
          onChange={({ target }) => setPrase(target.value)}
        />
      </label>
      <label>
        Address:
        <input value={address} readOnly />
      </label>
      <label>
        signerPayload:
        <input
          value={toSign}
          onChange={({ target }) => setToSign(target.value)}
        />
      </label>
      <label>
        Signature:
        <input value={toSign === "" ? toSign : sig} readOnly />
      </label>
    </div>
  );
};

export default Home;
