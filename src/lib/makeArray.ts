/**
 * If the argument is an array returns it as is. Otherwise puts it in an array
 * (`[arg]`) and returns the result
 * @param arg The element to test and possibly convert to array
 * @category Utility
 */

export function makeArray<T = any>(arg: any): T[] {
    if (Array.isArray(arg)) {
        return arg;
    }
    return [arg];
}
