var TSC;
(function (TSC) {
    var CodeGenerator = (function () {
        function CodeGenerator() {
            this.outputCodeArray = new Array(256);
            this.freeCodeSpace = 0;
            this.tempVarTable = new Array();
            this.jumpTable = new Array();
            this.currScope = _SymbolTable;
            this.currASTNode = _AST;
            this.codePointer = 0;
            this.heapPointer = 252;
            this.spaceRemaining = true;
            this.spaceErrorPrinted = false;
        }
        CodeGenerator.prototype.generateCode = function () {
            for (var x = 0; x < 256; x++) {
                this.outputCodeArray[x] = "00";
            }

            this.currASTNode = this.currASTNode.children[0];
            this.processNodes(this.currASTNode);
            this.outputCodeArray[this.codePointer] = "00";
            this.codePointer = this.codePointer + 1;
            this.storeVariables();
            this.backpatch();

            if (!this.spaceErrorPrinted) {
                for (var y = 0; y < 256; y++) {
                    _CodeString = _CodeString + this.outputCodeArray[y] + " ";
                }
            }
        };

        CodeGenerator.prototype.processNodes = function (currNode) {
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
                            } else {
                                // Output Error
                                this.spaceRemaining = false;
                            }
                        } else if (nextStmt.children[0].printValue == "string") {
                            var newStringVar = new TSC.TempEntry(nextStmt.children[1].printValue, this.currScope);
                            this.tempVarTable[_TempVarCounter - 1] = newStringVar;
                        } else if (nextStmt.children[0].printValue == "boolean") {
                            if (this.codePointer + 4 < this.heapPointer) {
                                this.outputCodeArray[this.codePointer] = "A9";
                                this.outputCodeArray[this.codePointer + 1] = "01";
                                var newVar = new TSC.TempEntry(nextStmt.children[1].printValue, this.currScope);
                                this.tempVarTable[_TempVarCounter - 1] = newVar;
                                this.outputCodeArray[this.codePointer + 2] = "8D";
                                this.outputCodeArray[this.codePointer + 3] = newVar.tempVariableName;
                                this.outputCodeArray[this.codePointer + 4] = "00";

                                this.codePointer = this.codePointer + 5;
                            } else {
                                // Output Error
                                this.spaceRemaining = false;
                            }
                        }
                    } else if (nextStmt.printValue == "Assign") {
                        var assigningVar = this.findReferencedVariable(nextStmt.children[0].printValue, this.currScope);

                        if (assigningVar.variableType == "int") {
                            var te = this.findTempEntry(assigningVar);

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
                            } else {
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
                        } else if (assigningVar.variableType == "string") {
                            this.outputCodeArray[this.heapPointer] = "00";
                            this.heapPointer = this.heapPointer - 1;

                            for (var x = nextStmt.children[1].printValue.length - 2; x > 1; x--) {
                                this.outputCodeArray[this.heapPointer] = nextStmt.children[1].printValue.charCodeAt(x) + "";
                                this.heapPointer = this.heapPointer - 1;
                            }

                            if (this.codePointer >= this.heapPointer) {
                                this.spaceRemaining = false;
                            }

                            var temp = this.findTempEntry(assigningVar);

                            this.outputCodeArray[this.codePointer] = "A9";
                            this.outputCodeArray[this.codePointer + 1] = this.heapPointer.toString(16).toUpperCase();
                            this.outputCodeArray[this.codePointer + 2] = "8D";
                            this.outputCodeArray[this.codePointer + 3] = temp.tempVariableName;
                            this.outputCodeArray[this.codePointer + 4] = "00";

                            this.codePointer = this.codePointer + 5;

                            if (this.codePointer >= this.heapPointer) {
                                this.spaceRemaining = false;
                            }
                        } else if (assigningVar.variableType == "boolean") {
                            this.processBooleanValue(nextStmt.children[1]);
                        }
                    } else if (nextStmt.printValue == "While") {
                        this.processBooleanValue(nextStmt.children[0]);
                        var jumpVar = new TSC.JumpEntry(this.codePointer + 6);
                        this.outputCodeArray[this.codePointer] = "A2";
                        this.outputCodeArray[this.codePointer + 1] = "01";
                        this.outputCodeArray[this.codePointer + 2] = "EC";
                        this.outputCodeArray[this.codePointer + 3] = "FE";
                        this.outputCodeArray[this.codePointer + 4] = "00";
                        this.outputCodeArray[this.codePointer + 5] = "D0";
                        this.outputCodeArray[this.codePointer + 6] = jumpVar.jumpVariableName;

                        this.codePointer = this.codePointer + 7;
                        var jumpVar1 = new TSC.JumpEntry(this.codePointer);

                        this.processNodes(nextStmt.children[1]);

                        this.outputCodeArray[this.codePointer] = "A2";
                        this.outputCodeArray[this.codePointer + 1] = "01";
                        this.outputCodeArray[this.codePointer + 2] = "EC";
                        this.outputCodeArray[this.codePointer + 3] = "FE";
                        this.outputCodeArray[this.codePointer + 4] = "00";
                        this.outputCodeArray[this.codePointer + 5] = "D0";
                        this.outputCodeArray[this.codePointer + 6] = jumpVar1.jumpVariableName;

                        this.codePointer = this.codePointer + 7;
                        jumpVar.distance = this.codePointer - jumpVar.startPosition;
                        jumpVar1.distance = 256 - (this.codePointer - jumpVar1.startPosition);

                        if (this.codePointer >= this.heapPointer) {
                            this.spaceRemaining = false;
                        }
                    } else if (nextStmt.printValue == "If") {
                        this.processBooleanValue(nextStmt.children[0]);
                        var jumpVar = new TSC.JumpEntry(this.codePointer + 6);
                        this.outputCodeArray[this.codePointer] = "A2";
                        this.outputCodeArray[this.codePointer + 1] = "01";
                        this.outputCodeArray[this.codePointer + 2] = "EC";
                        this.outputCodeArray[this.codePointer + 3] = "FE";
                        this.outputCodeArray[this.codePointer + 4] = "00";
                        this.outputCodeArray[this.codePointer + 5] = "D0";
                        this.outputCodeArray[this.codePointer + 6] = jumpVar.jumpVariableName;

                        this.codePointer = this.codePointer + 7;

                        this.processNodes(nextStmt.children[1]);

                        jumpVar.distance = this.codePointer - jumpVar.startPosition;

                        if (this.codePointer >= this.heapPointer) {
                            this.spaceRemaining = false;
                        }
                    } else if (nextStmt.printValue == "Print") {
                        if (/^[a-z]$/.test(nextStmt.children[0].printValue)) {
                            var vari = this.findReferencedVariable(nextStmt.children[0].printValue, this.currScope);
                            var te = this.findTempEntry(vari);

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
                            } else if (vari.variableType == "string") {
                                this.outputCodeArray[this.codePointer] = "A0";
                                this.outputCodeArray[this.codePointer + 1] = te.tempVariableName;
                                this.outputCodeArray[this.codePointer + 2] = "A2";
                                this.outputCodeArray[this.codePointer + 3] = "02";
                                this.outputCodeArray[this.codePointer + 4] = "FF";

                                this.codePointer = this.codePointer + 5;

                                if (this.codePointer >= this.heapPointer) {
                                    this.spaceRemaining = false;
                                }
                            } else if (vari.variableType == "boolean") {
                                // Handle Boolean Printing?
                            }
                        } else if (nextStmt.children[0].printValue == "+") {
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
                        } else if (nextStmt.children[0].printValue == "==") {
                            // Handle Boolean Print Literal
                        } else if (nextStmt.children[0].printValue == "!=") {
                            // Handle Boolean Print Literal
                        } else if (nextStmt.children[0].printValue.charAt(0) == '\"') {
                            this.outputCodeArray[this.heapPointer] = "00";
                            this.heapPointer = this.heapPointer - 1;

                            for (var i = nextStmt.children[0].printValue.length - 1; i > 1; i--) {
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
                    } else if (nextStmt.printValue == "Block") {
                        this.currScope = this.currScope.childrenScopes[this.currScope.scopeCounter];
                        this.processNodes(nextStmt);
                        this.currScope = this.currScope.parentScope;
                        this.currScope.scopeCounter = this.currScope.scopeCounter + 1;
                    }
                } else {
                    if (!this.spaceErrorPrinted) {
                        // OUTPUT SPACE ERROR
                        this.spaceErrorPrinted = true;
                    }
                }
            }
        };

        CodeGenerator.prototype.processIntegerSums = function (node, varEntry) {
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
                    var addedVar = this.findReferencedVariable(node.children[1].printValue, this.currScope);

                    var te = this.findTempEntry(addedVar);

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
                } else {
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
            } else {
                this.processIntegerSums(node.children[1], varEntry);
            }
        };

        CodeGenerator.prototype.processIntegerSumsNoVarStore = function (node) {
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
                    var addedVar = this.findReferencedVariable(node.children[1].printValue, this.currScope);

                    var te = this.findTempEntry(addedVar);

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
                } else {
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
            } else {
                this.processIntegerSumsNoVarStore(node.children[1]);
            }
        };

        CodeGenerator.prototype.findReferencedVariable = function (vari, sc) {
            var varFoundInScope = false;

            for (var v = 0; v < sc.variables.length; v++) {
                if (sc.variables[v].variableName == vari) {
                    varFoundInScope = true;
                    return sc.variables[v];
                }
            }
            if (!varFoundInScope) {
                return this.findReferencedVariable(vari, sc.parentScope);
            }
        };

        CodeGenerator.prototype.findTempEntry = function (variable) {
            var te;

            console.log(variable.variableName);

            for (var j = 0; j < this.tempVarTable.length; j++) {
                if (this.tempVarTable[j].variableName == variable.variableName) {
                    if (this.tempVarTable[j].scope.scopeLevel == variable.scope.scopeLevel) {
                        te = this.tempVarTable[j];
                        return te;
                    }
                }
            }
        };

        CodeGenerator.prototype.processBooleanValue = function (boolNode) {
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
            } else if (boolNode.printValue == "false") {
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
        };

        CodeGenerator.prototype.storeVariables = function () {
            for (var x = 0; x < this.tempVarTable.length; x++) {
                this.tempVarTable[x].address = this.codePointer;
                this.codePointer = this.codePointer + 1;
            }
        };

        CodeGenerator.prototype.backpatch = function () {
            for (var z = 0; z < this.outputCodeArray.length; z++) {
                var te = null;
                te = this.findTempVar(this.outputCodeArray[z]);

                var je = null;
                je = this.findJumpVar(this.outputCodeArray[z]);

                if (te != null) {
                    this.outputCodeArray[z] = te.address.toString(16).toUpperCase();
                    //this.codePointer = this.codePointer + 1;
                }

                if (je != null) {
                    this.outputCodeArray[z] = je.distance.toString(16).toUpperCase();
                    //this.codePointer = this.codePointer + 1;
                }
            }
        };

        CodeGenerator.prototype.findTempVar = function (str) {
            for (var x = 0; x < this.tempVarTable.length; x++) {
                if (str == this.tempVarTable[x].tempVariableName) {
                    return this.tempVarTable[x];
                }
            }

            return null;
        };

        CodeGenerator.prototype.findJumpVar = function (str) {
            for (var x = 0; x < this.jumpTable.length; x++) {
                if (str == this.jumpTable[x].jumpVariableName) {
                    return this.jumpTable[x];
                }
            }

            return null;
        };
        return CodeGenerator;
    })();
    TSC.CodeGenerator = CodeGenerator;
})(TSC || (TSC = {}));
