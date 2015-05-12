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
            this.heapPointer = 255;
        }
        CodeGenerator.prototype.generateCode = function () {
            for (var x = 0; x < 256; x++) {
                this.outputCodeArray[x] = "00";
            }

            this.currASTNode = this.currASTNode.children[0];
            this.processNodes(this.currASTNode);
        };

        CodeGenerator.prototype.processNodes = function (currNode) {
            for (var i = 0; i < currNode.childCount; i++) {
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
                            this.outputCodeArray[this.codePointer + 4] = "ZZ";
                        }
                    } else if (nextStmt.children[0].printValue == "string") {
                    } else if (nextStmt.children[0].printValue == "boolean") {
                    }
                } else if (nextStmt.printValue == "Assign") {
                } else if (nextStmt.printValue == "While") {
                } else if (nextStmt.printValue == "If") {
                } else if (nextStmt.printValue == "Print") {
                } else if (nextStmt.printValue == "Block") {
                }
            }
        };
        return CodeGenerator;
    })();
    TSC.CodeGenerator = CodeGenerator;
})(TSC || (TSC = {}));
