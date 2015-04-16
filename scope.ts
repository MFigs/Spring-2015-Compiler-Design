module TSC {

    export class Scope {

        public scopeLevel: number = 0;
        public parentScope: TSC.Scope = null;
        public variables: Array<TSC.Variable>;

        constructor(scopeLev: number) {
            this.scopeLevel = scopeLev;
            this.variables = new Array<TSC.Variable>();
        }

        public addParentScope(sc: TSC.Scope) {
            this.parentScope = sc;
        }

    }

}