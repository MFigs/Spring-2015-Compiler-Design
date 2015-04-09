module TSC {

    export class Parser {

        private tokenCounter: number = 0;
        public currentNode: TSC.CSTNode = null;

        public constructor(){}

        public parse() {

            _OutputBufferParse = new Array<string>();
            parseErrorCount = 0;
            parseWarningCount = 0;
            parseMessageCount = 0;

            var rootNode = new CSTNode("Program");
            rootNode.isRoot = true;
            this.currentNode = rootNode;


            // Grab the next token.
            currentToken = _TokenStream[0];   //this.getNextToken();

            this.parseBlock();

            var newNode1 = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode1);
            this.match(TokenEOF);


        }

        private parseBlock() {

            var newNode = new TSC.CSTNode("Block");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            var newNode1 = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode1);
            this.match(TokenOpenBrack);

            this.parseStatementList();

            var newNode2 = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode2);
            this.match(TokenCloseBrack);

            this.currentNode = this.currentNode.parent;

        }

        private parseStatementList() {

            var newNode = new TSC.CSTNode("StatementList");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            var tk = currentToken.kind;

            if ((tk == TokenPrint)||(tk == TokenType)||(tk == TokenWhile)||(tk == TokenIf)||(tk == TokenOpenBrack)||(tk == TokenID)) {
                this.parseStatement();
                this.parseStatementList();

            }

            else {
                // Epsilon Transition - Do Nothing
            }

            this.currentNode = this.currentNode.parent;

        }

        private parseStatement() {

            var newNode = new TSC.CSTNode("Statement");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

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

            this.currentNode = this.currentNode.parent;

        }

        private parsePrint() {

            var newNode = new TSC.CSTNode("Print");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            var newNode1 = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode1);
            this.match(TokenPrint);

            var newNode2 = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode2);
            this.match(TokenOpenParen);

            this.parseExpr();

            var newNode3 = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode3);
            this.match(TokenCloseParen);

            this.currentNode = this.currentNode.parent;

        }

        private parseAssign() {

            var newNode = new TSC.CSTNode("Assign");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            this.parseID();

            var newNode1 = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode1);
            this.match(TokenAssign);

            this.parseExpr();

            this.currentNode = this.currentNode.parent;

        }

        private parseVarDecl() {

            var newNode = new TSC.CSTNode("VarDecl");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            this.parseType();
            this.parseID();

            this.currentNode = this.currentNode.parent;

        }

        private parseWhile() {

            var newNode = new TSC.CSTNode("While");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            var newNode1 = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode1);
            this.match(TokenWhile);

            this.parseBoolExpr();
            this.parseBlock();

            this.currentNode = this.currentNode.parent;

        }

        private parseIf() {

            var newNode = new TSC.CSTNode("If");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            var newNode1 = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode1);
            this.match(TokenIf);

            this.parseBoolExpr();
            this.parseBlock();

            this.currentNode = this.currentNode.parent;

        }

        private parseExpr() {

            var newNode = new TSC.CSTNode("Expr");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

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

            this.currentNode = this.currentNode.parent;

        }

        private parseIntExpr() {

            var newNode = new TSC.CSTNode("IntExpr");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            var nextToken: Token = this.getNextToken();

            this.parseDigit();

            if (nextToken.kind == TokenPlus) {

                this.parseIntOp();
                this.parseExpr();

            }

            this.currentNode = this.currentNode.parent;

        }

        private parseString() {

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);
            this.match(TokenString);

        }

        private parseBoolExpr() {

            var newNode = new TSC.CSTNode("BoolExpr");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            var tk = currentToken.kind;

            if (tk == TokenOpenParen) {

                var newNode1 = new TSC.CSTNode(currentToken.tokenValue);
                this.currentNode.addChild(newNode1);
                this.match(TokenOpenParen);

                this.parseExpr();
                this.parseBoolOp();
                this.parseExpr();

                var newNode2 = new TSC.CSTNode(currentToken.tokenValue);
                this.currentNode.addChild(newNode2);
                this.match(TokenCloseParen);

            }

            else if (tk == TokenBool) {

                this.parseBoolVal();

            }

            else {
                _OutputBufferParse[parseErrorCount + parseWarningCount + parseMessageCount] = "Parse Error: Line " + currentToken.lineNumber + ", Found " + currentToken.tokenValue + ", Expecting token of value true, false or (";
                parseErrorCount++;
            }

            this.currentNode = this.currentNode.parent;

        }

        private parseID() {

            var newNode = new TSC.CSTNode("ID");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            this.parseChar();

            this.currentNode = this.currentNode.parent;

        }

        private parseType() {

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);
            this.match(TokenType);

        }

        private parseChar() {

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);
            this.match(TokenID);

        }

        private parseDigit() {

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);
            this.match(TokenNum);

        }

        private parseBoolOp() {

            var newNode = new TSC.CSTNode("BoolOp");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            if (currentToken.kind == TokenNEQ) {

                var newNode1 = new TSC.CSTNode(currentToken.tokenValue);
                this.currentNode.addChild(newNode1);
                this.match(TokenNEQ);

            }
            else if (currentToken.kind == TokenEQ) {

                var newNode2 = new TSC.CSTNode(currentToken.tokenValue);
                this.currentNode.addChild(newNode2);
                this.match(TokenEQ);

            }
            else {
                _OutputBufferParse[parseErrorCount + parseWarningCount + parseMessageCount] = "Parse Error: Line " + currentToken.lineNumber + ", Found " + currentToken.tokenValue + ", Expecting token of value == or !=";
                parseErrorCount++;
            }

            this.currentNode = this.currentNode.parent;

        }

        private parseBoolVal() {

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);
            this.match(TokenBool);

        }

        private parseIntOp() {

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);
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

        /*public createCST() {

            var rootNode = new CSTNode();
            rootNode.isRoot = true;
            var currentNode

        }*/

    }

}