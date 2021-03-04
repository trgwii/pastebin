import { assert } from "./assert.ts";
export function deepAssign(target, ...sources) {
    for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        if (!source || typeof source !== `object`) {
            return;
        }
        Object.entries(source).forEach(([key, value]) => {
            if (value instanceof Date) {
                target[key] = new Date(value);
                return;
            }
            if (!value || typeof value !== `object`) {
                target[key] = value;
                return;
            }
            if (Array.isArray(value)) {
                target[key] = [];
            }
            if (typeof target[key] !== `object` || !target[key]) {
                target[key] = {};
            }
            assert(value);
            deepAssign(target[key], value);
        });
    }
    return target;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVlcF9hc3NpZ24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZWVwX2Fzc2lnbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBY3JDLE1BQU0sVUFBVSxVQUFVLENBRXhCLE1BQTJCLEVBRTNCLEdBQUcsT0FBYztJQUdqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN2QyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7WUFDekMsT0FBTztTQUNSO1FBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBUSxFQUFFO1lBQ3BELElBQUksS0FBSyxZQUFZLElBQUksRUFBRTtnQkFDekIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM5QixPQUFPO2FBQ1I7WUFDRCxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtnQkFDdkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFDcEIsT0FBTzthQUNSO1lBQ0QsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN4QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQ2xCO1lBRUQsSUFBSSxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ25ELE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDbEI7WUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDZCxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBNEIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FBQztLQUNKO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyJ9