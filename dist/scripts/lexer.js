var TSC;
(function (TSC) {
    var Lexer = (function () {
        function Lexer() {
        }
        Lexer.prototype.lex = function () {
             {
                // Grab the "raw" source code.
                var sourceCode = document.getElementById("taSourceCode").value;

                // Handle Empty Program Compilation
                if (sourceCode == "") {
                    sourceCode = "$";
                    // Warn of empty program and EOF insertion
                }

                // Trim the leading and trailing spaces.
                sourceCode = TSC.Utils.trim(sourceCode);

                var tokens = new Array();
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
                        if (((tokenMatchArray[k]).toString() !== " ") && ((tokenMatchArray[k]).toString() !== "\n")) {
                            tokens[tokenCounter] = this.generateToken((tokenMatchArray[k]).toString(), j + 1);
                            tokenCounter++;
                        }
                    }

                    if (j < lineSplitCode.length - 1)
                        currentLine = lineSplitCode[j + 1];
                }

                var terminatedStream = false;
                var tempTokenStream = new Array();

                for (var k = 0; k < tokens.length - 1; k++) {
                    if (tokens[k] instanceof TSC.TokenEOF) {
                        if (!terminatedStream)
                            tempTokenStream[k] = tokens[k];

                        terminatedStream = true;
                        // Output Warning: EOF symbol in middle of program, some code ignored
                    } else {
                        if (!terminatedStream)
                            tempTokenStream[k] = tokens[k];
                    }
                }

                tempTokenStream[tokens.length - 1] = tokens[tokens.length - 1];

                //console.log("tokens LEN: " + tokens.length);
                //console.log("temptokens LEN: " + tempTokenStream.length);
                _TokenStream = tempTokenStream;

                //console.log("_TOKENSTREAM LEN: " + _TokenStream.length);
                if (!(_TokenStream[_TokenStream.length - 1] instanceof TSC.TokenEOF)) {
                    _TokenStream[_TokenStream.length] = new TSC.TokenEOF("$", lineSplitCode.length);
                    // Output Warning: No EOF symbol at end of user program, $ inserted
                }

                return _TokenStream;
            }
        };

        Lexer.prototype.generateToken = function (tokenVal, lineNum) {
            if (/[a-z]/.test(tokenVal)) {
                return new TSC.TokenID(tokenVal, lineNum);
            } else if (/0|(^[1-9][0-9]*)/.test(tokenVal)) {
                return new TSC.TokenNum(tokenVal, lineNum);
            } else if (/^"[^"]*$"/.test(tokenVal)) {
                return new TSC.TokenString(tokenVal, lineNum);
            } else if (/\+/.test(tokenVal)) {
                return new TSC.TokenPlus(tokenVal, lineNum);
            } else if (/==/.test(tokenVal)) {
                return new TSC.TokenEq(tokenVal, lineNum);
            } else if (/!=/.test(tokenVal)) {
                return new TSC.TokenNEq(tokenVal, lineNum);
            } else if (/=/.test(tokenVal)) {
                return new TSC.TokenAssign(tokenVal, lineNum);
            } else if (/(int)|(string)|(boolean)/.test(tokenVal)) {
                return new TSC.TokenType(tokenVal, lineNum);
            } else if (/(true)|(false)/.test(tokenVal)) {
                return new TSC.TokenBoolVal(tokenVal, lineNum);
            } else if (/\(|\)/.test(tokenVal)) {
                return new TSC.TokenParen(tokenVal, lineNum);
            } else if (/\{|\}/.test(tokenVal)) {
                return new TSC.TokenBrack(tokenVal, lineNum);
            } else if (/if/.test(tokenVal)) {
                return new TSC.TokenIf(tokenVal, lineNum);
            } else if (/while/.test(tokenVal)) {
                return new TSC.TokenWhile(tokenVal, lineNum);
            } else if (/print/.test(tokenVal)) {
                return new TSC.TokenPrint(tokenVal, lineNum);
            } else if (/\$/.test(tokenVal)) {
                return new TSC.TokenEOF(tokenVal, lineNum);
            } else {
                console.log("Invalid Input on line " + lineNum);
            }
        };
        return Lexer;
    })();
    TSC.Lexer = Lexer;
})(TSC || (TSC = {}));
