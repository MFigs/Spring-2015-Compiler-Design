module TSC {

    export class Variable {

        public variableName: string = "";
        public variableType: string = "";
        public variableValue: string = "";
        public lineNumber: number = 0;
        public variableUsed: boolean = false;
        public variableInitialized: boolean = false;
        public scope: TSC.Scope = null;

        constructor(name: string, varType: string, lineNum: number, sc: TSC.Scope) {

            this.variableName = name;
            this.variableType = varType;
            this.lineNumber = lineNum;
            this.scope = sc;

        }

    }

}