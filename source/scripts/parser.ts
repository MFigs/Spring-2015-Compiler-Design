module TSC {

    export class Parser {

        private tokenCounter: number = 0;
        public currentNode: TSC.CSTNode;
        public currentASTNode: TSC.ASTNode;

        //public tempTokenVal1: string = "";
        //public tempTokenVal2: string = "";
        //public tempTokenVal3: string = "";

        public treeOutput: string = "";
        public treeOutputAST: string = "";
        public symbolTreeOutput: string = "";
        public scopeCount: number = 0;
        public currentScope: TSC.Scope = null;

        private terminatedScopeSearch: boolean = false;

        public constructor(){}

        public parse() {

            _OutputBufferParse = new Array<string>();
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
            currentToken = _TokenStream[0];   //this.getNextToken();

            this.parseBlock();

            var newNode1 = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode1);
            this.match(TokenEOF);

            _CST = rootNode;


        }

        private parseBlock() {

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

        }

        private parseAssign() {

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

        }

        private parseVarDecl() {

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

        }

        private parseWhile() {

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

        }

        private parseIf() {

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

            //TODO: HANDLE INTEXPR TREE FORMAT, MAYBE PUT AFTER PARSES?


            var nextToken: Token = this.getNextToken();

            //this.tempTokenVal1 = currentToken.tokenValue;

            this.parseDigit();

            if (nextToken.kind == TokenPlus) {

                this.parseIntOp();
                this.parseExpr();

            }

            this.currentNode = this.currentNode.parent;
            //this.currASTNode = this.currASTNode.parent;

        }

        private parseString() {

            var randomNode = new TSC.CSTNode("StringExpr");
            this.currentNode.addChild(randomNode);
            this.currentNode = randomNode;

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);

            /*var newANode = new TSC.ASTNode(currentToken.tokenValue);
            this.currASTNode.addChild(newANode);*/

            this.match(TokenString);

            this.currentNode = this.currentNode.parent;

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

            var randomNode = new TSC.CSTNode("Type");
            this.currentNode.addChild(randomNode);
            this.currentNode = randomNode;

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);

            //var newANode = new TSC.ASTNode(currentToken.tokenValue);
            //this.currASTNode.addChild(newANode);

            this.match(TokenType);

            this.currentNode = this.currentNode.parent;

        }

        private parseChar() {

            var randomNode = new TSC.CSTNode("Char");
            this.currentNode.addChild(randomNode);
            this.currentNode = randomNode;

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);

            //var newANode = new TSC.ASTNode(currentToken.tokenValue);
            //this.currASTNode.addChild(newANode);

            this.match(TokenID);

            this.currentNode = this.currentNode.parent;

        }

        private parseDigit() {

            var randomNode = new TSC.CSTNode("Digit");
            this.currentNode.addChild(randomNode);
            this.currentNode = randomNode;

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);

            //var newANode = new TSC.ASTNode(currentToken.tokenValue);
            //this.currASTNode.addChild(newANode);

            this.match(TokenNum);

            this.currentNode = this.currentNode.parent;

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

            var randomNode = new TSC.CSTNode("BoolVal");
            this.currentNode.addChild(randomNode);
            this.currentNode = randomNode;

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);
            this.match(TokenBool);

            this.currentNode = this.currentNode.parent;

        }

        private parseIntOp() {

            var randomNode = new TSC.CSTNode("IntOp");
            this.currentNode.addChild(randomNode);
            this.currentNode = randomNode;

            var newNode = new TSC.CSTNode(currentToken.tokenValue);
            this.currentNode.addChild(newNode);

            //this.tempTokenVal2 = currentToken.tokenValue;

            this.match(TokenPlus);

            this.currentNode = this.currentNode.parent;

        }

        private getNextToken() {

            var thisToken: TSC.Token;
            if (this.tokenCounter < _TokenStream.length) {
               // If we're not at EOF, then return the next token in the stream.
               thisToken = _TokenStream[this.tokenCounter + 1];
            }

            else {

                thisToken = _TokenStream[_TokenStream.length - 1];
                //console.log("Tried to get token past array bounds");

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

        public displayCST() {

            this.treeOutput = "\n------------------------------------\nConcrete Syntax Tree (CST):\n------------------------------------\n\n";
            this.treeOutput = this.treeOutput + _CST.printValue;
            this.processChildren(_CST, 1);
            _CSTDisplay = this.treeOutput;

        }

        public processChildren(node: TSC.CSTNode, depth: number) {

            for (var i = 0; i < node.childCount; i++) {

                this.treeOutput = this.treeOutput + "\n";

                for (var s = 0; s < depth; s++) {

                    this.treeOutput = this.treeOutput + "|..";

                }

                this.treeOutput = this.treeOutput + node.children[i].printValue;
                this.processChildren(node.children[i], depth + 1);

            }

        }

        public convertCSTToAST() {

            var ASTRoot = new TSC.ASTNode("Program");
            ASTRoot.isRoot = true;
            this.currentASTNode = ASTRoot;

            this.currentNode = _CST;

            this.processCSTChildren(this.currentNode);

            //_AST = this.currentASTNode;
            _AST = ASTRoot;
        }

        public processCSTChildren(node: TSC.CSTNode) {

            for (var i = 0; i < node.childCount; i++) {

                var tempNode = node.children[i];

                if (tempNode.printValue == "Block") {
                    var n1 = new TSC.ASTNode("Block");
                    n1.lineNum = tempNode.lineNum;
                    this.currentASTNode.addChild(n1);
                    this.currentASTNode = n1;

                    this.processCSTChildren(tempNode);
                    this.currentASTNode = this.currentASTNode.parent;
                }
                else if (tempNode.printValue == "StatementList") {
                    this.processCSTChildren(tempNode);
                }
                else if (tempNode.printValue == "Statement") {
                    this.processCSTChildren(tempNode);
                }
                else if (tempNode.printValue == "PrintStatement") {
                    var n2 = new TSC.ASTNode("Print");
                    n2.lineNum = tempNode.lineNum;
                    this.currentASTNode.addChild(n2);
                    this.currentASTNode = n2;

                    this.processCSTChildren(tempNode);
                    this.currentASTNode = this.currentASTNode.parent;
                }
                else if (tempNode.printValue == "AssignStatement") {
                    var n3 = new TSC.ASTNode("Assign");
                    n3.lineNum = tempNode.lineNum;
                    this.currentASTNode.addChild(n3);
                    this.currentASTNode = n3;

                    this.processCSTChildren(tempNode);
                    this.currentASTNode = this.currentASTNode.parent;
                }
                else if (tempNode.printValue == "VarDecl") {
                    var n31 = new TSC.ASTNode("VarDecl");
                    n31.lineNum = tempNode.lineNum;
                    this.currentASTNode.addChild(n31);
                    this.currentASTNode = n31;

                    this.processCSTChildren(tempNode);
                    this.currentASTNode = this.currentASTNode.parent;
                }
                else if (tempNode.printValue == "While") {
                    this.createWhileTree(tempNode);
                }
                else if (tempNode.printValue == "If") {
                    this.createIfTree(tempNode);
                }
                else if (tempNode.printValue == "Expr") {
                    this.processCSTChildren(tempNode);
                }
                else if (tempNode.printValue == "IntExpr") {

                    if (tempNode.childCount == 1) {
                        this.processCSTChildren(tempNode);
                    }
                    else {
                        this.createIntExprTree(tempNode);
                    }

                }
                else if (tempNode.printValue == "StringExpr") {
                    var n4 = new TSC.ASTNode((tempNode.children[0]).printValue);
                    n4.lineNum = tempNode.children[0].lineNum;
                    this.currentASTNode.addChild(n4);
                    //this.currentASTNode = n4;
                }
                else if (tempNode.printValue == "BoolVal") {
                    var n9 = new TSC.ASTNode((tempNode.children[0]).printValue);
                    n9.lineNum = tempNode.children[0].lineNum;
                    //console.log(tempNode.children[0].printValue);
                    this.currentASTNode.addChild(n9);
                    //this.currentASTNode = n9;
                }
                else if (tempNode.printValue == "BoolExpr") {
                    if (tempNode.childCount == 1) {
                        this.processCSTChildren(tempNode);
                    }
                    else {
                        this.createBoolExprTree(tempNode);
                    }
                }
                else if (tempNode.printValue == "ID") {
                    this.processCSTChildren(tempNode);
                }
                else if (tempNode.printValue == "Char") {
                    var n5 = new TSC.ASTNode((tempNode.children[0]).printValue);
                    n5.lineNum = tempNode.children[0].lineNum;
                    this.currentASTNode.addChild(n5);
                    //this.currentASTNode = n5;
                }
                else if (tempNode.printValue == "Type") {
                    var n6 = new TSC.ASTNode(tempNode.children[0].printValue);
                    n6.lineNum = tempNode.lineNum;
                    this.currentASTNode.addChild(n6);
                    //this.currentASTNode = n6;
                }
                else if (tempNode.printValue == "Digit") {
                    var n7 = new TSC.ASTNode((tempNode.children[0]).printValue);
                    n7.lineNum = tempNode.children[0].lineNum;
                    this.currentASTNode.addChild(n7);
                    //this.currentASTNode = n7;
                }
                else if (tempNode.printValue == "BoolOp") {
                    var n8 = new TSC.ASTNode((tempNode.children[0]).printValue);
                    n8.lineNum = tempNode.children[0].lineNum;
                    this.currentASTNode.addChild(n8);
                    //this.currentASTNode = n8;
                }
                else if (tempNode.printValue == "IntOp") {
                    var n10 = new TSC.ASTNode((tempNode.children[0]).printValue);
                    n10.lineNum = tempNode.children[0].lineNum;
                    this.currentASTNode.addChild(n10);
                    //this.currentASTNode = n10;
                }
                else {
                    // Do Nothing
                }

            }

        }

        public createIntExprTree(node: TSC.CSTNode) {

            var n = new TSC.ASTNode((node.children[1]).children[0].printValue);
            n.lineNum = node.children[1].lineNum;
            this.currentASTNode.addChild(n);
            this.currentASTNode = n;

            var digit = new TSC.ASTNode((node.children[0]).children[0].printValue);
            digit.lineNum = (node.children[0]).children[0].lineNum;
            this.currentASTNode.addChild(digit);

            this.processCSTChildren(node.children[2]);
            this.currentASTNode = this.currentASTNode.parent;

        }

        public createBoolExprTree(node: TSC.CSTNode) {

            //if (node.childCount > 1) {

                var n = new TSC.ASTNode(node.children[2].children[0].printValue);
                n.lineNum = node.children[2].lineNum;
                this.currentASTNode.addChild(n);
                this.currentASTNode = n;

                this.processCSTChildren(node.children[1]);
                this.processCSTChildren(node.children[3]);
                this.currentASTNode = this.currentASTNode.parent;

            //}

            //else {

                //console.log(node.children[0].printValue);
                //this.processCSTChildren(node.children[0]);

            //}

        }

        public createWhileTree(node: TSC.ASTNode) {

            var n = new TSC.ASTNode("While");
            n.lineNum = node.lineNum;
            this.currentASTNode.addChild(n);
            this.currentASTNode = n;

            //this.createBoolExprTree(node.children[1]);
            this.processCSTChildren(node.children[1]);

            var block = new TSC.ASTNode("Block");
            block.lineNum = node.lineNum;
            this.currentASTNode.addChild(block);
            this.currentASTNode = block;
            this.processCSTChildren(node.children[2]);
            this.currentASTNode = this.currentASTNode.parent;
            this.currentASTNode = this.currentASTNode.parent;//.parent;

        }

        public createIfTree(node: TSC.ASTNode) {

            var n = new TSC.ASTNode("If");
            n.lineNum = node.lineNum;
            this.currentASTNode.addChild(n);
            this.currentASTNode = n;

            //this.createBoolExprTree(node.children[1]);
            this.processCSTChildren(node.children[1]);

            var block = new TSC.ASTNode("Block");
            block.lineNum = node.lineNum;
            this.currentASTNode.addChild(block);
            this.currentASTNode = block;
            this.processCSTChildren(node.children[2]);
            this.currentASTNode = this.currentASTNode.parent;
            this.currentASTNode = this.currentASTNode.parent;//.parent;

        }

        public displayAST() {

            this.treeOutputAST = "\n------------------------------------\nAbstract Syntax Tree (AST):\n------------------------------------\n\n";
            this.treeOutputAST = this.treeOutputAST + _AST.printValue;
            //console.log(_AST.printValue + " ?");
            this.processASTChildren(_AST, 1);
            _ASTDisplay = this.treeOutputAST;

        }

        public processASTChildren(node: TSC.ASTNode, depth: number) {

            for (var i = 0; i < node.childCount; i++) {

                this.treeOutputAST = this.treeOutputAST + "\n";

                for (var s = 0; s < depth; s++) {

                    this.treeOutputAST = this.treeOutputAST + "|..";

                }

                this.treeOutputAST = this.treeOutputAST + node.children[i].printValue;
                //console.log(node.children[i].printValue + " ?");
                this.processASTChildren(node.children[i], depth + 1);

            }

        }

        public createSymbolTable() {

            _OutputBufferSA = new Array<string>();

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

        }

        public processScopeFromCST(node: TSC.CSTNode) {

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
                }
                else if (child.printValue == "VarDecl") {

                    var variName = ((child.children[1]).children[0]).children[0].printValue;
                    var variType = (child.children[0]).children[0].printValue;


                    var newVar = new TSC.Variable(variName, variType, child.lineNum, this.currentScope);
                    var redeclaredVars: boolean = false;
                    var varPosition: number = 0;

                    for (var v = 0; v < this.currentScope.variables.length; v++) {
                        if (this.currentScope.variables[v].variableName == newVar.variableName) {
                            redeclaredVars = true;
                            varPosition = v;
                        }
                    }
                    if (redeclaredVars) {
                        _OutputBufferSA.push("*** Error: Redeclared variable in same scope, variable " + newVar.variableName + " declared on lines " + this.currentScope.variables[varPosition].lineNumber + " and line " + newVar.lineNumber + " ***\n");
                        continueExecution = false;
                        saErrorCount++;
                    }
                    else {
                        this.currentScope.variables.push(newVar);
                        _OutputBufferSA.push("Variable " + newVar.variableName + " declared in scope " + this.currentScope.scopeLevel + "\n");
                    }

                }

                else if (child.printValue == "AssignStatement") {

                    //console.log("assign found");
                    // Params: Current Scope Object, ID Variable Assigned to, Type of Expr Assigned to Variable, Line Number of Statement, Non-Terminal Referenced
                    this.searchScopeHierarchy(this.currentScope, ((child.children[0]).children[0]).children[0].printValue, (child.children[2]).children[0].printValue, child.children[0].lineNum, "Assign", child.children[2]);

                    this.terminatedScopeSearch = false;

                    this.processScopeFromCST(child.children[2]);

                }

                else if (child.printValue == "Char") {

                    // Params: Current Scope Object, ID Variable Referenced, N/A, Line Number of Statement, Non-Terminal Referenced
                    this.searchScopeHierarchy(this.currentScope, child.children[0].printValue, "", child.children[0].lineNum, "Char", null);

                    this.terminatedScopeSearch = false;
                }

                // Check IntExpr Stmts for Type Matching
                else if ((child.printValue == "IntExpr") && (child.childCount > 1)) {

                    //console.log("IntExprFound");

                    this.typeCheckIntExpr(child);

                }

                // Check BoolExpr Stmts for Type Matching
                //else if ((child.printValue == "==")||(child.printValue == "!=")) {



                //}

                else {
                    this.processScopeFromCST(child);
                }

            }

        }

        public typeCheckIntExpr (child: TSC.ASTNode) {

            //console.log(child.children[0]);

            if ((child.childCount == 1) && /^[0-9]$/.test(child.children[0].children[0].printValue)) {

                // Single Digit, Passes Type Check

            }

            else if ((child.childCount == 1) && (!/^[0-9]$/.test(child.children[0].children[0].children[0].printValue))) {

                //Single Non-Int, Fails Type Check
                _OutputBufferSA.push("*** Error: Type Mismatch on line " + child.children[0].lineNum + "; Expecting variable of type int or digit, Found " + child.children[0].children[0].children[0].printValue + " ***\n");
                saErrorCount++;
                continueExecution = false;

            }

            else if (child.childCount != 1) {

                if (child.children[2].children[0].printValue == "IntExpr") {

                    this.typeCheckIntExpr(child.children[2].children[0]);

                }
                else if (child.children[2].children[0].printValue == "ID") {

                    var variable = child.children[2].children[0].children[0].children[0];

                    var varType: string = this.typeCheckScopeSearch(this.currentScope, variable.printValue, variable.lineNum);
                    //console.log("type found: " + varType);
                    if (varType != "int") {

                        _OutputBufferSA.push("*** Error: Type Mismatch on line " + variable.lineNum + "; Expecting variable of type int, Found variable of type " + varType + " ***\n");
                        saErrorCount++;
                        continueExecution = false;

                    }

                }

                else {

                    _OutputBufferSA.push("*** Error: Type Mismatch on line " + child.lineNum + "; Expecting variable of type int or digit, Found " + child.children[2].children[0].printValue + " ***\n");
                    saErrorCount++;
                    continueExecution = false;

                }

            }

        }

        public typeCheckScopeSearch(scope:TSC.Scope, varName:string, lineNum:number) : string {

            var varFoundInScope:boolean = false;

            //console.log("Trying to find var " + varName + " in scope " + scope.scopeLevel);

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
                }

                else {
                    return this.typeCheckScopeSearch(scope.parentScope, varName, lineNum);
                }
            }

        }

        public searchScopeHierarchy(scope: TSC.Scope, varName: string, assignValue: string, lineNum: number, searchType: string, assignNode: TSC.CSTNode) {

            //console.log("scope = " + scope + " || " + varName + " " + assignValue + " " + lineNum);

            if (searchType == "Assign") {

                //console.log("Looking for " + varName + " in scope " + scope.scopeLevel);

                if (!this.terminatedScopeSearch) {
                    var varFoundInScope: boolean = false;

                    for (var v = 0; v < scope.variables.length; v++) {
                        if (scope.variables[v].variableName == varName) {
                            //console.log(varName + " found!");
                            varFoundInScope = true;
                            this.terminatedScopeSearch = true;
                            this.typeCheckAssign(scope, varName, assignValue, lineNum, assignNode);
                            scope.variables[v].variableUsed = true;
                            scope.variables[v].variableInitialized = true;
                            _OutputBufferSA.push("Variable " + varName + " from scope " + scope.scopeLevel + " assigned value on line " + lineNum + "\n");
                        }
                    }
                    if (!this.terminatedScopeSearch) {
                        if (scope.isRootScope) {
                            if (!varFoundInScope) {
                                _OutputBufferSA.push("*** Error: Undeclared variable " + varName + " used on line " + lineNum + " ***\n");
                                saErrorCount++;
                                continueExecution = false;
                                this.terminatedScopeSearch = true;
                            }
                        }

                        else {
                            this.searchScopeHierarchy(scope.parentScope, varName, assignValue, lineNum, "Assign", assignNode);
                        }
                    }
                }
            }

            else if (searchType == "Char") {
                if (!this.terminatedScopeSearch) {
                    var varFoundInScope:boolean = false;

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
                                saErrorCount++;
                                this.terminatedScopeSearch = true;
                            }
                        }

                        else {
                            this.searchScopeHierarchy(scope.parentScope, varName, assignValue, lineNum, "Char", assignNode);
                        }
                    }
                }
            }
        }

        public typeCheckAssign(sc: TSC.Scope, vName: string, vType: string, lNum: number, rightSide: TSC.CSTNode) {

            //TODO: Fix this function to include assignment of one variable to another

            var foundVariable: TSC.Variable = this.findVariableInScope(vName, sc);

            if (vType == "IntExpr") {
                vType = "int";
            }

            else if (vType == "BoolExpr") {
                vType = "boolean";
            }

            else if (vType == "StringExpr") {
                vType = "string";
            }
            else if (vType == "ID") {

                //console.log(rightSide);

                var sourceVar = rightSide.children[0].children[0].children[0];
                var vari = this.findVariableInScope(sourceVar.printValue, sc);
                if (vari.variableType == "int") {
                    vType = "int";
                }
                else if (vari.variableType == "boolean") {
                    vType = "boolean";
                }
                else {
                    vType = "string";
                }

                //if (sour)

            }

            if (vType != foundVariable.variableType) {
                _OutputBufferSA.push("*** Error: Type Mismatch on line " + lNum + "; Attempted to assign value of type " + vType + " to variable of type " + foundVariable.variableType + " ***\n");
                continueExecution = false;
                saErrorCount++;
            }

        }

        public findVariableInScope(varName: string, sc: TSC.Scope): TSC.Variable {

            var foundVariable: TSC.Variable = null;
            var varFound: boolean = false;

            for (var v = 0; v < sc.variables.length; v++) {
                if (sc.variables[v].variableName == varName) {
                    varFound = true;
                    return foundVariable = sc.variables[v];
                }
            }

            if (!varFound) {

                if (sc.parentScope == null) {
                    // Output Error
                }
                else {
                    return this.findVariableInScope(varName, sc.parentScope);
                }

            }

        }

        public checkForUnusedVariables(sc: TSC.Scope) {

            for (var x = 0; x < sc.variables.length; x++) {
                if (!sc.variables[x].variableInitialized && !sc.variables[x].variableUsed) {
                    _OutputBufferSA.push("** Warning: Variable " + sc.variables[x].variableName + " declared on line " + sc.variables[x].lineNumber + " but is never used **\n");
                }
            }

            for (var y = 0; y < sc.childrenScopes.length; y++)
                this.checkForUnusedVariables(sc.childrenScopes[y]);

        }

        public displaySymbolTable() {

            this.symbolTreeOutput = "\n------------------------------------\nSymbol Table:\n------------------------------------\n\n";
            this.processChildrenST(_SymbolTable);
            _SymTabDisplay = this.symbolTreeOutput;

        }

        public processChildrenST(node: TSC.Scope) {

            this.symbolTreeOutput = this.symbolTreeOutput + "Scope " + node.scopeLevel + ":\n--------------------\nID / Type / Line # / Initialized / Used";

            for (var i = 0; i < node.variables.length; i++) {

                this.symbolTreeOutput = this.symbolTreeOutput + "\n\n";
                this.symbolTreeOutput = this.symbolTreeOutput + node.variables[i].variableName + " / " + node.variables[i].variableType + " / " + node.variables[i].lineNumber + " / " + node.variables[i].variableInitialized + " / " + node.variables[i].variableUsed;

            }
            this.symbolTreeOutput = this.symbolTreeOutput + "\n\n";

            for (var j = 0; j < node.childrenScopes.length; j++) {
                this.processChildrenST(node.childrenScopes[j]);
            }

        }

    }

}