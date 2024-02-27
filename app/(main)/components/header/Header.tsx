import React from "react";
import Image from "next/image";
import hero from "@/public/hero.png";
import styles from "./Header.module.css";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { ApiRouter, AppRouter } from "@/utils/router/app_router";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Renders the header section of a web page.
 * returns JSX element representing the header section.
 */
export const Header = async () => {
  const sestions = await getServerSession(authOptions);
  return (
    <main className={styles.container}>
      <Image
        className={styles.heroImage}
        src={hero}
        alt="hero image"
        priority={true}
      />
      <div className={styles.headerContent}>
        <h1>
          Bridging Project Management Excellence with Seamless Team Hiring and
          Collaboration
        </h1>
        <h3>
          Merging sophisticated project tracking with streamlined hiring –
          Worknify brings together all you need for team efficiency and project
          success under one roof.
        </h3>
        <div className={styles.buttonContainer}>
          {!sestions?.user && (
            <Button
              as={Link}
              href={ApiRouter.signin}
              className={`${styles.button} ${styles.buttonGetStarted}`}
            >
              Get Started
            </Button>
          )}
          <Button
            as={Link}
            href={AppRouter.about}
            className={`${styles.button} ${styles.buttonLearnMore}`}
          >
            Learn More
          </Button>
        </div>
      </div>
    </main>
  );
};
