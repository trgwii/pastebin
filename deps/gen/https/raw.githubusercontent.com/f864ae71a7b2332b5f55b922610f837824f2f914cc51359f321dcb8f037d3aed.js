import { compress } from "./compress.ts";
import { write } from "./utils.ts";
import { parseHostPort } from "./hostPort.ts";
export const send = async (path, remotePath, hostPort = "", log = () => { }) => {
    const conn = await Deno.connect(parseHostPort(hostPort));
    const p = Deno.copy(conn, Deno.stdout);
    await write(conn, 1);
    await write(conn, 1n);
    const remoteData = new TextEncoder().encode(remotePath);
    await write(conn, remoteData.byteLength);
    await Deno.writeAll(conn, remoteData);
    await compress(path, conn, log);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHOUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFDdkIsSUFBWSxFQUNaLFVBQWtCLEVBQ2xCLFFBQVEsR0FBRyxFQUFFLEVBQ2IsTUFBVyxHQUFHLEVBQUUsR0FBRSxDQUFDLEVBQ25CLEVBQUU7SUFDRixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDekQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZDLE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyQixNQUFNLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDeEQsTUFBTSxLQUFLLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN6QyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3RDLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbEMsQ0FBQyxDQUFDIn0=