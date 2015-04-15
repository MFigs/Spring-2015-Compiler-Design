var TSC;
(function (TSC) {
    var Parser = (function () {
        function Parser() {
            this.tokenCounter = 0;
            //public tempTokenVal1: string = "";
            //public tempTokenVal2: string = "";
            //public tempTokenVal3: string = "";
            this.treeOutput = "";
        }
        Parser.prototype.parse = function () {
            _OutputBufferParse = new Array();
            parseErrorCount = 0;
            parseWarningCount = 0;
            parseMessageCount = 0;

            var rootNode = new TSC.CSTNode("Program");
            rootNode.isRoot = true;
            this.currentNode = rootNode;

            /*var ASTRoot = new TSC.ASTNode("Program");
            ASTRoot.isRoot = true;
            this.currASTNode = ASTRoot;*/
            // Grab the next token.
            currentToken = _TokenStream[0]; //this.getNextToken();

            this.parseBlock();

            var newNode1 = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode1);
            this.match(TokenEOF);

            _CST = rootNode;
        };

        Parser.prototype.parseBlock = function () {
            var newNode = new TSC.CSTNode("Block");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            /*var newANode = new TSC.ASTNode("Block");
            this.currASTNode.addChild(newANode);
            this.currASTNode = newANode;*/
            var newNode1 = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode1);
            this.match(TokenOpenBrack);

            this.parseStatementList();

            var newNode2 = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode2);
            this.match(TokenCloseBrack);

            this.currentNode = this.currentNode.parent;
            //this.currASTNode = this.currASTNode.parent;
        };

        Parser.prototype.parseStatementList = function () {
            var newNode = new TSC.CSTNode("StatementList");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            var tk = currentToken.kind;

            if ((tk == TokenPrint) || (tk == TokenType) || (tk == TokenWhile) || (tk == TokenIf) || (tk == TokenOpenBrack) || (tk == TokenID)) {
                this.parseStatement();
                this.parseStatementList();
            } else {
                // Epsilon Transition - Do Nothing
            }

            this.currentNode = this.currentNode.parent;
        };

        Parser.prototype.parseStatement = function () {
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
        };

        Parser.prototype.parsePrint = function () {
            var newNode = new TSC.CSTNode("Print");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            /*var newANode = new TSC.ASTNode("Print");
            this.currASTNode.addChild(newANode);
            this.currASTNode = newANode;*/
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
            //this.currASTNode = this.currASTNode.parent;
        };

        Parser.prototype.parseAssign = function () {
            var newNode = new TSC.CSTNode("Assign");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            /*var newANode = new TSC.ASTNode("Assign");
            this.currASTNode.addChild(newANode);
            this.currASTNode = newANode;*/
            this.parseID();

            var newNode1 = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode1);
            this.match(TokenAssign);

            this.parseExpr();

            this.currentNode = this.currentNode.parent;
            //this.currASTNode = this.currASTNode.parent;
        };

        Parser.prototype.parseVarDecl = function () {
            var newNode = new TSC.CSTNode("VarDecl");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            /*var newANode = new TSC.ASTNode("VarDecl");
            this.currASTNode.addChild(newANode);
            this.currASTNode = newANode;*/
            this.parseType();
            this.parseID();

            this.currentNode = this.currentNode.parent;
            //this.currASTNode = this.currASTNode.parent;
        };

        Parser.prototype.parseWhile = function () {
            var newNode = new TSC.CSTNode("While");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            /*var newANode = new TSC.ASTNode("While");
            this.currASTNode.addChild(newANode);
            this.currASTNode = newANode;*/
            var newNode1 = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode1);
            this.match(TokenWhile);

            this.parseBoolExpr();
            this.parseBlock();

            this.currentNode = this.currentNode.parent;
            //this.currASTNode = this.currASTNode.parent;
        };

        Parser.prototype.parseIf = function () {
            var newNode = new TSC.CSTNode("If");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            /*var newANode = new TSC.ASTNode("If");
            this.currASTNode.addChild(newANode);
            this.currASTNode = newANode;*/
            var newNode1 = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode1);
            this.match(TokenIf);

            this.parseBoolExpr();
            this.parseBlock();

            this.currentNode = this.currentNode.parent;
            //this.currASTNode = this.currASTNode.parent;
        };

        Parser.prototype.parseExpr = function () {
            var newNode = new TSC.CSTNode("Expr");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            var tk = currentToken.kind;

            if (tk == TokenNum) {
                this.parseIntExpr();
            } else if (tk == TokenString) {
                this.parseString();
            } else if ((tk == TokenOpenParen) || (tk == TokenBool)) {
                this.parseBoolExpr();
            } else if (tk == TokenID) {
                this.parseID();
            } else {
                _OutputBufferParse[parseErrorCount + parseWarningCount + parseMessageCount] = "Parse Error: Line " + currentToken.lineNumber + ", Found " + currentToken.tokenValue + ", Expecting (, true, false, a digit, a string, or a char from a-z.";
                parseErrorCount++;
            }

            this.currentNode = this.currentNode.parent;
        };

        Parser.prototype.parseIntExpr = function () {
            var newNode = new TSC.CSTNode("IntExpr");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            //TODO: HANDLE INTEXPR TREE FORMAT, MAYBE PUT AFTER PARSES?
            var nextToken = this.getNextToken();

            //this.tempTokenVal1 = currentToken.tokenValue;
            this.parseDigit();

            if (nextToken.kind == TokenPlus) {
                this.parseIntOp();
                this.parseExpr();
            }

            this.currentNode = this.currentNode.parent;
            //this.currASTNode = this.currASTNode.parent;
        };

        Parser.prototype.parseString = function () {
            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);

            /*var newANode = new TSC.ASTNode(currentToken.tokenValue);
            this.currASTNode.addChild(newANode);*/
            this.match(TokenString);
        };

        Parser.prototype.parseBoolExpr = function () {
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
            } else if (tk == TokenBool) {
                this.parseBoolVal();
            } else {
                _OutputBufferParse[parseErrorCount + parseWarningCount + parseMessageCount] = "Parse Error: Line " + currentToken.lineNumber + ", Found " + currentToken.tokenValue + ", Expecting token of value true, false or (";
                parseErrorCount++;
            }

            this.currentNode = this.currentNode.parent;
        };

        Parser.prototype.parseID = function () {
            var newNode = new TSC.CSTNode("ID");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            this.parseChar();

            this.currentNode = this.currentNode.parent;
        };

        Parser.prototype.parseType = function () {
            var randomNode = new TSC.CSTNode("Type");
            this.currentNode.addChild(randomNode);
            this.currentNode = randomNode;

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);

            //var newANode = new TSC.ASTNode(currentToken.tokenValue);
            //this.currASTNode.addChild(newANode);
            this.match(TokenType);
        };

        Parser.prototype.parseChar = function () {
            var randomNode = new TSC.CSTNode("Char");
            this.currentNode.addChild(randomNode);
            this.currentNode = randomNode;

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);

            //var newANode = new TSC.ASTNode(currentToken.tokenValue);
            //this.currASTNode.addChild(newANode);
            this.match(TokenID);
        };

        Parser.prototype.parseDigit = function () {
            var randomNode = new TSC.CSTNode("Digit");
            this.currentNode.addChild(randomNode);
            this.currentNode = randomNode;

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);

            //var newANode = new TSC.ASTNode(currentToken.tokenValue);
            //this.currASTNode.addChild(newANode);
            this.match(TokenNum);
        };

        Parser.prototype.parseBoolOp = function () {
            //TODO: ADD TEMP VARIABLES TO PARSER CLASS TO HANDLE INTEXPR AND BOOLOP COMPARISON TREE STRUCTURE
            var newNode = new TSC.CSTNode("BoolOp");
            this.currentNode.addChild(newNode);
            this.currentNode = newNode;

            if (currentToken.kind == TokenNEQ) {
                var newNode1 = new TSC.CSTNode(currentToken.tokenValue);
                this.currentNode.addChild(newNode1);
                this.match(TokenNEQ);
            } else if (currentToken.kind == TokenEQ) {
                var newNode2 = new TSC.CSTNode(currentToken.tokenValue);
                this.currentNode.addChild(newNode2);
                this.match(TokenEQ);
            } else {
                _OutputBufferParse[parseErrorCount + parseWarningCount + parseMessageCount] = "Parse Error: Line " + currentToken.lineNumber + ", Found " + currentToken.tokenValue + ", Expecting token of value == or !=";
                parseErrorCount++;
            }

            this.currentNode = this.currentNode.parent;
        };

        Parser.prototype.parseBoolVal = function () {
            var randomNode = new TSC.CSTNode("BoolVal");
            this.currentNode.addChild(randomNode);
            this.currentNode = randomNode;

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);
            this.match(TokenBool);
        };

        Parser.prototype.parseIntOp = function () {
            var randomNode = new TSC.CSTNode("IntOp");
            this.currentNode.addChild(randomNode);
            this.currentNode = randomNode;

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);

            //this.tempTokenVal2 = currentToken.tokenValue;
            this.match(TokenPlus);
        };

        Parser.prototype.getNextToken = function () {
            var thisToken;
            if (this.tokenCounter < _TokenStream.length) {
                // If we're not at EOF, then return the next token in the stream.
                thisToken = _TokenStream[this.tokenCounter + 1];
            } else {
                thisToken = _TokenStream[_TokenStream.length - 1];
                console.log("Tried to get token past array bounds");
            }

            return thisToken;
        };

        Parser.prototype.match = function (expectedTokenKind) {
            //console.log(expectedTokenKind + " : " + currentToken.kind + " : " + this.describeTokenKind(expectedTokenKind) + " : " + currentToken.tokenValue);
            if (expectedTokenKind != currentToken.kind) {
                _OutputBufferParse[parseErrorCount + parseWarningCount + parseMessageCount] = "Parse Error: Line " + currentToken.lineNumber + ", Found " + currentToken.tokenValue + ", Expecting token of value " + this.describeTokenKind(expectedTokenKind);
                parseErrorCount++;

                this.tokenCounter++;
                if (this.tokenCounter < _TokenStream.length)
                    currentToken = _TokenStream[this.tokenCounter];
            } else {
                _OutputBufferParse[parseErrorCount + parseWarningCount + parseMessageCount] = "Token Accepted: Expecting token of value " + this.describeTokenKind(expectedTokenKind) + ", found token of value " + currentToken.tokenValue;
                parseMessageCount++;

                // Parse Passes at this Token, Progress to Next Token
                this.tokenCounter++;
                if (this.tokenCounter < _TokenStream.length)
                    currentToken = _TokenStream[this.tokenCounter];
            }
        };

        Parser.prototype.describeTokenKind = function (tk) {
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
        };

        Parser.prototype.displayCST = function () {
            this.treeOutput = "\n------------------------------------\nConcrete Syntax Tree (CST):\n------------------------------------\n\n";
            this.treeOutput = this.treeOutput + _CST.printValue;
            this.processChildren(_CST, 1);
            _CSTDisplay = this.treeOutput;
        };

        Parser.prototype.processChildren = function (node, depth) {
            for (var i = 0; i < node.childCount; i++) {
                this.treeOutput = this.treeOutput + "\n";

                for (var s = 0; s < depth * 2; s++) {
                    this.treeOutput = this.treeOutput + ".";
                }

                this.treeOutput = this.treeOutput + node.children[i].printValue;
                this.processChildren(node.children[i], depth + 1);
            }
        };

        Parser.prototype.convertCSTToAST = function () {
            var ASTRoot = new TSC.ASTNode("Program");
            ASTRoot.isRoot = true;
            this.currentASTNode = ASTRoot;

            this.currentNode = _CST;

            this.processCSTChildren(this.currentNode);
        };

        Parser.prototype.processCSTChildren = function (node) {
            for (var i = 0; i < node.childCount; i++) {
                var tempNode = node.children[i];

                if (tempNode.printValue == "Block") {
                    var n1 = new TSC.ASTNode("Block");
                    n1.lineNum = tempNode.lineNum;
                    this.currentASTNode.addChild(n1);
                    this.currentASTNode = n1;

                    this.processCSTChildren(tempNode);
                } else if (tempNode.printValue == "StatementList") {
                    this.processCSTChildren(tempNode);
                } else if (tempNode.printValue == "Statement") {
                    this.processCSTChildren(tempNode);
                } else if (tempNode.printValue == "Print") {
                    var n2 = new TSC.ASTNode("Print");
                    n2.lineNum = tempNode.lineNum;
                    this.currentASTNode.addChild(n2);
                    this.currentASTNode = n2;

                    this.processCSTChildren(tempNode);
                } else if (tempNode.printValue == "Assign") {
                    var n3 = new TSC.ASTNode("Assign");
                    n3.lineNum = tempNode.lineNum;
                    this.currentASTNode.addChild(n3);
                    this.currentASTNode = n3;

                    this.processCSTChildren(tempNode);
                } else if (tempNode.printValue == "VarDecl") {
                    var n3 = new TSC.ASTNode("Assign");
                    n3.lineNum = tempNode.lineNum;
                    this.currentASTNode.addChild(n3);
                    this.currentASTNode = n3;

                    this.processCSTChildren(tempNode);
                } else if (tempNode.printValue == "While") {
                    //
                } else if (tempNode.printValue == "If") {
                    //
                } else if (tempNode.printValue == "Expr") {
                    this.processCSTChildren(tempNode);
                } else if (tempNode.printValue == "IntExpr") {
                    //TODO: Write IntExpr Structure
                } else if (tempNode.printValue == "String") {
                    var n4 = new TSC.ASTNode((tempNode.children[0]).printValue);
                    n4.lineNum = tempNode.children[0].lineNum;
                    this.currentASTNode.addChild(n4);
                    this.currentASTNode = n4;
                } else if (tempNode.printValue == "BoolExpr") {
                    //TODO: Write BoolExpr Structure
                } else if (tempNode.printValue == "ID") {
                    var n5 = new TSC.ASTNode((tempNode.children[0]).printValue);
                    n5.lineNum = tempNode.children[0].lineNum;
                    this.currentASTNode.addChild(n5);
                    this.currentASTNode = n5;
                } else if ((tempNode.printValue == "int") || (tempNode.printValue == "string") || (tempNode.printValue == "boolean")) {
                    var n6 = new TSC.ASTNode(tempNode.printValue);
                    n6.lineNum = tempNode.lineNum;
                    this.currentASTNode.addChild(n6);
                    this.currentASTNode = n6;
                } else if (true)
                    ;
            }
        };
        return Parser;
    })();
    TSC.Parser = Parser;
})(TSC || (TSC = {}));
