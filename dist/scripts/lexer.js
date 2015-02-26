var TSC;
(function (TSC) {
    var Lexer = (function () {
        function Lexer() {
        }
        Lexer.prototype.lex = function () {
             {
                // Grab the "raw" source code.
                var sourceCode = document.getElementById("taSourceCode").value;
                _ErrorBufferLex = new Array();

                // Handle Empty Program Compilation
                if (sourceCode == "") {
                    sourceCode = "$";
                    _ErrorBufferLex[lexErrorCount + lexWarningCount] = "Warning: Empty Program Submitted, EOF Character Inserted";
                    lexWarningCount++;
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
                    var tokenMatchArray = currentLine.match(/(int)|(string)|(boolean)|(false)|(true)|(if)|(while)|(print)|(\"(([a-z]|(\s))*)\")|(\s)|([a-z])|([0-9])|(\+)|(==)|(!=)|(=)|(\(|\))|(\{|\})|(\$)|(\n)|((\s\S)*)/g);
                    console.log(tokenMatchArray);
                    for (var k = 0; k < tokenMatchArray.length - 1; k++) {
                        if (((tokenMatchArray[k]).toString() !== " ") && ((tokenMatchArray[k]).toString() !== "\n")) {
                            tokens[tokenCounter] = this.generateToken((tokenMatchArray[k]).toString(), j + 1);
                            console.log(tokenMatchArray[k].toString());
                            tokenCounter++;
                        }
                    }

                    if (j < lineSplitCode.length - 1)
                        currentLine = lineSplitCode[j + 1];
                }

                console.log("tokens: " + tokens.length);

                var terminatedStream = false;
                var tempTokenStream = new Array();
                var arrayCounter = 0;

                for (var k = 0; k < tokens.length - 1; k++) {
                    if (/\$/.test(tokens[k].tokenValue)) {
                        if (!terminatedStream) {
                            tempTokenStream[arrayCounter] = tokens[k];
                            arrayCounter++;
                        }

                        terminatedStream = true;
                        _ErrorBufferLex[lexErrorCount + lexWarningCount] = "Warning: EOF symbol found in middle of program, code afterward ignored";
                        lexWarningCount++;
                    } else {
                        if (!terminatedStream) {
                            tempTokenStream[arrayCounter] = tokens[k];
                            arrayCounter++;
                        }
                    }
                }

                tempTokenStream[arrayCounter] = tokens[tokens.length - 1];

                console.log("tempTokens: " + tempTokenStream.length + " ::: " + tempTokenStream);

                var tokenStreamWithoutInvalids = new Array();
                var tokenPlaceCount = 0;

                for (var q = 0; q < tempTokenStream.length; q++) {
                    console.log("q: " + q);
                    console.log(typeof tempTokenStream[q]);

                    var token = tempTokenStream[q];

                    if (!(token.validToken)) {
                        _ErrorBufferLex[lexErrorCount + lexWarningCount] = "Error: Invalid Token of value " + tempTokenStream[q].tokenValue + " on line number " + tempTokenStream[q].lineNumber;
                        lexErrorCount++;

                        continueExecution = false;
                    } else if (/\s/.test(token.tokenValue)) {
                        // Do Nothing, Ignore Spaces
                    } else {
                        tokenStreamWithoutInvalids[tokenPlaceCount] = tempTokenStream[q];
                        tokenPlaceCount++;
                    }
                }

                console.log("tokens without invalids: " + tokenStreamWithoutInvalids.length);

                _TokenStream = tokenStreamWithoutInvalids;

                if (!(/\$/.test(_TokenStream[_TokenStream.length - 1].tokenValue))) {
                    _TokenStream[_TokenStream.length] = new TSC.Token("$", /\$/, lineSplitCode.length, true);

                    _ErrorBufferLex[lexErrorCount + lexWarningCount] = "Warning: EOF symbol not found at end of program, $ inserted at end";
                    lexWarningCount++;
                }

                return _TokenStream;
            }
        };

        Lexer.prototype.generateToken = function (tokenVal, lineNum) {
            if (/[a-z]/.test(tokenVal)) {
                return new TSC.Token(tokenVal, /[a-z]/, lineNum, true);
            } else if (/[0-9]/.test(tokenVal)) {
                return new TSC.Token(tokenVal, /[0-9]/, lineNum, true);
            } else if (/\"(([a-z]|(\s))*)\"/.test(tokenVal)) {
                return new TSC.Token(tokenVal, /\"(([a-z]|(\s))*)\"/, lineNum, true);
            } else if (/\+/.test(tokenVal)) {
                return new TSC.Token(tokenVal, /\+/, lineNum, true);
            } else if (/==/.test(tokenVal)) {
                return new TSC.Token(tokenVal, /==/, lineNum, true);
            } else if (/!=/.test(tokenVal)) {
                return new TSC.Token(tokenVal, /!=/, lineNum, true);
            } else if (/=/.test(tokenVal)) {
                return new TSC.Token(tokenVal, /=/, lineNum, true);
            } else if (/(int)|(string)|(boolean)/.test(tokenVal)) {
                return new TSC.Token(tokenVal, /(int)|(string)|(boolean)/, lineNum, true);
            } else if (/(true)|(false)/.test(tokenVal)) {
                return new TSC.Token(tokenVal, /(true)|(false)/, lineNum, true);
            } else if (/\(|\)/.test(tokenVal)) {
                return new TSC.Token(tokenVal, /\(|\)/, lineNum, true);
            } else if (/\{|\}/.test(tokenVal)) {
                return new TSC.Token(tokenVal, /\{|\}/, lineNum, true);
            } else if (/if/.test(tokenVal)) {
                return new TSC.Token(tokenVal, /if/, lineNum, true);
            } else if (/while/.test(tokenVal)) {
                return new TSC.Token(tokenVal, /while/, lineNum, true);
            } else if (/print/.test(tokenVal)) {
                return new TSC.Token(tokenVal, /print/, lineNum, true);
            } else if (/\$/.test(tokenVal)) {
                return new TSC.Token(tokenVal, /\$/, lineNum, true);
            } else if (/\s/.test(tokenVal)) {
                return new TSC.Token(tokenVal, /\s/, lineNum, true);
            } else if (/\n/.test(tokenVal)) {
            } else if (/(\s\S)*/.test(tokenVal)) {
                console.log("Invalid Token");
                return new TSC.Token(tokenVal, /(\s\S)*/, lineNum, false);
            } else {
                console.log("No Match Found");
            }

            console.log(tokenVal);
        };
        return Lexer;
    })();
    TSC.Lexer = Lexer;
})(TSC || (TSC = {}));
