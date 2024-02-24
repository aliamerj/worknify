"use client";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./pagination.module.css";

interface Ipagination {
  itemCount: number;
  pageSize: number;
  currentPageStr: string;
}
export const Pagination = ({
  itemCount,
  pageSize,
  currentPageStr,
}: Ipagination) => {
  let currentPage = 1;
  if (parseInt(currentPageStr)) {
    currentPage = parseInt(currentPageStr);
  }
  const totalPages = Math.ceil(itemCount / pageSize);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const route = useRouter();
  const searchParams = useSearchParams();
  const changePage = (page: number) => {
    const param = new URLSearchParams(searchParams);
    param.set("page", page.toString());
    route.push("?" + param.toString(), { scroll: false });
  };

  if (totalPages <= 1) return null;
  return (
    <div className={styles.paginationContainer}>
      <div className={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </div>
      <button
        className={styles.pageButton}
        disabled={isFirstPage}
        onClick={() => changePage(1)}
      >
        «
      </button>
      <button
        className={styles.pageButton}
        disabled={isFirstPage}
        onClick={() => changePage(currentPage - 1)}
      >
        ‹
      </button>
      <button className={`${styles.pageButton} ${styles.activeButton}`}>
        {currentPage}
      </button>
      <button
        className={styles.pageButton}
        disabled={isLastPage}
        onClick={() => changePage(currentPage + 1)}
      >
        ›
      </button>
      <button
        className={styles.pageButton}
        disabled={isLastPage}
        onClick={() => changePage(totalPages)}
      >
        »
      </button>
    </div>
  );
};
