declare module "@foresteam/mojangson" {
	interface MojangsonEntry {
		value: any;
		type: string;
	}
	function simplify(data: MojangsonEntry): any;
	function stringify({ value, type }: MojangsonEntry, quotes?: boolean): string;
	function parse(text: string): MojangsonEntry;
	function normalize(str: string, quotes?: boolean): string;
}
