module TSC {

    export class CodeGenerator {

        public outputCodeArray: Array<string> = new Array<string>(256);
        public freeCodeSpace: number = 0;
        public tempVarTable: Array<TSC.TempEntry> = new Array<TSC.TempEntry>();
        public jumpTable: Array<TSC.JumpEntry> = new Array<JumpEntry>();
        public currScope: TSC.Scope = _SymbolTable;
        public currASTNode: TSC.ASTNode = _AST;
        public codePointer: number = 0;
        public heapPointer: number = 255;

        constructor() {}

        public generateCode() {

            for (var x = 0; x < 256; x++) {
                this.outputCodeArray[x] = "00";
            }

            this.currASTNode = this.currASTNode.children[0];
            this.processNodes(this.currASTNode);

        }

        public processNodes(currNode: TSC.ASTNode) {

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

                    }

                    else if (nextStmt.children[0].printValue == "string") {}
                    else if (nextStmt.children[0].printValue == "boolean") {}

                }
                else if (nextStmt.printValue == "Assign") {}
                else if (nextStmt.printValue == "While") {}
                else if (nextStmt.printValue == "If") {}
                else if (nextStmt.printValue == "Print") {}
                else if (nextStmt.printValue == "Block") {}

            }

        }

    }

}
