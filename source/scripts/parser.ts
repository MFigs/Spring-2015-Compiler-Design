module TSC {

    export class Parser {

        private tokenCounter: number = 0;

        public constructor() {}

        public parse() {

            //putMessage("Parsing [" + tokens + "]");
            // Grab the next token.
            currentToken = _TokenStream[0];   //this.getNextToken();
            // A valid parse derives the G(oal) production, so begin there.
            this.parseBlock();
            this.match(/\$/);
            // Report the results.
            //putMessage("Parsing found " + errorCount + " error(s).");

        }

        private parseBlock() {

            this.match(/\{/);
            this.parseStatementList();
            this.match(/\}/);

        }

        private parseStatementList() {

            var thisToken: TSC.Token = this.getNextToken();

            if (thisToken instanceof TSC.TokenBrack) {

                if (thisToken.tokenValue == "}") {
                    // Epsilon Transition (Maybe Return Token To Stream?)
                }
                else {
                    this.parseStatement();
                    this.parseStatementList();
                }

            }

            else {
                this.parseStatement();
                this.parseStatementList();
            }

        }

        private parseStatement() {

            var thisToken: TSC.Token = this.getNextToken();

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

        }

        private parsePrint() {

            this.match(/print/);
            this.match(/\(/);
            this.parseExpr();
            this.match(/\)/);

        }

        private parseAssign() {

            this.parseID();
            this.match(/=/);
            this.parseExpr();

        }

        private parseVarDecl() {

            this.parseType();
            this.parseID();

        }

        private parseWhile() {

            this.match(/while/);
            this.parseBoolExpr();
            this.parseBlock();

        }

        private parseIf() {

            this.match(/if/);
            this.parseBoolExpr();
            this.parseBlock();

        }

        private parseExpr() {

            var thisToken: Token = this.getNextToken();

            if (thisToken instanceof TSC.TokenNum) {
                this.parseIntExpr();
            }
            else if (thisToken instanceof TSC.TokenString) {
                this.parseString();
            }
            else if (thisToken instanceof TSC.TokenParen || thisToken instanceof TSC.TokenBoolVal) {
                this.parseBoolExpr();
            }
            else if (thisToken instanceof TSC.TokenID) {
                this.parseID();
            }
            else {
                // Output parse error
            }

        }

        private parseIntExpr() {

            var thisToken: Token = this.getNextToken();

            this.parseDigit();

            if (thisToken instanceof TSC.TokenPlus) {

                this.parseIntOp();
                this.parseDigit();

            }

        }

        private parseString() {

            var thisToken: Token = this.getNextToken();

            if (!(thisToken instanceof TSC.TokenString)) {

                // Output Parse Error - Expecting String

            }

        }

        private parseBoolExpr() {

            var thisToken: Token = this.getNextToken();

            if (thisToken instanceof TSC.TokenParen) {

                this.match(/\(/);
                this.parseExpr();
                this.parseBoolOp();
                this.parseExpr();
                this.match(/\)/);

            }

            else if (thisToken instanceof TSC.TokenBoolVal) {

                this.parseBoolVal();

            }

            else {
                // Output Parse Error - Expecting (, true or false
            }

        }

        private parseID() {

            this.parseChar();

        }

        private parseType() {

            var thisToken: TSC.Token = this.getNextToken();

            this.match(/(int)|(string)|(boolean)/);

        }

        private parseChar() {

            var thisToken:TSC.Token = this.getNextToken();

            this.match(/[a-z]/);

        }

        private parseDigit() {

            var thisToken:TSC.Token = this.getNextToken();

            this.match(/[0-9]/);

        }

        private parseBoolOp() {

            var thisToken:TSC.Token = this.getNextToken();

            this.match(/(!=)|(==)/);

        }

        private parseBoolVal() {

            var thisToken:TSC.Token = this.getNextToken();

            this.match(/(true)|(false)/);

        }

        private parseIntOp() {

            var thisToken:TSC.Token = this.getNextToken();

            this.match(/\+/);

        }

        /*private checkToken(expectedKind) {

            // Validate that we have the expected token kind and et the next token.
            switch(expectedKind) {
                case "digit":   //putMessage("Expecting a digit");
                    if (currentToken=="0" || currentToken=="1" || currentToken=="2" ||
                        currentToken=="3" || currentToken=="4" || currentToken=="5" ||
                        currentToken=="6" || currentToken=="7" || currentToken=="8" ||
                        currentToken=="9")
                    {
                        //putMessage("Got a digit!");
                    }
                    else
                    {
                        errorCount++;
                        //putMessage("NOT a digit.  Error at position " + tokenIndex + ".");
                    }
                    break;
                case "op":      //putMessage("Expecting an operator");
                    if (currentToken=="+" || currentToken=="-")
                    {
                        //putMessage("Got an operator!");
                    }
                    else
                    {
                        errorCount++;
                        //putMessage("NOT an operator.  Error at position " + tokenIndex + ".");
                    }
                    break;
                default:        //putMessage("Parse Error: Invalid Token Type at position " + tokenIndex + ".");
                    break;
            }
            // Consume another token, having just checked this one, because that
            // will allow the code to see what's coming next... a sort of "look-ahead".
            currentToken = this.getNextToken();
        }*/

        private getNextToken() {

            //var thisToken = EOF;    // Let's assume that we're at the EOF.
            var thisToken: TSC.Token;
            if (this.tokenCounter < _TokenStream.length) {
               // If we're not at EOF, then return the next token in the stream and advance the index.
               thisToken = _TokenStream[this.tokenCounter + 1];
                //putMessage("Current token:" + (thisToken).toString());
                //this.tokenCounter++;
            }

            else {

                thisToken = _TokenStream[_TokenStream.length - 1];

            }

            return thisToken;
        }

        private match(expectedTokenValue: RegExp) {

            if (!(expectedTokenValue.test(currentToken.tokenValue + ""))) {

                // Output Parse Error, Expecting string of types within RegExp, found ______ instead on line _________

                this.tokenCounter++;
                if (this.tokenCounter < _TokenStream.length)
                    currentToken = _TokenStream[this.tokenCounter];

            }

            else {

                // Parse Passes at this Token, Progress to Next Token
                this.tokenCounter++;
                if (this.tokenCounter < _TokenStream.length)
                    currentToken = _TokenStream[this.tokenCounter];


            }

        }

    }

}