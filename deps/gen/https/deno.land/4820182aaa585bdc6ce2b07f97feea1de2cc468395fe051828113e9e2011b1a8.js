import { bytesToUuid, createBuffer, stringToBytes, uuidToBytes, } from "./_common.ts";
import { Sha1 } from "../hash/sha1.ts";
import { assert } from "../_util/assert.ts";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function validate(id) {
    return UUID_RE.test(id);
}
export function generate(options, buf, offset) {
    const i = (buf && offset) || 0;
    let { value, namespace } = options;
    if (typeof value === "string") {
        value = stringToBytes(value);
    }
    if (typeof namespace === "string") {
        namespace = uuidToBytes(namespace);
    }
    assert(namespace.length === 16, "namespace must be uuid string or an Array of 16 byte values");
    const content = namespace.concat(value);
    const bytes = new Sha1().update(createBuffer(content)).digest();
    bytes[6] = (bytes[6] & 0x0f) | 0x50;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    if (buf !== undefined) {
        for (let idx = 0; idx < 16; ++idx) {
            buf[i + idx] = bytes[idx];
        }
    }
    return buf ?? bytesToUuid(bytes);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidjUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2NS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQ0wsV0FBVyxFQUNYLFlBQVksRUFDWixhQUFhLEVBQ2IsV0FBVyxHQUNaLE1BQU0sY0FBYyxDQUFDO0FBQ3RCLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN2QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFNUMsTUFBTSxPQUFPLEdBQ1gsMEVBQTBFLENBQUM7QUFNN0UsTUFBTSxVQUFVLFFBQVEsQ0FBQyxFQUFVO0lBQ2pDLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMxQixDQUFDO0FBY0QsTUFBTSxVQUFVLFFBQVEsQ0FDdEIsT0FBa0IsRUFDbEIsR0FBYyxFQUNkLE1BQWU7SUFFZixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFL0IsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsR0FBRyxPQUFPLENBQUM7SUFDbkMsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7UUFDN0IsS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUM5QjtJQUVELElBQUksT0FBTyxTQUFTLEtBQUssUUFBUSxFQUFFO1FBQ2pDLFNBQVMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDcEM7SUFFRCxNQUFNLENBQ0osU0FBUyxDQUFDLE1BQU0sS0FBSyxFQUFFLEVBQ3ZCLDZEQUE2RCxDQUM5RCxDQUFDO0lBRUYsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QyxNQUFNLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUVoRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3BDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7SUFFcEMsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1FBQ3JCLEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7WUFDakMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDM0I7S0FDRjtJQUVELE9BQU8sR0FBRyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQyxDQUFDIn0=