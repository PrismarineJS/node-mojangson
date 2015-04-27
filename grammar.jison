%lex

%%
\s+     "/* skip whitespace */";
':'            return 'DP';
'{'	       return 'LEFTP';
'}'	        return 'RIGHTP';
'['	         return 'LEFTC';
']'	         return 'RIGHTC';
','	         return 'COMMA';
"false"       return 'FALSE';
"true"		return 'TRUE' ;
"null"	     return 'NULL';
'-'?([1-9][0-9]*|'0')('.'[0-9]+)?(['e''E']['+''-']?[0-9]+)? return 'FLOAT';
'"'([']|[^'"''\\']|('\\'['"' '\\' '/' 'b' 'f' 'n' 'r' 't' 'u']))*'"' return 'STRING';
<<EOF>> return 'EOF';
/lex

%start main

%%

main:jvalue 'EOF' {return $1};

jarray:'LEFTC' liste_jvalue 'RIGHTC' {$$=$2};

liste_jvalue:
	jvalue 'COMMA' liste_jvalue {$3.unshift($1);$$=$3}
	| jvalue	 { $$=[$1] }
	| {[]}
	;

jvalue:
	'TRUE' {$$=true}
	|'FALSE' {$$=false}
	| 'STRING' {$$=$1.substring(1,$1.length-1)}
	| jobject {$$=$1}
	| jarray {$$=$1}
	|'NULL' {$$=null;}
	|'FLOAT' {$$=parseFloat($1)}
;

jobject:'LEFTP' liste_jobject_value 'RIGHTP' {$$=$2};

liste_jobject_value:
	'STRING' 'DP' jvalue 'COMMA' liste_jobject_value {$5[$1.substring(1,$1.length-1)]=$3; $$=$5}
	| 'STRING' 'DP' jvalue	 {var a={};a[$1.substring(1,$1.length-1)]=$3;$$=a }
	| {$$={}}
;