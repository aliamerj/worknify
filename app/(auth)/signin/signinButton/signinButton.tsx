"use client";

import { signIn } from "next-auth/react";
import styles from "./signinButton.module.css";
import Image from "next/image";
export const SigninButtons = () => {
  return (
    <>
      <button
        className={`${styles.button} ${styles.google}`}
        onClick={() => signIn("google")}
      >
        <Image
          src={`https://authjs.dev/img/providers/google.svg`}
          alt={`google Icon`}
          width={30}
          height={30}
          className={styles.providerIcon}
        />
        Sign in with Google
      </button>
      <button
        className={`${styles.button} ${styles.facebook}`}
        onClick={() => signIn("facebook")}
      >
        <Image
          src={`https://authjs.dev/img/providers/facebook.svg`}
          alt={`Facebook Icon`}
          width={30}
          height={30}
          className={styles.providerIcon}
        />
        Sign in with Facebook
      </button>
      <button
        className={`${styles.button} ${styles.linkedIn}`}
        onClick={() => signIn("linkedin")}
      >
        <Image
          src={`https://authjs.dev/img/providers/linkedin.svg`}
          alt={`LinkedIn Icon`}
          width={30}
          height={30}
          className={styles.providerIcon}
        />
        Sign in with LinkedIn
      </button>
      <button
        className={`${styles.button} ${styles.gitlub}`}
        onClick={() => signIn("slack")}
      >
        <Image
          src={`https://authjs.dev/img/providers/gitlab.svg`}
          alt={`slack Icon`}
          width={30}
          height={30}
          className={styles.providerIcon}
        />
        Sign in with Slack
      </button>
      <button
        className={`${styles.button} ${styles.github}`}
        onClick={() => signIn("slack")}
      >
        <Image
          src={`https://authjs.dev/img/providers/github.svg`}
          alt={`github Icon`}
          width={30}
          height={30}
          className={styles.providerIcon}
        />
        Sign in with GitHub
      </button>
    </>
  );
};
