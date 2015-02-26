module TSC {

    export class Parser {

        private tokenCounter: number = 0;

        public constructor(){}

        public parse() {

            _ErrorBufferParse = new Array<string>();

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

            //var thisToken: TSC.Token = this.getNextToken();

            if (/\{|\}/.test(currentToken.tokenValue)) {

                if (currentToken.tokenValue == "}") {
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

            //var thisToken: TSC.Token = this.getNextToken();

            if (/print/.test(currentToken.tokenValue))
                this.parsePrint();
            else if (/[a-z]/.test(currentToken.tokenValue))
                this.parseAssign();
            else if (/(int)|(string)|(boolean)/.test(currentToken.tokenValue))
                this.parseVarDecl();
            else if (/while/.test(currentToken.tokenValue))
                this.parseWhile();
            else if (/if/.test(currentToken.tokenValue))
                this.parseIf();
            else if (/\{/.test(currentToken.tokenValue))
                this.parseBlock();
            else {
                _ErrorBufferParse[parseErrorCount + parseWarningCount] = "Parse Error: Line " + currentToken.lineNumber + ", Found " + currentToken.tokenValue + ", Expecting \"print\", \"int\", \"string\", \"boolean\", \"while\", \"if\", \"{\" or a char from a-z.";
                parseErrorCount++;
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

            //var thisToken: Token = this.getNextToken();

            if (/[0-9]/.test(currentToken.tokenValue)) {
                this.parseIntExpr();
            }
            else if (/\"(([a-z]|(\s))*)\"/.test(currentToken.tokenValue)) {
                this.parseString();
            }
            else if (/\(/.test(currentToken.tokenValue) || /(true)|(false)/.test(currentToken.tokenValue)) {
                this.parseBoolExpr();
            }
            else if (/[a-z]/.test(currentToken.tokenValue)) {
                this.parseID();
            }
            else {
                _ErrorBufferParse[parseErrorCount + parseWarningCount] = "Parse Error: Line " + currentToken.lineNumber + ", Found " + currentToken.tokenValue + ", Expecting \"(\", a digit, a string, or a char from a-z.";
                parseErrorCount++;
            }

        }

        private parseIntExpr() {

            var nextToken: Token = this.getNextToken();

            this.parseDigit();

            if (/\+/.test(nextToken.tokenValue)) {

                this.parseIntOp();
                this.parseDigit();

            }

        }

        private parseString() {

            //var thisToken: Token = this.getNextToken();

            if (/\"(([a-z]|(\s))*)\"/.test(currentToken.tokenValue)) {

                //TODO: Redo this to incorporate with match function,

                // Consume Token
                this.tokenCounter++;
                currentToken = _TokenStream[this.tokenCounter];

            }

            else {

                _ErrorBufferParse[parseErrorCount + parseWarningCount] = "Parse Error: Line " + currentToken.lineNumber + ", Found " + currentToken.tokenValue + ", Expecting a string";
                parseErrorCount++;

            }

        }

        private parseBoolExpr() {

            //var thisToken: Token = this.getNextToken();

            if (/\(/.test(currentToken.tokenValue)) {

                this.match(/\(/);
                this.parseExpr();
                this.parseBoolOp();
                this.parseExpr();
                this.match(/\)/);

            }

            else if (/(true)|(false)/.test(currentToken.tokenValue)) {

                this.parseBoolVal();

            }

            else {
                _ErrorBufferParse[parseErrorCount + parseWarningCount] = "Parse Error: Line " + currentToken.lineNumber + ", Found " + currentToken.tokenValue + ", Expecting \"true\", \"false\" or \"(\"";
                parseErrorCount++;
            }

        }

        private parseID() {

            this.parseChar();

        }

        private parseType() {

            this.match(/(int)|(string)|(boolean)/);

        }

        private parseChar() {

            this.match(/[a-z]/);

        }

        private parseDigit() {

            this.match(/[0-9]/);

        }

        private parseBoolOp() {

            this.match(/(!=)|(==)/);

        }

        private parseBoolVal() {

            this.match(/(true)|(false)/);

        }

        private parseIntOp() {

            this.match(/\+/);

        }

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

            if (!(expectedTokenValue.test(currentToken.tokenValue))) {

                _ErrorBufferParse[parseErrorCount + parseWarningCount] = "Parse Error: Line " + currentToken.lineNumber + ", Found " + currentToken.tokenValue + ", Expecting input of RegEx form " + currentToken.regexPattern;
                parseErrorCount++;

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