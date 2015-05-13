module TSC {

    export class TempEntry {

        public tempVariableName: string;
        public variableName: string;
        public address: number = 999;
        public scope: TSC.Scope;

         constructor(varName: string, sc: TSC.Scope) {

             this.tempVariableName = "t" + _TempVarCounter;
             _TempVarCounter++;
             this.variableName = varName;
             this.scope = sc;

         }

    }

}