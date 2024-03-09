import styles from "./signin.module.css";
import Link from "next/link";
import Image from "next/image";
import { SigninButtons } from "./signinButton/signinButton";
import { AppRouter } from "@/utils/router/app_router";

export const metadata: Metadata = {
  title: 'Login - Access Your Worknify Account',
  description: 'Sign in to your Worknify account to connect, collaborate, and continue your professional journey. Access your personalized dashboard, manage projects, and engage with the Worknify community. Secure and user-friendly, Worknify keeps you connected with your professional world.',
};
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
          width="0"
          height="0"
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          priority
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
