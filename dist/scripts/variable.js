var TSC;
(function (TSC) {
    var Variable = (function () {
        function Variable(name, varType, lineNum, sc) {
            this.variableName = "";
            this.variableType = "";
            this.variableValue = "";
            this.lineNumber = 0;
            this.variableUsed = false;
            this.variableInitialized = false;
            this.scope = null;
            this.variableName = name;
            this.variableType = varType;
            this.lineNumber = lineNum;
            this.scope = sc;
        }
        return Variable;
    })();
    TSC.Variable = Variable;
})(TSC || (TSC = {}));
