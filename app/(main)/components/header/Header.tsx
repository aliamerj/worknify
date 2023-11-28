import Image from "next/image";
import hero from "@/public/hero.png";
import styles from "./Header.module.css";

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
          Discover a world where efficient project management meets dynamic team
          building – Worknify empowers you to seamlessly integrate top talent
          into your projects, fostering collaboration and success at every step.
        </h3>
        <div className={styles.buttonContainer}>
          <button className={`${styles.button} ${styles.buttonGetStarted}`}>
            Get Started
          </button>
          <button className={`${styles.button} ${styles.buttonLearnMore}`}>
            Learn More
          </button>
        </div>{" "}
      </div>
    </main>
  );
};
