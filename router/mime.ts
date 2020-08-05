export const mime = (x: string) =>
  x === "js"
    ? "application/javascript"
    : x === "css"
    ? "text/css"
    : x === "ttf"
    ? "font/ttf"
    : "application/octet-stream";
