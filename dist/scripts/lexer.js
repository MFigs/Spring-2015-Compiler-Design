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
                        tokenStream[tokenCounter] = this.generateToken(tokenMatch); //new Token(tokenMatch);
                        tokenCounter++;

                        // TODO: Check if regex match removes previous token data, else shift currentLine string and match again
                        tokenMatch = currentLine.match(/([a-z])|(0|(^[1-9][0-9]*))|(^"[^"]*$")|(\+)|(==)|(!=)|(=)|(int)|(string)|(boolean)|(false)|(true)|(\(|\))|(if)|(while)|(print)|(\{|\})|(\S)/g);
                    }
                }

                return tokenStream;
            }
        };

        Lexer.prototype.generateToken = function (tokenVal) {
            return new TSC.Token();
        };
        return Lexer;
    })();
    TSC.Lexer = Lexer;
})(TSC || (TSC = {}));
