export const ast = async (path) => {
    const stat = await Deno.stat(path);
    if (stat.isSymlink) {
        throw new TypeError("Symlinks not implemented");
    }
    if (stat.isDirectory) {
        const entries = {};
        for await (const ent of Deno.readDir(path)) {
            entries[ent.name] = await ast(`${path}/${ent.name}`);
        }
        return entries;
    }
    return null;
};
export const type = (ast) => {
    if (ast === null) {
        return "Uint8Array";
    }
    return "{ " +
        Object.entries(ast).map(([k, v]) => `${/^\w+$/.test(k) && !/^\d+/.test(k) ? k : `"${k}"`}: ${type(v)}`).join(", ") + " }";
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsSUFBWSxFQUFnQixFQUFFO0lBQ3RELE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDbEIsTUFBTSxJQUFJLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0tBQ2pEO0lBQ0QsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1FBQ3BCLE1BQU0sT0FBTyxHQUFRLEVBQUUsQ0FBQztRQUN4QixJQUFJLEtBQUssRUFBRSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7U0FDdEQ7UUFDRCxPQUFPLE9BQU8sQ0FBQztLQUNoQjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBUSxFQUFVLEVBQUU7SUFDdkMsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO1FBQ2hCLE9BQU8sWUFBWSxDQUFDO0tBQ3JCO0lBRUQsT0FBTyxJQUFJO1FBQ1QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQ2pDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FDbkUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLENBQUMsQ0FBQyJ9