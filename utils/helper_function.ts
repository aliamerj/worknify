import DOMPurify from "dompurify";

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
export function convertContent(htmlContent: string) {
  return { __html: DOMPurify.sanitize(htmlContent) };
}

export function convertTimeToString(stringTime: string | null): string | null {
  return stringTime ? new Date(stringTime).toISOString() : null;
}
