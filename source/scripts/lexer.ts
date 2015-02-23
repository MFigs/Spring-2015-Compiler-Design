module TSC {
	export class Lexer {

        public constructor(){}

		public lex() {
		    {
		        // Grab the "raw" source code.
		        var sourceCode = (<HTMLInputElement>document.getElementById("taSourceCode")).value;
		        // Trim the leading and trailing spaces.
		        sourceCode = TSC.Utils.trim(sourceCode);

                // Handle Empty Program Compilation
                if (sourceCode = "") {
                    sourceCode = "$";
                }

                _TokenStream = new Array<Token>();
                var tokenCounter = 0;

                var lineSplitCode = sourceCode.match(/[^\r\n]+/g);
                for (var i = 0; i < lineSplitCode.length; i++) {
                    lineSplitCode[i] = TSC.Utils.trim(lineSplitCode[i]);
                }
                var currentLine = lineSplitCode[0];

                for (var j = 0; j < lineSplitCode.length; j++) {

                    //console.log(j);

                    // Regex Match For:                       Integers           Strings     +    EQ   NEQ  =   TypeI TypeS    TypeB     BoolF   BoolT  Parens  IF   WHILE   PRINT  ID      Bracks  Space
                    //var tokenMatchArray = currentLine.match(/(0|(^[1-9][0-9]*))|(^"[^"]*$")|(\+)|(==)|(!=)|(=)|(int)|(string)|(boolean)|(false)|(true)|(\(|\))|(if)|(while)|(print)|([a-z])|(\{|\})|(\S)/g);

                    // Regex Match For A Grammar Without Big Numbers And Binary Strings *quietly cry* :
                    var tokenMatchArray = currentLine.match(/(int)|(string)|(boolean)|(false)|(true)|(if)|(while)|(print)|(\"(([a-z]|(\s))*)\")|(\s)|([a-z])|([0-9])|(\+)|(==)|(!=)|(=)|(\(|\))|(\{|\})|(\$)/g);
                    for (var k = 0; k < tokenMatchArray.length; k++) {

                        //TODO: Handle $ Mid-Program -> Terminate Lex Early?

                        if (((tokenMatchArray[k]).toString() !== " ") && ((tokenMatchArray[k]).toString() !== "\n")) {
                            _TokenStream[tokenCounter] = this.generateToken((tokenMatchArray[k]).toString(), j + 1);
                            tokenCounter++;
                        }

                    }

                    if (j < lineSplitCode.length - 1)
                        currentLine = lineSplitCode[j + 1];

                }

                for (var k = 0; k < _TokenStream.length - 1; k++) {

                    if (_TokenStream[k] instanceof TSC.TokenEOF) {

                        // Output Warning: EOF symbol in middle of program, some code ignored

                    }

                }

                if (!(_TokenStream[_TokenStream.length - 1] instanceof TSC.TokenEOF)) {

                    _TokenStream[_TokenStream.length] = new TSC.TokenEOF("$", lineSplitCode.length);

                    // Output Warning: No EOF symbol at end of user program, $ inserted

                }

                return _TokenStream;

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
            else if (/$/.test(tokenVal)) {
                return new TokenEOF(tokenVal, lineNum);
            }
            else {
                console.log("Invalid Input on line " + lineNum);
            }

        }

	}
}
