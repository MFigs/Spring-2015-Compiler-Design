module TSC {
	export class Lexer {

        public constructor(){}

		public lex() {
		    {
		        // Grab the "raw" source code.
		        var sourceCode: string = (<HTMLInputElement>document.getElementById("taSourceCode")).value;

                // Handle Empty Program Compilation
                if (sourceCode == "") {
                    sourceCode = "$";
                    // Warn of empty program and EOF insertion
                }

		        // Trim the leading and trailing spaces.
		        sourceCode = TSC.Utils.trim(sourceCode);

                var tokens = new Array<Token>();
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
                    var tokenMatchArray = currentLine.match(/(int)|(string)|(boolean)|(false)|(true)|(if)|(while)|(print)|(\"(([a-z]|(\s))*)\")|(\s)|([a-z])|([0-9])|(\+)|(==)|(!=)|(=)|(\(|\))|(\{|\})|(\$)|([\s\S]*)/g);
                    for (var k = 0; k < tokenMatchArray.length; k++) {

                        if (((tokenMatchArray[k]).toString() !== " ") && ((tokenMatchArray[k]).toString() !== "\n")) {

                            // TODO: Fix Loop So Invalid Symbol(s) Are Not Added To Token Stream (Or Make Invalid Token Object and Splice Out After)

                            tokens[tokenCounter] = this.generateToken((tokenMatchArray[k]).toString(), j + 1);
                            tokenCounter++;
                        }

                    }

                    if (j < lineSplitCode.length - 1)
                        currentLine = lineSplitCode[j + 1];

                }

                var terminatedStream: boolean = false;
                var tempTokenStream = new Array<Token>();

                for (var k = 0; k < tokens.length - 1; k++) {

                    if (tokens[k] instanceof TSC.TokenEOF) {

                        if (!terminatedStream)
                            tempTokenStream[k] = tokens[k];

                        terminatedStream = true;
                        // Output Warning: EOF symbol in middle of program, some code ignored

                    }

                    else {

                        if (!terminatedStream)
                            tempTokenStream[k] = tokens[k];

                    }

                }

                tempTokenStream[tokens.length - 1] = tokens[tokens.length - 1];

                var tokenStreamWithoutInvalids = new Array<Token>();
                var tokenPlaceCount = 0;

                for (var q = 0; q < tempTokenStream.length; q++) {

                    if (tempTokenStream[q] instanceof TSC.TokenInvalid) {

                        // Output Invalid Token Value and Line Number
                        continueExecution = false;

                    }

                    else {

                        tokenStreamWithoutInvalids[tokenPlaceCount] = tempTokenStream[q];
                        tokenPlaceCount++;

                    }

                }

                //console.log("tokens LEN: " + tokens.length);
                //console.log("temptokens LEN: " + tempTokenStream.length);

                _TokenStream = tokenStreamWithoutInvalids;

                //console.log("_TOKENSTREAM LEN: " + _TokenStream.length);

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
            else if (/\"(([a-z]|(\s))*)\"/.test(tokenVal)) {
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
            else if (/\{|\}/.test(tokenVal)) {
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
            else if (/\$/.test(tokenVal)) {
                return new TokenEOF(tokenVal, lineNum);
            }
            else if (/[\s\S]*/.test(tokenVal)) {

                console.log("Invalid Input on line " + lineNum);
                return new TokenInvalid(tokenVal, lineNum);

            }

        }

	}
}
