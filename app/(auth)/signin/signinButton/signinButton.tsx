"use client";

import { signIn } from "next-auth/react";
import styles from "./signinButton.module.css";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { useSignInErrorMessage } from "../errors/hook";
import { useRouter, useSearchParams } from "next/navigation";
export const SigninButtons = () => {
  const router = useRouter();
  const params = useSearchParams();
  const errorType = params.get("error");
  const errorMessage =
    errorType && useSignInErrorMessage(decodeURIComponent(errorType));

  useEffect(() => {
    if (errorType && errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorType, errorMessage]);

  const signWith = async (provider: string) => {
    try {
      const res = await signIn(provider, { redirect: false });
      console.log({ res });
      if (res?.error) {
        router.push(`/signin?error=${encodeURIComponent(res.error)}`);
      } else if (res?.ok) {
        toast.success("Signed in successfully");
      }
    } catch (error) {
      console.error({ error });
      router.push(
        `/signin?error=${encodeURIComponent("An unexpected error occurred")}`,
      );
    }
  };

  return (
    <>
      <ToastContainer position="top-left" />
      <button
        className={`${styles.button} ${styles.google}`}
        onClick={() => signWith("google")}
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
        onClick={() => signWith("facebook")}
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
        className={`${styles.button} ${styles.github}`}
        onClick={() => signWith("github")}
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
// <button
//   className={`${styles.button} ${styles.linkedIn}`}
//   onClick={() => signIn("linkedin")}
// >
//   <Image
//     src={`https://authjs.dev/img/providers/linkedin.svg`}
//     alt={`LinkedIn Icon`}
//     width={30}
//     height={30}
//     className={styles.providerIcon}
//   />
//   Sign in with LinkedIn
// </button>
// <button
//   className={`${styles.button} ${styles.gitlub}`}
//   onClick={() => signIn("slack")}
// >
//   <Image
//     src={`https://authjs.dev/img/providers/gitlab.svg`}
//     alt={`slack Icon`}
//     width={30}
//     height={30}
//     className={styles.providerIcon}
//   />
//   Sign in with Slack
// </button>
