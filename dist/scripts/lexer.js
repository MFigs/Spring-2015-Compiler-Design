var TSC;
(function (TSC) {
    var Lexer = (function () {
        function Lexer() {
        }
        Lexer.prototype.lex = function () {
            // Grab the "raw" source code.
            var sourceCode = document.getElementById("taSourceCode").value;
            _ErrorBufferLex = new Array();
            lexErrorCount = 0;
            lexWarningCount = 0;
            continueExecution = true;

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
                var tokenMatchArray = currentLine.match(/(?:int)|(?:string)|(?:boolean)|(?:false)|(?:true)|(?:if)|(?:while)|(?:print)|(?:\"([a-z]|(\s))*\")|(?:\"(.*)\")|(?:\s)|(?:[a-z])|(?:[0-9])|(?:\+)|(?:==)|(?:!=)|(?:=)|(?:\(|\))|(?:\{|\})|(?:\$)|(?:\n)|(?:[A-Z])|(?:\S*)/g);

                for (var k = 0; k < tokenMatchArray.length - 1; k++) {
                    tokens[tokenCounter] = this.generateToken(tokenMatchArray[k], j + 1);

                    //console.log(tokenMatchArray[k].toString() + " :: " + tokens[tokenCounter]);
                    tokenCounter++;
                }

                if (j < lineSplitCode.length - 1)
                    currentLine = lineSplitCode[j + 1];
            }

            //console.log("tokens: " + tokens.length);
            var terminatedStream = false;
            var tempTokenStream = new Array();
            var arrayCounter = 0;

            for (var k = 0; k < tokens.length - 1; k++) {
                if (/\$/.test(tokens[k].tokenValue)) {
                    if (!terminatedStream) {
                        tempTokenStream[arrayCounter] = tokens[k];

                        //console.log(tempTokenStream[arrayCounter] + " in $ found loop");
                        arrayCounter++;
                    }

                    terminatedStream = true;
                    _ErrorBufferLex[lexErrorCount + lexWarningCount] = "Warning: EOF symbol found in middle of program, code afterward ignored";
                    lexWarningCount++;
                } else {
                    if (!terminatedStream) {
                        tempTokenStream[arrayCounter] = tokens[k];

                        //console.log(tempTokenStream[arrayCounter] + " outside $ found loop");
                        arrayCounter++;
                    }
                }
            }

            if (!(/\$/.test(tempTokenStream[arrayCounter - 1].tokenValue)))
                tempTokenStream[arrayCounter] = tokens[tokens.length - 1];

            //console.log("tempTokens: " + tempTokenStream.length + " ::: " + tempTokenStream);
            var tokenStreamWithoutInvalids = new Array();
            var tokenPlaceCount = 0;

            for (var q = 0; q < tempTokenStream.length; q++) {
                //console.log("q: " + q);
                //console.log(typeof tempTokenStream[q]);
                var token = tempTokenStream[q];

                if (!(token.validToken)) {
                    _ErrorBufferLex[lexErrorCount + lexWarningCount] = "Error: Invalid Token of value " + tempTokenStream[q].tokenValue + " on line number " + tempTokenStream[q].lineNumber;
                    lexErrorCount++;

                    continueExecution = false;
                } else if (/^\s/.test(token.tokenValue)) {
                    // Do Nothing, Ignore Spaces
                } else {
                    tokenStreamWithoutInvalids[tokenPlaceCount] = tempTokenStream[q];
                    tokenPlaceCount++;
                }
            }

            //console.log("tokens without invalids: " + tokenStreamWithoutInvalids.length);
            _TokenStream = tokenStreamWithoutInvalids;

            if (!(/\$/.test(_TokenStream[_TokenStream.length - 1].tokenValue))) {
                _TokenStream[_TokenStream.length] = new TSC.Token("$", /\$/, lineSplitCode.length, true, TokenEOF);

                _ErrorBufferLex[lexErrorCount + lexWarningCount] = "Warning: EOF symbol not found at end of program, $ inserted at end";
                lexWarningCount++;
            }

            return _TokenStream;
        };

        Lexer.prototype.generateToken = function (tokenVal, lineNum) {
            console.log(tokenVal);

            if (/^(?:int)|^(?:string)|^(?:boolean)/.test(tokenVal)) {
                //console.log(tokenVal + " type");
                return new TSC.Token(tokenVal, /^(?:int)|^(?:string)|^(?:boolean)/, lineNum, true, TokenType);
            } else if (/^(?:true)|^(?:false)/.test(tokenVal)) {
                //console.log(tokenVal + " boolval");
                return new TSC.Token(tokenVal, /^(?:true)|^(?:false)/, lineNum, true, TokenBool);
            } else if (/^(if)/.test(tokenVal)) {
                //console.log(tokenVal + " if");
                return new TSC.Token(tokenVal, /^(if)/, lineNum, true, TokenIf);
            } else if (/^(while)/.test(tokenVal)) {
                //console.log(tokenVal + " while");
                return new TSC.Token(tokenVal, /^(while)/, lineNum, true, TokenWhile);
            } else if (/^(print)/.test(tokenVal)) {
                //console.log(tokenVal + " print");
                return new TSC.Token(tokenVal, /^(print)/, lineNum, true, TokenPrint);
            } else if (/\"([a-z]|\s)*\"/.test(tokenVal)) {
                //console.log(tokenVal + " string");
                return new TSC.Token(tokenVal, /\"([a-z]|(\s))*\"/, lineNum, true, TokenString);
            } else if (/(\"(.*)\")/.test(tokenVal)) {
                //console.log(tokenVal + " invalid string");
                return new TSC.Token(tokenVal, /(\"(.*)\")/, lineNum, false, TokenInvalid);
            } else if (/[a-z]/.test(tokenVal)) {
                //console.log(tokenVal + " id");
                return new TSC.Token(tokenVal, /[a-z]/, lineNum, true, TokenID);
            } else if (/[A-Z]/.test(tokenVal)) {
                //console.log(tokenVal + " invalid uppercase");
                return new TSC.Token(tokenVal, /[A-Z]/, lineNum, false, TokenInvalid);
            } else if (/[0-9]/.test(tokenVal)) {
                //console.log(tokenVal + " num");
                return new TSC.Token(tokenVal, /[0-9]/, lineNum, true, TokenNum);
            } else if (/\+/.test(tokenVal)) {
                //console.log(tokenVal + " plus");
                return new TSC.Token(tokenVal, /\+/, lineNum, true, TokenPlus);
            } else if (/==/.test(tokenVal)) {
                //console.log(tokenVal + " eq");
                return new TSC.Token(tokenVal, /==/, lineNum, true, TokenEQ);
            } else if (/!=/.test(tokenVal)) {
                //console.log(tokenVal + " neq");
                return new TSC.Token(tokenVal, /!=/, lineNum, true, TokenNEQ);
            } else if (/=/.test(tokenVal)) {
                //console.log(tokenVal + " =");
                return new TSC.Token(tokenVal, /=/, lineNum, true, TokenAssign);
            } else if (/\(/.test(tokenVal)) {
                //console.log(tokenVal + " oparen");
                return new TSC.Token(tokenVal, /\(/, lineNum, true, TokenOpenParen);
            } else if (/\)/.test(tokenVal)) {
                //console.log(tokenVal + " cparen");
                return new TSC.Token(tokenVal, /\)/, lineNum, true, TokenCloseParen);
            } else if (/\{/.test(tokenVal)) {
                //console.log(tokenVal + " obrack");
                return new TSC.Token(tokenVal, /\{/, lineNum, true, TokenOpenBrack);
            } else if (/\}/.test(tokenVal)) {
                //console.log(tokenVal + " cbrack");
                return new TSC.Token(tokenVal, /\}/, lineNum, true, TokenCloseBrack);
            } else if (/\$/.test(tokenVal)) {
                //console.log(tokenVal + " eof");
                return new TSC.Token(tokenVal, /\$/, lineNum, true, TokenEOF);
            } else if (/\s/.test(tokenVal)) {
                //console.log(tokenVal + " space");
                return new TSC.Token(tokenVal, /\s/, lineNum, true, TokenSpace);
            } else if (/\n/.test(tokenVal)) {
                console.log("NEWLINE");
            } else if (/\S*/.test(tokenVal)) {
                console.log("Invalid Token");
                return new TSC.Token(tokenVal, /\S*/, lineNum, false, TokenInvalid);
            } else {
                console.log("No Match Found");
            }
        };
        return Lexer;
    })();
    TSC.Lexer = Lexer;
})(TSC || (TSC = {}));
