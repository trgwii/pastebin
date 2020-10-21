export const mime = (x: string) =>
  (x === "txt" || x === "plaintext")
    ? "text/plain"
    : (x === "js" || x === "javascript")
    ? "application/javascript"
    : (x === "ts" || x === "typescript")
    ? "application/typescript"
    : x === "css"
    ? "text/css"
    : x === "ttf"
    ? "font/ttf"
    : "application/octet-stream";
