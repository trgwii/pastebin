const noColor = globalThis.Deno?.noColor ?? true;
let enabled = !noColor;
export function setColorEnabled(value) {
    if (noColor) {
        return;
    }
    enabled = value;
}
export function getColorEnabled() {
    return enabled;
}
function code(open, close) {
    return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
    };
}
function run(str, code) {
    return enabled
        ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
        : str;
}
export function reset(str) {
    return run(str, code([0], 0));
}
export function bold(str) {
    return run(str, code([1], 22));
}
export function dim(str) {
    return run(str, code([2], 22));
}
export function italic(str) {
    return run(str, code([3], 23));
}
export function underline(str) {
    return run(str, code([4], 24));
}
export function inverse(str) {
    return run(str, code([7], 27));
}
export function hidden(str) {
    return run(str, code([8], 28));
}
export function strikethrough(str) {
    return run(str, code([9], 29));
}
export function black(str) {
    return run(str, code([30], 39));
}
export function red(str) {
    return run(str, code([31], 39));
}
export function green(str) {
    return run(str, code([32], 39));
}
export function yellow(str) {
    return run(str, code([33], 39));
}
export function blue(str) {
    return run(str, code([34], 39));
}
export function magenta(str) {
    return run(str, code([35], 39));
}
export function cyan(str) {
    return run(str, code([36], 39));
}
export function white(str) {
    return run(str, code([37], 39));
}
export function gray(str) {
    return brightBlack(str);
}
export function brightBlack(str) {
    return run(str, code([90], 39));
}
export function brightRed(str) {
    return run(str, code([91], 39));
}
export function brightGreen(str) {
    return run(str, code([92], 39));
}
export function brightYellow(str) {
    return run(str, code([93], 39));
}
export function brightBlue(str) {
    return run(str, code([94], 39));
}
export function brightMagenta(str) {
    return run(str, code([95], 39));
}
export function brightCyan(str) {
    return run(str, code([96], 39));
}
export function brightWhite(str) {
    return run(str, code([97], 39));
}
export function bgBlack(str) {
    return run(str, code([40], 49));
}
export function bgRed(str) {
    return run(str, code([41], 49));
}
export function bgGreen(str) {
    return run(str, code([42], 49));
}
export function bgYellow(str) {
    return run(str, code([43], 49));
}
export function bgBlue(str) {
    return run(str, code([44], 49));
}
export function bgMagenta(str) {
    return run(str, code([45], 49));
}
export function bgCyan(str) {
    return run(str, code([46], 49));
}
export function bgWhite(str) {
    return run(str, code([47], 49));
}
export function bgBrightBlack(str) {
    return run(str, code([100], 49));
}
export function bgBrightRed(str) {
    return run(str, code([101], 49));
}
export function bgBrightGreen(str) {
    return run(str, code([102], 49));
}
export function bgBrightYellow(str) {
    return run(str, code([103], 49));
}
export function bgBrightBlue(str) {
    return run(str, code([104], 49));
}
export function bgBrightMagenta(str) {
    return run(str, code([105], 49));
}
export function bgBrightCyan(str) {
    return run(str, code([106], 49));
}
export function bgBrightWhite(str) {
    return run(str, code([107], 49));
}
function clampAndTruncate(n, max = 255, min = 0) {
    return Math.trunc(Math.max(Math.min(n, max), min));
}
export function rgb8(str, color) {
    return run(str, code([38, 5, clampAndTruncate(color)], 39));
}
export function bgRgb8(str, color) {
    return run(str, code([48, 5, clampAndTruncate(color)], 49));
}
export function rgb24(str, color) {
    if (typeof color === "number") {
        return run(str, code([38, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff], 39));
    }
    return run(str, code([
        38,
        2,
        clampAndTruncate(color.r),
        clampAndTruncate(color.g),
        clampAndTruncate(color.b),
    ], 39));
}
export function bgRgb24(str, color) {
    if (typeof color === "number") {
        return run(str, code([48, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff], 49));
    }
    return run(str, code([
        48,
        2,
        clampAndTruncate(color.r),
        clampAndTruncate(color.g),
        clampAndTruncate(color.b),
    ], 49));
}
const ANSI_PATTERN = new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
].join("|"), "g");
export function stripColor(string) {
    return string.replace(ANSI_PATTERN, "");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29sb3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWNBLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQztBQWVqRCxJQUFJLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQztBQU12QixNQUFNLFVBQVUsZUFBZSxDQUFDLEtBQWM7SUFDNUMsSUFBSSxPQUFPLEVBQUU7UUFDWCxPQUFPO0tBQ1I7SUFFRCxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ2xCLENBQUM7QUFHRCxNQUFNLFVBQVUsZUFBZTtJQUM3QixPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBT0QsU0FBUyxJQUFJLENBQUMsSUFBYyxFQUFFLEtBQWE7SUFDekMsT0FBTztRQUNMLElBQUksRUFBRSxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUc7UUFDL0IsS0FBSyxFQUFFLFFBQVEsS0FBSyxHQUFHO1FBQ3ZCLE1BQU0sRUFBRSxJQUFJLE1BQU0sQ0FBQyxXQUFXLEtBQUssR0FBRyxFQUFFLEdBQUcsQ0FBQztLQUM3QyxDQUFDO0FBQ0osQ0FBQztBQU9ELFNBQVMsR0FBRyxDQUFDLEdBQVcsRUFBRSxJQUFVO0lBQ2xDLE9BQU8sT0FBTztRQUNaLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ25FLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDVixDQUFDO0FBTUQsTUFBTSxVQUFVLEtBQUssQ0FBQyxHQUFXO0lBQy9CLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFNRCxN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