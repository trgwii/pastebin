import { compress, encode, strings } from "./deps.ts";
import { type } from "./ast.ts";
const enc = (x) => new TextEncoder().encode(x);
export const tsBundle = async (input, output, ast) => {
    await output.write(enc([
        'import { decode } from "' + strings.decode + '";',
        'import { decompress } from "' + strings.decompress + '";',
        'import { parse } from "' + strings.parse + '";',
    ].join("\n") + "\n"));
    await output.write(enc('export default parse(\n  decompress(\n    decode(\n      "'));
    const buf = await Deno.readAll(input);
    await Deno.writeAll(output, enc(encode(compress(buf), { standard: "Z85" })));
    await output.write(enc('",\n      { standard: "Z85" },\n    ),\n  ),\n)'));
    if (ast === undefined) {
        await output.write(enc(";\n"));
        return;
    }
    await output.write(enc(` as Promise<${type(ast)}>;\n`));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNCdW5kbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0c0J1bmRsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFdEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUVoQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFdkQsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLEtBQUssRUFDM0IsS0FBa0IsRUFDbEIsTUFBbUIsRUFDbkIsR0FBUyxFQUNULEVBQUU7SUFDRixNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUNwQjtRQUNFLDBCQUEwQixHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSTtRQUNsRCw4QkFBOEIsR0FBRyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUk7UUFDMUQseUJBQXlCLEdBQUcsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJO0tBQ2pELENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FDcEIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUNoQixHQUFHLENBQUMsNERBQTRELENBQUMsQ0FDbEUsQ0FBQztJQUVGLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTdFLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsaURBQWlELENBQUMsQ0FBQyxDQUFDO0lBQzNFLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtRQUNyQixNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDL0IsT0FBTztLQUNSO0lBQ0QsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxlQUFlLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUMxRCxDQUFDLENBQUMifQ==