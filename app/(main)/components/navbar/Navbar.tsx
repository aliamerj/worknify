import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";

export const Navbar = () => {
  return (
    <nav className={styles.container} role="navigation">
      <Link href="/">
      <Image
        className={styles.logo}
        src="/worknify_main_logo.svg"
        alt="Worknify"
        width={300}
        height={60}
      />
      </Link>
      <Link className={styles.getStartedBtn} href="#">Get Started</Link>
    </nav>
  );
};
