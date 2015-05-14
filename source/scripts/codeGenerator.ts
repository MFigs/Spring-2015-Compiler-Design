module TSC {

    export class CodeGenerator {

        public outputCodeArray: Array<string> = new Array<string>(256);
        public tempVarTable: Array<TSC.TempEntry> = new Array<TSC.TempEntry>();
        public jumpTable: Array<TSC.JumpEntry> = new Array<JumpEntry>();
        public currScope: TSC.Scope = _SymbolTable;
        public currASTNode: TSC.ASTNode = _AST;
        public codePointer: number = 0;
        public heapPointer: number = 252;
        public spaceRemaining: boolean = true;
        public spaceErrorPrinted: boolean = false;

        constructor() {
            _CodeGenMessageOutput = new Array<string>();
        }

        public generateCode() {

            for (var x = 0; x < 256; x++) {
                this.outputCodeArray[x] = "00";
            }

            this.currASTNode = this.currASTNode.children[0];
            this.processNodes(this.currASTNode, false);
            this.outputCodeArray[this.codePointer] = "00";
            this.codePointer = this.codePointer + 1;
            this.storeVariables();
            this.backpatch();

            for (var s = 0; s < _CodeGenMessageOutput.length; s++) {

                _CodeGenMessageString = _CodeGenMessageString + _CodeGenMessageOutput[s] + "\n";

            }

            _CodeGenMessageString = _CodeGenMessageString + "\n";

            if (!this.spaceErrorPrinted) {

                for (var y = 0; y < 256; y++) {

                    _CodeString = _CodeString + this.outputCodeArray[y] + " ";

                }

            }

        }

        public processNodes(currNode: TSC.ASTNode, changeScope: boolean) {

            if (currNode.printValue == "Block" && changeScope) {
                this.currScope = this.currScope.childrenScopes[this.currScope.scopeCounter];
            }

            for (var i = 0; i < currNode.childCount; i++) {

                if (this.spaceRemaining) {

                    var nextStmt = currNode.children[i];

                    if (nextStmt.printValue == "VarDecl") {

                        if (nextStmt.children[0].printValue == "int") {

                            if (this.codePointer + 4 < this.heapPointer) {

                                this.outputCodeArray[this.codePointer] = "A9";
                                this.outputCodeArray[this.codePointer + 1] = "00";
                                var newVar = new TSC.TempEntry(nextStmt.children[1].printValue, this.currScope);
                                this.tempVarTable[_TempVarCounter - 1] = newVar;
                                this.outputCodeArray[this.codePointer + 2] = "8D";
                                this.outputCodeArray[this.codePointer + 3] = newVar.tempVariableName;
                                this.outputCodeArray[this.codePointer + 4] = "00";

                                this.codePointer = this.codePointer + 5;

                            }
                            else {
                                // Output Error
                                this.spaceRemaining = false;
                            }

                        }

                        else if (nextStmt.children[0].printValue == "string") {

                            var newStringVar = new TSC.TempEntry(nextStmt.children[1].printValue, this.currScope);
                            this.tempVarTable[_TempVarCounter - 1] = newStringVar;

                        }

                        else if (nextStmt.children[0].printValue == "boolean") {

                            if (this.codePointer + 4 < this.heapPointer) {

                                this.outputCodeArray[this.codePointer] = "A9";
                                this.outputCodeArray[this.codePointer + 1] = "01";
                                var newVar = new TSC.TempEntry(nextStmt.children[1].printValue, this.currScope);
                                this.tempVarTable[_TempVarCounter - 1] = newVar;
                                this.outputCodeArray[this.codePointer + 2] = "8D";
                                this.outputCodeArray[this.codePointer + 3] = newVar.tempVariableName;
                                this.outputCodeArray[this.codePointer + 4] = "00";

                                this.codePointer = this.codePointer + 5;

                            }
                            else {
                                // Output Error
                                this.spaceRemaining = false;
                            }

                        }

                    }

                    else if (nextStmt.printValue == "Assign") {

                        var assigningVar: TSC.Variable = this.findReferencedVariable(nextStmt.children[0].printValue, this.currScope);

                        if (assigningVar.variableType == "int") {

                            var te: TSC.TempEntry = this.findTempEntry(assigningVar);

                            if (nextStmt.children[1].printValue != "+") {

                                this.outputCodeArray[this.codePointer] = "A9";
                                this.outputCodeArray[this.codePointer + 1] = "0" + nextStmt.children[1].printValue;
                                this.outputCodeArray[this.codePointer + 2] = "8D";
                                this.outputCodeArray[this.codePointer + 3] = te.tempVariableName;
                                this.outputCodeArray[this.codePointer + 4] = "00";

                                this.codePointer = this.codePointer + 5;

                                if (this.codePointer >= this.heapPointer) {

                                    this.spaceRemaining = false;

                                }

                            }
                            else {

                                this.processIntegerSums(nextStmt.children[1], te);
                                this.outputCodeArray[this.codePointer] = "A9";
                                this.outputCodeArray[this.codePointer + 1] = "00";
                                this.outputCodeArray[this.codePointer + 2] = "8D";
                                this.outputCodeArray[this.codePointer + 3] = "FF";
                                this.outputCodeArray[this.codePointer + 4] = "00";

                                this.codePointer = this.codePointer + 5;

                                if (this.codePointer >= this.heapPointer) {

                                    this.spaceRemaining = false;

                                }

                            }

                        }

                        else if (assigningVar.variableType == "string") {

                            this.outputCodeArray[this.heapPointer] = "00";
                            this.heapPointer = this.heapPointer - 1;

                            //var te: TSC.TempEntry = this.findTempEntry(assigningVar);

                            for (var x = nextStmt.children[1].printValue.length - 2; x > 0; x--) {

                                this.outputCodeArray[this.heapPointer] = nextStmt.children[1].printValue.charCodeAt(x).toString(16).toUpperCase();
                                this.heapPointer = this.heapPointer - 1;

                            }

                            if (this.codePointer >= this.heapPointer) {

                                this.spaceRemaining = false;

                            }

                            var temp: TSC.TempEntry = this.findTempEntry(assigningVar);
                            temp.address = this.heapPointer + 1;

                            this.outputCodeArray[this.codePointer] = "A9";
                            this.outputCodeArray[this.codePointer + 1] = (this.heapPointer + 1).toString(16).toUpperCase();
                            this.outputCodeArray[this.codePointer + 2] = "8D";
                            this.outputCodeArray[this.codePointer + 3] = temp.tempVariableName;
                            this.outputCodeArray[this.codePointer + 4] = "00";

                            this.codePointer = this.codePointer + 5;

                            if (this.codePointer >= this.heapPointer) {

                                this.spaceRemaining = false;

                            }

                        }

                        else if (assigningVar.variableType == "boolean") {

                            this.processBooleanValue(nextStmt.children[1]);

                        }

                    }
                    else if (nextStmt.printValue == "While") {

                        this.processBooleanValue(nextStmt.children[0]);
                        var jumpVar: TSC.JumpEntry = new JumpEntry(this.codePointer + 6);
                        this.jumpTable[_JumpVarCounter - 1] = jumpVar;
                        this.outputCodeArray[this.codePointer] = "A2";
                        this.outputCodeArray[this.codePointer + 1] = "01";
                        this.outputCodeArray[this.codePointer + 2] = "EC";
                        this.outputCodeArray[this.codePointer + 3] = "FE";
                        this.outputCodeArray[this.codePointer + 4] = "00";
                        this.outputCodeArray[this.codePointer + 5] = "D0";
                        this.outputCodeArray[this.codePointer + 6] = jumpVar.jumpVariableName;

                        this.codePointer = this.codePointer + 7;
                        var jumpVar1: TSC.JumpEntry = new JumpEntry(this.codePointer);
                        this.jumpTable[_JumpVarCounter - 1] = jumpVar1;

                        this.processNodes(nextStmt.children[1], true);

                        this.processBooleanValue(nextStmt.children[0]);
                        this.outputCodeArray[this.codePointer] = "A2";
                        this.outputCodeArray[this.codePointer + 1] = "01";
                        this.outputCodeArray[this.codePointer + 2] = "EC";
                        this.outputCodeArray[this.codePointer + 3] = "FE";
                        this.outputCodeArray[this.codePointer + 4] = "00";
                        this.outputCodeArray[this.codePointer + 5] = "D0";
                        this.outputCodeArray[this.codePointer + 6] = jumpVar1.jumpVariableName;

                        this.codePointer = this.codePointer + 7;
                        jumpVar.distance = this.codePointer - jumpVar.startPosition - 1;
                        jumpVar1.distance = 256 - (this.codePointer - jumpVar1.startPosition - 1);
                        //console.log(jumpVar1.distance);

                        if (this.codePointer >= this.heapPointer) {

                            this.spaceRemaining = false;

                        }

                    }
                    else if (nextStmt.printValue == "If") {

                        this.processBooleanValue(nextStmt.children[0]);
                        var jumpVar: TSC.JumpEntry = new JumpEntry(this.codePointer + 7);
                        this.jumpTable[_JumpVarCounter - 1] = jumpVar;
                        this.outputCodeArray[this.codePointer] = "A2";
                        this.outputCodeArray[this.codePointer + 1] = "01";
                        this.outputCodeArray[this.codePointer + 2] = "EC";
                        this.outputCodeArray[this.codePointer + 3] = "FE";
                        this.outputCodeArray[this.codePointer + 4] = "00";
                        this.outputCodeArray[this.codePointer + 5] = "D0";
                        this.outputCodeArray[this.codePointer + 6] = jumpVar.jumpVariableName;

                        this.codePointer = this.codePointer + 7;

                        this.processNodes(nextStmt.children[1], true);

                        jumpVar.distance = this.codePointer - jumpVar.startPosition;

                        if (this.codePointer >= this.heapPointer) {

                            this.spaceRemaining = false;

                        }

                    }
                    else if (nextStmt.printValue == "Print") {

                        if (/^[a-z]$/.test(nextStmt.children[0].printValue)) {

                            var vari: TSC.Variable = this.findReferencedVariable(nextStmt.children[0].printValue, this.currScope);
                            var te: TSC.TempEntry = this.findTempEntry(vari);

                            if (vari.variableType == "int") {

                                this.outputCodeArray[this.codePointer] = "AC";
                                this.outputCodeArray[this.codePointer + 1] = te.tempVariableName;
                                this.outputCodeArray[this.codePointer + 2] = "00";
                                this.outputCodeArray[this.codePointer + 3] = "A2";
                                this.outputCodeArray[this.codePointer + 4] = "01";
                                this.outputCodeArray[this.codePointer + 5] = "FF";

                                this.codePointer = this.codePointer + 6;

                                if (this.codePointer >= this.heapPointer) {

                                    this.spaceRemaining = false;

                                }

                            }
                            else if (vari.variableType == "string") {

                                this.outputCodeArray[this.codePointer] = "AC";
                                this.outputCodeArray[this.codePointer + 1] = te.tempVariableName;
                                this.outputCodeArray[this.codePointer + 2] = "00";
                                this.outputCodeArray[this.codePointer + 3] = "A2";
                                this.outputCodeArray[this.codePointer + 4] = "02";
                                this.outputCodeArray[this.codePointer + 5] = "FF";

                                this.codePointer = this.codePointer + 6;

                                if (this.codePointer >= this.heapPointer) {

                                    this.spaceRemaining = false;

                                }

                            }
                            else if (vari.variableType == "boolean") {

                                // Handle Boolean Printing?

                            }

                        }
                        else if (nextStmt.children[0].printValue == "+") {

                            this.processIntegerSumsNoVarStore(nextStmt.children[0]);
                            this.outputCodeArray[this.codePointer] = "AC";
                            this.outputCodeArray[this.codePointer + 1] = "FF";
                            this.outputCodeArray[this.codePointer + 2] = "00";
                            this.outputCodeArray[this.codePointer + 3] = "A2";
                            this.outputCodeArray[this.codePointer + 4] = "01";
                            this.outputCodeArray[this.codePointer + 5] = "FF";

                            this.codePointer = this.codePointer + 6;

                            if (this.codePointer >= this.heapPointer) {

                                this.spaceRemaining = false;

                            }


                        }
                        else if (nextStmt.children[0].printValue == "==") {

                            _CodeGenErrorExists = true;

                        }
                        else if (nextStmt.children[0].printValue == "!=") {

                            // Handle Boolean Print Literal

                        }
                        else if (nextStmt.children[0].printValue.charAt(0) == '\"') {

                            this.outputCodeArray[this.heapPointer] = "00";
                            this.heapPointer = this.heapPointer - 1;

                            for (var i = nextStmt.children[0].printValue.length - 2; i > 0; i--) {

                                this.outputCodeArray[this.heapPointer] = nextStmt.children[0].printValue.charCodeAt(i).toString(16).toUpperCase();
                                this.heapPointer = this.heapPointer - 1;

                            }

                            if (this.codePointer >= this.heapPointer) {

                                this.spaceRemaining = false;

                            }

                            this.outputCodeArray[this.codePointer] = "A0";
                            this.outputCodeArray[this.codePointer + 1] = (this.heapPointer + 1).toString(16).toUpperCase();
                            this.outputCodeArray[this.codePointer + 2] = "A2";
                            this.outputCodeArray[this.codePointer + 3] = "02";
                            this.outputCodeArray[this.codePointer + 4] = "FF";

                            this.codePointer = this.codePointer + 5;

                            if (this.codePointer >= this.heapPointer) {

                                this.spaceRemaining = false;

                            }

                        }

                    }
                    /*else if (nextStmt.printValue == "Block") {

                        this.currScope = this.currScope.childrenScopes[this.currScope.scopeCounter];
                        this.processNodes(nextStmt);
                        this.currScope = this.currScope.parentScope;
                        this.currScope.scopeCounter = this.currScope.scopeCounter + 1;

                    }*/

                }

                else {

                    if (!this.spaceErrorPrinted) {
                        // OUTPUT SPACE ERROR
                        this.spaceErrorPrinted = true;
                        _CodeGenErrorExists = true;
                        _CodeGenMessageOutput.push("*** Error: Insufficient Memory for Program Execution... That's All Folks!! ***");
                    }

                }

            }

            if (currNode.printValue == "Block" && changeScope) {
                this.currScope = this.currScope.parentScope;
                this.currScope.scopeCounter = this.currScope.scopeCounter + 1;
            }

        }

        public processIntegerSums(node: TSC.ASTNode, varEntry: TSC.TempEntry) {

            this.outputCodeArray[this.codePointer] = "A9";
            this.outputCodeArray[this.codePointer + 1] = "0" + node.children[0].printValue;
            this.outputCodeArray[this.codePointer + 2] = "6D";
            this.outputCodeArray[this.codePointer + 3] = "FF";
            this.outputCodeArray[this.codePointer + 4] = "00";
            this.outputCodeArray[this.codePointer + 5] = "8D";
            this.outputCodeArray[this.codePointer + 6] = "FF";
            this.outputCodeArray[this.codePointer + 7] = "00";


            this.codePointer = this.codePointer + 8;

            if (this.codePointer >= this.heapPointer) {

                this.spaceRemaining = false;

            }

            if (node.children[1].printValue != "+") {

                if (/^[a-z]$/.test(node.children[1].printValue)) {

                    var addedVar: TSC.Variable = this.findReferencedVariable(node.children[1].printValue, this.currScope);

                    var te: TSC.TempEntry = this.findTempEntry(addedVar);

                    this.outputCodeArray[this.codePointer] = "AD";
                    this.outputCodeArray[this.codePointer + 1] = te.tempVariableName;
                    this.outputCodeArray[this.codePointer + 2] = "00";
                    this.outputCodeArray[this.codePointer + 3] = "6D";
                    this.outputCodeArray[this.codePointer + 4] = "FF";
                    this.outputCodeArray[this.codePointer + 5] = "00";
                    this.outputCodeArray[this.codePointer + 6] = "8D";
                    this.outputCodeArray[this.codePointer + 7] = varEntry.tempVariableName;
                    this.outputCodeArray[this.codePointer + 8] = "00";

                    this.codePointer = this.codePointer + 9;

                    if (this.codePointer >= this.heapPointer) {

                        this.spaceRemaining = false;

                    }



                }
                else {

                    this.outputCodeArray[this.codePointer] = "A9";
                    this.outputCodeArray[this.codePointer + 1] = "0" + node.children[1].printValue;
                    this.outputCodeArray[this.codePointer + 2] = "6D";
                    this.outputCodeArray[this.codePointer + 3] = "FF";
                    this.outputCodeArray[this.codePointer + 4] = "00";
                    this.outputCodeArray[this.codePointer + 5] = "8D";
                    this.outputCodeArray[this.codePointer + 6] = varEntry.tempVariableName;
                    this.outputCodeArray[this.codePointer + 7] = "00";

                    this.codePointer = this.codePointer + 8;

                    if (this.codePointer >= this.heapPointer) {

                        this.spaceRemaining = false;

                    }

                }

            }
            else {

                this.processIntegerSums(node.children[1], varEntry);

            }

        }

        public processIntegerSumsNoVarStore(node: TSC.ASTNode) {

            this.outputCodeArray[this.codePointer] = "A9";
            this.outputCodeArray[this.codePointer + 1] = "0" + node.children[0].printValue;
            this.outputCodeArray[this.codePointer + 2] = "6D";
            this.outputCodeArray[this.codePointer + 3] = "FF";
            this.outputCodeArray[this.codePointer + 4] = "00";
            this.outputCodeArray[this.codePointer + 5] = "8D";
            this.outputCodeArray[this.codePointer + 6] = "FF";
            this.outputCodeArray[this.codePointer + 7] = "00";


            this.codePointer = this.codePointer + 8;

            if (this.codePointer >= this.heapPointer) {

                this.spaceRemaining = false;

            }

            if (node.children[1].printValue != "+") {

                if (/^[a-z]$/.test(node.children[1].printValue)) {

                    var addedVar: TSC.Variable = this.findReferencedVariable(node.children[1].printValue, this.currScope);

                    var te: TSC.TempEntry = this.findTempEntry(addedVar);

                    this.outputCodeArray[this.codePointer] = "AD";
                    this.outputCodeArray[this.codePointer + 1] = te.tempVariableName;
                    this.outputCodeArray[this.codePointer + 2] = "00";
                    this.outputCodeArray[this.codePointer + 3] = "6D";
                    this.outputCodeArray[this.codePointer + 4] = "FF";
                    this.outputCodeArray[this.codePointer + 5] = "00";
                    this.outputCodeArray[this.codePointer + 6] = "8D";
                    this.outputCodeArray[this.codePointer + 7] = "FF";
                    this.outputCodeArray[this.codePointer + 8] = "00";

                    this.codePointer = this.codePointer + 9;

                    if (this.codePointer >= this.heapPointer) {

                        this.spaceRemaining = false;

                    }



                }
                else {

                    this.outputCodeArray[this.codePointer] = "A9";
                    this.outputCodeArray[this.codePointer + 1] = "0" + node.children[1].printValue;
                    this.outputCodeArray[this.codePointer + 2] = "6D";
                    this.outputCodeArray[this.codePointer + 3] = "FF";
                    this.outputCodeArray[this.codePointer + 4] = "00";
                    this.outputCodeArray[this.codePointer + 5] = "8D";
                    this.outputCodeArray[this.codePointer + 6] = "FF";
                    this.outputCodeArray[this.codePointer + 7] = "00";

                    this.codePointer = this.codePointer + 8;

                    if (this.codePointer >= this.heapPointer) {

                        this.spaceRemaining = false;

                    }

                }

            }
            else {

                this.processIntegerSumsNoVarStore(node.children[1]);

            }

        }

        public findReferencedVariable(vari: string, sc: TSC.Scope): TSC.Variable {

            var varFoundInScope:boolean = false;

            for (var v = 0; v < sc.variables.length; v++) {
                if (sc.variables[v].variableName == vari) {
                    varFoundInScope = true;
                    return sc.variables[v];
                }
            }
            if (!varFoundInScope) {
                return this.findReferencedVariable(vari, sc.parentScope);
            }

        }

        public findTempEntry(variable: TSC.Variable): TSC.TempEntry {

            var te: TSC.TempEntry;

            //console.log(variable.variableName);

            for (var j = 0; j < this.tempVarTable.length; j++) {

                //console.log("." + this.tempVarTable[j].variableName);

                if (this.tempVarTable[j].variableName == variable.variableName) {

                    //console.log(this.tempVarTable[j].scope.scopeLevel);
                    //console.log(variable.scope.scopeLevel);

                    if (this.tempVarTable[j].scope.scopeLevel == variable.scope.scopeLevel) {

                        te = this.tempVarTable[j];
                        return te;

                    }

                }

            }

        }

        public processBooleanValue(boolNode: TSC.ASTNode) {

            if (boolNode.printValue == "true") {

                this.outputCodeArray[this.codePointer] = "A9";
                this.outputCodeArray[this.codePointer + 1] = "01";
                this.outputCodeArray[this.codePointer + 2] = "8D";
                this.outputCodeArray[this.codePointer + 3] = "FE";
                this.outputCodeArray[this.codePointer + 4] = "00";

                this.codePointer = this.codePointer + 5;

                if (this.codePointer >= this.heapPointer) {

                    this.spaceRemaining = false;

                }

            }
            else if (boolNode.printValue == "false") {

                this.outputCodeArray[this.codePointer] = "A9";
                this.outputCodeArray[this.codePointer + 1] = "00";
                this.outputCodeArray[this.codePointer + 2] = "8D";
                this.outputCodeArray[this.codePointer + 3] = "FE";
                this.outputCodeArray[this.codePointer + 4] = "00";

                this.codePointer = this.codePointer + 5;

                if (this.codePointer >= this.heapPointer) {

                    this.spaceRemaining = false;

                }

            }
            /*else if (boolNode.printValue == "==") {

                var leftChild: TSC.ASTNode = boolNode.children[0];
                var rightChild: TSC.ASTNode = boolNode.children[1];

                if ((/^[a-z]$/.test(leftChild.printValue)) && (/^[a-z]$/.test(rightChild.printValue))) {}
                else if ((/^[a-z]$/.test(leftChild.printValue)) && (!/^[a-z]$/.test(rightChild.printValue)) && (rightChild.printValue.charAt(0) != '\"')) {}
                else if ((!/^[a-z]$/.test(leftChild.printValue)) && (/^[a-z]$/.test(rightChild.printValue)) && (leftChild.printValue.charAt(0) != '\"')) {}
                else if ((rightChild.printValue == "==") || (rightChild.printValue == "!=") || (leftChild.printValue == "==") || (leftChild.printValue == "!=")) {
                    // Nested Bools Not Supported?
                }
                else if ((leftChild.printValue == "+") && (/^[0-9]$/.test(rightChild.printValue))) {}
                else if ((rightChild.printValue == "+") && (/^[0-9]$/.test(leftChild.printValue))) {}
                else if ((leftChild.printValue == "+") && (rightChild.printValue == "+")) {}
                else if ((/^[0-9]$/.test(rightChild.printValue)) && (/^[0-9]$/.test(leftChild.printValue))) {

                    var tempVar: TSC.TempEntry = new TSC.TempEntry("temp", this.currScope);
                    this.outputCodeArray[this.codePointer] = "A9";
                    this.outputCodeArray[this.codePointer + 1] = "0" + leftChild.printValue;
                    this.outputCodeArray[this.codePointer + 2] = "8D";
                    this.outputCodeArray[this.codePointer + 3] = tempVar.tempVariableName;
                    this.outputCodeArray[this.codePointer + 4] = "00";
                    this.outputCodeArray[this.codePointer + 5] = "A2";
                    this.outputCodeArray[this.codePointer + 6] = "0" + rightChild.printValue;
                    this.outputCodeArray[this.codePointer + 7] = "EC";
                    this.outputCodeArray[this.codePointer + 8] = tempVar.tempVariableName;
                    this.outputCodeArray[this.codePointer + 9] = "00";

                }
                else {
                    // Don't support literal string comparisons
                }

            }
            else if (boolNode.printValue == "!=") {}
            /*else if (boolNode.printValue == "+") {

                this.outputCodeArray[this.codePointer] = "A9";
                this.outputCodeArray[this.codePointer + 1] = "01";
                this.outputCodeArray[this.codePointer + 2] = "8D";
                this.outputCodeArray[this.codePointer + 3] = "FE";
                this.outputCodeArray[this.codePointer + 4] = "00";

                this.codePointer = this.codePointer + 5;

                if (this.codePointer >= this.heapPointer) {

                    this.spaceRemaining = false;

                }

            }*/

        }

        public storeVariables() {

            this.heapPointer = this.heapPointer + 1;

            for (var x = 0; x < this.tempVarTable.length; x++) {

                this.tempVarTable[x].address = this.codePointer;
                this.codePointer = this.codePointer + 1;

            }

        }

        public backpatch() {

            for (var z = 0; z < this.outputCodeArray.length; z++) {

                var te: TSC.TempEntry = null;
                te = this.findTempVar(this.outputCodeArray[z]);

                var je: TSC.JumpEntry = null;
                je = this.findJumpVar(this.outputCodeArray[z]);

                if (te != null) {

                    if (te.address >= 16) {
                        this.outputCodeArray[z] = te.address.toString(16).toUpperCase();
                    }
                    else {
                        this.outputCodeArray[z] = "0" + te.address.toString(16).toUpperCase();
                    }

                }

                if (je != null) {

                    //console.log("found jump var at position " + z + " with value " + je.jumpVariableName);

                    if (je.distance >= 16) {
                        this.outputCodeArray[z] = je.distance.toString(16).toUpperCase();
                    }
                    else {
                        this.outputCodeArray[z] = "0" + je.distance.toString(16).toUpperCase();
                    }

                }

            }

        }

        public findTempVar(str: string) {

            for (var x = 0; x < this.tempVarTable.length; x++) {

                if (str == this.tempVarTable[x].tempVariableName) {
                    return this.tempVarTable[x];
                }

            }

            return null;

        }

        public findJumpVar(str: string) {

            for (var x = 0; x < this.jumpTable.length; x++) {

                if (str == this.jumpTable[x].jumpVariableName) {
                    return this.jumpTable[x];
                }

            }

            return null;

        }

    }

}
