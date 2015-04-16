var TSC;
(function (TSC) {
    var Variable = (function () {
        function Variable(name, varType, lineNum) {
            this.variableName = "";
            this.variableType = "";
            this.variableValue = "";
            this.lineNumber = 0;
            this.variableUsed = false;
            this.variableInitialized = false;
            this.variableName = name;
            this.variableType = varType;
            this.lineNumber = lineNum;
        }
        return Variable;
    })();
    TSC.Variable = Variable;
})(TSC || (TSC = {}));
