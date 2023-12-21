import styles from "./signin.module.css";
import Link from "next/link";
import Image from "next/image";
import { SigninButtons } from "./signinButton/signinButton";
import { AppRouter } from "@/utils/router/app_router";

export default async function SignInPage() {
  return (
    <div className={styles.loginPage}>
      <div className={styles.backToHome}>
        <Link href={AppRouter.home}>
          <span className={styles.arrow}>&larr;</span> Back to home page
        </Link>
      </div>
      <div className={styles.loginSection}>
        <h2>Sign In Or Create New Account</h2>
        <SigninButtons />
      </div>

      <div className={styles.brandingSection}>
        <Image
          src="/worknify_main_logo.svg"
          alt="logo"
          width={300}
          height={100}
        />

        <h2>Join Worknify – Where Projects and People Come Together</h2>
        <p>
          Dive into a world of efficient project management and effortless team
          building. Sign in to connect and collaborate, or register to start
          your journey towards seamless project execution and talent
          integration.
        </p>
      </div>
    </div>
  );
}
