import styles from "./loader.module.css";
export function Loader() {
  return (
    <div className={styles.centered}>
      <div className={styles.loader}></div>
    </div>
  );
}
