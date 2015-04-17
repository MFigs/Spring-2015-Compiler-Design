var TSC;
(function (TSC) {
    var Scope = (function () {
        function Scope(scopeLev) {
            this.scopeLevel = 0;
            this.parentScope = null;
            this.childrenScopes = null;
            this.isRootScope = false;
            this.scopeLevel = scopeLev;
            this.variables = new Array();
            this.childrenScopes = new Array();
        }
        Scope.prototype.addParentScope = function (sc) {
            this.parentScope = sc;
            sc.childrenScopes.push(this);
        };
        return Scope;
    })();
    TSC.Scope = Scope;
})(TSC || (TSC = {}));
