export function writerFromStreamWriter(streamWriter) {
    return {
        async write(p) {
            await streamWriter.ready;
            await streamWriter.write(p);
            return p.length;
        },
    };
}
export function readerFromStreamReader(streamReader) {
    const buffer = new Deno.Buffer();
    return {
        async read(p) {
            if (buffer.empty()) {
                const res = await streamReader.read();
                if (res.done) {
                    return null;
                }
                await Deno.writeAll(buffer, res.value);
            }
            return buffer.read(p);
        },
    };
}
export function writableStreamFromWriter(writer) {
    return new WritableStream({
        async write(chunk) {
            await Deno.writeAll(writer, chunk);
        },
    });
}
export function readableStreamFromIterable(iterable) {
    const iterator = iterable[Symbol.asyncIterator]?.() ??
        iterable[Symbol.iterator]?.();
    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await iterator.next();
            if (done) {
                controller.close();
            }
            else {
                controller.enqueue(value);
            }
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0cmVhbXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsTUFBTSxVQUFVLHNCQUFzQixDQUNwQyxZQUFxRDtJQUVyRCxPQUFPO1FBQ0wsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFhO1lBQ3ZCLE1BQU0sWUFBWSxDQUFDLEtBQUssQ0FBQztZQUN6QixNQUFNLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ2xCLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUdELE1BQU0sVUFBVSxzQkFBc0IsQ0FDcEMsWUFBcUQ7SUFFckQsTUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFakMsT0FBTztRQUNMLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBYTtZQUN0QixJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDbEIsTUFBTSxHQUFHLEdBQUcsTUFBTSxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3RDLElBQUksR0FBRyxDQUFDLElBQUksRUFBRTtvQkFDWixPQUFPLElBQUksQ0FBQztpQkFDYjtnQkFFRCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN4QztZQUVELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFHRCxNQUFNLFVBQVUsd0JBQXdCLENBQ3RDLE1BQW1CO0lBRW5CLE9BQU8sSUFBSSxjQUFjLENBQUM7UUFDeEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLO1lBQ2YsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyQyxDQUFDO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWNELE1BQU0sVUFBVSwwQkFBMEIsQ0FDeEMsUUFBd0M7SUFFeEMsTUFBTSxRQUFRLEdBQ1gsUUFBNkIsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRTtRQUNyRCxRQUF3QixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUM7SUFDbkQsT0FBTyxJQUFJLGNBQWMsQ0FBQztRQUN4QixLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVU7WUFDbkIsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUU5QyxJQUFJLElBQUksRUFBRTtnQkFDUixVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDcEI7aUJBQU07Z0JBQ0wsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMzQjtRQUNILENBQUM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDIn0=