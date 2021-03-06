import * as base64 from "./base64.ts";
export function addPaddingToBase64url(base64url) {
    if (base64url.length % 4 === 2)
        return base64url + "==";
    if (base64url.length % 4 === 3)
        return base64url + "=";
    if (base64url.length % 4 === 1) {
        throw new TypeError("Illegal base64url string!");
    }
    return base64url;
}
function convertBase64urlToBase64(b64url) {
    return addPaddingToBase64url(b64url).replace(/\-/g, "+").replace(/_/g, "/");
}
function convertBase64ToBase64url(b64) {
    return b64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
export function encode(uint8) {
    return convertBase64ToBase64url(base64.encode(uint8));
}
export function decode(b64url) {
    return base64.decode(convertBase64urlToBase64(b64url));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZTY0dXJsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmFzZTY0dXJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sS0FBSyxNQUFNLE1BQU0sYUFBYSxDQUFDO0FBT3RDLE1BQU0sVUFBVSxxQkFBcUIsQ0FBQyxTQUFpQjtJQUNyRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUM7UUFBRSxPQUFPLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDeEQsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQUUsT0FBTyxTQUFTLEdBQUcsR0FBRyxDQUFDO0lBQ3ZELElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQzlCLE1BQU0sSUFBSSxTQUFTLENBQUMsMkJBQTJCLENBQUMsQ0FBQztLQUNsRDtJQUNELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFFRCxTQUFTLHdCQUF3QixDQUFDLE1BQWM7SUFDOUMsT0FBTyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDOUUsQ0FBQztBQUVELFNBQVMsd0JBQXdCLENBQUMsR0FBVztJQUMzQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN2RSxDQUFDO0FBTUQsTUFBTSxVQUFVLE1BQU0sQ0FBQyxLQUFpQjtJQUN0QyxPQUFPLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN4RCxDQUFDO0FBTUQsTUFBTSxVQUFVLE1BQU0sQ0FBQyxNQUFjO0lBQ25DLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3pELENBQUMifQ==