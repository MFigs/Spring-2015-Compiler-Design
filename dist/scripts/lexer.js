/* lexer.ts  */
var TSC;
(function (TSC) {
    var Lexer = (function () {
        function Lexer() {
        }
        Lexer.lex = function () {
             {
                // Grab the "raw" source code.
                var sourceCode = document.getElementById("taSourceCode").value;

                // Trim the leading and trailing spaces.
                sourceCode = TSC.Utils.trim(sourceCode);

                var tokenStream = new Array();
                var tokenCounter = 0;

                var lineSplitCode = sourceCode.match(/[^\r\n]+/g);
                for (var i = 0; i < lineSplitCode.length; i++) {
                    lineSplitCode[i] = TSC.Utils.trim(lineSplitCode[i]);
                }
                var currentLine = lineSplitCode[0];

                for (var j = 0; j < lineSplitCode.length; j++) {
                    // Regex Match For:                 ID      Integers           Strings     +    EQ   NEQ  =   TypeI TypeS    TypeB     BoolF   BoolT  Parens  IF   WHILE   PRINT   Bracks  Space
                    var tokenMatch = currentLine.match(/([a-z])|(0|(^[1-9][0-9]*))|(^"[^"]*$")|(\+)|(==)|(!=)|(=)|(int)|(string)|(boolean)|(false)|(true)|(\(|\))|(if)|(while)|(print)|(\{|\})|(\S)/g);
                    while (currentLine != "") {
                        tokenStream[tokenCounter] = this.generateToken(tokenMatch, j); //new Token(tokenMatch);
                        tokenCounter++;

                        // TODO: Check if regex match removes previous token data, else shift currentLine string and match again
                        tokenMatch = currentLine.match(/([a-z])|(0|(^[1-9][0-9]*))|(^"[^"]*$")|(\+)|(==)|(!=)|(=)|(int)|(string)|(boolean)|(false)|(true)|(\(|\))|(if)|(while)|(print)|(\{|\})|(\S)/g);
                    }
                }

                return tokenStream;
            }
        };

        Lexer.prototype.generateToken = function (tokenVal, lineNum) {
            if (/[a-z]/.test(tokenVal)) {
                return new TokenID(tokenVal, lineNum);
            } else if (/0|(^[1-9][0-9]*)/.test(tokenVal)) {
                return new TokenNum(tokenVal, lineNum);
            } else if (/^"[^"]*$"/.test(tokenVal)) {
                return new TokenString(tokenVal, lineNum);
            } else if (/\+/.test(tokenVal)) {
                return new TokenPlus(tokenVal, lineNum);
            } else if (/==/.test(tokenVal)) {
                return new TokenEq(tokenVal, lineNum);
            } else if (/!=/.test(tokenVal)) {
                return new TokenNEq(tokenVal, lineNum);
            } else if (/=/.test(tokenVal)) {
                return new TokenAssign(tokenVal, lineNum);
            } else if (/(int)|(string)|(boolean)/.test(tokenVal)) {
                return new TokenType(tokenVal, lineNum);
            } else if (/(true)|(false)/.test(tokenVal)) {
                return new TokenBoolVal(tokenVal, lineNum);
            } else if (/\(/.test(tokenVal)) {
                return new TokenOParen(tokenVal, lineNum);
            } else if (/\)/.test(tokenVal)) {
                return new TokenCParen(tokenVal, lineNum);
            } else if (/\{/.test(tokenVal)) {
                return new TokenOBrack(tokenVal, lineNum);
            } else if (/\}/.test(tokenVal)) {
                return new TokenCParen(tokenVal, lineNum);
            } else if (/if/.test(tokenVal)) {
                return new TokenIF(tokenVal, lineNum);
            } else if (/while/.test(tokenVal)) {
                return new TokenWhile(tokenVal, lineNum);
            } else if (/print/.test(tokenVal)) {
                return new TokenPrint(tokenVal, lineNum);
            }

            return new TSC.Token();
        };
        return Lexer;
    })();
    TSC.Lexer = Lexer;
})(TSC || (TSC = {}));
