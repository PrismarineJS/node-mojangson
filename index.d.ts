declare module "mojangson" {
	interface MojangsonEntry {
		value: object;
		type: string;
	}
	function simplify(data: object): object;
	function stringify({ value, type }: MojangsonEntry, quotes?: boolean): string;
	function parse(text: string): object;
	function normalize(str: string, quotes?: boolean): string;
}