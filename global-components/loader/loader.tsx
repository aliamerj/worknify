import styles from "./loader.module.css";
export function LoaderFullPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-10 backdrop-grayscale backdrop-filter"></div>
      <div className={styles.centered}>
        <div className={styles.loader}></div>
      </div>
    </div>
  );
}
