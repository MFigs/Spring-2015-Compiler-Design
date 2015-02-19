/* lexer.ts  */

module TSC {
	export class Lexer {

        public constructor(){}

		public lex() {
		    {
		        // Grab the "raw" source code.
		        var sourceCode = (<HTMLInputElement>document.getElementById("taSourceCode")).value;
		        // Trim the leading and trailing spaces.
		        sourceCode = TSC.Utils.trim(sourceCode);

                _TokenStream = new Array<Token>();
                var tokenCounter = 0;

                var lineSplitCode = sourceCode.match(/[^\r\n]+/g);
                for (var i = 0; i < lineSplitCode.length; i++) {
                    lineSplitCode[i] = TSC.Utils.trim(lineSplitCode[i]);
                }
                var currentLine = lineSplitCode[0];

                for (var j = 0; j < lineSplitCode.length; j++) {

                    // Regex Match For:                       ID      Integers           Strings     +    EQ   NEQ  =   TypeI TypeS    TypeB     BoolF   BoolT  Parens  IF   WHILE   PRINT   Bracks  Space
                    var tokenMatchArray = currentLine.match(/([a-z])|(0|(^[1-9][0-9]*))|(^"[^"]*$")|(\+)|(==)|(!=)|(=)|(int)|(string)|(boolean)|(false)|(true)|(\(|\))|(if)|(while)|(print)|(\{|\})|(\S)/g);
                    for (var k = 0; k < tokenMatchArray.length; k++) {

                        _TokenStream[tokenCounter] = this.generateToken((tokenMatchArray[k]).toString(), j);
                        tokenCounter++;

                    }

                }
		    }
		}

        public generateToken(tokenVal: string, lineNum: number): TSC.Token {

            if (/[a-z]/.test(tokenVal)) {
                return new TokenID(tokenVal, lineNum);
            }
            else if (/0|(^[1-9][0-9]*)/.test(tokenVal)) {
                return new TokenNum(tokenVal, lineNum);
            }
            else if (/^"[^"]*$"/.test(tokenVal)) {
                return new TokenString(tokenVal, lineNum);
            }
            else if (/\+/.test(tokenVal)) {
                return new TokenPlus(tokenVal, lineNum);
            }
            else if (/==/.test(tokenVal)) {
                return new TokenEq(tokenVal, lineNum);
            }
            else if (/!=/.test(tokenVal)) {
                return new TokenNEq(tokenVal, lineNum);
            }
            else if (/=/.test(tokenVal)) {
                return new TokenAssign(tokenVal, lineNum);
            }
            else if (/(int)|(string)|(boolean)/.test(tokenVal)) {
                return new TokenType(tokenVal, lineNum);
            }
            else if (/(true)|(false)/.test(tokenVal)) {
                return new TokenBoolVal(tokenVal, lineNum);
            }
            else if (/\(|\)/.test(tokenVal)) {
                return new TokenParen(tokenVal, lineNum);
            }
            else if (/\{\}/.test(tokenVal)) {
                return new TokenBrack(tokenVal, lineNum);
            }
            else if (/if/.test(tokenVal)) {
                return new TokenIf(tokenVal, lineNum);
            }
            else if (/while/.test(tokenVal)) {
                return new TokenWhile(tokenVal, lineNum);
            }
            else if (/print/.test(tokenVal)) {
                return new TokenPrint(tokenVal, lineNum);
            }
            else {
                console.log("Invalid Input on line " + lineNum);
            }

        }

	}
}
