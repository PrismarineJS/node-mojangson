declare module "mojangson" {
	type MojangsonNumericType = 'byte' | 'short' | 'long' | 'float' | 'double' | 'int';
	type MojangsonArrayElementType = 'byte' | 'int' | 'long';
	type MojangsonElementaryType = 'string' | 'boolean' | MojangsonNumericType;
	type MojangsonArrayType = 'byteArray' | 'intArray' | 'longArray';
	type MojangsonAnyType = 'compound' | MojangsonElementaryType | MojangsonArrayType;
	type MojangsonAnyValue = MojangsonEntry | string | boolean | number;

	interface MojangsonNumber {
		value: number;
		type: 'byte' | 'short' | 'long' | 'float' | 'double' | 'int';
	};
	interface MojangsonBoolean {
		value: boolean;
		type: 'boolean';
	};
	interface MojangsonArray {
		value: {
			value: number[];
			type: 'byte' | 'int' | 'long';
		};
		type: 'byteArray' | 'intArray' | 'longArray';
	};
	interface MojangsonList {
		value: {
			type: MojangsonAnyType;
			value: MojangsonAnyValue[];
		};
		type: 'list';
	};
	interface MojangsonString {
		value: string;
		type: 'string';
	};
	interface MojangsonCompound {
		value: {
			[key: string]: MojangsonEntry;
		};
		type: 'compound';
	}
	type MojangsonEntry = MojangsonArray | MojangsonList | MojangsonString | MojangsonNumber | MojangsonBoolean | MojangsonCompound;

	function simplify(data: MojangsonEntry): any;
	function stringify({ value, type }: MojangsonEntry, quotes?: boolean): string;
	function parse(text: string): MojangsonEntry;
	function normalize(str: string, quotes?: boolean): string;
}
