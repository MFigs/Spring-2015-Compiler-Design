module TSC {

    export class Parser {

        private tokenCounter: number = 0;

        public constructor(){}

        public parse() {

            _OutputBufferParse = new Array<string>();
            parseErrorCount = 0;
            parseWarningCount = 0;
            parseMessageCount = 0;

            //putMessage("Parsing [" + tokens + "]");
            // Grab the next token.
            currentToken = _TokenStream[0];   //this.getNextToken();
            // A valid parse derives the G(oal) production, so begin there.
            this.parseBlock();
            this.match(TokenEOF);
            // Report the results.
            //putMessage("Parsing found " + errorCount + " error(s).");

        }

        private parseBlock() {

            this.match(TokenOpenBrack);
            this.parseStatementList();
            this.match(TokenCloseBrack);

        }

        private parseStatementList() {

            var tk = currentToken.kind;

            if ((tk == TokenPrint)||(tk == TokenType)||(tk == TokenWhile)||(tk == TokenIf)||(tk == TokenOpenBrack)||(tk == TokenID)) {
                this.parseStatement();
                this.parseStatementList();

            }

            else {
                // Epsilon Transition - Do Nothing
            }

        }

        private parseStatement() {

            var tk = currentToken.kind;

            if (tk == TokenPrint)
                this.parsePrint();
            else if (tk == TokenType)
                this.parseVarDecl();
            else if (tk == TokenWhile)
                this.parseWhile();
            else if (tk == TokenIf)
                this.parseIf();
            else if (tk == TokenID)
                this.parseAssign();
            else if (tk == TokenOpenBrack)
                this.parseBlock();
            else {
                _OutputBufferParse[parseErrorCount + parseWarningCount + parseMessageCount] = "Parse Error: Line " + currentToken.lineNumber + ", Found " + currentToken.tokenValue + ", Expecting \"print\", \"int\", \"string\", \"boolean\", \"while\", \"if\", \"{\" or a char from a-z.";
                parseErrorCount++;
            }

        }

        private parsePrint() {

            this.match(TokenPrint);
            this.match(TokenOpenParen);
            this.parseExpr();
            this.match(TokenCloseParen);

        }

        private parseAssign() {

            this.parseID();
            this.match(TokenAssign);
            this.parseExpr();

        }

        private parseVarDecl() {

            this.parseType();
            this.parseID();

        }

        private parseWhile() {

            this.match(TokenWhile);
            this.parseBoolExpr();
            this.parseBlock();

        }

        private parseIf() {

            this.match(TokenIf);
            this.parseBoolExpr();
            this.parseBlock();

        }

        private parseExpr() {

            var tk = currentToken.kind;

            if (tk == TokenNum) {
                this.parseIntExpr();
            }
            else if (tk == TokenString) {
                this.parseString();
            }
            else if ((tk == TokenOpenParen) || (tk == TokenBool)) {
                this.parseBoolExpr();
            }
            else if (tk == TokenID) {
                this.parseID();
            }
            else {
                _OutputBufferParse[parseErrorCount + parseWarningCount + parseMessageCount] = "Parse Error: Line " + currentToken.lineNumber + ", Found " + currentToken.tokenValue + ", Expecting (, true, false, a digit, a string, or a char from a-z.";
                parseErrorCount++;
            }

        }

        private parseIntExpr() {

            var nextToken: Token = this.getNextToken();

            this.parseDigit();

            if (nextToken.kind == TokenPlus) {

                this.parseIntOp();
                this.parseExpr();

            }

        }

        private parseString() {

            this.match(TokenString);

        }

        private parseBoolExpr() {

            var tk = currentToken.kind;

            if (tk == TokenOpenParen) {

                this.match(TokenOpenParen);
                this.parseExpr();
                this.parseBoolOp();
                this.parseExpr();
                this.match(TokenCloseParen);

            }

            else if (tk == TokenBool) {

                this.parseBoolVal();

            }

            else {
                _OutputBufferParse[parseErrorCount + parseWarningCount + parseMessageCount] = "Parse Error: Line " + currentToken.lineNumber + ", Found " + currentToken.tokenValue + ", Expecting token of value true, false or (";
                parseErrorCount++;
            }

        }

        private parseID() {

            this.parseChar();

        }

        private parseType() {

            this.match(TokenType);

        }

        private parseChar() {

            this.match(TokenID);

        }

        private parseDigit() {

            this.match(TokenNum);

        }

        private parseBoolOp() {

            if (currentToken.kind == TokenNEQ) {
                this.match(TokenNEQ);
            }
            else if (currentToken.kind == TokenEQ) {
                this.match(TokenEQ)
            }
            else {
                _OutputBufferParse[parseErrorCount + parseWarningCount + parseMessageCount] = "Parse Error: Line " + currentToken.lineNumber + ", Found " + currentToken.tokenValue + ", Expecting token of value == or !=";
                parseErrorCount++;
            }

        }

        private parseBoolVal() {

            this.match(TokenBool);

        }

        private parseIntOp() {

            this.match(TokenPlus);

        }

        private getNextToken() {

            var thisToken: TSC.Token;
            if (this.tokenCounter < _TokenStream.length) {
               // If we're not at EOF, then return the next token in the stream.
               thisToken = _TokenStream[this.tokenCounter + 1];
            }

            else {

                thisToken = _TokenStream[_TokenStream.length - 1];
                console.log("Tried to get token past array bounds");

            }

            return thisToken;
        }

        private match(expectedTokenKind: number) {

            //console.log(expectedTokenKind + " : " + currentToken.kind + " : " + this.describeTokenKind(expectedTokenKind) + " : " + currentToken.tokenValue);

            if (expectedTokenKind != currentToken.kind) {

                _OutputBufferParse[parseErrorCount + parseWarningCount + parseMessageCount] = "Parse Error: Line " + currentToken.lineNumber + ", Found " + currentToken.tokenValue + ", Expecting token of value " + this.describeTokenKind(expectedTokenKind);
                parseErrorCount++;

                this.tokenCounter++;
                if (this.tokenCounter < _TokenStream.length)
                    currentToken = _TokenStream[this.tokenCounter];

            }

            else {

                _OutputBufferParse[parseErrorCount + parseWarningCount + parseMessageCount] = "Token Accepted: Expecting token of value " + this.describeTokenKind(expectedTokenKind) + ", found token of value " + currentToken.tokenValue;
                parseMessageCount++;

                // Parse Passes at this Token, Progress to Next Token
                this.tokenCounter++;
                if (this.tokenCounter < _TokenStream.length)
                    currentToken = _TokenStream[this.tokenCounter];


            }

        }

        private describeTokenKind(tk: number): string {

            if (tk == TokenAssign)
                return "=";
            else if (tk == TokenBool)
                return "true or false";
            else if (tk == TokenOpenBrack)
                return "{";
            else if (tk == TokenCloseBrack)
                return "}";
            else if (tk == TokenEOF)
                return "$";
            else if (tk == TokenEQ)
                return "==";
            else if (tk == TokenID)
                return "one lowercase char a-z";
            else if (tk == TokenIf)
                return "if";
            else if (tk == TokenNEQ)
                return "!=";
            else if (tk == TokenNum)
                return "one digit";
            else if (tk == TokenOpenParen)
                return "(";
            else if (tk == TokenCloseParen)
                return ")";
            else if (tk == TokenPlus)
                return "+";
            else if (tk == TokenPrint)
                return "print";
            else if (tk == TokenString)
                return "string literal";
            else if (tk == TokenType)
                return "int, string or boolean";
            else if (tk == TokenWhile)
                return "while";
            else
                return "";

        }

    }

}