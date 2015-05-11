var TSC;
(function (TSC) {
    var Parser = (function () {
        function Parser() {
            this.tokenCounter = 0;
            //public tempTokenVal1: string = "";
            //public tempTokenVal2: string = "";
            //public tempTokenVal3: string = "";
            this.treeOutput = "";
            this.treeOutputAST = "";
            this.symbolTreeOutput = "";
            this.scopeCount = 0;
            this.currentScope = null;
            this.terminatedScopeSearch = false;
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
            var newNode = new TSC.CSTNode("PrintStatement");
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
            var newNode = new TSC.CSTNode("AssignStatement");
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
            var randomNode = new TSC.CSTNode("StringExpr");
            this.currentNode.addChild(randomNode);
            this.currentNode = randomNode;

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);

            /*var newANode = new TSC.ASTNode(currentToken.tokenValue);
            this.currASTNode.addChild(newANode);*/
            this.match(TokenString);

            this.currentNode = this.currentNode.parent;
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

            this.currentNode = this.currentNode.parent;
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

            this.currentNode = this.currentNode.parent;
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

            this.currentNode = this.currentNode.parent;
        };

        Parser.prototype.parseBoolOp = function () {
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

            this.currentNode = this.currentNode.parent;
        };

        Parser.prototype.parseIntOp = function () {
            var randomNode = new TSC.CSTNode("IntOp");
            this.currentNode.addChild(randomNode);
            this.currentNode = randomNode;

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);

            //this.tempTokenVal2 = currentToken.tokenValue;
            this.match(TokenPlus);

            this.currentNode = this.currentNode.parent;
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

                for (var s = 0; s < depth; s++) {
                    this.treeOutput = this.treeOutput + "|..";
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

            //_AST = this.currentASTNode;
            _AST = ASTRoot;
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
                    this.currentASTNode = this.currentASTNode.parent;
                } else if (tempNode.printValue == "StatementList") {
                    this.processCSTChildren(tempNode);
                } else if (tempNode.printValue == "Statement") {
                    this.processCSTChildren(tempNode);
                } else if (tempNode.printValue == "PrintStatement") {
                    var n2 = new TSC.ASTNode("Print");
                    n2.lineNum = tempNode.lineNum;
                    this.currentASTNode.addChild(n2);
                    this.currentASTNode = n2;

                    this.processCSTChildren(tempNode);
                    this.currentASTNode = this.currentASTNode.parent;
                } else if (tempNode.printValue == "AssignStatement") {
                    var n3 = new TSC.ASTNode("Assign");
                    n3.lineNum = tempNode.lineNum;
                    this.currentASTNode.addChild(n3);
                    this.currentASTNode = n3;

                    this.processCSTChildren(tempNode);
                    this.currentASTNode = this.currentASTNode.parent;
                } else if (tempNode.printValue == "VarDecl") {
                    var n31 = new TSC.ASTNode("VarDecl");
                    n31.lineNum = tempNode.lineNum;
                    this.currentASTNode.addChild(n31);
                    this.currentASTNode = n31;

                    this.processCSTChildren(tempNode);
                    this.currentASTNode = this.currentASTNode.parent;
                } else if (tempNode.printValue == "While") {
                    this.createWhileTree(tempNode);
                } else if (tempNode.printValue == "If") {
                    this.createIfTree(tempNode);
                } else if (tempNode.printValue == "Expr") {
                    this.processCSTChildren(tempNode);
                } else if (tempNode.printValue == "IntExpr") {
                    if (tempNode.childCount == 1) {
                        this.processCSTChildren(tempNode);
                    } else {
                        this.createIntExprTree(tempNode);
                    }
                } else if (tempNode.printValue == "StringExpr") {
                    var n4 = new TSC.ASTNode((tempNode.children[0]).printValue);
                    n4.lineNum = tempNode.children[0].lineNum;
                    this.currentASTNode.addChild(n4);
                    //this.currentASTNode = n4;
                } else if (tempNode.printValue == "BoolExpr") {
                    if (tempNode.childCount == 1) {
                        this.processCSTChildren(tempNode);
                    } else {
                        this.createBoolExprTree(tempNode);
                    }
                } else if (tempNode.printValue == "ID") {
                    this.processCSTChildren(tempNode);
                } else if (tempNode.printValue == "Char") {
                    var n5 = new TSC.ASTNode((tempNode.children[0]).printValue);
                    n5.lineNum = tempNode.children[0].lineNum;
                    this.currentASTNode.addChild(n5);
                    //this.currentASTNode = n5;
                } else if (tempNode.printValue == "Type") {
                    var n6 = new TSC.ASTNode(tempNode.children[0].printValue);
                    n6.lineNum = tempNode.lineNum;
                    this.currentASTNode.addChild(n6);
                    //this.currentASTNode = n6;
                } else if (tempNode.printValue == "Digit") {
                    var n7 = new TSC.ASTNode((tempNode.children[0]).printValue);
                    n7.lineNum = tempNode.children[0].lineNum;
                    this.currentASTNode.addChild(n7);
                    //this.currentASTNode = n7;
                } else if (tempNode.printValue == "BoolOp") {
                    var n8 = new TSC.ASTNode((tempNode.children[0]).printValue);
                    n8.lineNum = tempNode.children[0].lineNum;
                    this.currentASTNode.addChild(n8);
                    //this.currentASTNode = n8;
                } else if (tempNode.printValue == "BoolVal") {
                    var n9 = new TSC.ASTNode((tempNode.children[0]).printValue);
                    n9.lineNum = tempNode.children[0].lineNum;
                    this.currentASTNode.addChild(n9);
                    //this.currentASTNode = n9;
                } else if (tempNode.printValue == "IntOp") {
                    var n10 = new TSC.ASTNode((tempNode.children[0]).printValue);
                    n10.lineNum = tempNode.children[0].lineNum;
                    this.currentASTNode.addChild(n10);
                    //this.currentASTNode = n10;
                } else {
                    // Do Nothing
                }
            }
        };

        Parser.prototype.createIntExprTree = function (node) {
            var n = new TSC.ASTNode((node.children[1]).children[0].printValue);
            n.lineNum = node.children[1].lineNum;
            this.currentASTNode.addChild(n);
            this.currentASTNode = n;

            var digit = new TSC.ASTNode((node.children[0]).children[0].printValue);
            digit.lineNum = (node.children[0]).children[0].lineNum;
            this.currentASTNode.addChild(digit);

            this.processCSTChildren(node.children[2]);
            this.currentASTNode = this.currentASTNode.parent;
        };

        Parser.prototype.createBoolExprTree = function (node) {
            var n = new TSC.ASTNode(node.children[2].children[0].printValue);
            n.lineNum = node.children[2].lineNum;
            this.currentASTNode.addChild(n);
            this.currentASTNode = n;

            this.processCSTChildren(node.children[1]);
            this.processCSTChildren(node.children[3]);
            this.currentASTNode = this.currentASTNode.parent;
        };

        Parser.prototype.createWhileTree = function (node) {
            var n = new TSC.ASTNode("While");
            n.lineNum = node.lineNum;
            this.currentASTNode.addChild(n);
            this.currentASTNode = n;

            this.createBoolExprTree(node.children[1]);

            var block = new TSC.ASTNode("Block");
            block.lineNum = node.lineNum;
            this.currentASTNode.addChild(block);
            this.currentASTNode = block;
            this.processCSTChildren(node.children[2]);
            this.currentASTNode = this.currentASTNode.parent;
            this.currentASTNode = this.currentASTNode.parent; //.parent;
        };

        Parser.prototype.createIfTree = function (node) {
            var n = new TSC.ASTNode("If");
            n.lineNum = node.lineNum;
            this.currentASTNode.addChild(n);
            this.currentASTNode = n;

            this.createBoolExprTree(node.children[1]);

            var block = new TSC.ASTNode("Block");
            block.lineNum = node.lineNum;
            this.currentASTNode.addChild(block);
            this.currentASTNode = block;
            this.processCSTChildren(node.children[2]);
            this.currentASTNode = this.currentASTNode.parent;
            this.currentASTNode = this.currentASTNode.parent; //.parent;
        };

        Parser.prototype.displayAST = function () {
            this.treeOutputAST = "\n------------------------------------\nAbstract Syntax Tree (AST):\n------------------------------------\n\n";
            this.treeOutputAST = this.treeOutputAST + _AST.printValue;

            //console.log(_AST.printValue + " ?");
            this.processASTChildren(_AST, 1);
            _ASTDisplay = this.treeOutputAST;
        };

        Parser.prototype.processASTChildren = function (node, depth) {
            for (var i = 0; i < node.childCount; i++) {
                this.treeOutputAST = this.treeOutputAST + "\n";

                for (var s = 0; s < depth; s++) {
                    this.treeOutputAST = this.treeOutputAST + "|..";
                }

                this.treeOutputAST = this.treeOutputAST + node.children[i].printValue;

                //console.log(node.children[i].printValue + " ?");
                this.processASTChildren(node.children[i], depth + 1);
            }
        };

        Parser.prototype.createSymbolTable = function () {
            _OutputBufferSA = new Array();

            this.currentNode = _CST.children[0];
            var symbolTableRoot = new TSC.Scope(this.scopeCount);
            symbolTableRoot.isRootScope = true;
            this.scopeCount++;
            this.currentScope = symbolTableRoot;

            _OutputBufferSA.push("Entering Scope " + this.currentScope.scopeLevel + "...\n");
            this.processScopeFromCST(this.currentNode);

            _OutputBufferSA.push("Exiting Scope " + this.currentScope.scopeLevel + "...\n");
            this.checkForUnusedVariables(symbolTableRoot);

            _SymbolTable = symbolTableRoot;
            var tempString = "";
            for (var t = 0; t < _OutputBufferSA.length; t++) {
                tempString = tempString + _OutputBufferSA[t];
            }
            _SAErrorOutput = tempString;
        };

        Parser.prototype.processScopeFromCST = function (node) {
            for (var q = 0; q < node.childCount; q++) {
                var child = node.children[q];

                //console.log(child.printValue);
                if (child.printValue == "Block") {
                    var newScope = new TSC.Scope(this.scopeCount);
                    this.scopeCount++;
                    newScope.addParentScope(this.currentScope);
                    this.currentScope = newScope;
                    _OutputBufferSA.push("Entering Scope " + this.currentScope.scopeLevel + "...\n");
                    this.processScopeFromCST(child);
                    _OutputBufferSA.push("Exiting Scope " + this.currentScope.scopeLevel + "...\n");
                    this.currentScope = this.currentScope.parentScope;
                } else if (child.printValue == "VarDecl") {
                    var variName = ((child.children[1]).children[0]).children[0].printValue;
                    var variType = (child.children[0]).children[0].printValue;

                    var newVar = new TSC.Variable(variName, variType, child.lineNum);
                    var redeclaredVars = false;
                    var varPosition = 0;

                    for (var v = 0; v < this.currentScope.variables.length; v++) {
                        if (this.currentScope.variables[v].variableName == newVar.variableName) {
                            redeclaredVars = true;
                            varPosition = v;
                        }
                    }
                    if (redeclaredVars) {
                        _OutputBufferSA.push("*** Error: Redeclared variable in same scope, variable " + newVar.variableName + " declared on lines " + this.currentScope.variables[varPosition].lineNumber + " and line " + newVar.lineNumber + " ***\n");
                        continueExecution = false;
                    } else {
                        this.currentScope.variables.push(newVar);
                        _OutputBufferSA.push("Variable " + newVar.variableName + " declared in scope " + this.currentScope.scopeLevel + "\n");
                    }
                } else if (child.printValue == "AssignStatement") {
                    //console.log("assign found");
                    // Params: Current Scope Object, ID Variable Assigned to, Type of Expr Assigned to Variable, Line Number of Statement, Non-Terminal Referenced
                    this.searchScopeHierarchy(this.currentScope, ((child.children[0]).children[0]).children[0].printValue, (child.children[2]).children[0].printValue, child.children[0].lineNum, "Assign");

                    this.terminatedScopeSearch = false;

                    this.processScopeFromCST(child.children[2]);
                } else if (child.printValue == "Char") {
                    // Params: Current Scope Object, ID Variable Referenced, N/A, Line Number of Statement, Non-Terminal Referenced
                    this.searchScopeHierarchy(this.currentScope, child.children[0].printValue, "", child.children[0].lineNum, "Char");

                    this.terminatedScopeSearch = false;
                } else if ((child.printValue == "IntExpr") && (child.childCount > 1)) {
                    //console.log("IntExprFound");
                    this.typeCheckIntExpr(child);
                } else {
                    this.processScopeFromCST(child);
                }
            }
        };

        Parser.prototype.typeCheckIntExpr = function (child) {
            //var typeMatches: boolean = true;
            //console.log("   " + child.printValue + " " + child.lineNum);
            //console.log("Type Checking IntExpr");
            //console.log(child.children[2].children[0].children[0].printValue);
            if ((child.children[2] != null) && (child.children[2].children[0].printValue == "IntExpr") && (child.children[2].children[0].childCount > 1)) {
                this.typeCheckIntExpr(child.children[2]);
            } else if ((child.children[2] != null) && (child.children[2].children[0].children[0].printValue == "Char")) {
                var variable = child.children[2].children[0].children[0].children[0];

                //console.log("::: " + variable.printValue);
                var varType = this.typeCheckScopeSearch(this.currentScope, variable.printValue, variable.lineNum);

                //console.log("type found: " + varType);
                if (varType != "int") {
                    _OutputBufferSA.push("*** Error: Type Mismatch on line " + variable.lineNum + "; Expecting variable of type int, Found variable of type " + varType + " ***\n");
                }
            } else if ((child.children[2] != null) && (child.children[2].children[0].printValue == "IntExpr") && (child.children[2].children[0].childCount == 1)) {
                //Passes Type Check
            } else {
                _OutputBufferSA.push("*** Error: Type Mismatch on line " + child.children[2].lineNum + "; Expecting variable of type int or digit, Found " + child.children[2].children[0].printValue + " ***\n");
            }
        };

        Parser.prototype.typeCheckScopeSearch = function (scope, varName, lineNum) {
            var varFoundInScope = false;

            for (var v = 0; v < scope.variables.length; v++) {
                if (scope.variables[v].variableName == varName) {
                    varFoundInScope = true;

                    //console.log("Found var " + varName + " in scope " + scope.scopeLevel + " of type " + scope.variables[v].variableType);
                    return scope.variables[v].variableType;
                }
            }
            if (!varFoundInScope) {
                if (scope.parentScope == null) {
                    return "";
                } else {
                    return this.typeCheckScopeSearch(scope.parentScope, varName, lineNum);
                }
            }
        };

        Parser.prototype.searchScopeHierarchy = function (scope, varName, assignValue, lineNum, searchType) {
            //console.log("scope = " + scope + " || " + varName + " " + assignValue + " " + lineNum);
            if (searchType == "Assign") {
                //console.log("Looking for " + varName + " in scope " + scope.scopeLevel);
                if (!this.terminatedScopeSearch) {
                    var varFoundInScope = false;

                    for (var v = 0; v < scope.variables.length; v++) {
                        if (scope.variables[v].variableName == varName) {
                            //console.log(varName + " found!");
                            varFoundInScope = true;
                            this.terminatedScopeSearch = true;
                            this.typeCheckAssign(scope, varName, assignValue, lineNum);
                            scope.variables[v].variableUsed = true;
                            scope.variables[v].variableInitialized = true;
                            _OutputBufferSA.push("Variable " + varName + " from scope " + scope.scopeLevel + " assigned value on line " + lineNum + "\n");
                        }
                    }
                    if (!this.terminatedScopeSearch) {
                        if (scope.isRootScope) {
                            if (!varFoundInScope) {
                                _OutputBufferSA.push("*** Error: Undeclared variable " + varName + " used on line " + lineNum + " ***\n");
                                continueExecution = false;
                                this.terminatedScopeSearch = true;
                            }
                        } else {
                            this.searchScopeHierarchy(scope.parentScope, varName, assignValue, lineNum, "Assign");
                        }
                    }
                }
            } else if (searchType == "Char") {
                if (!this.terminatedScopeSearch) {
                    var varFoundInScope = false;

                    for (var v = 0; v < scope.variables.length; v++) {
                        if (scope.variables[v].variableName == varName) {
                            varFoundInScope = true;
                            this.terminatedScopeSearch = true;
                            scope.variables[v].variableUsed = true;
                            if (!scope.variables[v].variableInitialized)
                                _OutputBufferSA.push("** Warning: Variable " + scope.variables[v].variableName + " used on line " + scope.variables[v].lineNumber + " but never initialized **\n");
                        }
                    }
                    if (!this.terminatedScopeSearch) {
                        if (scope.parentScope == null) {
                            if (!varFoundInScope) {
                                _OutputBufferSA.push("*** Error: Undeclared variable " + varName + " used on line " + lineNum + " ***\n");
                                continueExecution = false;
                                this.terminatedScopeSearch = true;
                            }
                        } else {
                            this.searchScopeHierarchy(scope.parentScope, varName, assignValue, lineNum, "Char");
                        }
                    }
                }
            }
        };

        Parser.prototype.typeCheckAssign = function (sc, vName, vType, lNum) {
            var foundVariable = null;

            for (var v = 0; v < sc.variables.length; v++) {
                if (sc.variables[v].variableName == vName) {
                    foundVariable = sc.variables[v];
                }
            }

            if (vType == "IntExpr") {
                vType = "int";
            } else if (vType == "BoolExpr") {
                vType = "boolean";
            } else if (vType == "StringExpr") {
                vType = "string";
            }

            if (vType != foundVariable.variableType) {
                _OutputBufferSA.push("*** Error: Type Mismatch on line " + lNum + "; Attempted to assign value of type " + vType + " to variable of type " + foundVariable.variableType + " ***\n");
                continueExecution = false;
            }
        };

        Parser.prototype.checkForUnusedVariables = function (sc) {
            for (var x = 0; x < sc.variables.length; x++) {
                if (!sc.variables[x].variableInitialized && !sc.variables[x].variableUsed) {
                    _OutputBufferSA.push("** Warning: Variable " + sc.variables[x].variableName + " declared on line " + sc.variables[x].lineNumber + " but is never used **\n");
                }
            }

            for (var y = 0; y < sc.childrenScopes.length; y++)
                this.checkForUnusedVariables(sc.childrenScopes[y]);
        };

        Parser.prototype.displaySymbolTable = function () {
            this.symbolTreeOutput = "\n------------------------------------\nSymbol Table:\n------------------------------------\n\n";
            this.processChildrenST(_SymbolTable);
            _SymTabDisplay = this.symbolTreeOutput;
        };

        Parser.prototype.processChildrenST = function (node) {
            this.symbolTreeOutput = this.symbolTreeOutput + "Scope " + node.scopeLevel + ":\n--------------------\nID / Type / Line # / Initialized / Used";

            for (var i = 0; i < node.variables.length; i++) {
                this.symbolTreeOutput = this.symbolTreeOutput + "\n\n";
                this.symbolTreeOutput = this.symbolTreeOutput + node.variables[i].variableName + " / " + node.variables[i].variableType + " / " + node.variables[i].lineNumber + " / " + node.variables[i].variableInitialized + " / " + node.variables[i].variableUsed;
            }
            this.symbolTreeOutput = this.symbolTreeOutput + "\n\n";

            for (var j = 0; j < node.childrenScopes.length; j++) {
                this.processChildrenST(node.childrenScopes[j]);
            }
        };
        return Parser;
    })();
    TSC.Parser = Parser;
})(TSC || (TSC = {}));
