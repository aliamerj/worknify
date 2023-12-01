import Image from "next/image";
import hero from "@/public/hero.png";
import styles from "./Header.module.css";
import { Button } from "@nextui-org/button";
import Link from "next/link";

export const Header = () => {
  return (
    <main className={styles.container}>
      <Image
        className={styles.heroImage}
        src={hero}
        alt="hero image"
        height={800}
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
          <Button
            as={Link}
            href="/api/auth/signin"
            className={`${styles.button} ${styles.buttonGetStarted}`}
          >
            Get Started
          </Button>
          <Button
            as={Link}
            href="#"
            className={`${styles.button} ${styles.buttonLearnMore}`}
          >
            Learn More
          </Button>
        </div>{" "}
      </div>
    </main>
  );
};
