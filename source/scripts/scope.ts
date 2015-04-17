module TSC {

    export class Scope {

        public scopeLevel: number = 0;
        public parentScope: TSC.Scope = null;
        public childrenScopes: Array<TSC.Scope> = null;
        public variables: Array<TSC.Variable>;
        public isRootScope: boolean = false;

        constructor(scopeLev: number) {
            this.scopeLevel = scopeLev;
            this.variables = new Array<TSC.Variable>();
            this.childrenScopes = new Array<TSC.Scope>();
        }

        public addParentScope(sc: TSC.Scope) {
            this.parentScope = sc;
            sc.childrenScopes.push(this);
        }

    }

}