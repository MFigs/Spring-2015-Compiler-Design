var TSC;
(function (TSC) {
    var TempEntry = (function () {
        function TempEntry(varName, sc) {
            this.address = 999;
            this.tempVariableName = "t" + _TempVarCounter;
            _TempVarCounter++;
            this.variableName = varName;
            this.scope = sc;
        }
        return TempEntry;
    })();
    TSC.TempEntry = TempEntry;
})(TSC || (TSC = {}));
