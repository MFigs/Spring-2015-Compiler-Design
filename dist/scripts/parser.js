var TSC;
(function (TSC) {
    var Parser = (function () {
        function Parser() {
        }
        Parser.prototype.parse = function () {
            //putMessage("Parsing [" + tokens + "]");
            // Grab the next token.
            currentToken = this.getNextToken();

            // A valid parse derives the G(oal) production, so begin there.
            this.parseBlock();
            this.match("$");
            // Report the results.
            //putMessage("Parsing found " + errorCount + " error(s).");
        };

        Parser.prototype.parseBlock = function () {
            this.match("{");
            this.parseStatementList();
            this.match("}");
        };

        Parser.prototype.parseStatementList = function () {
            var thisToken = this.getNextToken();

            if (thisToken instanceof TSC.TokenBrack) {
                if (thisToken.tokenValue == "}") {
                    // Epsilon Transition (Maybe Return Token To Stream?)
                } else {
                    this.parseStatement();
                    this.parseStatementList();
                }
            } else {
                this.parseStatement();
                this.parseStatementList();
            }
        };

        Parser.prototype.parseStatement = function () {
            var thisToken = this.getNextToken();

            if (thisToken instanceof TSC.TokenPrint)
                this.parsePrint();
            else if (thisToken instanceof TSC.TokenID)
                this.parseAssign();
            else if (thisToken instanceof TSC.TokenType)
                this.parseVarDecl();
            else if (thisToken instanceof TSC.TokenWhile)
                this.parseWhile();
            else if (thisToken instanceof TSC.TokenIf)
                this.parseIf();
            else if (thisToken instanceof TSC.TokenBrack)
                this.parseBlock();
            else {
                // Print Parse Error
            }
        };

        Parser.prototype.parsePrint = function () {
            this.match("print");
            this.match("(");
            this.parseExpr();
            this.match(")");
        };

        Parser.prototype.parseAssign = function () {
            this.parseID();
            this.match("=");
            this.parseExpr();
        };

        Parser.prototype.parseVarDecl = function () {
            this.parseType();
            this.parseID();
        };

        Parser.prototype.parseWhile = function () {
            this.match("while");
            this.parseBoolExpr();
            this.parseBlock();
        };

        Parser.prototype.parseIf = function () {
            this.match("if");
            this.parseBoolExpr();
            this.parseBlock();
        };

        Parser.prototype.parseExpr = function () {
        };

        Parser.prototype.checkToken = function (expectedKind) {
            switch (expectedKind) {
                case "digit":
                    if (currentToken == "0" || currentToken == "1" || currentToken == "2" || currentToken == "3" || currentToken == "4" || currentToken == "5" || currentToken == "6" || currentToken == "7" || currentToken == "8" || currentToken == "9") {
                        //putMessage("Got a digit!");
                    } else {
                        errorCount++;
                        //putMessage("NOT a digit.  Error at position " + tokenIndex + ".");
                    }
                    break;
                case "op":
                    if (currentToken == "+" || currentToken == "-") {
                        //putMessage("Got an operator!");
                    } else {
                        errorCount++;
                        //putMessage("NOT an operator.  Error at position " + tokenIndex + ".");
                    }
                    break;
                default:
                    break;
            }

            // Consume another token, having just checked this one, because that
            // will allow the code to see what's coming next... a sort of "look-ahead".
            currentToken = this.getNextToken();
        };

        Parser.prototype.getNextToken = function () {
            var thisToken = EOF;
            if (tokenIndex < tokens.length) {
                // If we're not at EOF, then return the next token in the stream and advance the index.
                thisToken = tokens[tokenIndex];

                //putMessage("Current token:" + (thisToken).toString());
                tokenIndex++;
            }

            return thisToken;
        };
        return Parser;
    })();
    TSC.Parser = Parser;
})(TSC || (TSC = {}));
